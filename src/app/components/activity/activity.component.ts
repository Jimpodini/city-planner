import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { StayService } from 'src/app/services/stay.service';
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
  showDescription = false;

  constructor(
    private modalService: ModalService,
    private authService: AuthService,
    private stayService: StayService
  ) {}

  ngOnInit(): void {}

  deleteActivity(): void {
    this.authService.authObject.activitiesPerDate[this.date].activities =
      this.authService.authObject.activitiesPerDate[
        this.date
      ].activities.filter(
        (activity) => activity.googlePlaceId !== this.activity.googlePlaceId
      );
    this.authService.authObject.activitiesPerDate[
      this.date
    ].googleDirectionLink = this.authService.getGoogleUrl(this.date);

    this.stayService.saveStay();
  }
}
