import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselThreed } from './carousel-threed';

describe('CarouselThreed', () => {
  let component: CarouselThreed;
  let fixture: ComponentFixture<CarouselThreed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselThreed],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselThreed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
