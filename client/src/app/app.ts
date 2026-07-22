import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NavigationWidget } from './core/layout/navigation-widget/navigation-widget.component';
import { GroupSelectorComponent } from './core/layout/group-selector/group-selector.component';
import { UserStore } from './core/store/user.store';
import { Observable, combineLatest } from 'rxjs';
import { map, filter, startWith } from 'rxjs/operators';
import { UserTier } from './core/enums/user-tier.enum';

const PUBLIC_ROUTES = ['/', '/login'];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationWidget, GroupSelectorComponent, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');

  showNavigation$: Observable<boolean>;
  showMemberships$: Observable<boolean>;

  constructor(private userStore: UserStore, private router: Router) {
    const hasAccess$ = this.userStore.user$.pipe(
      map(user => !!user && user.tier !== UserTier.Free)
    );

    const isPublicRoute$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url),
      map(url => PUBLIC_ROUTES.includes(url))
    );

    this.showNavigation$ = this.userStore.user$.pipe(map(user => !!user));

    this.showMemberships$ = combineLatest([hasAccess$, isPublicRoute$]).pipe(
      map(([hasAccess, isPublic]) => hasAccess && !isPublic)
    );
  }
}
