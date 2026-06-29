export interface GetGroupsRequest {
    includeString?: string;

    isPublic?: boolean;
    isRequestToJoin?: boolean;
    isUserInGroup?: boolean;
    isOtherUserInGroup?: boolean;
    otherUserId?: string;

  page?: number;
  pageSize?: number;
}