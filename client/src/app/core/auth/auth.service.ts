import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs';
import { User } from '../api/models/user.model';
import { ApiService } from '../services/api.service';
import { RegisterRequest } from '../api/requests/register.request';
import { SaveUserRequest } from '../api/requests/save-user.request';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(private router: Router, private api: ApiService) {}

  login(identifier: string, password: string) {
    return this.api.post('auth/login', { identifier, password }).pipe(
      tap((res: any) => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);
      })
    );
  }

  register(request: RegisterRequest) {
    return this.api.post('auth/register', request).pipe(
      tap((res: any) => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);
      })
    );
  }
  
  //Overwriting identity claims so we need to refresh our tokens
  saveUser(request: SaveUserRequest) {
    return this.api.post('auth/save', request).pipe(
      tap((res: any) => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.router.navigate(['/login']);
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

  refresh() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.api.post('auth/refresh', { refreshToken: refreshToken }).pipe(
      tap((res: any) => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);
      })
    );
  }

  getCurrentUser(): User | null {
    const token = this.getAccessToken();
    if (!token) return null;

    //We use claims instead of an async call since all other user data
    //can be looked up with in async call using userId
    try {
      const decoded: any = jwtDecode(token);
      const user = {
        id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        username: decoded['username'],
        email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        tier: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      } as User;

      return user;

    } catch (e) {
      console.error('Failed to decode token', e);
      return null;
    }
  }
}
