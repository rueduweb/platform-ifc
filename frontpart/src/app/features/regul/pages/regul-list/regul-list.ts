import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import { Router } from '@angular/router';

import { RegulStore } from '../../data/state/regul.store';
import {
  REGUL_MAX_PIECES,
  REGUL_MAX_TOTAL,
  Regul,
} from '../../data/models/regul.model';
import { Auth } from '../../../auth/data/services/auth';

@Component({
  selector: 'app-regul-list',
  imports: [],
  templateUrl: './regul-list.html',
  styleUrl: './regul-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegulList {

  private readonly router = inject(Router);
  readonly regulStore = inject(RegulStore);
  protected readonly auth = inject(Auth);

  readonly REGUL_MAX_PIECES = REGUL_MAX_PIECES;
  readonly REGUL_MAX_TOTAL = REGUL_MAX_TOTAL;

  readonly pageSize = 10;
  readonly currentPage = signal(1);

  readonly totalItems = computed(() =>
    this.regulStore.entities().length,
  );

  readonly totalPages = computed(() =>
    Math.max(
      1,
      Math.ceil(
        this.totalItems() / this.pageSize,
      ),
    ),
  );

  readonly paginatedReguls = computed(() => {
    const page = this.currentPage();

    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    return this.regulStore.entities().slice(start, end);
  });

  readonly pages = computed(() => {
    const totalPages = this.totalPages();

    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  });

  constructor() {
    void this.regulStore.load();

    effect(() => {
      const totalPages = this.totalPages();

      if (this.currentPage() > totalPages) {
        this.currentPage.set(totalPages);
      }
    });
  }

  newRegul(): void {
    this.regulStore.select(null);

    void this.router.navigate([
      '/manage-license/regul',
    ]);
  }

  editRegul(regul: Regul): void {
    this.regulStore.select(regul.id);

    void this.router.navigate([
      '/manage-license/regul',
    ]);
  }

  async deleteRegul(id: number): Promise<void> {
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir supprimer cette régulation ?',
    );

    if (!confirmed) {
      return;
    }

    await this.regulStore.delete(id);

    /* TODO
    const success = await this.regulStore.delete(id);
    if (success) {
      si éventuellement toast/snackbar
    }*/
  }


  goToPage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages() ||
      page === this.currentPage()
    ) {
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

  totalClass(regul: Regul): string {
    const total = regul.total;

    if (total >= REGUL_MAX_TOTAL) {
      return 'total--complete';
    }

    if (total >= REGUL_MAX_TOTAL / 2) {
      return 'total--warning';
    }

    return 'total--normal';
  }

  formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('fr-FR').format(
      new Date(date),
    );
  }

  trackById(
    _index: number,
    regul: Regul,
  ): number {
    return regul.id;
  }
}

