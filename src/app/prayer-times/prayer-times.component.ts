import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service'
import { prayerTimeAPI } from '../prayer-times';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card';
import { FormsModule} from '@angular/forms';
import { CurrentTimeComponent } from '../current-time/current-time.component'
import { NgFor } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [MatSlideToggleModule, CommonModule, MatCardModule, FormsModule, CurrentTimeComponent, NgFor, MatExpansionModule, MatSnackBarModule],
  templateUrl: './prayer-times.component.html',
  styleUrl: './prayer-times.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PrayerTimesComponent {
  readonly panelOpenState = signal(false);
  public prayerTimeAPI: prayerTimeAPI;
  public lastUpdated: Date | null = null;

  checked = false;
  disabled = false;

  constructor(
    private fetchAPIData: FetchApiDataService, 
    private snackBar: MatSnackBar, 
    private cdr: ChangeDetectorRef
) {
    this.prayerTimeAPI = {};
  }


  ngOnInit() {
    this.fetchAPIData.calculationMethodChanged$.subscribe(() => {
      this.fetchAPIData.callToAPI().subscribe({
        next: (response) => {
          this.prayerTimeAPI = response;
          this.lastUpdated = new Date();
          this.snackBar.open('Gebetszeiten aktualisiert', 'OK', { duration: 2500, verticalPosition: 'top', horizontalPosition: 'center' });
          this.cdr.markForCheck(); // <- wichtig!

          console.log('Prayer times fetched successfully:', this.prayerTimeAPI);
        },
        error: (error) => {
          console.error('Error fetching prayerTimes:', error);
        }
      });
    });
  }
}

