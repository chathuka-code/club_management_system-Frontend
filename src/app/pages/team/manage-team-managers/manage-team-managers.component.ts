import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../../components/table/table.component';
import { TableColumn } from '../../../components/table/table.component';
import { TeamService } from '../team.service';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddTeamManagerDialogComponent } from '../add-team-manager-dialog/add-team-manager-dialog.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-manage-team-managers',
  standalone: true,
  imports: [CommonModule, TableComponent, MatButtonModule, FormsModule],
  templateUrl: './manage-team-managers.component.html',
  styleUrl: './manage-team-managers.component.css',
})
export class ManageTeamManagersComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private teamService = inject(TeamService);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  teamId: string | null = null;
  selectedRowIds: string[] = [];
  userData = signal<any[]>([]);
  currentRole: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.teamId = params.get('teamId');
      console.log('Received teamId:', this.teamId);
    });

    this.teamId &&
      this.teamService
        .getTeamManagers(this.teamId)
        .subscribe((users: any[]) => {
          this.userData.set(users);
        });

    this.authService.currentRole$.subscribe((role) => {
      this.currentRole = role?.type || '';
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

  openUsersDialog(): void {
    const dialogRef = this.dialog.open(AddTeamManagerDialogComponent, {
      data: {
        usersEliminated: this.userData().map((user) => user.id),
        teamId: this.teamId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teamId &&
          this.teamService
            .getTeamManagers(this.teamId)
            .subscribe((users: any[]) => {
              this.userData.set(users);
            });
      } else {
        console.log('Dialog was canceled');
      }
    });
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
        if (this.selectedRowIds.length > 0 && this.teamId) {
          this.teamService
            .deleteTeamManagers(this.selectedRowIds, this.teamId)
            .subscribe((response) => {
              console.log('Deleted users:', response);
              this.userData.set(
                this.userData().filter(
                  (user) => !this.selectedRowIds.includes(user.id)
                )
              );
            });
        } else {
          console.log('No users selected for deletion or no team ID');
        }
      }
    });
  }
}
