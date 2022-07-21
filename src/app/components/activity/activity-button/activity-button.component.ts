import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity-button',
  templateUrl: './activity-button.component.html',
  styleUrls: ['./activity-button.component.scss'],
})
export class ActivityButtonComponent implements OnInit {
  // TODO add type
  @Input() activity: any;

  constructor() {}

  ngOnInit(): void {}
}
