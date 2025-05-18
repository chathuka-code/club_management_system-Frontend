import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  [x: string]: any;
  byteCode: number;
  fieldPartName: string;
  fieldId: string;
  isSelected?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FieldService {
  constructor() {}

  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar); // For showing notifications
  private router = inject(Router);
  private apiUrl = 'https://localhost:7224/api/Fields';
  private fieldPartApiUrl = 'https://localhost:7224/api/FieldParts';

  token = localStorage.getItem('auth_token');

  // Set the headers with the Authorization token
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.token}`,
  });

  //for creating a field
  createField(field: Field) {
    this.http
      .post<{ id: string }>(this.apiUrl, field, { headers: this.headers })
      .subscribe({
        next: (response) => {
          console.log('Field created successfully:', response);
          this.snackBar.open('Field created successfully!', 'Close', {
            duration: 3000,
          });
          const fieldParts = [
            { partName: '1', byteCode: 1 },
            { partName: '2', byteCode: 2 },
            { partName: '3', byteCode: 4 },
            { partName: '4', byteCode: 8 },
            { partName: '1-2', byteCode: 3 },
            { partName: '3-4', byteCode: 12 },
            { partName: '1-4', byteCode: 15 },
          ]; // Example field parts
          fieldParts.forEach((fieldPartName) => {
            this.http
              .post(
                this.fieldPartApiUrl,
                {
                  fieldPartName: fieldPartName.partName,
                  byteCode: fieldPartName.byteCode,
                  fieldId: response.id,
                },
                { headers: this.headers }
              )
              .subscribe({
                next: () => {
                  console.log(
                    `Field part "${fieldPartName}" created successfully`
                  );
                },
                error: () => {
                  console.error(
                    `Failed to create field part "${fieldPartName}"`
                  );
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
        `https://localhost:7224/api/Fields?clubId=${clubId}&isDeleted=false`
      )
      .pipe(
        map((response) => {
          console.log('Fields:', response);
          return response;
        })
      );
  }

  getFieldOwnership = (fieldId: string): Observable<Boolean> => {
    return this.http
      .get<Boolean>(`${this.apiUrl}/by-field/${fieldId}`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          console.log('Field ownership:', response);
          return response;
        }),
        catchError((err) => {
          console.error('Error fetching field ownership:', err);
          return throwError(() => err);
        })
      );
  };

  // for soft deleting a field
  deleteFields(fieldIds: string[]): Observable<boolean> {
    return this.http
      .patch<boolean>(`${this.apiUrl}`, fieldIds, { headers: this.headers })
      .pipe(
        tap(() => {
          console.log('Fields marked as deleted successfully');
          this.snackBar.open('Fields deleted successfully!', 'Close', {
            duration: 3000,
          });
        }),
        catchError((err) => {
          console.error('Error deleting fields:', err);
          this.snackBar.open('Failed to delete fields', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return throwError(() => err);
        })
      );
  }

  //for updating a field
  updateField(fieldId: string, field: Field): Observable<Field> {
    return this.http
      .put<Field>(`${this.apiUrl}/${fieldId}`, field, { headers: this.headers })
      .pipe(
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
    return this.http
      .get<Field>(`${this.apiUrl}/${fieldId}`, { headers: this.headers })
      .pipe(
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

  //for getting field parts by field ID
  getFieldPartsByFieldId(fieldId: string): Observable<FieldPart[]> {
    return this.http
      .get<FieldPart[]>(`${this.fieldPartApiUrl}?fieldId=${fieldId}`)
      .pipe(
        tap((fieldParts) => {
          console.log('Fetched field parts:', fieldParts);
        }),
        catchError((err) => {
          console.error('Error fetching field parts:', err);
          this.snackBar.open('Failed to fetch field parts', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return throwError(() => err); // Re-throw the error
        })
      );
  }

  //getting field parts by IDs
  getFieldPartsByIds(fieldPartIds: any[]): Observable<number[]> {
    const requests = fieldPartIds.map((id) =>
      this.http.get<FieldPart>(`${this.fieldPartApiUrl}/${id}`)
    );
    return forkJoin(requests).pipe(
      map((responses) => responses.map((response) => response.byteCode)),
      catchError((err) => {
        console.error('Error fetching field parts:', err);
        this.snackBar.open('Failed to fetch field parts', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return throwError(() => err); // Re-throw the error
      })
    );
  }

  // for getting field admins
  getFieldAdmins(fieldId: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/by-field/${fieldId}/fieldAdmins`, {
        headers: this.headers,
      })
      .pipe(
        tap((admins) => {
          console.log('Fetched field admins:', admins);
        }),
        catchError((err) => {
          console.error('Error fetching field admins:', err);
          return throwError(() => err);
        })
      );
  }

  //for deleting field admins
  deleteFieldAdmins(userIds: string[], fieldId: string): Observable<Boolean> {
    return this.http
      .delete<Boolean>(`${this.apiUrl}/by-field/${fieldId}/fieldAdmins`, {
        headers: this.headers,
        body: userIds,
      })
      .pipe(
        tap((response) => {
          console.log('Deleted field admins successfully:', response);
          this.snackBar.open('Field admins deleted successfully!', 'Close', {
            duration: 3000,
          });
        }),
        catchError((err) => {
          console.error('Error deleting field admins:', err);
          this.snackBar.open('Failed to delete field admins', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return throwError(() => err);
        })
      );
  }

  // for adding field admins
  addFieldAdmins(fieldId: string, userIds: string[]): Observable<boolean> {
    return this.http
      .post<boolean>(
        `${this.apiUrl}/by-field/${fieldId}/fieldAdmins`,
        userIds,
        {
          headers: this.headers,
        }
      )
      .pipe(
        tap((response) => {
          console.log('Added field admins successfully:', response);
          this.snackBar.open('Field admins added successfully!', 'Close', {
            duration: 3000,
          });
        }),
        catchError((err) => {
          console.error('Error adding field admins:', err);
          this.snackBar.open('Failed to add field admins', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return throwError(() => err);
        })
      );
  }
}
