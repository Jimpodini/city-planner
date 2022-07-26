import { Component, OnInit } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  constructor(
    private formBuilder: NonNullableFormBuilder,
    private auth: Auth
  ) {}

  ngOnInit(): void {}

  submitForm() {
    signInWithEmailAndPassword(
      this.auth,
      this.loginForm.controls.email.value,
      this.loginForm.controls.password.value
    );
    console.log('Form submitted');
  }
}
