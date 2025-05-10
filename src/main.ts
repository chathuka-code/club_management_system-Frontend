import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AuthService } from './app/pages/auth/auth.service';

bootstrapApplication(AppComponent, appConfig)
  .then(appRef => {
    // Get the AuthService instance after application is bootstrapped
    const authService = appRef.injector.get(AuthService);
    
    // Initialize authentication state
    authService.checkAuthStatus();
    
    // Optional: Log initialization
    console.log('Application bootstrapped, auth state initialized');
  })
  .catch((err) => console.error('Bootstrap error:', err));