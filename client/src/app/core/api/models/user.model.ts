import { UserTier } from "../../enums/user-tier.enum";

export interface User {
  id: string;
  username: string;
  email: string;
  tier: UserTier;
}
