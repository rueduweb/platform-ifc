import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output
} from '@angular/core';

import { RankedTeam } from './models/ranked-team.model';
import { Auth } from '../../../features/auth/data/services/auth';

@Component({
  selector: 'app-championship-ranking',
  imports: [],
  templateUrl: './championship-ranking.html',
  styleUrl: './championship-ranking.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChampionshipRankingComp {

  protected readonly auth = inject(Auth);

  readonly ranking = input.required<RankedTeam[]>();

  readonly editTeam = output<RankedTeam>();

  onEditTeam(team: RankedTeam): void {
    this.editTeam.emit(team);
  }

}
