import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../components/card/card.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Club {
  id: string;
  clubName: string;
  countryCode: string;
  activatedStatus: boolean;
  description: string;
  logo: string;
  isDeleted: boolean;
}

@Component({
  selector: 'app-club-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './club-card.component.html',
  styleUrl: './club-card.component.css',
})
export class ClubCardComponent implements OnInit {
  constructor(private router: Router) {}

  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7224/api/Clubs';


  ngOnInit(): void {
    this.getAllClubs();
  }

  userData: Club[] = [];

  onCardClick(clubId: string) {
    this.router.navigate(['/chooseClub/fields', clubId]);
  }

  getAllClubs() {
    this.http.get<Club[]>(this.apiUrl).subscribe({
      next: (response) => {
        console.log('Clubs:', response);
        this.userData = response.filter(club => !club.isDeleted);
      },
    });
  }
}
