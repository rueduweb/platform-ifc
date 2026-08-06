import { Component, signal } from '@angular/core';
import { CustomDateFormatPipe } from '../../shared/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-championship',
  imports: [CustomDateFormatPipe],
  templateUrl: './championship.html',
  styleUrl: './championship.css',
})
export class Championship {
  protected readonly today = signal<Date>(new Date());
}
