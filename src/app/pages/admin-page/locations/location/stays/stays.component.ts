import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'app-stays',
  template: `
    <div class="flex items-center flex-col">
      <div class="w-full flex justify-end mb-2">
        <button
          (click)="openDialog()"
          mat-raised-button
          class="bg-rose-900 text-white"
        >
          Create stay
        </button>
      </div>
      <table
        *ngIf="dataSource | async; else loader"
        mat-table
        [dataSource]="dataSource"
      >
        <ng-container matColumnDef="guestName">
          <th mat-header-cell *matHeaderCellDef class="bg-rose-900">
            Guest name
          </th>
          <td mat-cell *matCellDef="let element">{{ element.checkInDate }}</td>
        </ng-container>
        <ng-container matColumnDef="checkInDate">
          <th mat-header-cell *matHeaderCellDef class="bg-rose-900">
            Check-in date
          </th>
          <td mat-cell *matCellDef="let element">{{ element.checkInDate }}</td>
        </ng-container>
        <ng-container matColumnDef="checkOutDate">
          <th mat-header-cell *matHeaderCellDef class="bg-rose-900">
            Check-out date
          </th>
          <td mat-cell *matCellDef="let element">{{ element.checkInDate }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: displayedColumns"
          class="last:border-b-rose-900"
        ></tr>
      </table>
      <ng-template #loader>
        <mat-spinner class="stays-spinner"></mat-spinner>
      </ng-template>
    </div>
  `,
  styles: [
    `
      ::ng-deep .mat-progress-spinner.stays-spinner circle,
      .mat-spinner circle {
        stroke: rgb(136 19 55);
      }
    `,
  ],
})
export class StaysComponent implements OnInit, OnDestroy {
  locationId!: string;
  displayedColumns: string[] = ['guestName', 'checkInDate', 'checkOutDate'];
  dataSource: any;
  destroy = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private stayService: StayService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params['locationId'];
    this.dataSource = this.stayService.getStays(this.locationId);
  }

  openDialog() {
    const dialogRef = this.dialog.open(CreateStayDialog, {
      data: {
        locationId: this.locationId,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => {
        if (result === 'submitted') {
          this.dataSource = this.stayService.getStays(this.locationId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
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
        <mat-form-field appearance="fill" class="mb-2">
          <mat-label>Choose a date</mat-label>
          <input
            matInput
            [matDatepicker]="checkInDatePicker"
            formControlName="checkInDate"
            (dateChange)="
              convertDateToYYYYMMDD(createStayForm.controls.checkInDate)
            "
          />
          <mat-hint>YYYY-MM-DD</mat-hint>
          <mat-error
            *ngIf="createStayForm.controls.checkInDate.hasError('required')"
          >
            Check-in date is <strong>required</strong>
          </mat-error>
          <mat-datepicker-toggle
            matSuffix
            [for]="checkInDatePicker"
          ></mat-datepicker-toggle>
          <mat-datepicker #checkInDatePicker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Choose a date</mat-label>
          <input
            matInput
            [matDatepicker]="checkOutDatePicker"
            formControlName="checkOutDate"
            (dateChange)="
              convertDateToYYYYMMDD(createStayForm.controls.checkOutDate)
            "
          />
          <mat-hint>YYYY-MM-DD</mat-hint>
          <mat-error
            *ngIf="createStayForm.controls.checkOutDate.hasError('required')"
          >
            Check-out date is <strong>required</strong>
          </mat-error>
          <mat-datepicker-toggle
            matSuffix
            [for]="checkOutDatePicker"
          ></mat-datepicker-toggle>
          <mat-datepicker #checkOutDatePicker></mat-datepicker>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button
        [disabled]="!createStayForm.valid"
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
export class CreateStayDialog {
  createStayForm = this.formBuilder.group({
    guestName: ['', Validators.required],
    checkInDate: ['', Validators.required],
    checkOutDate: ['', Validators.required],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private stayService: StayService
  ) {}

  submitForm() {
    this.stayService.createStay(
      this.data.locationId,
      this.createStayForm.value
    );
  }

  convertDateToYYYYMMDD(formControl: FormControl) {
    if (formControl.value) {
      formControl.setValue(formControl.value.toISOString().split('T')[0]);
    }
  }
}
