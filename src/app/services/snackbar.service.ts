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

  openSnackbar(type: SnackbarType, message: string, duration?: number) {
    let snackbarTypeClass = '';
    if (type === 'error') snackbarTypeClass = 'error-snackbar';
    if (type === 'success') snackbarTypeClass = 'success-snackbar';
    this.snackbar.openFromComponent(SnackbarContentComponent, {
      panelClass: ['custom-snackbar', snackbarTypeClass],
      data: {
        message,
        type,
      },
      duration,
    });
  }
}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: `
    <div class="flex justify-between">
      <ng-container *ngIf="data.type === 'error'">
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
      </ng-container>

      <ng-container *ngIf="data.type === 'success'">
        <div class="self-center">
          {{ data.message }} <i class="fa-solid fa-check"></i>
        </div>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .error-snackbar {
        border-left: 5px solid rgb(153, 27, 27);
        background-color: white;
        color: black;
      }

      .success-snackbar {
        background-image: linear-gradient(to top right, #0bab64, #3bb78f);
        color: white;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SnackbarContentComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: { message: string; type: SnackbarType },
    public snackbar: MatSnackBar
  ) {
    console.log(data);
  }
}
