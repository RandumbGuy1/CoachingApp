import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from '../../../core/api/models/user-profile.model';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../../../core/auth/auth.service';
import { UserStore } from '../../../core/store/user.store';
import { AsyncPipe } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-avatar',
  imports: [AsyncPipe],
  templateUrl: './avatar.html',
})
export class AvatarComponent {
  @Input() collapsed: boolean = false;

  username: string = '';
  tier: string = '';
  profile$!: Observable<UserProfile | null>;

  constructor(public router: Router, public userService: UserService, public userStore: UserStore, public auth: AuthService) {}

  ngOnInit(): void {
    let user = this.auth.getCurrentUser();
    this.username = user?.username ?? '';
    this.tier = user?.tier ?? '';
    this.profile$ = this.userStore.profile$;
  }
}
