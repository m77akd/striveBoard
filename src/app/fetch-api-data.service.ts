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
  private latitude = "41,00781";
  private longitude = "28,96776";
  private method = "13";
  private school = "1";
  private prayerTimesURL = "https://islamicapi.com/api/v1/prayer-time/?lat=" + this.latitude + "&lon=" + this.longitude + "&method=" + this.method + "&school=" + this.school + "&api_key="
  // public prayerTimeAPI: prayerTimeAPI
  public prayerTimes: prayerTimes
    

  constructor() {
    log('fetch-api-data.service.ts has been called')
    console.log(this.prayerTimes = {
      
        times: {
          Fajr: '05:32',
          Sunrise: '7:01',
          Dhuhr: 'string',
          Asr: 'string',
          Sunset: 'string',
          Maghrib: 'string',
          Isha: 'string',
          Imsak: 'string',
          Midnight: 'string',
          Firstthird: 'string',
          Lastthird: 'string'
          },
        
        date: {
          readable: new Date(),
          timestamp: 9,
          hijri: {
            date: new Date(),
            format: 'string',
            day: 2,
            weekday: {
                en: 'string',
                ar: 'jummuah'
            },

            month: {
                number: 3,
                en: 'Remeden',
                ar: 'Ramadan',
                days: 4
            },

            year: 1447,
            designation: {
                abbreviated: 'string',
                expanded: 'string'
            },

            holidays: [],
            adjustedHolidays: [],
            method: 'string'
            },
          gregorian: {
            date: new Date(),
            format: 'string',
            day: 0,
            weekday: {
                en: 'string'
            },

            month: {
                number: 9,
                en: 'string'
            },

            year: 4,
            designation: {
                abbreviated: 'string',
                expanded: 'string'
            }
          }
      },
  
      qibla: {
          direction: {
            degrees: 9,
            from: 'switzeria',
            clockwise: true
          },
          distance: {
            value: 8,
            unit: 'kids silent now!'
          }
        },
        prohibited_times: {
          sunrise: {
            start: new Date(),
            end: new Date()
          },

          noon: {
              start: new Date(),
              end: new Date(),
          },

          sunset: {
              start: new Date(),
              end: new Date() 
          }
        }
      }
    )
  }

  callToAPI(): Observable<prayerTimeAPI> {
    console.log("callToAPI has been called")
    return this.httpClient.request('GET', this.prayerTimesURL + this.apiKey, {responseType:'json'});
    // return this.httpClient.get<prayerTimeAPI>(this.prayerTimesURL + this.apiKey)
  }

  callToTestAPI(): prayerTimes {
        return this.prayerTimes;
  }
}

