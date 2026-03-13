import { TestBed } from '@angular/core/testing';
import { SolicitudService } from './solicitud.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Tramite80316Store } from '../estados/tramite80316.store';

describe('SolicitudService', () => {
  let service: SolicitudService;
  let httpMock: HttpTestingController;
  let store: Tramite80316Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SolicitudService]
    });

    service = TestBed.inject(SolicitudService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Tramite80316Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
