import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // For user feedback
import { Router } from '@angular/router';
import { catchError, forkJoin, map, Observable, tap, throwError } from 'rxjs';

export interface Team {
  [x: string]: any;
  teamName: string;
  sportCategory: string;
  clubId: string;
  isDeleted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor() {}

  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar); // For showing notifications
  private router = inject(Router);
  private apiUrl = 'https://localhost:7224/api/Teams';

  token = localStorage.getItem('auth_token');

  // Set the headers with the Authorization token
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.token}`,
  });

  // For fetching teams
  getAllTeams(clubId: string): Observable<Team[]> {
    return this.http
      .get<Team[]>(`${this.apiUrl}?clubId=${clubId}&isDeleted=false`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          console.log('Teams:', response);
          return response;
        })
      );
  }

  //for getting all teams
  getAllTeamsEntire(): Observable<Team[]> {
    return this.http
      .get<Team[]>(`${this.apiUrl}/getAllTeams`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          console.log('Teams:', response);
          return response;
        }),
        catchError((err) => {
          console.error('Error fetching teams:', err);
          this.snackBar.open('Failed to fetch teams', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return throwError(() => err); // Re-throw the error
        })
      );
  }

  // For getting a team by ID
  getTeamById(teamId: string): Observable<Team> {
    return this.http
      .get<Team>(`${this.apiUrl}/${teamId}`, {
        headers: this.headers,
      })
      .pipe(
        tap((team) => {
          console.log('Fetched team:', team);
        }),
        catchError((err) => {
          console.error('Error fetching team:', err);
          this.snackBar.open('Failed to fetch team', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return throwError(() => err); // Re-throw the error
        })
      );
  }

  getTeamOwnership = (teamId: string): Observable<Boolean> => {
    return this.http
      .get<Boolean>(`${this.apiUrl}/by-team/${teamId}`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          console.log('Team ownership:', response);
          return response;
        }),
        catchError((err) => {
          console.error('Error fetching team ownership:', err);
          return throwError(() => err);
        })
      );
  };

  // for soft deleting a team
  deleteTeams(teamIds: string[]): Observable<boolean> {
    return this.http
      .patch<boolean>(`${this.apiUrl}`, teamIds, { headers: this.headers })
      .pipe(
        tap(() => {
          console.log('Teams marked as deleted successfully');
          this.snackBar.open('Teams deleted successfully!', 'Close', {
            duration: 3000,
          });
        }),
        catchError((err) => {
          console.error('Error deleting teams:', err);
          this.snackBar.open('Failed to delete teams', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return throwError(() => err);
        })
      );
  }

  // For creating a team
  createTeam(team: Team) {
    this.http
      .post(this.apiUrl, team, {
        headers: this.headers,
      })
      .subscribe({
        next: () => {
          console.log('Team created successfully!');
          this.snackBar.open('Team created successfully!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/chooseClubforTeam/teams', team.clubId]);
        },
        error: (err) => {
          console.error('Error creating team:', err);
          this.snackBar.open(err.error.message, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  // For updating a team
  updateTeam(teamId: string, team: Partial<Team>): Observable<Team> {
    return this.http
      .put<Team>(`${this.apiUrl}/${teamId}`, team, {
        headers: this.headers,
      })
      .pipe(
        tap(() => {
          console.log('Team updated successfully!');
          this.snackBar.open('Team updated successfully!', 'Close', {
            duration: 3000,
          });
        }),
        catchError((err) => {
          console.error('Error updating team:', err);
          this.snackBar.open(err.error.message, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return throwError(() => err); // Re-throw the error
        })
      );
  }

  // for getting team managers
  getTeamManagers(teamId: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/by-team/${teamId}/teamManagers`, {
        headers: this.headers,
      })
      .pipe(
        tap((managers) => {
          console.log('Fetched team managers:', managers);
        }),
        catchError((err) => {
          console.error('Error fetching team managers:', err);
          return throwError(() => err);
        })
      );
  }

  // for deleting team managers
  deleteTeamManagers(userIds: string[], teamId: string): Observable<Boolean> {
    return this.http
      .delete<Boolean>(`${this.apiUrl}/by-team/${teamId}/teamManagers`, {
        headers: this.headers,
        body: userIds,
      })
      .pipe(
        tap((response) => {
          console.log('Deleted team managers successfully:', response);
          this.snackBar.open('Team managers removed successfully!', 'Close', {
            duration: 3000,
          });
        }),
        catchError((err) => {
          console.error('Error deleting team managers:', err);
          this.snackBar.open('Failed to remove team managers', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return throwError(() => err);
        })
      );
  }

  // for adding team managers
  addTeamManagers(teamId: string, userIds: string[]): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.apiUrl}/by-team/${teamId}/teamManagers`, userIds, {
        headers: this.headers,
      })
      .pipe(
        tap((response) => {
          console.log('Added team managers successfully:', response);
          this.snackBar.open('Team managers added successfully!', 'Close', {
            duration: 3000,
          });
        }),
        catchError((err) => {
          console.error('Error adding team managers:', err);
          this.snackBar.open('Failed to add team managers', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return throwError(() => err);
        })
      );
  }
}
