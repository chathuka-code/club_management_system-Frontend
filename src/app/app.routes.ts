import { Routes } from '@angular/router';
import { CreateClubComponent } from './pages/club/create-club/create-club.component';
import { ClubListComponent } from './pages/club/club-list/club-list.component';
import { ClubCardComponent } from './pages/club/club-card/club-card.component';
import { FieldListComponent } from './pages/field/field-list/field-list.component';
import { CreateFieldComponent } from './pages/field/create-field/create-field.component';
import { CreateTeamComponent } from './pages/team/create-team/create-team.component';
import { ClubCardTeamComponent } from './pages/team/club-card-team/club-card-team.component';
import { TeamListComponent } from './pages/team/team-list/team-list.component';
import { EditClubComponent } from './pages/club/edit-club/edit-club.component';
import { EditFieldComponent } from './pages/field/edit-field/edit-field.component';
import { EditTeamComponent } from './pages/team/edit-team/edit-team.component';
import { CreateUserComponent } from './pages/user/create-user/create-user.component';
import { UserListComponent } from './pages/user/user-list/user-list.component';

export const routes: Routes = [
  { path: 'clubs/createClub', component: CreateClubComponent },
  { path: 'clubs', component: ClubListComponent },
  { path: 'clubs/editClub/:clubId', component: EditClubComponent },
  { path: 'chooseClub', component: ClubCardComponent },

  { path: 'chooseClub/fields/:clubId', component: FieldListComponent },
  {
    path: 'chooseClub/fields/createField/:clubId',
    component: CreateFieldComponent,
  },
  {
    path: 'chooseClub/fields/editField/:fieldId',
    component: EditFieldComponent,
  },
  {
    path: 'chooseClubforTeam/teams/createTeam/:clubId',
    component: CreateTeamComponent,
  },
  { path: 'chooseClubforTeam', component: ClubCardTeamComponent },
  { path: 'chooseClubforTeam/teams/:clubId', component: TeamListComponent },
  {
    path: 'chooseClubforTeam/teams/editTeam/:teamId',
    component: EditTeamComponent,
  },

  //user routes
  {path: 'users/createUser', component: CreateUserComponent},
  {path: 'users', component: UserListComponent},
];
