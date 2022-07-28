import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
} from '@angular/fire/firestore';
import { setDoc, doc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  db: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private auth: Auth) {
    this.db = collection(this.firestore, 'locations');
  }

  createLocation(location: Location) {
    return setDoc(doc(this.db), {
      ...location,
      userId: this.auth.currentUser?.uid,
    });
  }
}

export type Location = {
  address: string;
  city: string;
};
