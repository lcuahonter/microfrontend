import { TestBed } from '@angular/core/testing';

import { HojaTrabajoService } from './hoja-trabajo.service';

describe('HojaTrabajoService', () => {
  let service: HojaTrabajoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HojaTrabajoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
