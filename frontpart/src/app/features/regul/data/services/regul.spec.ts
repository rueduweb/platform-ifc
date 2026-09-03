import { TestBed } from '@angular/core/testing';

import { Regul } from './regul';

describe('Regul', () => {
  let service: Regul;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Regul);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
