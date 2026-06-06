export interface CreateGroupRequest {
  name: string;
  description: string;
  code: string;
  color: string;
  isPublic: boolean;
  isRequestToJoin: boolean;
}