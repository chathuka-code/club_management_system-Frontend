import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // For user feedback
import { Router } from '@angular/router';
import {
  catchError,
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

  //for fetching a user by ID
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
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

  getUserRoles(userId: string): Observable<any> {
    const clubAdminRoles$ = this.http.get<any[]>(
      `${this.clubAdminApiUrl}?userId=${userId}`
    );
    const teamManagerRoles$ = this.http.get<any[]>(
      `${this.teamManagerApiUrl}?userId=${userId}`
    );
    const fieldAdminRoles$ = this.http.get<any[]>(
      `${this.fieldAdminApiUrl}?userId=${userId}`
    );

    return forkJoin({
      clubAdmins: clubAdminRoles$,
      teamManagers: teamManagerRoles$,
      fieldAdmins: fieldAdminRoles$,
    }).pipe(
      map((roles) => {
        return {
          clubAdmins: roles.clubAdmins || [],
          teamManagers: roles.teamManagers || [],
          fieldAdmins: roles.fieldAdmins || [],
        };
      }),
      catchError((err) => {
        console.error('Error fetching user roles:', err);
        this.snackBar.open('Failed to fetch user roles', 'Close', {
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
                clubName: clubAdmin.clubName,
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
                teamName: teamManager.teamName,
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
                fieldName: fieldAdmin.fieldName,
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

  //for creating roles
  createRoles(
    userId: string,
    clubAdmins: any[],
    teamManagers: any[],
    fieldAdmins: any[]
  ) {
    if (clubAdmins.length > 0) {
      clubAdmins.forEach((clubAdmin) => {
        this.http
          .post(this.clubAdminApiUrl, {
            userId: userId,
            clubId: clubAdmin.clubId,
            clubName: clubAdmin.clubName,
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
            userId: userId,
            teamId: teamManager.teamId,
            teamName: teamManager.teamName,
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
            userId: userId,
            fieldId: fieldAdmin.fieldId,
            fieldName: fieldAdmin.fieldName,
          })
          .subscribe({
            next: () => console.log('Field admin assigned successfully'),
            error: (err) =>
              console.error('Error assigning field admin:', err),
          });
      });
    }
  }

  //for deleting a user
  deleteUser(userIds: string[]): Observable<void> {
    // Convert array of IDs to array of observables
    const deletionObservables = userIds.map((id) =>
      this.http.patch(`${this.apiUrl}/${id}`, { isDeleted: true }).pipe(
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

  updateUser(
    userId: string,
    user: User,
    deletedClubAdmins: string[],
    deletedTeamManagers: string[],
    deletedFieldAdmins: string[]
  ): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${userId}`, user).pipe(
      switchMap(() => {
        const deleteRequests: Observable<void>[] = [];
  
        // Function to fetch ID before deleting
        const fetchAndDelete = (apiUrl: string, filterParams: string): Observable<void> => {
          return this.http.get<any[]>(`${apiUrl}?${filterParams}`).pipe(
            switchMap((records) => {
              if (records.length > 0) {
                return this.http.delete<void>(`${apiUrl}/${records[0].id}`).pipe(
                  tap(() => console.log(`Deleted record with ID: ${records[0].id}`))
                );
              } else {
                console.warn(`No record found for: ${filterParams}`);
                return of(undefined);
              }
            })
          );
        };
  
        // Fetch and delete club admins
        if (deletedClubAdmins.length > 0) {
          deleteRequests.push(
            ...deletedClubAdmins.map((clubAdmin) =>
              fetchAndDelete(this.clubAdminApiUrl, `userId=${userId}&clubId=${clubAdmin}`)
            )
          );
        }
  
        // Fetch and delete team managers
        if (deletedTeamManagers.length > 0) {
          deleteRequests.push(
            ...deletedTeamManagers.map((teamManager) =>
              fetchAndDelete(this.teamManagerApiUrl, `userId=${userId}&teamId=${teamManager}`)
            )
          );
        }
  
        // Fetch and delete field admins
        if (deletedFieldAdmins.length > 0) {
          deleteRequests.push(
            ...deletedFieldAdmins.map((fieldAdmin) =>
              fetchAndDelete(this.fieldAdminApiUrl, `userId=${userId}&fieldId=${fieldAdmin}`)
            )
          );
        }
  
        return deleteRequests.length > 0 ? forkJoin(deleteRequests).pipe(map(() => {})) : of(undefined);
      }),
      tap(() => {
        this.snackBar.open('User updated successfully!', 'Close', { duration: 3000 });
      }),
      catchError((err) => {
        console.error('Error updating user:', err);
        this.snackBar.open('Failed to update user', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return throwError(() => err);
      })
    );
  }
  
}
