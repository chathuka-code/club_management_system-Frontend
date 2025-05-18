import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  teamId?: string;
  bookingStatus: boolean;
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
  private apiUrl = 'https://localhost:7224/api/Bookings';

  token = localStorage.getItem('auth_token');

  // Set the headers with the Authorization token
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.token}`,
  });

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

  getBookingOwnership = (booking: Booking): Observable<Boolean> => {
    return this.http
      .post<Boolean>(`${this.apiUrl}/by-userId`, booking, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          console.log('Booking ownership:', response);
          return response;
        }),
        catchError((err) => {
          console.error('Error fetching booking ownership:', err);
          return throwError(() => err);
        })
      );
  };

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
            bookingStatus: booking.bookingStatus,
          }))
        )
      );
  }

  //for getting all bookings by fieldId
  getAllBookingsByFieldId(fieldId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/by-field/${fieldId}`).pipe(
      map((response) => {
        console.log('Bookings:', response);
        return response;
      })
    );
  }

  //for getting booking by bookingId
  getBookingById(bookingId: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${bookingId}`).pipe(
      tap((response) => {
        console.log('Booking details:', response);
      }),
      catchError((err) => {
        console.error('Error fetching booking:', err);
        return throwError(() => err);
      })
    );
  }

  //for updating a booking
  updateBooking(bookingId: string, booking: Booking): Observable<Booking> {
    return this.http
      .patch<Booking>(`${this.apiUrl}/${bookingId}`, booking)
      .pipe(
        tap((response) => {
          console.log('Booking updated successfully:', response);
          this.snackBar.open('Booking updated successfully!', 'Close', {
            duration: 3000,
          });
        }),
        catchError((err) => {
          console.error('Error updating booking:', err);
          this.snackBar.open('Failed to update booking', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return throwError(() => err);
        })
      );
  }

  //for deleting a booking
  deleteBooking(bookingId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${bookingId}`).pipe(
      tap(() => {
        console.log('Booking deleted successfully');
        this.snackBar.open('Booking deleted successfully!', 'Close', {
          duration: 3000,
        });
      }),
      catchError((err) => {
        console.error('Error deleting booking:', err);
        this.snackBar.open('Failed to delete booking', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return throwError(() => err);
      })
    );
  }

  //for approving a booking
  approveBooking(bookingId: string): Observable<Booking> {
    return this.http
      .patch<Booking>(
        `${this.apiUrl}/${bookingId}/approve`,
        {
          bookingStatus: true,
        },
        { headers: this.headers }
      )
      .pipe(
        tap((response) => {
          console.log('Booking approved successfully:', response);
          this.snackBar.open('Booking approved successfully!', 'Close', {
            duration: 3000,
          });
        }),
        catchError((err) => {
          console.error('Error approving booking:', err);
          this.snackBar.open('Failed to approve booking', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return throwError(() => err);
        })
      );
  }
}
