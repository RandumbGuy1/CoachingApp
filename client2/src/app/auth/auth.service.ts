import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:5268/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(private router: Router, private http: HttpClient) {}

  login(identifier: string, password: string) {
    return this.http.post(this.API_URL + '/login', { identifier, password }).pipe(
      tap((res: any) => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);
      })
    );
  }

  register(username: string, email: string, password: string, role: string) {
    return this.http.post(this.API_URL + '/register', { username, email, password, role }).pipe(
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

    return this.http.post<any>(this.API_URL + '/refresh', { refreshToken: refreshToken }).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);
      })
    );
  }

  getCurrentUser(): User | null {
    const token = this.getAccessToken();
    if (!token) return null;

    const decoded: any = jwtDecode(token);

    return {
      id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      username: decoded['username'],
      email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
    };
  }
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}
