import { Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
  doc,
  setDoc,
  addDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  activities: any[] = [];

  constructor(private firestore: Firestore) {}

  getActivities(locationId: string) {
    return from(getDocs(query(this.getDb(locationId)))).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      )
    );
  }

  createActivity(locationId: string, activity: any) {
    return addDoc(this.getDb(locationId), { ...activity, locationId });
  }

  private getDb(locationId: string) {
    return collection(this.firestore, `locations/${locationId}/activities`);
  }
}
