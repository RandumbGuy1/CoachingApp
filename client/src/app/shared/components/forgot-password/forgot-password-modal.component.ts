import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { ForgotPasswordModalService } from '../../../core/services/forgot-password-modal.service';
import { AuthService } from '../../../core/auth/auth.service';

type Step = 'email' | 'code' | 'password' | 'done';

@Component({
  selector: 'app-forgot-password-modal',
  imports: [DialogModule, FormsModule],
  templateUrl: './forgot-password-modal.component.html',
})
export class ForgotPasswordModal implements OnInit {
  visible = false;
  step: Step = 'email';

  email = '';
  code = '';
  newPassword = '';
  confirmPassword = '';

  error = '';
  loading = false;

  constructor(
    private modalService: ForgotPasswordModalService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.modalService.visible$.subscribe(visible => {
      this.visible = visible;
      if (!visible) this.reset();
    });
  }

  close() {
    this.modalService.close();
  }

  reset() {
    this.step = 'email';
    this.email = '';
    this.code = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.error = '';
    this.loading = false;
  }

  submitEmail() {
    this.error = '';
    this.loading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.step = 'code';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error || err.message || 'Failed to send reset code.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  submitCode() {
    this.error = '';
    this.loading = true;
    this.authService.verifyResetCode(this.email, this.code).subscribe({
      next: () => {
        this.step = 'password';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error || err.message || 'Invalid or expired code.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  submitPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.error = '';
    this.loading = true;
    this.authService.resetPassword(this.email, this.code, this.newPassword).subscribe({
      next: () => {
        this.step = 'done';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error || err.message || 'Failed to reset password.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
