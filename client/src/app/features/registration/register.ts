import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';
import { RegisterRequest } from '../../core/api/requests/register.request';
import { UserTier } from '../../core/enums/user-tier.enum';
import { Gender } from '../../core/enums/gender.enum';
import { Region } from '../../core/enums/region.enum';
import { Select } from "primeng/select";
import { GENDER_OPTIONS } from '../../core/enums/gender.enum';
import { REGION_OPTIONS } from '../../core/enums/region.enum';

@Component({
  selector: 'app-register',
  imports: [FormsModule, Select],
  templateUrl: './register.html',
  styleUrl: './register.scss',
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

  selectedGender: { label: any, value: any } | undefined = undefined;
  selectedRegion: { label: any, value: any } | undefined = undefined;

  error: string = '';
  genderOptions = GENDER_OPTIONS;
  regionOptions = REGION_OPTIONS;

  constructor(public router: Router, private authService: AuthService, private cdr: ChangeDetectorRef) {}

  register() {
    if (this.selectedGender?.value) this.request.gender = this.selectedGender.value;
    if (this.selectedRegion?.value) this.request.region = this.selectedRegion.value;

    this.authService.register(this.request).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: HttpErrorResponse) => {
        this.error = err.error || err.message || 'Registration failed. Please check your details.';
        this.cdr.detectChanges();
      },
    });
  }
}
