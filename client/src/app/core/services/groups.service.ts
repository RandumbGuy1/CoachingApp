import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { CoachingGroup } from '../api/models/coaching-group.model';
import { CreateGroupRequest } from '../api/requests/create-group.request';
import { GetGroupsRequest } from '../api/requests/get-groups.request';
import { CreateGroupResponse } from '../api/responses/create-group.response';
import { GetGroupsResponse } from '../api/responses/get-groups.response';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  constructor(private api: ApiService) {}

  createGroup(request: CreateGroupRequest) {
    return this.api.post<CreateGroupResponse>('groups', request);
  }

  getGroups(request: GetGroupsRequest) {
    return this.api.get<GetGroupsResponse>('groups/get/', request);
  }
}
