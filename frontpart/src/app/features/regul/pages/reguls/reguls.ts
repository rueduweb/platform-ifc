import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { RegulsStore } from '../../data/state/reguls.store';
import { Auth } from '../../../auth/data/services/auth';

@Component({
  selector: 'app-reguls',
  imports: [DatePipe],
  templateUrl: './reguls.html',
  styleUrl: './reguls.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reguls {
  readonly store = inject(RegulsStore);
  readonly auth = inject(Auth);
  readonly router = inject(Router);

  // Nombre de régularisations affichées par page
  readonly pageSize = 6;

  readonly currentPage = signal(1);

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.store.reguls().length / this.pageSize))
  );

  readonly paginatedReguls = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;

    return this.store.reguls().slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    // Petit nombre de pages : on les affiche toutes.
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Fenêtre autour de la page courante.
    if (current <= 4) {
      return [1, 2, 3, 4, 5, -1, total];
    }

    if (current >= total - 3) {
      return [1, -1, total - 4, total - 3, total - 2, total - 1, total];
    }

    return [
      1,
      -1,
      current - 1,
      current,
      current + 1,
      -1,
      total,
    ];
  });

  constructor() {
    this.store.loadReguls();
  }

  newRegul(): void {
    void this.router.navigate(['/manage-license', 'regul']);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);
  }

  previousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  /**
   * Retourne la pièce correspondant à la colonne 1/2/3/4 fois.
   */
  getItem(regul: any, index: number): any | null {
    return regul.items?.[index] ?? null;
  }

  /**
   * Couleur métier du total.
   *
   * Règles :
   * - 45 => vert
   * - >= 28 => orange
   * - sinon => couleur neutre
   */
  getTotalClass(total: number): string {
    if (total === 45) {
      return 'total--green';
    }

    if (total >= 28) {
      return 'total--orange';
    }

    return 'total--default';
  }

  getTotalBadgeClass(total: number): string {
    if (total === 45) {
      return 'total-badge--green';
    }

    if (total >= 28) {
      return 'total-badge--orange';
    }

    return 'total-badge--default';
  }

  // redirection vers le formulaire de Régul
  protected goToForm(regulId: number): void {
    void this.router.navigate(['/manage-license/regul', regulId, 'edit']);
  }
}
