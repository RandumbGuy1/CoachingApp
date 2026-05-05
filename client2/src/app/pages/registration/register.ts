import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ToggleSwitch],
  templateUrl: './register.html',
})
export class RegisterPage {
  username = '';
  email = '';
  password = '';
  error = '';
  checked: boolean = false;

  constructor(public router: Router, private auth: AuthService) {}

  register() {
    this.auth.register(this.username, this.email, this.password, this.checked ? 'coach' : 'client').subscribe({
      next: () => this.router.navigate(['/']),
      error: () => { this.error = 'Registration failed. Please check your credentials.'; },
    });
  }
}
