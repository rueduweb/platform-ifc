import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerPanel } from './partner-panel';

describe('PartnerPanel', () => {
  let component: PartnerPanel;
  let fixture: ComponentFixture<PartnerPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnerPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
