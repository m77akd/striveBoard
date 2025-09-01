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
  selectedCalculationMethod = '1';
  defaultTaskDuration = '60';
  userAccentColor = '#222222';

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.selectedCalculationMethod = localStorage.getItem('calculationMethod') || '1';
      this.defaultTaskDuration = localStorage.getItem('defaultTaskDuration') || '60';
      this.userAccentColor = localStorage.getItem('userAccentColor') || '#222222';
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
    this.snackBar.open('Einstellung gespeichert', 'OK', { duration: 1800 });
  }
}
