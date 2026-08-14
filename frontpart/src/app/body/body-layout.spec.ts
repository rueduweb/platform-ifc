import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyLayout } from './body-layout';

describe('BodyLayout', () => {
  let component: BodyLayout;
  let fixture: ComponentFixture<BodyLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(BodyLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
