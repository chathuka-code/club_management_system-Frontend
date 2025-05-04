import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // For user feedback
import { Router } from '@angular/router';
import { catchError, forkJoin, map, Observable, tap, throwError } from 'rxjs';

export interface Club {
  [x: string]: any;
  clubName: string;
  countryCode: string;
  activatedStatus: boolean;
  description: string;
  logo: string;
  isDeleted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ClubService {
  constructor() {}

  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar); // For showing notifications
  private router = inject(Router);
  private apiUrl = 'https://localhost:7224/api/Clubs';
  private countryApiUrl = 'https://restcountries.com/v3.1/all';

  //for creating a club
  createClub(club: Club) {
    this.http.post(this.apiUrl, club).subscribe({
      next: (response) => {
        console.log('Club created successfully:', response);
        this.snackBar.open('Club created successfully!', 'Close', {
          duration: 3000,
        });

        this.router.navigate(['/clubs']);
      },
      error: (err) => {
        console.error('Error creating club:', err);
        this.snackBar.open('Failed to create club', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  //for fetching
  getAllClubs(): Observable<Club[]> {
    return this.http
      .get<Club[]>(this.apiUrl)
      .pipe(map((clubs) => clubs.filter((club) => !club.isDeleted)));
  }

  //for fetching countries
  fetchCountries(): Observable<{ name: string; code: string }[]> {
    return this.http.get<any[]>(this.countryApiUrl).pipe(
      map((data: any[]) =>
        data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
        }))
      )
    );
  }

  //for soft deleting a club
  deleteClub(clubIds: string[]): Observable<void> {
    // Convert array of IDs to array of observables
    const deletionObservables = clubIds.map(id => 
      this.http.patch(`${this.apiUrl}/${id}`, { isDeleted: true }).pipe(
        tap(() => {
          console.log(`Club with ID ${id} marked as deleted.`);
          this.snackBar.open(
            `Club with ID ${id} deleted successfully!`,
            'Close',
            { duration: 3000 }
          );
        }),
        catchError(err => {
          console.error(`Error deleting club with ID ${id}:`, err);
          this.snackBar.open(
            `Failed to delete club with ID ${id}`,
            'Close',
            { duration: 3000, panelClass: ['error-snackbar'] }
          );
          return throwError(() => err); // Re-throw the error
        })
      )
    );
  
    // Execute all deletions in parallel and return a single observable
    return forkJoin(deletionObservables).pipe(
      map(() => undefined) // Convert to Observable<void>
    );
  }

  //for updating a club
  updateClub(clubId: string, club: Club): Observable<Club> {
    return this.http.put<Club>(`${this.apiUrl}/${clubId}`, club).pipe(
      tap(() => {
        console.log('Club updated successfully!');
        this.snackBar.open('Club updated successfully!', 'Close', {
          duration: 3000,
        });
      }),
      catchError((err) => {
        console.error('Error updating club:', err);
        this.snackBar.open('Failed to update club', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return throwError(() => err); // Re-throw the error
      })
    );
  }

  //for getting a club by ID
  getClubById(clubId: string): Observable<Club> {
    return this.http.get<Club>(`${this.apiUrl}/${clubId}`).pipe(
      tap((club) => {
        console.log('Fetched club:', club);
      }),
      catchError((err) => {
        console.error('Error fetching club:', err);
        this.snackBar.open('Failed to fetch club', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return throwError(() => err); // Re-throw the error
      })
    );
  }
}
