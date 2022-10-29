import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { ConfirmComponent, ConfirmDirective } from './confirm.directive';
import { AttachClassWhenInViewportDirective } from './attach-class-when-in-viewport.directive';

@NgModule({
  declarations: [
    ConfirmDirective,
    ConfirmComponent,
    AttachClassWhenInViewportDirective,
  ],
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  exports: [ConfirmDirective, AttachClassWhenInViewportDirective],
})
export class SharedModule {}
