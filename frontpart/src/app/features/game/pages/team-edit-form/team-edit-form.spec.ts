import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditForm } from './team-edit-form';

describe('TeamEditForm', () => {
  let component: TeamEditForm;
  let fixture: ComponentFixture<TeamEditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamEditForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamEditForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
