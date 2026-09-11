import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import {
  AddRegulPieceRequest,
  CreateRegulRequest,
  Regul,
  UpdateRegulRequest,
  REGUL_MAX_PIECES,
  REGUL_MAX_TOTAL,
  REGUL_MIN_PIECE_AMOUNT,
} from '../models/regul.model';

import { RegulApi } from './regul-api';

@Service()
export class RegulService {
  private readonly api = inject(RegulApi);

  async getAll(): Promise<Regul[]> {
    return firstValueFrom(this.api.getAll());
  }

  async getById(id: number): Promise<Regul> {
    return firstValueFrom(this.api.getById(id));
  }

  async getByLicence(licence: string): Promise<Regul | null> {
    return firstValueFrom(this.api.getByLicence(licence));
  }

  async create(
    license: string,
    amount: number,
  ): Promise<Regul> {
    this.validatePieceAmount(amount);

    const payload: CreateRegulRequest = {
      license,
      amount,
    };

    return firstValueFrom(this.api.create(payload));
  }

  async update(
    id: number,
    license: string,
  ): Promise<Regul> {
    const payload: UpdateRegulRequest = {
      license,
    };

    return firstValueFrom(this.api.update(id, payload));
  }

  async delete(id: number): Promise<void> {
    await firstValueFrom(this.api.delete(id));
  }

  async addPiece(
    regul: Regul,
    amount: number,
  ): Promise<Regul> {
    this.validatePieceAmount(amount);

    if (regul.items.length >= REGUL_MAX_PIECES) {
      throw new Error(
        `Un règlement ne peut pas contenir plus de ${REGUL_MAX_PIECES} paiements.`,
      );
    }

    if (regul.total + amount > REGUL_MAX_TOTAL) {
      throw new Error(
        `Le total d'un règlement ne peut pas dépasser ${REGUL_MAX_TOTAL} €.`,
      );
    }

    const payload: AddRegulPieceRequest = {
      amount,
    };

    return firstValueFrom(
      this.api.addPiece(regul.id, payload),
    );
  }

  private validatePieceAmount(amount: number): void {
    if (
      !Number.isInteger(amount) ||
      amount < REGUL_MIN_PIECE_AMOUNT ||
      amount > REGUL_MAX_TOTAL
    ) {
      throw new Error(
        `Le montant doit être un entier compris entre ${REGUL_MIN_PIECE_AMOUNT} et ${REGUL_MAX_TOTAL} €.`,
      );
    }
  }
}

