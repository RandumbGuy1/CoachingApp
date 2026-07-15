import { Component, OnInit } from '@angular/core';
import { GroupMembership } from '../../api/models/group-membership.model';
import { MembershipService } from '../../services/membership.service';
import { MembershipStore } from '../../store/membership.store';
import { Select, SelectChangeEvent } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-selector',
  imports: [FormsModule, Select],
  templateUrl: './group-selector.component.html',
})
export class GroupSelectorComponent implements OnInit {
  selectedMembership: GroupMembership | null = null;
  selectedMembershipId: string | null = null;
  allMemberships: GroupMembership[] = [];
  allMembershipOptions: { label: string; value: string }[] = [];

  constructor(
    public membershipService: MembershipService,
    public membershipStore: MembershipStore,
  ) {}

  ngOnInit() {
    this.membershipStore.allMemberships$.subscribe(memberships => {
      this.allMemberships = memberships;
      this.allMembershipOptions = memberships.map(m => ({
        label: m.coachingGroup.name,
        value: m.id
      }));
    });

    this.membershipStore.selectedMembership$.subscribe(membership => {
      this.selectedMembership = membership;
      this.selectedMembershipId = membership?.id ?? null;
    });
  }

  onMembershipSelect(event: SelectChangeEvent) {
    const id: string = event.value;
    this.selectedMembership = this.allMemberships.find(m => m.id === id) ?? null;
    this.membershipService.saveSelectedMembership(id).subscribe();
  }
}
