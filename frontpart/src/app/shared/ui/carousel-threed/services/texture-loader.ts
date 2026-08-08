import { anisotropy } from './../../../../../../node_modules/@types/three/src/Three.TSL.d';
import { Service } from '@angular/core';
import * as THREE from 'three';
@Service()
export class TextureLoader {

  private readonly loader = new THREE.TextureLoader();

  load(url: string, anisotropy = 1): Promise<THREE.Texture> {

    return new Promise((resolve, reject) => {
      this.loader.load(url,
        texture => {

          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.anisotropy = anisotropy;

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
