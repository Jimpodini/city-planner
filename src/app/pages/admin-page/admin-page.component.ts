import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
  constructor(public auth: Auth, private router: Router) {}

  ngOnInit(): void {}

  logout() {
    this.auth.signOut().then(() => this.router.navigate(['/admin/login']));
  }
}
