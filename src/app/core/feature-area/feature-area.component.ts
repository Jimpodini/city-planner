import { Component, OnInit } from '@angular/core';

import {
  Firestore,
  collectionData,
  collection,
  setDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-feature-area',
  templateUrl: './feature-area.component.html',
  styleUrls: ['./feature-area.component.scss'],
})
export class FeatureAreaComponent implements OnInit {
  // item$: Observable<any[]>;

  constructor(public authService: AuthService, firestore: Firestore) {
    // const test = collection(firestore, 'stays');
    // this.item$ = collectionData(test);
    // this.item$.subscribe((value) => console.log(value));
    // setDoc(doc(test, 'Hhgph1QjkxcwCIWNJiAu'), {
    //   activitiesPerDate: {
    //     '2022-05-10': [{ test: 1, hej: 2 }, 2, 3],
    //   },
    // });
    // setDoc()
  }

  ngOnInit() {
    console.log(this.authService.authObject);
  }
}
