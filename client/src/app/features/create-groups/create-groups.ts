import { FormsModule } from '@angular/forms';
import { GroupsService } from '../../core/services/groups.service';
import { Component } from '@angular/core';
import { CreateGroupRequest } from '../../core/api/requests/create-group.request';
import { SelectModule } from 'primeng/select';
import { CreateGroupResponse } from '../../core/api/responses/create-group.response';

@Component({
  selector: 'app-create-groups',
  imports: [FormsModule],
  templateUrl: './create-groups.html',
})
export class CreateGroupsPage {
  group: CreateGroupRequest = {
    name: '',
    code: this.generateCode(),
    description: '',
    color: '#FFFF',
    isPublic: true,
    isRequestToJoin: false,
  }

  error: string = '';

  constructor(private groupService: GroupsService) {}

  changeCode() {
    this.group.code = this.generateCode();
  }

  generateCode(length: number = 6): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * chars.length);
      result += chars[index];
    }

    return result;
  }

  create() {
    this.groupService.createGroup(this.group).subscribe((response: CreateGroupResponse) => {
      if (response) console.log(`Group ${response.name} created successfully!`);
      else this.error = 'Failed to create group. Please try again.';
    });
  }
}
