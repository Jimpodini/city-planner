import { Component, Inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';

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
            <mat-option value="1"> 1 </mat-option>
            <mat-option value="2"> 2 </mat-option>
            <mat-option value="3"> 3 </mat-option>
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
    private dialog: MatDialog
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
    // console.log(this.createLocationForm.value);
    // this.locationService.createLocation({
    //   address: this.createLocationForm.controls.address.value,
    //   city: this.createLocationForm.controls.city.value,
    // });
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
