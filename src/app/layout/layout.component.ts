import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditUserProfileDialogComponent } from '../pages/user/edit-user-profile-dialog/edit-user-profile-dialog.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <app-header></app-header>
    <div class="main-container">
      <app-nav-bar></app-nav-bar>
      <div class="content-container">
        <!-- Profile Icon Button -->
        <div class="profile-icon" (click)="openProfileDialog()">
          <mat-icon>person</mat-icon>
        </div>

        <!-- Routed Content -->
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrls: ['./layout.component.css'],
  imports: [
    HeaderComponent,
    NavBarComponent,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
  ],
})
export class LayoutComponent {
  private dialog = inject(MatDialog);

  openProfileDialog(): void {
    this.dialog.open(EditUserProfileDialogComponent, {
      width: '500px',
  height: 'auto',
      data: {},
    });
  }
}
