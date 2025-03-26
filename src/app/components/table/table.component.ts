import {
  Component,
  Input,
  Output,
  EventEmitter,
  NgModule,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatCheckboxModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() columns: { key: string; label: string }[] = [];
  @Input() data: any[] = [];

  @Output() selectedRows = new EventEmitter<any[]>();

  displayedColumns: string[] = [];

  dataSource!: MatTableDataSource<any>;

  ngOnChanges() {
    this.displayedColumns = ['select', ...this.columns.map(col => col.key)];
    this.dataSource = new MatTableDataSource(this.data);
  }

  toggleAllRows(event: any) {
    const checked = event.checked;
    this.data.forEach(row => (row.selected = checked));
    this.selectedRows.emit(this.data.filter(row => row.selected));
  }

  onRowSelectionChange() {
    this.selectedRows.emit(this.data.filter(row => row.selected));
  }
}
