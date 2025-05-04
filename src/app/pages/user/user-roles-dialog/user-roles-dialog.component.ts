import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    MatTabsModule,
    CommonModule,
    MatIconModule,
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

  //to store assigned roles
  assignedClubAdmins = signal<{ clubId: string; clubName: string }[]>([]);
  assignedTeamManagers = signal<{ teamId: string; teamName: string }[]>([]);
  assignedFieldAdmins = signal<{ fieldId: string; fieldName: string }[]>([]);

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

  selectedField: { fieldId: string; fieldName: string } = {
    fieldId: '',
    fieldName: '',
  };

  selectedTeam: { teamId: string; teamName: string } = {
    teamId: '',
    teamName: '',
  };

  forClubAdmin: { clubId: string; clubName: string } = {
    clubId: '',
    clubName: '',
  };

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

  //to remove club admin
  removeClubAdmin(adminToRemove: any): void {
    this.assignedClubAdmins.update((admins) =>
      admins.filter((admin) => admin.clubId !== adminToRemove.clubId)
    );
  }

  removeTeamManager(managerToRemove: any): void {
    this.assignedTeamManagers.update((managers) =>
      managers.filter((manager) => manager.teamId !== managerToRemove.teamId)
    );
  }

  //to remove field admin
  removeFieldAdmin(adminToRemove: any): void {
    this.assignedFieldAdmins.update((admins) =>
      admins.filter((admin) => admin.fieldId !== adminToRemove.fieldId)
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close({
      clubAdmins: this.assignedClubAdmins(),
      teamManagers: this.assignedTeamManagers(),
      fieldAdmins: this.assignedFieldAdmins(),
    });
  }

  //assign button of club admin
  assignClubAdmin(): void {
    this.assignedClubAdmins.set([
      ...this.assignedClubAdmins(),
      {
        clubId: this.forClubAdmin.clubId,
        clubName: this.forClubAdmin.clubName,
      },
    ]);
  }

  //assign button of team manager
  assignTeamManager(): void {
    this.assignedTeamManagers.set([
      ...this.assignedTeamManagers(),
      {
        teamId: this.selectedTeam.teamId,
        teamName: this.selectedTeam.teamName,
      },
    ]);
  }

  //assign button of field admin
  assignFieldAdmin(): void {
    this.assignedFieldAdmins.set([
      ...this.assignedFieldAdmins(),
      {
        fieldId: this.selectedField.fieldId,
        fieldName: this.selectedField.fieldName,
      },
    ]);
  }
}
