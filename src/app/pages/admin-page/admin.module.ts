import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ImageCropperModule } from 'ngx-image-cropper';

import { LoginComponent } from 'src/app/components/login/login.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminPageComponent } from './admin-page.component';
import { RegisterComponent } from 'src/app/components/register/register.component';
import {
  CreateLocationDialog,
  LocationsComponent,
} from '../admin-page/locations/locations.component';
import { LocationComponent } from '../admin-page/locations/location/location.component';
import {
  ActivitiesComponent,
  CreateActivityDialog,
  ImageUploadDialog,
} from './locations/location/activities/activities.component';
import {
  CreateStayDialog,
  StaysComponent,
} from './locations/location/stays/stays.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    AdminPageComponent,
    LoginComponent,
    RegisterComponent,
    LocationsComponent,
    CreateLocationDialog,
    LocationComponent,
    CreateActivityDialog,
    ImageUploadDialog,
    ActivitiesComponent,
    StaysComponent,
    CreateStayDialog,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ImageCropperModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'sv-SE' }],
})
export class AdminModule {}
