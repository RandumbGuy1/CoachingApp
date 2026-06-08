import { Component, ɵɵNgModuleDeclaration } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SaveProfileRequest } from '../../core/api/requests/save-profile.request';
import { UserProfile } from '../../core/api/models/user-profile.model';
import { UserService } from '../../core/services/user.service';
import { genderOptions } from '../../core/enums/gender.enum';
import { regionOptions } from '../../core/enums/region.enum';
import { themeOptions } from '../../core/enums/app-theme.enum';
import { Select } from "primeng/select";

@Component({
  selector: 'app-profile',
  imports: [FormsModule, Select],
  templateUrl: './profile.html',
})
export class ProfilePage {
  request: SaveProfileRequest = {};
  selectedImage: File | null = null

  error: string = '';

  genderOptions = genderOptions;
  regionOptions = regionOptions;
  themeOptions = themeOptions;

  constructor(public router: Router, private userService: UserService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    //NOTE: This is the component to modify user profile, so we want to start with the most recent data from the server instead of the cached profile in the store. 
    // This ensures we don't accidentally overwrite any changes that were made to the profile from another session or tab.
    this.error = '';
    this.userService.getUserProfile()?.subscribe({
      next: (profile: UserProfile) => {
        this.request = profile as SaveProfileRequest;
      },
      error: () => { this.error = 'Failed to load user and profile.'; },
    });
  }

  saveprofile() {
    this.userService.saveUserProfile(this.request).subscribe({
      next: () => { 
        //Upload avatar if a new image was selected, otherwise just reload profile to get any changes
        if (this.selectedImage) {
          this.userService.uploadAvatar(this.selectedImage).subscribe({
            next: () => { this.loadProfile(); },
            error: () => { this.error = 'Failed to upload avatar.'; }
          });
        } else {
          this.loadProfile();
        }
      },
      error: () => { this.error = 'Failed to save profile.'; }
    });
  }

  //Select any new files for avatar upload
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.selectedImage = null;
      return;
    }

    this.selectedImage = input.files[0];
    this.request.avatarUrl = this.selectedImage.name;
  }
}
