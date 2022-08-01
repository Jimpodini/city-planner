import { Component, Inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ActivityService } from 'src/app/services/activity.service';
import { StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'app-stays',
  template: `
    <button
      (click)="openDialog()"
      class="bg-rose-900 text-white p-1 px-2 rounded-md"
    >
      Create stay
    </button>
    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
      <!--- Note that these columns can be defined in any order.
          The actual rendered columns are set as a property on the row definition" -->

      <!-- Position Column -->
      <ng-container matColumnDef="checkInDate">
        <th mat-header-cell *matHeaderCellDef>checkInDate</th>
        <td mat-cell *matCellDef="let element">{{ element.checkInDate }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [],
})
export class StaysComponent implements OnInit {
  locationId!: string;
  displayedColumns: string[] = ['checkInDate'];
  dataSource: any;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private stayService: StayService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params['locationId'];
    this.dataSource = this.stayService.getStays(this.locationId);
    // this.activityService.getActivities(this.locationId).subscribe(console.log);
  }

  openDialog() {
    this.dialog.open(CreateStayDialog, {
      data: {
        locationId: this.locationId,
      },
    });
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  template: `<span mat-dialog-title>Create stay</span>
    <div class="dialog-content" mat-dialog-content>
      <form [formGroup]="createStayForm">
        <mat-form-field appearance="fill" class="mb-2">
          <mat-label>Guest name</mat-label>
          <input matInput formControlName="guestName" />
          <mat-error
            *ngIf="createStayForm.controls.guestName.hasError('required')"
          >
            Guest name is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <!-- <mat-form-field appearance="fill" class="mb-2">
          <mat-label>Choose a date</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            formControlName="checkInDate"
          />
          <mat-hint>MM/DD/YYYY</mat-hint>
          <mat-error
            *ngIf="createStayForm.controls.checkInDate.hasError('required')"
          >
            Check-in date is <strong>required</strong>
          </mat-error>
          <mat-datepicker-toggle
            matSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field> -->
        <!-- <mat-form-field appearance="fill" class="mb-2">
          <mat-label>Check-in date</mat-label>
          <input matInput formControlName="checkInDate" />
          <mat-error
            *ngIf="createStayForm.controls.checkInDate.hasError('required')"
          >
            Check-in date is <strong>required</strong>
          </mat-error>
        </mat-form-field> -->
        <mat-form-field appearance="fill">
          <mat-label>Check-out date</mat-label>
          <input matInput formControlName="checkOutDate" />
          <mat-error
            *ngIf="createStayForm.controls.checkOutDate.hasError('required')"
          >
            Check out date is <strong>required</strong>
          </mat-error>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button
        [disabled]="!createStayForm.valid"
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
export class CreateStayDialog {
  createStayForm = this.formBuilder.group({
    guestName: ['', Validators.required],
    checkInDate: ['', Validators.required],
    checkOutDate: ['', Validators.required],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private stayService: StayService
  ) {}

  submitForm() {
    console.log(this.createStayForm.value);
    this.stayService.createStay(
      this.data.locationId,
      this.createStayForm.value
    );
  }
}
