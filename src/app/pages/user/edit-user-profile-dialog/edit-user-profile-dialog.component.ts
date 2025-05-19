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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-user-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatDialogModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './edit-user-profile-dialog.component.html',
  styleUrl: './edit-user-profile-dialog.component.css',
})
export class EditUserProfileDialogComponent implements OnInit {
  private userService = inject(UserService);

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  isSuperAdmin: boolean = false;
  isDeleted: boolean = false;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isPasswordCorrect: boolean = false;
  userId = '';

  constructor(
    public dialogRef: MatDialogRef<EditUserProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('user_id') || '';
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe((user) => {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.isSuperAdmin = user.isSuperAdmin;
        this.isDeleted = user.isDeleted;
      });
    }
  }

  checkPassword() {
    this.userService
      .checkPassword(this.userId, this.currentPassword)
      .subscribe({
        next: (response) => {
          this.isPasswordCorrect = response;
        },
        error: (error) => {
          console.error('Error checking password:', error);
        },
      });
  }

  saveProfile() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const updatedUser: any = {
      id: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.newPassword,
      isDeleted: this.isDeleted,
    };

    this.userService.updateUserProfile(this.userId, updatedUser).subscribe({
      next: (response) => {
        console.log('Profile updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
      },
    });

    this.dialogRef.close();
  }
}
