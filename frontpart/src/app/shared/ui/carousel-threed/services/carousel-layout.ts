import { Service } from '@angular/core';
import { CarouselPosition } from '../models/carousel-position.model';

@Service()
export class CarouselLayout {

  calculatePositions(itemCount: number, radius: number = 5): CarouselPosition[] {
    const positions: CarouselPosition[] = [];

    for (let index = 0; index < itemCount; index++) {

      const angle =
        (index / itemCount) *
        Math.PI *
        2;

      positions.push({

        x: Math.sin(angle) * radius,

        y: 0,

        z: Math.cos(angle) * radius,

        // la carte regarde vers le centre
        rotationY: angle

      });

    }

    return positions;
  }
}
