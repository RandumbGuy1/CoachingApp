import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserProfile, UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
})
export class ProfilePage {
  username: string = '';
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(public router: Router, private userService: UserService) {}

  loadProfile() {
    this.userService.getCurrentUser()?.subscribe({
      next: (user: User) => {
        this.username = user.username ?? '';
        this.firstname = user?.profile?.firstName ?? '';
        this.lastname = user?.profile?.lastName ?? '';
        this.email = user.email ?? '';
      },
      error: () => { this.error = 'Failed to load profile.'; },
    });
  }

  saveprofile() {
    this.userService.saveUserProfile({
      username: this.username,
      firstName: this.firstname,
      lastName: this.lastname,
      email: this.email,
    }).subscribe({
      next: () => { this.error = ''; },
      error: () => { this.error = 'Failed to save profile.'; },
    });
  }
}

export interface SaveProfileRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}
