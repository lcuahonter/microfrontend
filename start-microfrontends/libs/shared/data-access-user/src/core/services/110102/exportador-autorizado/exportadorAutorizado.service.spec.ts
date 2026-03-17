import { TestBed } from '@angular/core/testing';

import { ExportadorAutorizadoService } from './exportadorAutorizado.service';

describe('ExportadorAutorizadoService', () => {
  let service: ExportadorAutorizadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportadorAutorizadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
