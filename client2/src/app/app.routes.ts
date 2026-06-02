import { Routes } from '@angular/router';
import { DashboardPage } from './features/dashboard/dashboard';
import { GoalsPage } from './features/goals/goals';
import { HistoryPage } from './features/history/history';
import { InfoPage } from './features/info/info';
import { SettingsPage } from './features/settings/settings';
import { WorkoutPage } from './features/workout/workout';
import { ProgramsPage } from './features/programs/programs';
import { InboxPage } from './features/inbox/inbox';
import { GlossaryPage } from './features/glossary/glossary';
import { ProfilePage } from './features/profile/profile';
import { LoginPage } from './features/login/login';
import { authGuard } from './core/auth/auth.guard';
import { RegisterPage } from './features/registration/register';
import { ClientsPage } from './features/clients/clients';
import { FormsPage } from './features/forms/forms';
import { GroupsPage } from './features/groups/groups';
import { CreateGroupsPage } from './features/create-groups/create-groups';
import { roleGuard } from './core/auth/role.gaurd';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },

  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardPage },
      { path: 'goals', component: GoalsPage },
      { path: 'inbox', component: InboxPage },
      { path: 'programs', component: ProgramsPage },
      { path: 'workout', component: WorkoutPage },
      { path: 'settings', component: SettingsPage },
      { path: 'info', component: InfoPage },
      { path: 'history', component: HistoryPage },
      { path: 'glossary', component: GlossaryPage },
      { path: 'profile', component: ProfilePage },
      { path: 'groups', component: GroupsPage },
      { path: 'groups/create', component: CreateGroupsPage },
    ],
  },

  {
    path: '',
    canActivate: [authGuard, roleGuard],
    children: [
      { path: 'clients', component: ClientsPage },
      { path: 'forms', component: FormsPage },
    ],
  },

  { path: '**', redirectTo: '' } // fallback
];
