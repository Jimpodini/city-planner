import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent, ConfirmDirective } from './confirm.directive';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ConfirmDirective, ConfirmComponent],
  imports: [CommonModule, MatButtonModule],
  exports: [ConfirmDirective],
})
export class SharedModule {}
