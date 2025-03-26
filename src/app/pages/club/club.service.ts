import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // For user feedback
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

export interface Club {
  clubName: string;
  countryCode: string;
  activatedStatus: 'active' | 'inactive';
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
  private apiUrl = 'http://localhost:3000/clubs';
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
    return this.http.get<Club[]>('http://localhost:3000/clubs');
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
}
