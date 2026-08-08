import { Service, NgZone, inject } from '@angular/core';
import * as THREE from 'three';

import { RenderPlugin } from '../models/render-plugin';

@Service()
export class ThreeEngine {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private animationFrameId?: number;

  private readonly plugins = new Set<RenderPlugin>();

  private previousTime = 0;

  private ngZone = inject(NgZone);

  private readonly animationCallbacks = new Set<() => void>();

  init(canvas: HTMLCanvasElement): void {

    this.scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      1.5
    );

    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(
      0xffffff,
      2
    );

    keyLight.position.set(
      3,
      4,
      6
    );

    this.scene.add(keyLight);

    this.camera = new THREE.PerspectiveCamera(
      75,
      1,
      0.1,
      1000
    );

    this.camera.position.set(0,0,10);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    });

    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.resize();

    window.addEventListener(
      'resize',
      this.resize
    );
    this.startRenderLoop();
  }

  registerPlugin(plugin: RenderPlugin): void {

    this.plugins.add(plugin);

  }

  unregisterPlugin(plugin: RenderPlugin): void {

    if (!this.plugins.has(plugin)) {
      return;
    }

    plugin.dispose();

    this.plugins.delete(plugin);
  }

  private startRenderLoop(): void {

    this.ngZone.runOutsideAngular(() => {

      const animate = (time: number) => {

        this.animationFrameId = requestAnimationFrame(animate);

        const deltaTime = this.previousTime === 0 ? 0 : (time - this.previousTime) / 1000;

        this.previousTime = time;

        this.plugins.forEach(plugin => {
          plugin.update(deltaTime);
        });

        this.renderer.render(
          this.scene,
          this.camera
        );
      };

      this.animationFrameId = requestAnimationFrame(animate);
    });
  }

  private resize = (): void => {
    const canvas = this.renderer.domElement;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (width === 0 || height === 0) {
      return;
    }

    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      width,
      height,
      false
    );
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  getMaxAnisotropy(): number {
    return this.renderer
      .capabilities
      .getMaxAnisotropy();
  }

  destroy(): void {

    if (this.animationFrameId) {
      cancelAnimationFrame(
        this.animationFrameId
      );
    }

    this.plugins.forEach(plugin => {
      plugin.dispose();
    });

    this.plugins.clear();

    window.removeEventListener(
      'resize',
      this.resize
    );

    this.renderer.dispose();
  }

  registerAnimationCallback(callback: () => void): void {

    this.animationCallbacks.add(callback);

  }

  unregisterAnimationCallback(callback: () => void): void {

    this.animationCallbacks.delete(callback);

  }

}
