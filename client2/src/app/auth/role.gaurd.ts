import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserTier } from '../services/user.service';

export const roleGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const tier = auth.getCurrentIdentity()?.tier;
  const isPremium = tier === UserTier.Pro || tier === UserTier.Enterprise;

  if (!isPremium) router.navigate(['/']);
  return isPremium;
};
