import { Component, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { GroupsService } from '../../core/services/groups.service';
import { Router } from '@angular/router';
import { GroupWidget } from '../../shared/components/group-widget/group-widget.component';
import { CoachingGroup } from '../../core/api/models/coaching-group.model';
import { GetGroupsResponse } from '../../core/api/responses/get-groups.response';
import { JoinGroupResponse } from '../../core/api/responses/join-group.response';
import { UserStore } from '../../core/store/user.store';
import { UserTier } from '../../core/enums/user-tier.enum';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-groups',
  imports: [TabsModule, ButtonModule, FormsModule, GroupWidget, AsyncPipe],
  templateUrl: './groups.html',
})
export class GroupsPage implements OnInit {
  joinCode: string = "";

  currentGroups: CoachingGroup[] = [];
  findGroups: CoachingGroup[] = [];

  canCreateGroup$: Observable<boolean>;

  constructor(public router: Router, private groupService: GroupsService, private userStore: UserStore) {
    this.canCreateGroup$ = this.userStore.user$.pipe(
      map(user => user?.tier !== UserTier.Free)
    );
  }

  ngOnInit() {
    this.groupService.getGroups({ includeString: '', isUserInGroup: true }).subscribe((res: GetGroupsResponse) => {
      this.currentGroups = res.groups;
    });

    this.groupService.getGroups({ includeString: '', isPublic: true, isUserInGroup: false }).subscribe((res: GetGroupsResponse) => {
      this.findGroups = res.groups;
    });
  }

  joinGroup() {
    this.groupService.joinGroupViaCode({ code: this.joinCode }).subscribe((res: JoinGroupResponse) => {
      // Handle the response, e.g., update the UI or show a success message
    });
  }
}
