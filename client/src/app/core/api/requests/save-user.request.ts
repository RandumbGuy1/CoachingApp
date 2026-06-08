import { UserTier } from '../../enums/user-tier.enum';

export interface SaveUserRequest {
  currentPassword: string;
  username?: string;
  email?: string;
  newPassword?: string;
  tier?: UserTier;
}
