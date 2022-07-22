import { Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
  setDoc,
  doc,
  getDoc,
  DocumentSnapshot,
} from '@angular/fire/firestore';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class StayService {
  db: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private authService: AuthService) {
    this.db = collection(this.firestore, 'stays');
  }

  getStay(): Promise<DocumentSnapshot<DocumentData>> {
    const docRef = doc(this.db, this.authService.stayId);
    return getDoc(docRef);
  }

  saveStay(): Promise<void> {
    return setDoc(
      doc(this.db, this.authService.stayId),
      this.authService.authObject
    );
  }
}
