import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Championship } from './championship';

describe('Championship', () => {
  let component: Championship;
  let fixture: ComponentFixture<Championship>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Championship],
    }).compileComponents();

    fixture = TestBed.createComponent(Championship);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
