import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ClubService, Club } from '../club.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-club',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './edit-club.component.html',
  styleUrl: './edit-club.component.css',
})
export class EditClubComponent implements OnInit {
  private clubService = inject(ClubService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  clubId: string | null = null;
  countries = signal<{ name: string; code: string }[]>([]);

  club: Club = {
    clubName: '',
    countryCode: '',
    activatedStatus: true,
    description: '',
    logo: '',
    isDeleted: false,
  };

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.clubId = params.get('clubId');
      console.log('Received clubId:', this.clubId);
    });

    if (this.clubId) {
      this.clubService.getClubById(this.clubId).subscribe((club) => {
        this.club = club;
      });
    } else {
      console.error('clubId is null');
    }

    this.clubService.fetchCountries().subscribe((data) => {
      this.countries.set(data);
    });
  }

  saveClub() {
    if (this.clubId) {
      this.clubService.updateClub(this.clubId, this.club).subscribe({
        next: (response) => {
          console.log('Club updated successfully:', response);
          this.router.navigate(['/clubs']);
        },
        error: (err) => {
          console.error('Error updating club:', err);
        },
      });
    }
  }
}
