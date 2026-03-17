import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnioConstanciaService } from './anio-constancia.service';
import { Catalogo, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { API_GET_ANIOS_AUTORIZACION } from '../../server/api-router';

describe('AnioConstanciaService', () => {
  let service: AnioConstanciaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnioConstanciaService]
    });
    service = TestBed.inject(AnioConstanciaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct host URL', () => {
    expect((service as any).host).toBe(`${ENVIRONMENT.API_HOST}/api/`);
  });

  describe('Constructor', () => {
    it('should initialize host property correctly', () => {
      const expectedHost = `${ENVIRONMENT.API_HOST}/api/`;
      expect((service as any).host).toBe(expectedHost);
    });
  });

  describe('getAnios', () => {
    it('should send GET request to correct endpoint', () => {
      const mockCatalogos: Catalogo[] = [
        { id: 1, descripcion: '2022' },
        { id: 2, descripcion: '2023' },
        { id: 3, descripcion: '2024' }
      ];
      
      const mockResponse: BaseResponse<Catalogo[]> = {
        codigo: '200',
        mensaje: 'Años obtenidos correctamente',
        datos: mockCatalogos,
        path: '/api/anios',
        timestamp: new Date().toISOString()
      };

      service.getAnios().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.datos).toHaveLength(3);
        expect(response.datos![0].descripcion).toBe('2022');
        expect(response.datos![1].descripcion).toBe('2023');
        expect(response.datos![2].descripcion).toBe('2024');
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_ANIOS_AUTORIZACION}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty array response', () => {
      const mockResponse: BaseResponse<Catalogo[]> = {
        codigo: '200',
        mensaje: 'No hay años disponibles',
        datos: [],
        path: '/api/anios',
        timestamp: new Date().toISOString()
      };

      service.getAnios().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.datos).toHaveLength(0);
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_ANIOS_AUTORIZACION}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle single item response', () => {
      const mockCatalogos: Catalogo[] = [
        { id: 1, descripcion: '2024' }
      ];
      
      const mockResponse: BaseResponse<Catalogo[]> = {
        codigo: '200',
        mensaje: 'Un año disponible',
        datos: mockCatalogos,
        path: '/api/anios',
        timestamp: new Date().toISOString()
      };

      service.getAnios().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.datos).toHaveLength(1);
        expect(response.datos![0].id).toBe(1);
        expect(response.datos![0].descripcion).toBe('2024');
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_ANIOS_AUTORIZACION}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error response with 404 status', () => {
      service.getAnios().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_ANIOS_AUTORIZACION}`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle error response with 500 status', () => {
      service.getAnios().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_ANIOS_AUTORIZACION}`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error', () => {
      service.getAnios().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.name).toBe('HttpErrorResponse');
        }
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_ANIOS_AUTORIZACION}`;
      const req = httpMock.expectOne(expectedUrl);
      req.error(new ErrorEvent('Network error'));
    });
  });
});