import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionshipRankingComp} from './championship-ranking';

describe('ChampionshipRanking', () => {
  let component: ChampionshipRankingComp;
  let fixture: ComponentFixture<ChampionshipRankingComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionshipRankingComp],
    }).compileComponents();

    fixture = TestBed.createComponent(ChampionshipRankingComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
