import { CoachingGroup } from "../models/coaching-group.model";

export interface GetGroupsResponse {
  groups: CoachingGroup[];
  page?: number;
  pageSize?: number;
  totalCount: number;
  totalPages: number;
}
