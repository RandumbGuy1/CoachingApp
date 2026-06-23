import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroupMembership } from '../api/models/group-membership.model';

@Injectable({
  providedIn: 'root'
})
export class MembershipStore {
  private readonly allMemberships = new BehaviorSubject<GroupMembership[]>([]);
  readonly allMemberships$: Observable<GroupMembership[]> = this.allMemberships.asObservable();
  
  private readonly selectedMembership = new BehaviorSubject<GroupMembership | null>(null);
  readonly selectedMembership$: Observable<GroupMembership | null> = this.selectedMembership.asObservable();

  getSelectedMembership(): GroupMembership | null {
    return this.selectedMembership.value;
  }

  getAllMemberships(): GroupMembership[] {
    return this.allMemberships.value;
  }

  setSelectedMembership(membership: GroupMembership | null): void {
    this.selectedMembership.next(membership);
  }

  setAllMemberships(memberships: GroupMembership[]): void {
    this.allMemberships.next(memberships);
  }

  clear(): void {
    this.selectedMembership.next(null);
  }
}
