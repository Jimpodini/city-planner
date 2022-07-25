import { Component, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import {
  FormBuilder,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  loading = false;
  registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private auth: Auth,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {}

  submitForm(): void {
    this.loading = true;
    createUserWithEmailAndPassword(
      this.auth,
      this.registerForm.controls.email.value,
      this.registerForm.controls.password.value
    )
      .then((v) => {
        this.loading = false;
        console.log(v);
      })
      .catch((e) => {
        console.log(e);
        this.openSnackbar();
      });
  }

  private openSnackbar() {
    this.snackbar.openSnackbar();
  }
}
