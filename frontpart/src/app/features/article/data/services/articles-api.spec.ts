import { TestBed } from '@angular/core/testing';

import { ArticlesApi } from './articles-api';

describe('ArticlesApi', () => {
  let service: ArticlesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticlesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
