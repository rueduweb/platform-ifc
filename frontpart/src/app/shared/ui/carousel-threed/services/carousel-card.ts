import { Service, inject } from '@angular/core';
import * as THREE from 'three';

import { CarouselItem } from '../models/carousel-item.model';
import { TextureLoader } from './texture-loader';
import { ThreeEngine } from './three-engine';

@Service()
export class CarouselCard {

  private readonly textureLoader = inject(TextureLoader);

  private readonly threeEngine = inject(ThreeEngine);

  // == CREATE CARD == //
  async createCard(item: CarouselItem): Promise<THREE.Mesh> {

    const anisotropy = this.threeEngine.getMaxAnisotropy();

    const texture = await this.textureLoader.load(item.image, anisotropy);

    const geometry = new THREE.PlaneGeometry(
      3.13,
      3.5
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

    // On garde l'identifiant dans userData
    // card.userData['carouselItemId'] = item.id;

    return card;
  }

  // == DISPOSE == //
  disposeCard(card: THREE.Mesh): void {

    // Geometry
    card.geometry.dispose();

    // Material
    const material = card.material;

    if (Array.isArray(material)) {

      for (const current of material) {
        this.disposeMaterial(current);
      }

    } else {

      this.disposeMaterial(material);
    }
  }


  private disposeMaterial(material: THREE.Material): void {

    const standardMaterial = material as THREE.MeshStandardMaterial;

    // Texture
    if (standardMaterial.map) {
      standardMaterial.map.dispose();
    }

    // Material
    material.dispose();
  }

}
