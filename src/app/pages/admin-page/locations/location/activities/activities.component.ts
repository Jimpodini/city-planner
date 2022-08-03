import { Component, Inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ActivityService } from 'src/app/services/activity.service';
@Component({
  selector: 'app-activities',
  template: `
    <button
      (click)="openDialog()"
      class="bg-fuchsia-900 text-white p-1 px-2 rounded-md"
    >
      Create activity
    </button>
    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
      <!--- Note that these columns can be defined in any order.
          The actual rendered columns are set as a property on the row definition" -->

      <!-- Position Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>name</th>
        <td mat-cell *matCellDef="let element">{{ element.name }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [],
})
export class ActivitiesComponent implements OnInit {
  locationId!: string;
  displayedColumns: string[] = ['name'];
  dataSource: any;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params['locationId'];
    this.dataSource = this.activityService.getActivities(this.locationId);
    this.activityService.getActivities(this.locationId).subscribe(console.log);
  }

  openDialog() {
    this.dialog.open(CreateActivityDialog, {
      data: {
        locationId: this.locationId,
      },
    });
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  template: `<span mat-dialog-title>Create activity</span>
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
          <input matInput formControlName="googlePlaceId" />
          <mat-error
            *ngIf="
              createActivityForm.controls.googlePlaceId.hasError('required')
            "
          >
            Google place ID is <strong>required</strong>
          </mat-error>
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
          <input matInput value="Select image" class="cursor-pointer" />
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
          <input matInput value="Select image" class="cursor-pointer" />
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
  createActivityForm = this.formBuilder.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    googlePlaceId: ['', Validators.required],
    description: ['', Validators.required],
    image: ['', Validators.required],
    thumbnail: ['', Validators.required],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private activityService: ActivityService
  ) {}

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
      console.log(this.createActivityForm.value);
    });
  }

  submitForm() {
    console.log(this.createActivityForm.value);
    this.activityService.createActivity(
      this.data.locationId,
      this.createActivityForm.value
    );
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
