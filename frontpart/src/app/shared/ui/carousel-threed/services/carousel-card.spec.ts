import { TestBed } from '@angular/core/testing';

import { CarouselCard } from './carousel-card';

describe('CarouselCard', () => {
  let service: CarouselCard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarouselCard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
