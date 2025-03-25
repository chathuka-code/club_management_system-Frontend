import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];

  @Output() selectedRows = new EventEmitter<any[]>();

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);

  ngOnChanges(): void {
    this.displayedColumns = this.columns.map(col => col.key);
    this.dataSource.data = this.data;
  }
}
