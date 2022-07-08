import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FeatureAreaComponent } from './core/feature-area/feature-area.component';

const routes: Routes = [
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
