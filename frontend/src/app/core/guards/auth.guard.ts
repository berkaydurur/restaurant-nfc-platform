import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Check token in localStorage directly in case page refreshed
  const token = localStorage.getItem('nfc_token');
  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
