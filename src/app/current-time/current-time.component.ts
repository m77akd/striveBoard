import { Component } from '@angular/core';
import { NavMetricsService, provideNavMetrics } from 'nav-metrics';

@Component({
  selector: 'app-current-time',
  standalone: true,
  imports: [],
  templateUrl: './current-time.component.html',
  styleUrl: './current-time.component.scss',
  providers: [ provideNavMetrics({ onRecord: (m) => console.log(m) }) ]
})
export class CurrentTimeComponent {

  public date: Date = new Date();

  constructor() {}
}
