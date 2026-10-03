import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import { ChampionshipRanking } from '../../../../shared/ui/championship-ranking/services/championship-ranking';
import { Team } from '../../../../shared/ui/championship-ranking/models/team.model';

import { TeamsApi } from '../services/teams-api';
import { RankingStore } from './ranking.store';

type TeamsApiMock = {
  getTeams: ReturnType<typeof vi.fn>;
};

describe('RankingStore', () => {

  let store: InstanceType<typeof RankingStore>;

  let teamsApi: TeamsApiMock;

  let response$: Subject<Team[]>;

  const teams: Team[] = [
    {
      id: 1,
      name: 'Team A',
      nbW: 3,
      nbD: 1,
      nbL: 0,
      nbGoal: 8,
      nbConce: 2,
    },
    {
      id: 2,
      name: 'Team B',
      nbW: 2,
      nbD: 1,
      nbL: 1,
      nbGoal: 6,
      nbConce: 4,
    },
  ];

  beforeEach(() => {

    response$ = new Subject<Team[]>();

    teamsApi = {
      getTeams: vi.fn(),
    };

    teamsApi.getTeams.mockReturnValue(response$);

    TestBed.configureTestingModule({
      providers: [
        RankingStore,

        {
          provide: TeamsApi,
          useValue: teamsApi,
        },

        {
          provide: ChampionshipRanking,
          useValue: {
            calculateRanking: (value: Team[]) => value,
          },
        },
      ],
    });

    store = TestBed.inject(RankingStore);

  });

  it('should create the store', () => {

    expect(store).toBeTruthy();

  });

  describe('initial loading', () => {

    it('should load teams on init', () => {

      expect(teamsApi.getTeams)
        .toHaveBeenCalledTimes(1);

    });

    it('should set loading to true while the request is pending', () => {

      expect(store.loading()).toBe(true);
      expect(store.error()).toBeNull();

    });

    it('should keep teams empty while the request is pending', () => {

      expect(store.teams()).toEqual([]);

    });

  });

  describe('successful loading', () => {

    it('should store the received teams', () => {

      response$.next(teams);
      response$.complete();

      expect(store.teams())
        .toEqual(teams);

    });

    it('should set loading to false after success', () => {

      response$.next(teams);
      response$.complete();

      expect(store.loading()).toBe(false);

    });

    it('should clear the error after success', () => {

      response$.next(teams);
      response$.complete();

      expect(store.error()).toBeNull();

    });

  });

  describe('loading error', () => {

    it('should set loading to false after an error', () => {

      response$.error(
        new Error('Network error'),
      );

      expect(store.loading()).toBe(false);

    });

    it('should expose a user-friendly error', () => {

      response$.error(
        new Error('Network error'),
      );

      expect(store.error())
        .toBe('Impossible de charger le classement.');

    });

    it('should keep the existing teams after an error', () => {

      store.setTeams(teams);

      response$.error(
        new Error('Network error'),
      );

      expect(store.teams())
        .toEqual(teams);

    });

  });

  describe('retry after error', () => {

    it('should remain usable after an error', () => {

      const firstRequest$ = new Subject<Team[]>();
      const secondRequest$ = new Subject<Team[]>();

      teamsApi.getTeams
        .mockReturnValueOnce(firstRequest$)
        .mockReturnValueOnce(secondRequest$);

      /*
       * Important :
       * le premier appel a déjà été effectué
       * par le hook onInit().
       */
      expect(teamsApi.getTeams)
        .toHaveBeenCalledTimes(1);

      // Première requête : erreur.
      firstRequest$.error(
        new Error('Network error'),
      );

      expect(store.loading()).toBe(false);

      expect(store.error())
        .toBe('Impossible de charger le classement.');

      // Nouvelle tentative.
      store.loadTeams();

      expect(teamsApi.getTeams)
        .toHaveBeenCalledTimes(2);

      expect(store.loading()).toBe(true);
      expect(store.error()).toBeNull();

      // Deuxième requête : succès.
      secondRequest$.next(teams);
      secondRequest$.complete();

      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.teams()).toEqual(teams);

    });

  });

  describe('concurrent loading', () => {

    it('should ignore a new load while the current request is pending', () => {

      /*
       * Le GET lancé par onInit() est toujours actif.
       */
      expect(teamsApi.getTeams)
        .toHaveBeenCalledTimes(1);

      // Deuxième demande.
      store.loadTeams();

      /*
       * exhaustMap doit ignorer cette nouvelle demande.
       */
      expect(teamsApi.getTeams)
        .toHaveBeenCalledTimes(1);

    });

    it('should allow a new load after the current request completes', () => {

      response$.next(teams);
      response$.complete();

      expect(store.loading()).toBe(false);

      const secondResponse$ = new Subject<Team[]>();

      teamsApi.getTeams
        .mockReturnValueOnce(secondResponse$);

      store.loadTeams();

      expect(teamsApi.getTeams)
        .toHaveBeenCalledTimes(2);

      expect(store.loading()).toBe(true);

      secondResponse$.next(teams);
      secondResponse$.complete();

      expect(store.loading()).toBe(false);

    });

  });

  describe('computed values', () => {

    it('should expose the team count', () => {

      expect(store.teamCount()).toBe(0);

      response$.next(teams);

      expect(store.teamCount()).toBe(2);

    });

    it('should expose the ranking', () => {

      expect(store.ranking()).toEqual([]);

      response$.next(teams);

      expect(store.ranking())
        .toEqual(teams);

    });

    it('should expose the leader', () => {

      expect(store.leader()).toBeNull();

      response$.next(teams);

      expect(store.leader())
        .toEqual(teams[0]);

    });

  });

  describe('state mutations', () => {

    it('should replace teams with setTeams', () => {

      store.setTeams(teams);

      expect(store.teams())
        .toEqual(teams);

    });

    it('should add a team', () => {

      store.setTeams([teams[0]]);

      store.addTeam(teams[1]);

      expect(store.teams())
        .toEqual(teams);

    });

    it('should update an existing team', () => {

      store.setTeams(teams);

      const updatedTeam: Team = {
        ...teams[0],
        name: 'Team A Updated',
      };

      store.updateTeam(updatedTeam);

      expect(store.teams())
        .toEqual([
          updatedTeam,
          teams[1],
        ]);

    });

    it('should remove a team', () => {

      store.setTeams(teams);

      store.removeTeam(1);

      expect(store.teams())
        .toEqual([
          teams[1],
        ]);

    });

  });

});
