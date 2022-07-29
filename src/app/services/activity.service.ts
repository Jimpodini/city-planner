import { Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
  doc,
  setDoc,
  addDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private firestore: Firestore) {}

  createActivity(locationId: string) {
    return addDoc(
      collection(this.firestore, `locations/${locationId}/activities`),
      {
        test: 'hej',
      }
    );
  }
}
