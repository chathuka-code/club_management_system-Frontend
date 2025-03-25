import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../components/card/card.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Club {
  id : string;
  clubName: string;
  countryCode: string;
  activatedStatus: 'active' | 'inactive';
  description: string;
  logo: string;
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

  ngOnInit(): void {
    this.getAllClubs();
  }

  userData: Club[] = [];

  onCardClick(clubId: string) {
    this.router.navigate(['/chooseClub/fields', clubId]);
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
