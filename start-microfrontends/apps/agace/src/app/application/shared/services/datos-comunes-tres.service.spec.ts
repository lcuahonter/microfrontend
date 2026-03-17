import { TestBed } from '@angular/core/testing';

import { DatosComunesTresService } from './datos-comunes-tres.service';

describe('DatosComunesTresService', () => {
  let service: DatosComunesTresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosComunesTresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
