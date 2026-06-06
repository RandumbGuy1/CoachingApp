import { UserTier } from "../../enums/user-tier.enum";

export interface Identity {
  id: string;
  username: string;
  email: string;
  tier: UserTier;
}
