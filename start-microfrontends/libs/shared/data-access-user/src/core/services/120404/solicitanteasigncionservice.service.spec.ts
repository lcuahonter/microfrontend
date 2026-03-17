import { TestBed } from '@angular/core/testing';

import { SolicitanteasigncionserviceService } from './solicitanteasigncionservice.service';

describe('SolicitanteasigncionserviceService', () => {
  let service: SolicitanteasigncionserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitanteasigncionserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
