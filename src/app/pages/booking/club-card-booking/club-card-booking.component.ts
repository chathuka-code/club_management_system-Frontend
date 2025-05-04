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
  selector: 'app-club-card-booking',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './club-card-booking.component.html',
  styleUrl: './club-card-booking.component.css'
})
export class ClubCardBookingComponent implements OnInit {
  constructor(private router: Router) {}
  
    private http = inject(HttpClient);
  
    ngOnInit(): void {
      this.getAllClubs();
    }
  
    userData: Club[] = [];
  
    onCardClick(clubId: string) {
      this.router.navigate(['chooseClubforBooking/chooseFieldforBooking', clubId]);
    }
  
    getAllClubs() {
      this.http.get<Club[]>('https://localhost:7224/api/Clubs').subscribe({
        next: (response) => {
          console.log('Clubs:', response);
          this.userData = response.filter(club => !club.isDeleted);
        },
      });
    }
}
