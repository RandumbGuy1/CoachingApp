export interface CreateGroupRequest {
  name: string;
  description: string;
  color: string;
  isPublic: boolean;
  isRequestToJoin: boolean;
}