import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserStore } from '../store/user.store';
import { UserTier } from '../enums/user-tier.enum';

export const requireLogin = (shouldBeLoggedIn: boolean): CanActivateFn => () => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const isLoggedIn = !!userStore.getUser();
  const tier = userStore.getUser()?.tier;

  //No login must go back to landing
  if (shouldBeLoggedIn && !isLoggedIn) {
    router.navigate(['/']);
    return false;
  }

  //If we're logged and and only a free user we should only go back to landing
  if (!shouldBeLoggedIn && isLoggedIn) {
    router.navigate([tier === UserTier.Free ? '/' : '/dashboard']);
    return false;
  }

  return true;
};
