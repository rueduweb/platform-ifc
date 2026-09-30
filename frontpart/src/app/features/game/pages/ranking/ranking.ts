import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';

import { ChampionshipRankingComp } from '../../../../shared/ui/championship-ranking/championship-ranking';
import { RankingStore } from '../../data/state/ranking.store';

@Component({
  selector: 'app-ranking',
  imports: [ChampionshipRankingComp],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
  providers: [RankingStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ranking {

  readonly rankingStore = inject(RankingStore);
}
