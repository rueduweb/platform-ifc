import { TestBed } from '@angular/core/testing';

import { PartnerApi } from './partner-api';

describe('PartnerApi', () => {
  let service: PartnerApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
