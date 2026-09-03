import { computed, inject } from '@angular/core';

import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import {
  addEntity,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';

import {
  REGUL_MAX_PIECES,
  REGUL_MAX_TOTAL,
  Regul,
} from '../models/regul.model';

import { RegulService } from '../services/regul';

type RegulState = {
  loading: boolean;
  error: string | null;
  selectedRegulId: number | null;
};

const initialState: RegulState = {
  loading: false,
  error: null,
  selectedRegulId: null,
};

export const RegulStore = signalStore(
  withEntities<Regul>(),

  withState(initialState),

  withComputed((store) => ({
    selectedRegul: computed(() => {
      const id = store.selectedRegulId();

      if (id === null) {
        return null;
      }

      return (
        store.entities().find(
          (regul) => regul.id === id,
        ) ?? null
      );
    }),

    totalAmount: computed(() =>
      store.entities().reduce(
        (total, regul) => total + regul.total,
        0,
      ),
    ),

    remainingAmount: computed(() => {
      const regul = store.entities().find(
        (item) => item.id === store.selectedRegulId(),
      );

      if (!regul) {
        return REGUL_MAX_TOTAL;
      }

      return REGUL_MAX_TOTAL - regul.total;
    }),

    canAddPiece: computed(() => {
      const regul = store.entities().find(
        (item) => item.id === store.selectedRegulId(),
      );

      if (!regul) {
        return true;
      }

      return (
        regul.items.length < REGUL_MAX_PIECES &&
        regul.total < REGUL_MAX_TOTAL
      );
    }),
  })),


  withMethods((store, regulService = inject(RegulService)) => ({
    async load(): Promise<void> {
      patchState(store, {
        loading: true,
        error: null
      });

      try {
        const regulations = await regulService.getAll();

        patchState(store, setAllEntities(regulations), {
          loading: false
        });
      } catch (error) {
        patchState(store, {
          loading: false,
          error: getErrorMessage(error)
        });
      }
    },

    async loadOne(id: number): Promise<void> {
      patchState(store, {
        loading: true,
        error: null,
      });

      try {
        const regul = await regulService.getById(id);

        patchState(
          store,
          updateEntity({
            id: regul.id,
            changes: regul,
          }),
          {
            loading: false,
            selectedRegulId: regul.id,
          },
        );
      } catch (error) {
        patchState(store, {
          loading: false,
          error: getErrorMessage(error),
        });
      }
    },

    async selectByLicence(
      licence: string,
    ): Promise<Regul | null> {
      patchState(store, {
        loading: true,
        error: null,
      });

      try {
        const regul =
          await regulService.getByLicence(licence);

        if (regul) {
          patchState(
            store,
            updateEntity({
              id: regul.id,
              changes: regul,
            }),
            {
              selectedRegulId: regul.id,
              loading: false,
            },
          );
        } else {
          patchState(store, {
            selectedRegulId: null,
            loading: false,
          });
        }

        return regul;
      } catch (error) {
        patchState(store, {
          loading: false,
          error: getErrorMessage(error),
        });

        return null;
      }
    },

    async addPayment(
      licence: string,
      amount: number,
    ): Promise<Regul | null> {
      patchState(store, {
        loading: true,
        error: null,
      });

      try {
        const existing =
          await regulService.getByLicence(licence);

        let regul: Regul;

        if (!existing) {
          regul = await regulService.create(
            licence,
            amount,
          );

          patchState(
            store,
            addEntity(regul),
            {
              selectedRegulId: regul.id,
              loading: false,
            },
          );

          return regul;
        }

        regul = await regulService.addPiece(
          existing,
          amount,
        );

        patchState(
          store,
          updateEntity({
            id: regul.id,
            changes: regul,
          }),
          {
            selectedRegulId: regul.id,
            loading: false,
          },
        );

        return regul;
      } catch (error) {
        patchState(store, {
          loading: false,
          error: getErrorMessage(error),
        });

        return null;
      }
    },

    async updateLicence(
      id: number,
      licence: string,
    ): Promise<void> {
      patchState(store, {
        loading: true,
        error: null,
      });

      try {
        const regul =
          await regulService.update(id, licence);

        patchState(
          store,
          updateEntity({
            id: regul.id,
            changes: regul,
          }),
          {
            loading: false,
          },
        );
      } catch (error) {
        patchState(store, {
          loading: false,
          error: getErrorMessage(error),
        });
      }
    },

    async delete(id: number): Promise<void> {
      patchState(store, {
        loading: true,
        error: null,
      });

      try {
        await regulService.delete(id);

        patchState(
          store,
          removeEntity(id),
          {
            loading: false,
            selectedRegulId:
              store.selectedRegulId() === id
                ? null
                : store.selectedRegulId(),
          },
        );
      } catch (error) {
        patchState(store, {
          loading: false,
          error: getErrorMessage(error),
        });
      }
    },

    clearError(): void {
      patchState(store, {
        error: null,
      });
    },

    select(id: number | null): void {
      patchState(store, {
        selectedRegulId: id,
      });
    },
  })),
);

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Une erreur est survenue.';
}
