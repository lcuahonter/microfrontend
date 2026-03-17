import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImporteRecordService } from './importe-record.service';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { API_GET_IMPORTE_RECORD } from '../../server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { Catalogo } from '@libs/shared/data-access-user/src';

describe('ImporteRecordService', () => {
  let service: ImporteRecordService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImporteRecordService]
    });
    service = TestBed.inject(ImporteRecordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('should initialize host correctly', () => {
      expect(service['host']).toBe(`${ENVIRONMENT.API_HOST}/api/`);
    });
  });

  describe('getImporteRecord', () => {
    it('should send GET request to correct endpoint', () => {
      const mockCatalogos: Catalogo[] = [
        { id: 1, descripcion: 'Importador de Registro A' },
        { id: 2, descripcion: 'Importador de Registro B' },
        { id: 3, descripcion: 'Importador de Registro C' }
      ];
      
      const mockResponse: BaseResponse<Catalogo[]> = {
        codigo: '200',
        mensaje: 'Importadores de registro obtenidos correctamente',
        datos: mockCatalogos,
        path: '/api/importe-record',
        timestamp: new Date().toISOString()
      };

      service.getImporteRecord().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.datos).toHaveLength(3);
        expect(response.datos![0].descripcion).toBe('Importador de Registro A');
        expect(response.datos![1].descripcion).toBe('Importador de Registro B');
        expect(response.datos![2].descripcion).toBe('Importador de Registro C');
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_IMPORTE_RECORD}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty array response', () => {
      const mockResponse: BaseResponse<Catalogo[]> = {
        codigo: '200',
        mensaje: 'No hay importadores de registro disponibles',
        datos: [],
        path: '/api/importe-record',
        timestamp: new Date().toISOString()
      };

      service.getImporteRecord().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.datos).toHaveLength(0);
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_IMPORTE_RECORD}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle single item response', () => {
      const mockCatalogos: Catalogo[] = [
        { id: 1, descripcion: 'Único Importador' }
      ];
      
      const mockResponse: BaseResponse<Catalogo[]> = {
        codigo: '200',
        mensaje: 'Un importador de registro disponible',
        datos: mockCatalogos,
        path: '/api/importe-record',
        timestamp: new Date().toISOString()
      };

      service.getImporteRecord().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.datos).toHaveLength(1);
        expect(response.datos![0].id).toBe(1);
        expect(response.datos![0].descripcion).toBe('Único Importador');
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_IMPORTE_RECORD}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle large dataset response', () => {
      const mockCatalogos: Catalogo[] = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        descripcion: `Importador ${i + 1}`
      }));
      
      const mockResponse: BaseResponse<Catalogo[]> = {
        codigo: '200',
        mensaje: 'Lista completa de importadores',
        datos: mockCatalogos,
        path: '/api/importe-record',
        timestamp: new Date().toISOString()
      };

      service.getImporteRecord().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.datos).toHaveLength(100);
        expect(response.datos![0].descripcion).toBe('Importador 1');
        expect(response.datos![99].descripcion).toBe('Importador 100');
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_IMPORTE_RECORD}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle items with special characters', () => {
      const mockCatalogos: Catalogo[] = [
        { id: 1, descripcion: 'Importador A & B Inc.' },
        { id: 2, descripcion: 'Importador "Especial"' },
        { id: 3, descripcion: 'Importador 100% Confiable' }
      ];
      
      const mockResponse: BaseResponse<Catalogo[]> = {
        codigo: '200',
        mensaje: 'Importadores con caracteres especiales',
        datos: mockCatalogos,
        path: '/api/importe-record',
        timestamp: new Date().toISOString()
      };

      service.getImporteRecord().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.datos![0].descripcion).toContain('&');
        expect(response.datos![1].descripcion).toContain('"');
        expect(response.datos![2].descripcion).toContain('%');
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_IMPORTE_RECORD}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error response with 404 status', () => {
      service.getImporteRecord().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_IMPORTE_RECORD}`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle error response with 500 status', () => {
      service.getImporteRecord().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_IMPORTE_RECORD}`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle timeout error', () => {
      service.getImporteRecord().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(408);
          expect(error.statusText).toBe('Request Timeout');
        }
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_IMPORTE_RECORD}`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush('Request Timeout', { status: 408, statusText: 'Request Timeout' });
    });

    it('should handle unauthorized error', () => {
      service.getImporteRecord().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.statusText).toBe('Unauthorized');
        }
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_IMPORTE_RECORD}`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle forbidden error', () => {
      service.getImporteRecord().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(403);
          expect(error.statusText).toBe('Forbidden');
        }
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_IMPORTE_RECORD}`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });

    it('should handle network error', () => {
      service.getImporteRecord().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.name).toBe('HttpErrorResponse');
        }
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_IMPORTE_RECORD}`;
      const req = httpMock.expectOne(expectedUrl);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle malformed JSON response', () => {
      service.getImporteRecord().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.name).toBe('HttpErrorResponse');
        }
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_IMPORTE_RECORD}`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush('Invalid JSON', { status: 200, statusText: 'OK' });
    });

    it('should construct correct URL with environment and API router', () => {
      const mockResponse: BaseResponse<Catalogo[]> = {
        codigo: '200',
        mensaje: 'Test',
        datos: [],
        path: '/api/importe-record',
        timestamp: new Date().toISOString()
      };

      service.getImporteRecord().subscribe();

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_IMPORTE_RECORD}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.url).toBe(expectedUrl);
      req.flush(mockResponse);
    });

    it('should return Observable of BaseResponse with Catalogo array', () => {
      const mockResponse: BaseResponse<Catalogo[]> = {
        codigo: '200',
        mensaje: 'Test',
        datos: [{ id: 1, descripcion: 'Test' }],
        path: '/api/importe-record',
        timestamp: new Date().toISOString()
      };

      const result = service.getImporteRecord();
      expect(result).toBeDefined();

      result.subscribe(response => {
        expect(response).toBeInstanceOf(Object);
        expect(response.codigo).toBeDefined();
        expect(response.datos).toBeInstanceOf(Array);
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_IMPORTE_RECORD}`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockResponse);
    });
  });
});