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

  //for creating a user
  createUser(user: User) {
    this.http.post(this.apiUrl, user).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.snackBar.open('User created successfully!', 'Close', {
          duration: 3000,
        });
        
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
