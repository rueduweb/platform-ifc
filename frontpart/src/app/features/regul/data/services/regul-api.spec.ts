import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { RegulsApi } from './regul-api';

describe('RegulsApi', () => {
  let service: RegulsApi;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(RegulsApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
