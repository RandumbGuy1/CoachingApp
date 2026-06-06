import { UserTier } from "../../enums/user-tier.enum";
import { GroupMembership } from "./group-membership.model";
import { UserProfile } from "./user-profile.model";

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;

  tier: UserTier;

  profile: UserProfile;
  memberships: GroupMembership[];
}