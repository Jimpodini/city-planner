import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ImageCropperModule } from 'ngx-image-cropper';

import { LoginComponent } from 'src/app/components/login/login.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminPageComponent } from './admin-page.component';
import { RegisterComponent } from 'src/app/components/register/register.component';
import {
  CreateLocationDialog,
  LocationsComponent,
} from '../admin-page/locations/locations.component';
import {
  CreateActivityDialog,
  ImageUploadDialog,
  LocationComponent,
} from '../admin-page/locations/location/location.component';

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
    ImageCropperModule,
  ],
  providers: [],
})
export class AdminModule {}
