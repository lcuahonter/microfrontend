import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CuposService } from './cupos.service';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { RespuestaCuposTabla } from '../../models/cupos.model';

describe('CuposService', () => {
  let service: CuposService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CuposService],
    });

    service = TestBed.inject(CuposService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTratadoCatalogo', () => {
    it('should fetch tratado catalogo', () => {
      const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: 'Success' };

      service.getTratadoCatalogo().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/120201/tratado-catalogo.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getRegimenClasificacionCatalogo', () => {
    it('should fetch regimen clasificacion catalogo', () => {
      const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: 'Success' };

      service.getRegimenClasificacionCatalogo().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/120201/regimen-clasificacion-catalogo.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getPaisDestinoCatalogo', () => {
    it('should fetch pais destino catalogo', () => {
      const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: 'Success' };

      service.getPaisDestinoCatalogo().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/120201/pais-destino-catalogo.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getEstadoCatalogo', () => {
    it('should fetch estado catalogo', () => {
      const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: 'Success' };

      service.getEstadoCatalogo().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/120201/estado-catalogo.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getRepresentacionFederalCatalogo', () => {
    it('should fetch representacion federal catalogo', () => {
      const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: 'Success' };

      service.getRepresentacionFederalCatalogo().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/120201/representacion-federal-catalogo.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('obtenerTablaDatos', () => {
    it('should fetch tabla datos', () => {
      const mockResponse: RespuestaCuposTabla = { code: 200, data: [], message: 'Success' };

      service.obtenerTablaDatos().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/120201/tabla-cupos.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});