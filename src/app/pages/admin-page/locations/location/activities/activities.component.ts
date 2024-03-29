import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ActivityService } from 'src/app/services/activity.service';
import { GoogleService } from 'src/app/services/google.service';
import { SetOfActivitiesDialogComponent } from '../set-of-activities/set-of-activities-dialog/set-of-activities-dialog.component';
@Component({
  selector: 'app-activities',
  template: `
    <div class="flex items-center flex-col">
      <div class="w-full flex justify-end mb-2">
        <div *ngIf="!selection.isEmpty()" class="mr-2">
          <button
            (click)="openActivitySetDialog()"
            matTooltip="Create set of activities"
            matTooltipPosition="left"
            mat-raised-button
            class="bg-gradient-to-tr from-red-500 to-orange-500 text-white"
          >
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
        <button
          (click)="openDialog()"
          mat-raised-button
          class="bg-gradient-to-tr from-red-500 to-orange-500 text-white"
        >
          Create activity
        </button>
      </div>
      <ng-container *ngIf="dataSource | async as ds; else loader">
        <table
          *ngIf="ds.length > 0; else noActivitiesCreatedYet"
          mat-table
          multiTemplateDataRows
          [dataSource]="dataSource"
          class="expandable-table"
        >
          <ng-container matColumnDef="select">
            <th mat-header-cell *matHeaderCellDef class="bg-red-500"></th>
            <td mat-cell *matCellDef="let row">
              <mat-checkbox
                (click)="$event.stopPropagation()"
                (change)="$event ? selection.toggle(row) : null"
                [checked]="selection.isSelected(row)"
                [aria-label]="checkboxLabel(row)"
              >
              </mat-checkbox>
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef class="bg-red-500">Name</th>
            <td mat-cell *matCellDef="let activity">{{ activity.name }}</td>
          </ng-container>

          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef class="bg-red-500">
              Category
            </th>
            <td mat-cell *matCellDef="let activity">{{ activity.category }}</td>
          </ng-container>

          <ng-container matColumnDef="deleteActivity">
            <th mat-header-cell *matHeaderCellDef class="bg-red-500"></th>
            <td mat-cell *matCellDef="let activity" class="text-right">
              <button
                (click)="openDialog(activity); $event.stopPropagation()"
                matTooltip="Edit activity"
                matTooltipPosition="left"
                class="mr-4"
              >
                <i class="fa-solid fa-pen"></i>
              </button>
              <button
                (appConfirm)="
                  activityService.deleteActivity(
                    activity.locationId,
                    activity.id
                  );
                  dataSource = activityService.getActivities(locationId)
                "
                entity="activity"
                matTooltip="Delete activity"
                matTooltipPosition="right"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </ng-container>

          <ng-container matColumnDef="expandedDetail">
            <td
              mat-cell
              *matCellDef="let activity"
              [attr.colspan]="displayedColumns.length"
            >
              <div
                class="example-activity-detail"
                [@detailExpand]="
                  activity == expandedActivity ? 'expanded' : 'collapsed'
                "
              >
                <div class="py-3">
                  <div>
                    <button
                      (click)="openImagePreview(activity.image)"
                      mat-raised-button
                      class="bg-red-500 text-white"
                      style="margin-right: 1rem"
                    >
                      <i class="fa-solid fa-image"></i> Image
                    </button>
                    <button
                      (click)="openImagePreview(activity.thumbnail)"
                      mat-raised-button
                      class="bg-red-500 text-white"
                    >
                      <i class="fa-solid fa-image"></i> Thumbnail
                    </button>
                    <div class="mt-2">
                      <label class="block font-bold">Description</label>
                      <span>{{ activity.description }}</span>
                    </div>
                    <div class="mt-2">
                      <label class="block font-bold">Google Place ID</label>
                      <span>{{ activity.googlePlaceId }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr
            mat-row
            *matRowDef="let activity; columns: displayedColumns"
            class="cursor-pointer example-activity-row"
            [class.example-expanded-row]="expandedActivity === activity"
            (click)="
              expandedActivity = expandedActivity === activity ? null : activity
            "
          ></tr>
          <tr
            mat-row
            *matRowDef="let activity; columns: ['expandedDetail']"
            class="example-detail-row last:border-b-red-500 last:border-b-2"
          ></tr>
        </table>
        <ng-template #noActivitiesCreatedYet>
          <app-empty-state-placeholder
            entity="activity"
            imageSrc="/assets/illustrations/undraw_wine_tasting_re_4jjf.svg"
          ></app-empty-state-placeholder>
        </ng-template>
      </ng-container>
    </div>
    <ng-template #loader>
      <mat-spinner class="activities-spinner"></mat-spinner>
    </ng-template>
  `,
  styles: [
    `
      ::ng-deep .mat-progress-spinner.activities-spinner circle,
      .mat-spinner circle {
        stroke: rgb(239 68 68);
      }

      tr.example-detail-row {
        height: 0;
      }

      .example-activity-row td {
        border-bottom-width: 0;
      }

      .example-activity-detail {
        overflow: hidden;
        display: flex;
      }
    `,
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ActivitiesComponent implements OnInit {
  locationId!: string;
  displayedColumns: string[] = ['select', 'name', 'category', 'deleteActivity'];
  expandedActivity: any | null;
  dataSource!: Observable<any[]>;
  selection = new SelectionModel<any>(true, []);
  destroy = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params['locationId'];
    this.dataSource = this.activityService.getActivities(this.locationId);
    this.activityService.reloadActivitiesData.subscribe(
      () => (this.selection = new SelectionModel<any>(true, []))
    );
    this.activityService.getActivities(this.locationId).subscribe(console.log);
  }

  openDialog(activity: any = null) {
    const dialogRef = this.dialog.open(CreateActivityDialog, {
      data: {
        activity,
        locationId: this.locationId,
      },
      width: '500px',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => {
        if (result === 'submitted') {
          this.dataSource = this.activityService.getActivities(this.locationId);
        }
      });
  }

  openActivitySetDialog() {
    this.dialog.open(SetOfActivitiesDialogComponent, {
      data: {
        activities: this.selection.selected,
        locationId: this.locationId,
      },
    });
  }

  openImagePreview(image: string) {
    this.dialog.open(ImagePreview, {
      data: {
        image,
      },
    });
  }

  checkboxLabel(row?: any): string {
    return '';
    // return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}

@Component({
  template: `<img [src]="data.image" />`,
})
export class ImagePreview {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Component({
  selector: 'dialog-animations-example-dialog',
  template: `<span mat-dialog-title>{{
      data.stay ? 'Edit activity' : 'Create activity'
    }}</span>
    <div class="dialog-content" mat-dialog-content>
      <form [formGroup]="createActivityForm">
        <mat-form-field appearance="fill" class="mb-2">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          <mat-error
            *ngIf="createActivityForm.controls.name.hasError('required')"
          >
            Name is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill" class="mb-2">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            <mat-option value="Parks"> Parks </mat-option>
            <mat-option value="Bars"> Bars </mat-option>
            <mat-option value="Restaurants"> Restaurants </mat-option>
          </mat-select>
          <mat-error
            *ngIf="createActivityForm.controls.category.hasError('required')"
          >
            Category is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill" class="mb-2">
          <mat-label>Google place ID</mat-label>
          <input
            matInput
            formControlName="googlePlaceId"
            [matAutocomplete]="auto"
          />
          <mat-error
            *ngIf="
              createActivityForm.controls.googlePlaceId.hasError(
                'unknownGooglePlaceIdError'
              )
            "
          >
            A valid Google place ID is <strong>required</strong>
          </mat-error>
          <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
            <mat-option
              *ngFor="let option of filteredOptions | async"
              [value]="option.place_id"
            >
              {{ option.structured_formatting?.main_text }}
              <span class="text-xs">{{
                option.structured_formatting?.secondary_text
              }}</span>
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        <mat-form-field appearance="fill" class="mb-2">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description"></textarea>
          <mat-error
            *ngIf="createActivityForm.controls.description.hasError('required')"
          >
            Description is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field
          (click)="imageInput.click()"
          class="cursor-pointer"
          appearance="fill"
          class="mb-2"
        >
          <mat-label>Image</mat-label>
          <input
            matInput
            [value]="
              createActivityForm.controls.image.value ? '✔' : 'Select image'
            "
            class="cursor-pointer"
          />
          <input
            type="file"
            hidden
            accept="image/png, image/jpeg, image/jpg"
            #imageInput
            (change)="openDialog($event)"
          />
        </mat-form-field>
        <mat-form-field
          (click)="thumbnailInput.click()"
          class="cursor-pointer"
          appearance="fill"
        >
          <mat-label>Thumbnail</mat-label>
          <input
            matInput
            [value]="
              createActivityForm.controls.thumbnail.value ? '✔' : 'Select image'
            "
            class="cursor-pointer"
          />
          <input
            type="file"
            hidden
            accept="image/png, image/jpeg, image/jpg"
            #thumbnailInput
            (change)="openDialog($event, true)"
          />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button
        [disabled]="!createActivityForm.valid"
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
export class CreateActivityDialog {
  filteredOptions!: Observable<any[]>;
  filteredGooglePlaceIds: string[] = [];

  createActivityForm = this.formBuilder.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    googlePlaceId: ['', this.googlePlaceIdValidator()],
    description: ['', Validators.required],
    image: ['', Validators.required],
    thumbnail: ['', Validators.required],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activityService: ActivityService,
    private googleService: GoogleService
  ) {}

  googlePlaceIdValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !this.filteredGooglePlaceIds.includes(control.value)
        ? { unknownGooglePlaceIdError: { value: control.value } }
        : null;
    };
  }

  ngOnInit() {
    this.createActivityForm.patchValue(this.data.activity);

    this.filteredOptions =
      this.createActivityForm.controls.googlePlaceId.valueChanges.pipe(
        switchMap((value) => {
          return this.googleService.getGooglePlaces(value);
        }),
        tap((val) => {
          this.filteredGooglePlaceIds = val.map((place) => place.place_id);
        })
      );
  }

  openDialog(imageChangedEvent: any, thumbnail = false) {
    const dialogRef = this.dialog.open(ImageUploadDialog, {
      data: {
        imageChangedEvent,
        thumbnail,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.thumbnail) {
        this.createActivityForm.controls.thumbnail.setValue(data.image);
      } else {
        this.createActivityForm.controls.image.setValue(data.image);
      }
    });
  }

  submitForm() {
    if (this.data.activity) {
      this.activityService.editActivity(this.data.locationId, {
        id: this.data.activity.id,
        ...this.createActivityForm.value,
      });
    } else {
      this.activityService.createActivity(
        this.data.locationId,
        this.createActivityForm.value
      );
    }
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  template: `<div mat-dialog-content>
      <image-cropper
        [imageChangedEvent]="imageChangedEvent"
        [maintainAspectRatio]="true"
        [aspectRatio]="data.thumbnail ? 7 / 5 : 1 / 2"
        [resizeToWidth]="data.thumbnail ? 280 : 200"
        [resizeToHeight]="data.thumbnail ? 200 : 400"
        format="png"
        (imageCropped)="imageCropped($event)"
      ></image-cropper>
    </div>
    <div mat-dialog-actions align="end">
      <button
        mat-button
        color="primary"
        [mat-dialog-close]="{ image: croppedImage, thumbnail: data.thumbnail }"
      >
        Confirm
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
export class ImageUploadDialog {
  imageChangedEvent = '';
  croppedImage = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.imageChangedEvent = this.data.imageChangedEvent;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64!;
    console.log(this.croppedImage);
  }
}
