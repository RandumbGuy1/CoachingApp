import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SaveProfileRequest } from '../../core/api/requests/save-profile.request';
import { UserService } from '../../core/services/user.service';
import { genderOptions } from '../../core/enums/gender.enum';
import { regionOptions } from '../../core/enums/region.enum';
import { themeOptions } from '../../core/enums/app-theme.enum';
import { Select } from "primeng/select";
import { ToggleSwitch } from "primeng/toggleswitch";
import { UserStore } from '../../core/store/user.store';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, Select, ToggleSwitch],
  templateUrl: './profile.html',
})
export class ProfilePage {
  request: SaveProfileRequest = {};
  selectedImage: File | null = null
  previewUrl: string | null = null;

  error: string = '';

  genderOptions = genderOptions;
  regionOptions = regionOptions;
  themeOptions = themeOptions;

  constructor(public userService: UserService, public userStore: UserStore) {}

  ngOnInit() {
    this.error = '';
    this.userService.getUserProfile().subscribe({
      error: () => { this.error = 'Failed to load user and profile.'; }
    });

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
      }
    });
  }

  saveprofile() {
    this.error = '';
    this.userService.saveProfileAndAvatar(this.request, this.selectedImage)
      .subscribe({
        next: () => this.selectedImage = null,
        error: () => this.error = 'Failed to save profile.'
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.selectedImage = null;
      return;
    }

    //Select any new files for avatar upload and show preview
    this.selectedImage = input.files[0];
    this.request.avatarUrl = this.selectedImage.name;
    this.previewUrl = URL.createObjectURL(this.selectedImage);
  }
}
