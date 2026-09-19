import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import {
  EMPTY,
  catchError,
  concatMap,
  from,
  map,
  pipe,
  reduce,
  switchMap,
  tap,
} from 'rxjs';


import { AddPieceRegulDto, CreateRegulDto, Regul, UpdatePieceRegulDto } from '../models/regul.model';
import { RegulsApi } from '../services/regul-api';

import { RegulFormModel } from '../models/regul-form.model';


type RegulsState = {
  reguls: Regul[];
  regul: Regul | null;
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
};


const initialState: RegulsState = {
  reguls: [],
  regul: null,
  loading: false,
  error: null,
  createSuccess: false
};

export const RegulsStore = signalStore(
  withState(initialState),

  withMethods((store, regulsApi = inject(RegulsApi)) => ({
    loadReguls: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {
            loading: true,
            error: null,
          });
        }),

        switchMap(() =>
          regulsApi.getReguls().pipe(
            tap((reguls) => {
              patchState(store, {
                reguls,
                loading: false,
              });
            }),

            catchError((error) => {
              patchState(store, {
                loading: false,
                error: getErrorMessage(
                  error,
                  'Une erreur est survenue lors du chargement des réguls.',
                ),
              });

              return EMPTY;
            }),
          ),
        ),
      ),
    ),


    loadRegul: rxMethod<number>(
      pipe(
        tap(() => {
          patchState(store, {
            loading: true,
            error: null,
            regul: null,
          });
        }),

        switchMap((id) =>
          regulsApi.getRegul(id).pipe(
            tap({
              next: (regul) => {
                patchState(store, {
                  regul,
                  loading: false,
                });
              },

              error: (error) => {
                patchState(store, {
                  loading: false,
                  error: getErrorMessage(
                    error,
                    'Une erreur est survenue lors du chargement des réguls.'
                  ),
                });
              },
            }),
          ),
        ),
      ),
    ),
    createRegul: rxMethod<CreateRegulDto>(
      pipe(
        tap(() => {
          patchState(store, {
            loading: true,
            error: null,
          });
        }),

        switchMap((dto) =>
          regulsApi.createRegul(dto).pipe(
            tap({
              next: (regul) => {
                patchState(store, (state) => ({
                  reguls: [...state.reguls, regul],
                  regul,
                  loading: false,
                }));
              },

              error: (error) => {
                patchState(store, {
                  loading: false,
                  error: getErrorMessage(
                    error,
                    'Une erreur est survenue lors de la création de la régul.'
                  ),
                });
              },
            }),
          ),
        ),
      ),
    ),

    createRegulWithPieces: rxMethod<RegulFormModel>(
      pipe(
        tap(() => {
          patchState(store, {
            loading: true,
            error: null,
            createSuccess: false
          });
        }),

        switchMap((formModel) => {
          const [firstItem, ...remainingItems] = formModel.items;

          const createDto: CreateRegulDto = {
            license: formModel.license,
            ...(firstItem?.amount != null
              ? { amount: firstItem.amount }
              : {}),
          };

          return regulsApi.createRegul(createDto).pipe(
            switchMap((createdRegul) => {
              const itemsToAdd = remainingItems.filter(
                (item) => item.amount != null,
              );

              if (itemsToAdd.length === 0) {
                return [createdRegul];
              }

              return from(itemsToAdd).pipe(
                concatMap((item) =>
                  regulsApi.addPieceRegul(createdRegul.id, {
                    amount: item.amount!,
                  }),
                ),
                reduce(
                  (_regul, updatedRegul) => updatedRegul,
                  createdRegul,
                ),
              );
            }),

            tap((regul) => {
              patchState(store, (state) => ({
                reguls: state.reguls.some(
                  (item) => item.id === regul.id,
                )
                  ? state.reguls.map((item) =>
                      item.id === regul.id ? regul : item,
                    )
                  : [...state.reguls, regul],

                regul,
                loading: false,
                createSuccess: true
              }));
            }),

            catchError((error) => {
              patchState(store, {
                loading: false,
                error: getErrorMessage(
                  error,
                  'Une erreur est survenue lors de la création de la régul.',
                ),
                createSuccess: false
              });

              return EMPTY;
            }),
          );
        }),
      ),
    ),

    updateRegulWithPieces: rxMethod<{
      regulId: number;
      items: {
        id?: number;
        amount: number | null;
      }[];
    }>(
      pipe(
        tap(() => {
          patchState(store, {
            loading: true,
            error: null,
          });
        }),

        switchMap(({ regulId, items }) =>
          from(items).pipe(
            // Une opération après l'autre
            concatMap((item) => {
              // Montant vide : aucune opération API
              if (item.amount === null) {
                return EMPTY;
              }

              // Pièce existante → PATCH
              if (item.id !== undefined) {
                return regulsApi.updatePieceRegul(
                  regulId,
                  item.id,
                  {
                    amount: item.amount,
                  },
                );
              }

              // Nouvelle pièce → POST
              return regulsApi.addPieceRegul(
                regulId,
                {
                  amount: item.amount,
                },
              );
            }),

            // On conserve la dernière Regul retournée par l'API
            reduce(
              (_currentRegul, updatedRegul) => updatedRegul,
              null as Regul | null,
            ),

            tap((regul) => {
              if (regul === null) {
                patchState(store, {
                  loading: false,
                });

                return;
              }

              patchState(store, (state) => ({
                reguls: state.reguls.map((item) =>
                  item.id === regul.id ? regul : item,
                ),
                regul,
                loading: false,
              }));
            }),

            catchError((error) => {
              patchState(store, {
                loading: false,
                error: getErrorMessage(
                  error,
                  'Une erreur est survenue lors de la modification de la régul.',
                ),
              });

              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    addPieceRegul: rxMethod<{
      regulId: number;
      dto: AddPieceRegulDto;
    }>(
      pipe(
        tap(() => {
          patchState(store, {
            loading: true,
            error: null,
          });
        }),

        switchMap(({ regulId, dto }) =>
          regulsApi.addPieceRegul(regulId, dto).pipe(
            tap({
              next: (regul) => {
                patchState(store, {
                  reguls: store.reguls().map((item) =>
                    item.id === regul.id ? regul : item,
                  ),
                  regul,
                  loading: false,
                });
              },

              error: (error) => {
                patchState(store, {
                  loading: false,
                  error:getErrorMessage(
                    error,
                    "Une erreur est survenue lors de l'ajout de la pièce."
                  ),
                });
              },
            }),
          ),
        ),
      ),
    ),

    updatePieceRegul: rxMethod<{
      regulId: number;
      pieceId: number;
      dto: UpdatePieceRegulDto;
    }>(
      pipe(
        tap(() => {
          patchState(store, {
            loading: true,
            error: null,
          });
        }),

        switchMap(({ regulId, pieceId, dto }) =>
          regulsApi
            .updatePieceRegul(regulId, pieceId, dto)
            .pipe(
              tap((regul) => {
                patchState(store, {
                  reguls: store.reguls().map((item) =>
                    item.id === regul.id ? regul : item,
                  ),
                  regul,
                  loading: false,
                });
              }),

              catchError((error) => {
                patchState(store, {
                  loading: false,
                  error: getErrorMessage(
                    error,
                    'Une erreur est survenue lors de la modification de la pièce.'
                  ),
                });

                return EMPTY;
              }),
            ),
        ),
      ),
    ),

    deletePieceRegul: rxMethod<{
      regulId: number;
      pieceId: number;
    }>(
      pipe(
        tap(() => {
          patchState(store, {
            loading: true,
            error: null,
          });
        }),

        switchMap(({ regulId, pieceId }) =>
          regulsApi
            .deletePieceRegul(regulId, pieceId)
            .pipe(
              tap((regul) => {
                patchState(store, {
                  reguls: store.reguls().map((item) =>
                    item.id === regul.id ? regul : item,
                  ),
                  regul,
                  loading: false,
                });
              }),

              catchError((error) => {
                patchState(store, {
                  loading: false,
                  error: getErrorMessage(
                    error,
                    'Une erreur est survenue lors de la suppression de la pièce.'
                  ),
                });

                return EMPTY;
              }),
            ),
        ),
      ),
    ),

  })),
);
/**
 * Error msg helper
 */
function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

