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
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchString}&key=AIzaSyCi1hHMvXk6BWG_JyJOyL6RAIs7BuuVgF8`
      )
      .pipe(map((result: any) => result.predictions));
  }
}
