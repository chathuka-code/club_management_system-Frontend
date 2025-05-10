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
    activatedStatus: true,
    description: '',
    logo: '',
    isDeleted: false,
  };

  countries = signal<{ name: string; code: string }[]>([]);

  ngOnInit() {
    console.log(localStorage.getItem('auth_data'));
    this.clubService.fetchCountries().subscribe((data) => {
      this.countries.set(data);
    });
  }

  showData() {
    console.log('Club Data:', this.club);
  }

  createClub() {
    if (
      !this.club.clubName ||
      !this.club.countryCode ||
      !this.club.activatedStatus
    ) {
      alert('Club name and country are required!');
      return;
    }
    this.clubService.createClub(this.club);
    this.resetForm();
  }

  private resetForm() {
    this.club = {
      clubName: '',
      countryCode: '',
      activatedStatus: true,
      description: '',
      logo: '',
      isDeleted: false,
    };
  }
}
