import { TestBed } from '@angular/core/testing';

import { TramiteFolioService } from './tramite-folio.service';

describe('TramiteFolioService', () => {
  let service: TramiteFolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TramiteFolioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
