import { TestBed } from '@angular/core/testing';

import { Shared2605Service } from './shared2605.service';

describe('Shared2605Service', () => {
  let service: Shared2605Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Shared2605Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
