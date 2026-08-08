import { Service, inject } from '@angular/core';
import * as THREE from 'three';

import { CarouselItem } from '../models/carousel-item.model';
import { TextureLoader } from './texture-loader';
import { ThreeEngine } from './three-engine';

@Service()
export class CarouselCard {
  private readonly textureLoader = inject(TextureLoader);

  private readonly threeEngine = inject(ThreeEngine);

  async createCard(item: CarouselItem): Promise<THREE.Mesh> {

    const anisotropy = this.threeEngine.getMaxAnisotropy();

    const texture = await this.textureLoader.load(item.image);

    const geometry = new THREE.PlaneGeometry(
      2,
      1.2
    );

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      color: 0xffffff,

      roughness: 0.7,
      metalness: 0,

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
