import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
// TODO and remove static activities (or keep as demo data)
import { ACTIVITIES } from 'src/app/activities';
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
  @Input() date: string | undefined;

  activities = this.activityService.activities;
  filteredActivities = this.activities;
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
      .subscribe(() => this.updateFilteredActivities());
  }

  addActivity(activity: any) {
    this.authService.authObject.activitiesPerDate[
      this.modalService.date
    ].activities.push(activity);
    this.authService.authObject.activitiesPerDate[
      this.modalService.date
    ].googleDirectionLink = this.authService.getGoogleUrl(
      this.modalService.date
    );

    this.stayService.saveStay();
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
          activity.name.includes(this.searchInput.value)) &&
        this.authService.authObject.activitiesPerDate[
          this.modalService.date
        ].activities
          .map((a) => a.googlePlaceId)
          .includes(activity.googlePlaceId) === false
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
