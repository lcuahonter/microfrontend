import { TestBed } from '@angular/core/testing';

import { ServiciosExtraordinariosService } from './servicios-extraordinarios.service';

describe('ServiciosExtraordinariosService', () => {
  let service: ServiciosExtraordinariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosExtraordinariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
