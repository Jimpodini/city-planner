import { Component, OnInit } from '@angular/core';

import { Firestore, collection, doc, getDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthObject, AuthService } from 'src/app/auth.service';
import { ModalService } from 'src/app/components/modal/modal.service';

@Component({
  selector: 'app-feature-area',
  templateUrl: './feature-area.component.html',
  styleUrls: ['./feature-area.component.scss'],
})
export class FeatureAreaComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public modalService: ModalService,
    private firestore: Firestore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.getStay();
  }

  getStay(): void {
    // TODO: implement loader
    this.authService.stayId = this.route.snapshot.params['stayId'];

    // TODO refactor db logic
    const db = collection(this.firestore, 'stays');
    const docRef = doc(db, this.authService.stayId);
    const docSnap = getDoc(docRef);
    docSnap.then((doc) => {
      console.log(doc.data());
      if (!doc.data()) {
        this.router.navigate(['/404']);
      } else {
        this.authService.setAuthObject(<AuthObject>doc.data());
      }
    });
  }

  ngOnInit() {
    console.log(this.authService.authObject);
  }
}
