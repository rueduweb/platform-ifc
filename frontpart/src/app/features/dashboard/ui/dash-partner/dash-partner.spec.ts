import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashPartner } from './dash-partner';

describe('DashPartner', () => {
  let component: DashPartner;
  let fixture: ComponentFixture<DashPartner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashPartner],
    }).compileComponents();

    fixture = TestBed.createComponent(DashPartner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
