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
import { UserService, User } from '../user.service';
@Component({
  selector: 'app-edit-user-roles-dialog',
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
  templateUrl: './edit-user-roles-dialog.component.html',
  styleUrl: './edit-user-roles-dialog.component.css',
})
export class EditUserRolesDialogComponent implements OnInit {
  private userService = inject(UserService);
  private clubService = inject(ClubService);
  private fieldService = inject(FieldService);
  private teamService = inject(TeamService);

  roles: string[] = ['Admin', 'Editor', 'Viewer'];
  selectedRoles: string[] = [];
  clubNames: { name: string; id: string }[] = [];
  fields: { name: string; id: string }[] = [];
  teams: { name: string; id: string }[] = [];

  //to store assigned roles
  assignedClubAdmins = signal<
    { userId: string; clubId: string; clubName: string }[]
  >([]);
  assignedTeamManagers = signal<
    { userId: string; teamId: string; teamName: string }[]
  >([]);
  assignedFieldAdmins = signal<
    { userId: string; fieldId: string; fieldName: string }[]
  >([]);

  //to store fetched assigned roles
  assignedClubAdminsFetched = signal<
    { userId: string; clubId: string; clubName: string }[]
  >([]);
  assignedTeamManagersFetched = signal<
    { userId: string; teamId: string; teamName: string }[]
  >([]);
  assignedFieldAdminsFetched = signal<
    { userId: string; fieldId: string; fieldName: string }[]
  >([]);

  //to get deleted roles
  assignedClubAdminsDeleted = signal<string[]>([]);
  assignedTeamManagersDeleted = signal<string[]>([]);
  assignedFieldAdminsDeleted = signal<string[]>([]);

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
    public dialogRef: MatDialogRef<EditUserRolesDialogComponent>,
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
      console.log('datafrommodel:', this.data.roles);
    });
    this.assignedClubAdminsFetched.set(this.data.roles.clubAdmins);
    this.assignedTeamManagersFetched.set(this.data.roles.teamManagers);
    this.assignedFieldAdminsFetched.set(this.data.roles.fieldAdmins);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close({
      clubAdmins: this.assignedClubAdmins(),
      teamManagers: this.assignedTeamManagers(),
      fieldAdmins: this.assignedFieldAdmins(),
      deletedClubAdmins: this.assignedClubAdminsDeleted(),
      deletedTeamManagers: this.assignedTeamManagersDeleted(),
      deletedFieldAdmins: this.assignedFieldAdminsDeleted(),
    });
  }

  //to remove club admin
  removeClubAdmin(adminToRemove: any): void {
    this.assignedClubAdmins.update((admins) =>
      admins.filter((admin) => admin.clubId !== adminToRemove.clubId)
    );

    this.assignedClubAdminsFetched.update((admins) => {
      const removedAdmins = admins.filter(
        (admin) => admin.clubId === adminToRemove.clubId
      );
      const removedClubIds = removedAdmins.map((admin) => admin.clubId);
      this.assignedClubAdminsDeleted.update((deleted) => [
        ...deleted,
        ...removedClubIds,
      ]);
      return admins.filter((admin) => admin.clubId !== adminToRemove.clubId);
    });

    console.log('removed:', this.assignedClubAdminsDeleted())
  }

  //to remove team manager
  removeTeamManager(managerToRemove: any): void {
    this.assignedTeamManagers.update((managers) =>
      managers.filter((manager) => manager.teamId !== managerToRemove.teamId)
    );

    this.assignedTeamManagersFetched.update((managers) => {
      const removedManagers = managers.filter(
        (manager) => manager.teamId === managerToRemove.teamId
      );
      const removedTeamIds = removedManagers.map((manager) => manager.teamId);
      this.assignedTeamManagersDeleted.update((deleted) => [
        ...deleted,
        ...removedTeamIds,
      ]);
      return managers.filter(
        (manager) => manager.teamId !== managerToRemove.teamId
      );
    });
    console.log('removedteams:', this.assignedTeamManagersDeleted())
  }

  //to remove field admin
  removeFieldAdmin(adminToRemove: any): void {
    this.assignedFieldAdmins.update((admins) =>
      admins.filter((admin) => admin.fieldId !== adminToRemove.fieldId)
    );

    this.assignedFieldAdminsFetched.update((admins) => {
      const removedAdmins = admins.filter(
        (admin) => admin.fieldId === adminToRemove.fieldId
      );
      const removedFieldIds = removedAdmins.map((admin) => admin.fieldId);
      this.assignedFieldAdminsDeleted.update((deleted) => [
        ...deleted,
        ...removedFieldIds,
      ]);
      return admins.filter((admin) => admin.fieldId !== adminToRemove.fieldId);
    });
  }

  //assign button of club admin
  assignClubAdmin(): void {
    this.assignedClubAdmins.set([
      ...this.assignedClubAdmins(),
      {
        userId: '',
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
        userId: '',
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
        userId: '',
        fieldId: this.selectedField.fieldId,
        fieldName: this.selectedField.fieldName,
      },
    ]);
  }
}
