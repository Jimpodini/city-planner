import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // TODO change service name
  stayId!: string;
  authObject!: AuthObject;
  checkedInDates: string[] = [];

  constructor() {}

  setAuthObject(authObject: AuthObject) {
    this.authObject = authObject;
    this.checkedInDates = this.getDatesInRange(
      this.authObject.checkInDate,
      this.authObject.checkOutDate
    );
  }

  // TODO write tests and refactor
  // TODO fix so that homeAddress and homeCity can contain more than one space
  getGoogleUrl(date: string): string {
    let baseString = 'https://www.google.com/maps/dir/?api=1';
    let waypointsString = Array.from(
      Array(this.authObject.activitiesPerDate[date].activities.length).keys()
    ).join('%7C');
    console.log(waypointsString);

    let waypointPlaceIds: any[] = [];
    this.authObject.activitiesPerDate[date].activities.forEach((activity) => {
      waypointPlaceIds.push(activity.googlePlaceId);
    });

    let waypointPlaceIdsString = waypointPlaceIds.join('%7C');

    let fullUrl = `${baseString}&waypoints=${waypointsString}&waypoint_place_ids=${waypointPlaceIdsString}&destination=${this.authObject.homeAddress.replace(
      ' ',
      '+'
    )}+${this.authObject.homeCity.replace(' ', '+')}`;
    return fullUrl;
  }

  private getDatesInRange(startDate: string, endDate: string): string[] {
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);

    const date = new Date(d1.getTime());

    const dates = [];

    while (date <= d2) {
      const dateIso = new Date(date).toISOString().split('T')[0];
      dates.push(dateIso);
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }
}

export type AuthObject = {
  checkInDate: string;
  checkOutDate: string;
  doorCode: string;
  homeAddress: string;
  homeCity: string;
  activitiesPerDate: {
    [key: string]: { activities: any[]; googleDirectionLink: string };
  };
};
