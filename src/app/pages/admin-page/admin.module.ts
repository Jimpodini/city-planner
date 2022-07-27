import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from 'src/app/components/login/login.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminPageComponent } from './admin-page.component';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { LocationsComponent } from '../locations/locations.component';

@NgModule({
  declarations: [
    AdminPageComponent,
    LoginComponent,
    RegisterComponent,
    LocationsComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, ReactiveFormsModule],
  providers: [],
})
export class AdminModule {}
