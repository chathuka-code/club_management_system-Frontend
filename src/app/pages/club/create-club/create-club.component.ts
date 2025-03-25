import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // For user feedback
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Club {
  clubName: string;
  countryCode: string;
  activatedStatus: 'active' | 'inactive';
  description: string;
  logo: string;
}

@Component({
  selector: 'app-create-club',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './create-club.component.html',
  styleUrl: './create-club.component.css',
})
export class CreateClubComponent implements OnInit {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar); // For showing notifications
  private router = inject(Router);

  apiUrl = 'http://localhost:3000/clubs'; // Fixed variable name (Url → apiUrl)

  club: Club = {
    clubName: '',
    countryCode: '',
    activatedStatus: 'active',
    description: '',
    logo: '',
  };

  countries = signal<{ name: string; code: string }[]>([]);

  ngOnInit() {
    this.fetchCountries();
  }

  fetchCountries() {
    const countryApiUrl = 'https://restcountries.com/v3.1/all';
    this.http.get<any[]>(countryApiUrl).subscribe((data) => {
      this.countries.set(
        data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
        }))
      );
    });
  }


  showData() {
    console.log('Club Data:', this.club);
  }

  createClub() {
    this.http.post<Club>(this.apiUrl, this.club).subscribe({
      next: (response) => {
        console.log('Club created successfully:', response);
        this.snackBar.open('Club created successfully!', 'Close', {
          duration: 3000,
        });
        this.resetForm();
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

  private resetForm() {
    this.club = {
      clubName: '',
      countryCode: '',
      activatedStatus: 'active',
      description: '',
      logo: '',
    };
  }
}
