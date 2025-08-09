import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrayerTimesComponent } from './prayer-times/prayer-times.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

// import { MatMenu } from '@angular/material/menu'
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrayerTimesComponent,
    BrowserAnimationsModule
    // MatMenu
  ]
})
export class AppModule { }
