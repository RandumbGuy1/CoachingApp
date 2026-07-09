import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '../store/user.store';
import { UserTier } from '../enums/user-tier.enum';

export const roleGuard: CanActivateFn = () => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const tier = userStore.getUser()?.tier;
  const isPremium = tier === UserTier.Pro || tier === UserTier.Enterprise;

  if (!isPremium) router.navigate(['/']);
  return isPremium;
};
