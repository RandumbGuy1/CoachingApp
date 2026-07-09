import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CreateGroupRequest } from '../api/requests/create-group.request';
import { GetGroupsRequest } from '../api/requests/get-groups.request';
import { CreateGroupResponse } from '../api/responses/create-group.response';
import { GetGroupsResponse } from '../api/responses/get-groups.response';
import { JoinCodeRequest } from '../api/requests/join-code.request';
import { JoinGroupResponse } from '../api/responses/join-group.response';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  constructor(private api: ApiService) {}

  createGroup(request: CreateGroupRequest) {
    return this.api.post<CreateGroupResponse>('groups', request);
  }

  getGroups(request: GetGroupsRequest) {
    return this.api.get<GetGroupsResponse>('groups/get/', request);
  }

  joinGroupViaCode(request: JoinCodeRequest) {
    return this.api.post<JoinGroupResponse>('groups/join/code/', request);
  }

  joinGroup(groupId: string, request: JoinCodeRequest) {
    return this.api.post<JoinGroupResponse>(`groups/join/${groupId}`, request);
  }

  addClient(groupId: string, userId: string) {
    return this.api.post<void>(`groups/add/${groupId}/${userId}`);
  }

  promoteUser(groupId: string, userId: string) {
    return this.api.post<void>(`groups/promote/${groupId}/${userId}`);
  }

  transferOwnership(groupId: string, userId: string) {
    return this.api.post<void>(`groups/transfer/${groupId}/${userId}`);
  }
}
