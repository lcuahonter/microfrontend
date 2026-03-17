import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiciosExtraordinariosService, JSONResponse } from './servicios-extraordinarios.service';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';

describe('ServiciosExtraordinariosService', () => {
  let service: ServiciosExtraordinariosService;
  let httpMock: HttpTestingController;

  // Mock data for testing
  const mockJSONResponse: JSONResponse = {
    id: 1,
    descripcion: 'Catálogo de prueba',
    codigo: 'CAT001',
    data: 'Información adicional de prueba'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiciosExtraordinariosService]
    });
    
    service = TestBed.inject(ServiciosExtraordinariosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  /**
   * Test service creation
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test constructor and initialization
   */
  it('should initialize with correct URL from environment', () => {
    expect(service.urlServerCatalogos).toBe(ENVIRONMENT.URL_SERVER_JSON_AUXILIAR);
  });

  it('should have http client injected', () => {
    expect(service['http']).toBeDefined();
  });

  /**
   * Tests for obtenerTramite method
   */
  describe('#obtenerTramite', () => {
    it('should fetch tramite data successfully', () => {
      // Arrange
      const tramiteId = 123;
      const expectedUrl = `${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${tramiteId}`;

      // Act
      service.obtenerTramite(tramiteId).subscribe((response: JSONResponse) => {
        // Assert
        expect(response).toEqual(mockJSONResponse);
        expect(response.id).toBe(mockJSONResponse.id);
        expect(response.descripcion).toBe(mockJSONResponse.descripcion);
        expect(response.codigo).toBe(mockJSONResponse.codigo);
        expect(response.data).toBe(mockJSONResponse.data);
      });

      // Assert HTTP request
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockJSONResponse);
    });

    it('should handle HTTP error responses', () => {
      // Arrange
      const tramiteId = 999;
      const expectedUrl = `${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${tramiteId}`;
      const errorMessage = 'Trámite no encontrado';

      // Act
      service.obtenerTramite(tramiteId).subscribe({
        next: () => fail('Expected an error, but got success'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      // Assert HTTP request and simulate error
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

    it('should handle server errors (500)', () => {
      // Arrange
      const tramiteId = 456;
      const expectedUrl = `${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${tramiteId}`;

      // Act
      service.obtenerTramite(tramiteId).subscribe({
        next: () => fail('Expected an error, but got success'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      // Assert HTTP request and simulate server error
      const req = httpMock.expectOne(expectedUrl);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle zero as tramite ID', () => {
      // Arrange
      const tramiteId = 0;
      const expectedUrl = `${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${tramiteId}`;

      // Act
      service.obtenerTramite(tramiteId).subscribe((response: JSONResponse) => {
        // Assert
        expect(response).toEqual(mockJSONResponse);
      });

      // Assert HTTP request
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockJSONResponse);
    });

    it('should handle negative tramite ID', () => {
      // Arrange
      const tramiteId = -1;
      const expectedUrl = `${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${tramiteId}`;

      // Act
      service.obtenerTramite(tramiteId).subscribe({
        next: () => fail('Expected an error for negative ID'),
        error: (error) => {
          // Assert
          expect(error.status).toBe(400);
        }
      });

      // Assert HTTP request
      const req = httpMock.expectOne(expectedUrl);
      req.flush('Invalid ID', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle large tramite ID numbers', () => {
      // Arrange
      const tramiteId = 999999999;
      const expectedUrl = `${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${tramiteId}`;

      // Act
      service.obtenerTramite(tramiteId).subscribe((response: JSONResponse) => {
        // Assert
        expect(response).toEqual(mockJSONResponse);
      });

      // Assert HTTP request
      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockJSONResponse);
    });
  });

  /**
   * Integration tests
   */
  describe('Integration tests', () => {
    it('should handle multiple concurrent requests', () => {
      // Arrange
      const tramiteIds = [1, 2, 3];
      const responses: JSONResponse[] = [];

      // Act - Make multiple concurrent requests
      tramiteIds.forEach(id => {
        service.obtenerTramite(id).subscribe(response => {
          responses.push(response);
        });
      });

      // Assert HTTP requests
      tramiteIds.forEach(id => {
        const req = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${id}`);
        expect(req.request.method).toBe('GET');
        req.flush({ ...mockJSONResponse, id });
      });

      // Assert results
      expect(responses).toHaveLength(3);
      expect(responses[0].id).toBe(1);
      expect(responses[1].id).toBe(2);
      expect(responses[2].id).toBe(3);
    });

    it('should handle mixed success and error responses', () => {
      // Arrange
      let successCount = 0;
      let errorCount = 0;

      // Act
      service.obtenerTramite(1).subscribe({
        next: () => successCount++,
        error: () => errorCount++
      });

      service.obtenerTramite(2).subscribe({
        next: () => successCount++,
        error: () => errorCount++
      });

      service.obtenerTramite(3).subscribe({
        next: () => successCount++,
        error: () => errorCount++
      });

      // Assert and simulate responses
      const req1 = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/1`);
      const req2 = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/2`);
      const req3 = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/3`);

      // Success for first two, error for third
      req1.flush(mockJSONResponse);
      req2.flush(mockJSONResponse);
      req3.flush('Error', { status: 404, statusText: 'Not Found' });

      // Assert results
      expect(successCount).toBe(2);
      expect(errorCount).toBe(1);
    });
  });

  /**
   * Edge case tests
   */
  describe('Edge cases', () => {
    it('should handle null response gracefully', () => {
      // Arrange
      const tramiteId = 123;

      // Act
      service.obtenerTramite(tramiteId).subscribe((response: JSONResponse) => {
        // Assert
        expect(response).toBeNull();
      });

      // Assert HTTP request
      const req = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${tramiteId}`);
      req.flush(null);
    });

    it('should handle empty response object', () => {
      // Arrange
      const tramiteId = 123;
      const emptyResponse = {} as JSONResponse;

      // Act
      service.obtenerTramite(tramiteId).subscribe((response: JSONResponse) => {
        // Assert
        expect(response).toEqual(emptyResponse);
      });

      // Assert HTTP request
      const req = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${tramiteId}`);
      req.flush(emptyResponse);
    });

    it('should handle malformed JSON gracefully', () => {
      // Arrange
      const tramiteId = 123;

      // Act
      service.obtenerTramite(tramiteId).subscribe({
        next: () => fail('Expected an error due to malformed JSON'),
        error: (error) => {
          // Assert
          expect(error).toBeDefined();
        }
      });

      // Assert HTTP request and simulate malformed response
      const req = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${tramiteId}`);
      req.error(new ErrorEvent('JSON Parse Error'));
    });
  });

  /**
   * Test error handling behavior
   */
  describe('Error handling', () => {
    it('should use catchError operator to handle errors', () => {
      // Arrange
      const tramiteId = 123;
      const spy = jest.spyOn(service, 'obtenerTramite');

      // Act
      service.obtenerTramite(tramiteId).subscribe({
        error: (error) => {
          // Assert - Error should be re-thrown by catchError
          expect(error).toBeDefined();
        }
      });

      // Assert HTTP request and simulate error
      const req = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${tramiteId}`);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

      expect(spy).toHaveBeenCalledWith(tramiteId);
    });

    it('should propagate HTTP errors correctly', () => {
      // Arrange
      const tramiteId = 123;
      let caughtError: any;

      // Act
      service.obtenerTramite(tramiteId).subscribe({
        error: (error) => {
          caughtError = error;
        }
      });

      // Assert HTTP request and simulate error
      const req = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${tramiteId}`);
      const mockError = { status: 403, statusText: 'Forbidden' };
      req.flush('Access denied', mockError);

      expect(caughtError.status).toBe(403);
      expect(caughtError.statusText).toBe('Forbidden');
    });
  });
});
