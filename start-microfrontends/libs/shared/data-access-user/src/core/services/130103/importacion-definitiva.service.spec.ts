import { TestBed } from '@angular/core/testing';

import { ImportacionDefinitivaService } from './importacion-definitiva.service';

describe('ImportacionDefinitivaService', () => {
  let service: ImportacionDefinitivaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportacionDefinitivaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
