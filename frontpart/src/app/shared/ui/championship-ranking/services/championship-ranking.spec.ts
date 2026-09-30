import { TestBed } from '@angular/core/testing';

import { ChampionshipRanking } from './championship-ranking';

describe('ChampionshipRanking', () => {
  let service: ChampionshipRanking;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChampionshipRanking);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
