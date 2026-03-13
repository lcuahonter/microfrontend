import { TestBed } from '@angular/core/testing';

import { Shared2607Service } from './shared2607.service';

describe('Shared2607Service', () => {
  let service: Shared2607Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Shared2607Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
