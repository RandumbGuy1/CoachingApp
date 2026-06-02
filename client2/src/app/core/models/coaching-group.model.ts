import { GroupMembership } from "./group-membership.model";

export interface CoachingGroup {
  id: string;
  name: string;
  description: string;
  code: string;
  color: string;
  isPublic: boolean;
  isRequestToJoin: boolean;
  memberships: GroupMembership[];
}