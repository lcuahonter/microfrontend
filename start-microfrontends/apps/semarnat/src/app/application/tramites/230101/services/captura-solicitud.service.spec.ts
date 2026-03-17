import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CapturaSolicitudeService } from './captura-solicitud.service';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';

describe('CapturaSolicitudeService', () => {
  let service: CapturaSolicitudeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CapturaSolicitudeService],
    });

    service = TestBed.inject(CapturaSolicitudeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
