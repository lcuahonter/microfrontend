import { TestBed } from '@angular/core/testing';

import { SubirDocumentoService } from './subir-documento.service';

describe('SubirDocumentoService', () => {
  let service: SubirDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubirDocumentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
