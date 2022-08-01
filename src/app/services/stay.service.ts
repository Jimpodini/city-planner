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
  addDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { from, map } from 'rxjs';
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

  createStay(locationId: string, stay: any) {
    return addDoc(this.db, { ...stay, locationId });
  }

  // TODO: remove all any's
  getStays(locationId: string) {
    return from(
      getDocs(query(this.db, where('locationId', '==', locationId)))
    ).pipe(
      map(
        (querySnapshot) => querySnapshot.docs.map((doc) => doc.data()) as any[]
      )
    );
  }
}
