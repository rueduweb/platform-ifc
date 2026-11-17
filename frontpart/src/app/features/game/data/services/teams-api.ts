
import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Team } from '../../../../shared/ui/championship-ranking/models/team.model';
import { environment } from '../../../../../environments/environment';

type TeamApiResponse = {
  id: number;
  name: string;

  rank: number;
  pts: number;

  nbW: number;
  nbD: number;
  nbL: number;
  nbForfeit: number;

  nbGoal: number;
  nbConce: number;

  avg: number;

  penalty: number;

  createdAt: string;
  updatedAt: string;
};

@Service()
export class TeamsApi {

  private readonly http = inject(HttpClient);

  private static readonly API_URL = `${environment.API_BASE_URL}/teams`;

  private toTeam(team: TeamApiResponse): Team {
    return {
      id: team.id,
      name: team.name,
      nbW: team.nbW,
      nbD: team.nbD,
      nbL: team.nbL,
      nbForfeit: team.nbForfeit,
      nbGoal: team.nbGoal,
      nbConce: team.nbConce,
      penalty: team.penalty
    };
  }

  getTeams(): Observable<Team[]> {
    return this.http
      .get<TeamApiResponse[]>(TeamsApi.API_URL)
      .pipe(
        map(teams => teams.map(team => this.toTeam(team)))
      );
  }

  updateTeam(team: Team): Observable<Team> {
    const {
      id,
      name,
      nbW,
      nbD,
      nbL,
      nbForfeit,
      nbGoal,
      nbConce,
      penalty
    } = team;

    return this.http
      .patch<TeamApiResponse>(
        `${TeamsApi.API_URL}/${id}`,
        {
          name,
          nbW,
          nbD,
          nbL,
          nbForfeit,
          nbGoal,
          nbConce,
          penalty
        },
      )
      .pipe(
        map(updatedTeam => this.toTeam(updatedTeam)),
      );
  }
}


