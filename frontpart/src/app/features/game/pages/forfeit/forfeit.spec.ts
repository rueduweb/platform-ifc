import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forfeit } from './forfeit';

describe('Forfeit', () => {
  let component: Forfeit;
  let fixture: ComponentFixture<Forfeit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forfeit],
    }).compileComponents();

    fixture = TestBed.createComponent(Forfeit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
