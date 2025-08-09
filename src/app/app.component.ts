import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FetchApiDataService } from './fetch-api-data.service';
import { PrayerTimesComponent } from './prayer-times/prayer-times.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    PrayerTimesComponent, 
    MatSlideToggleModule, 
    MatToolbarModule, 
    MatExpansionModule
  ], // PrayerTimesComponent
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AppComponent {
  readonly panelOpenState = signal(false);

  isSubscribedToEmailsMessage = "gurke";
  title = 'striveBoard';
  constructor(private fetchAPIData: FetchApiDataService) {
    console.log('about to start ')
    this.fetchAPIData.callToAPI();
  }
}
