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
import { from, map, Subject, tap } from 'rxjs';
import { AuthObject } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  reloadActivitiesData = new Subject<void>();
  activities: any[] = [];

  constructor(private firestore: Firestore) {}

  getActivities(locationId: string) {
    return from(getDocs(query(this.getDb(locationId, 'activities')))).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      ),
      tap((activities) => (this.activities = activities))
    );
  }

  createActivity(locationId: string, activity: any) {
    return addDoc(this.getDb(locationId, 'activities'), {
      ...activity,
      locationId,
    });
  }

  editActivity(locationId: string, activity: any) {
    return updateDoc(doc(this.getDb(locationId, 'activities'), activity.id), {
      name: activity.name,
      category: activity.category,
      googlePlaceId: activity.googlePlaceId,
      description: activity.description,
      image: activity.image,
      thumbnail: activity.thumbnail,
    });
  }

  deleteActivity(locationId: string, activityId: string) {
    return deleteDoc(doc(this.getDb(locationId, 'activities'), activityId));
  }

  getSetOfActivities(locationId: string) {
    return from(getDocs(query(this.getDb(locationId, 'setOfActivities')))).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      )
    );
  }

  createSetOfActivities(locationId: string, setOfActivities: any) {
    return addDoc(this.getDb(locationId, 'setOfActivities'), {
      ...setOfActivities,
      locationId,
    });
  }

  editSetOfActivities(locationId: string, setOfActivities: any) {
    return updateDoc(
      doc(this.getDb(locationId, 'setOfActivities'), setOfActivities.id),
      {
        name: setOfActivities.name,
        description: setOfActivities.description,
        activities: setOfActivities.activities,
      }
    );
  }

  deleteSetOfActivities(locationId: string, setOfActivitiesId: string) {
    return deleteDoc(
      doc(this.getDb(locationId, 'setOfActivities'), setOfActivitiesId)
    );
  }

  // TODO write tests and refactor
  // TODO fix so that homeAddress and homeCity can contain more than one space
  getGoogleUrl(date: string, authObject: AuthObject): string {
    let baseString = 'https://www.google.com/maps/dir/?api=1';
    let waypointsString = Array.from(
      Array(authObject.activitiesPerDate[date].activities.length).keys()
    ).join('%7C');
    console.log(waypointsString);

    let waypointPlaceIds: any[] = [];
    authObject.activitiesPerDate[date].activities.forEach((activity) => {
      waypointPlaceIds.push(activity.googlePlaceId);
    });

    let waypointPlaceIdsString = waypointPlaceIds.join('%7C');

    let fullUrl = `${baseString}&waypoints=${waypointsString}&waypoint_place_ids=${waypointPlaceIdsString}&destination=${authObject.homeAddress.replace(
      ' ',
      '+'
    )}+${authObject.homeCity.replace(' ', '+')}`;
    return fullUrl;
  }

  private getDb(locationId: string, category: string) {
    return collection(this.firestore, `locations/${locationId}/${category}`);
  }
}
