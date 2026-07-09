import { RankTier } from "../enums/rank-tier.enum";

export interface RankConfig {
  tier: RankTier;
  label: string;
  initial: string;
  color: string;
  minElo: number;
  maxElo: number | null;
}