import { TestBed } from '@angular/core/testing';

import { PartnersApi } from './partner-api';

describe('PartnerApi', () => {
  let service: PartnersApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnersApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
