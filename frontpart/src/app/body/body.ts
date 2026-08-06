import { Component, input, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-body',
  imports: [CommonModule, RouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body {

  public collapsed = input<boolean>(false);
  public screenWidth = input<number>(0);

  getBodyClass(): string {
    let styleClass = '';
    if(this.collapsed() && this.screenWidth() > 768) {
      styleClass = 'body-trimmed';
    } else if(this.collapsed() && this.screenWidth() < 768 && this.screenWidth() > 0) {
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }
}
