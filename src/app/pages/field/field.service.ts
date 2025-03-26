import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // For user feedback
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

export interface Field {
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
    return this.http.get<Field[]>(`http://localhost:3000/fields?clubId=${clubId}`).pipe(
      map((response) => {
        console.log('Fields:', response);
        return response;
      })
    );
  }
}
