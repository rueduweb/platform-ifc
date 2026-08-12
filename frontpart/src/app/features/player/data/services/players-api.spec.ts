import { TestBed } from '@angular/core/testing';

import { PlayersApi } from './players-api';

describe('PlayersApi', () => {
  let service: PlayersApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayersApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
