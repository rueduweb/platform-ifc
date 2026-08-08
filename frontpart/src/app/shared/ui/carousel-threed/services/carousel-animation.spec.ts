import { TestBed } from '@angular/core/testing';

import { CarouselAnimation } from './carousel-animation';

describe('CarouselAnimation', () => {
  let service: CarouselAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarouselAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
