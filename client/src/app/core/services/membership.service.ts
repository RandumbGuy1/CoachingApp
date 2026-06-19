import { Injectable } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { ApiService } from './api.service';
import { MembershipStore } from '../store/membership.store';
import { GroupMembership } from '../api/models/group-membership.model';

@Injectable({ providedIn: 'root' })
export class MembershipService {
  constructor(private api: ApiService, private membershipStore: MembershipStore) {}
  
  getSelectedMembership() {
    return this.api.get<GroupMembership>('memberships/me').pipe(
      tap(membership => this.membershipStore.setSelectedMembership(membership))
    );
  }

  saveSelectedMembership(membershipId: string) {
    return this.api.post<GroupMembership>('memberships/me/save', membershipId).pipe(
      tap(membership => this.membershipStore.setSelectedMembership(membership))
    );
  }

  getAllMemberships() {
    return this.api.get<GroupMembership[]>('memberships/me/save').pipe(
      tap(memberships => this.membershipStore.setAllMemberships(memberships))
    );
  }

  loadMemberships() {
    return this.getAllMemberships().pipe(
      switchMap(() => this.getSelectedMembership())
    );
  }
}
