import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { ChampionshipRankingComp } from '../../../../shared/ui/championship-ranking/championship-ranking';
import { RankingStore } from '../../data/state/ranking.store';
import { Team } from '../../../../shared/ui/championship-ranking/models/team.model';
import { RankedTeam } from './../../../../shared/ui/championship-ranking/models/ranked-team.model';
import { TeamEditForm } from '../team-edit-form/team-edit-form';
import { TeamUpdate } from '../../data/models/team-update.model';
import { TeamsApi } from '../../data/services/teams-api';

@Component({
  selector: 'app-ranking',
  imports: [ChampionshipRankingComp, TeamEditForm],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
  providers: [RankingStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ranking {

  readonly rankingStore = inject(RankingStore);
  readonly teamService = inject(TeamsApi);
  readonly editingTeam = signal<Team | null>(null);

  onEditTeam(team: RankedTeam): void {

    const { id, name, nbW, nbD, nbL, nbForfeit, nbGoal, nbConce, penalty } = team;

    this.editingTeam.set({
      id,
      name,
      nbW,
      nbD,
      nbL,
      nbForfeit,
      nbGoal,
      nbConce,
      penalty,
    });
  }

  onTeamSaved(team: Team): void {

    this.teamService.updateTeam(team)
      .subscribe({
        next: (updateTeam) => {
          this.onCancelEdit();
          this.rankingStore.loadTeams();
        },
        error: (error) => {
          console.error(
            'Erreur lors de la mise à jour de l’équipe :',
            error
          );
        }
      });
  }

  onCancelEdit(): void {
    this.editingTeam.set(null);
  }

}
