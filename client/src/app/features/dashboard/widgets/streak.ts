import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { WorkoutStreak } from '../../../core/api/models/workout-streak.model';

@Component({
  selector: 'app-streak-widget',
  imports: [],
  templateUrl: './streak.html',
})
export class StreakWidget implements OnInit {
  streak: WorkoutStreak | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getStreak().subscribe(data => {
      this.streak = data;
    });
  }
}
