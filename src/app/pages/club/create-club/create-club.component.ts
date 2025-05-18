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

  logoFile: File | null = null;
  logoPreview: string | ArrayBuffer | null = null;

  club: Club = {
    clubName: '',
    countryCode: '',
    activatedStatus: true,
    description: '',
    logo: '', // You can ignore this for now; it'll be handled in FormData
    isDeleted: false,
  };

  countries = signal<{ name: string; code: string }[]>([]);

  ngOnInit() {
    this.clubService.fetchCountries().subscribe((data) => {
      this.countries.set(data);
    });
  }

  createClub() {
    if (!this.club.clubName || !this.club.countryCode) {
      alert('Club name and country are required!');
      return;
    }

    if (this.logoFile) {
      // Step 1: Upload the logo
      const formData = new FormData();
      formData.append('file', this.logoFile);

      this.clubService.uploadLogo(formData).subscribe({
        next: (res) => {
          // Step 2: Set logo URL returned from backend
          this.club.logo = res.filePath;

          // Step 3: Proceed to create the club
          this.createClubWithLogo();
        },
        error: (err) => {
          console.error('Logo upload failed:', err);
          alert('Failed to upload logo');
        },
      });
    } else {
      // No logo selected, proceed directly
      this.createClubWithLogo();
    }
  }

  private createClubWithLogo() {
    this.clubService.createClub(this.club);
    this.resetForm();
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.logoFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(this.logoFile);
    }

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
    this.logoFile = null;
    this.logoPreview = null;
  }
}
