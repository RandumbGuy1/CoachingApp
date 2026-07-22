import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WorkOSService } from '../../core/auth/workos.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage {
  error = '';
  logoUrl = 'assets/images/logo.png';
  isWorkOSLoading = false;

  constructor(
    public router: Router,
    private cdr: ChangeDetectorRef,
    private workosService: WorkOSService,
  ) {}

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
