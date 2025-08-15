import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FetchApiDataService } from './fetch-api-data.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavMetricsService, provideNavMetrics } from 'nav-metrics';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    MatSlideToggleModule, 
    MatToolbarModule, 
  ], // PrayerTimesComponent
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {

  isSubscribedToEmailsMessage = "gurke";
  title = 'striveBoard';
  constructor(private fetchAPIData: FetchApiDataService, private navMetrics: NavMetricsService) {
    this.navMetrics.recordOnce();
    console.log('about to start ')
    this.fetchAPIData.callToAPI();
  }
}
