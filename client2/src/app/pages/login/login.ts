import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class LoginPage {
  identifier = '';
  password = '';
  error = '';

  constructor(public router: Router, private auth: AuthService) {}

  login() {
    this.auth.login(this.identifier, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => { this.error = 'Login failed. Please check your credentials.'; },
    });
  }
}
