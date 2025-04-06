import { Component } from '@angular/core';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent, HttpClientModule],
  template: `
    <app-dashboard></app-dashboard>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
  `]
})
export class AppComponent {
  title = 'instrumentpulse';
}
