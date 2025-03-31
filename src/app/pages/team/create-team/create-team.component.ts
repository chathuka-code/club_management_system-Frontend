import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TeamService, Team } from '../team.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-team',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './create-team.component.html',
  styleUrl: './create-team.component.css',
})
export class CreateTeamComponent implements OnInit {
  constructor() {}

  private teamService = inject(TeamService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.team.clubId = params.get('clubId') || '';
      console.log('Received clubId:', this.team.clubId);
    });
  }

  team: Team = {
    teamName: '',
    sportCategory: '',
    clubId: '',
    isDeleted: false,
  };

  createTeam() {
    this.teamService.createTeam(this.team);
  }
}
