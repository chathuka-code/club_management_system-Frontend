import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserRolesDialogComponent } from '../user-roles-dialog/user-roles-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    MatCheckboxModule,
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  isEmailValid: boolean = false; // Flag to check if email is valid
  isPasswordValid: boolean = false; // Flag to check if password is valid

  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isSuperAdmin: false,
    isDeleted: false,
  };

  clubAdmins: any[] = []; // Array to hold club admins
  teamManagers: any[] = []; // Array to hold team managers
  fieldAdmins: any[] = []; // Array to hold field admins

  openRolesDialog(): void {
    const dialogRef = this.dialog.open(UserRolesDialogComponent, {
      data: {
        roles: ['Admin', 'User', 'Manager', 'Editor'], // Example roles
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Check if result exists (user clicked Save)
        console.log('Dialog closed with data:', result);

        // Access the specific data properties
        this.clubAdmins = result.clubAdmins;
        this.teamManagers = result.teamManagers;
        this.fieldAdmins = result.fieldAdmins;

        // Do something with the data
        this.processRoleAssignments(
          this.clubAdmins,
          this.teamManagers,
          this.fieldAdmins
        );
      } else {
        console.log('Dialog was canceled');
      }
    });
  }

  private processRoleAssignments(
    clubAdmins: any[],
    teamManagers: any[],
    fieldAdmins: any[]
  ) {
    console.log('Received club admins:', clubAdmins);
    console.log('Received team managers:', teamManagers);
    console.log('Received field admins:', fieldAdmins);
  }

  createUser() {
    if (
      !this.user.firstName ||
      !this.user.lastName ||
      !this.user.email ||
      !this.user.password
    ) {
      this.snackBar.open(
        'First name, last name, and email are required!',
        'Close',
        {
          duration: 3000,
        }
      );
      return;
    }
    if (!this.isEmailValid) {
      this.snackBar.open('Please enter a valid email address!', 'Close', {
        duration: 3000,
      });
      return;
    }
    if (!this.isPasswordValid) {
      this.snackBar.open('Please enter a valid password!', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.userService.createUser(
      this.user,
      this.clubAdmins,
      this.teamManagers,
      this.fieldAdmins
    );
  }
}
