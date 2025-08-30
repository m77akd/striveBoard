import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { prayerTimeAPI } from './prayer-times';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Status/Netzwerkdaten für Info-Box
  public lastUpdated: Date | null = null;
  public statusCode: string = '';
  public statusText: string = '';
  public timestamp: string = '';
  private httpClient = inject(HttpClient);
  // This service can now make HTTP requests via `this.http`.
  
  private apiKey = "Lts9oZywOGhBm5VTrFop9GPt3n6zz43GE69Plc4tzf4lJvfM";
  private latitude = "47,02372";
  private longitude = "7,45322";
  private method = "1"; // Default calculation method
  
  public calculationMethods = [
    { value: '1', viewValue: 'University of Islamic Sciences, Karachi' },
    { value: '2', viewValue: 'Islamic Society of North America' },
    { value: '3', viewValue: 'Muslim World League' },
    { value: '4', viewValue: 'Umm Al-Qura University, Makkah' },
    { value: '5', viewValue: 'Egyptian General Authority of Survey' },
    { value: '7', viewValue: 'Institute of Geophysics, Tehran' },
    { value: '8', viewValue: 'Gulf Region' },
    { value: '9', viewValue: 'Kuwait' },
    { value: '10', viewValue: 'Qatar' },
    { value: '11', viewValue: 'MUIS, Singapore' },
    { value: '12', viewValue: 'UOIF, France' },
    { value: '13', viewValue: 'Diyanet, Turkey' },
    { value: '14', viewValue: 'Russia' },
    { value: '15', viewValue: 'Moonsighting Committee Worldwide' },
    { value: '16', viewValue: 'Dubai (experimental)' },
    { value: '17', viewValue: 'JAKIM, Malaysia' },
    { value: '18', viewValue: 'Tunisia' },
    { value: '19', viewValue: 'Algeria' },
    { value: '20', viewValue: 'KEMENAG, Indonesia' },
    { value: '21', viewValue: 'Morocco' },
    { value: '22', viewValue: 'Lisbon, Portugal' },
    { value: '23', viewValue: 'Jordan' },
    { value: '0', viewValue: 'Jafari / Shia Ithna-Ashari' }
  ];  
  private school = "1";
  private prayerTimesURL = "";
  // public prayerTimeAPI: prayerTimeAPI    

  constructor(private http: HttpClient) { 
    this.updatePrayerTimesURL();   
  }
  public calculationMethodChanged$ = new BehaviorSubject<string>(this.method);


  setCalculationMethod(method: string) {
    this.method = method;
    this.updatePrayerTimesURL();
    this.calculationMethodChanged$.next(method);
  }

  private updatePrayerTimesURL() {
    this.prayerTimesURL = "https://islamicapi.com/api/v1/prayer-time/?lat=" + this.latitude + "&lon=" + this.longitude + "&method=" + this.method + "&school=" + this.school + "&api_key=";
  }

  callToAPI(): Observable<prayerTimeAPI> {
    console.log("callToAPI has been called")
    return new Observable<prayerTimeAPI>(observer => {
      this.http.get<prayerTimeAPI>(this.prayerTimesURL + this.apiKey, {responseType:'json'}).subscribe({
        next: (data) => {
          this.lastUpdated = new Date();
          this.statusCode = data?.code || '';
          this.statusText = data?.status || '';
          this.timestamp = data?.data?.date?.timestamp ? String(data.data.date.timestamp) : '';
          observer.next(data);
          observer.complete();
        },
        error: (err) => {
          this.statusCode = err.status ? String(err.status) : 'ERR';
          this.statusText = err.statusText || 'Fehler';
          observer.error(err);
        }
      });
    });
  }

}

