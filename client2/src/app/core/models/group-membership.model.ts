import { GroupRole } from "../enums/group-role.enum";

export interface GroupMembership {
  userId: string;
  coachingGroupId: string;
  role: GroupRole;
}