import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BookingService, Booking } from '../booking.service';
import { Team, TeamService } from '../../team/team.service';
import { FieldService, FieldPart } from '../../field/field.service';
import { catchError, of, timeout } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-edit-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-booking.component.html',
  styleUrl: './edit-booking.component.css',
})
export class EditBookingComponent implements OnInit {
  fieldId: string | null = null;
  bookingId: string | null = null;

  selectedDate: string | null = null;
  startTime: string = '';
  endTime: string = '';

  constructor() {}

  private bookingService = inject(BookingService);
  private fieldService = inject(FieldService);
  private authService = inject(AuthService);
  private teamService = inject(TeamService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  today = new Date();
  selectedPartId: string | null = null;
  selectedPartByteCode: number | null = null;
  isOverlapping: boolean = false;
  isTimeRangeValid: boolean = true;
  isBookingOwned: Boolean = false;
  currentRole: string = '';
  idUser: string = '';

  bookableFields: FieldPart[] = [];
  teams: any[] = [];
  fieldSection_01: FieldPart[] = [];
  fieldSection_02: FieldPart[] = [];
  fieldSection_03: FieldPart[] = [];

  booking: Booking = {
    bookingTitle: '',
    fieldPartId: '',
    teamId: '',
    userId: '',
    bookingStatus: false,
    startTime: '',
    endTime: '',
    bookingDate: null,
    description: '',
    isDeleted: false,
  };

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.bookingId = params.get('bookingId');
    });

    this.bookingService
      .getBookingById(this.bookingId || '')
      .subscribe((booking: Booking) => {
        this.booking = booking;
        this.selectedPartId = booking.fieldPartId;
        this.fieldId = booking['fieldId'];

        this.selectedDate = booking.bookingDate
          ? this.convertToLocalISO(new Date(booking.bookingDate).toString())
          : null;

        this.startTime = booking.startTime;
        this.endTime = booking.endTime;
        this.fieldService
          .getFieldPartsByFieldId(this.fieldId || '') //consider
          .pipe(
            timeout(5000),
            catchError((error) => {
              console.error('Error fetching field parts:', error);

              return of([]);
            })
          )
          .subscribe({
            next: (response) => {
              this.bookableFields = response;
              console.log('Bookable fields:', this.bookableFields);
              this.separateBookableFieldsIntoSections(); //call the method to separate fields into sections
            },
          });
        this.bookingService.getBookingOwnership(booking).subscribe({
          next: (response) => {
            console.log('Booking ownership:', response);
            this.isBookingOwned = response;
          },
        });
      });

    this.authService.currentRole$.subscribe((role) => {
      this.currentRole = role?.type || '';
      this.idUser = role?.id || '';

      if (this.currentRole === 'super-admin') {
        this.teamService.getAllTeamsEntire().subscribe((teams) => {
          this.teams = teams.map((team) => ({
            name: team.teamName,
            id: team['id'],
          }));
          console.log('Teams:', teams);
        });
      } else if (this.currentRole === 'club-admin') {
        this.teamService.getAllTeams(this.idUser).subscribe((teams) => {
          this.teams = teams.map((team) => ({
            name: team.teamName,
            id: team['id'],
          }));
          console.log('Teams:', teams);
        });
      } else if (this.currentRole === 'team-manager') {
        this.teamService.getTeamById(this.idUser).subscribe((team: Team) => {
          this.teams = [
            {
              name: team.teamName,
              id: team['id'],
            },
          ];
          console.log('Teams:', this.teams);
        });
      }
    });

    const date = this.convertFromLocalISO('2025-04-10');
    console.log('converted date:', date);
  }

  //seperate bookable fields into sections
  separateBookableFieldsIntoSections(): void {
    this.bookableFields.forEach((field) => {
      if (
        field.byteCode === 1 ||
        field.byteCode === 2 ||
        field.byteCode === 4 ||
        field.byteCode === 8
      ) {
        this.fieldSection_01.push(field);
      } else if (field.byteCode === 3 || field.byteCode === 12) {
        this.fieldSection_02.push(field);
      } else {
        this.fieldSection_03.push(field);
      }
    });

    // Find the selected field part across sections
    const sections = [
      this.fieldSection_01,
      this.fieldSection_02,
      this.fieldSection_03,
    ];
    let selectedField: any;

    // Check sections in order with bracket notation
    selectedField =
      sections[0].find((part) => part['id'] === this.selectedPartId) ||
      sections[1].find((part) => part['id'] === this.selectedPartId) ||
      sections[2].find((part) => part['id'] === this.selectedPartId);

    if (selectedField) {
      selectedField['isSelected'] = true; // Using bracket notation here too
    } else {
      console.log('print', selectedField);
    }
  }

  resetStates(): void {
    this.selectedPartId = null;
    this.selectedPartByteCode = null;
    this.isOverlapping = false;
    this.booking = {
      fieldPartId: '',
      teamId: '',
      userId: '',
      bookingStatus: false,
      startTime: '',
      endTime: '',
      bookingDate: null,
      isDeleted: false,
    };
  }

  //toggle selection of field parts
  toggleSelection(selectedPart: FieldPart): void {
    // If the selected part is already selected, deselect it
    if (selectedPart.isSelected) {
      selectedPart.isSelected = false;
      this.selectedPartId = null;
      this.selectedPartByteCode = null;
    } else {
      // Clear all other selections
      this.clearAllSelections();

      // Select the current part
      selectedPart.isSelected = true;
      this.selectedPartId = selectedPart['id'];
      this.selectedPartByteCode = selectedPart.byteCode;
    }
    this.booking.startTime = '';
    this.booking.endTime = '';
    this.booking.bookingDate = null;
    this.isOverlapping = false;
    this.isTimeRangeValid = false;
  }

  //clear all selections
  private clearAllSelections(): void {
    const clear = (parts: FieldPart[]) =>
      parts.forEach((p) => (p.isSelected = false));

    clear(this.fieldSection_01);
    clear(this.fieldSection_02);
    clear(this.fieldSection_03);
  }

  //add to BookingInfoDialogComponent class
  getFilteredParts(parts: FieldPart[], codes: number[]): FieldPart[] {
    return parts.filter((part) => codes.includes(part.byteCode));
  }

  //executes on value changes

  onDateChange(event: any) {
    this.booking.startTime = '';
    this.booking.endTime = '';
    const selectedDate = event.value;
    this.booking.bookingDate = this.convertToLocalISO(selectedDate);
    this.isTimeRangeValid = this.timeRangeValidation();
    this.validateBooking();
    console.log('Date changed:', this.booking.bookingDate);
  }

  onStartTimeChange(event: any) {
    this.isTimeRangeValid = this.timeRangeValidation();
    this.validateBooking();
    console.log('Start time changed:', this.booking.startTime);
  }

  onEndTimeChange(event: any) {
    this.isTimeRangeValid = this.timeRangeValidation();
    this.validateBooking();
    console.log('End time changed:', this.booking.endTime);
  }

  //time range validation
  timeRangeValidation(): boolean {
    if (!this.booking.startTime || !this.booking.endTime) {
      return false;
    }
    const startTime = this.booking.startTime.split(':').map(Number);
    const endTime = this.booking.endTime.split(':').map(Number);

    if (startTime.length !== 2 || endTime.length !== 2) {
      return false;
    }

    const startMinutes = startTime[0] * 60 + startTime[1];
    const endMinutes = endTime[0] * 60 + endTime[1];

    return endMinutes > startMinutes && endMinutes - startMinutes >= 15;
  }

  convertToLocalISO(dateString: string): string {
    const date = new Date(dateString);

    // Get local date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  convertFromLocalISO(isoDate: string): string {
    const [year, month, day] = isoDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    // Format date components without timezone info
    const weekday = date.toLocaleString('en-US', { weekday: 'short' });
    const monthName = date.toLocaleString('en-US', { month: 'short' });
    const timeString = date
      .toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      .replace(/ /g, ''); // Remove spaces in time

    // Calculate timezone offset
    const offset = date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const offsetSign = offset <= 0 ? '+' : '-';

    return `${weekday} ${monthName} ${day} ${year} ${timeString} GMT${offsetSign}${padZero(
      offsetHours
    )}:${padZero(offsetMinutes)}`;

    function padZero(num: number): string {
      return num.toString().padStart(2, '0');
    }
  }
  //for booking validation
  validateBooking() {
    console.log(
      'datee:',
      this.booking.bookingDate
        ? this.booking.bookingDate
        : 'No booking date selected'
    );
    this.bookingService
      .getBookingsByDateAndField(
        this.booking.bookingDate ? this.booking.bookingDate : '',
        this.fieldId || ''
      )
      .subscribe({
        next: (response) => {
          console.log('Bookings:', response);
          //filter fieldPartIds based on time overlap
          const overlappingFieldPartIds = response
            .filter((existingBooking) => {
              // Only consider bookings with status "Approved"
              if (existingBooking.bookingStatus !== 'Approved') {
                return false;
              }

              // Convert times to comparable values
              const existingStartTime = this.timeToMinutes(
                existingBooking.startTime
              );
              const existingEndTime = this.timeToMinutes(
                existingBooking.endTime
              );
              const newStartTime = this.timeToMinutes(this.booking.startTime);
              const newEndTime = this.timeToMinutes(this.booking.endTime);

              // Check for overlap
              return (
                newStartTime < existingEndTime && newEndTime > existingStartTime
              );
            })
            .map((booking) => booking.fieldPartId);

          console.log('Overlapping fieldPartIds:', overlappingFieldPartIds);
          if (overlappingFieldPartIds.length === 0) {
            this.isOverlapping = false;
            return;
          }
          this.fieldService
            .getFieldPartsByIds(overlappingFieldPartIds)
            .subscribe({
              next: (bytecodes) => {
                const overlappingByteCodes = bytecodes || [];
                console.log('Overlapping bytecodes:', overlappingByteCodes);
                if (overlappingByteCodes.length === 0) {
                  this.isOverlapping = false;
                  return;
                }
                // Check if the selected part's bytecode overlaps with any of the overlapping bytecodes
                for (const byteCode of overlappingByteCodes) {
                  if ((byteCode & (this.selectedPartByteCode || 0)) > 0) {
                    this.isOverlapping = true;
                    break;
                  } else {
                    this.isOverlapping = false;
                  }
                }

                console.log('Is overlapping:', this.isOverlapping);
              },
            });
        },
      });
    console.log('Is overlapping:', this.isOverlapping);
  }

  //function to convert time string to minutes from start of day
  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  //for updating booking
  updateBooking() {
    this.booking.fieldPartId = this.selectedPartId || '';

    console.log('Booking before update:', this.booking);
    this.bookingService
      .updateBooking(this.bookingId || '', this.booking)
      .subscribe({
        next: (response) => {
          console.log('Booking updated successfully:', response);
          this.router.navigate([
            '/chooseClubforBooking/chooseFieldforBooking/calendar',
            this.fieldId || '', //consider
          ]);
        },
        error: (error) => {
          console.error('Error updating booking:', error);
        },
      });
  }

  //for approving booking
  approveBooking() {
    this.validateBooking;
    if (!this.isOverlapping) {
      this.bookingService.approveBooking(this.bookingId || '').subscribe({
        next: (response) => {
          console.log('Booking approved successfully:', response);
          this.router.navigate([
            '/chooseClubforBooking/chooseFieldforBooking/calendar',
            this.fieldId || '',
          ]);
        },
        error: (error) => {
          console.error('Error approving booking:', error);
        },
      });
    } else {
      this.snackBar.open('Failed to approve booking', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  //for deleteing booking
  deleteBooking() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this booking?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User confirmed - proceed with deletion
        this.bookingService
          .deleteBooking(this.bookingId || '')
          .subscribe(() => {
            // Handle successful deletion (e.g., navigation or refresh)
            this.router.navigate([
              '/chooseClubforBooking/chooseFieldforBooking/calendar',
              this.fieldId || '',
            ]);
          });
      }
    });
  }
}
