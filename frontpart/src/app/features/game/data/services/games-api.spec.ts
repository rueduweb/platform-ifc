import { TestBed } from '@angular/core/testing';

import { GamesApi } from './games-api.js';

describe('GamesApiTs', () => {
  let service: GamesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
