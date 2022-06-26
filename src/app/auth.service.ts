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

  constructor() {}

  getDatesInRange(startDate: string, endDate: string) {
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);

    const date = new Date(d1.getTime());

    const dates = [];

    while (date <= d2) {
      dates.push(new Date(date).toISOString().split('T')[0]);
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }
}
