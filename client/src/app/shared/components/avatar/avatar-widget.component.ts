import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from '../../../core/api/models/user-profile.model';
import { Observable } from 'rxjs/internal/Observable';
import { UserStore } from '../../../core/store/user.store';
import { AsyncPipe } from '@angular/common';
import { User } from '../../../core/api/models/user.model';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-avatar-widget',
  imports: [AsyncPipe, UserAvatarComponent],
  templateUrl: './avatar-widget.component.html',
})
export class AvatarWidget {
  @Input() collapsed: boolean = false;

  profile$!: Observable<UserProfile | null>;
  user$!: Observable<User | null>;

  constructor(public router: Router, public userStore: UserStore) {}

  ngOnInit(): void {
    this.profile$ = this.userStore.profile$;
    this.user$ = this.userStore.user$;
  }
}
