import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, forkJoin, Observable, of, shareReplay, tap, throwError, finalize } from 'rxjs';
import { User } from '../api/models/user.model';
import { ApiService } from '../services/api.service';
import { RegisterRequest } from '../api/requests/register.request';
import { SaveUserRequest } from '../api/requests/save-user.request';
import { UserService } from '../services/user.service';
import { AuthResponse } from '../api/responses/auth.response';
import { LoginRequest } from '../api/requests/login.request';
import { MembershipService } from '../services/membership.service';
import { UserStore } from '../store/user.store';
import { MembershipStore } from '../store/membership.store';
import { diff } from '../utils/diff.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private refreshInProgress$: Observable<AuthResponse> | null = null;

  constructor(
    private router: Router,
    private api: ApiService,
    private userService: UserService,
    private membershipService: MembershipService,
    private userStore: UserStore,
    private membershipStore: MembershipStore
  ) {}

  bootstrapFromStorage(): Observable<any> {
    const user = this.getCurrentUser();
    if (!user) return of(null);

    this.userStore.setUser(user);
    return forkJoin([
      this.userService.getUserProfile().pipe(catchError(() => of(null))),
      this.membershipService.loadMemberships().pipe(catchError(() => of(null))),
    ]);
  }

  login(request: LoginRequest) {
    return this.api.post<AuthResponse>('auth/login', request).pipe(
      tap((res: AuthResponse) => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);
        this.userStore.setUser(this.getCurrentUser());

        this.userService.getUserProfile().subscribe();
        this.membershipService.loadMemberships().subscribe();
      })
    );
  }

  register(request: RegisterRequest) {
    return this.api.post<AuthResponse>('auth/register', request).pipe(
      tap((res: AuthResponse) => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);
        this.userStore.setUser(this.getCurrentUser());

        this.userService.getUserProfile().subscribe();
        this.membershipService.loadMemberships().subscribe();
      })
    );
  }

  saveUser(request: SaveUserRequest) {
    const user = this.userStore.getUser();
    const current = user ? {
      username: user.username,
      email: user.email,
      tier: user.tier,
    } as SaveUserRequest : {};

    const changes = diff(current, request);

    return this.api.post<AuthResponse>('auth/save', changes).pipe(
      tap((res: AuthResponse) => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);
        this.userStore.setUser(this.getCurrentUser());
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.userStore.clear();
    this.membershipStore.clear();
    if (this.router.navigated && !this.router.url.startsWith('/login')) {
      this.router.navigate(['/']);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  forgotPassword(email: string) {
    return this.api.post<void>('auth/forgot-password', { email });
  }

  verifyResetCode(email: string, code: string) {
    return this.api.post<void>('auth/verify-reset-code', { email, code });
  }

  resetPassword(email: string, code: string, newPassword: string) {
    return this.api.post<void>('auth/reset-password', { email, code, newPassword });
  }

  refresh(): Observable<AuthResponse> {
    if (this.refreshInProgress$) return this.refreshInProgress$;

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return throwError(() => new Error('No refresh token available'));

    this.refreshInProgress$ = this.api.post<AuthResponse>('auth/refresh', { refreshToken }).pipe(
      tap((res: AuthResponse) => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);
        this.userStore.setUser(this.getCurrentUser());
      }),
      finalize(() => this.refreshInProgress$ = null),
      shareReplay(1)
    );

    return this.refreshInProgress$;
  }

  private getCurrentUser(): User | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return {
        id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        username: decoded['username'],
        email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        tier: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      } as User;
    } catch (e) {
      console.error('Failed to decode token', e);
      return null;
    }
  }
}