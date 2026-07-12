import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { ForgotPasswordModalService } from '../../core/services/forgot-password-modal.service';

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

  constructor(
    public router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    public forgotPasswordModal: ForgotPasswordModalService,
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
}
