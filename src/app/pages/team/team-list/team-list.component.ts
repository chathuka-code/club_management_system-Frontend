import { Component, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { TableColumn } from '../../../components/table/table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamService, Team } from '../team.service';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [TableComponent, MatButtonModule],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.css',
})
export class TeamListComponent implements OnInit {
  constructor(private router: Router, private dialog: MatDialog) {}

  private route = inject(ActivatedRoute);
  private teamService = inject(TeamService);
  clubId: string | null = null;
  teamData = signal<Team[]>([]);
  selectedRowIds: string[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.clubId = params.get('clubId');
      console.log('Received clubId:', this.clubId);
    });
    if (this.clubId) {
      this.teamService.getAllTeams(this.clubId).subscribe((teams: Team[]) => {
        this.teamData.set(teams);
      });
    }
  }

  teamColumns: TableColumn[] = [
    { key: 'teamName', label: 'Team Name' },
    { key: 'sportCategory', label: 'Sport Category' },
  ];

  selectedRows: any[] = [];

  navigateToCreateTeam() {
    this.router.navigate(['chooseClubforTeam/teams/createTeam', this.clubId]);
  }

  handleSelectedRows(selectedRows: any[]) {
    this.selectedRowIds = selectedRows.map((row) => row.id);
  }

  deleteTeams() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete these teams?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.clubId) {
        this.teamService.deleteTeams(this.selectedRowIds).subscribe(() => {
          this.teamService
            .getAllTeams(this.clubId!)
            .subscribe((teams: Team[]) => {
              this.teamData.set(teams);
            });
        });
      }
    });
  }

  handleEdit(teamId: string) {
    this.router.navigate(['chooseClubforTeam/teams/editTeam', teamId]);
  }
}
