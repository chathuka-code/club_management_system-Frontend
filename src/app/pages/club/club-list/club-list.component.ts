import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TableColumn } from '../../../components/table/table.component';
import { HttpClient } from '@angular/common/http';

interface Club {
  clubName: string;
  countryCode: string;
  activatedStatus: 'active' | 'inactive';
  description: string;
  logo: string;
}

@Component({
  selector: 'app-club-list',
  standalone: true,
  imports: [TableComponent, MatButtonModule],
  templateUrl: './club-list.component.html',
  styleUrl: './club-list.component.css',
})
export class ClubListComponent implements OnInit {
  constructor(private router: Router) {}

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.getAllClubs();
  }

  userColumns: TableColumn[] = [
    { key: 'id', label: 'Club ID' },
    { key: 'clubName', label: 'Club Name' },
    { key: 'countryCode', label: 'Country Code' },
    { key: 'activatedStatus', label: 'Activated Status' },
    { key: 'description', label: 'Description' },
    { key: 'logo', label: 'Logo' },
  ];

  userData: Club[] = [];

  navigateToCreateClub() {
    this.router.navigate(['/clubs/createClub']);
  }

  getAllClubs() {
    this.http.get<Club[]>('http://localhost:3000/clubs').subscribe({
      next: (response) => {
        console.log('Clubs:', response);
        this.userData = response;
      },
    });
  }
}
