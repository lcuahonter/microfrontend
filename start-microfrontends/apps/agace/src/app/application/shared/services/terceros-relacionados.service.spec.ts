import { TestBed } from '@angular/core/testing';
import { TercerosRelacionadosService } from './terceros-relacionados.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { TercerosRelacionadosStore } from '../estados/stores/terceros-relacionados.store';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('TercerosRelacionadosService', () => {
  let service: TercerosRelacionadosService;
  let httpMock: jest.Mocked<HttpClient>;
  let storeMock: jest.Mocked<TercerosRelacionadosStore>;

  beforeEach(() => {
    const httpClientMock = { get: jest.fn() } as unknown as jest.Mocked<HttpClient>;
    const store = {
      setDynamicFieldValue: jest.fn(),
    } as unknown as jest.Mocked<TercerosRelacionadosStore>;

    TestBed.configureTestingModule({
      providers: [
        TercerosRelacionadosService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: HttpClient, useValue: httpClientMock },
        { provide: TercerosRelacionadosStore, useValue: store }
      ]
    });

    service = TestBed.inject(TercerosRelacionadosService);
    httpMock = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
    storeMock = TestBed.inject(TercerosRelacionadosStore) as jest.Mocked<TercerosRelacionadosStore>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getEnlaceOperativoDatos (success)', (done) => {
    const mockResponse = { data: 'ok' };
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.getEnlaceOperativoDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('./assets/json/31602/enlace_tabla.json');
      done();
    });
  });

  it('should getEnlaceOperativoDatos (error)', (done) => {
    const error = new Error('fail');
    httpMock.get.mockReturnValueOnce(throwError(() => error));
    service.getEnlaceOperativoDatos().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should getPersonasParaDatos (success)', (done) => {
    const mockResponse = { data: 'personas' };
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.getPersonasParaDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('./assets/json/31602/personas-tabla.json');
      done();
    });
  });

  it('should getPersonasParaDatos (error)', (done) => {
    const error = new Error('fail');
    httpMock.get.mockReturnValueOnce(throwError(() => error));
    service.getPersonasParaDatos().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should getConsultaDatos (success)', (done) => {
    const mockResponse = { campo: 'valor' };
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.getConsultaDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('./assets/json/31602/consulta-tercer.json');
      done();
    });
  });

  it('should getConsultaDatos (error)', (done) => {
    const error = new Error('fail');
    httpMock.get.mockReturnValueOnce(throwError(() => error));
    service.getConsultaDatos().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should call setDynamicFieldValue in actualizarEstadoFormulario', () => {
    service.actualizarEstadoFormulario('campo', 123);
    expect(storeMock.setDynamicFieldValue).toHaveBeenCalledWith('campo', 123);
  });
});