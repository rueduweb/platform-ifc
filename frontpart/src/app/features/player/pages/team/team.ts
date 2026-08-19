import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { Router } from '@angular/router';

import { CarouselThreed } from '../../../../shared/ui/carousel-threed/carousel-threed';

import { CarouselItem } from '../../../../shared/ui/carousel-threed/models/carousel-item.model';

import { Players } from '../../data/services/players';

import { Player } from '../../data/models/player.model';

import { PlayerCard } from '../../ui/player-card/player-card';

@Component({
  selector: 'app-team',
  imports: [CarouselThreed, PlayerCard],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team implements OnInit {

  private readonly players = inject(Players);

  private readonly router = inject(Router);

  /**
   * false => carousel 3D
   * true  => liste des joueurs
   */
  readonly isList = signal(true);

  /*
   Liste des joueurs exposée au template.
   */
  readonly playerList = computed(() =>
    this.players.players()
  );

  // ===========================================================================
  // CAROUSEL
  // ===========================================================================

  readonly carouselItems = computed<CarouselItem[]>(() => {

    const items = this.players.players().map(player => ({

      id: player.id.toString(),

      image: `assets/images/j${player.id}.jpg`,

      firstname: player.firstname,

      position: player.position,

      nbGame: player.nbGame,

    }));

    return items;
  });

  async ngOnInit(): Promise<void> {

    await this.players.loadPlayers();
  }

  protected toggleView(): void {

    this.isList.update(value => !value);
  }

  protected onAdd(): void {

    this.router.navigate(['/team','player-add']);
  }

  protected onEdit(player: Player): void {

    this.router.navigate(['/team','player-edit', player.id]);
  }

  protected async onDelete(player: Player): Promise<void> {

    const confirmed = window.confirm(`Voulez-vous vraiment supprimer ${player.firstname} ${player.lastname} ?`);

    if (!confirmed) {
      return;
    }

    await this.players.deletePlayer(player.id);
  }

}
