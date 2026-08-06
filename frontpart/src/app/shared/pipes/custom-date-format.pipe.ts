import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateFormat',
  standalone: true
})
export class CustomDateFormatPipe implements PipeTransform {

  transform(value: Date | string | null, format: string = 'MM/dd/yyyy'): string {
    if(!value) return '';

    const date = new Date(value);

    const options: Intl.DateTimeFormatOptions = this.getDateFormatOptions(format);

    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  }

  private getDateFormatOptions(format: string): Intl.DateTimeFormatOptions {
    switch (format) {
      case 'MM/dd/yyyy':
          return { month: '2-digit', day: '2-digit', year: 'numeric'};
      case 'fullDate':
          return { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
      case 'shortDate':
          return { month: 'short', day: 'numeric', year: 'numeric'};
      case 'timeOnly':
          return { hour: '2-digit', minute: '2-digit', second: '2-digit'};
      default:
          return { year: 'numeric', month: 'numeric', day: 'numeric'};
    }
  }
}
