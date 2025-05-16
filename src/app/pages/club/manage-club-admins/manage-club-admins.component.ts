import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../../components/table/table.component';
import { TableColumn } from '../../../components/table/table.component';
import { ClubService } from '../club.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-manage-club-admins',
  standalone: true,
  imports: [CommonModule, TableComponent, MatButtonModule, FormsModule],
  templateUrl: './manage-club-admins.component.html',
  styleUrl: './manage-club-admins.component.css',
})
export class ManageClubAdminsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clubService = inject(ClubService);
  private dialog = inject(MatDialog);

  clubId: string | null = null;
  selectedRowIds: string[] = [];
  userData = signal<any[]>([]);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.clubId = params.get('clubId');
      console.log('Received clubId:', this.clubId);
    });

    this.clubId &&
      this.clubService.getClubAdmins(this.clubId).subscribe((users: any[]) => {
        this.userData.set(users);
      });
  }

  userColumns: TableColumn[] = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
  ];

  handleSelectedRows(selectedRows: any[]) {
    this.selectedRowIds = selectedRows.map((row) => row.id);
    console.log('Selected rows:', this.selectedRowIds);
  }

  handleDelete() {
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
        if (this.selectedRowIds.length > 0 && this.clubId) {
          this.clubService
            .deleteClubAdmins(this.selectedRowIds, this.clubId)
            .subscribe((response) => {
              console.log('Deleted users:', response);
              this.userData.set(
                this.userData().filter(
                  (user) => !this.selectedRowIds.includes(user.id)
                )
              );
            });
        } else {
          console.log('No users selected for deletion or no club ID');
        }
      }
    });
  }
}
