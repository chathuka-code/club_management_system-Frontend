import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FieldService, Field } from '../field.service';

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
  private route = inject(ActivatedRoute);
  private fieldService = inject(FieldService);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.field.clubId = params.get('clubId') || '';
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
    isDeleted: false,
  };

  createField() {
    
    if (
      !this.field.fieldName ||
      !this.field.address ||
      !this.field.facilitiesInfo ||
      !this.field.deckType ||
      !this.field.clubId
    ) {
      alert(
        'Please fill in all required fields: Field Name, Address, Deck Type, Club ID.'
      );
      return;
    }

    this.fieldService.createField(this.field);
  }
}
