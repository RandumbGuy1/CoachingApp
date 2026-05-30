import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  constructor(private api: ApiService) {}

  createGroup(request: CreateGroupRequest) {
    return this.api.post('groups', request).pipe(
      tap((res: any) => {
        return res.name;
      })
    );
  }

  getGroups(filter?: string) {
    return this.api.get<CoachingGroup[]>(`groups/get/${filter || ''}`);
  }
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  code: string;
  color: string;
  isPublic: boolean;
  isRequestToJoin: boolean;
}

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

export interface GroupMembership {
  userId: string;
  coachingGroupId: string;
  role: GroupRole;
}

export enum GroupRole {
  Owner = "Owner",
  Coach = "Coach",
  Client = "Client",
}

