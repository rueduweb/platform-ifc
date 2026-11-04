import { Service } from '@angular/core';
import { CarouselPosition } from '../models/carousel-position.model';

@Service()
export class CarouselLayout {

  private readonly cardWidth = 2.6;

  private readonly cardGap = 0.15;

  private readonly defaultRadius = 4;

  calculatePositions(itemCount: number, radius: number = this.defaultRadius): CarouselPosition[] {

    if (itemCount <= 0) {
      return [];
    }

    if (itemCount === 1) {
      return [{
        x: 0,
        y: 0,
        z: radius,
        rotationY: 0
      }];
    }

    const angleStep = (Math.PI * 2) / itemCount;

    // Distance minimale entre les centres des cartes
    const minDistance = this.cardWidth + this.cardGap;

    // Rayon minimal pour éviter le chevauchement
    const minRadius =
      minDistance / (2 * Math.sin(angleStep / 2));

    // On conserve le rayon demandé lorsqu'il est suffisant
    const effectiveRadius = Math.max(
      radius,
      minRadius
    );

    const positions: CarouselPosition[] = [];

    for (let index = 0; index < itemCount; index++) {

      const angle = index * angleStep;

      positions.push({

        x: Math.sin(angle) * effectiveRadius,

        y: 0,

        z: Math.cos(angle) * effectiveRadius,

        // La carte regarde vers le centre
        rotationY: angle

      });

    }

    return positions;
  }
}
