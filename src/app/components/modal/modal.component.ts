import { Component, Input, OnInit } from '@angular/core';
import { Firestore, setDoc, doc, collection } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ACTIVITIES } from 'src/app/activities';
import { AuthService } from 'src/app/auth.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() date: string | undefined;

  activities = ACTIVITIES;
  filteredActivities = ACTIVITIES;
  categories = ['Parks', 'Restaurants', 'Bars'];
  activatedCategoryFilter: string = '';
  searchInput = new FormControl('');

  unsubscribe = new Subject<void>();

  constructor(
    public modalService: ModalService,
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
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

    // TODO refactor db logic
    const db = collection(this.firestore, 'stays');
    setDoc(doc(db, this.authService.stayId), this.authService.authObject);
  }

  activateCategoryFilter(category: string): void {
    this.activatedCategoryFilter = category;
    this.updateFilteredActivities();
  }

  updateFilteredActivities(): void {
    this.filteredActivities = this.activities.filter(
      (activity) =>
        (activity.category === this.activatedCategoryFilter ||
          !this.activatedCategoryFilter) &&
        (!this.searchInput.value ||
          activity.name.includes(this.searchInput.value))
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
