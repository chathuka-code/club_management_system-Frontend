import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    // First check if token exists in localStorage
    const tokenExists = !!localStorage.getItem('auth_token');
    
    if (!tokenExists) {
      this.router.navigate(['/login']);
      return of(false);
    }

    // If token exists, verify auth state
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuth => {
        if (!isAuth) {
          // Token exists but auth state isn't set - initialize it
          this.authService.initializeAuthState();
          return true; // Allow access while state initializes
        }
        return true;
      })
    );
  }
}