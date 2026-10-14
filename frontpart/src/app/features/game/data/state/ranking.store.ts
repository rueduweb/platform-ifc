import {
  computed,
  inject
} from '@angular/core';

import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState
} from '@ngrx/signals';

import {
  catchError,
  EMPTY,
  exhaustMap,
  finalize,
  pipe,
  tap,
  Observable
} from 'rxjs';

import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { ChampionshipRanking } from '../../../../shared/ui/championship-ranking/services/championship-ranking';
import { Team } from '../../../../shared/ui/championship-ranking/models/team.model';
import { TeamsApi } from '../services/teams-api';

type RankingState = {
  teams: Team[];
  loading: boolean;
  error: string | null;
};

const initialState: RankingState = {
  teams: [],
  loading: false,
  error: null
};

export const RankingStore = signalStore(

  withState(initialState),

  withComputed(({ teams, loading, error }) => {

    const rankingService = inject(ChampionshipRanking);

    const ranking = computed(() =>
      rankingService.calculateRanking(teams()),
    );

    return {

      ranking,

      leader: computed(() =>
        ranking()[0] ?? null,
      ),

      teamCount: computed(() =>
        teams().length,
      ),

      hasError: computed(() =>
        error() !== null,
      ),

      isEmpty: computed(() =>
        !loading() && teams().length === 0,
      ),

    };

  }),

  withMethods((store) => {

    const teamsApi = inject(TeamsApi);

    const loadTeams = rxMethod<void>(
      pipe(

        exhaustMap(() => {

          patchState(store, { loading: true, error: null });

          return teamsApi.getTeams().pipe(

            tap((teams) => {

              patchState(store, {
                teams,
                loading: false,
                error: null
              });

            }),

            catchError(() => {

              patchState(store, {
                loading: false,
                error: 'Impossible de charger le classement.',
              });

              return EMPTY;

            }),

          );

        }),

      ),
    );

    return {

      loadTeams,

      setTeams(teams: Team[]): void {
        patchState(store, {
          teams,
          error: null
        });
      },

      addTeam(team: Team): void {
        patchState(store, {
          teams: [
            ...store.teams(),
            team
          ],
        });
      },

      updateTeam(team: Team): Observable<Team> {
        patchState(store, {
          loading: true,
          error: null,
        });

        return teamsApi.updateTeam(team).pipe(
          tap(updatedTeam => {
            patchState(store, {
              teams: store.teams().map(currentTeam =>
                currentTeam.id === updatedTeam.id
                  ? updatedTeam
                  : currentTeam,
              ),
              error: null,
            });
          }),

          catchError(() => {
            patchState(store, {
              error: 'Impossible de modifier cette équipe.',
            });

            return EMPTY;
          }),

          finalize(() => {
            patchState(store, { loading: false });
          }),
        );
      },

      removeTeam(teamId: number): void {
        patchState(store, {
          teams: store.teams().filter(
            team => team.id !== teamId,
          ),
        });
      },

    };

  }),

  withHooks({

    onInit(store) {
      store.loadTeams();
    },

  }),

);
