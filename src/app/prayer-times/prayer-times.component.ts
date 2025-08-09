import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { prayerTimeAPI, prayerTimes } from '../prayer-times';
import { RouterOutlet } from '@angular/router';
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
  imports: [RouterOutlet, MatSlideToggleModule, CommonModule, MatCardModule, FormsModule, CurrentTimeComponent, NgFor, MatExpansionModule],
  templateUrl: './prayer-times.component.html',
  styleUrl: './prayer-times.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class PrayerTimesComponent {
  readonly panelOpenState = signal(false);

  public prayerTimeAPI: prayerTimeAPI

  checked = false;
  disabled = false;

  constructor(private fetchApiDataService: FetchApiDataService) {
    this.prayerTimeAPI = {}
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

