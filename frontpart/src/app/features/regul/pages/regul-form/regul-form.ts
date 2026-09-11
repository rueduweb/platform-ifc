import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  form,
  FormField,
  FormRoot,
  max,
  min,
  required,
  validate,
} from '@angular/forms/signals';

import {
  REGUL_MAX_PIECES,
  REGUL_MAX_TOTAL,
  REGUL_MIN_PIECE_AMOUNT,
  Regul,
} from '../../data/models/regul.model';

import { Router } from '@angular/router';

import { RegulFormModel } from '../../data/models/regul-form.model';

const INITIAL_REGUL_FORM_MODEL: RegulFormModel = {
  license: '',
  date: null,
  amount: null,
};

@Component({
  selector: 'app-regul-form',
  standalone: true,
  imports: [FormField, FormRoot],
  templateUrl: './regul-form.html',
  styleUrl: './regul-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegulForm {

  private readonly router = inject(Router);

  readonly REGUL_MAX_TOTAL = REGUL_MAX_TOTAL;

  readonly REGUL_MAX_PIECES = REGUL_MAX_PIECES;
  readonly REGUL_MIN_PIECE_AMOUNT = REGUL_MIN_PIECE_AMOUNT;

  /*
   Régularisation existante lorsqu'on ajoute une nouvelle pièce.

   null = nouvelle régularisation.
   */
  readonly regul = input<Regul | null>(null);

  /**
   * Événement émis lorsque l'utilisateur annule.
   */
  cancel(): void {
    this.model.set({
      ...INITIAL_REGUL_FORM_MODEL,
    });

    void this.router.navigate(['/manage-license']);
  }

  /**
   * Modèle source de vérité du Signal Form.
   */
  readonly model = signal<RegulFormModel>({ ...INITIAL_REGUL_FORM_MODEL, });

  /**
   * Total des pièces déjà enregistrées.
   */
  readonly previousTotal = computed(() => {
    return this.regul()?.items.reduce(
      (total, item) => total + item.amount,
      0,
    ) ?? 0;
  });

  /**
   * Nombre de pièces déjà enregistrées.
   */
  readonly previousPiecesCount = computed(() => {
    return this.regul()?.items.length ?? 0;
  });

  /**
   * Total affiché :
   *
   * pièces précédentes + pièce actuellement saisie.
   */
  readonly total = computed(() => {
    return this.previousTotal() + (this.model().amount ?? 0);
  });

  /**
   * Signal Form Angular 22.
   */
  readonly regulForm = form(this.model, (schema) => {

    required(schema.license, {
      message: 'La licence est obligatoire.',
    });

    required(schema.date, {
      message: 'La date est obligatoire.',
    });

    required(schema.amount, {
      message: 'Le montant est obligatoire.',
    });

    min(schema.amount, REGUL_MIN_PIECE_AMOUNT, {
      message: `Le montant doit être au minimum de ${REGUL_MIN_PIECE_AMOUNT}.`,
    });

    max(schema.amount, REGUL_MAX_TOTAL, {
      message: `Le montant ne peut pas dépasser ${REGUL_MAX_TOTAL}.`,
    });

    /**
     * Validation du total global.
     *
     * Le montant saisi peut être valide individuellement
     * mais rendre le total supérieur à 45.
     */
    validate(schema.amount, ({ value }) => {
      const amount = value();

      if (amount === null) {
        return null;
      }

      if (this.previousTotal() + amount > REGUL_MAX_TOTAL) {
        return {
          kind: 'maxRegulTotal',
          message: `Le total ne peut pas dépasser ${REGUL_MAX_TOTAL}.`,
        };
      }

      return null;
    });

    /**
     * Maximum de pièces.
     */
    validate(schema.amount, () => {
      if (this.previousPiecesCount() >= REGUL_MAX_PIECES) {
        return {
          kind: 'maxRegulPieces',
          message: `Une régularisation ne peut pas contenir plus de ${REGUL_MAX_PIECES} pièces.`,
        };
      }

      return null;
    });
  },
  {
    submission: {
      action: async (form) => {
        console.log('SUBMIT');
        console.log('Form value:', form().value());
        console.log('Model value:', this.model());

        return undefined;
      },
    },
  });
}

