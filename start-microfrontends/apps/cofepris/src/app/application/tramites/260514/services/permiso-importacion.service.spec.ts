import { DatosDomicilioService } from './permiso-importacion.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('DatosDomicilioService', () => {
  let service: DatosDomicilioService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
      // ...other HttpClient methods if needed
    } as any;
    service = new DatosDomicilioService(httpMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http.get with correct URL for getObtenerTablaDatos', (done) => {
    const mockResponse = { data: 'test' } as any;
    httpMock.get.mockReturnValue(of(mockResponse));
    service.getObtenerTablaDatos().subscribe((res) => {
      expect(res).toBe(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/cofepris/clave-scian.json');
      done();
    });
  });

  it('should call http.get with correct URL for getObtenerMercanciasDatos', (done) => {
    const mockResponse = { mercancias: [] } as any;
    httpMock.get.mockReturnValue(of(mockResponse));
    service.getObtenerMercanciasDatos().subscribe((res) => {
      expect(res).toBe(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/cofepris/mercancias-tabla.json');
      done();
    });
  });

  it('should propagate error from getObtenerTablaDatos', (done) => {
    const error = new Error('fail');
    httpMock.get.mockReturnValue(throwError(() => error));
    service.getObtenerTablaDatos().subscribe({
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should propagate error from getObtenerMercanciasDatos', (done) => {
    const error = new Error('fail');
    httpMock.get.mockReturnValue(throwError(() => error));
    service.getObtenerMercanciasDatos().subscribe({
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });
});
