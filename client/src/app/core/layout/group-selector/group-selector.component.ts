import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { GroupMembership } from '../../api/models/group-membership.model';
import { MembershipService } from '../../services/membership.service';
import { MembershipStore } from '../../store/membership.store';
import { UserStore } from '../../store/user.store';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-selector',
  imports: [FormsModule, Select, AsyncPipe],
  templateUrl: './group-selector.component.html',
})
export class GroupSelectorComponent implements OnInit {
  selectedMembership: GroupMembership | null = null;
  allMemberships: GroupMembership[] = [];
  allMembershipOptions: { label: string, value: GroupMembership }[] = [];

  constructor(
    public membershipService: MembershipService,
    public membershipStore: MembershipStore,
    public userStore: UserStore,
  ) {}

  ngOnInit() {
    this.membershipStore.allMemberships$.subscribe(memberships => {
      this.allMemberships = memberships;
      this.allMembershipOptions = memberships.map(membership => ({
        label: membership.coachingGroup.name,
        value: membership
      }));
    });

    this.membershipStore.selectedMembership$.subscribe(membership => {
      this.selectedMembership = membership;
    });
  }

  onMembershipSelect(membership: GroupMembership) {
    this.membershipService.saveSelectedMembership(membership.id).subscribe();
  }
}
