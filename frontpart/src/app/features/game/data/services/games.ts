import { computed, inject, Service, signal } from '@angular/core';
import { Game, GamesState } from '../models/game.model';
import { firstValueFrom, Observable } from 'rxjs';

import { CreateGame, GamesApi, UpdateGame } from './games-api';

export type GameSortColumn =
  | 'date'
  | 'gameNum'
  | 'location'
  | 'homeTeam'
  | 'awayTeam'
  | 'nbGoalHome'
  | 'nbGoalAway'
  | 'forfeit';

@Service()
export class Games {
  private readonly gamesApi = inject(GamesApi);

  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  private readonly state = signal<GamesState>({
    games: [],

    loading: false,
    error: null,

    search: '',

    page: 1,
    pageSize: 10,

    sortColumn: 'date',
    sortDirection: 'asc',
  });

  // ---------------------------------------------------------------------------
  // SELECTORS
  // ---------------------------------------------------------------------------

  readonly games = computed(() => this.state().games);

  readonly loading = computed(() => this.state().loading);

  readonly error = computed(() => this.state().error);

  readonly search = computed(() => this.state().search);

  readonly page = computed(() => this.state().page);

  readonly pageSize = computed(() => this.state().pageSize);

  readonly sortColumn = computed(() => this.state().sortColumn);

  readonly sortDirection = computed(() => this.state().sortDirection);

  // ===========================================================================
  // SELECTORS - FILTER / SORT / PAGINATION
  // ===========================================================================

  /* liste filtrée => champ recherche */
  readonly filteredGames = computed(() => {
    const games = this.games();

    const search = this.search()
      .trim()
      .toLowerCase();

    if (!search) {
      return games;
    }

    return games.filter((game) =>
      [
        game.gameNum,
        game.location,
        game.homeTeam,
        game.awayTeam,
        game.note,
      ].some((value) =>
        value.toLowerCase().includes(search)
      )
    );
  });
  /* liste filtrée puis triée */

  readonly sortedGames = computed(() => {
    const games = [...this.filteredGames()];

    const column = this.sortColumn();
    const direction = this.sortDirection();

    games.sort((gameA, gameB) => {
      const valueA = gameA[column];
      const valueB = gameB[column];

      const result = this.compareValues(valueA, valueB);

      return direction === 'asc' ? result : -result;
    });

    return games;
  });

  /* Nombre de match après la recherche et le filtre */
  readonly totalGames = computed(() => this.sortedGames().length);

  /* Nombre total de pages */
  readonly totalPages = computed(() => {
    const pageSize = this.pageSize();

    if (pageSize <= 0) {
      return 0;
    }

    return Math.ceil(this.totalGames() / pageSize);
  });

  /* Liste réellement affichée dans le tableau. */
  readonly paginatedGames = computed(() => {
    const games = this.sortedGames();

    const page = this.page();
    const pageSize = this.pageSize();

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return games.slice(start, end);
  });

  // ---------------------------------------------------------------------------
  // PRIVATE STATE HELPERS
  // ---------------------------------------------------------------------------

  private patchState(patch: Partial<GamesState>): void {
    this.state.update((state) => ({
      ...state,
      ...patch,
    }));
  }

  private updateGames(updater: (games: Game[]) => Game[]): void {
    this.patchState({
      games: updater(this.state().games),
    });
  }

  /* Compare deux valeurs utilisées dans les colonnes du tableau. */
  private compareValues(valueA: unknown, valueB: unknown): number {
    const normalizedA = this.normalizeSortValue(valueA);

    const normalizedB = this.normalizeSortValue(valueB);

    if (normalizedA < normalizedB) {
      return -1;
    }

    if (normalizedA > normalizedB) {
      return 1;
    }

    return 0;
  }

  /* Normalise une valeur avant comparaison. */
  private normalizeSortValue(
    value: unknown
  ): string | number {
    if (value instanceof Date) {
      return value.getTime();
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }

    return String(value ?? '').toLowerCase();
  }

  /* Exécute une requête HTTP sans subscribe(). */
  private async request<T>(request$: Observable<T>, errorMessage: string): Promise<T> {
    this.patchState({
      loading: true,
      error: null,
    });

    try {
      const result = await firstValueFrom(request$);

      this.patchState({
        loading: false,
      });

      return result;
    } catch (error) {
      this.patchState({
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  }

  private resetError(): void {
    this.patchState({
      error: null,
    });
  }

  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  /* Charge tous les matchs depuis l'API. */
  async loadGames(): Promise<void> {
    const games = await this.request(
      this.gamesApi.getAll(),
      'Impossible de charger les matchs.'
    );

    this.patchState({
      games,
      page: 1,
    });
  }
  /* Récupère un match depuis l'API. */
  async getGame(id: number): Promise<Game> {
    return this.request(
      this.gamesApi.getById(id),
      'Impossible de charger le match.'
    );
  }
  /* Crée un match puis l'ajoute au store local. */
  async createGame(game: CreateGame): Promise<Game> {
    const createdGame = await this.request(
      this.gamesApi.create(game),
      'Impossible de créer le match.'
    );

    this.updateGames((games) => [
      ...games,
      createdGame,
    ]);

    return createdGame;
  }
  /* Modifie un match puis synchronise le store local. */
  async updateGame(id: number, changes: UpdateGame): Promise<Game> {
    const updatedGame = await this.request(
      this.gamesApi.update(id, changes),
      'Impossible de modifier le match.'
    );

    this.updateGames((games) =>
      games.map((game) =>
        game.id === id
          ? updatedGame
          : game
      )
    );

    return updatedGame;
  }

  /* Supprime un match puis le retire du store local. */
  async deleteGame(
    id: number
  ): Promise<void> {
    await this.request(
      this.gamesApi.delete(id),
      'Impossible de supprimer le match.'
    );

    this.updateGames((games) =>
      games.filter(
        (game) => game.id !== id
      )
    );

    this.ensureValidPage();

  }
  // ---------------------------------------------------------------------------
  // SEARCH
  // ---------------------------------------------------------------------------

  /* Modifie le texte de recherche. */
  setSearch(search: string): void {
    this.patchState({
      search,
      page: 1,
    });
  }
  /*  Efface la recherche. */
  clearSearch(): void {
    this.patchState({
      search: '',
      page: 1,
    });
  }

  // ---------------------------------------------------------------------------
  // PAGINATION
  // ---------------------------------------------------------------------------

  /* Charge la page courante */
  setPage(page: number): void {
    const totalPages = this.totalPages();

    if (totalPages === 0) {
      this.patchState({
        page: 1,
      });

      return;
    }

    const validPage = Math.min(
      Math.max(page, 1),
      totalPages
    );

    this.patchState({
      page: validPage,
    });
  }
  /* Passe à la page suivante */
  nextPage(): void {
    this.setPage(
      this.page() + 1
    );
  }
  /* Revient à la page précédente */
  previousPage(): void {
    this.setPage(
      this.page() - 1
    );
  }

  /* Modifie le nombre de lignes par page */
  setPageSize(pageSize: number): void {
    if (pageSize <= 0) {
      return;
    }

    this.patchState({
      pageSize,
      page: 1,
    });
  }

  // ---------------------------------------------------------------------------
  // SORT
  // ---------------------------------------------------------------------------

  /* Change la colonne de tri. */
  setSort(column: GameSortColumn): void {
    const currentColumn =
      this.sortColumn();

    const currentDirection =
      this.sortDirection();

    const sortDirection =
      currentColumn === column &&
      currentDirection === 'asc'
        ? 'desc'
        : 'asc';

    this.patchState({
      sortColumn: column,
      sortDirection,
      page: 1,
    });
  }

  // ===========================================================================
  // PRIVATE PAGINATION HELPERS
  // ===========================================================================


  /* Vérifie que la page courante existe toujours.*/
  private ensureValidPage(): void {
    const totalPages = this.totalPages();
    const currentPage = this.page();

    if (totalPages === 0) {
      this.patchState({
        page: 1,
      });

      return;
    }

    if (currentPage > totalPages) {
      this.patchState({
        page: totalPages,
      });
    }
  }

}
