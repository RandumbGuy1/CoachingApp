import { UserTier } from '../../enums/user-tier.enum';

export interface SaveUserRequest {
  username?: string;
  tier?: UserTier;
}
