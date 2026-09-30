import { Service } from '@angular/core';

import { RankedTeam } from '../models/ranked-team.model';
import { Team } from '../models/team.model';

@Service()
export class ChampionshipRanking {

  private readonly VICTORY_POINTS = 4;
  private readonly DRAW_POINTS = 2;
  private readonly LOSS_POINTS = 1;

  calculateRanking(teams: readonly Team[]): RankedTeam[] {

    return teams
      .map(team => ({
        ...team,
        pts: this.calculatePoints(team),
        avg: this.calculateAverage(team),
      }))
      .sort((teamA, teamB) =>
        this.compareTeams(teamA, teamB)
      )
      .map((team, index) => ({
        ...team,
        rank: index + 1,
      }));
  }

  private calculatePoints(team: Team): number {

    return (
      team.nbW * this.VICTORY_POINTS +
      team.nbD * this.DRAW_POINTS +
      team.nbL * this.LOSS_POINTS
    );
  }

  private calculateAverage(team: Team): number {
    return team.nbGoal - team.nbConce;
  }

  private compareTeams(
    teamA: RankedTeam,
    teamB: RankedTeam
  ): number {

    // 1. Points décroissants
    if (teamA.pts !== teamB.pts) {
      return teamB.pts - teamA.pts;
    }

    // 2. Goal-average décroissant
    if (teamA.avg !== teamB.avg) {
      return teamB.avg - teamA.avg;
    }

    // 3. Critère stable
    return teamA.id - teamB.id;

  }
}

