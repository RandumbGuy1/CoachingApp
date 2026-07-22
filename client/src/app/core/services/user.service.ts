import { Injectable } from '@angular/core';
import { of, switchMap, tap } from 'rxjs';
import { ApiService } from './api.service';
import { UserProfile } from '../api/models/user-profile.model';
import { SaveProfileRequest } from '../api/requests/save-profile.request';
import { UserStore } from '../store/user.store';
import { diff } from '../utils/diff.util';
import { MembershipStore } from '../store/membership.store';
import { User } from '../api/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService, private userStore: UserStore, private membershipStore: MembershipStore) {}

  getCurrentUser() {
    return this.api.get<User>(`users/me`).pipe(
      tap(user => this.userStore.setUser(user))
    );
  }

  getUserProfile() {
    return this.api.get<UserProfile>('users/me/profile').pipe(
      tap(profile => this.userStore.setProfile(profile))
    );
  }

  saveUserProfile(request: SaveProfileRequest) {
    const current = this.userStore.getProfile() as SaveProfileRequest;
    const changes = diff(current, request);

    return this.api.post<UserProfile>('users/me/profile/save', changes).pipe(
      tap(updated => this.userStore.updateProfile(updated))
    );
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.api.post('users/me/profile/avatar', formData);
  }

  saveProfileAndAvatar(request: SaveProfileRequest, file: File | null) {
    return this.saveUserProfile(request).pipe(
      switchMap(() => file ? this.uploadAvatar(file) : of(null)),
      switchMap(() => this.getUserProfile())
    );
  }
}
