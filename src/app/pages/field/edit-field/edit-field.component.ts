import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FieldService, Field } from '../field.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-field',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './edit-field.component.html',
  styleUrl: './edit-field.component.css',
})
export class EditFieldComponent implements OnInit {
  private fieldService = inject(FieldService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  fieldId: string | null = null;
  field: Field = {
    fieldName: '',
    address: '',
    facilitiesInfo: '',
    description: '',
    deckType: '',
    hasLighting: false,
    hasHeating: false,
    clubId: '',
    isDeleted: false,
  };

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.fieldId = params.get('fieldId');
      console.log('Received fieldId:', this.fieldId);
    });

    if (this.fieldId) {
      this.fieldService.getFieldById(this.fieldId).subscribe((field) => {
        this.field = field;
      });
    } else {
      console.error('fieldId is null');
    }
  }

  saveField() {
    if (this.fieldId) {
      this.fieldService.updateField(this.fieldId, this.field).subscribe(() => {
        console.log('Field updated successfully!');
        this.router.navigate(['chooseClub/fields', this.field.clubId]);
      });
    } else {
      console.error('fieldId is null');
    }
  }
}
