export interface GetGroupsRequest {
  includeString: string;
  includeRequestToJoin: boolean;
  includeGroupsIn: boolean;

  page?: number;
  pageSize?: number;
}