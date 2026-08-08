import { Component, signal } from '@angular/core';
import { CarouselThreed } from "../../shared/ui/carousel-threed/carousel-threed";

@Component({
  selector: 'app-team',
  imports: [CarouselThreed],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team {

  carouselItems = signal<string[]>([
    'assets/images/p1.jpg',
    'assets/images/p2.jpg',
    'assets/images/p3.jpg',
    'assets/images/p4.jpg',
    'assets/images/p5.jpg',
    'assets/images/p6.jpg',
    'assets/images/p7.jpg'
  ]);
}
