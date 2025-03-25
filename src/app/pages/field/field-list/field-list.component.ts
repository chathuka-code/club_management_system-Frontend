import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { TableColumn } from '../../../components/table/table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

@Component({
  selector: 'app-field-list',
  standalone: true,
  imports: [TableComponent, MatButtonModule],
  templateUrl: './field-list.component.html',
  styleUrl: './field-list.component.css',
})
export class FieldListComponent implements OnInit {
  constructor(private router: Router) {}

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  clubId: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.clubId = params.get('clubId');
      console.log('Received clubId:', this.clubId);
    });
    this.getAllFields();
  }

  fieldColumns: TableColumn[] = [
    { key: 'fieldName', label: 'Field Name' },
    { key: 'address', label: 'Address' },
    { key: 'facilitiesInfo', label: 'Facilities Info' },
    { key: 'description', label: 'Description' },
    { key: 'deckType', label: 'Deck Type' },
    { key: 'hasLighting', label: 'Lighting Available' },
    { key: 'hasHeating', label: 'Heating Available' },
  ];

  fieldData: Field[] = [];

  navigateToCreateField() {
    this.router.navigate(['chooseClub/fields/createField', this.clubId]);
  }

  getAllFields() {
    this.http.get<Field[]>(`http://localhost:3000/fields?clubId=${this.clubId}`).subscribe({
      next: (response) => {
        console.log('Fields:', response);
        this.fieldData = response;
      },
    });
  }
}
