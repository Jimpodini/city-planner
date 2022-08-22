import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subject, takeUntil } from 'rxjs';
import { ActivityService } from 'src/app/services/activity.service';
@Component({
  selector: 'app-activities',
  template: `
    <div class="flex items-center flex-col">
      <div class="w-full flex justify-end mb-2">
        <button
          (click)="openDialog()"
          mat-raised-button
          class="bg-gradient-to-tr from-red-500 to-orange-500 text-white"
        >
          Create activity
        </button>
      </div>
      <table
        *ngIf="dataSource | async; else loader"
        mat-table
        multiTemplateDataRows
        [dataSource]="dataSource"
      >
        <!--- Note that these columns can be defined in any order.
          The actual rendered columns are set as a property on the row definition" -->

        <!-- Position Column -->
        <!-- TODO - loop over displayedColumns -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef class="bg-red-500">Name</th>
          <td mat-cell *matCellDef="let element">{{ element.name }}</td>
        </ng-container>

        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef class="bg-red-500">Category</th>
          <td mat-cell *matCellDef="let element">{{ element.category }}</td>
        </ng-container>

        <ng-container matColumnDef="deleteActivity">
          <th mat-header-cell *matHeaderCellDef class="bg-red-500"></th>
          <td mat-cell *matCellDef="let element" class="text-right">
            <button
              (click)="
                activityService.deleteActivity(element.locationId, element.id);
                $event.stopPropagation()
              "
              matTooltip="Delete activity"
              matTooltipPosition="left"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </ng-container>

        <ng-container matColumnDef="expandedDetail">
          <td
            mat-cell
            *matCellDef="let element"
            [attr.colspan]="displayedColumns.length"
          >
            <div
              class="example-element-detail"
              [@detailExpand]="
                element == expandedElement ? 'expanded' : 'collapsed'
              "
            >
              <div class="py-3">
                <div>
                  <button
                    (click)="openImagePreview(element.image)"
                    mat-raised-button
                    class="bg-red-500 text-white"
                    style="margin-right: 1rem"
                  >
                    <i class="fa-solid fa-image"></i> Image
                  </button>
                  <button
                    (click)="openImagePreview(element.thumbnail)"
                    mat-raised-button
                    class="bg-red-500 text-white"
                  >
                    <i class="fa-solid fa-image"></i> Thumbnail
                  </button>
                  <div class="mt-2">
                    <label class="block font-bold">Description</label>
                    <span>{{ element.description }}</span>
                  </div>
                  <div class="mt-2">
                    <label class="block font-bold">Google Place ID</label>
                    <span>{{ element.googlePlaceId }}</span>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr
          mat-row
          *matRowDef="let element; columns: displayedColumns"
          class="cursor-pointer example-element-row"
          [class.example-expanded-row]="expandedElement === element"
          (click)="
            expandedElement = expandedElement === element ? null : element
          "
        ></tr>
        <tr
          mat-row
          *matRowDef="let element; columns: ['expandedDetail']"
          class="example-detail-row last:border-b-red-500"
        ></tr>
      </table>
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

      .example-element-row td {
        border-bottom-width: 0;
      }

      .example-element-detail {
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
  displayedColumns: string[] = ['name', 'category', 'deleteActivity'];
  expandedElement: any | null;
  dataSource: any;
  destroy = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params['locationId'];
    this.dataSource = this.activityService.getActivities(this.locationId);
    this.activityService.getActivities(this.locationId).subscribe(console.log);
  }

  openDialog() {
    const dialogRef = this.dialog.open(CreateActivityDialog, {
      data: {
        locationId: this.locationId,
      },
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

  openImagePreview(image: string) {
    this.dialog.open(ImagePreview, {
      data: {
        image,
      },
    });
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
        mat-dialog-close="submitted"
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
