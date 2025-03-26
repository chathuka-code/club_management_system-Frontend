import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { TableColumn } from '../../../components/table/table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldService, Field } from '../field.service';

@Component({
  selector: 'app-field-list',
  standalone: true,
  imports: [TableComponent, MatButtonModule],
  templateUrl: './field-list.component.html',
  styleUrl: './field-list.component.css',
})
export class FieldListComponent implements OnInit {
  constructor(private router: Router) {}

  private route = inject(ActivatedRoute);
  private fieldService = inject(FieldService);
  clubId: string | null = null;
  fieldData: Field[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.clubId = params.get('clubId');
      console.log('Received clubId:', this.clubId);
    });
    if (this.clubId) {
      this.fieldService
        .getAllFields(this.clubId)
        .subscribe((fields: Field[]) => {
          this.fieldData = fields;
        });
    }
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

  selectedRows: any[] = [];

  navigateToCreateField() {
    this.router.navigate(['chooseClub/fields/createField', this.clubId]);
  }

  handleSelectedRows(selectedRows: any[]) {
    console.log('Selected rows:', selectedRows);
    this.selectedRows = selectedRows;
  }
}
