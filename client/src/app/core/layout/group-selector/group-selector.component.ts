import { Component, OnInit } from '@angular/core';
import { GroupMembership } from '../../api/models/group-membership.model';
import { MembershipService } from '../../services/membership.service';
import { MembershipStore } from '../../store/membership.store';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-group-selector',
  imports: [FormsModule, Select],
  templateUrl: './group-selector.component.html',
})
export class GroupSelectorComponent implements OnInit {
  selectedMembership: GroupMembership | null = null;
  allMemberships: GroupMembership[] = [];

  allMembershipOptions: { label: string, value: GroupMembership }[] = [];
  error: string = '';

  constructor(public membershipService: MembershipService, public membershipStore: MembershipStore, public auth: AuthService) {}

  ngOnInit() {
    this.membershipService.loadMemberships().subscribe({
      error: () => { this.error = 'Failed to load memberships'; }
    });

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
    this.membershipService.saveSelectedMembership(membership.id).subscribe({
      error: () => { this.error = 'Failed to select membership'; }
    })
  }
}
