import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CarouselThreed } from "../../../../shared/ui/carousel-threed/carousel-threed";
import { CarouselItem } from '../../../../shared/ui/carousel-threed/models/carousel-item.model';
import { Players } from '../../data/services/players';

@Component({
  selector: 'app-team',
  imports: [CarouselThreed],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team implements OnInit {

  private readonly players = inject(Players);

  /* readonly carouselItems = computed<CarouselItem[]>(() =>
    this.players.players().map(
      player => ({
        id: player.id.toString(),

        image: `assets/images/j${player.id}.jpg`,

        firstname: player.firstname,

        position: player.position,

        nbGame: player.nbGame
      })
    )
  ); */

  readonly carouselItems =
  computed<CarouselItem[]>(() => {

    const items =
      this.players.players().map(player => ({

        id:
          player.id.toString(),

        image:
          `assets/images/j${player.id}.jpg`,

        firstname:
          player.firstname,

        position:
          player.position,

        nbGame:
          player.nbGame

      }));

    console.log(
      'Players:',
      this.players.players()
    );

    console.log(
      'CarouselItems:',
      items
    );

    return items;

  });


  async ngOnInit(): Promise<void> {

    await this.players.loadPlayers();

  }

}
