import { Service } from '@angular/core';
import * as THREE from 'three';

@Service()
export class TextureLoader {

  private readonly loader = new THREE.TextureLoader();

  load(url: string): Promise<THREE.Texture> {

    return new Promise((resolve, reject) => {
      this.loader.load(url,
        texture => {
          resolve(texture);
        },

        undefined,

        error => {
          reject(error);
        }
      );
    });

  }
}
