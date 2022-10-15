import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthObject, AuthService } from 'src/app/auth.service';
import { ModalService } from 'src/app/components/modal/modal.service';
import { ActivityService } from 'src/app/services/activity.service';
import { LocationService } from 'src/app/services/location.service';
import { StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'app-feature-area',
  templateUrl: './feature-area.component.html',
  styleUrls: ['./feature-area.component.scss'],
})
export class FeatureAreaComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public modalService: ModalService,
    private route: ActivatedRoute,
    private router: Router,
    private stayService: StayService,
    private activityService: ActivityService,
    private locationService: LocationService
  ) {
    this.getStay();
  }

  ngOnInit() {}

  // TODO: refactor this method
  async getStay(): Promise<void> {
    // TODO: implement loader
    this.authService.stayId = this.route.snapshot.params['stayId'];

    const doc = await this.stayService.getStay();
    let authObject = doc.data();
    console.log(doc.data());
    const locationId = doc.data()?.['locationId'];
    this.locationService.getLocation(locationId).subscribe((data) => {
      authObject = {
        ...authObject,
        homeAddress: data?.['address'],
        homeCity: data?.['city'],
      };
      // console.log(doc2.data());
      // TODO unsubscribe
      this.activityService.getActivities(locationId).subscribe(console.log);
      this.activityService
        .getSetOfActivities(locationId)
        .subscribe(console.log);
      if (!doc.data()) {
        this.router.navigate(['/404']);
      } else {
        this.authService.setAuthObject(<AuthObject>authObject);
      }
    });
  }

  drop(event: CdkDragDrop<string[]>, date: string) {
    console.log(event);
    moveItemInArray(
      this.authService.authObject.activitiesPerDate[date].activities,
      event.previousIndex,
      event.currentIndex
    );
    this.stayService.saveStay();
  }

  removeAllActivities(date: string) {
    this.authService.authObject.activitiesPerDate[date].activities = [];
    this.stayService.updateGoogleDirectionLink(date);
    this.stayService.saveStay();
  }
}
