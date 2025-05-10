import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../pages/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  roles: ('super-admin' | 'club-admin' | 'team-manager' | 'field-admin' | 'individual-user')[];
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
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
export class NavBarComponent implements OnInit, OnDestroy {
  title = 'angular-sidenav';
  filteredMenuItems: MenuItem[] = [];
  //currentRole: string = '';
  currentRoleType: string = '';
  private roleSubscription!: Subscription;

  // Define all possible menu items with required roles
  allMenuItems: MenuItem[] = [
    {
      icon: 'home',
      label: 'Club',
      route: '/clubs',
      roles: ['super-admin', 'club-admin'],
    },
    {
      icon: 'golf_course',
      label: 'Field',
      route: '/chooseClub',
      roles: ['super-admin', 'club-admin', 'field-admin'],
    },
    {
      icon: 'group',
      label: 'Team',
      route: '/chooseClubforTeam',
      roles: ['super-admin', 'team-manager', 'club-admin'],
    },
    {
      icon: 'person',
      label: 'User',
      route: 'users',
      roles: ['super-admin'],
    },
    {
      icon: 'event',
      label: 'Booking',
      route: '/chooseClubforBooking',
      roles: ['super-admin', 'club-admin', 'field-admin', 'team-manager', 'individual-user'],
    },
  ];

  private authService = inject(AuthService); // Get service via inject()
  private router = inject(Router);

  ngOnInit() {
    // Initial load
    this.filterMenuItems();

    // Subscribe to role changes
    this.roleSubscription = this.authService.currentRole$.subscribe(() => {
      this.filterMenuItems();
    });

  }

  ngOnDestroy() {
    this.roleSubscription?.unsubscribe();
  }

  private filterMenuItems() {
    const currentRole = this.authService.currentRole();
    const currentRoleType = currentRole?.type || '';
    const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
    
    console.log('Current role type:', currentRoleType);
    console.log('Is super admin:', isSuperAdmin);
  
    this.filteredMenuItems = this.allMenuItems.filter(item => {
      // Super admin sees everything
      if (isSuperAdmin) return true;
      
      // Check if current role has access
      if (currentRoleType && item.roles.includes(currentRoleType)) {
        return true;
      }
      
      // Additional checks for specific cases
      if (currentRoleType === 'club-admin') {
        // Club admins might need special access to some team manager features
        if (item.route === '/chooseClubforTeam' && 
            currentRole?.name?.includes('Club Admin')) {
          return true;
        }
      }
      
      return false;
    });
  
    console.log('Filtered menu items:', this.filteredMenuItems);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
