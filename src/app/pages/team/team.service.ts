import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:3000/teams';

  // For fetching teams
  getAllTeams(clubId: string): Observable<Team[]> {
    return this.http
      .get<Team[]>(`${this.apiUrl}?clubId=${clubId}&isDeleted=false`)
      .pipe(
        map((response) => {
          console.log('Teams:', response);
          return response;
        })
      );
  }

  // For getting a team by ID
  getTeamById(teamId: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${teamId}`).pipe(
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

  // For soft deleting a team
  deleteTeams(teamIds: string[]): Observable<void> {
    // Convert array of IDs to array of observables
    const deletionObservables = teamIds.map((id) =>
      this.http.patch(`${this.apiUrl}/${id}`, { isDeleted: true }).pipe(
        tap(() => {
          console.log(`Team with ID ${id} marked as deleted.`);
          this.snackBar.open(
            `Team with ID ${id} deleted successfully!`,
            'Close',
            { duration: 3000 }
          );
        }),
        catchError((err) => {
          console.error(`Error deleting team with ID ${id}:`, err);
          this.snackBar.open(`Failed to delete team with ID ${id}`, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return throwError(() => err); // Re-throw the error
        })
      )
    );

    // Execute all deletions in parallel and return a single observable
    return forkJoin(deletionObservables).pipe(
      map(() => undefined) // Convert to Observable<void>
    );
  }

  // For creating a team
  createTeam(team: Team) {
    this.http.post(this.apiUrl, team).subscribe({
      next: () => {
        console.log('Team created successfully!');
        this.snackBar.open('Team created successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/chooseClubforTeam/teams', team.clubId]);
      },
      error: (err) => {
        console.error('Error creating team:', err);
        this.snackBar.open('Failed to create team', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  // For updating a team
  updateTeam(teamId: string, team: Partial<Team>): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${teamId}`, team).pipe(
      tap(() => {
        console.log('Team updated successfully!');
        this.snackBar.open('Team updated successfully!', 'Close', {
          duration: 3000,
        });
      }),
      catchError((err) => {
        console.error('Error updating team:', err);
        this.snackBar.open('Failed to update team', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return throwError(() => err); // Re-throw the error
      })
    );
  }
}
