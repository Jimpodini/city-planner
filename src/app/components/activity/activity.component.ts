import { Component, HostListener, OnInit } from '@angular/core';
import { ModalService } from '../modal/modal.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
  @HostListener('click') onClick() {
    this.modalService.showModal = true;
  }

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}
}
