import { Routes } from '@angular/router';
import { CreateClubComponent } from './pages/club/create-club/create-club.component';
import { ClubListComponent } from './pages/club/club-list/club-list.component';
import { ClubCardComponent } from './pages/club/club-card/club-card.component';
import { FieldListComponent } from './pages/field/field-list/field-list.component';
import { CreateFieldComponent } from './pages/field/create-field/create-field.component';

export const routes: Routes = [
    { path: 'clubs/createClub', component: CreateClubComponent },
    { path: 'clubs', component: ClubListComponent },
    { path: 'chooseClub', component: ClubCardComponent },
    { path: 'chooseClub/fields/:clubId', component: FieldListComponent },
    { path: 'chooseClub/fields/createField/:clubId', component: CreateFieldComponent}
];
