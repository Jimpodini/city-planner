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
  template: `<div>Are you sure you want to delete this {{ data.entity }}?</div>
    <div>
      <button mat-raised-button (click)="closeConfirmModal(false)">No</button
      ><button mat-raised-button (click)="closeConfirmModal(true)">Yes</button>
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
