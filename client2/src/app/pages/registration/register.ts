import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
})
export class RegisterPage {
  username: string = '';
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(public router: Router, private auth: AuthService) {}

  register() {
    this.auth.register(this.firstname, this.lastname, this.username, this.email, this.password, 'free').subscribe({
      next: () => this.router.navigate(['/']),
      error: () => { this.error = 'Registration failed. Please check your credentials.'; },
    });
  }
}
