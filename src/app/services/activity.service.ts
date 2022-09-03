import { Injectable } from '@angular/core';
import {
  collection,
  Firestore,
  doc,
  addDoc,
  getDocs,
  query,
  deleteDoc,
  updateDoc,
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

  editActivity(locationId: string, activity: any) {
    return updateDoc(doc(this.getDb(locationId), activity.id), {
      name: activity.name,
      category: activity.category,
      googlePlaceId: activity.googlePlaceId,
      description: activity.description,
      image: activity.image,
      thumbnail: activity.thumbnail,
    });
  }

  deleteActivity(locationId: string, activityId: string) {
    return deleteDoc(doc(this.getDb(locationId), activityId));
  }

  private getDb(locationId: string) {
    return collection(this.firestore, `locations/${locationId}/activities`);
  }
}
