import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/app/services/location.service';
import { MatDialog } from '@angular/material/dialog';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'address', 'city'];
  dataSource = this.locationService.getLocations();

  constructor(
    private dialog: MatDialog,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.locationService.getLocations().subscribe(console.log);
  }

  openDialog(): void {
    this.dialog.open(CreateLocationDialog);
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
export class CreateLocationDialog {
  createLocationForm = this.formBuilder.group({
    address: ['', Validators.required],
    city: ['', Validators.required],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private locationService: LocationService
  ) {}

  submitForm() {
    console.log(this.createLocationForm.value);
    this.locationService.createLocation({
      address: this.createLocationForm.controls.address.value,
      city: this.createLocationForm.controls.city.value,
    });
  }
}
