import { TestBed } from '@angular/core/testing';

import { RegistrarSolicitudService } from './registrar-solicitud.service';
import { provideHttpClient } from '@angular/common/http';
describe('RegistrarSolicitudService', () => {
  let service: RegistrarSolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()], 
    });
    service = TestBed.inject(RegistrarSolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
