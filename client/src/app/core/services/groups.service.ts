import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { CoachingGroup } from '../api/models/coaching-group.model';
import { CreateGroupRequest } from '../api/requests/create-group.request';

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
