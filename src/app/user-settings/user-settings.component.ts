import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import { FetchApiDataService } from '../fetch-api-data.service'


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
  userTaskColor = '#2196f3';

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.selectedCalculationMethod = localStorage.getItem('calculationMethod') || '1';
      this.defaultTaskDuration = localStorage.getItem('defaultTaskDuration') || '60';
      this.userTaskColor = localStorage.getItem('userTaskColor') || '#2196f3';
    }
  }

  trackByValue(index: number, item: { value: string }) {
    return item.value;
  }

  constructor(public fetchAPIData: FetchApiDataService) {}

  onCalculationMethodChange(value: string) {
    this.fetchAPIData.setCalculationMethod(value);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('calculationMethod', value);
    }
  }

  onDefaultTaskDurationChange(value: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('defaultTaskDuration', value);
    }
  }

  onUserTaskColorChange(value: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('userTaskColor', value);
    }
  }
}
