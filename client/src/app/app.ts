import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NavigationBarComponent } from './core/layout/navigation-bar/navigation-bar.component';
import { GroupSelectorComponent } from './core/layout/group-selector/group-selector.component';
import { ForgotPasswordModal } from './shared/components/forgot-password/forgot-password-modal.component';
import { UserStore } from './core/store/user.store';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { UserTier } from './core/enums/user-tier.enum';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationBarComponent, GroupSelectorComponent, ForgotPasswordModal, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  collapsed: boolean = false;
  protected readonly title = signal('client');

  openIconUrl: string = 'assets/images/icons/chevron-right.svg'
  closedIconUrl: string = 'assets/images/icons/chevron-left.svg'

  showNavAndMemberships$: Observable<boolean>;

  constructor(private userStore: UserStore) {
    this.showNavAndMemberships$ = this.userStore.user$.pipe(
      map(user => user!! && user?.tier !== UserTier.Free)
    );
  }
}
