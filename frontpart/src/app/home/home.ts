import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { CustomDateFormatPipe } from '../shared/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CustomDateFormatPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly today = signal<Date>(new Date());
}
