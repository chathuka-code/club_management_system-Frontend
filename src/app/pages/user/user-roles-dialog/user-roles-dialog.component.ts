import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ClubService } from '../../club/club.service';
import { FieldService } from '../../field/field.service';
import { TeamService } from '../../team/team.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-roles-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './user-roles-dialog.component.html',
  styleUrls: ['./user-roles-dialog.component.css'],
})
export class UserRolesDialogComponent implements OnInit {
  private clubService = inject(ClubService);
  private fieldService = inject(FieldService);
  private teamService = inject(TeamService);

  roles: string[] = ['Admin', 'Editor', 'Viewer'];
  selectedRoles: string[] = [];
  clubNames: { name: string; id: string }[] = [];
  fields: { name: string; id: string }[] = [];
  teams: { name: string; id: string }[] = [];

  private _selectedClub: string = '';
  get selectedClub(): string {
    return this._selectedClub;
  }
  set selectedClub(value: string) {
    this._selectedClub = value;
    if (value) {
      this.onClubSelected(value);
    }
  }

  private _forTeamManager: string = '';
  get forTeamManager(): string {
    return this._forTeamManager;
  }
  set forTeamManager(value: string) {
    this._forTeamManager = value;
    if (value) {
      this.onClubSelectedforFields(value);
    }
  }

  selectedField: string = '';

  selectedTeam: string = '';

  forClubAdmin: string = '';

  //to get fields
  onClubSelected(clubId: string): void {
    this.fieldService.getAllFields(clubId).subscribe((fields) => {
      this.fields = fields.map((field) => ({
        name: field.fieldName,
        id: field['id'],
      }));
      console.log('Fieldsxyz:', fields);
    });
  }

  //to get teams
  onClubSelectedforFields(clubId: string): void {
    this.teamService.getAllTeams(clubId).subscribe((teams) => {
      this.teams = teams.map((team) => ({
        name: team.teamName,
        id: team['id'],
      }));
      console.log('Teams:', teams);
    });
  }

  constructor(
    public dialogRef: MatDialogRef<UserRolesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.selectedRoles) {
      this.selectedRoles = [...data.selectedRoles];
    }
  }

  ngOnInit(): void {
    this.clubService.getAllClubs().subscribe((clubs) => {
      this.clubNames = clubs.map((club) => ({
        name: club.clubName,
        id: club['id'],
      }));
      console.log('Clubs:', this.clubNames);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.selectedRoles);
  }
}
