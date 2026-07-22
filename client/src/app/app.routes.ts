import { Routes } from '@angular/router';
import { requireTier } from './core/auth/tier.guard';
import { requireLogin } from './core/auth/login.guard';
import { UserTier } from './core/enums/user-tier.enum';
import { requireOnboarding } from './core/auth/onboarding.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing/landing').then(m => m.LandingPage) },
  { path: 'login', loadComponent: () => import('./features/login/login').then(m => m.LoginPage), canActivate: [requireLogin(false)] },
  { path: 'callback', loadComponent: () => import('./features/callback/callback').then(m => m.CallbackPage) },
  { path: 'settings', loadComponent: () => import('./features/settings/settings').then(m => m.SettingsPage), canActivate: [requireLogin(true)]},
  { path: 'info', loadComponent: () => import('./features/info/info').then(m => m.InfoPage), canActivate: [requireLogin(true)]},

  //Onboarding Lite users
  { 
    path: 'onboarding', 
    loadComponent: () => import('./features/onboarding/onboarding').then(m => m.OnboardingPage), 
    canActivate: [ requireLogin(true), requireOnboarding(false), requireTier(UserTier.Lite)] 
  },

  {
    path: '',
    canActivate: [requireLogin(true), requireOnboarding(true), requireTier(UserTier.Lite)],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardPage) },
      { path: 'goals', loadComponent: () => import('./features/goals/goals').then(m => m.GoalsPage) },
      { path: 'inbox', loadComponent: () => import('./features/inbox/inbox').then(m => m.InboxPage) },
      { path: 'programs', loadComponent: () => import('./features/programs/programs').then(m => m.ProgramsPage) },
      { path: 'workout', loadComponent: () => import('./features/workout/workout').then(m => m.WorkoutPage) },
      { path: 'forms', loadComponent: () => import('./features/forms/forms').then(m => m.FormsPage) },
      { path: 'history', loadComponent: () => import('./features/history/history').then(m => m.HistoryPage) },
      { path: 'glossary', loadComponent: () => import('./features/glossary/glossary').then(m => m.GlossaryPage) },
      { path: 'profile', loadComponent: () => import('./features/profile/profile').then(m => m.ProfilePage) },
      { path: 'clients', loadComponent: () => import('./features/clients/clients').then(m => m.ClientsPage), canActivate: [requireTier(UserTier.Pro)] },
      {
        path: 'groups',
        loadComponent: () => import('./features/groups/groups').then(m => m.GroupsPage),
        children: [
          { path: 'create', loadComponent: () => import('./features/groups/create-groups/create-groups').then(m => m.CreateGroupsPage), canActivate: [requireTier(UserTier.Pro)] },
        ],
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
