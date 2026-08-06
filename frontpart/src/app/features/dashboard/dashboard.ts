import { Component, signal } from '@angular/core';
import { CustomDateFormatPipe } from '../../shared/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [CustomDateFormatPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  protected readonly today = signal<Date>(new Date());
}
