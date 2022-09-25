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
  guestName: string;
  activitiesPerDate: {
    [key: string]: { activities: any[]; googleDirectionLink: string };
  };
};
