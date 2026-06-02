import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { CoachingGroup } from '../models/coaching-group.model';
import { CreateGroupRequest } from '../models/create-group-request.model';

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
