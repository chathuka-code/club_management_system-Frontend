import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface LoginResponse {
  token: string;
  isSuperAdmin: boolean;
  roles: {
    clubAdmins: { Id: string; ClubName: string }[];
    teamManagers: { Id: string; TeamName: string }[];
    fieldAdmins: { Id: string; FieldName: string }[];
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.email && this.password) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      
      this.authService.login(this.email, this.password).subscribe({
        next: (response: LoginResponse) => {
          // Store token and user data
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('is_super_admin', String(response.isSuperAdmin));
          
          // Store roles in a more accessible format
          const userRoles = {
            clubAdmins: response.roles.clubAdmins,
            teamManagers: response.roles.teamManagers,
            fieldAdmins: response.roles.fieldAdmins
          };
          localStorage.setItem('user_roles', JSON.stringify(userRoles));
          
          this.isLoading.set(false);
          
          // Redirect based on user role or to default page
          this.redirectAfterLogin(response);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Login failed. Please try again.');
        }
      });
    }
  }

  private redirectAfterLogin(response: LoginResponse): void {
    console.log('redirectAfterLogin');
    // Example: Redirect super admins to admin dashboard
    // if (response.isSuperAdmin) {
    //   this.router.navigate(['/admin/dashboard']);
    //   return;
    // }
    
    // // Example: Redirect users with club admin roles to club dashboard
    // if (response.roles.clubAdmins.length > 0) {
    //   this.router.navigate(['/club/dashboard']);
    //   return;
    // }
    
    // Default redirect
    this.router.navigate(['/clubs']);
  }
}