import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserStore } from '../store/user.store';
import { UserTier } from '../enums/user-tier.enum';

const isProfileComplete = (userStore: UserStore) => {
  const profile = userStore.getProfile();
  return !!profile?.gender && !!profile?.region;
}

export const requireOnboarding = (shouldBeOnboarded: boolean): CanActivateFn => () => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const user = userStore.getUser();

  if (!user || user.tier === UserTier.Free) return true;

  const complete = isProfileComplete(userStore);

  if (shouldBeOnboarded && !complete) {
    router.navigate(['/onboarding']);
    return false;
  }

  if (!shouldBeOnboarded && complete) {
    router.navigate(['/dashboard']);
    return false;
  }
  
  return true;
}