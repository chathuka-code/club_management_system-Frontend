import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-create-booking',
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
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css',
})
export class CreateBookingComponent implements OnInit {
  fieldId: string | null = null;
  selectedDate: string | null = null;
  startTime: string = '';
  endTime: string = '';

  constructor() {}

  private bookingService = inject(BookingService);
  private fieldService = inject(FieldService);
  private teamService = inject(TeamService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  today = new Date();
  selectedPartId: string | null = null;
  selectedPartByteCode: number | null = null;
  isOverlapping: boolean = false;
  isTimeRangeValid: boolean = false;

  bookableFields: FieldPart[] = [];
  teams: Team[] = [];
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
      this.fieldId = params.get('fieldId');
    });

    this.fieldService
      .getFieldPartsByFieldId(this.fieldId || '')
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
    console.log('Field Section 1:', this.fieldSection_01);
    console.log('Field Section 2:', this.fieldSection_02);
    console.log('Field Section 3:', this.fieldSection_03);
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
      console.log('Selected Part:', selectedPart);
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
              //convert times to comparable values
              const existingStartTime = this.timeToMinutes(
                existingBooking.startTime
              );
              const existingEndTime = this.timeToMinutes(
                existingBooking.endTime
              );
              const newStartTime = this.timeToMinutes(this.booking.startTime);
              const newEndTime = this.timeToMinutes(this.booking.endTime);

              //Check for overlap
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
          // Fetch the bytecodes for the overlapping field parts
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

  //to create a booking
  createBooking() {
    this.booking.fieldPartId = this.selectedPartId || '';

    if (
      !this.booking.bookingTitle ||
      !this.booking.fieldPartId ||
      !this.booking.startTime ||
      !this.booking.endTime ||
      !this.booking.bookingDate
    ) {
      console.error(
        'Please fill in all required fields before creating a booking.'
      );
      return;
    }

    this.bookingService.createBooking(this.booking).subscribe({
      next: (response) => {
        console.log('Booking created successfully:', response);
        this.booking = response;
        this.router.navigate([
          '/chooseClubforBooking/chooseFieldforBooking/calendar',
          this.fieldId,
        ]);
      },
      error: (error) => {
        console.error('Error creating booking:', error);
      },
    });
    console.log('Booking:', this.booking);
  }
}
