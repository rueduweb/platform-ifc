import { Service, inject } from '@angular/core';
import { CarouselAnimation } from './carousel-animation';

@Service()
export class CarouselNavigation {
  private readonly animation = inject(CarouselAnimation);

  next(): void {
    this.animation.next();
  }

  previous(): void {
    this.animation.previous();
  }

  goTo(index: number): void {
    this.animation.goTo(index);
  }
}
