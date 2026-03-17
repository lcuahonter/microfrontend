import { TestBed } from '@angular/core/testing';

import { AvisoImportacionService } from './aviso-importacion.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AvisoImportacionService', () => {
  let service: AvisoImportacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AvisoImportacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
