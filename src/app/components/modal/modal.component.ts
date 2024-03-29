import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { ActivityService } from 'src/app/services/activity.service';
import { StayService } from 'src/app/services/stay.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  activities = this.activityService.activities;
  filteredActivities = this.activities;
  setsOfActivities = this.activityService.setsOfActivities;
  filteredSetsOfActivities = this.setsOfActivities;
  selectedActivity: any = null;
  categories = ['Parks', 'Restaurants', 'Bars'];
  activatedCategoryFilter: string = '';
  searchInput = new FormControl('');

  unsubscribe = new Subject<void>();

  constructor(
    public modalService: ModalService,
    private authService: AuthService,
    private stayService: StayService,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.updateFilteredActivities();
    this.searchInput.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        if (this.modalService.modalType === 'activities') {
          this.updateFilteredActivities();
        } else if (this.modalService.modalType === 'setsOfActivities') {
          this.updateFilteredSetsOfActivities();
        }
      });
  }

  addActivity(activity: any) {
    this.authService.authObject.activitiesPerDate[
      this.modalService.date
    ].activities.push(activity);
    this.authService.authObject.activitiesPerDate[
      this.modalService.date
    ].googleDirectionLink = this.activityService.getGoogleUrl(
      this.authService.authObject.activitiesPerDate[this.modalService.date]
        .activities,
      this.authService.authObject.homeCity,
      this.authService.authObject.homeAddress
    );

    this.stayService.saveStay();
  }

  addActivities(setOfActivities: any) {
    setOfActivities.activities.forEach((activityId: any) => {
      this.addActivity(this.getActivity(activityId));
    });
  }

  activateCategoryFilter(category: string): void {
    this.activatedCategoryFilter = category;
    this.updateFilteredActivities();
  }

  // TODO refactor to make logic more clear
  updateFilteredActivities(): void {
    this.filteredActivities = this.activities.filter(
      (activity) =>
        (activity.category === this.activatedCategoryFilter ||
          !this.activatedCategoryFilter) &&
        (!this.searchInput.value ||
          activity.name
            .toLowerCase()
            .includes(this.searchInput.value.toLowerCase())) &&
        this.authService.authObject.activitiesPerDate[
          this.modalService.date
        ].activities
          .map((a) => a.googlePlaceId)
          .includes(activity.googlePlaceId) === false
    );
  }

  updateFilteredSetsOfActivities(): void {
    this.filteredSetsOfActivities = this.setsOfActivities.filter(
      (activity) =>
        !this.searchInput.value ||
        activity.name
          .toLowerCase()
          .includes(this.searchInput.value.toLowerCase()) ||
        activity.description
          .toLowerCase()
          .includes(this.searchInput.value.toLowerCase())
    );
  }

  getActivity(activityId: string) {
    return this.activities.find((activity) => activity.id === activityId);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
