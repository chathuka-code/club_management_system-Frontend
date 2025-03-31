import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // For user feedback
import { Router } from '@angular/router';
import { catchError, forkJoin, map, Observable, tap, throwError } from 'rxjs';

export interface Field {
  [x: string]: any;
  fieldName: string;
  address: string;
  facilitiesInfo: string;
  description: string;
  deckType: string;
  hasLighting: boolean;
  hasHeating: boolean;
  clubId: string;
  isDeleted: boolean;
}

export interface FieldPart {
  fieldPartName: string;
}

@Injectable({
  providedIn: 'root',
})
export class FieldService {
  constructor() {}

  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar); // For showing notifications
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/fields';
  private fieldPartApiUrl = 'http://localhost:3000/fieldParts';

  //for creating a field
  createField(field: Field) {
    this.http.post<{ id: string }>(this.apiUrl, field).subscribe({
      next: (response) => {
        console.log('Field created successfully:', response);
        this.snackBar.open('Field created successfully!', 'Close', {
          duration: 3000,
        });
        const fieldParts = ['Section 1', 'Section 2', 'Section 3', 'Section 4'];
        fieldParts.forEach((fieldPartName) => {
          this.http
            .post('http://localhost:3000/fieldParts', {
              fieldPartName,
              fieldId: response.id,
            })
            .subscribe({
              next: () => {
                console.log(
                  `Field part "${fieldPartName}" created successfully`
                );
              },
              error: () => {
                console.error(`Failed to create field part "${fieldPartName}"`);
              },
            });
        });
        this.router.navigate(['/chooseClub/fields', field.clubId]);
      },
      error: (err) => {
        console.error('Error creating field:', err);
        this.snackBar.open('Failed to create field', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  //for fetching fields
  getAllFields(clubId: string): Observable<Field[]> {
    return this.http
      .get<Field[]>(
        `http://localhost:3000/fields?clubId=${clubId}&isDeleted=false`
      )
      .pipe(
        map((response) => {
          console.log('Fields:', response);
          return response;
        })
      );
  }

  //for soft deleting a field
  deleteFields(fieldIds: string[]): Observable<void> {
    // Convert array of IDs to array of observables
    const deletionObservables = fieldIds.map((id) =>
      this.http.patch(`${this.apiUrl}/${id}`, { isDeleted: true }).pipe(
        tap(() => {
          console.log(`Field with ID ${id} marked as deleted.`);
          this.snackBar.open(
            `Field with ID ${id} deleted successfully!`,
            'Close',
            { duration: 3000 }
          );
        }),
        catchError((err) => {
          console.error(`Error deleting field with ID ${id}:`, err);
          this.snackBar.open(`Failed to delete field with ID ${id}`, 'Close', {
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

  //for updating a field
  updateField(fieldId: string, field: Field): Observable<Field> {
    return this.http.put<Field>(`${this.apiUrl}/${fieldId}`, field).pipe(
      tap(() => {
        console.log('Field updated successfully!');
        this.snackBar.open('Field updated successfully!', 'Close', {
          duration: 3000,
        });
      }),
      catchError((err) => {
        console.error('Error updating field:', err);
        this.snackBar.open('Failed to update field', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return throwError(() => err); // Re-throw the error
      })
    );
  }

  //for getting a field by ID
  getFieldById(fieldId: string): Observable<Field> {
    return this.http.get<Field>(`${this.apiUrl}/${fieldId}`).pipe(
      tap((field) => {
        console.log('Fetched field:', field);
      }),
      catchError((err) => {
        console.error('Error fetching field:', err);
        this.snackBar.open('Failed to fetch field', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return throwError(() => err); // Re-throw the error
      })
    );
  }
}
