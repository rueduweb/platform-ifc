import { TestBed } from '@angular/core/testing';

import { CarouselNavigation } from './carousel-navigation';

describe('CarouselNavigation', () => {
  let service: CarouselNavigation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarouselNavigation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
