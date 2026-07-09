import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile } from '../api/models/user-profile.model';
import { User } from '../api/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStore {
  private readonly user = new BehaviorSubject<User | null>(null);
readonly user$: Observable<User | null> = this.user.asObservable();

  private readonly profile = new BehaviorSubject<UserProfile | null>(null);
  readonly profile$: Observable<UserProfile | null> = this.profile.asObservable();

  defaultProfileImage: string = 'assets/images/avatar.svg';

  getUser(): User | null { 
    return this.user.value; 
  }

  setUser(user: User | null): void { 
    this.user.next(user); 
  }

  getProfile(): UserProfile | null {
    return this.profile.value;
  }

  setProfile(profile: UserProfile | null): void {
    this.profile.next(profile);
  }

  updateProfile(partial: Partial<UserProfile>): void {
    const current = this.profile.value;
    if (!current) return;

    this.profile.next({
      ...current,
      ...partial
    });
  }

  clear(): void {
    this.profile.next(null);
    this.user.next(null);
  }
}
