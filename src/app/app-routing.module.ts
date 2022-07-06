import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureAreaComponent } from './core/feature-area/feature-area.component';

const routes: Routes = [
  {
    path: '',
    component: FeatureAreaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
