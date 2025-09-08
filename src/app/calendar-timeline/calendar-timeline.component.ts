import { Component, ViewChild, ElementRef } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-calendar-timeline',
  standalone: true,
  imports: [CommonModule, MatCardModule, FormsModule],
  templateUrl: './calendar-timeline.component.html',
  styleUrls: ['./calendar-timeline.component.scss']
})
export class CalendarTimelineComponent {
  newTaskDuration: number = 60;
  LOCAL_KEY = 'userTasks';

  @ViewChild('createInput') createInput!: ElementRef;
  @ViewChild('editInput') editInput!: ElementRef;

  handleOverlayKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.showEditTaskOverlay) {
        this.saveEditedTask();
      } else if (this.showTaskOverlay) {
        this.saveTask();
      }
    }
    if (event.key === 'Backspace') {
      if (this.showEditTaskOverlay) {
        this.deleteTask();
      }
    }
  }

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
    this.loadTasks();
  }

  get routineKey(): string {
    return 'userTasks_' + this.selectedRoutineDay;
  }

  saveTasksToStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.routineKey, JSON.stringify(this.tasks));
    }
  }

  loadTasks() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(this.routineKey);
      if (raw) {
        try {
          this.tasks = JSON.parse(raw);
        } catch {}
      } else {
        this.tasks = [];
      }
    }
  }

  addTask() {
    if (this.taskInput.trim()) {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes() - (now.getMinutes() % this.defaultTaskDuration);
      this.tasks.push({
        text: this.taskInput.trim(),
        color: this.userTaskColor,
        duration: this.defaultTaskDuration,
        hour,
        minute
      });
      this.taskInput = '';
      this.saveTasksToStorage();
    }
  }


  editTask(hour: number, index: number, newText: string) {
    const task = this.getTasksForHour(hour)[index];
    if (task) {
      task.text = newText;
      this.saveTasksToStorage();
    }
  }
  getTaskDisplayText(task: any): string {
    return task.name ? task.name : (task.text ? task.text : '');
  }
  // Drag & Drop Properties
  showMoveOverlay = false;
  moveFromHour: string | number | null = null;
  moveToHour: string | number | null = null;
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
      this.moveTaskIndex !== null
    ) {
      let fromHour = 0, fromMinute = 0;
      let toHour = 0, toMinute = 0;
      if (typeof this.moveFromHour === 'string') {
        [fromHour, fromMinute] = this.moveFromHour.split(':').map(Number);
      } else if (typeof this.moveFromHour === 'number') {
        fromHour = this.moveFromHour;
        fromMinute = 0;
      }
      if (typeof this.moveToHour === 'string') {
        [toHour, toMinute] = this.moveToHour.split(':').map(Number);
      } else if (typeof this.moveToHour === 'number') {
        toHour = this.moveToHour;
        toMinute = 0;
      }
      const tasksForFromSlot = this.tasks.filter(t => t.hour === fromHour && (t.minute ?? 0) === fromMinute);
      const task = tasksForFromSlot[this.moveTaskIndex];
      if (task) {
        task.hour = toHour;
        task.minute = toMinute;
        this.saveTasksToStorage();
      }
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
  selectedHour: string | number | null = null;
  newTaskName: string = '';
  tasksByHour: { [hour: string]: Array<{ name: string }> } = {};

  openTaskOverlay(hour: number) {
    this.selectedHour = hour;
    this.showTaskOverlay = true;
    setTimeout(() => {
      if (this.createInput) {
        this.createInput.nativeElement.focus();
      }
    }, 0);
  }

  closeTaskOverlay() {
    this.showTaskOverlay = false;
    this.selectedHour = null;
    this.newTaskName = '';
  }

  saveTask() {
    if (this.selectedHour !== null && this.newTaskName.trim()) {
      let hour = 0, minute = 0;
      if (typeof this.selectedHour === 'string') {
        [hour, minute] = this.selectedHour.split(':').map(Number);
      } else if (typeof this.selectedHour === 'number') {
        hour = this.selectedHour;
        minute = 0;
      }
        const duration = this.newTaskDuration || this.defaultTaskDuration;
        this.tasks.push({
          text: this.newTaskName.trim(),
          color: this.userTaskColor,
          duration,
          hour,
          minute
        });
      this.saveTasksToStorage();
      this.newTaskName = '';
      this.closeTaskOverlay();
    }
  }

  hoursLeft = Array.from({ length: 12 }, (_, i) => i); // 0-11
  hoursRight = Array.from({ length: 12 }, (_, i) => i + 12); // 12-23
  prayerTimes: { [key: number]: string } = {};
  isRefreshing = false;

  taskInput = '';
  tasks: { text: string; color: string; duration: number; hour: number, minute: number }[] = [];

  get userTaskColor(): string {
    return localStorage.getItem('userTaskColor') || '#2196f3';
  }
  get defaultTaskDuration(): number {
    return +(localStorage.getItem('defaultTaskDuration') || '60');
  }


  constructor(private fetchAPIData: FetchApiDataService, private snackBar: MatSnackBar) {}

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

  get timeSlots(): string[] {
    const duration = this.defaultTaskDuration;
    const slots: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += duration) {
        slots.push(`${h}:${m.toString().padStart(2, '0')}`);
      }
    }
    return slots;
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
  showEditOverlay = false;
  editTaskObj: any = null;
  editTaskText: string = '';

  openEditOverlay(task: any) {
    this.editTaskObj = task;
    this.editTaskText = task.text;
    this.showEditOverlay = true;
  }

  closeEditOverlay() {
    this.showEditOverlay = false;
    this.editTaskObj = null;
    this.editTaskText = '';
  }

  saveEditTask() {
    if (this.editTaskObj && this.editTaskText.trim()) {
      this.editTaskObj.text = this.editTaskText.trim();
      this.saveTasksToStorage();
      this.closeEditOverlay();
    }
  }

  deleteEditTask() {
    if (this.editTaskObj) {
      this.tasks = this.tasks.filter(t => t !== this.editTaskObj);
      this.saveTasksToStorage();
      this.closeEditOverlay();
    }
  }

  getTasksForSlot(slot: string) {
    const [hour, minute] = slot.split(':').map(Number);
    return this.tasks.filter(t => t.hour === hour && (t.minute ?? 0) === minute);
  }

  selectedRoutineDay: string = 'MO';

  // Routine-Tage-Wechsel beobachten
  ngDoCheck() {
    if (this.lastRoutineDay !== this.selectedRoutineDay) {
      this.lastRoutineDay = this.selectedRoutineDay;
      this.loadTasks();
    }
  }
  lastRoutineDay: string = this.selectedRoutineDay;

  getTaskEndTime(hour: number, minute: number, duration: number): string {
    const start = new Date(0, 0, 0, hour, minute);
    const end = new Date(start.getTime() + duration * 60000);
    const h = end.getHours().toString().padStart(2, '0');
    const m = end.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }
  showEditTaskOverlay = false;
  editTaskName = '';
  editTaskDuration = 60;
  editTaskIndex: number | null = null;
  editTaskHour: number | null = null;

  openEditTaskOverlay(task: any, hour: number, index: number) {
    this.showEditTaskOverlay = true;
    this.editTaskName = task.text;
    this.editTaskDuration = task.duration;
    this.editTaskIndex = index;
    this.editTaskHour = hour;
    setTimeout(() => {
      if (this.editInput) {
        this.editInput.nativeElement.focus();
      }
    }, 0);
  }

  closeEditTaskOverlay() {
    this.showEditTaskOverlay = false;
    this.editTaskName = '';
    this.editTaskDuration = 60;
    this.editTaskIndex = null;
    this.editTaskHour = null;
  }

  saveEditedTask() {
    if (this.editTaskIndex !== null && this.editTaskHour !== null) {
      const tasks = this.getTasksForHour(this.editTaskHour);
      if (tasks[this.editTaskIndex]) {
        tasks[this.editTaskIndex].text = this.editTaskName;
        tasks[this.editTaskIndex].duration = this.editTaskDuration;
        this.saveTasksToStorage();
      }
      this.closeEditTaskOverlay();
    }
  }

  lastDeletedTask: any = null;
  lastDeletedTaskTimeout: any = null;

  deleteTask() {
    if (this.editTaskIndex !== null && this.editTaskHour !== null) {
      const tasksForHour = this.getTasksForHour(this.editTaskHour);
      const taskToDelete = tasksForHour[this.editTaskIndex];
      if (taskToDelete) {
        const idx = this.tasks.findIndex(t => t.hour === taskToDelete.hour && t.minute === taskToDelete.minute && t.text === taskToDelete.text);
        if (idx > -1) {
          this.lastDeletedTask = { ...this.tasks[idx], index: idx };
          this.tasks.splice(idx, 1);
          this.saveTasksToStorage();
          this.snackBar.open('Task gelöscht – Rückgängig möglich', 'Rückgängig', { duration: 5000 }).onAction().subscribe(() => {
            this.undoDeleteTask();
          });
          if (this.lastDeletedTaskTimeout) clearTimeout(this.lastDeletedTaskTimeout);
          this.lastDeletedTaskTimeout = setTimeout(() => { this.lastDeletedTask = null; }, 5000);
        }
      }
      this.closeEditTaskOverlay();
    }
  }

  undoDeleteTask() {
    if (this.lastDeletedTask) {
      this.tasks.splice(this.lastDeletedTask.index, 0, this.lastDeletedTask);
      this.saveTasksToStorage();
      this.lastDeletedTask = null;
      if (this.lastDeletedTaskTimeout) clearTimeout(this.lastDeletedTaskTimeout);
    }
  }

  ngAfterViewChecked() {
    if (this.showTaskOverlay && this.createInput) {
      this.createInput.nativeElement.focus();
    }
    if (this.showEditTaskOverlay && this.editInput) {
      this.editInput.nativeElement.focus();
    }
  }
}
