import { Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
  doc,
  getDoc,
  DocumentSnapshot,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { from, map } from 'rxjs';
import { AuthService } from '../auth.service';
import { Activity, ActivityService } from './activity.service';

export type Stay = {
  checkInDate: string;
  checkOutDate: string;
  guestName: string;
  locationId: string;
  activitiesPerDate: {
    [key: string]: { activities: Activity[]; googleDirectionLink: string };
  };
};

@Injectable({
  providedIn: 'root',
})
export class StayService {
  db: CollectionReference<DocumentData>;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private activityService: ActivityService
  ) {
    this.db = collection(this.firestore, 'stays');
  }

  getStay(): Promise<DocumentSnapshot<DocumentData>> {
    const docRef = doc(this.db, this.authService.stayId);
    return getDoc(docRef);
  }

  saveStay(): Promise<void> {
    return updateDoc(doc(this.db, this.authService.stayId), {
      activitiesPerDate: this.authService.authObject.activitiesPerDate,
    });
  }

  createStay(locationId: string, stay: any) {
    return addDoc(this.db, {
      ...stay,
      locationId,
      activitiesPerDate: this.getDatesInRange(
        stay.checkInDate,
        stay.checkOutDate
      ),
    });
  }

  // TODO: remove all any's
  getStays(locationId: string) {
    return from(
      getDocs(query(this.db, where('locationId', '==', locationId)))
    ).pipe(
      map(
        (querySnapshot) =>
          querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          }) as any[]
      )
    );
  }

  editStay(stay: any) {
    return updateDoc(doc(this.db, stay.id), {
      guestName: stay.guestName,
    });
  }

  deleteStay(stayId: string) {
    return deleteDoc(doc(this.db, stayId));
  }

  updateGoogleDirectionLink(date: string) {
    this.authService.authObject.activitiesPerDate[date].googleDirectionLink =
      this.activityService.getGoogleUrl(
        this.authService.authObject.activitiesPerDate[date].activities,
        this.authService.authObject.homeCity,
        this.authService.authObject.homeAddress
      );
  }

  // TODO: choose better name
  private getDatesInRange(startDate: string, endDate: string): any {
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);

    const date = new Date(d1.getTime());

    const activitiesPerDate: any = {};

    while (date <= d2) {
      const dateIso = new Date(date).toISOString().split('T')[0];
      activitiesPerDate[dateIso] = {
        activities: [],
        googleDirectionLink: '',
      };
      date.setDate(date.getDate() + 1);
    }

    return activitiesPerDate;
  }
}
