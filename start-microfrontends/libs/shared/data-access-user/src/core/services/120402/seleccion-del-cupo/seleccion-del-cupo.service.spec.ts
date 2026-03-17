import { TestBed } from '@angular/core/testing';

import { SeleccionDelCupoService } from './seleccion-del-cupo.service';

describe('SeleccionDelCupoService', () => {
  let service: SeleccionDelCupoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeleccionDelCupoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
