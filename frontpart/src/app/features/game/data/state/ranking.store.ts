import {
patchState,
signalStore,
withComputed,
withHooks,
withMethods,
withState,
} from '@ngrx/signals';

import { computed, inject } from '@angular/core';

import { ChampionshipRanking } from '../../../../shared/ui/championship-ranking/services/championship-ranking';
import { Team } from '../../../../shared/ui/championship-ranking/models/team.model';
import { INITIAL_TEAMS } from '../../pages/ranking/data/teams.data';

type RankingState = {
  teams: Team[];
};

const initialState: RankingState = {
  teams: INITIAL_TEAMS,
};

export const RankingStore = signalStore(
  withState(initialState),

  withComputed(({ teams }) => {

    const rankingService = inject(ChampionshipRanking);

    const ranking = computed(() => rankingService.calculateRanking(teams()));

    return {

      ranking,

      leader: computed(() => ranking()[0] ?? null),

      teamCount: computed(() => teams().length),

    };

  }),

  withMethods((store) => ({

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
              : currentTeam
        ),
      });
    },

    removeTeam(teamId: number): void {
      patchState(store, {
        teams: store.teams().filter(
          team => team.id !== teamId
        ),
      });
    },

  })),

  withHooks({
    onInit(store) {
      console.log('[RankingStore] initialized', store.teams());
    },
  }),

);
