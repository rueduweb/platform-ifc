import { HttpErrorResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import {
  AddRegulPieceRequest,
  CreateRegulRequest,
  Regul,
  UpdateRegulPieceRequest,
  REGUL_MAX_PIECES,
  REGUL_MAX_TOTAL,
  REGUL_MIN_PIECE_AMOUNT,
} from '../models/regul.model';

import { RegulApi } from './regul-api';

@Service()
export class RegulService {
  private readonly api = inject(RegulApi);

  // ---------------------------------------------------------------------------
  // Lecture
  // ---------------------------------------------------------------------------

  async getAll(): Promise<Regul[]> {
    return firstValueFrom(
      this.api.getAll(),
    );
  }

  async getById(id: number): Promise<Regul> {
    return firstValueFrom(
      this.api.getById(id),
    );
  }

  async getByLicence(
    license: string,
  ): Promise<Regul | null> {
    try {
      return await firstValueFrom(
        this.api.getByLicense(license),
      );
    } catch (error) {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 404
      ) {
        return null;
      }

      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  // Création d'un Regul
  // ---------------------------------------------------------------------------

  async create(
    license: string,
    amount: number | null,
  ): Promise<Regul> {
    if (amount !== null) {
      this.validatePieceAmount(amount);
    }

    const payload: CreateRegulRequest = {
      license,
      ...(amount !== null
        ? { amount }
        : {}),
    };

    return firstValueFrom(
      this.api.create(payload),
    );
  }

  // ---------------------------------------------------------------------------
  // Suppression d'un Regul
  // ---------------------------------------------------------------------------

  async delete(id: number): Promise<void> {
    await firstValueFrom(
      this.api.delete(id),
    );
  }

  // ---------------------------------------------------------------------------
  // Ajout d'une pièce
  // ---------------------------------------------------------------------------

  async addPiece(
    regul: Regul,
    amount: number,
  ): Promise<Regul> {
    this.validatePieceAmount(amount);

    // Nombre maximum de pièces
    if (regul.items.length >= REGUL_MAX_PIECES) {
      throw new Error(
        `Un règlement ne peut pas contenir plus de ${REGUL_MAX_PIECES} paiements.`,
      );
    }

    // Vérification du nouveau total
    const newTotal = regul.total + amount;

    if (newTotal > REGUL_MAX_TOTAL) {
      throw new Error(
        `Le total d'un règlement ne peut pas dépasser ${REGUL_MAX_TOTAL} €.`,
      );
    }

    const payload: AddRegulPieceRequest = {
      amount,
    };

    return firstValueFrom(
      this.api.addPiece(
        regul.id,
        payload,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Modification d'une pièce
  // ---------------------------------------------------------------------------

  async updatePiece(
    regul: Regul,
    pieceId: number,
    amount: number,
  ): Promise<Regul> {
    // Validation du nouveau montant
    this.validatePieceAmount(amount);

    // Recherche de la pièce existante
    const piece = regul.items.find(
      (item) => item.id === pieceId,
    );

    if (!piece) {
      throw new Error(
        `La pièce ${pieceId} n'appartient pas au règlement ${regul.id}.`,
      );
    }

    /*
     * Le total actuel contient déjà le montant actuel de la pièce.
     *
     * Exemple :
     *
     * total actuel = 150 €
     * pièce actuelle = 50 €
     * nouveau montant = 80 €
     *
     * nouveau total =
     *   150 - 50 + 80
     * = 180 €
     */
    const newTotal = regul.total - piece.amount + amount;

    if (newTotal > REGUL_MAX_TOTAL) {
      throw new Error(
        `Le total d'un règlement ne peut pas dépasser ${REGUL_MAX_TOTAL} €.`,
      );
    }

    const payload: UpdateRegulPieceRequest = {
      amount,
    };

    /*
     * Le backend est responsable de :
     *
     * - modifier amount
     * - mettre à jour date
     * - recalculer total
     *
     * Le Regul complet retourné par l'API devient ensuite
     * la nouvelle source de vérité du store.
     */
    return firstValueFrom(
      this.api.updatePiece(
        regul.id,
        pieceId,
        payload
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation commune des montants
  // ---------------------------------------------------------------------------

  private validatePieceAmount(
    amount: number,
  ): void {
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
