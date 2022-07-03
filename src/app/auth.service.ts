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
  activitiesPerDate: { [key: string]: any[] } = {};
  checkedInDates: string[] = [];

  constructor() {
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
      this.activitiesPerDate[dateIso] = [];
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }
}
