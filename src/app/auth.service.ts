import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authObject = {
    checkInDate: '2022-06-01',
    checkOutDate: '2022-06-05',
    doorCode: 1234,
  };
  activitiesPerDate: {
    [key: string]: { activities: any[]; googleDirectionLink: string };
  } = {};
  checkedInDates: string[] = [];

  constructor() {
    this.checkedInDates = this.getDatesInRange(
      this.authObject.checkInDate,
      this.authObject.checkOutDate
    );
  }

  // TODO write tests and refactor
  getGoogleUrl(date: string): string {
    let baseString = 'https://www.google.com/maps/dir/?api=1';
    let waypointsString = Array.from(
      Array(this.activitiesPerDate[date].activities.length).keys()
    ).join('%7C');
    console.log(waypointsString);

    let waypointPlaceIds: any[] = [];
    this.activitiesPerDate[date].activities.forEach((activity) => {
      waypointPlaceIds.push(activity.googlePlaceId);
    });

    let waypointPlaceIdsString = waypointPlaceIds.join('%7C');

    let fullUrl = `${baseString}&waypoints=${waypointsString}&waypoint_place_ids=${waypointPlaceIdsString}&destination=medevigatan+14+stockholm`;
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
      this.activitiesPerDate[dateIso] = {
        activities: [],
        googleDirectionLink: '',
      };
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }
}
