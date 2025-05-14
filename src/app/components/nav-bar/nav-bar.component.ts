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

  roles: (
    | 'super-admin'
    | 'club-admin'
    | 'team-manager'
    | 'field-admin'
    | 'individual-user'
  )[];
  action: () => void; // Optional action for non-route items
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
  selectedRole: string = '';

  private authService = inject(AuthService); // Get service via inject()
  private router = inject(Router);
  // Define all possible menu items with required roles
  allMenuItems: MenuItem[] = [
    {
      icon: 'home',
      label: 'Club',
      action: () => this.router.navigate(['/clubs']),
      roles: ['super-admin'],
    },
    {
      icon: 'golf_course',
      label: 'Field',
      action: () => this.router.navigate(['/chooseClub']),
      roles: ['super-admin'],
    },
    {
      icon: 'group',
      label: 'Team',
      action: () => this.router.navigate(['/chooseClubforTeam']),
      roles: ['super-admin'],
    },
    {
      icon: 'person',
      label: 'User',
      action: () => this.router.navigate(['/users']),
      roles: ['super-admin'],
    },
    {
      icon: 'event',
      label: 'Booking',
      action: () => this.router.navigate(['/chooseClubforBooking']),
      roles: [
        'super-admin',
        'club-admin',
        'field-admin',
        'team-manager',
        'individual-user',
      ],
    },
    //for club admin
    {
      icon: 'home',
      label: 'Club',
      action: () =>
        this.router.navigate([
          '/clubs/editClub',
          localStorage.getItem('current_role_id'),
        ]),
      roles: ['club-admin'],
    },
    {
      icon: 'golf_course',
      label: 'Field',
      action: () =>
        this.router.navigate([
          '/chooseClub/fields',
          localStorage.getItem('current_role_id'),
        ]),
      roles: ['club-admin'],
    },
    {
      icon: 'group',
      label: 'Team',
      action: () =>
        this.router.navigate([
          '/chooseClubforTeam/teams',
          localStorage.getItem('current_role_id'),
        ]),
      roles: ['club-admin'],
    },
    //for field admin
    {
      icon: 'golf_course',
      label: 'Field',
      action: () =>
        this.router.navigate([
          '/chooseClub/fields/editField',
          localStorage.getItem('current_role_id'),
        ]),
      roles: ['field-admin'],
    },
    //for team manager
    {
      icon: 'group',
      label: 'Team',
      action: () =>
        this.router.navigate([
          '/chooseClubforTeam/teams/editTeam',
          localStorage.getItem('current_role_id'),
        ]),
      roles: ['team-manager'],
    },
  ];

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

  // In your component
  // In your component
  navigateToTeams() {
    const club = localStorage.getItem('current_role');
    const clubId = club ? JSON.parse(club).id : null;

    if (clubId) {
      this.router.navigate(['/chooseClubforTeam/teams', clubId]);
    } else {
      // Handle case where no club is selected
      this.router.navigate(['/club-selection']);
      // Or show a toast: "Please select a club first"
    }
  }

  // getTeamRoute() {
  //   const clubId = localStorage.getItem('current_role_id');
  //   if (!clubId) {
  //     // Handle case where clubId isn't set
  //     this.router.navigate(['/club-selection']);
  //     return '';
  //   }
  //   return `/chooseClubforTeam/teams/${clubId}`;
  // }
  private filterMenuItems() {
    const currentRole = this.authService.currentRole();
    const currentRoleType = currentRole?.type || '';
    const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';

    console.log('Current role type:', currentRoleType);
    console.log('Is super admin:', isSuperAdmin);

    this.filteredMenuItems = this.allMenuItems.filter((item) => {
      // Super admin sees everything
      if (isSuperAdmin) return true;

      // Check if current role has access
      if (currentRoleType && item.roles.includes(currentRoleType)) {
        return true;
      }

      // Additional checks for specific cases
      // if (currentRoleType === 'club-admin') {
      //   // Club admins might need special access to some team manager features
      //   if (
      //     item.route === '/chooseClubforTeam' &&
      //     currentRole?.name?.includes('Club Admin')
      //   ) {
      //     return true;
      //   }
      // }

      return false;
    });

    console.log('Filtered menu items:', this.filteredMenuItems);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
