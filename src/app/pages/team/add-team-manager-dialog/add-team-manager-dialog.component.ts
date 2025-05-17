import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { User, UserService } from '../../user/user.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-add-team-manager-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatDialogModule,
  ],
  templateUrl: './add-team-manager-dialog.component.html',
  styleUrl: './add-team-manager-dialog.component.css',
})
export class AddTeamManagerDialogComponent implements OnInit {
  private userService = inject(UserService);
  private teamService = inject(TeamService);
  private dialog = inject(MatDialog);

  userData = signal<User[]>([]);
  selectedRowIds: string[] = [];
  usersEliminated: string[] = [];
  teamId: string | null = null;
  filteredUsers = signal<User[]>([]);

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((users: User[]) => {
      this.userData.set(users);
      const filtered = users.filter(
        (user) => !this.usersEliminated.includes(user.id!)
      );
      this.filteredUsers.set(filtered);
      console.log('Filtered users:', this.filteredUsers());
    });
  }

  constructor(
    public dialogRef: MatDialogRef<AddTeamManagerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.usersEliminated) {
      this.usersEliminated = [...data.usersEliminated];
    }
    this.teamId = data.teamId;
    console.log('eliminated users:', this.usersEliminated);
  }

  toggleUserSelection(userId: string) {
    const index = this.selectedRowIds.indexOf(userId);
    if (index === -1) {
      this.selectedRowIds.push(userId);
    } else {
      this.selectedRowIds.splice(index, 1);
    }
    console.log('selected ids', this.selectedRowIds);
  }

  onSave() {
    if (this.selectedRowIds.length > 0) {
      this.teamService
        .addTeamManagers(this.teamId || '', this.selectedRowIds)
        .subscribe((response) => {
          console.log('Team managers added successfully:', response);
          this.dialogRef.close(true);
        });
    } else {
      console.log('No users selected');
      this.dialogRef.close(false);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
