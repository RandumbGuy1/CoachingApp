import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Select } from 'primeng/select';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/services/user.service';
import { UserStore } from '../../core/store/user.store';
import { SaveUserRequest } from '../../core/api/requests/save-user.request';
import { SaveProfileRequest } from '../../core/api/requests/save-profile.request';
import { GENDER_OPTIONS } from '../../core/enums/gender.enum';
import { REGION_OPTIONS } from '../../core/enums/region.enum';
import { TIER_OPTIONS } from '../../core/enums/user-tier.enum';

@Component({
  selector: 'app-onboarding',
  imports: [FormsModule, Select],
  templateUrl: './onboarding.html',
})
export class OnboardingPage {
  userRequest: SaveUserRequest;
  profileRequest: SaveProfileRequest = {};
  error = '';

  genderOptions = GENDER_OPTIONS;
  regionOptions = REGION_OPTIONS;
  tierOptions = TIER_OPTIONS;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    userStore: UserStore,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    const user = userStore.getUser();
    this.userRequest = { username: user?.username, tier: user?.tier };
  }

  complete() {
    this.error = '';
    this.authService.saveUser(this.userRequest).subscribe({
      next: () => this.userService.saveUserProfile(this.profileRequest).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err: HttpErrorResponse) => {
          this.error = err.error || err.message || 'Failed to save profile.';
          this.cdr.detectChanges();
        },
      }),
      error: (err: HttpErrorResponse) => {
        this.error = err.error || err.message || 'Failed to save account.';
        this.cdr.detectChanges();
      },
    });
  }
}
