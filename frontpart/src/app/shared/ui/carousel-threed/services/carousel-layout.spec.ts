import { TestBed } from '@angular/core/testing';

import { CarouselLayout } from './carousel-layout';

describe('CarouselLayout', () => {
  let service: CarouselLayout;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarouselLayout);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
