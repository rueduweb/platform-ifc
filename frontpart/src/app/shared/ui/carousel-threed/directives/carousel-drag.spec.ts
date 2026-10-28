import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CarouselDragDirective } from './carousel-drag';

describe('CarouselDragDirective', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: ElementRef, useValue: new ElementRef(document.createElement('div')) }],
    });
    const directive = TestBed.runInInjectionContext(() => new CarouselDragDirective());
    expect(directive).toBeTruthy();
  });
});
