import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulForm } from './regul-form';

describe('RegulForm', () => {
  let component: RegulForm;
  let fixture: ComponentFixture<RegulForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegulForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RegulForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
