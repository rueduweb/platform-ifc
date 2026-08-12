import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, signal, input, effect } from '@angular/core';

import * as THREE from 'three';

import { ThreeEngine } from './services/three-engine';
import { CarouselLayout } from './services/carousel-layout';
import { CarouselAnimation } from './services/carousel-animation';
import { CarouselItem } from './models/carousel-item.model';
import { CarouselCard } from './services/carousel-card';
import { CarouselDragDirective } from './directives/carousel-drag';
import { CarouselNavigation } from './services/carousel-navigation';
import { CarouselHover } from './services/carousel-hover';
import { CarouselHoverState } from './models/carousel-hover.model';
@Component({
  selector: 'app-carousel-threed',
  imports: [CarouselDragDirective],
  templateUrl: './carousel-threed.html',
  styleUrl: './carousel-threed.css',
})
export class CarouselThreed implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true })
  private canvas!: ElementRef<HTMLCanvasElement>;

  private readonly threeEngine = inject(ThreeEngine);

  private readonly layout = inject(CarouselLayout);

  private readonly animation = inject(CarouselAnimation);

  private readonly cardService = inject(CarouselCard);

  private readonly hover = inject(CarouselHover);

  protected readonly navigation = inject(CarouselNavigation);

  private carouselGroup = new THREE.Group();

  // HOVER

  private handleHoverChange = (state: CarouselHoverState): void => {
    this.animation.setHoverState(state);
  };

  // == INPUT == //
  readonly items = input.required<CarouselItem[]>();


  // LIFECYCLE

  private initialized = false;

  private destroyed = false;

  // =====================================================================
  // SYNCHRONISATION QUEUE
  //
  // Les images sont chargées de manière asynchrone.
  //
  // Cette Promise évite que deux changements rapides de la liste
  // modifient simultanément le groupe Three.js.
  // =====================================================================

  private updateQueue = Promise.resolve();

  constructor() {

    effect(() => {

      const items = this.items();

      if (!this.initialized) {
        return;
      }

      this.enqueueUpdate(items);

    });

  }

  ngAfterViewInit(): void {
    // Initialiser Three js
    this.threeEngine.init(this.canvas.nativeElement);
    // Nommer le groupe
    this.carouselGroup.name = 'carousel';
    // Récupérer la scène
    const scene = this.threeEngine.getScene();
    // Ajouter le groupe à la scène
    scene.add(this.carouselGroup);

    this.carouselGroup.rotation.y = Math.PI / 2;

    // == HOVER ==

    this.hover.setContainer(
      this.canvas.nativeElement
    );

    this.hover.setCamera(
      this.threeEngine.getCamera()
    );

    this.hover.setGroup(
      this.carouselGroup
    );

    this.hover.registerListener(
      this.handleHoverChange
    );

    // -------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------

    this.animation.setGroup(
      this.carouselGroup
    );


    this.threeEngine.registerPlugin(
      this.animation
    );


    // -------------------------------------------------------------
    // Carousel prêt
    // -------------------------------------------------------------

    this.initialized = true;

    this.enqueueUpdate(this.items());

  }

  ngOnDestroy(): void {

    this.destroyed = true;

    this.hover.unregisterListener(
      this.handleHoverChange
    );

    this.hover.dispose();
    this.threeEngine.unregisterPlugin(this.animation);

    this.disposeAllCards();

    this.threeEngine.destroy();
  }

  // =====================================================================
  // UPDATE QUEUE
  // =====================================================================

  private enqueueUpdate(items: CarouselItem[]): void {

    this.updateQueue = this.updateQueue.then(
      () => this.synchronizeCarousel(items)
    );

  }

  private async synchronizeCarousel(
    items: CarouselItem[]
  ): Promise<void> {

    if (this.destroyed) {
      return;
    }

    // Cartes existantes

    const existingCards = new Map<string, THREE.Mesh>();

    for (const child of this.carouselGroup.children) {

      const card = child as THREE.Mesh;

      const id = card.userData['carouselItemId'] as string;

      if (id) {

        existingCards.set(
          id,
          card
        );

      }

    }

    // IDs actifs
    const activeIds = new Set<string>();

    // Création / conservation
    for (const item of items) {

      activeIds.add(item.id);

      const existingCard = existingCards.get(item.id);

      // CARTE EXISTANTE
      if (existingCard) {

        const oldImage = existingCard.userData['carouselImage'] as string;

        // L'image du joueur a changé
        if (oldImage !== item.image) {

          await this.replaceCard(
            existingCard,
            item
          );

        } else {

          this.updateCardData(
            existingCard,
            item
          );

        }

        continue;
      }
      // NOUVELLE CARTE
      try {

        const card = await this.cardService.createCard(item);

        if (this.destroyed) {

          this.cardService.disposeCard(card);

          return;

        }

        this.initializeCardData(card, item);

        this.carouselGroup.add(card);

      } catch (error) {
        // Une image défectueuse ne doit pas
        // casser tout le carousel.
        console.error(`Impossible de créer la carte ${item.id}`, error);
      }
    }
    // -------------------------------------------------------------
    // Suppression des cartes absentes
    // -------------------------------------------------------------

    for (const [id, card] of existingCards) {

      if (!activeIds.has(id)) {

        this.removeCard(card);

      }

    }

    // -------------------------------------------------------------
    // Recalcul des positions
    // -------------------------------------------------------------

    this.repositionCards(items);

    // -------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------

    this.animation.setGroup(this.carouselGroup);

    this.animation.setCardCount(this.carouselGroup.children.length);

  }

  // =====================================================================
  // INITIALISATION DONNÉES CARTE
  // =====================================================================

  private initializeCardData(card: THREE.Mesh, item: CarouselItem): void {

    card.userData['carouselItemId'] = item.id;

    card.userData['carouselImage'] = item.image;

    card.userData['carouselItem'] = item;

  }

  // =====================================================================
  // MISE À JOUR DONNÉES
  // =====================================================================

  private updateCardData(card: THREE.Mesh, item: CarouselItem): void {

    card.userData['carouselItemId'] = item.id;

    card.userData['carouselImage'] = item.image;

    card.userData['carouselItem'] = item;

  }

  // =====================================================================
  // POSITIONNEMENT
  // =====================================================================

  private repositionCards(items: CarouselItem[]): void {

    const positions = this.layout.calculatePositions(
      items.length,
      4
    );

    const cardsById = new Map<string,THREE.Mesh>();

    for (const child of this.carouselGroup.children) {

      const card = child as THREE.Mesh;

      const id = card.userData['carouselItemId'] as string;

      if (id) {

        cardsById.set(id,card);

      }

    }

    let positionIndex = 0;

    for (const item of items) {

      const card = cardsById.get(item.id);

      if (!card) {
        continue;
      }

      const position = positions[positionIndex];

      if (!position) {
        break;
      }

      card.position.set(
        position.x,
        position.y,
        position.z
      );

      card.rotation.y = position.rotationY;

      positionIndex++;

    }

  }

  // =====================================================================
  // REMPLACEMENT D'UNE CARTE
  // =====================================================================
  private async replaceCard(oldCard: THREE.Mesh, item: CarouselItem): Promise<void> {

    try {
      const newCard = await this.cardService.createCard(item);

      if (this.destroyed) {

        this.cardService.disposeCard(newCard);

        return;

      }

      this.initializeCardData(newCard, item);

      this.carouselGroup.add(newCard);

      this.carouselGroup.remove(oldCard);

      this.cardService.disposeCard(oldCard);

    } catch(error) {
      // Si le nouveau fichier est invalide,
      // on conserve l'ancienne carte.

      console.error(`Impossible de remplacer l'image du joueur ${item.id}`, error);
    }

  }

  // =====================================================================
  // SUPPRESSION CARTE
  // =====================================================================

  private removeCard(card: THREE.Mesh): void {

    this.carouselGroup.remove(card);

    this.cardService.disposeCard(card);

  }

  // =====================================================================
  // LIBÉRATION TOUTES LES CARTES
  // =====================================================================

  private disposeAllCards(): void {

    const cards = [...this.carouselGroup.children];

    for (const child of cards) {

      const card = child as THREE.Mesh;

      this.carouselGroup.remove(card);

      this.cardService.disposeCard(card);

    }

  }

}
