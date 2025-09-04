// ...existing code...
import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
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
  getTaskDisplayText(task: any): string {
    return task.name ? task.name : (task.text ? task.text : '');
  }
  // Drag & Drop Properties
  showMoveOverlay = false;
  moveFromHour: number | null = null;
  moveToHour: number | null = null;
  moveTaskIndex: number | null = null;

  onTaskDragStart(task: any, hour: number, index: number) {
    this.moveFromHour = hour;
    this.moveTaskIndex = index;
  }

  onHourDrop(hour: number) {
    if (this.moveFromHour !== null && this.moveTaskIndex !== null && this.moveFromHour !== hour) {
      this.moveToHour = hour;
      this.showMoveOverlay = true;
    }
  }

  confirmMoveTask() {
    if (
      this.moveFromHour !== null &&
      this.moveToHour !== null &&
      this.moveTaskIndex !== null &&
      this.tasksByHour[this.moveFromHour]
    ) {
      const task = this.tasksByHour[this.moveFromHour][this.moveTaskIndex];
      this.tasksByHour[this.moveFromHour].splice(this.moveTaskIndex, 1);
      if (!this.tasksByHour[this.moveToHour]) {
        this.tasksByHour[this.moveToHour] = [];
      }
      this.tasksByHour[this.moveToHour].push(task);
    }
    this.cancelMoveTask();
  }

  cancelMoveTask() {
    this.showMoveOverlay = false;
    this.moveFromHour = null;
    this.moveToHour = null;
    this.moveTaskIndex = null;
  }
  showTaskOverlay = false;
  selectedHour: number | null = null;
  newTaskName: string = '';
  tasksByHour: { [hour: string]: Array<{ name: string }> } = {};

  openTaskOverlay(hour: number) {
    this.selectedHour = hour;
    this.showTaskOverlay = true;
    this.newTaskName = '';
  }

  closeTaskOverlay() {
    this.showTaskOverlay = false;
    this.selectedHour = null;
    this.newTaskName = '';
  }

  saveTask() {
    if (this.selectedHour !== null && this.newTaskName.trim()) {
      if (!this.tasksByHour[this.selectedHour]) {
        this.tasksByHour[this.selectedHour] = [];
      }
      this.tasksByHour[this.selectedHour].push({ name: this.newTaskName });
      this.newTaskName = '';
      this.closeTaskOverlay();
    }
  }

  hoursLeft = Array.from({ length: 12 }, (_, i) => i); // 0-11
  hoursRight = Array.from({ length: 12 }, (_, i) => i + 12); // 12-23
  prayerTimes: { [key: number]: string } = {};
  isRefreshing = false;

  taskInput = '';
  tasks: { text: string; color: string; duration: number; hour: number }[] = [];

  get userTaskColor(): string {
    return localStorage.getItem('userTaskColor') || '#2196f3';
  }
  get defaultTaskDuration(): number {
    return +(localStorage.getItem('defaultTaskDuration') || '60');
  }


  constructor(private fetchAPIData: FetchApiDataService) {}

  ngOnInit() {
    // Hole Gebetszeiten aus Cache (wie Tab 1)
    if (typeof window !== 'undefined' && window.localStorage) {
      const today = new Date().toISOString().slice(0, 10);
      const cacheKey = `prayerTimes_${today}_${(this.fetchAPIData as any).method}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          const mapping: { [key: string]: string } = {
            Fajr: 'Fajr',
            Dhuhr: 'Dhuhr',
            Asr: 'Asr',
            Maghrib: 'Maghrib',
            Isha: 'Isha',
          };
          const times = data?.data?.times as { [key: string]: string };
          const result: { [key: number]: string } = {};
          if (times) {
            Object.keys(mapping).forEach(key => {
              const timeStr = times[key];
              if (timeStr) {
                const hour = parseInt(timeStr.split(':')[0], 10);
                if (!isNaN(hour)) {
                  result[hour] = mapping[key];
                }
              }
            });
          }
          this.prayerTimes = result;
        } catch {}
      }
    }
  }

  addTask() {
    if (this.taskInput.trim()) {
      // Für Demo: Task immer zur aktuellen Stunde (kann angepasst werden)
      const now = new Date();
      const hour = now.getHours();
      this.tasks.push({
        text: this.taskInput.trim(),
        color: this.userTaskColor,
        duration: this.defaultTaskDuration,
        hour
      });
      this.taskInput = '';
    }
  }

  refreshPrayerTimes() {
    this.isRefreshing = true;
    this.fetchAPIData.callToAPI().subscribe({
      next: (data) => {
        // Mapping: API-Zeiten auf Stunden
        const mapping: { [key: string]: string } = {
          Fajr: 'Fajr',
          Dhuhr: 'Dhuhr',
          Asr: 'Asr',
          Maghrib: 'Maghrib',
          Isha: 'Isha',
        };
        const times = data?.data?.times as { [key: string]: string };
        const result: { [key: number]: string } = {};
        if (times) {
          Object.keys(mapping).forEach(key => {
            const timeStr = times[key];
            if (timeStr) {
              const hour = parseInt(timeStr.split(':')[0], 10);
              if (!isNaN(hour)) {
                result[hour] = mapping[key];
              }
            }
          });
        }
        this.prayerTimes = result;
        this.isRefreshing = false;
      },
      error: () => {
        this.isRefreshing = false;
      }
    });
  }


  getTasksForHour(hour: number) {
    return this.tasks.filter(t => t.hour === hour);
  }

  // isRefreshing und refreshPrayerTimes nur einmal vorhanden, siehe oben

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
