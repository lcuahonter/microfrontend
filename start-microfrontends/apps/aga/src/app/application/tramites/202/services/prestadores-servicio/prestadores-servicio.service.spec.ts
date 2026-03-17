import { TestBed } from '@angular/core/testing';

import { PrestadoresServicioService } from './prestadores-servicio.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PrestadoresServicioService', () => {
  let service: PrestadoresServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PrestadoresServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
