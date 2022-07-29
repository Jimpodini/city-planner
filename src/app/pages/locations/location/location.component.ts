import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from 'src/app/services/activity.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  locationId!: string;

  constructor(private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params['locationId'];
  }

  openDialog() {
    this.dialog.open(CreateActivityDialog);
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  template: `<span mat-dialog-title>Create activity</span>
    <div class="dialog-content" mat-dialog-content>
      <form [formGroup]="createActivity">
        <mat-form-field appearance="fill" class="mb-2">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          <mat-error *ngIf="createActivity.controls.name.hasError('required')">
            Name is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill" class="mb-2">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            <mat-option value="1"> 1 </mat-option>
            <mat-option value="2"> 2 </mat-option>
            <mat-option value="3"> 3 </mat-option>
          </mat-select>
          <mat-error
            *ngIf="createActivity.controls.category.hasError('required')"
          >
            Category is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill" class="mb-2">
          <mat-label>Google place ID</mat-label>
          <input matInput formControlName="googlePlaceId" />
          <mat-error
            *ngIf="createActivity.controls.googlePlaceId.hasError('required')"
          >
            Google place ID is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description"></textarea>
          <mat-error
            *ngIf="createActivity.controls.description.hasError('required')"
          >
            Description is <strong>required</strong>
          </mat-error>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button
        [disabled]="!createActivity.valid"
        (click)="submitForm()"
        mat-button
        color="primary"
        mat-dialog-close
      >
        Create
      </button>
    </div>`,
  styles: [
    `
      .dialog-content form {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class CreateActivityDialog {
  createActivity = this.formBuilder.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    googlePlaceId: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(private formBuilder: NonNullableFormBuilder) {}

  submitForm() {
    console.log(this.createActivity.value);
    // console.log(this.createLocationForm.value);
    // this.locationService.createLocation({
    //   address: this.createLocationForm.controls.address.value,
    //   city: this.createLocationForm.controls.city.value,
    // });
  }
}
