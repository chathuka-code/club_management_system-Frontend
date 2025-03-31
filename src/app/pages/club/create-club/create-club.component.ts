import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ClubService, Club } from '../club.service';

@Component({
  selector: 'app-create-club',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],

  templateUrl: './create-club.component.html',
  styleUrl: './create-club.component.css',
})
export class CreateClubComponent implements OnInit {
  constructor() {}

  private clubService = inject(ClubService);

  apiUrl = 'http://localhost:3000/clubs'; 

  club: Club = {
    clubName: '',
    countryCode: '',
    activatedStatus: 'active',
    description: '',
    logo: '',
    isDeleted: false,
  };

  countries = signal<{ name: string; code: string }[]>([]);

  ngOnInit() {
    this.clubService.fetchCountries().subscribe((data) => {
      this.countries.set(data);
    });
  }

  showData() {
    console.log('Club Data:', this.club);
  }

  createClub() {
    this.clubService.createClub(this.club);
    this.resetForm();
  }

  private resetForm() {
    this.club = {
      clubName: '',
      countryCode: '',
      activatedStatus: 'active',
      description: '',
      logo: '',
      isDeleted: false,
    };
  }
}
