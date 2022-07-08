import { Component, OnInit } from '@angular/core';

import {
  Firestore,
  collectionData,
  collection,
  setDoc,
  doc,
  getDoc,
  DocumentData,
} from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-feature-area',
  templateUrl: './feature-area.component.html',
  styleUrls: ['./feature-area.component.scss'],
})
export class FeatureAreaComponent implements OnInit {
  // item$: Observable<any[]>;

  constructor(
    public authService: AuthService,
    private firestore: Firestore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.getStay();
    // this.item$ = collectionData(test);
    // this.item$.subscribe((value) => console.log(value));
    // setDoc(doc(test, 'Hhgph1QjkxcwCIWNJiAu'), {
    //   activitiesPerDate: {
    //     '2022-05-10': [{ test: 1, hej: 2 }, 2, 3],
    //   },
    // });
  }

  getStay(): void {
    // TODO: implement loader
    const stayId = this.route.snapshot.params['stayId'];
    console.log(stayId);
    const db = collection(this.firestore, 'stays');
    const docRef = doc(db, stayId);
    const docSnap = getDoc(docRef);
    docSnap.then((doc) => {
      console.log(doc.data());
      if (!doc.data()) {
        this.router.navigate(['/404']);
      }
    });
  }

  ngOnInit() {
    console.log(this.authService.authObject);
  }
}
