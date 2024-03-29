import { Component, Inject, OnInit } from '@angular/core';
import { Location, LocationService } from 'src/app/services/location.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource = this.locationService.getLocations();
  destroy = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    public locationService: LocationService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.locationService.getLocations().subscribe(console.log);

    this.breakpointObserver
      .observe(Breakpoints.XSmall)
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        console.log(res);
        if (res.matches) {
          this.displayedColumns = ['address', 'city', 'editOrDeleteLocation'];
        } else {
          this.displayedColumns = [
            'id',
            'address',
            'city',
            'editOrDeleteLocation',
          ];
        }
      });
  }

  openDialog(location?: Location): void {
    const dialogRef = this.dialog.open(CreateLocationDialog, {
      data: {
        location,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => {
        if (result === 'submitted') {
          this.dataSource = this.locationService.getLocations();
        }
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  template: `<span mat-dialog-title>Create location</span>
    <div class="dialog-content" mat-dialog-content>
      <form [formGroup]="createLocationForm">
        <mat-form-field appearance="fill" class="mb-2">
          <mat-label>Address</mat-label>
          <input matInput formControlName="address" />
          <mat-error
            *ngIf="createLocationForm.controls.address.hasError('required')"
          >
            Address is <strong>required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>City</mat-label>
          <input matInput formControlName="city" />
          <mat-error
            *ngIf="createLocationForm.controls.city.hasError('required')"
          >
            City is <strong>required</strong>
          </mat-error>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button
        [disabled]="!createLocationForm.valid"
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
export class CreateLocationDialog {
  createLocationForm = this.formBuilder.group({
    address: ['', Validators.required],
    city: ['', Validators.required],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private locationService: LocationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.createLocationForm.patchValue(this.data.location);
  }

  submitForm() {
    if (this.data.location) {
      this.locationService.editLocation({
        id: this.data.location.id,
        address: this.createLocationForm.controls.address.value,
        city: this.createLocationForm.controls.city.value,
      });
    } else {
      this.locationService.createLocation({
        address: this.createLocationForm.controls.address.value,
        city: this.createLocationForm.controls.city.value,
      });
    }
  }
}
