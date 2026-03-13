import { TestBed } from '@angular/core/testing';

import { SanidadService } from './sanidad.service';

describe('SanidadService', () => {
  let service: SanidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SanidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
