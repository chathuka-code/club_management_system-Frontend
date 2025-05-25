import { Component, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TableColumn } from '../../../components/table/table.component';
import { ClubService, Club } from '../club.service';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-club-list',
  standalone: true,
  imports: [TableComponent, MatButtonModule, CommonModule],
  templateUrl: './club-list.component.html',
  styleUrl: './club-list.component.css',
})
export class ClubListComponent implements OnInit {
  isSuperAdmin: boolean = false;
  constructor(private router: Router) {
    this.isSuperAdmin = localStorage.getItem('is_super_admin') === 'true';
  }
  private dialog = inject(MatDialog);

  private clubService = inject(ClubService);
  userData = signal<Club[]>([]);
  selectedRowIds: string[] = [];

  ngOnInit(): void {
    this.clubService.getAllClubs().subscribe((clubs: Club[]) => {
      this.userData.set(clubs);
    });
  }

  userColumns: TableColumn[] = [
    { key: 'clubName', label: 'Club Name' },
    { key: 'countryCode', label: 'Country Code' },
    { key: 'activatedStatus', label: 'Activated Status' },
    { key: 'description', label: 'Description' },
  ];

  navigateToCreateClub() {
    this.router.navigate(['/clubs/createClub']);
  }

  handleSelectedRows(selectedRows: any[]) {
    this.selectedRowIds = selectedRows.map((row) => row.id);
  }

  deleteClubs() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete these clubs?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.clubService.deleteClub(this.selectedRowIds).subscribe(() => {
          this.clubService.getAllClubs().subscribe((clubs: Club[]) => {
            this.userData.set(clubs);
          });
        });
      }
    });
  }

  handleEdit(clubId: string) {
    this.router.navigate(['/clubs/editClub', clubId]);
  }
}
