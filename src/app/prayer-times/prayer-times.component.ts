import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { prayerTimeAPI, prayerTimes } from '../prayer-times';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card';
import { FormsModule} from '@angular/forms';
import { CurrentTimeComponent } from '../current-time/current-time.component'
import { NgFor } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [MatSlideToggleModule, CommonModule, MatCardModule, FormsModule, CurrentTimeComponent, NgFor, MatExpansionModule],
  templateUrl: './prayer-times.component.html',
  styleUrl: './prayer-times.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ provideNavMetrics({ onRecord: (m) => console.log(m) }) ]
})
export class PrayerTimesComponent {
  readonly panelOpenState = signal(false);

  public prayerTimeAPI: prayerTimeAPI

  checked = false;
  disabled = false;

  constructor(private fetchApiDataService: FetchApiDataService) {
    this.prayerTimeAPI = {}
    this.fetchApiDataService.callToAPI().subscribe({ 
      next: (response) => {
        this.prayerTimeAPI = response;
        // this.prayerTimeAPI.code = response.code;
        // this.prayerTimeAPI.status = response.status;
        // this.prayerTimeAPI.data = response.data;
      }, 
      error: (error) => {
        console.error('Error fetching prayerTimes:', error);
      }
    });  
  }
}

