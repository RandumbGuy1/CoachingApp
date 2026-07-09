import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { WorkoutOfDay } from '../../../core/api/models/workout-of-day.model';

@Component({
  selector: 'app-workout-of-day',
  imports: [],
  templateUrl: './workout-of-day.html',
})
export class WorkoutOfDayWidget implements OnInit {
  workout: WorkoutOfDay | null = null;

  constructor(
    private dashboardService: DashboardService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.dashboardService.getWorkoutOfDay().subscribe(data => {
      this.workout = data;
    });
  }

  startWorkout() {
    this.router.navigate(['/workout']);
  }
}
