import { Component } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-club-list',
  standalone: true,
  imports: [TableComponent, MatButtonModule],
  templateUrl: './club-list.component.html',
  styleUrl: './club-list.component.css',
})
export class ClubListComponent {
  constructor(private router: Router) {}

  navigateToCreateClub() {
    this.router.navigate(['/clubs/createClub']);
  }
}
