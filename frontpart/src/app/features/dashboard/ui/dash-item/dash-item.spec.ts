import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { DashItem } from './dash-item';
import { PieceData } from '../../data/models/piece-data.model';


describe.only('DashItem', () => {
  let component: DashItem;
  let fixture: ComponentFixture<DashItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashItem],
    }).compileComponents();

    fixture = TestBed.createComponent(DashItem);
    component = fixture.componentInstance;
    // await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept the required data input', () => {

    const pieceData: PieceData = {
      title: '',
      num: 25,
      all: 100,
      color: '#ff0000',
      subtitle: '',
      graphic: '',
      stat1: {
        stat: '',
        val: 0
      },
      stat2: {
        stat: '',
        val: 0
      },
      stat3: {
        stat: '',
        val: 0
      },
      routeLink1: {
        label: '',
        link: ''
      },
      routeLink2: {
        label: '',
        link: ''
      },
      routeLink3: {
        label: '',
        link: ''
      }
    };

    fixture.componentRef.setInput('data', pieceData);

    fixture.detectChanges();

    expect(component.data()).toEqual(pieceData);
  });
});
