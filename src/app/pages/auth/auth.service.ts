import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

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

  // Expose as readonly signals
  isAuthenticated = signal(this._isAuthenticated.asReadonly());
  isSuperAdmin = this._isSuperAdmin.asReadonly();
  userRoles = this._userRoles.asReadonly();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<{
      token: string;
      isSuperAdmin: boolean;
      roles: {
        clubAdmins: { Id: string; ClubName: string }[];
        teamManagers: { Id: string; TeamName: string }[];
        fieldAdmins: { Id: string; FieldName: string }[];
      };
    }>(`${this.apiUrl}/login`, { email, password });
  }

  initializeAuthState() {
    const token = localStorage.getItem('auth_token');
    const isSuperAdmin = localStorage.getItem('is_super_admin') === 'true';
    const roles = JSON.parse(
      localStorage.getItem('user_roles') ||
        '{"clubAdmins": [], "teamManagers": [], "fieldAdmins": []}'
    );

    this._isAuthenticated.set(!!token);
    this._isSuperAdmin.set(isSuperAdmin);
    this._userRoles.set(roles);
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('is_super_admin');
    localStorage.removeItem('user_roles');
    this._isAuthenticated.set(false);
    this._isSuperAdmin.set(false);
    this._userRoles.set({
      clubAdmins: [],
      teamManagers: [],
      fieldAdmins: [],
    });
    this.router.navigate(['/login']);
  }

  // Call this in your app initialization
  checkAuthStatus() {
    this.initializeAuthState();
  }
}
