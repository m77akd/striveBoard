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
  selectedCalculationMethod = localStorage.getItem('calculationMethod') || '1';
  defaultTaskDuration = localStorage.getItem('defaultTaskDuration') || '60';
  userTaskColor = localStorage.getItem('userTaskColor') || '#2196f3';

  trackByValue(index: number, item: { value: string }) {
    return item.value;
  }

  constructor(public fetchAPIData: FetchApiDataService) {}

  onCalculationMethodChange(value: string) {
    this.fetchAPIData.setCalculationMethod(value);
    localStorage.setItem('calculationMethod', value);
  }

  onDefaultTaskDurationChange(value: string) {
    localStorage.setItem('defaultTaskDuration', value);
  }

  onUserTaskColorChange(value: string) {
    localStorage.setItem('userTaskColor', value);
  }
}
