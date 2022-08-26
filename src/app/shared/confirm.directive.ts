import {
  Component,
  Directive,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appConfirm]',
})
export class ConfirmDirective implements OnDestroy {
  @Input() entity = 'entity';

  @Output() appConfirm = new EventEmitter<void>();

  destroy = new Subject<void>();

  @HostListener('click', ['$event']) onClick(event: PointerEvent) {
    event.stopPropagation();
    const dialogRef = this.modal.open(ConfirmComponent, {
      data: {
        entity: this.entity,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.appConfirm.emit();
        }
      });
  }

  constructor(private modal: MatDialog) {}

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}

@Component({
  template: `<div class="mb-5">
      Are you sure you want to delete this {{ data.entity }}?
    </div>
    <div class="flex justify-between">
      <button
        mat-raised-button
        (click)="closeConfirmModal(false)"
        class="bg-gradient-to-tr from-red-700 to-red-900 text-white"
      >
        No</button
      ><button
        mat-raised-button
        (click)="closeConfirmModal(true)"
        class="bg-gradient-to-tr from-green-700 to-green-900 text-white"
      >
        Yes
      </button>
    </div>`,
})
export class ConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmComponent>
  ) {}

  closeConfirmModal(confirmAction: boolean) {
    this.dialogRef.close(confirmAction);
  }
}
