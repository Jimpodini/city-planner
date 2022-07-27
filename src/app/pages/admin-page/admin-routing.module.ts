import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';
import { AdminPageComponent } from './admin-page.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { RegisterComponent } from 'src/app/components/register/register.component';

const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['/admin/login']);
const redirectLoggedInToAdmin = () => redirectLoggedInTo(['/admin']);

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      {
        path: '',
        redirectTo: 'planner',
        pathMatch: 'full',
      },
      {
        path: 'planner',
        component: RegisterComponent,
        ...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: 'login',
        component: LoginComponent,
        ...canActivate(redirectLoggedInToAdmin),
      },
      {
        path: 'register',
        component: RegisterComponent,
        ...canActivate(redirectLoggedInToAdmin),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
