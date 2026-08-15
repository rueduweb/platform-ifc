import { computed, inject, Service, signal } from '@angular/core';

import { firstValueFrom } from 'rxjs';
import type { Observable } from 'rxjs';

import { PartnersApi } from '../services/partner-api';

import type { Partner, PartnersState } from '../models/partner.model';
import type {
  CreatePartnerDto,
  UpdatePartnerDto
} from '../models/partner-dto.model';

const initialState: PartnersState = {
  partners: [],
  loading: false,
  error: null,
};

@Service()
export class Partners {

  private readonly api = inject(PartnersApi);

  /*
   Source unique de vérité. SIGNAL
   */
  private readonly state = signal<PartnersState>(initialState);

  /*
   Etat exposé en lecture seule. COMPUTED
   */
  readonly partners = computed(() => this.state().partners);

  readonly loading = computed(() => this.state().loading);

  readonly error = computed(() => this.state().error);

  readonly count = computed(() => this.state().partners.length);

  /*
   Equivalent minimal de patchState() inspiré de @ngrx/signals.
   */
  private patchState(patch: Partial<PartnersState>): void {
    this.state.update(current => ({
      ...current,
      ...patch,
    }));
  }

  /*
    Centralise toutes les modifications du tableau partners.
   */
  private updatePartners(updater: (partners: Partner[]) => Partner[]): void {
    this.state.update(current => ({
      ...current,
      partners: updater(current.partners),
    }));
  }

  /*
    Gestion commune des requêtes HTTP.
    Aucun subscribe() dans le store.
   */
  private async request<T>(request$: Observable<T>): Promise<T | null> {
    this.patchState({
      loading: true,
      error: null,
    });

    try {
      const result = await firstValueFrom(request$);

      return result;
    } catch (error) {
      this.patchState({
        error: this.getErrorMessage(error),
      });

      return null;
    } finally {
      this.patchState({
        loading: false,
      });
    }
  }

  /*
    GET /partners
   */
  async load(): Promise<void> {
    const partners = await this.request(
      this.api.getAll(),
    );

    if (partners === null) {
      return;
    }

    this.patchState({
      partners,
    });
  }

  /*
    GET /partners/:id
   */
  async getById(id: number): Promise<Partner | null> {
    return this.request(
      this.api.getById(id),
    );
  }

  /*
    POST /partners
   */
  async create(dto: CreatePartnerDto): Promise<Partner | null> {
    const partner = await this.request(
      this.api.create(dto),
    );

    if (partner === null) {
      return null;
    }

    this.updatePartners(
      partners => [
        ...partners,
        partner,
      ],
    );

    return partner;
  }

  /*
    PATCH /partners/:id
   */
  async update(id: number, dto: UpdatePartnerDto): Promise<Partner | null> {
    const partner = await this.request(
      this.api.update(id, dto),
    );

    if (partner === null) {
      return null;
    }

    this.updatePartners(
      partners =>
        partners.map(current =>
          current.id === id
            ? partner
            : current,
        ),
    );

    return partner;
  }

  /*
    DELETE /partners/:id
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.request(
      this.api.delete(id),
    );

    if (result === null) {
      return false;
    }

    this.updatePartners(
      partners =>
        partners.filter(
          partner => partner.id !== id,
        ),
    );

    return true;
  }

  private getErrorMessage(error: unknown): string {
    if (
      error instanceof Error
    ) {
      return error.message;
    }

    return 'Une erreur est survenue.';
  }
}

