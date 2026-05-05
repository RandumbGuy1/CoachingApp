import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../auth/auth.service';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
})
export class AvatarComponent {
  @Input() user: User = null!;
  @Input() profilePicture: string = "assets/images/avatar.svg";

  constructor(public router: Router) {}
}
