import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { ThreeEngine } from './services/three-engine';
import * as THREE from 'three';
import { CarouselLayout } from './services/carousel-layout';
import { CarouselAnimation } from './services/carousel-animation';
import { CarouselItem } from './models/carousel-item.model';
import { CarouselCard } from './services/carousel-card';
import { CarouselDragDirective } from './directives/carousel-drag';
import { CarouselNavigation } from './services/carousel-navigation';


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

  protected readonly navigation = inject(CarouselNavigation);

  private carouselGroup = new THREE.Group();

  private readonly items = signal<CarouselItem[]>([
    {
      id: 'p1',
      image: 'assets/images/p1.jpg',
      firstname: 'Carte 1',
      position: 'Gardien',
      description: 'Première carte du carousel'
    },
    {
      id: 'p2',
      image: 'assets/images/p2.jpg',
      firstname: 'Carte 2',
      position: 'Stopeur',
      description: 'Deuxième carte du carousel'
    },
    {
      id: 'p3',
      image: 'assets/images/p3.jpg',
      firstname: 'Carte 3',
      position: 'Latéral',
      description: 'Troisième carte du carousel'
    },
    {
      id: 'p4',
      image: 'assets/images/p4.jpg',
      firstname: 'Carte 4',
      position: 'Milieu',
      description: 'Quatrième carte du carousel'
    },
    {
      id: 'p5',
      image: 'assets/images/p5.jpg',
      firstname: 'Carte 5',
      position: 'Latéral',
      description: 'Cinquième carte du carousel'
    },
    {
      id: 'p6',
      image: 'assets/images/p6.jpg',
      firstname: 'Carte 6',
      position: 'Milieu',
      description: 'Sixième carte du carousel'
    },
    {
      id: 'p7',
      image: 'assets/images/p7.jpg',
      firstname: 'Carte 7',
      position: 'Attaquant',
      description: 'Septième carte du carousel'
    }
  ]);


  ngAfterViewInit(): void {
    // Initialiser Three js
    this.threeEngine.init(this.canvas.nativeElement);
    // Nommer le groupe
    this.carouselGroup.name = 'carousel';
    // Récupérer la scène
    const scene = this.threeEngine.getScene();
    // Ajouter le groupe à la scène
    scene.add(this.carouselGroup);

    this.initializeCarousel();
  }

  ngOnDestroy(): void {
    this.threeEngine.unregisterPlugin(this.animation);
    this.threeEngine.destroy();
  }

  private async initializeCarousel(): Promise<void> {

    const positions = this.layout.calculatePositions(this.items().length, 5);

    for (let index = 0;index < this.items().length;index++) {

      const item = this.items()[index];

      const position = positions[index];

      const card = await this.cardService.createCard(item);

      card.position.set(
        position.x,
        position.y,
        position.z
      );

      card.rotation.y = position.rotationY;

      this.carouselGroup.add(card);

    }

    this.animation.setGroup(this.carouselGroup);

    this.animation.setCardCount(this.items().length);

    this.threeEngine.registerPlugin(this.animation);
  }

}
