import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import { RankedTeam } from './models/ranked-team.model';

@Component({
  selector: 'app-championship-ranking',
  imports: [],
  templateUrl: './championship-ranking.html',
  styleUrl: './championship-ranking.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChampionshipRankingComp {

  readonly ranking = input.required<RankedTeam[]>();

}
