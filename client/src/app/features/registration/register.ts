import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { RegisterRequest } from '../../core/api/requests/register.request';
import { UserTier } from '../../core/enums/user-tier.enum';
import { Gender } from '../../core/enums/gender.enum';
import { Region } from '../../core/enums/region.enum';
import { Button } from "primeng/button";

@Component({
  selector: 'app-register',
  imports: [FormsModule, Button],
  templateUrl: './register.html',
})
export class RegisterPage {
  request: RegisterRequest = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    tier: UserTier.Free,
    gender: Gender.Other,
    region: Region.NorthAmerica,
  };

  genderOptions = Object.values(Gender);
  regionOptions = Object.values(Region);
  error: string = '';

  constructor(public router: Router, private auth: AuthService) {}

  register() {
    this.auth.register(this.request).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => { this.error = 'Registration failed. Please check your credentials.'; },
    });
  }
}
