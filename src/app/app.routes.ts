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
import { EditUserComponent } from './pages/user/edit-user/edit-user.component';
import { ClubCardBookingComponent } from './pages/booking/club-card-booking/club-card-booking.component';
import { FieldCardBookingComponent } from './pages/booking/field-card-booking/field-card-booking.component';
import { CalendarComponent } from './pages/booking/calendar/calendar.component';
import { CreateBookingComponent } from './pages/booking/create-booking/create-booking.component';
import { EditBookingComponent } from './pages/booking/edit-booking/edit-booking.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { AuthGuard } from './pages/auth/auth.guard';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // All your existing routes go here as children
      {
        path: 'clubs/createClub',
        component: CreateClubComponent
      },
      { 
        path: 'clubs', 
        component: ClubListComponent
      },
      {
        path: 'clubs/editClub/:clubId',
        component: EditClubComponent
      },
      {
        path: 'chooseClub',
        component: ClubCardComponent
      },
      {
        path: 'chooseClub/fields/:clubId',
        component: FieldListComponent
      },
      {
        path: 'chooseClub/fields/createField/:clubId',
        component: CreateFieldComponent
      },
      {
        path: 'chooseClub/fields/editField/:fieldId',
        component: EditFieldComponent
      },
      {
        path: 'chooseClubforTeam/teams/createTeam/:clubId',
        component: CreateTeamComponent
      },
      {
        path: 'chooseClubforTeam',
        component: ClubCardTeamComponent
      },
      {
        path: 'chooseClubforTeam/teams/:clubId',
        component: TeamListComponent
      },
      {
        path: 'chooseClubforTeam/teams/editTeam/:teamId',
        component: EditTeamComponent
      },
      {
        path: 'users/createUser',
        component: CreateUserComponent
      },
      { 
        path: 'users', 
        component: UserListComponent
      },
      {
        path: 'users/editUser/:userId',
        component: EditUserComponent
      },
      {
        path: 'chooseClubforBooking',
        component: ClubCardBookingComponent
      },
      {
        path: 'chooseClubforBooking/chooseFieldforBooking/:clubId',
        component: FieldCardBookingComponent
      },
      {
        path: 'chooseClubforBooking/chooseFieldforBooking/calendar/:fieldId',
        component: CalendarComponent
      },
      {
        path: 'chooseClubforBooking/chooseFieldforBooking/calendar/createBooking/:fieldId',
        component: CreateBookingComponent
      },
      {
        path: 'chooseClubforBooking/chooseFieldforBooking/calendar/editBooking/:bookingId',
        component: EditBookingComponent
      },
      
      // Default route when accessing the base path
      { path: '', pathMatch: 'full', redirectTo: 'clubs' }
    ]
  },
  
  // Fallback route
  { path: '**', redirectTo: 'login' }
];