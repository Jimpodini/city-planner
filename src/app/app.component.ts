import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import {
  Firestore,
  collectionData,
  collection,
  setDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
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
