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
    MatCheckboxModule
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isSuperAdmin: false,
    isDeleted: false,
  };

  openRolesDialog(): void {
    const dialogRef = this.dialog.open(UserRolesDialogComponent, {
      data: {
        roles: ['Admin', 'User', 'Manager', 'Editor'], // Example roles
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Selected roles:', result);
      }
    });
  }

  createUser() {
    console.log('User Data:', this.user);
    this.userService.createUser(this.user);
  }
}
