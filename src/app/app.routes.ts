import { Routes } from '@angular/router';
import { CreateClubComponent } from './pages/club/create-club/create-club.component';
import { ClubListComponent } from './pages/club/club-list/club-list.component';

export const routes: Routes = [
    { path: 'clubs/createClub', component: CreateClubComponent },
    { path: 'clubs', component: ClubListComponent }
];
