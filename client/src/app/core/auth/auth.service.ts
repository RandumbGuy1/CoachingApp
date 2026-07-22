import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, Observable, of, tap, filter, take, switchMap } from 'rxjs';
import { User } from '../api/models/user.model';
import { ApiService } from '../services/api.service';
import { SaveUserRequest } from '../api/requests/save-user.request';
import { UserService } from '../services/user.service';
import { MembershipService } from '../services/membership.service';
import { UserStore } from '../store/user.store';
import { MembershipStore } from '../store/membership.store';
import { diff } from '../utils/diff.util';
import { WorkOSService } from './workos.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private router: Router,
    private api: ApiService,
    private userService: UserService,
    private membershipService: MembershipService,
    private userStore: UserStore,
    private membershipStore: MembershipStore,
    private workosService: WorkOSService,
  ) {}

  bootstrapFromStorage(): Observable<any> {
    return this.workosService.isReady().pipe(
      filter(ready => ready),
      take(1),
      switchMap(() => {
        if (!this.workosService.getUser()) return of(null);

        return this.userService.getCurrentUser().pipe(
          switchMap(() => forkJoin([
            this.userService.getUserProfile().pipe(catchError(() => of(null))),
            this.membershipService.loadMemberships().pipe(catchError(() => of(null))),
          ])),
          catchError(() => of(null))
        );
      })
    );
  }

  saveUser(request: SaveUserRequest) {
    const user = this.userStore.getUser();
    const current = user ? { username: user.username, tier: user.tier } as SaveUserRequest : {};
    const changes = diff(current, request);

    return this.api.post<User>('auth/save', changes).pipe(
      tap(updatedUser => this.userStore.setUser(updatedUser))
    );
  }

  async logout() {
    await this.workosService.signOut();

    this.userStore.clear();
    this.membershipStore.clear();

    if (this.router.navigated && !this.router.url.startsWith('/login')) {
      this.router.navigate(['/']);
    }
  }

  isLoggedIn(): boolean {
    return !!this.workosService.getUser();
  }
}