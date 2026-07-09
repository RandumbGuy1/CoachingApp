import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ProgressEntry } from '../../../core/api/models/progress-entry.model';

@Component({
  selector: 'app-recent-progress',
  imports: [DatePipe],
  templateUrl: './recent-progress.html',
})
export class RecentProgressWidget implements OnInit {
  progress: ProgressEntry[] = [];

  constructor(
    private dashboardService: DashboardService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.dashboardService.getRecentProgress().subscribe(data => {
      this.progress = data;
    });
  }

  getDelta(entry: ProgressEntry): number {
    return entry.weight - entry.previousWeight;
  }

  navigateToHistory() {
    this.router.navigate(['/history']);
  }
}
