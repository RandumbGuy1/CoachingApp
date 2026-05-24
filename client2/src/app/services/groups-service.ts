import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService, User } from '../auth/auth.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private readonly API_URL = 'http://localhost:5268/api/groups';

  constructor(private http: HttpClient, private auth: AuthService) {}

  createGroup(request: CreateGroupRequest) {
    return this.http.post(this.API_URL, request).pipe(
      tap((res: any) => {
        return res.name;
      })
    );
  }

  getGroups(filter?: string) {
    const url = filter ? `${this.API_URL}/${filter}` : `${this.API_URL}`;
    return this.http.post<CoachingGroup[]>(url, null).pipe(
      tap((res: CoachingGroup[]) => {
        return res;
      })
    );
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
  requestToJoin: boolean;
  coaches: Coach[];
  clients: Client[];
}

export interface Coach {
  user: User;
  groupRole: string;
}

export interface Client {
  user: User;
  groupRole: string;
}
