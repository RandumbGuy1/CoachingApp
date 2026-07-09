import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WorkoutOfDayWidget } from './widgets/workout-of-day';
import { StreakWidget } from './widgets/streak';
import { RecentProgressWidget } from './widgets/recent-progress';
import { RankWidget } from './widgets/rank';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, WorkoutOfDayWidget, StreakWidget, RecentProgressWidget, RankWidget],
  templateUrl: './dashboard.html',
})
export class DashboardPage {
  today = new Date();
}
