import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { FeatureAreaComponent } from './core/feature-area/feature-area.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToAdmin = () => redirectLoggedInTo(['admin']);

const routes: Routes = [
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
  {
    path: 'admin',
    component: AdminPageComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: '404',
    component: PageNotFoundComponent,
  },
  {
    path: ':stayId',
    component: FeatureAreaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
