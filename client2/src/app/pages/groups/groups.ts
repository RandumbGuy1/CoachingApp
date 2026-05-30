import { Component, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CoachingGroup, GroupsService } from '../../services/groups.service';
import { Router } from '@angular/router';
import { GroupWidget } from '../../components/group-widget/group-widget';

@Component({
  selector: 'app-groups',
  imports: [TabsModule, ButtonModule, FormsModule, GroupWidget],
  templateUrl: './groups.html',
})
export class GroupsPage implements OnInit {
  joinCode: string = "";

  currentGroups: CoachingGroup[] = [];
  findGroups: CoachingGroup[] = [];
  constructor(public router: Router, private groupService: GroupsService) {}

  ngOnInit() {
    this.groupService.getGroups('current').subscribe((groups) => {
      this.currentGroups = groups;
    });

    this.groupService.getGroups('public').subscribe((groups) => {
      this.findGroups = groups;
    });
  }
}
