import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { RegisterRequest } from '../../core/api/requests/register.request';
import { UserTier } from '../../core/enums/user-tier.enum';
import { Gender } from '../../core/enums/gender.enum';
import { Region } from '../../core/enums/region.enum';
import { Select } from "primeng/select";
import { genderOptions } from '../../core/enums/gender.enum';
import { regionOptions } from '../../core/enums/region.enum';

@Component({
  selector: 'app-register',
  imports: [FormsModule, Select],
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

  error: string = '';
  genderOptions = genderOptions;
  regionOptions = regionOptions;

  constructor(public router: Router, private auth: AuthService) {}

  register() {
    this.auth.register(this.request).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => { this.error = 'Registration failed. Please check your credentials.'; },
    });
  }
}
