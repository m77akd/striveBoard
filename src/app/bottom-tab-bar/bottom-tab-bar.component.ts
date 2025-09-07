import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CalendarTimelineComponent } from '../calendar-timeline/calendar-timeline.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { PrayerTimesComponent } from '../prayer-times/prayer-times.component';


@Component({
  selector: 'app-bottom-tab-bar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule, CalendarTimelineComponent, UserSettingsComponent, PrayerTimesComponent],
  templateUrl: './bottom-tab-bar.component.html',
  styleUrl: './bottom-tab-bar.component.scss',
})
export class BottomTabBarComponent implements OnInit {
  @Input() initialIndex: number = 1;
  selectedIndex = 1;
  @Output() tabChange = new EventEmitter<number>();

  ngOnInit(): void {
    // Lade zuletzt aktiven Tab aus localStorage (nur im Browser)
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTab = localStorage.getItem('activeTabIndex');
      if (savedTab !== null) {
        this.selectedIndex = +savedTab;
      } else {
        this.selectedIndex = this.initialIndex;
      }
    } else {
      this.selectedIndex = this.initialIndex;
    }
    this.tabChange.emit(this.selectedIndex);
  }

  selectTab(index: number): void {
    this.selectedIndex = index;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('activeTabIndex', String(index));
    }
    this.tabChange.emit(index);
  }
}
