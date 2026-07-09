export enum UserTier {
  Enterprise = "Enterprise",
  Pro = "Pro",
  Free = "Free",
}

export const TIER_OPTIONS: { label: string, value: UserTier }[] = [
  { label: 'Enterprise', value: UserTier.Enterprise },
  { label: 'Pro', value: UserTier.Pro },
  { label: 'Free', value: UserTier.Free }
];