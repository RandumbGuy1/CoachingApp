import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { UserProfile } from '../models/user-profile.model';
import { SaveProfileRequest } from '../models/save-profile-request.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService, private auth: AuthService) {}

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
    return this.api.get<UserProfile>('me/profile');
  }

  saveUserProfile(request: SaveProfileRequest) {
    return this.api.post<UserProfile>('me/profile/save', request).pipe(
      tap((updatedProfile) => { return updatedProfile; }),
    );
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.api.post<UserProfile>('me/profile/avatar', formData).pipe(
      tap((updatedProfile) => { return updatedProfile; })
    );
  }
}
