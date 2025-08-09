import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { prayerTimeAPI, prayerTimes } from './prayer-times';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  private httpClient = inject(HttpClient);
  // This service can now make HTTP requests via `this.http`.
  
  private apiKey = "Lts9oZywOGhBm5VTrFop9GPt3n6zz43GE69Plc4tzf4lJvfM";
  private latitude = "47,02372";
  private longitude = "7,45322";
  private method = "13";
  private school = "1";
  private prayerTimesURL = "https://islamicapi.com/api/v1/prayer-time/?lat=" + this.latitude + "&lon=" + this.longitude + "&method=" + this.method + "&school=" + this.school + "&api_key="
  // public prayerTimeAPI: prayerTimeAPI    

  constructor() {    
  }

  callToAPI(): Observable<prayerTimeAPI> {
    console.log("callToAPI has been called")
    return this.httpClient.request('GET', this.prayerTimesURL + this.apiKey, {responseType:'json'});
  }

}

