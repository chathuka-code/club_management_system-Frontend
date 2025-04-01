import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // For user feedback
import { Router } from '@angular/router';
import { catchError, forkJoin, map, Observable, tap, throwError } from 'rxjs';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isSuperAdmin: boolean;
  isDeleted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar); // For showing notifications
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/users';
  private clubAdminApiUrl = 'http://localhost:3000/user_clubs';
  private teamManagerApiUrl = 'http://localhost:3000/user_teams';
  private fieldAdminApiUrl = 'http://localhost:3000/user_fields';

  //for fetching users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users) => users.filter((user) => !user.isDeleted)),
      catchError((err) => {
        console.error('Error fetching users:', err);
        this.snackBar.open('Failed to fetch users', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return throwError(() => err); // Re-throw the error
      })
    );
  }
  
  //for creating a user
  createUser(
    user: User,
    clubAdmins: any[],
    teamManagers: any[],
    fieldAdmins: any[]
  ) {
    this.http.post(this.apiUrl, user).subscribe({
      next: (response: any) => {
        console.log('User created successfully:', response);
        if (clubAdmins.length > 0) {
          clubAdmins.forEach((clubAdmin) => {
            this.http
              .post(this.clubAdminApiUrl, {
                userId: response.id,
                clubId: clubAdmin.clubId,
              })
              .subscribe({
                next: () => console.log('Club admin assigned successfully'),
                error: (err) =>
                  console.error('Error assigning club admin:', err),
              });
          });
        }
        if (teamManagers.length > 0) {
          teamManagers.forEach((teamManager) => {
            this.http
              .post(this.teamManagerApiUrl, {
                userId: response.id,
                teamId: teamManager.teamId,
              })
              .subscribe({
                next: () => console.log('Team manager assigned successfully'),
                error: (err) =>
                  console.error('Error assigning team manager:', err),
              });
          });
        }
        if (fieldAdmins.length > 0) {
          fieldAdmins.forEach((fieldAdmin) => {
            this.http
              .post(this.fieldAdminApiUrl, {
                userId: response.id,
                fieldId: fieldAdmin.fieldId,
              })
              .subscribe({
                next: () => console.log('Field admin assigned successfully'),
                error: (err) =>
                  console.error('Error assigning field admin:', err),
              });
          });
        }
        this.snackBar.open('User created successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.snackBar.open('Failed to create user', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
