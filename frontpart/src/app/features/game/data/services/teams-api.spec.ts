import { TestBed } from '@angular/core/testing';

import { TeamsApi } from './teams-api';

describe('TeamsApi', () => {
  let service: TeamsApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamsApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
