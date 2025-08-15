import { Component } from '@angular/core';

@Component({
  selector: 'app-current-time',
  standalone: true,
  imports: [],
  templateUrl: './current-time.component.html',
  styleUrl: './current-time.component.scss'
})
export class CurrentTimeComponent {

  public date: Date = new Date();
}
