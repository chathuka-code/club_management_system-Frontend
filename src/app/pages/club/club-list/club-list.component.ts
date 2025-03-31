import { Component, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TableColumn } from '../../../components/table/table.component';
import { ClubService, Club } from '../club.service';

@Component({
  selector: 'app-club-list',
  standalone: true,
  imports: [TableComponent, MatButtonModule],
  templateUrl: './club-list.component.html',
  styleUrl: './club-list.component.css',
})
export class ClubListComponent implements OnInit {
  constructor(private router: Router) {}

  private clubService = inject(ClubService);
  userData = signal<Club[]>([]);
  selectedRowIds: string[] = [];

  ngOnInit(): void {
    this.clubService.getAllClubs().subscribe((clubs: Club[]) => {
      this.userData.set(clubs);
    });
  }

  userColumns: TableColumn[] = [
    { key: 'clubName', label: 'Club Name' },
    { key: 'countryCode', label: 'Country Code' },
    { key: 'activatedStatus', label: 'Activated Status' },
    { key: 'description', label: 'Description' },
    { key: 'logo', label: 'Logo' },
  ];

  navigateToCreateClub() {
    this.router.navigate(['/clubs/createClub']);
  }

  handleSelectedRows(selectedRows: any[]) {
    this.selectedRowIds = selectedRows.map((row) => row.id);
  }

  deleteClubs() {
    this.clubService.deleteClub(this.selectedRowIds).subscribe(() => {
      this.clubService.getAllClubs().subscribe((clubs: Club[]) => {
        this.userData.set(clubs);
      });
    });
  }

  handleEdit(clubId: string) {
    this.router.navigate(['/clubs/editClub', clubId]);
  }
}
