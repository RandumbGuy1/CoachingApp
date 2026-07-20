import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { ForgotPasswordModalService } from '../../core/services/forgot-password-modal.service';
import { WorkOSService } from '../../core/auth/workos.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage {
  identifier = '';
  password = '';
  error = '';
  logoUrl = 'assets/images/logo.png';
  isWorkOSLoading = false;

  constructor(
    public router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    public forgotPasswordModal: ForgotPasswordModalService,
    private workosService: WorkOSService,
  ) {}

  login() {
    this.authService.login({ identifier: this.identifier, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err: HttpErrorResponse) => {
        this.error = err.error || err.message || 'An error occurred during login.';
        this.cdr.detectChanges();
      },
    });
  }

  async signInWithWorkOS() {
    this.isWorkOSLoading = true;
    this.error = '';
    this.cdr.detectChanges();

    try {
      await this.workosService.signIn();
      // signIn() handles the redirect, but if we get here with a user, navigate
      const user = this.workosService.getUser();
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    } catch (err: any) {
      this.error = err?.message || 'Sign in with WorkOS failed.';
      this.cdr.detectChanges();
    } finally {
      this.isWorkOSLoading = false;
      this.cdr.detectChanges();
    }
  }
}
