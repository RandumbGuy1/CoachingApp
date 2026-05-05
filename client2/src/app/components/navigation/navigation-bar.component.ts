import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from "../avatar/avatar";
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  imports: [CommonModule, AvatarComponent],
})
export class NavigationBarComponent implements OnInit {
  clients: NavigationElement = {
    title: "Clients",
    icon: "assets/images/nav-icons/clients.svg",
    tooltip: "View and manage clients",
    url: '/clients',
    color: 'selected',
    showWhileLoggedOut: true,
    isCoachOnly: true,
  };

  forms: NavigationElement = {
    title: "Forms",
    icon: "assets/images/nav-icons/forms.svg",
    tooltip: "View and manage forms",
    url: '/forms',
    color: 'selected',
    showWhileLoggedOut: true,
    isCoachOnly: true,
  };

  settings: NavigationElement = {
    title: "Settings",
    icon: "assets/images/nav-icons/settings.svg",
    tooltip: "Edit application settings",
    url: '/settings',
    showWhileLoggedOut: true,
  };

  info: NavigationElement = {
    title: "Info",
    icon: "assets/images/nav-icons/info.svg",
    tooltip: "View application info",
    url: '/info',
    showWhileLoggedOut: true,
  };

  inbox: NavigationElement = {
    title: "Inbox",
    icon: "assets/images/nav-icons/inbox.svg",
    tooltip: "View messages and notifications",
    url: '/inbox',
    notificationCount: 1,
  };

  groups: NavigationElement = {
    title: "Groups",
    icon: "assets/images/nav-icons/groups.svg",
    tooltip: "View groups",
    url: '/groups',
  };

  logout: NavigationElement = {
    title: "Logout",
    icon: "assets/images/nav-icons/logout.svg",
    tooltip: "Log out of the application",
    url: '',
    callback: () => this.auth.logout(),
    color: 'warning',
  };

  dashboard: NavigationElement = {
    title: "Dashboard",
    icon: "assets/images/nav-icons/dashboard.svg",
    tooltip: "Go to dashboard",
    url: '',
  };

  goals: NavigationElement = {
    title: "Goals",
    icon: "assets/images/nav-icons/goals.svg",
    tooltip: "Edit and view fitness goals",
    url: '/goals',
  };

  programs: NavigationElement = {
    title: "Programs",
    icon: "assets/images/nav-icons/programs.svg",
    tooltip: "Edit and view lifting programs",
    url: '/programs',
  };

  workout: NavigationElement = {
    title: "Workout",
    icon: "assets/images/nav-icons/workout.svg",
    tooltip: "Start a workout",
    url: '/workout',
  };

  history: NavigationElement = {
    title: "History",
    icon: "assets/images/nav-icons/history.svg",
    tooltip: "View previous workout and form data",
    url: '/history',
  };

  glossary: NavigationElement = {
    title: "Glossary",
    icon: "assets/images/nav-icons/glossary.svg",
    tooltip: "View database of all excercises",
    url: '/glossary',
  };

  homeImgUrl: string = 'assets/images/logo.png';

  mainElements: NavigationElement[] = [
    this.clients,
    this.forms,
    this.dashboard,
    this.goals,
    this.programs,
    this.workout,
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

  constructor(public router: Router, public auth: AuthService) {}

  ngOnInit(): void {}

  canShowCoachElement(element: NavigationElement): boolean {
    const role = this.auth.getCurrentUser()?.role;
    if (!element.isCoachOnly) return true;
    return role === 'Coach';
  }
}

interface NavigationElement {
  title: string;
  icon: string;
  tooltip: string;
  url: string;
  callback?: () => void;
  showWhileLoggedOut?: boolean;
  isCoachOnly?: boolean;
  color?: string;
  notificationCount?: number;
}
