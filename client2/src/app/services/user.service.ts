import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { GroupMembership } from './groups.service';
import { AuthService } from '../auth/auth.service';
import { ApiService } from './api.service';
import { SaveProfileRequest } from '../pages/profile/profile';

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
      tap((updatedProfile) => {
        // Optionally update the local user profile cache here if you have one
      })
    );
  }
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;

  tier: UserTier;

  profile: UserProfile;
  memberships: GroupMembership[];
}

export enum UserTier {
  Enterprise = "Enterprise",
  Pro = "Pro",
  Free = "Free",
}

export interface UserProfile {
  id: string;
  userId: string;

  firstName: string;
  lastName: string;
  profilePictureURL: string;
  bio: string;

  gender?: Gender | null;
  timezone?: string | null;
  region?: Region | null;

  theme: AppTheme;
  receiveEmailNotifications: boolean;
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  NonBinary = "NonBinary",
  Other = "Other",
}

export enum AppTheme {
  Light = "Light",
  Dark = "Dark",
}

export enum Region {
  NorthAmerica = "NorthAmerica",
  Europe = "Europe",
  Asia = "Asia",
  SouthAmerica = "SouthAmerica",
  Africa = "Africa",
  Oceania = "Oceania",
  MiddleEast = "MiddleEast",
  Other = "Other",
}