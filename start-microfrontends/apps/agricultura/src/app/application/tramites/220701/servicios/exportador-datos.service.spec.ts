import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExportadorDatosService } from './exportador-datos.service';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

describe('ExportadorDatosService', () => {
  let service: ExportadorDatosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExportadorDatosService]
    });
    service = TestBed.inject(ExportadorDatosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerExportador should GET exportador.json', () => {
    const mockResponse = { data: 'exportador' } as unknown as RespuestaCatalogos;
    service.getDatos().subscribe((res: RespuestaCatalogos) => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/assets/json/220701/exportador.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});