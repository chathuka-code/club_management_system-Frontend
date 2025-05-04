import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../pages/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  title = 'angular-sidenav';

  menuItems: any[] = [
    {
      icon: 'home',
      label: 'Club',
      route: '/clubs',
    },
    {
      icon: 'golf_course',
      label: 'Field',
      route: '/chooseClub',
    },
    {
      icon: 'group',
      label: 'Team',
      route: '/chooseClubforTeam',
    },
    {
      icon: 'person',
      label: 'User',
      route: 'users',
    },
    {
      icon: 'event',
      label: 'Booking',
      route: '/chooseClubforBooking',
    },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}