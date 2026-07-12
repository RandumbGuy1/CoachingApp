import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '../store/user.store';
import { UserTier } from '../enums/user-tier.enum';

const TIER_RANK: Record<UserTier, number> = {
  [UserTier.Free]: 0,
  [UserTier.Lite]: 1,
  [UserTier.Pro]: 2,
};

const TIER_URLS: Record<UserTier, string> = {
  [UserTier.Free]: '/',
  [UserTier.Lite]: '/',
  [UserTier.Pro]: '/dashboard',
};

export const requireTier = (minimum: UserTier): CanActivateFn => () => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const tier = userStore.getUser()?.tier ?? UserTier.Free;

  if (TIER_RANK[tier] < TIER_RANK[minimum]) {
    router.navigate([TIER_URLS[minimum]]);
    return false;
  }

  return true;
};