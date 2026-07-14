import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss',
  host: {
    '[class.size-sm]': 'size === "sm"',
    '[class.size-md]': 'size === "md"',
    '[class.size-lg]': 'size === "lg"',
  },
})
export class UserAvatarComponent {
  @Input() username = '';
  @Input() avatarUrl?: string | null;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get initial(): string {
    return this.username?.[0]?.toUpperCase() ?? '?';
  }
}
