import {
  Component,
  Inject,
  Injectable,
  ViewEncapsulation,
} from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export type SnackbarType = 'success' | 'error';
@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  openSnackbar(type: SnackbarType, message: string) {
    let snackbarTypeClass = '';
    if (type === 'error') snackbarTypeClass = 'error-snackbar';
    if (type === 'success') snackbarTypeClass = 'success-snackbar';
    this.snackbar.openFromComponent(SnackbarContentComponent, {
      panelClass: ['custom-snackbar', snackbarTypeClass],
      data: {
        message,
      },
    });
  }
}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: `
    <div class="flex justify-between">
      <div class="self-center">
        {{ data.message }}
        <i class="fa-solid fa-triangle-exclamation text-red-800"></i>
      </div>
      <button
        (click)="snackbar.dismiss()"
        class="bg-red-800 text-white rounded-md p-1 px-2"
      >
        Close
      </button>
    </div>
  `,
  styles: [
    `
      .custom-snackbar {
        background-color: white;
        color: black;
      }

      .error-snackbar {
        border-left: 5px solid rgb(153, 27, 27);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SnackbarContentComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackbar: MatSnackBar
  ) {}
}
