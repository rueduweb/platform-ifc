import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reguls } from './reguls';

describe('Reguls', () => {
  let component: Reguls;
  let fixture: ComponentFixture<Reguls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reguls],
    }).compileComponents();

    fixture = TestBed.createComponent(Reguls);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
