import { Component, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { TableColumn } from '../../../components/table/table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, User } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    TableComponent,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  userData = signal<User[]>([]);
  selectedRowIds: string[] = [];

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((users: User[]) => {
      this.userData.set(users);
    });
  }
  userColumns: TableColumn[] = [
    { key: 'firstName', label: 'First Name' },
    {key: 'lastName', label: 'Last Name'},
    { key: 'email', label: 'Email' },
    { key: 'isSuperAdmin', label: 'Is Super Admin' },
  ];

  selectedRows: any[] = [];

  navigateToCreateUser() {
    this.router.navigate(['users/createUser']);
  }

  handleSelectedRows(selectedRows: any[]) {
    this.selectedRowIds = selectedRows.map((row) => row.id);
  }

  handleEdit(teamId: string) {
    this.router.navigate(['chooseClubforTeam/teams/editTeam', teamId]);
  }
}
