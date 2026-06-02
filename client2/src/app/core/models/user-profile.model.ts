import { AppTheme } from "../enums/app-theme.enum";
import { Gender } from "../enums/gender.enum";
import { Region } from "../enums/region.enum";

export interface UserProfile {
  id: string;
  userId: string;

  firstName: string;
  lastName: string;
  avatarUrl: string;
  bio: string;

  gender?: Gender | null;
  region?: Region | null;

  theme: AppTheme;
  receiveEmailNotifications: boolean;
}