import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

interface Club {
  clubName: string;
  countryCode: string;
  activatedStatus: 'active' | 'inactive';
  description: string;
  logo: string;
}

@Component({
  selector: 'app-create-club',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './create-club.component.html',
  styleUrl: './create-club.component.css',
})
export class CreateClubComponent {
  club: Club = {
    clubName: '',
    countryCode: '',
    activatedStatus: 'active',
    description: '',
    logo: '',
  };

  showData() {
    console.log('Club Data:', this.club);
  }
}
