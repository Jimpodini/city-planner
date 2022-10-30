import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Stay, StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'app-stays',
  template: `
    <div class="flex items-center flex-col">
      <div class="w-full flex justify-end mb-2">
        <button
          (click)="openDialog()"
          mat-raised-button
          class="bg-gradient-to-tr from-pink-600 to-rose-600 text-white"
        >
          Create stay
        </button>
      </div>
      <ng-container *ngIf="dataSource | async as ds; else loader">
        <table
          *ngIf="ds.length > 0; else noStaysCreatedYet"
          mat-table
          [dataSource]="dataSource"
        >
          <ng-container matColumnDef="guestName">
            <th mat-header-cell *matHeaderCellDef class="bg-pink-600">
              Guest name
            </th>
            <td mat-cell *matCellDef="let stay">{{ stay.guestName }}</td>
          </ng-container>
          <ng-container matColumnDef="checkInDate">
            <th mat-header-cell *matHeaderCellDef class="bg-pink-600">
              Check-in
            </th>
            <td mat-cell *matCellDef="let stay">
              {{ stay.checkInDate }}
            </td>
          </ng-container>
          <ng-container matColumnDef="checkOutDate">
            <th mat-header-cell *matHeaderCellDef class="bg-pink-600">
              Check-out
            </th>
            <td mat-cell *matCellDef="let stay">
              {{ stay.checkOutDate }}
            </td>
          </ng-container>
          <ng-container matColumnDef="deleteStay">
            <th mat-header-cell *matHeaderCellDef class="bg-pink-600"></th>
            <td mat-cell *matCellDef="let stay" class="text-right">
              <button
                (click)="$event.stopPropagation()"
                [cdkCopyToClipboard]="getStayUrl(stay)"
                (cdkCopyToClipboardCopied)="stayUrlCopied()"
                matTooltip="Copy link"
                matTooltipPosition="left"
                class="mr-4"
              >
                <i class="fa-solid fa-copy"></i>
              </button>
              <button
                (click)="openDialog(stay); $event.stopPropagation()"
                matTooltip="Edit stay"
                matTooltipPosition="below"
                class="mr-4"
              >
                <i class="fa-solid fa-pen"></i>
              </button>
              <button
                (appConfirm)="
                  stayService.deleteStay(stay.id);
                  dataSource = stayService.getStays(locationId)
                "
                entity="stay"
                matTooltip="Delete stay"
                matTooltipPosition="right"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr
            mat-row
            *matRowDef="let stay; columns: displayedColumns"
            (click)="navigateToStay(stay.id)"
            class="last:border-b-pink-600 last:border-b-2 cursor-pointer"
          ></tr>
        </table>
        <ng-template #noStaysCreatedYet>
          <app-empty-state-placeholder
            entity="stay"
            imageSrc="/assets/illustrations/undraw_best_place_re_lne9.svg"
          ></app-empty-state-placeholder>
        </ng-template>
      </ng-container>
      <ng-template #loader>
        <mat-spinner class="stays-spinner"></mat-spinner>
      </ng-template>
    </div>
  `,
  styles: [
    `
      ::ng-deep .mat-progress-spinner.stays-spinner circle,
      .mat-spinner circle {
        stroke: rgb(219 39 119);
      }
    `,
  ],
})
export class StaysComponent implements OnInit, OnDestroy {
  locationId!: string;
  displayedColumns: string[] = [
    'guestName',
    'checkInDate',
    'checkOutDate',
    'deleteStay',
  ];
  dataSource!: Observable<any[]>;
  destroy = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public stayService: StayService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params['locationId'];
    this.dataSource = this.stayService.getStays(this.locationId);
    this.stayService.getStays(this.locationId).subscribe(console.log);
  }

  openDialog(stay: any = null) {
    const dialogRef = this.dialog.open(CreateStayDialog, {
      data: {
        stay,
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

  navigateToStay(stayId: string) {
    window.open(stayId, '_blank')?.focus();
  }

  getStayUrl(stay: any) {
    // TODO type stay
    return `${window.location.origin}/${stay.id}`;
  }

  stayUrlCopied() {
    // TODO fix look of success snackbar
    this.snackbarService.openSnackbar(
      'success',
      'Link to stay is copied',
      2000
    );
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  template: `<span mat-dialog-title>{{
      data.stay ? 'Edit stay' : 'Create stay'
    }}</span>
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
            [disabled]="data.stay"
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
            [disabled]="data.stay"
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
export class CreateStayDialog {
  createStayForm = this.formBuilder.group({
    guestName: ['', Validators.required],
    checkInDate: ['', Validators.required],
    checkOutDate: ['', Validators.required],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stayService: StayService
  ) {}

  ngOnInit() {
    this.createStayForm.patchValue(this.data.stay);
  }

  submitForm() {
    if (this.data.stay) {
      this.stayService.editStay(<Stay>{
        id: this.data.stay.id,
        ...this.createStayForm.value,
      });
    } else {
      this.stayService.createStay(
        this.data.locationId,
        <Stay>this.createStayForm.value
      );
    }
  }

  convertDateToYYYYMMDD(formControl: FormControl) {
    if (formControl.value) {
      formControl.setValue(formControl.value.toISOString().split('T')[0]);
    }
  }
}
