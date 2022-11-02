import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleService {
  constructor(private http: HttpClient) {}

  getGooglePlaces(searchString: string): Observable<any[]> {
    if (!searchString) return of([]);

    return this.http
      .get<any[]>(
        `https://us-central1-city-planner-d1807.cloudfunctions.net/googlePlaces?search=${searchString}`
      )
      .pipe(map((result: any) => result.predictions));
  }
}
