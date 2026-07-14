import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SaveProfileRequest } from '../../core/api/requests/save-profile.request';
import { UserService } from '../../core/services/user.service';
import { GENDER_OPTIONS } from '../../core/enums/gender.enum';
import { REGION_OPTIONS } from '../../core/enums/region.enum';
import { THEME_OPTIONS } from '../../core/enums/app-theme.enum';
import { Select } from "primeng/select";
import { ToggleSwitch } from "primeng/toggleswitch";
import { UserStore } from '../../core/store/user.store';
import { SaveUserRequest } from '../../core/api/requests/save-user.request';
import { TIER_OPTIONS } from '../../core/enums/user-tier.enum';
import { AuthService } from '../../core/auth/auth.service';
import { ForgotPasswordModalService } from '../../core/services/forgot-password-modal.service';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar.component';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, Select, ToggleSwitch, UserAvatarComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfilePage {
  request: SaveProfileRequest = {};
  selectedImage: File | null = null;
  previewUrl: string | null = null;

  error: string = '';
  errorUser: string = '';

  requestUser: SaveUserRequest = { currentPassword: '' };
  newPassword: string = '';

  genderOptions = GENDER_OPTIONS;
  regionOptions = REGION_OPTIONS;
  themeOptions = THEME_OPTIONS;
  tierOptions = TIER_OPTIONS;

  constructor(
    public userService: UserService,
    private authService: AuthService,
    public userStore: UserStore,
    private cdr: ChangeDetectorRef,
    private forgotPasswordModal: ForgotPasswordModalService,
  ) {}

  ngOnInit() {
    this.userStore.profile$.subscribe(profile => {
      this.request = {
        avatarUrl: profile?.avatarUrl,
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        bio: profile?.bio,
        gender: profile?.gender,
        region: profile?.region,
        theme: profile?.theme,
        receiveEmailNotifications: profile?.receiveEmailNotifications,
      };
    });

    this.userStore.user$.subscribe(user => {
      this.requestUser = {
        currentPassword: '',
        username: user?.username,
        email: user?.email,
        tier: user?.tier,
      };
    });
  }

  saveProfile() {
    this.error = '';
    this.userService.saveProfileAndAvatar(this.request, this.selectedImage).subscribe({
      next: () => this.selectedImage = null,
      error: (err: HttpErrorResponse) => {
        this.error = err.error || err.message || 'Failed to save profile.';
        this.cdr.detectChanges();
      },
    });
  }

  saveUser() {
    this.errorUser = '';
    this.requestUser.newPassword = this.newPassword;
    this.authService.saveUser(this.requestUser).subscribe({
      next: () => {
        this.requestUser.currentPassword = '',
        this.newPassword = '';
      },
      error: (err: HttpErrorResponse) => {
        this.errorUser = err.error || err.message || 'Failed to save user.';
        this.cdr.detectChanges();
      },
    });
  }

  onChangePasswordModalOpen() {
    this.forgotPasswordModal.open();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.selectedImage = null;
      return;
    }

    this.selectedImage = input.files[0];
    this.request.avatarUrl = this.selectedImage.name;
    this.previewUrl = URL.createObjectURL(this.selectedImage);
  }
}
