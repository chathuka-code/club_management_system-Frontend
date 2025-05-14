import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { RoleOption } from '../../components/header/header.component';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://localhost:7224/api/Auth';
  private _isAuthenticated = signal(false);
  private _isSuperAdmin = signal(false);
  private _userRoles = signal({
    clubAdmins: [] as { Id: string; ClubName: string }[],
    teamManagers: [] as { Id: string; TeamName: string }[],
    fieldAdmins: [] as { Id: string; FieldName: string }[],
  });
  isAuthenticated = this._isAuthenticated.asReadonly();

  // Expose as readonly signals
  isAuthenticated$ = toObservable(this._isAuthenticated);
  isSuperAdmin = this._isSuperAdmin.asReadonly();
  userRoles = this._userRoles.asReadonly();

  //header usage
  private _currentRole = signal<RoleOption | null>(null);
  currentRole = this._currentRole.asReadonly();
  currentRole$ = toObservable(this._currentRole);

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<{
        token: string;
        isSuperAdmin: boolean;
        userId: string;
        roles: {
          clubAdmins: { Id: string; ClubName: string }[];
          teamManagers: { Id: string; TeamName: string }[];
          fieldAdmins: { Id: string; FieldName: string }[];
        };
      }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('auth_token', response.token);

          this.setAuthState(
            response.token,
            response.isSuperAdmin,
            response.userId,
            response.roles
          );
        })
      );
  }

  signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, {
      firstName,
      lastName,
      email,
      password,
    });
  }

  initializeAuthState() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    this._isAuthenticated.set(true);
    this._isSuperAdmin.set(localStorage.getItem('is_super_admin') === 'true');
    this._userRoles.set(
      JSON.parse(
        localStorage.getItem('user_roles') ||
          '{"clubAdmins":[],"teamManagers":[],"fieldAdmins":[]}'
      )
    );

    const role = localStorage.getItem('current_role');
    this._currentRole.set(role ? JSON.parse(role) : null);
  }

  private setAuthState(
    token: string,
    isSuperAdmin: boolean,
    userId: string,
    roles: {
      clubAdmins: { Id: string; ClubName: string }[];
      teamManagers: { Id: string; TeamName: string }[];
      fieldAdmins: { Id: string; FieldName: string }[];
    }
  ) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('is_super_admin', String(isSuperAdmin));
    localStorage.setItem('user_roles', JSON.stringify(roles));
    localStorage.setItem('user_id', userId);

    this._isAuthenticated.set(true);
    this._isSuperAdmin.set(isSuperAdmin);
    this._userRoles.set(roles);
  }

  logout() {
    const userId = localStorage.getItem('user_id');
    // Clear all auth-related storage
    [
      'auth_token',
      'is_super_admin',
      'user_roles',
      'current_role',
      'user_id',
    ].forEach((key) => {
      localStorage.removeItem(key);
    });

    // Reset all signals
    this._isAuthenticated.set(false);
    this._isSuperAdmin.set(false);
    this._userRoles.set({
      clubAdmins: [],
      teamManagers: [],
      fieldAdmins: [],
    });
    this._currentRole.set(null);

    // Update server about logout
    if (userId) {
      this.userService.updateUserActiveRole(userId, null, null).subscribe();
    }
    this.router.navigate(['/login']);
  }

  setCurrentRole(role: RoleOption | null) {
    this._currentRole.set(role);
    if (role) {
      localStorage.setItem('current_role', JSON.stringify(role));
    } else {
      localStorage.removeItem('current_role');
    }
  }

  getCurrentRole(): RoleOption | null {
    const role = localStorage.getItem('current_role');
    console.log(
      'Current role from localStorage:',
      role ? JSON.parse(role) : null
    );
    return role ? JSON.parse(role) : null;
  }

  // Call this after successful login
  initializeRoles() {
    const role = this.getCurrentRole();
    if (role) {
      this._currentRole.set(role);
    }
  }
}
