import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FetchApiDataService } from './fetch-api-data.service';
import { prayerTimeAPI } from './prayer-times';

@Component({
  selector: 'app-status-info-card',
  templateUrl: './prayer-times/prayer-times.component.html',
  styleUrls: ['./prayer-times/prayer-times.component.scss']
})
export class StatusInfoCardComponent implements OnInit {
  public prayerTimeAPI: any;
  public lastUpdated: Date | null = null;
  public showSplashScreen: boolean = false;
  public userAccentColor: string = '#222222';
  public flagSettingsLoaded: boolean = false;

  constructor(
    public fetchAPIData: FetchApiDataService,
    private cdr: ChangeDetectorRef
  ) {
    this.prayerTimeAPI = {} as prayerTimeAPI;
  }

  ngOnInit() {
    // Zeige Splash-Screen nur beim ersten Besuch
    if (typeof window !== 'undefined' && window.localStorage && !localStorage.getItem('hasVisited')) {
      this.showSplashScreen = true;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      this.userAccentColor = localStorage.getItem('userAccentColor') || '#222222';
      this.flagSettingsLoaded = true;
      const today = new Date().toISOString().slice(0, 10);
      const cacheKey = `prayerTimes_${today}_${(this.fetchAPIData as any).method}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          this.prayerTimeAPI = data;
          this.lastUpdated = new Date();
        } catch {}
      } else {
        // Erstes Laden am Tag: Hole Daten und speichere sie
        this.fetchAPIData.callToAPI().subscribe({
          next: (response: prayerTimeAPI) => {
            this.prayerTimeAPI = response;
            this.lastUpdated = new Date();
            localStorage.setItem(cacheKey, JSON.stringify(response));
            this.cdr.markForCheck();
          },
          error: (error: any) => {
            console.error('Error fetching prayerTimes:', error);
          }
        });
      }
    }
  }
}