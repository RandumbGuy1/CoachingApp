import { AppTheme } from "../../enums/app-theme.enum";
import { Gender } from "../../enums/gender.enum";
import { Region } from "../../enums/region.enum";

export interface SaveProfileRequest {
  avatarUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  gender?: Gender | null;
  region?: Region | null;
  theme?: AppTheme | null;
  receiveEmailNotifications?: boolean | null;
}