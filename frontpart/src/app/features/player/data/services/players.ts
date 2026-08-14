import {Service, computed, inject, signal} from '@angular/core';

import { Observable, firstValueFrom } from 'rxjs';

import { PlayersApi } from './players-api';
import { Player, PlayersState } from '../models/player.model';

@Service()
export class Players {
  private readonly api = inject(PlayersApi);

  // =====================================================================
  // STATE
  // =====================================================================

  private readonly state = signal<PlayersState>({
    players: [],
    loading: false,
    error: null
  });

  // =====================================================================
  // SELECTORS
  // =====================================================================

  readonly players = computed(() => this.state().players);

  readonly loading = computed(() => this.state().loading);

  readonly error = computed(() => this.state().error);

  // =====================================================================
  // PRIVATE STATE UPDATE
  // =====================================================================

  private patchState(patch: Partial<PlayersState>): void {
    this.state.update(state => ({
      ...state,
      ...patch
    }));
  }

  // =====================================================================
  // PRIVATE REQUEST
  // =====================================================================

  private async request<T>(request$: Observable<T>, onSuccess: (result: T) => void, errorMessage: string): Promise<void> {

    this.patchState({
      loading: true,
      error: null
    });

    try {

      const result = await firstValueFrom(request$);

      onSuccess(result);

      this.patchState({
        loading: false
      });

    } catch (error) {

      console.error(error);

      this.patchState({
        loading: false,
        error: errorMessage
      });
    }
  }

  // =====================================================================
  // PUBLIC METHODS
  // =====================================================================

  async loadPlayers(): Promise<void> {

    await this.request(
      this.api.getPlayers(),

      players => {
        this.patchState({
          players
        });
      },

      'Impossible de charger les joueurs.'
    );

  }

  async getPlayer(id: number,): Promise<Player | null> {

    let player: Player | null = null;

    await this.request(this.api.getPlayer(id),

      result => {

        player = result;

        this.upsertPlayer(result);
      },

      `Impossible de charger le joueur ${id}.`,
    );

    return player;
  }

  async addPlayer(player: Omit<Player, 'id'>): Promise<Player | null> {

    let createdPlayer: Player | null = null;

    await this.request(
      this.api.createPlayer(player),

      player => {
        createdPlayer = player;

        this.upsertPlayer(player);
      },

      'Impossible de créer le joueur.'
    );

    return createdPlayer;
  }


  async updatePlayer(id: number, changes: Partial<Omit<Player, 'id'>>): Promise<Player | null> {

    let updatedPlayer: Player | null = null;

    await this.request(
      this.api.updatePlayer(id, changes),

      player => {
        updatedPlayer = player;

        this.upsertPlayer(player);
      },

      'Impossible de modifier le joueur.'
    );

    return updatedPlayer;
  }


  async deletePlayer(id: number): Promise<void> {

    await this.request(
      this.api.deletePlayer(id),

      () => {

        this.patchState({
          players: this.state().players.filter(
            player => player.id !== id
          )
        });

      },

      `Impossible de supprimer le joueur ${id}.`
    );

  }

  // Eviter les doublons - UPSERT
  private upsertPlayer(player: Player): void {

    const players = this.state().players;

    const exists = players.some(current => current.id === player.id);

    if (exists) {

      this.patchState({
        players: players.map(current => current.id === player.id ? player : current)
      });

      return;
    }

    this.patchState({
      players: [
        ...players,
        player
      ]
    });

  }

}
