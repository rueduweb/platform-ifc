import { Service } from '@angular/core';
import * as THREE from 'three';

import { CarouselHoverListener, CarouselHoverState } from '../models/carousel-hover.model';

@Service()
export class CarouselHover {

  private readonly raycaster = new THREE.Raycaster();

  private readonly pointer = new THREE.Vector2();

  private canvas?: HTMLCanvasElement;

  private camera?: THREE.PerspectiveCamera;

  private group?: THREE.Group;

  private hoveredItemId: string | null = null;

  private readonly listeners = new Set<CarouselHoverListener>();

  // --------------------------------------------------
  // Configuration
  // --------------------------------------------------

  setContainer(canvas: HTMLCanvasElement): void {

    if (this.canvas === canvas) {
      return;
    }

    this.detachCanvasListeners();

    this.canvas = canvas;

    this.attachCanvasListeners();
  }

  setCamera(camera: THREE.PerspectiveCamera): void {

    this.camera = camera;
  }

  setGroup(group: THREE.Group): void {

    this.group = group;

    // Si le groupe change, le hover précédent
    // n'est plus considéré comme valide.
    this.setHoveredItem(null);
  }

  // --------------------------------------------------
  // Listeners
  // --------------------------------------------------

  registerListener(listener: CarouselHoverListener): void {
    this.listeners.add(listener);
  }

  unregisterListener(listener: CarouselHoverListener): void {
    this.listeners.delete(listener);
  }

  // --------------------------------------------------
  // Pointer
  // --------------------------------------------------

  private pointerMove = (event: PointerEvent): void => {

    if (!this.canvas || !this.camera || !this.group) {
      return;
    }

    this.updatePointerPosition(event);

    this.raycaster.setFromCamera(
      this.pointer,
      this.camera
    );

    const intersections = this.raycaster.intersectObject(
      this.group,
      true
    );

    const itemId = this.findCarouselItemId(intersections);

    this.setHoveredItem(itemId);
  };

  private pointerLeave = (): void => {

    this.setHoveredItem(null);
  };

  // --------------------------------------------------
  // Raycasting
  // --------------------------------------------------

  private findCarouselItemId(intersections: THREE.Intersection[]): string | null {

    for (const intersection of intersections) {

      const itemId = this.findItemIdFromObject(
        intersection.object
      );

      if (itemId) {
        return itemId;
      }
    }

    return null;
  }

  private findItemIdFromObject(object: THREE.Object3D): string | null {

    let current: THREE.Object3D | null = object;

    while (current) {

      const itemId = current.userData['carouselItemId'];

      if (typeof itemId === 'string') {
        return itemId;
      }

      if (current === this.group) {
        break;
      }

      current = current.parent;
    }

    return null;
  }

  // --------------------------------------------------
  // Hover state
  // --------------------------------------------------

  private setHoveredItem(itemId: string | null): void {

    if (this.hoveredItemId === itemId) {
      return;
    }

    this.hoveredItemId = itemId;

    const state: CarouselHoverState = {
      isHovered: itemId !== null,
      itemId
    };

    this.listeners.forEach(listener => {
      listener(state);
    });
  }

  // --------------------------------------------------
  // Pointer coordinates
  // --------------------------------------------------

  private updatePointerPosition(event: PointerEvent): void {

    if (!this.canvas) {
      return;
    }

    const rect = this.canvas.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  // --------------------------------------------------
  // DOM listeners
  // --------------------------------------------------

  private attachCanvasListeners(): void {

    if (!this.canvas) {
      return;
    }

    this.canvas.addEventListener(
      'pointermove',
      this.pointerMove
    );

    this.canvas.addEventListener(
      'pointerleave',
      this.pointerLeave
    );
  }

  private detachCanvasListeners(): void {

    if (!this.canvas) {
      return;
    }

    this.canvas.removeEventListener(
      'pointermove',
      this.pointerMove
    );

    this.canvas.removeEventListener(
      'pointerleave',
      this.pointerLeave
    );
  }

  // --------------------------------------------------
  // Nettoyage
  // --------------------------------------------------

  dispose(): void {

    this.detachCanvasListeners();

    this.canvas = undefined;
    this.camera = undefined;
    this.group = undefined;

    this.hoveredItemId = null;

    this.listeners.clear();
  }
}
