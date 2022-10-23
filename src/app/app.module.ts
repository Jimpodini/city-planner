import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActivityComponent } from './components/activity/activity.component';
import { ModalComponent } from './components/modal/modal.component';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FeatureAreaComponent } from './core/feature-area/feature-area.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ActivityButtonComponent } from './components/activity/activity-button/activity-button.component';
import { CategoryIconComponent } from './components/activity/category-icon/category-icon.component';
import { environment } from 'src/environments/environment';

import { provideAuth, getAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { SharedModule } from './shared/shared.module';
import { SnackbarContentComponent } from './services/snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StartPageComponent } from './pages/admin-page/start-page/start-page/start-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ActivityComponent,
    ModalComponent,
    FeatureAreaComponent,
    PageNotFoundComponent,
    ActivityButtonComponent,
    CategoryIconComponent,
    SnackbarContentComponent,
    StartPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatSnackBarModule,
    DragDropModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatMenuModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    SharedModule,
    MatProgressSpinnerModule,
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase }],
  bootstrap: [AppComponent],
})
export class AppModule {}
