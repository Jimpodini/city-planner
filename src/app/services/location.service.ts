import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  CollectionReference,
  deleteDoc,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { setDoc, doc } from '@firebase/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  db: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private auth: Auth) {
    this.db = collection(this.firestore, 'locations');
  }

  getLocation(locationId: string) {
    const docRef = doc(this.db, locationId);
    return getDoc(docRef);
  }

  getLocations(): Observable<Location[]> {
    return from(
      getDocs(query(this.db, where('userId', '==', this.auth.currentUser?.uid)))
    ).pipe(
      map(
        (querySnapshot) =>
          querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          }) as Location[]
      )
    );
  }

  createLocation(location: Location): Promise<void> {
    return setDoc(doc(this.db), {
      ...location,
      userId: this.auth.currentUser?.uid,
    });
  }

  editLocation(location: Location) {
    return updateDoc(doc(this.db, location.id), {
      address: location.address,
      city: location.city,
    });
  }

  deleteActivity(locationId: string) {
    return deleteDoc(doc(this.db, locationId));
  }
}

export type Location = {
  id?: string;
  address: string;
  city: string;
};
