import { Component, HostBinding, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserStore } from '../../store/user.store';
import { AuthService } from '../../auth/auth.service';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { User } from '../../api/models/user.model';
import { UserProfile } from '../../api/models/user-profile.model';
import { UserTier } from '../../enums/user-tier.enum';

interface NavigationElement {
  title: string;
  icon: string;
  tooltip: string;
  url: string;
  callback?: () => void;
  color?: string;
  showWhenFree?: boolean;
  notificationCount?: number;
}

@Component({
  selector: 'app-navigation-widget',
  templateUrl: './navigation-widget.component.html',
  styleUrl: './navigation-widget.component.scss',
  imports: [AsyncPipe, UserAvatarComponent],
})
export class NavigationWidget {
  @Input() variant: 'fixed' | 'inline' = 'fixed';
  @HostBinding('class') get hostClass() { return `nav-widget--${this.variant}`; }
  open = false;

  user$: Observable<User | null>;
  isFreeUser$: Observable<boolean>;
  profile$: Observable<UserProfile | null>;

  mainElements: NavigationElement[] = [
    { title: 'Dashboard', icon: 'assets/images/icons/navigation/dashboard.svg', tooltip: 'Go to dashboard', url: '/dashboard' },
    { title: 'Goals', icon: 'assets/images/icons/navigation/goals.svg', tooltip: 'Edit and view fitness goals', url: '/goals' },
    { title: 'Programs', icon: 'assets/images/icons/navigation/programs.svg', tooltip: 'Edit and view lifting programs', url: '/programs' },
    { title: 'Workout', icon: 'assets/images/icons/navigation/workout.svg', tooltip: 'Start a workout', url: '/workout' },
    { title: 'Forms', icon: 'assets/images/icons/navigation/forms.svg', tooltip: 'View and manage forms', url: '/forms' },
    { title: 'History', icon: 'assets/images/icons/navigation/history.svg', tooltip: 'View previous workout and form data', url: '/history' },
    { title: 'Glossary', icon: 'assets/images/icons/navigation/glossary.svg', tooltip: 'View database of all exercises', url: '/glossary' },
    { title: 'Landing', icon: 'assets/images/icons/navigation/landing.svg', tooltip: 'Go to landing Page', url: '/', color: 'warning', showWhenFree: true },
    { title: 'Logout', icon: 'assets/images/icons/navigation/logout.svg', tooltip: 'Log out', url: '', callback: () => this.authService.logout(), color: 'warning', showWhenFree: true },
  ];

  bottomElements: NavigationElement[] = [
    { title: 'Settings', icon: 'assets/images/icons/navigation/settings.svg', tooltip: 'Settings', url: '/settings', showWhenFree: true },
    { title: 'Info', icon: 'assets/images/icons/navigation/info.svg', tooltip: 'Info', url: '/info', showWhenFree: true },
    { title: 'Inbox', icon: 'assets/images/icons/navigation/inbox.svg', tooltip: 'Inbox', url: '/inbox', notificationCount: 1 },
    { title: 'Groups', icon: 'assets/images/icons/navigation/groups.svg', tooltip: 'Groups', url: '/groups' },
  ];

  constructor(public router: Router, private authService: AuthService, public userStore: UserStore) {
    this.user$ = userStore.user$;
    this.profile$ = userStore.profile$;

    this.isFreeUser$ = this.userStore.user$.pipe(
      map(user => !!user && user.tier === UserTier.Free)
    );
  }

  navigate(element: NavigationElement): void {
    element.callback ? element.callback() : this.router.navigate([element.url]);
    this.open = false;
  }
}
