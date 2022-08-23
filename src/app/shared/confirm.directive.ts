import {
  Component,
  Directive,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Directive({
  selector: '[appConfirm]',
})
export class ConfirmDirective {
  @Input() entity = 'entity';

  @Output() appConfirm = new EventEmitter<void>();

  @HostListener('click', ['$event']) onClick(event: PointerEvent) {
    event.stopPropagation();
    const dialogRef = this.modal.open(ConfirmComponent, {
      data: {
        entity: this.entity,
      },
    });

    dialogRef.afterClosed().subscribe((val) => {
      if (val === 'confirm') {
        this.appConfirm.emit();
      }
    });
  }

  constructor(private modal: MatDialog) {}
}

@Component({
  template: `<div>Are you sure you want to delete this {{ data.entity }}?</div>
    <div>
      <button mat-raised-button (click)="closeConfirmModal(false)">No</button
      ><button mat-raised-button (click)="closeConfirmModal(true)">Yes</button>
    </div>`,
})
export class ConfirmComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  closeConfirmModal(confirmAction: boolean) {}
}
