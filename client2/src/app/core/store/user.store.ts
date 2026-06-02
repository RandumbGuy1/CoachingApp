import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserStore {

  private readonly profile = new BehaviorSubject<UserProfile | null>(null);
  readonly profile$: Observable<UserProfile | null> = this.profile.asObservable();

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
  }
}
