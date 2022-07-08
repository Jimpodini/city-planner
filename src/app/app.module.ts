import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActivityComponent } from './components/activity/activity.component';
import { ModalComponent } from './components/modal/modal.component';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FeatureAreaComponent } from './core/feature-area/feature-area.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [AppComponent, ActivityComponent, ModalComponent, FeatureAreaComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyDZe8Ov89o0t-_MXhlszvF_GsbAhBEK-m0',
        authDomain: 'city-planner-d1807.firebaseapp.com',
        projectId: 'city-planner-d1807',
        storageBucket: 'city-planner-d1807.appspot.com',
        messagingSenderId: '550836693589',
        appId: '1:550836693589:web:b333228411da1ec48982dc',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
