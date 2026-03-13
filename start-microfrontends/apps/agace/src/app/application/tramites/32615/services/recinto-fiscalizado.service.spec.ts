import { TestBed } from '@angular/core/testing';

import { RecintoFiscalizadoService } from './recinto-fiscalizado.service';

describe('RecintoFiscalizadoService', () => {
  let service: RecintoFiscalizadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecintoFiscalizadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
