import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SolicitudService } from './solicitud.service';

describe('SolicitudService', () => {
  let service: SolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
