import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../../components/table/table.component';
import { TableColumn } from '../../../components/table/table.component';
import { FieldService } from '../field.service';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-field-admins',
  standalone: true,
  imports: [CommonModule, TableComponent, MatButtonModule, FormsModule],
  templateUrl: './manage-field-admins.component.html',
  styleUrl: './manage-field-admins.component.css',
})
export class ManageFieldAdminsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fieldService = inject(FieldService);
  private dialog = inject(MatDialog);

  fieldId: string | null = null;
  selectedRowIds: string[] = [];
  userData = signal<any[]>([]);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.fieldId = params.get('fieldId');
      console.log('Received fieldId:', this.fieldId);
    });

    this.fieldId &&
      this.fieldService
        .getFieldAdmins(this.fieldId)
        .subscribe((users: any[]) => {
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
        if (this.selectedRowIds.length > 0 && this.fieldId) {
          this.fieldService
            .deleteFieldAdmins(this.selectedRowIds, this.fieldId)
            .subscribe((response) => {
              console.log('Deleted users:', response);
              this.userData.set(
                this.userData().filter(
                  (user) => !this.selectedRowIds.includes(user.id)
                )
              );
            });
        } else {
          console.log('No users selected for deletion or no field ID');
        }
      }
    });
  }
}
