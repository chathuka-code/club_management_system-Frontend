import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AuthService } from '../../pages/auth/auth.service';
import { UserService } from '../../pages/user/user.service';
import { Router } from '@angular/router';

export interface RoleOption {
  value: string;
  display: string;
  type:
    | 'super-admin'
    | 'club-admin'
    | 'team-manager'
    | 'field-admin'
    | 'individual-user';
  id?: string | null;
  name?: string | null;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  roleOptions: RoleOption[] = [];
  selectedRole: RoleOption | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.initializeRoles();
  }

  private initializeRoles() {
    // Get individual items from localStorage
    const token = localStorage.getItem('token');
    const isSuperAdmin = localStorage.getItem('is_super_admin') === 'true';
    const roles = JSON.parse(localStorage.getItem('user_roles') || '{}');
    console.log('Roles:', roles);
    // Add Super Admin option if applicable
    if (isSuperAdmin) {
      this.roleOptions.push({
        value: 'super-admin',
        display: 'Super Admin',
        type: 'super-admin',
      });
    }

    // Add Club Admin roles
    if (roles.clubAdmins) {
      roles.clubAdmins.forEach((club: any) => {
        this.roleOptions.push({
          value: `club-${club.id}`,
          display: `Club Admin - ${club.clubName}`,
          type: 'club-admin',
          id: club.id,
          name: club.clubName,
        });
      });
    }

    // Add Team Manager roles
    if (roles.teamManagers) {
      roles.teamManagers.forEach((team: any) => {
        this.roleOptions.push({
          value: `team-${team.id}`,
          display: `Team Manager - ${team.teamName}`,
          type: 'team-manager',
          id: team.id,
          name: team.teamName,
        });
      });
    }

    // Add Field Admin roles (if any)
    if (roles.fieldAdmins) {
      roles.fieldAdmins.forEach((field: any) => {
        this.roleOptions.push({
          value: `field-${field.id}`,
          display: `Field Admin - ${field.fieldName}`,
          type: 'field-admin',
          id: field.id,
          name: field.fieldName,
        });
      });
    }

    // Add Individual User option
    this.roleOptions.push({
      value: 'individual-user',
      display: 'Individual User',
      type: 'individual-user',
      id: null,
      name: null,
    });

    // Set initial selected role (first available)
    if (this.roleOptions.length > 0) {
      this.selectedRole = this.roleOptions[0];
      this.userService
        .updateUserActiveRole(
          localStorage.getItem('user_id')!,
          this.selectedRole.type ?? null,
          this.selectedRole.id ?? null
        )
        .subscribe((response) => {
          console.log('User role updated successfully:', response);
        });
      // Store initial role selection
      this.authService.setCurrentRole(this.selectedRole);
    }
  }

  onRoleChange(selectedValue: string) {
    this.selectedRole =
      this.roleOptions.find((opt) => opt.value === selectedValue) || null;

    if (this.selectedRole) {
      this.authService.setCurrentRole(this.selectedRole);
      this.userService
        .updateUserActiveRole(
          localStorage.getItem('user_id')!,
          this.selectedRole.type ?? null,
          this.selectedRole.id ?? null
        )
        .subscribe((response) => {
          console.log('User role updated successfully:', response);
        });
        if (this.selectedRole.type === 'super-admin') {
          this.router.navigate(['/users']);
        } else if (this.selectedRole.type === 'club-admin') {
          this.router.navigate(['/clubs']);
        } else {
          this.router.navigate(['/chooseClubforBooking']);
        }
      console.log('Role changed to:', this.selectedRole);
    }
  }
}
