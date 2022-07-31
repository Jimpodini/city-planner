import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { LocationService } from 'src/app/services/location.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

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
