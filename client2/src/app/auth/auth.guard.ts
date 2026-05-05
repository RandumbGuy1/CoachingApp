import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = auth.isLoggedIn();

  if (!isLoggedIn) router.navigate(['/login']);
  return isLoggedIn;
};
