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
import { ClubService } from '../club.service';

@Component({
  selector: 'app-add-club-admin-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatDialogModule,
  ],
  templateUrl: './add-club-admin-dialog.component.html',
  styleUrl: './add-club-admin-dialog.component.css',
})
export class AddClubAdminDialogComponent implements OnInit {
  private userService = inject(UserService);
  private clubService = inject(ClubService);

  private dialog = inject(MatDialog);

  userData = signal<User[]>([]);
  selectedRowIds: string[] = [];
  usersEliminated: string[] = [];
  clubId: string | null = null;
  filteredUsers = signal<User[]>([]);

  ngOnInit(): void {
    // Fetch all users
    this.userService.getAllUsers().subscribe((users: User[]) => {
      this.userData.set(users);
      // Filter out eliminated users
      const filtered = users.filter(
        (user) => !this.usersEliminated.includes(user.id!)
      );
      this.filteredUsers.set(filtered);
      console.log('Filtered users:', this.filteredUsers());
    });
  }

  constructor(
    public dialogRef: MatDialogRef<AddClubAdminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.usersEliminated) {
      this.usersEliminated = [...data.usersEliminated];
    }
    this.clubId = data.clubId;
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
      this.clubService
        .addClubAdmins(this.clubId || '', this.selectedRowIds)
        .subscribe((response) => {
          console.log('Club admins added successfully:', response);
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
