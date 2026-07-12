export enum UserTier {
  Pro = "Pro",
  Lite = "Lite",
  Free = "Free",
}

export const TIER_OPTIONS: { label: string, value: UserTier }[] = [
  { label: 'Pro', value: UserTier.Pro },
  { label: 'Lite', value: UserTier.Lite },
  { label: 'Free', value: UserTier.Free }
];