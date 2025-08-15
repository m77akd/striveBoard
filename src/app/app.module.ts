import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrayerTimesComponent } from './prayer-times/prayer-times.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideNavMetrics } from 'nav-metrics';


// import { MatMenu } from '@angular/material/menu'
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrayerTimesComponent,
    BrowserAnimationsModule
    // MatMenu
  ],
  providers: [provideNavMetrics({ onRecord: msg => console.log(msg) })]

})
export class AppModule { }
