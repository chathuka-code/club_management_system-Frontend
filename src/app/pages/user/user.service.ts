import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // For user feedback
import { Router } from '@angular/router';
import {
  catchError,
  concatMap,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isSuperAdmin: boolean;
  isDeleted: boolean;
}

interface ClubAdminRoleDto {
  clubId: string;
}

interface TeamManagerRoleDto {
  teamId: string;
}

interface FieldAdminRoleDto {
  fieldId: string;
}

interface AddRolesRequest {
  clubAdmins: ClubAdminRoleDto[];
  teamManagers: TeamManagerRoleDto[];
  fieldAdmins: FieldAdminRoleDto[];
}

export interface RemoveRolesRequest {
  clubIds: string[];
  teamIds: string[];
  fieldIds: string[];
}

//for getting user roles by user ID
interface ClubRoleDto {
  clubId: string;
  clubName: string;
}

interface TeamRoleDto {
  teamId: string;
  teamName: string;
}

interface FieldRoleDto {
  fieldId: string;
  fieldName: string;
}

interface UserRolesResponse {
  clubAdmins: ClubRoleDto[];
  teamManagers: TeamRoleDto[];
  fieldAdmins: FieldRoleDto[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar); // For showing notifications
  private router = inject(Router);
  private apiUrl = 'https://localhost:7224/api/Users';

  token = localStorage.getItem('auth_token');

  // Set the headers with the Authorization token
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.token}`,
  });

  //for fetching users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.headers }).pipe(
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

  //for fetching a user by ID
  getUserById(userId: string): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/${userId}`, { headers: this.headers })
      .pipe(
        tap((user) => {
          console.log('Fetched user:', user);
        }),
        catchError((err) => {
          console.error('Error fetching user:', err);
          this.snackBar.open('Failed to fetch user', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return throwError(() => err); // Re-throw the error
        })
      );
  }

  getUserRoles(userId: string): Observable<UserRolesResponse> {
    return this.http
      .get<UserRolesResponse>(`${this.apiUrl}/${userId}/roles`, {
        headers: this.headers,
      })
      .pipe(
        catchError((err) => {
          if (err.status === 404) {
            this.snackBar.open('User not found', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar'],
            });
          } else {
            console.error('Error fetching user roles:', err);
            this.snackBar.open('Failed to fetch user roles', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar'],
            });
          }
          return throwError(() => err);
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
    console.log('Creating user:', {
      ...user,
      clubAdmins,
      teamManagers,
      fieldAdmins,
    });
    this.http
      .post(
        this.apiUrl,
        { ...user, clubAdmins, teamManagers, fieldAdmins },
        { headers: this.headers }
      )
      .subscribe({
        next: (response: any) => {
          console.log('User created successfully:', response);
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

  //to add roles to a user
  createRoles(userId: string, request: AddRolesRequest) {
    return this.http.post<void>(`${this.apiUrl}/${userId}/roles`, request, {
      headers: this.headers,
    });
  }

  //for deleting a user
  deleteUser(userIds: string[]): Observable<void> {
    // Convert array of IDs to array of observables
    const deletionObservables = userIds.map((id) =>
      this.http
        .patch(
          `${this.apiUrl}/${id}`,
          { isDeleted: true },
          { headers: this.headers }
        )
        .pipe(
          tap(() => {
            console.log(`User with ID ${id} marked as deleted.`);
            this.snackBar.open(
              `User with ID ${id} deleted successfully!`,
              'Close',
              {
                duration: 3000,
              }
            );
          }),
          catchError((err) => {
            console.error(`Error deleting user with ID ${id}:`, err);
            this.snackBar.open(`Failed to delete user with ID ${id}`, 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar'],
            });
            return throwError(() => err); // Re-throw the error
          })
        )
    );

    // Execute all deletions in parallel and return a single observable
    return forkJoin(deletionObservables).pipe(map(() => undefined)); // Convert to Observable<void>
  }

  //for updating a user and removing roles
  updateUser(
    userId: string,
    user: User,
    removedRoles: RemoveRolesRequest
  ): Observable<void> {
    // First update user details
    return this.http
      .put<void>(`${this.apiUrl}/${userId}`, user, { headers: this.headers })
      .pipe(
        // Then remove roles (concatenating the two requests)
        concatMap(() =>
          this.http.delete<void>(`${this.apiUrl}/${userId}/roles`, {
            headers: this.headers,
            body: removedRoles,
          })
        )
      );
  }

  // user.service.ts
  updateUserActiveRole(
    userId: string,
    activeRoleType: string | null,
    activeRoleId: string | null
  ): Observable<void> {
    const url = `${this.apiUrl}/${userId}/active-role`;
    const body = {
      activeRoleType,
      activeRoleId,
    };

    return this.http.patch<void>(url, body).pipe(
      catchError((error) => {
        console.error('Error updating active role:', error);
        return throwError(() => error);
      })
    );
  }
}
