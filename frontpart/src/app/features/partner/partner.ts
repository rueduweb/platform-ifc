import { Component, signal } from '@angular/core';
import { CustomDateFormatPipe } from '../../shared/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-partner',
  imports: [CustomDateFormatPipe],
  templateUrl: './partner.html',
  styleUrl: './partner.css',
})
export class Partner {
  protected readonly today = signal<Date>(new Date());
}
