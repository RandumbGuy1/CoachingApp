import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { GroupsService } from '../../../core/services/groups.service';
import { CreateGroupRequest } from '../../../core/api/requests/create-group.request';
import { CreateGroupResponse } from '../../../core/api/responses/create-group.response';

@Component({
  selector: 'app-create-groups',
  imports: [FormsModule, ToggleSwitch],
  templateUrl: './create-groups.html',
})
export class CreateGroupsPage {
  group: CreateGroupRequest = {
    name: '',
    description: '',
    color: '#5c8cff',
    isPublic: true,
    isRequestToJoin: false,
  };

  error: string = '';

  constructor(private groupService: GroupsService, public router: Router, private cdr: ChangeDetectorRef) {}

  create() {
    this.error = '';
    this.groupService.createGroup(this.group).subscribe({
      next: (response: CreateGroupResponse) => {
        if (response) this.router.navigate(['/groups']);
        else this.error = 'Failed to create group. Please try again.';
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error || err.message || 'Failed to create group. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }
}
