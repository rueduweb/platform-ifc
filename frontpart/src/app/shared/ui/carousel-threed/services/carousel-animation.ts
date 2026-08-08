import { Service } from '@angular/core';
import * as THREE from 'three';

import { RenderPlugin } from '../models/render-plugin';

@Service()
export class CarouselAnimation implements RenderPlugin {

  private group?: THREE.Group;

  private cardCount = 0;

  private currentIndex = 0;

  private currentRotation = 0;

  private targetRotation = 0;

  private velocity = 0;

  private isDragging = false;

  private isNavigating = false;


  private readonly dragSensitivity = 0.008;

  private readonly friction = 5;

  private readonly snapSpeed = 8;

  private readonly velocityThreshold = 0.05;


  // --------------------------------------------------
  // Configuration
  // --------------------------------------------------

  setGroup(group: THREE.Group): void {

    this.group = group;

    this.currentRotation = group.rotation.y;

    this.targetRotation = group.rotation.y;
  }


  setCardCount(count: number): void {

    this.cardCount = Math.max(0, count);

    this.currentIndex = 0;
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

    const normalizedIndex = THREE.MathUtils.euclideanModulo(
      index,
      this.cardCount
    );

    this.currentIndex = normalizedIndex;

    const angleStep = (Math.PI * 2) / this.cardCount;

    const target = -this.currentIndex * angleStep;

    this.targetRotation = this.getShortestTargetRotation(target);

    console.log(
      'goTo',
      this.currentIndex,
      'target',
      this.targetRotation
    );

    this.isNavigating = true;
  }


  // --------------------------------------------------
  // Drag
  // --------------------------------------------------

  startDrag(): void {

    this.isDragging = true;

    this.isNavigating = false;

    this.velocity = 0;
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
  }

  // --------------------------------------------------
  // RenderPlugin
  // --------------------------------------------------

  update(deltaTime: number): void {

    if (!this.group) {
      return;
    }

    if (this.isDragging) {
      return;
    }

    // ------------------------------
    // Inertie
    // ------------------------------

    if (Math.abs(this.velocity) > this.velocityThreshold) {

      this.currentRotation += this.velocity * deltaTime;

      this.velocity *= Math.exp(-this.friction * deltaTime);

      this.group.rotation.y = this.currentRotation;

      return;
    }
    // ------------------------------
    // navigation explicite
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
    // Snap après un drag
    // -----------------------------

    this.currentIndex = this.calculateSnapIndex();

    const angleStep = (Math.PI * 2) / this.cardCount;

    const target = -this.currentIndex * angleStep;

    this.targetRotation = this.getShortestTargetRotation(target);

    // ------------------------------
    // Animation du snap
    // ------------------------------

    this.currentRotation = THREE.MathUtils.damp(
      this.currentRotation,
      this.targetRotation,
      this.snapSpeed,
      deltaTime
    );

    this.group.rotation.y = this.currentRotation;
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

  // --------------------------------------------------
  // Nettoyage
  // --------------------------------------------------

  dispose(): void {

    this.group = undefined;

    this.velocity = 0;

    this.isDragging = false;
  }
}
