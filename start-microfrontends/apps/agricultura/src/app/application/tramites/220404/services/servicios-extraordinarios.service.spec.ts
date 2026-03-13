import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiciosExtraordinariosService, JSONResponse } from './servicios-extraordinarios.service';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';

describe('ServiciosExtraordinariosService', () => {
  let service: ServiciosExtraordinariosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiciosExtraordinariosService],
    });

    service = TestBed.inject(ServiciosExtraordinariosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('obtenerTramite', () => {
    it('should fetch tramite data from the correct URL', () => {
      const mockResponse: JSONResponse = {
        id: 1,
        descripcion: 'Test Tramite',
        codigo: 'TRM123',
        data: 'Some data',
      };

      const id = 1;

      service.obtenerTramite(id).subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle errors when the HTTP request fails', () => {
      const id = 1;
      const mockError = { status: 404, statusText: 'Not Found' };

      service.obtenerTramite(id).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        },
      });

      const req = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(null, mockError);
    });
  });
});