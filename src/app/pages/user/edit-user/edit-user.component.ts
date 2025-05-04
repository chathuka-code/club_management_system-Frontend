import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { UserService, User, RemoveRolesRequest } from '../user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { EditUserRolesDialogComponent } from '../edit-user-roles-dialog/edit-user-roles-dialog.component';

@Component({
  selector: 'app-edit-user',
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
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  userId: string | null = null;
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isSuperAdmin: false,
    isDeleted: false,
  };

  clubAdmins = signal<{ clubId: string; clubName: string }[]>([]); // Array to hold club admins
  teamManagers = signal<{ teamId: string; teamName: string }[]>([]); // Array to hold team managers
  fieldAdmins = signal<{ fieldId: string; fieldName: string }[]>([]); // Array to hold field admins

  // Deletion tracking
  deletedClubAdmins = signal<string[]>([]);
  deletedTeamManagers = signal<string[]>([]);
  deletedFieldAdmins = signal<string[]>([]);
  roles: any;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId');
      console.log('Received userId:', this.userId);
    });

    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe((user) => {
        this.user = user;
      });
      this.userService.getUserRoles(this.userId).subscribe((roles) => {
        this.roles = roles;

        console.log('Received roles:', this.roles);
      });
    } else {
      console.error('userId is null');
    }
  }

  saveUser() {
    this.userService
      .updateUser(this.userId!, this.user, {
        clubIds: this.deletedClubAdmins(),
        teamIds: this.deletedTeamManagers(),
        fieldIds: this.deletedFieldAdmins(),
      })
      .subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          this.router.navigate(['/users']);
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    // Check if any roles were assigned
    if (
      this.clubAdmins().length > 0 ||
      this.teamManagers().length > 0 ||
      this.fieldAdmins().length > 0
    ) {
      this.userService
        .createRoles(this.userId!, {
          clubAdmins: this.clubAdmins().map((admin) => ({
            clubId: admin.clubId,
          })),
          teamManagers: this.teamManagers().map((manager) => ({
            teamId: manager.teamId,
          })),
          fieldAdmins: this.fieldAdmins().map((admin) => ({
            fieldId: admin.fieldId,
          })),
        })
        .subscribe();
    }
    this.router.navigate(['/users']);
  }

  openRolesDialog(): void {
    const dialogRef = this.dialog.open(EditUserRolesDialogComponent, {
      data: {
        roles: this.roles, // Pass the roles data to the dialog
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Check if result exists (user clicked Save)
        console.log('Dialog closed with data:', result);

        this.clubAdmins.set(result.clubAdmins);
        this.teamManagers.set(result.teamManagers);
        this.fieldAdmins.set(result.fieldAdmins);
        this.deletedClubAdmins.set(result.deletedClubAdmins);
        this.deletedTeamManagers.set(result.deletedTeamManagers);
        this.deletedFieldAdmins.set(result.deletedFieldAdmins);
      }
    });
  }
}
