import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WorkoutOfDay } from '../api/models/workout-of-day.model';
import { WorkoutStreak } from '../api/models/workout-streak.model';
import { ProgressEntry } from '../api/models/progress-entry.model';
import { RankInfo } from '../api/models/rank-info.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private api: ApiService) {}

  getWorkoutOfDay(): Observable<WorkoutOfDay> {
    return of({
      isRestDay: false,
      completed: false,
      workoutName: 'Push Day A',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: 8, weight: 100, unit: 'kg' },
        { name: 'Overhead Press', sets: 3, reps: 10, weight: 60, unit: 'kg' },
        { name: 'Cable Fly', sets: 3, reps: 12, weight: 30, unit: 'kg' },
        { name: 'Tricep Pushdown', sets: 3, reps: 15, weight: 25, unit: 'kg' },
      ],
    });
  }

  getStreak(): Observable<WorkoutStreak> {
    return of({
      totalWorkouts: 87,
      currentStreak: 12,
      longestStreak: 23,
    });
  }

  getRecentProgress(): Observable<ProgressEntry[]> {
    return of([
      { exerciseName: 'Bench Press', weight: 100, reps: 8, previousWeight: 95, unit: 'kg', date: new Date('2026-06-24') },
      { exerciseName: 'Squat', weight: 140, reps: 5, previousWeight: 135, unit: 'kg', date: new Date('2026-06-22') },
      { exerciseName: 'Deadlift', weight: 180, reps: 3, previousWeight: 180, unit: 'kg', date: new Date('2026-06-20') },
      { exerciseName: 'Overhead Press', weight: 62, reps: 8, previousWeight: 65, unit: 'kg', date: new Date('2026-06-18') },
    ]);
  }

  getRankInfo(): Observable<RankInfo> {
    return of({
      elo: 1450,
      wilksScore: 312.4,
    });
  }
}
