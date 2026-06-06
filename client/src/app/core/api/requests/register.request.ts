import { UserTier } from '../../enums/user-tier.enum';
import { Gender } from '../../enums/gender.enum';
import { Region } from '../../enums/region.enum';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  tier: UserTier;
  gender: Gender;
  region: Region;
}