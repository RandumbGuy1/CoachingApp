import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const role = auth.getCurrentUser()?.role;
  const isCoach = role === 'Coach';

  if (!isCoach) router.navigate(['/']);
  return isCoach;
};
