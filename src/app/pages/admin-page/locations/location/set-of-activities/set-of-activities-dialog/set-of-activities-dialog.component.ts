import { Component, Inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  template: `<span mat-dialog-title>Create set of activities</span>
    <div class="dialog-content" mat-dialog-content>
      <form [formGroup]="createActivitySetForm">
        <mat-form-field appearance="fill" class="mb-2">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          <mat-error
            *ngIf="createActivitySetForm.controls.name.hasError('required')"
          >
            Name is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Description</mat-label>
          <input matInput formControlName="description" />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button
        [disabled]="!createActivitySetForm.valid"
        (click)="submitForm()"
        mat-button
        color="primary"
        mat-dialog-close="submitted"
      >
        Save
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
export class SetOfActivitiesDialogComponent {
  createActivitySetForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
  });

  ngOnInit() {
    console.log(this.data.setOfActivities);
  }

  constructor(
    private formBuilder: NonNullableFormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private activityService: ActivityService
  ) {}

  submitForm() {
    console.log('submitted!');
    this.activityService
      .createSetOfActivities(this.data.locationId, {
        name: this.createActivitySetForm.controls.name.value,
        description: this.createActivitySetForm.controls.description.value,
        activities: this.data.setOfActivities.map(
          (activity: any) => activity.id
        ),
      })
      .then(() => this.activityService.reloadActivitiesData.next());
  }
}
