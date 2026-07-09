import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { RankInfo } from '../../../core/api/models/rank-info.model';
import { RANK_CONFIGS } from '../../../core/enums/rank-tier.enum';
import { RankConfig } from '../../../core/models/rank-config.model';

@Component({
  selector: 'app-rank-widget',
  imports: [],
  templateUrl: './rank.html',
})
export class RankWidget implements OnInit {
  rankInfo: RankInfo | null = null;
  rankConfig: RankConfig = RANK_CONFIGS[0];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getRankInfo().subscribe(data => {
      this.rankInfo = data;
      this.rankConfig = this.computeRank(data.elo);
    });
  }

  private computeRank(elo: number): RankConfig {
    return [...RANK_CONFIGS].reverse().find(r => elo >= r.minElo) ?? RANK_CONFIGS[0];
  }

  getEloProgress(): number {
    if (!this.rankInfo) return 0;
    const { minElo, maxElo } = this.rankConfig;
    if (maxElo === null) return 100;
    return Math.min(100, ((this.rankInfo.elo - minElo) / (maxElo - minElo)) * 100);
  }

  getBadgeBg(): string {
    return this.rankConfig.color + '22';
  }

  getBadgeBorder(): string {
    return '3px solid ' + this.rankConfig.color;
  }

  getBadgeGlow(): string {
    return '0 0 20px ' + this.rankConfig.color + '88';
  }
}
