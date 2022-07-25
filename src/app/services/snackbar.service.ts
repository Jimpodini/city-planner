import { Component, Injectable, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  openSnackbar(message: string) {
    this.snackbar.openFromComponent(SnackbarContentComponent, {
      panelClass: 'custom-snackbar',
      data: {
        message,
      },
    });
  }
}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: `<h1>hello</h1>`,
  styles: [
    `
      .custom-snackbar {
        background-color: white;
        color: black;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SnackbarContentComponent {}
