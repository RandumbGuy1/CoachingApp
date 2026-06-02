import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SaveProfileRequest } from '../../core/models/save-profile-request.model';
import { UserProfile } from '../../core/models/user-profile.model';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
})
export class ProfilePage {
  request: SaveProfileRequest = {};

  currentUsername: string = '';
  currentProfile: UserProfile | null = null;
  selectedImage: File | null = null

  error: string = '';

  constructor(public router: Router, private userService: UserService, private auth: AuthService) {}

  loadProfile() {
    this.error = '';
    this.currentUsername = this.auth.getCurrentIdentity()?.username || '';
    
    this.userService.getUserProfile()?.subscribe({
      next: (profile: UserProfile) => {
        this.currentProfile = profile;

        this.request = {
          username: this.currentUsername,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.avatarUrl,
          bio: profile.bio,
          gender: profile.gender,
          region: profile.region,
          theme: profile.theme,
          receiveEmailNotifications: profile.receiveEmailNotifications
        };
      },
      error: () => { this.error = 'Failed to load user and profile.'; },
    });
  }

  saveprofile() {
    //Only send profile changes to the backend, otherwise we might accidentally overwrite fields with default values
    const changes: SaveProfileRequest = {
      username: this.diffField(this.currentUsername, this.request.username),
      firstName: this.diffField(this.currentProfile?.firstName, this.request.firstName),
      lastName: this.diffField(this.currentProfile?.lastName, this.request.lastName),
      bio: this.diffField(this.currentProfile?.bio, this.request.bio),
      avatarUrl: this.diffField(this.currentProfile?.avatarUrl, this.request.avatarUrl),
      gender: this.diffField(this.currentProfile?.gender, this.request.gender),
      region: this.diffField(this.currentProfile?.region, this.request.region),
      theme: this.diffField(this.currentProfile?.theme, this.request.theme),
      receiveEmailNotifications: this.diffField(
        this.currentProfile?.receiveEmailNotifications,
        this.request.receiveEmailNotifications
      )
    };

    this.userService.saveUserProfile(changes).subscribe({
      next: () => { 
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.selectedImage = null;
      return;
    }

    this.selectedImage = input.files[0];
    this.request.avatarUrl = this.selectedImage.name;
  }

  diffField<T>(current: T | null | undefined, updated: T | null | undefined): T | null {
    return current === updated ? null : updated ?? null;
  }
}
