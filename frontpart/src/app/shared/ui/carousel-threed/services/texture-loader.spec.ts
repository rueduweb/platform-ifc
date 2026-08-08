import { TestBed } from '@angular/core/testing';

import { TextureLoader } from './texture-loader';

describe('TextureLoader', () => {
  let service: TextureLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextureLoader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
