import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ApiService } from './api.service';
import { User } from '../api/models/user.model';
import { UserProfile } from '../api/models/user-profile.model';
import { SaveProfileRequest } from '../api/requests/save-profile-request.model';
import { UserStore } from '../store/user.store';
import { diff } from '../utils/diff.util';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService, private auth: AuthService, private userStore: UserStore) {}

  getCurrentUser() {
    const identity = this.auth.getCurrentIdentity();
    if (!identity) return null;

    return this.api.get('me').pipe(
      map((res: any) => {
        return {
          ...identity,
          profile: res.profile,
          memberships: res.memberships
        } as User;
    }));
  }

  getUserProfile() {
    return this.api.get<UserProfile>('me/profile').pipe(
      tap(profile => this.userStore.setProfile(profile))
    );
  }

  saveUserProfile(request: SaveProfileRequest) {
    const current = this.userStore.getProfile() as SaveProfileRequest;
    const changes = diff(current, request);

    return this.api.post<UserProfile>('me/profile/save', changes).pipe(
      tap(updated => this.userStore.updateProfile(updated))
    );
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.api.post<UserProfile>('me/profile/avatar', formData);
  }
}
