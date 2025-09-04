import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import { FetchApiDataService } from '../fetch-api-data.service'
import { MatSnackBar } from '@angular/material/snack-bar';


interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, CommonModule, MatCardModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})

export class UserSettingsComponent {
  resetUserSettings() {
    this.selectedCalculationMethod = '1';
    this.defaultTaskDuration = '60';
    this.userAccentColor = '#222222';
    this.prayerRowColor1 = '#222';
    this.prayerRowColor2 = '#fff';
    this.prayerRowColor3 = '#138808';
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('calculationMethod', '1');
      localStorage.setItem('defaultTaskDuration', '60');
      localStorage.setItem('userAccentColor', '#222222');
      localStorage.setItem('prayerRowColor1', '#222');
      localStorage.setItem('prayerRowColor2', '#fff');
      localStorage.setItem('prayerRowColor3', '#138808');
    }
    this.snackBar.open('Alle Einstellungen wurden zurückgesetzt', 'OK', { duration: 2200 });
  }
  appVersion = '0.0.4-beta';
  selectedCalculationMethod = '1';
  defaultTaskDuration = '60';
  userAccentColor = '#222222';
  prayerRowColor1 = '#222'; // Schwarz (Fajr–Isha)
  prayerRowColor2 = '#fff'; // Weiß (Imsak–Sunset)
  prayerRowColor3 = '#138808'; // Grün (Firstthird–Lastthird)

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.selectedCalculationMethod = localStorage.getItem('calculationMethod') || '1';
      this.defaultTaskDuration = localStorage.getItem('defaultTaskDuration') || '60';
      this.userAccentColor = localStorage.getItem('userAccentColor') || '#222222';
  this.prayerRowColor1 = localStorage.getItem('prayerRowColor1') || '#222';
  this.prayerRowColor2 = localStorage.getItem('prayerRowColor2') || '#fff';
  this.prayerRowColor3 = localStorage.getItem('prayerRowColor3') || '#138808';
    }
  }

  trackByValue(index: number, item: { value: string }) {
    return item.value;
  }

  constructor(public fetchAPIData: FetchApiDataService, private snackBar: MatSnackBar) {}

  onCalculationMethodChange(value: string) {
    this.fetchAPIData.setCalculationMethod(value);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('calculationMethod', value);
    }
    this.snackBar.open('Einstellung gespeichert', 'OK', { duration: 1800 });
  }

  onDefaultTaskDurationChange(value: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('defaultTaskDuration', value);
    }
    this.snackBar.open('Einstellung gespeichert', 'OK', { duration: 1800 });
  }

  onUserAccentColorChange(value: string) {
    this.userAccentColor = value;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('userAccentColor', value);
    }
    this.snackBar.open('Akzentfarbe gespeichert', 'OK', { duration: 1800 });
  }

  onPrayerRowColorChange(row: number, value: string) {
    if (row === 1) {
      this.prayerRowColor1 = value;
      localStorage.setItem('prayerRowColor1', value);
    } else if (row === 2) {
      this.prayerRowColor2 = value;
      localStorage.setItem('prayerRowColor2', value);
    } else if (row === 3) {
      this.prayerRowColor3 = value;
      localStorage.setItem('prayerRowColor3', value);
    }
    this.snackBar.open('Reihenfarbe gespeichert', 'OK', { duration: 1800 });
  }
}
