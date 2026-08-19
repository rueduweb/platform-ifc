import { TestBed } from '@angular/core/testing';

import { Partners } from './partner';

describe('Partner', () => {
  let service: Partners;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Partners);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
