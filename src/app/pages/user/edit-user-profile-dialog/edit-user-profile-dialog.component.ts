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
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private snackBar = inject(MatSnackBar);

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  isSuperAdmin: boolean = false;
  isDeleted: boolean = false;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
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

  saveProfile() {
    if (!this.firstName || !this.lastName) {
      this.snackBar.open('First name and last name are required!', 'Close', {
        duration: 3000,
      });
      return;
    }

    const isPasswordChanging =
      this.currentPassword?.length > 0 ||
      this.newPassword?.length > 0 ||
      this.confirmPassword?.length > 0;

    if (isPasswordChanging) {
      if (!this.currentPassword) {
        this.snackBar.open('Enter the existing password!', 'Close', {
          duration: 3000,
        });
        return;
      }

      this.userService
        .checkPassword(this.userId, this.currentPassword)
        .subscribe({
          next: (response) => {
            if (!response) {
              this.snackBar.open('Incorrect Password!', 'Close', {
                duration: 3000,
              });
              return;
            }

            // Password matches, now check new password fields
            if (!this.newPassword || !this.confirmPassword) {
              this.snackBar.open(
                'Can not proceed with the password change. Form Incomplete!',
                'Close',
                { duration: 3000 }
              );
              return;
            }

            if (this.newPassword !== this.confirmPassword) {
              this.snackBar.open(
                'New Password and Confirm Password do not match!',
                'Close',
                { duration: 3000 }
              );
              return;
            }

            if (this.newPassword.length < 8) {
              this.snackBar.open(
                'Password must be at least 8 characters long!',
                'Close',
                { duration: 3000 }
              );
              return;
            }

            // Everything is valid, update with password
            const updatedUser: any = {
              id: this.userId,
              firstName: this.firstName,
              lastName: this.lastName,
              email: this.email,
              password: this.newPassword,
              isDeleted: this.isDeleted,
            };

            this.userService
              .updateUserProfile(this.userId, updatedUser)
              .subscribe({
                next: (response) => {
                  console.log('Profile updated successfully:', response);
                  this.dialogRef.close();
                },
                error: (error) => {
                  console.error('Error updating profile:', error);
                },
              });
          },
          error: (error) => {
            console.error('Error checking password:', error);
          },
        });
    } else {
      // No password change, update only profile info
      const updatedUser: any = {
        id: this.userId,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        isDeleted: this.isDeleted,
      };

      this.userService.updateUserProfile(this.userId, updatedUser).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        },
      });
    }
  }
}
