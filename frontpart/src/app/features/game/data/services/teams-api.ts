import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Team } from '../../../../shared/ui/championship-ranking/models/team.model';

type TeamApiResponse = {
  id: number;
  name: string;

  rank: number;
  pts: number;

  nbW: number;
  nbD: number;
  nbL: number;

  nbGoal: number;
  nbConce: number;

  avg: number;

  createdAt: string;
  updatedAt: string;
};

@Service()
export class TeamsApi {

  private readonly http = inject(HttpClient);

  private static readonly API_URL = 'http://localhost:3000/api/teams';

  private toTeam(team: TeamApiResponse): Team {
    return {
      id: team.id,
      name: team.name,
      nbW: team.nbW,
      nbD: team.nbD,
      nbL: team.nbL,
      nbGoal: team.nbGoal,
      nbConce: team.nbConce,
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
    const { id, name, nbW, nbD, nbL, nbGoal, nbConce } = team;

    return this.http
      .patch<TeamApiResponse>(
        `${TeamsApi.API_URL}/${id}`,
        { name, nbW, nbD, nbL, nbGoal, nbConce },
      )
      .pipe(
        map(updatedTeam => this.toTeam(updatedTeam)),
      );
  }
}

