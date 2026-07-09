import { RankConfig } from "../models/rank-config.model";

export enum RankTier {
  Greenie = "Greenie",
  Novice = "Novice",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Elite = "Elite",
}

export const RANK_CONFIGS: RankConfig[] = [
  { tier: RankTier.Greenie, label: 'Unranked', initial: 'New', color: '#62806c', minElo: 0, maxElo: 800  },
  { tier: RankTier.Novice, label: 'Novice', initial: 'Nov', color: '#45b166', minElo: 100, maxElo: 800  },
  { tier: RankTier.Intermediate, label: 'Intermediate', initial: 'Int', color: '#43ace9', minElo: 800,  maxElo: 1400 },
  { tier: RankTier.Advanced, label: 'Advanced', initial: 'Adv', color: '#a78bfa', minElo: 1400, maxElo: 2000 },
  { tier: RankTier.Elite, label: 'Elite', initial: 'Elt', color: '#ff995e', minElo: 2000, maxElo: null },
];
