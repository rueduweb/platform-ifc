import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
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
} from '../../data/models/regul.model';

import { Router } from '@angular/router';

import { RegulFormModel } from '../../data/models/regul-form.model';
import { RegulStore } from '../../data/state/regul.store';


const INITIAL_REGUL_FORM_MODEL: RegulFormModel = {
  license: '',
  amount: null,
};


@Component({
  selector: 'app-regul-form',
  imports: [FormField, FormRoot],
  templateUrl: './regul-form.html',
  styleUrl: './regul-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegulForm {

  private readonly router = inject(Router);
  private readonly regulStore = inject(RegulStore);

  readonly regul = this.regulStore.selectedRegul;

  readonly REGUL_MAX_TOTAL = REGUL_MAX_TOTAL;
  readonly REGUL_MAX_PIECES = REGUL_MAX_PIECES;
  readonly REGUL_MIN_PIECE_AMOUNT = REGUL_MIN_PIECE_AMOUNT;


  /* ========================================================
     MODEL
     ======================================================== */

  readonly model = signal<RegulFormModel>({
    ...INITIAL_REGUL_FORM_MODEL,
  });


  /* ========================================================
     SYNCHRONISATION AVEC selectedRegul
     ======================================================== */

  constructor() {

    effect(() => {

      const regul = this.regul();

      /*
       * Pas de régularisation sélectionnée :
       * on est en mode création.
       *
       * Le formulaire doit donc être vide.
       */
      if (regul === null) {

        this.resetModel();

        return;
      }


      /*
       * Une régularisation est sélectionnée :
       * on est en mode ajout / édition.
       *
       * On conserve la licence mais on commence
       * avec un montant vide.
       */

      this.model.set({
        license: regul.license,
        amount: null,
      });

    });
  }


  /* ========================================================
     HELPERS FORMULAIRE
     ======================================================== */

  private resetModel(): void {

    this.model.set({
      ...INITIAL_REGUL_FORM_MODEL,
    });

  }


  /* ========================================================
     DONNÉES EXISTANTES
     ======================================================== */

  readonly previousTotal = computed(() => {

    return this.regul()?.items.reduce(
      (total, item) => total + item.amount,
      0,
    ) ?? 0;

  });


  readonly previousPiecesCount = computed(() => {

    return this.regul()?.items.length ?? 0;

  });


  readonly total = computed(() => {

    return (
      this.previousTotal()
      + (this.model().amount ?? 0)
    );

  });


  /* ========================================================
     ANNULATION / SORTIE
     ======================================================== */

  cancel(): void {

    /*
     * 1. On nettoie le formulaire
     */
    this.resetModel();


    /*
     * 2. On supprime la régularisation sélectionnée
     */
    this.regulStore.clearSelection();


    /*
     * 3. On quitte le formulaire
     */
    void this.router.navigate([
      '/manage-license',
    ]);

  }


  /* ========================================================
     FORMULAIRE
     ======================================================== */

  readonly regulForm = form(
    this.model,

    (schema) => {

      /* ----------------------------------------------------
         LICENCE
         ---------------------------------------------------- */

      required(schema.license, {
        message: 'La licence est obligatoire.',
      });


      /* ----------------------------------------------------
         MONTANT OBLIGATOIRE
         ---------------------------------------------------- */

      validate(schema.amount, ({ value }) => {

        /*
         * En création, le montant peut rester vide
         * tant que la licence n'a pas encore permis
         * de créer la régularisation.
         */

        if (this.regul() === null) {
          return null;
        }


        if (value() === null) {

          return {
            kind: 'requiredPieceAmount',
            message:
              'Le montant de la pièce est obligatoire.',
          };

        }

        return null;
      });


      /* ----------------------------------------------------
         MONTANT MINIMUM
         ---------------------------------------------------- */

      min(
        schema.amount,
        REGUL_MIN_PIECE_AMOUNT,
        {
          message:
            `Le montant doit être au minimum de ${REGUL_MIN_PIECE_AMOUNT}.`,
        },
      );


      /* ----------------------------------------------------
         MONTANT MAXIMUM
         ---------------------------------------------------- */

      max(
        schema.amount,
        REGUL_MAX_TOTAL,
        {
          message:
            `Le montant ne peut pas dépasser ${REGUL_MAX_TOTAL}.`,
        },
      );


      /* ----------------------------------------------------
         TOTAL MAXIMUM
         ---------------------------------------------------- */

      validate(schema.amount, ({ value }) => {

        const amount = value();

        if (amount === null) {
          return null;
        }


        if (
          this.previousTotal() + amount
          > REGUL_MAX_TOTAL
        ) {

          return {
            kind: 'maxRegulTotal',
            message:
              `Le total ne peut pas dépasser ${REGUL_MAX_TOTAL}.`,
          };

        }

        return null;
      });


      /* ----------------------------------------------------
         NOMBRE MAXIMUM DE PIÈCES
         ---------------------------------------------------- */

      validate(schema.amount, () => {

        if (
          this.previousPiecesCount()
          >= REGUL_MAX_PIECES
        ) {

          return {
            kind: 'maxRegulPieces',
            message:
              `Une régularisation ne peut pas contenir plus de ${REGUL_MAX_PIECES} pièces.`,
          };

        }

        return null;
      });

    },

    /* ======================================================
       SUBMISSION
       ====================================================== */

    {
      submission: {

        action: async (form) => {

          console.log('🔥 1 - SUBMISSION REGUL');

          const value = form().value();

          console.log('🔥 2 - VALUE:', value);

          if (!value.license || value.amount === null) {
            console.log('🔥 3 - VALUE INVALIDE');
            return;
          }

          console.log('🔥 4 - AVANT addRegul');

          const regul = await this.regulStore.addRegul(
            value.license,
            value.amount,
          );

          console.log('🔥 5 - APRÈS addRegul', regul);

          if (regul === null) {
            console.log('🔥 6 - addRegul a retourné null');
            return;
          }

          console.log('🔥 7 - RÉGUL ENREGISTRÉE', regul);
        },

      },
    },
  );
}
