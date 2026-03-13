import { TestBed } from '@angular/core/testing';

import { RepresentacionFederalService } from './representacion-federal.service';

describe('RepresentacionFederalService', () => {
  let service: RepresentacionFederalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepresentacionFederalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
