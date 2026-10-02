import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { computed, inject } from '@angular/core';
import { EMPTY, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { ChampionshipRanking } from '../../../../shared/ui/championship-ranking/services/championship-ranking';
import { Team } from '../../../../shared/ui/championship-ranking/models/team.model';
import { TeamsApi } from '../services/teams-api';

type RankingState = {
  teams: Team[];
};

const initialState: RankingState = {
  teams: [],
};

export const RankingStore = signalStore(
  withState(initialState),

  withComputed(({ teams }) => {

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

    };

  }),

  withMethods((store) => {

    const teamsApi = inject(TeamsApi);

    const loadTeams = rxMethod<void>(
      pipe(
        switchMap(() =>
          teamsApi.getTeams().pipe(
            tap(teams => {
              patchState(store, {
                teams,
              });
            }),
          ),
        ),
      ),
    );

    return {

      loadTeams,

      setTeams(teams: Team[]): void {
        patchState(store, {
          teams,
        });
      },

      addTeam(team: Team): void {
        patchState(store, {
          teams: [
            ...store.teams(),
            team,
          ],
        });
      },

      updateTeam(team: Team): void {
        patchState(store, {
          teams: store.teams().map(
            currentTeam =>
              currentTeam.id === team.id
                ? team
                : currentTeam,
          ),
        });
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
