import { TestBed } from '@angular/core/testing';

import { DescripcionDelCupoService } from './descripcionDelCupo.service';

describe('DescripcionDelCupoService', () => {
  let service: DescripcionDelCupoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescripcionDelCupoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
