import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent, ConfirmDirective } from './confirm.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ConfirmDirective, ConfirmComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  exports: [ConfirmDirective],
})
export class SharedModule {}
