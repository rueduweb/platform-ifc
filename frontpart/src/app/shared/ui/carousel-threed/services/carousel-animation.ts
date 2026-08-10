import { Service } from '@angular/core';
import * as THREE from 'three';

import { RenderPlugin } from '../models/render-plugin';
import { CarouselHoverState } from '../models/carousel-hover.model';
import { CarouselHoverReceiver } from '../models/carousel-hover-receiver';

@Service()
export class CarouselAnimation implements RenderPlugin, CarouselHoverReceiver {

  private group?: THREE.Group;

  private cardCount = 0;

  private currentIndex = 0;

  private currentRotation = 0;

  private targetRotation = 0;

  private velocity = 0;

  private isDragging = false;

  private isNavigating = false;

  private isCardHovered = false;

  // private hoveredItemId: string | null = null; A conserver si comportement spécifique

  private hoverResumeTimer = 0;

  private autoScrollEnabled = false;

  private isSnapping = false;

  private readonly dragSensitivity = 0.008;

  private readonly friction = 5;

  private readonly snapSpeed = 8;

  private readonly velocityThreshold = 0.05;

  private readonly hoverResumeDelay = 180; // ms

  private readonly autoScrollSpeed = -0.35;


  // --------------------------------------------------
  // Configuration
  // --------------------------------------------------

  setGroup(group: THREE.Group): void {

    this.group = group;

    this.currentRotation = group.rotation.y;

    this.targetRotation = group.rotation.y;

    this.autoScrollEnabled = true;
  }


  setCardCount(count: number): void {

    this.cardCount = Math.max(0, count);

    this.currentIndex = 0;
    // Démarrer autoscroll avec au moins 2 items
    this.autoScrollEnabled = this.cardCount > 1;
  }

  setHoverState(state: CarouselHoverState): void {
    if (state.isHovered) {

      this.isCardHovered = true;
      // this.hoveredItemId = state.itemId;

      // Freinage immédiat
      this.velocity = 0;

      // On NE modifie PAS targetRotation.
      // Une éventuelle navigation goTo() doit reprendre après le hover
      // this.targetRotation = this.currentRotation;

      // Annule un éventuel délai de reprise
      this.hoverResumeTimer = 0;

      return;
    }

    this.isCardHovered = false;
    // this.hoveredItemId = null;

    // Short delay before autoscroll
    this.hoverResumeTimer = this.hoverResumeDelay;
  };

  // --------------------------------------------------
  // Auto-scroll
  // --------------------------------------------------

  startAutoScroll(): void {

    this.autoScrollEnabled = true;
  }

  stopAutoScroll(): void {

    this.autoScrollEnabled = false;
  }

  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------

  next(): void {

    this.goTo(this.currentIndex + 1);
  }


  previous(): void {

    this.goTo(this.currentIndex - 1);
  }


  goTo(index: number): void {

    if (this.cardCount === 0) {
      return;
    }

    // On annule l'inertie éventuelle.
    this.velocity = 0;

    this.isSnapping = false;

    const normalizedIndex = THREE.MathUtils.euclideanModulo(
      index,
      this.cardCount
    );

    this.currentIndex = normalizedIndex;

    const angleStep = (Math.PI * 2) / this.cardCount;

    const target = -this.currentIndex * angleStep;

    this.targetRotation = this.getShortestTargetRotation(target);

    this.isNavigating = true;
  }


  // --------------------------------------------------
  // Drag
  // --------------------------------------------------

  startDrag(): void {

    this.isDragging = true;

    this.isNavigating = false;

    this.isSnapping = false;

    this.velocity = 0;

    this.hoverResumeTimer = 0;
  }


  drag(deltaX: number, deltaTime: number): void {

    if (!this.group) {
      return;
    }

    const deltaRotation = deltaX * this.dragSensitivity;

    this.currentRotation += deltaRotation;

    this.targetRotation = this.currentRotation;

    if (deltaTime > 0) {
      this.velocity = deltaRotation / deltaTime;
    }

    this.group.rotation.y = this.currentRotation;
  }

  endDrag(): void {

    this.isDragging = false;
    if (!this.group || this.cardCount === 0) {
      return;
    }

    this.isSnapping = true;
  }

  // --------------------------------------------------
  // RenderPlugin
  // --------------------------------------------------

  update(deltaTime: number): void {

    if (!this.group) {
      return;
    }

    // -----------------------------------------
    // 1. Drag
    // -----------------------------------------

    if (this.isDragging) {
      return;
    }

    // -----------------------------------------
    // 2. Hover
    // -----------------------------------------

    if(this.isCardHovered) {
      return;
    }

    // -----------------------------------------
    // 3. Délai après mouseout
    // -----------------------------------------

    if (this.hoverResumeTimer > 0) {

      this.hoverResumeTimer -= deltaTime * 1000;

      return;
    }

    // ------------------------------
    // 4. Inertie
    // ------------------------------

    if (Math.abs(this.velocity) > this.velocityThreshold) {

      this.currentRotation += this.velocity * deltaTime;

      this.velocity *= Math.exp(-this.friction * deltaTime);

      this.group.rotation.y = this.currentRotation;

      this.normalizeRotation();

      return;
    }

    // ------------------------------
    // 5. navigation explicite
    // ------------------------------
    if (this.isNavigating) {

      this.currentRotation = THREE.MathUtils.damp(
        this.currentRotation,
        this.targetRotation,
        this.snapSpeed,
        deltaTime
      );

      this.group.rotation.y = this.currentRotation;

      // Navigation terminée
      if (Math.abs(this.currentRotation - this.targetRotation) < 0.001) {

        this.currentRotation = this.targetRotation;

        this.group.rotation.y = this.currentRotation;

        this.isNavigating = false;
      }
      return;
    }

    // -----------------------------
    // 6. Snap
    // -----------------------------

    if (this.isSnapping) {

      this.updateSnap(deltaTime);

      return;
    }

    // -----------------------------------------
    // 7. AUTO-SCROLL
    // -----------------------------------------

    if (this.autoScrollEnabled) {

      this.updateAutoScroll(deltaTime);

      return;
    }
  }

  // --------------------------------------------------
  // Calculs internes
  // --------------------------------------------------

  private calculateSnapIndex(): number {

    if (this.cardCount === 0) {
      return this.currentIndex;
    }

    const angleStep = (Math.PI * 2) / this.cardCount;

    return THREE.MathUtils.euclideanModulo(
      Math.round(
        -this.currentRotation /
        angleStep
      ),
      this.cardCount
    );
  }


  private getShortestTargetRotation(target: number): number {

    const twoPi = Math.PI * 2;

    let difference = target - this.currentRotation;

    difference = THREE.MathUtils.euclideanModulo(
      difference + Math.PI,
      twoPi
    ) - Math.PI;

    return (this.currentRotation + difference);
  }

  private updateSnap(deltaTime: number): void {

    if (!this.group || this.cardCount === 0) {
      this.isSnapping = false;
      return;
    }

    this.currentIndex = this.calculateSnapIndex();

    const angleStep = (Math.PI * 2) / this.cardCount;

    const target = -this.currentIndex * angleStep;

    this.targetRotation = this.getShortestTargetRotation(target);

    this.currentRotation = THREE.MathUtils.damp(
      this.currentRotation,
      this.targetRotation,
      this.snapSpeed,
      deltaTime
    );

    this.group.rotation.y = this.currentRotation;

    if (Math.abs(this.currentRotation - this.targetRotation) < 0.001) {

      this.currentRotation = this.targetRotation;

      this.group.rotation.y = this.currentRotation;

      this.isSnapping = false;
    }
  }

  private updateAutoScroll(deltaTime: number): void {

    if (!this.group) {
      return;
    }

    this.group.rotation.y += 0.01;

    this.currentRotation += this.autoScrollSpeed * deltaTime;

    this.normalizeRotation();

    this.group.rotation.y = this.currentRotation;

    // this.currentIndex = this.calculateSnapIndex();

    this.currentIndex = this.calculateSnapIndex();

  }

  private normalizeRotation(): void { // conserve l'angle de rotation dans [-PI,+PI[

    const twoPi = Math.PI * 2;

    this.currentRotation = THREE.MathUtils.euclideanModulo(
      this.currentRotation + Math.PI,
      twoPi
    ) - Math.PI;

    /* if (this.group) {
      this.group.rotation.y = this.currentRotation;
    } */
  }


  // --------------------------------------------------
  // Nettoyage
  // --------------------------------------------------

  dispose(): void {

    this.group = undefined;

    this.velocity = 0;

    this.isDragging = false;

    this.isNavigating = false;

    this.isSnapping = false;

    this.isCardHovered = false;

    // this.hoveredItemId = null;

    this.hoverResumeTimer = 0;
  }
}
