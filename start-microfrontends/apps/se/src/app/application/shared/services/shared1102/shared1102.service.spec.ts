import { TestBed } from '@angular/core/testing';

import { Shared1102Service } from './shared1102.service';

describe('Shared1102Service', () => {
  let service: Shared1102Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Shared1102Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
