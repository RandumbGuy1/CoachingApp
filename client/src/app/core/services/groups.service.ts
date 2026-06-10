import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { CoachingGroup } from '../api/models/coaching-group.model';
import { CreateGroupRequest } from '../api/requests/create-group.request';
import { GetGroupRequest } from '../api/requests/get-group.request';

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

  getGroups(request: GetGroupRequest) {
    return this.api.get('groups/get/', request);
  }
}
