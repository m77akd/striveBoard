import { Component, OnInit} from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { prayerTimeAPI, prayerTimes } from '../prayer-times';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card';
import { FormsModule} from '@angular/forms';
import { CurrentTimeComponent } from '../current-time/current-time.component'
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule, CommonModule, MatCardModule, FormsModule, CurrentTimeComponent, NgFor],
  templateUrl: './prayer-times.component.html',
  styleUrl: './prayer-times.component.scss'
})
export class PrayerTimesComponent {
  public prayerTimeAPI: prayerTimeAPI
  public prayerTimes: prayerTimes

  checked = false;
  disabled = false;

  listOfPrayerTimes = [
    { label: 'Fajr', key: 'Fajr' },
    { label: 'Sunrise', key: 'Sunrise' },
    { label: 'Dhuhr', key: 'Dhuhr' },
    { label: 'Asr', key: 'Asr' },
    { label: 'Sunset', key: 'Sunset' },
    { label: 'Maghrib', key: 'Maghrib' },
    { label: 'Isha', key: 'Isha' },
    { label: 'Imsak', key: 'Imsak' },
    { label: 'Midnight', key: 'Midnight' },
  ];

  constructor(private fetchApiDataService: FetchApiDataService) {
    this.prayerTimeAPI = {}
    this.prayerTimes = this.fetchApiDataService.callToTestAPI();
  }
  ngOnInit() {
    this.fetchApiDataService.callToAPI().subscribe(response => {
      this.prayerTimeAPI.code = response.code;
      this.prayerTimeAPI.status = response.status;
      this.prayerTimeAPI.data = response.data;
      console.log('method: callToAPI' + this.prayerTimeAPI.data);
      return this.prayerTimeAPI.data;
    });
  };
}

