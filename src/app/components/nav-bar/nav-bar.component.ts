import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterOutlet,
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

  menuItems: any[] =[
    {
      icon:'home',
      label:'Club',
      route:'/clubs'
    },
    {
      icon:'handshake',
      label:'Field',
      route:'/chooseClub'
    },
    {
      icon:'book',
      label:'Team',
      route:'team'
    },
    {
      icon:'event',
      label:'User',
      route:'user'
    },
    {
      icon:'help',
      label:'Booking',
      route:'booking'
    }
  ];
}
