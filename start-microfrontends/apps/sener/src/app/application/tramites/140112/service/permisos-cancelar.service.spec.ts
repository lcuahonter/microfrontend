import { TestBed } from '@angular/core/testing';

import { PermisosCancelarService } from './permisos-cancelar.service';
import { provideHttpClient } from '@angular/common/http';

describe('PermisosCancelarService', () => {
  let service: PermisosCancelarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermisosCancelarService, provideHttpClient()]
    });
    service = TestBed.inject(PermisosCancelarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
