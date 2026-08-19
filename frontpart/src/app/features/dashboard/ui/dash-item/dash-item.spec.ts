import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashItem } from './dash-item';

describe('DashItem', () => {
  let component: DashItem;
  let fixture: ComponentFixture<DashItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashItem],
    }).compileComponents();

    fixture = TestBed.createComponent(DashItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
