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
  readonly editingTeam = signal<Team | null>(null);

  onEditTeam(team: RankedTeam): void {

    const { id, name, nbW, nbD, nbL, nbGoal, nbConce } = team;

    this.editingTeam.set({
      id,
      name,
      nbW,
      nbD,
      nbL,
      nbGoal,
      nbConce,
    });
  }

  onTeamSaved(team: Team): void {
  this.rankingStore.updateTeam(team).subscribe({
    next: () => {
      this.editingTeam.set(null);
    },
  });
}

  onCancelEdit(): void {
    this.editingTeam.set(null);
  }

}
