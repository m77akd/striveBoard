import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-calendar-timeline',
  standalone: true,
  imports: [CommonModule, MatCardModule, FormsModule],
  templateUrl: './calendar-timeline.component.html',
  styleUrls: ['./calendar-timeline.component.scss']
})
export class CalendarTimelineComponent {
  hoursLeft = Array.from({ length: 12 }, (_, i) => i); // 0-11
  hoursRight = Array.from({ length: 12 }, (_, i) => i + 12); // 12-23
  prayerTimes: { [key: number]: string } = {
    5: 'Fajr',
    12: 'Dhuhr',
    15: 'Asr',
    18: 'Maghrib',
    20: 'Isha',
  };

  taskInput = '';
  tasks: string[] = [];

  addTask() {
    if (this.taskInput.trim()) {
      this.tasks.push(this.taskInput.trim());
      this.taskInput = '';
    }
  }

  getPrayerClass(prayer: string): string {
    switch (prayer) {
      case 'Fajr': return 'prayer-fajr';
      case 'Dhuhr': return 'prayer-dhuhr';
      case 'Asr': return 'prayer-asr';
      case 'Maghrib': return 'prayer-maghrib';
      case 'Isha': return 'prayer-isha';
      default: return '';
    }
  }
}
