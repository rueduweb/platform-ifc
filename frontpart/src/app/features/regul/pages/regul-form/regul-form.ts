import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import {
  REGUL_MAX_PIECES,
  REGUL_MIN_PIECE_AMOUNT,
  REGUL_MAX_TOTAL
} from '../../data/models/regul.model';
import { RegulFormModel } from '../../data/models/regul-form.model';
import {
  applyEach,
  form, FormField,
  min, max,
  required, validate } from '@angular/forms/signals';
import { inject } from '@angular/core';
import { RegulsStore } from '../../data/state/reguls.store';

const INITIAL_REGUL_FORM_MODEL: RegulFormModel = {
  license: '',
  items: [
    {
      amount: null
    }
  ],
};

@Component({
  selector: 'app-regul-form',
  imports: [FormField],
  templateUrl: './regul-form.html',
  styleUrl: './regul-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegulForm {
  readonly REGUL_MAX_TOTAL = REGUL_MAX_TOTAL;

  readonly store = inject(RegulsStore);

  readonly route = inject(ActivatedRoute);

  readonly router = inject(Router);

  readonly regulId = signal<number | null>(null);

  readonly originalItems = signal<
    {
      id: number;
      amount: number;
    }[]
  >([]);


  readonly isEditMode = computed(
    () => this.regulId() !== null,
  );

  private readonly createSuccessEffect = effect(() => {
    if (this.store.createSuccess()) {
      void this.router.navigate(['/manage-license']);
    }
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== null) {
      const regulId = Number(id);

      this.regulId.set(regulId);

      console.log('regulId:', this.regulId());
      console.log('isEditMode:', this.isEditMode());

      this.store.loadRegul(regulId);
    }
  }

  private readonly regulEffect = effect(() => {
    const regul = this.store.regul();

    if (!regul) {
      return;
    }

    this.originalItems.set(
      regul.items.map((item) => ({
        id: item.id,
        amount: item.amount,
      })),
    );

    console.log('Original items:', this.originalItems());

    this.model.set({
      license: regul.license,
      items: regul.items.map((item) => ({
        id: item.id,
        amount: item.amount,
      })),
    });
  });

  readonly deletedItemIds = computed(() => {
    const originalIds = this.originalItems().map((item) => item.id);

    const currentIds = this.model().items
      .filter((item) => item.id !== undefined)
      .map((item) => item.id);

    return originalIds.filter(
      (id) => !currentIds.includes(id),
    );
  });

  readonly model = signal<RegulFormModel>(INITIAL_REGUL_FORM_MODEL);

  readonly regulForm = form(this.model, (schema) => {
    required(schema.license, {
      message: 'La licence est obligatoire.'
    });

    applyEach(schema.items, (item) => {
      validate(item.amount, ({ value }) => {
        const amount = value();

        if (amount === null) {
          return null;
        }

        if (amount < REGUL_MIN_PIECE_AMOUNT) {
          return {
            kind: 'minimum-amount',
            message: `Le montant doit être supérieur ou égal à ${REGUL_MIN_PIECE_AMOUNT}.`,
          };
        }

        return null;
      });
    });

    validate(schema, ({ value }) => {
      const total = value().items.reduce(
        (sum, item) => sum + (item.amount ?? 0),
        0
      );

      if (total > REGUL_MAX_TOTAL) {
        return {
          kind: 'maximum-total',
          message: `Le total ne peut pas dépasser ${REGUL_MAX_TOTAL}.`,
        };
      }

      return null;
    });
  });

  /* LES COMPUTEDs (dérivées du signalForm)  */
  // le total est toujours une projection du modèle courant.
  readonly total = computed(() =>
    this.model().items.reduce(
      (total, item) => total + (item.amount ?? 0),
      0
    )
  );

  /* LE SUBMIT */
  submit(event: Event): void {
    event.preventDefault();
    console.log('SUBMIT REGUL FORM');
    if (this.regulForm().invalid()) {
      return;
    }

    console.log('Original items:', this.originalItems());
    console.log('Current items:', this.model().items);
    console.log('Deleted item IDs:', this.deletedItemIds());

    if (this.isEditMode()) {
      this.updateRegul();
      return;
    }

    this.store.createRegulWithPieces(this.model());
  }

  private updateRegul(): void {
    const regulId = this.regulId();

    if (regulId === null) {
      return;
    }

    this.store.updateRegulWithPieces({
      regulId,
      items: this.model().items,
    });
  }


  /* LE CANCEL */
  cancel(): void {
    void this.router.navigate(['/manage-license']);
  }

  /* LES FONCTIONS UTILES */
  addItem(): void {
    if (this.model().items.length >= REGUL_MAX_PIECES) {
      return;
    }

    this.model.update((model) => ({
      ...model,
      items: [
        ...model.items,
        {
          amount: null
        }
      ]
    }));
  }

  removeItem(index: number): void {
    if (this.model().items.length <= 1) {
      return;
    }

    this.model.update((model) => ({
      ...model,
      items: model.items.filter((_, i) => i !== index),
    }));
  }

}
