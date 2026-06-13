import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroupMembership } from '../api/models/group-membership.model';

@Injectable({
  providedIn: 'root'
})
export class MembershipStore {
  private readonly allMemberships = new BehaviorSubject<GroupMembership[] | null>(null);
  private readonly selectedMembership = new BehaviorSubject<GroupMembership | null>(null);
  readonly selectedMembership$: Observable<GroupMembership | null> = this.selectedMembership.asObservable();

  getSelectedMembership(): GroupMembership | null {
    return this.selectedMembership.value;
  }

  setSelectedMembership(membership: GroupMembership | null): void {
    this.selectedMembership.next(membership);
  }

  setAllMemberships(memberships: GroupMembership[] | null): void {
    this.allMemberships.next(memberships);
  }

  clear(): void {
    this.selectedMembership.next(null);
  }
}
