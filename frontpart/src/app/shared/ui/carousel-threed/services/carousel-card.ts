import { Service, inject } from '@angular/core';
import * as THREE from 'three';

import { CarouselItem } from '../models/carousel-item.model';
import { TextureLoader } from './texture-loader';

@Service()
export class CarouselCard {
  private readonly textureLoader = inject(TextureLoader);

  async createCard(item: CarouselItem): Promise<THREE.Mesh> {

    const texture = await this.textureLoader.load(item.image);

    const geometry = new THREE.PlaneGeometry(
      2,
      1.2
    );

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    });

    const card = new THREE.Mesh(
      geometry,
      material
    );

    card.name = `card-${item.id}`;

    return card;
  }

}
