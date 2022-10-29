import { Component, OnInit } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  resetPasswordMode = false;

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  resetPasswordForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private auth: Auth,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {}

  submitForm() {
    signInWithEmailAndPassword(
      this.auth,
      this.loginForm.controls.email.value,
      this.loginForm.controls.password.value
    )
      .then(() => {
        this.router.navigate(['/admin']);
      })
      .catch(() => this.snackbarService.openSnackbar('error', 'Login failed'));
  }

  resetPassword() {
    sendPasswordResetEmail(
      this.auth,
      this.resetPasswordForm.controls.email.value
    )
      .then(() => {
        this.resetPasswordMode = false;
        this.resetPasswordForm.controls.email.setValue('');
        this.snackbarService.openSnackbar(
          'success',
          'A password reset email has been sent'
        );
      })
      .catch(() =>
        this.snackbarService.openSnackbar('error', 'Something went wrong')
      );
  }
}
