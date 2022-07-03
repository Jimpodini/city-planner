import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ModalService } from '../modal/modal.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
  @Input() date: string = '';
  @Input() activity: any;
  @HostListener('click') onClick() {
    if (!this.activity) {
      this.modalService.openModal(this.date);
    }
  }

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}
}
