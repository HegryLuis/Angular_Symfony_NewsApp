import { TestBed } from '@angular/core/testing';

import { NewsState } from './news-state';

describe('NewsState', () => {
  let service: NewsState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
