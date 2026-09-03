import { TestBed } from '@angular/core/testing';

import { RegulApi } from './regul-api';

describe('RegulApi', () => {
  let service: RegulApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegulApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
