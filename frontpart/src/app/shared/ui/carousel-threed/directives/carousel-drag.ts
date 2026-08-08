import {
  Directive,
  ElementRef,
  HostListener,
  inject
} from '@angular/core';

import { CarouselAnimation } from '../services/carousel-animation';

@Directive({
  selector: '[appCarouselDrag]'
})
export class CarouselDragDirective {

  private readonly element =
    inject(ElementRef<HTMLElement>);

  private readonly animation =
    inject(CarouselAnimation);

  private dragging = false;

  private lastX = 0;

  private lastTime = 0;


  @HostListener('pointerdown', ['$event'])
  onPointerDown(
    event: PointerEvent
  ): void {

    this.dragging = true;

    this.lastX = event.clientX;

    this.lastTime =
      performance.now();

    this.animation.startDrag();

    this.element.nativeElement.setPointerCapture(
      event.pointerId
    );
  }


  @HostListener('pointermove', ['$event'])
  onPointerMove(
    event: PointerEvent
  ): void {

    if (!this.dragging) {
      return;
    }

    const now =
      performance.now();

    const deltaX =
      event.clientX - this.lastX;

    const deltaTime =
      (now - this.lastTime) / 1000;


    this.animation.drag(
      deltaX,
      deltaTime
    );


    this.lastX =
      event.clientX;

    this.lastTime =
      now;
  }


  @HostListener('pointerup', ['$event'])
  onPointerUp(
    event: PointerEvent
  ): void {

    this.stopDragging(
      event.pointerId
    );
  }


  @HostListener('pointercancel', ['$event'])
  onPointerCancel(
    event: PointerEvent
  ): void {

    this.stopDragging(
      event.pointerId
    );
  }


  private stopDragging(
    pointerId: number
  ): void {

    if (!this.dragging) {
      return;
    }

    this.dragging = false;

    this.animation.endDrag();

    this.element.nativeElement.releasePointerCapture(
      pointerId
    );
  }
}

