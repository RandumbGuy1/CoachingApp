import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from "../../../shared/components/avatar/avatar.component";
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  imports: [CommonModule, AvatarComponent],
})
export class NavigationBarComponent {
  @Input() collapsed = false;

  forms: NavigationElement = {
    title: "Forms",
    icon: "assets/images/icons/navigation/forms.svg",
    tooltip: "View and manage forms",
    url: '/forms',
  };

  settings: NavigationElement = {
    title: "Settings",
    icon: "assets/images/icons/navigation/settings.svg",
    tooltip: "Edit application settings",
    url: '/settings',
  };

  info: NavigationElement = {
    title: "Info",
    icon: "assets/images/icons/navigation/info.svg",
    tooltip: "View application info",
    url: '/info',
  };

  inbox: NavigationElement = {
    title: "Inbox",
    icon: "assets/images/icons/navigation/inbox.svg",
    tooltip: "View messages and notifications",
    url: '/inbox',
    notificationCount: 1,
  };

  groups: NavigationElement = {
    title: "Groups",
    icon: "assets/images/icons/navigation/groups.svg",
    tooltip: "View groups",
    url: '/groups',
  };

  logout: NavigationElement = {
    title: "Logout",
    icon: "assets/images/icons/navigation/logout.svg",
    tooltip: "Log out of the application",
    url: '',
    callback: () => this.authService.logout(),
    color: 'warning',
  };

  dashboard: NavigationElement = {
    title: "Dashboard",
    icon: "assets/images/icons/navigation/dashboard.svg",
    tooltip: "Go to dashboard",
    url: '/dashboard',
  };

  goals: NavigationElement = {
    title: "Goals",
    icon: "assets/images/icons/navigation/goals.svg",
    tooltip: "Edit and view fitness goals",
    url: '/goals',
  };

  programs: NavigationElement = {
    title: "Programs",
    icon: "assets/images/icons/navigation/programs.svg",
    tooltip: "Edit and view lifting programs",
    url: '/programs',
  };

  workout: NavigationElement = {
    title: "Workout",
    icon: "assets/images/icons/navigation/workout.svg",
    tooltip: "Start a workout",
    url: '/workout',
  };

  history: NavigationElement = {
    title: "History",
    icon: "assets/images/icons/navigation/history.svg",
    tooltip: "View previous workout and form data",
    url: '/history',
  };

  glossary: NavigationElement = {
    title: "Glossary",
    icon: "assets/images/icons/navigation/glossary.svg",
    tooltip: "View database of all excercises",
    url: '/glossary',
  };

  mainElements: NavigationElement[] = [
    this.dashboard,
    this.goals,
    this.programs,
    this.workout,
    this.forms,
    this.history,
    this.glossary,
    this.logout,
  ];

  bottomElements: NavigationElement[] = [
    this.settings,
    this.info,
    this.inbox,
    this.groups,
  ];

  constructor(public router: Router, public authService: AuthService) {}
}

interface NavigationElement {
  title: string;
  icon: string;
  tooltip: string;
  url: string;
  callback?: () => void;
  isCoachOnly?: boolean;
  color?: string;
  notificationCount?: number;
}
