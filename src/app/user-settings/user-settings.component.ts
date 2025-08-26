import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FetchApiDataService } from '../fetch-api-data.service'


interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, CommonModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {

  selectedCalculationMethod = '1';

  trackByValue(index: number, item: { value: string }) {
    return item.value;
  }

  constructor(public fetchAPIData: FetchApiDataService) {}

  onCalculationMethodChange(value: string) {
    this.fetchAPIData.setCalculationMethod(value);
  }
}
