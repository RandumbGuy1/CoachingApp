import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard/dashboard';
import { GoalsPage } from './pages/goals/goals';
import { HistoryPage } from './pages/history/history';
import { InfoPage } from './pages/info/info';
import { SettingsPage } from './pages/settings/settings';
import { WorkoutPage } from './pages/workout/workout';
import { ProgramsPage } from './pages/programs/programs';
import { InboxPage } from './pages/inbox/inbox';
import { GlossaryPage } from './pages/glossary/glossary';
import { ProfilePage } from './pages/profile/profile';
import { LoginPage } from './pages/login/login';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.gaurd';
import { RegisterPage } from './pages/registration/register';
import { ClientsPage } from './pages/clients/clients';
import { FormsPage } from './pages/forms/forms';
import { GroupsPage } from './pages/groups/groups';
import { CreateGroupsPage } from './pages/create-groups/create-groups';

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
