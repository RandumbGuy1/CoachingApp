import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from '../../../core/api/models/user-profile.model';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../../../core/auth/auth.service';
import { UserStore } from '../../../core/store/user.store';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
})
export class AvatarComponent {
  @Input() collapsed: boolean = false;

  username: string = '';
  tier: string = '';
  profile$!: Observable<UserProfile | null>;
  profilePicture: string = "assets/images/avatar.svg";

  constructor(public router: Router, public userStore: UserStore, public auth: AuthService) {}

  ngOnInit(): void {
    let user = this.auth.getCurrentUser();
    this.username = user?.username ?? '';
    this.tier = user?.tier ?? '';
    this.profile$ = this.userStore.profile$;
  }
}
