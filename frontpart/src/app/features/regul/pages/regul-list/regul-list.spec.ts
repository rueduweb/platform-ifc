import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulList } from './regul-list';

describe('RegulList', () => {
  let component: RegulList;
  let fixture: ComponentFixture<RegulList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegulList],
    }).compileComponents();

    fixture = TestBed.createComponent(RegulList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
