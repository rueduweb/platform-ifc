import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Games } from '../../data/services/games';
import { GameSortColumn } from '../../data/services/games';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-championship',
  imports: [DatePipe],
  templateUrl: './game.html',
  styleUrl: './game.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Game implements OnInit{

  readonly timezone = 'Europe/Paris';
  protected readonly gamesStore = inject(Games);

  // ---------------------------------------------------------------------------
  // STATE / SELECTORS
  // ---------------------------------------------------------------------------

  protected readonly games = this.gamesStore.paginatedGames;
  protected readonly loading = this.gamesStore.loading;
  protected readonly error = this.gamesStore.error;

  protected readonly search = this.gamesStore.search;

  protected readonly page = this.gamesStore.page;
  protected readonly pageSize = this.gamesStore.pageSize;
  protected readonly totalGames = this.gamesStore.totalGames;
  protected readonly totalPages = this.gamesStore.totalPages;

  protected readonly sortColumn = this.gamesStore.sortColumn;
  protected readonly sortDirection = this.gamesStore.sortDirection;

  ngOnInit(): void {
    void this.loadGames();
  }

  // ---------------------------------------------------------------------------
  // CRUD / DATA
  // ---------------------------------------------------------------------------

  private async loadGames(): Promise<void> {
    await this.gamesStore.loadGames();
  }

  // ---------------------------------------------------------------------------
  // SEARCH
  // ---------------------------------------------------------------------------

  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.gamesStore.setSearch(input.value);
  }

  protected clearSearch(): void {
    this.gamesStore.clearSearch();
  }

  // ---------------------------------------------------------------------------
  // SORT
  // ---------------------------------------------------------------------------

  protected sort(column: GameSortColumn): void {
    this.gamesStore.setSort(column);
  }

  protected isSorted(column: GameSortColumn): boolean {
    return this.sortColumn() === column;
  }

  protected sortBy(column: GameSortColumn): void {
    this.gamesStore.setSort(column);
  }

  protected isSortedBy(column: GameSortColumn): boolean {
    return this.gamesStore.sortColumn() === column;
  }

  // ---------------------------------------------------------------------------
  // PAGINATION
  // ---------------------------------------------------------------------------

  protected previousPage(): void {
    this.gamesStore.previousPage();
  }

  protected nextPage(): void {
    this.gamesStore.nextPage();
  }

  protected setPage(page: number): void {
    this.gamesStore.setPage(page);
  }

  protected setPageSize(pageSize: number): void {
    this.gamesStore.setPageSize(pageSize);
  }

  // ---------------------------------------------------------------------------
  // TRACK
  // ---------------------------------------------------------------------------

  protected trackGame(_: number, game: { id: number }): number {
    return game.id;
  }

  // ---------------------------------------------------------------------------
  // AUTH / ACTIONS
  // ---------------------------------------------------------------------------

  /**
   * À remplacer par votre véritable gestionnaire de rôles.
   *
   * Exemple :
   * ADMIN et USER peuvent modifier/supprimer un match.
   */
  protected canManageGames(): boolean {
    return true;
  }


  protected editGame(game: any): void {
    console.log('Modifier le match :', game);

    // TODO :
    // ouvrir votre modal d'édition
    // ou naviguer vers /games/:id/edit
  }

  protected deleteGame(game: any): void {
    console.log('Supprimer le match :', game);

    // TODO :
    // confirmation puis suppression via gamesStore
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.gamesStore.setPageSize(
      Number(select.value),
    );
  }
}
