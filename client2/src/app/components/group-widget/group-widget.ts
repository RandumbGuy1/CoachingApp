import { Component, Input } from '@angular/core';
import { CoachingGroup } from '../../services/groups-service';

@Component({
  selector: 'app-group-widget',
  imports: [],
  templateUrl: './group-widget.html',
})
export class GroupWidget {
  @Input() group: CoachingGroup = {} as CoachingGroup;
  @Input() isCurrentGroup: boolean = false;

  constructor() {}
}
