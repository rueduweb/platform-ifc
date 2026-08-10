import { TestBed } from '@angular/core/testing';

import { CarouselHover } from './carousel-hover';

describe('CarouselHover', () => {
  let service: CarouselHover;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarouselHover);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
