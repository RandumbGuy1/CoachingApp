import { Component, OnInit } from '@angular/core';
import { GroupMembership } from '../../api/models/group-membership.model';
import { MembershipService } from '../../services/membership.service';
import { MembershipStore } from '../../store/membership.store';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, Select],
  templateUrl: './group-selector.component.html',
})
export class GroupSelectorComponent implements OnInit {
  selectedMembership: GroupMembership | null = null;
  allMemberships: GroupMembership[] | null = [];

  allMembershipOptions: { label: string, value: GroupMembership }[] = [];
  error: string = '';

  constructor(public membershipService: MembershipService, public membershipStore: MembershipStore) {}

  ngOnInit() {
    this.membershipService.loadMemberships().subscribe({
      error: () => { this.error = 'Failed to load memberships'; }
    });

    this.membershipStore.allMemberships$.subscribe(memberships => {
      this.allMemberships = memberships;
      this.allMembershipOptions = !memberships ? [] : memberships.map(m => ({
        label: m.coachingGroup.name,
        value: m
      }));
    });

    this.membershipStore.selectedMembership$.subscribe(membership => {
      this.selectedMembership = membership;
    });
  }

  onMembershipSelect(membership: GroupMembership) {
    this.membershipService.saveSelectedMembership(membership.id).subscribe({
      error: () => { this.error = 'Failed to select membership'; }
    })
  }
}
