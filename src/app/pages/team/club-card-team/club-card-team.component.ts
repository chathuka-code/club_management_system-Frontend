import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../components/card/card.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Club {
  id: string;
  clubName: string;
  countryCode: string;
  activatedStatus: 'active' | 'inactive';
  description: string;
  logo: string;
  isDeleted: boolean;
}

@Component({
  selector: 'app-club-card-team',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './club-card-team.component.html',
  styleUrl: './club-card-team.component.css'
})
export class ClubCardTeamComponent implements OnInit{
constructor(private router: Router) {}

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.getAllClubs();
  }

  userData: Club[] = [];

  onCardClick(clubId: string) {
    this.router.navigate(['/chooseClubforTeam/teams', clubId]);
  }

  getAllClubs() {
    this.http.get<Club[]>('http://localhost:3000/clubs').subscribe({
      next: (response) => {
        console.log('Clubs:', response);
        this.userData = response.filter(club => !club.isDeleted);
      },
    });
  }
}
