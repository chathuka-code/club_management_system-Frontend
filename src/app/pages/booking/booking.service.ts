import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // For user feedback
import { Router } from '@angular/router';
import { catchError, forkJoin, map, Observable, tap, throwError } from 'rxjs';

export interface Booking {
  [x: string]: any;
  bookingTitle?: string;
  description?: string;
  bookingDate: string | null; // Use Date type for date
  startTime: string;
  endTime: string;
  userId: string;
  fieldPartId: string;
  fieldId: string;
  teamId?: string;
  bookingStatus: string;
  isDeleted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor() {}
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar); // For showing notifications
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/bookings';

  // For creating a booking
  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking).pipe(
      tap((response) => {
        console.log('Booking created successfully:', response);
        this.snackBar.open('Booking created successfully!', 'Close', {
          duration: 3000,
        });
      }),
      catchError((err) => {
        console.error('Error creating booking:', err);
        this.snackBar.open('Failed to create booking', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return throwError(() => err);
      })
    );
  }

  //for getting all bookings by date and field
  getBookingsByDateAndField(
    bookingDate: string,
    fieldId: string
  ): Observable<any[]> {
    return this.http
      .get<Booking[]>(
        `${this.apiUrl}?bookingDate=${bookingDate}&fieldId=${fieldId}`
      )
      .pipe(
        map((response) =>
          response.map((booking) => ({
            fieldPartId: booking.fieldPartId,
            startTime: booking.startTime,
            endTime: booking.endTime,
          }))
        )
      );
  }

  //for getting all bookings by fieldId
  getAllBookingsByFieldId(fieldId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}?fieldId=${fieldId}`).pipe(
      map((response) => {
        console.log('Bookings:', response);
        return response;
      })
    );
  }
}
