 

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service'
import { prayerTimeAPI, prayerTimes } from '../prayer-times';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card';
import { FormsModule} from '@angular/forms';
import { NgFor } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ChangeDetectorRef } from '@angular/core';

// ...existing code...

@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [MatSlideToggleModule, CommonModule, MatCardModule, FormsModule, NgFor, MatExpansionModule, MatSnackBarModule],
  templateUrl: './prayer-times.component.html',
  styleUrl: './prayer-times.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PrayerTimesComponent {
  // Hilfsfunktion: generiert eine dunklere Farbe für Border/Shadow
  getDarkerColor(hex: string, percent: number = 0.7): string {
    if (!hex.startsWith('#') || (hex.length !== 7 && hex.length !== 4)) return '#bbb';
    let r = 0, g = 0, b = 0;
    if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    } else if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
    r = Math.floor(r * percent);
    g = Math.floor(g * percent);
    b = Math.floor(b * percent);
    return `rgb(${r},${g},${b})`;
  }

  getPrayerRowBorder(row: number): string {
    return `2px solid ${this.getDarkerColor(this.getPrayerRowColor(row), 0.7)}`;
  }
  getPrayerRowShadow(row: number): string {
    return `0 1px 8px 0 ${this.getDarkerColor(this.getPrayerRowColor(row), 0.35)}`;
  }
  getPrayerRowColor(row: number): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(`prayerRowColor${row}`) || (
        row === 1 ? '#222' : row === 2 ? '#fff' : '#138808'
      );
    }
    return row === 1 ? '#222' : row === 2 ? '#fff' : '#138808';
  }
  // ...existing code...

  getUpcomingPrayer(): string | null {
    if (!this.prayerTimeAPI?.data?.times) return null;
    const now = new Date();
    const prayersOrder = ['Fajr','Dhuhr','Asr','Maghrib','Isha'];
    for (const prayer of prayersOrder) {
      const timeStr = this.prayerTimeAPI.data.times[prayer as keyof prayerTimes['times']];
      if (!timeStr) continue;
      const [hour, minute] = timeStr.split(':').map(Number);
      const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
      if (prayerDate > now) {
        return prayer;
      }
    }
    return null;
  }

  readonly panelOpenState = signal(false);
  public prayerTimeAPI: prayerTimeAPI;
  public lastUpdated: Date | null = null;

  checked = false;
  disabled = false;

  userAccentColor: string = '#222222';


  prayers: Array<keyof prayerTimes['times']> = ['Fajr','Dhuhr','Asr','Maghrib','Isha'];
  specials: Array<keyof prayerTimes['times']> = ['Imsak','Sunrise','Sunset','Midnight','Firstthird','Lastthird'];

  getTime(key: string): string | undefined {
    return this.prayerTimeAPI?.data?.times?.[key as keyof prayerTimes['times']];
  }

  constructor(
    public fetchAPIData: FetchApiDataService, 
    private snackBar: MatSnackBar, 
    private cdr: ChangeDetectorRef
  ) {
    this.prayerTimeAPI = {};
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.userAccentColor = localStorage.getItem('userAccentColor') || '#222222';
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
          next: (response) => {
            this.prayerTimeAPI = response;
            this.lastUpdated = new Date();
            localStorage.setItem(cacheKey, JSON.stringify(response));
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error('Error fetching prayerTimes:', error);
          }
        });
      }
    }
  }

  refreshPrayerTimes() {
    const today = new Date().toISOString().slice(0, 10);
  const cacheKey = `prayerTimes_${today}_${(this.fetchAPIData as any).method}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        this.prayerTimeAPI = data;
        this.lastUpdated = new Date();
        this.snackBar.open('Gebetszeiten aus Cache geladen', 'OK', { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center' });
        this.cdr.markForCheck();
        return;
      } catch {}
    }
    this.fetchAPIData.callToAPI().subscribe({
      next: (response) => {
        this.prayerTimeAPI = response;
        this.lastUpdated = new Date();
        localStorage.setItem(cacheKey, JSON.stringify(response));
        this.snackBar.open('Gebetszeiten aktualisiert', 'OK', { duration: 2500, verticalPosition: 'top', horizontalPosition: 'center' });
        this.cdr.markForCheck();
        console.log('Prayer times fetched successfully:', this.prayerTimeAPI);
      },
      error: (error) => {
        console.error('Error fetching prayerTimes:', error);
      }
    });
  }

}

