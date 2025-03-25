import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // For user feedback
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Field {
  fieldName: string;
  address: string;
  facilitiesInfo: string;
  description: string;
  deckType: string;
  hasLighting: boolean;
  hasHeating: boolean;
  clubId: string;
}

interface FieldPart {
  fieldPartName: string;
}

@Component({
  selector: 'app-create-field',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './create-field.component.html',
  styleUrl: './create-field.component.css',
})
export class CreateFieldComponent implements OnInit {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar); // For showing notifications
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  apiUrl = 'http://localhost:3000/fields'; // Fixed variable name (Url → apiUrl)

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.field.clubId = params.get('clubId') || '';
      console.log('Received clubId:', this.field.clubId);
    });
  }

  field: Field = {
    fieldName: '',
    address: '',
    facilitiesInfo: '',
    description: '',
    deckType: '',
    hasLighting: false,
    hasHeating: false,
    clubId: '',
  };

  createField() {
    this.http
      .post<{ id: string }>('http://localhost:3000/fields', this.field)
      .subscribe({
        next: (response) => {
          console.log('Created field response:', response);
          this.snackBar.open('Field created successfully', 'Close', {
            duration: 2000,
          });

          const fieldParts = [
            'Section 1',
            'Section 2',
            'Section 3',
            'Section 4',
          ];
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
                  console.error(
                    `Failed to create field part "${fieldPartName}"`
                  );
                },
              });
          });
          this.router.navigate(['chooseClub/fields/', this.field.clubId]);
        },
        error: () => {
          this.snackBar.open('Failed to create field', 'Close', {
            duration: 2000,
          });
        },
      });
  }
}
