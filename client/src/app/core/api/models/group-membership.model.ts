import { GroupRole } from "../../enums/group-role.enum";
import { CoachingGroup } from "./coaching-group.model";

export interface GroupMembership {
  id: string;
  userId: string;
  coachingGroupId: string;
  coachingGroup: CoachingGroup;
  role: GroupRole;
}