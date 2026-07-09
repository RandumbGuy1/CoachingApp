import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class LoginPage {
  identifier = '';
  password = '';
  error = '';

  constructor(public router: Router, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  login() {
    this.auth.login({ identifier: this.identifier, password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: HttpErrorResponse) => {
        this.error = err.error || err.message || 'An error occurred during login.';
        this.cdr.detectChanges();
      },
    });
  }
}
