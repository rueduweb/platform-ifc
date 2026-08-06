import { Component, signal } from '@angular/core';
import { CustomDateFormatPipe } from '../../shared/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-team',
  imports: [CustomDateFormatPipe],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team {
  protected readonly today = signal<Date>(new Date());
}
