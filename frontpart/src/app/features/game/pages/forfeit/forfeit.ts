import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { Games } from '../../data/services/games';
import { Game } from '../../data/models/game.model';

@Component({
  selector: 'app-forfeit',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './forfeit.html',
  styleUrl: './forfeit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Forfeit implements OnInit {
  private readonly gamesStore = inject(Games);

  // ---------------------------------------------------------------------------
  // SELECTORS
  // ---------------------------------------------------------------------------

  /**
   * Liste des matchs déclarés forfaits.
   */
  readonly forfeitedGames = computed<Game[]>(() =>
    this.gamesStore.games().filter((game) => game.forfeit)
  );

  /**
   * Nombre de matchs déclarés forfaits.
   */
  readonly forfeitCount = computed(() =>
    this.forfeitedGames().length
  );

  /**
   * État de chargement.
   */
  readonly loading = this.gamesStore.loading;

  /**
   * Erreur éventuelle.
   */
  readonly error = this.gamesStore.error;

  // ---------------------------------------------------------------------------
  // LIFECYCLE
  // ---------------------------------------------------------------------------

  ngOnInit(): void {
    void this.loadGames();
  }

  // ---------------------------------------------------------------------------
  // PRIVATE
  // ---------------------------------------------------------------------------

  /**
   * Charge les matchs via le store.
   */
  private async loadGames(): Promise<void> {
    try {
      await this.gamesStore.loadGames();
    } catch {
      // L'erreur est déjà gérée par le store.
    }
  }
}
