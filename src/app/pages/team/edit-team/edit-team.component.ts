import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeamService, Team } from '../team.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-team',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './edit-team.component.html',
  styleUrl: './edit-team.component.css',
})
export class EditTeamComponent implements OnInit {
  private teamService = inject(TeamService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  teamId: string | null = null;

  team: Team = {
    teamName: '',
    sportCategory: '',
    clubId: '',
    isDeleted: false,
  };
  isTeamOwned: Boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.teamId = params.get('teamId');
      console.log('Received teamId:', this.teamId);
    });

    if (this.teamId) {
      this.teamService.getTeamById(this.teamId).subscribe((team) => {
        this.team = team;

        this.teamId &&
          this.teamService.getTeamOwnership(this.teamId).subscribe({
            next: (response) => {
              console.log('Team data:', response);
              this.isTeamOwned = response;
            },
          });
      });
    } else {
      console.error('teamId is null');
    }
  }

  saveTeam() {
    if (this.teamId) {
      this.teamService.updateTeam(this.teamId, this.team).subscribe(() => {
        this.router.navigate(['chooseClubforTeam/teams', this.team.clubId]);
      });
    } else {
      console.error('teamId is null');
    }
  }

  deleteTeam() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this team?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.teamId) {
          this.teamService.deleteTeams([this.teamId]).subscribe({
            next: (response) => {
              console.log('Team deleted successfully:', response);
              this.router.navigate(['/teams']);
            },
            error: (err) => {
              console.error('Error deleting team:', err);
            },
          });
        }
      }
    });
  }

  deleteTeamManagers() {
    this.router.navigate([
      '/chooseClubforTeam/teams/editTeam/teamManagers',
      this.teamId,
    ]);
  }
}
