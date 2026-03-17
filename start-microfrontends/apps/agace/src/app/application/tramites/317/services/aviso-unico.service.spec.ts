import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { AvisoUnicoService } from './aviso-unico.service';
import { AvisoValor, PreOperativo } from '../models/aviso.model';

describe('AvisoUnicoService', () => {
  let service: AvisoUnicoService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    const httpClientMock = {
      get: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        AvisoUnicoService,
        { provide: HttpClient, useValue: httpClientMock },
      ],
    });

    service = TestBed.inject(AvisoUnicoService);
    httpMock = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
  });

  describe('obtenerDatosLocalidad', () => {
    it('should return data from the JSON file', (done) => {
      const mockData = { localidad: 'test' };
      httpMock.get.mockReturnValueOnce(of(mockData));

      service.obtenerDatosLocalidad().subscribe((data) => {
        expect(data).toEqual(mockData);
        expect(httpMock.get).toHaveBeenCalledWith('assets/json/317/aviso.json');
        done();
      });
    });

    it('should handle error and propagate it', (done) => {
      const mockError = new Error('Test error');
      httpMock.get.mockReturnValueOnce(throwError(() => mockError));

      service.obtenerDatosLocalidad().subscribe({
        next: () => {
          fail('Should have errored');
        },
        error: (err) => {
          expect(err).toBe(mockError);
          done();
        },
      });
    });
  });

  describe('getSolicitante', () => {
    it('should return AvisoValor from the JSON file', (done) => {
      const mockAviso: AvisoValor = {
        claveReferencia: 'REF123',
        cadenaDependencia: 'DEP456',
        importePago: '1000',
      } as AvisoValor;
      httpMock.get.mockReturnValueOnce(of(mockAviso));

      service.getSolicitante().subscribe((data) => {
        expect(data).toEqual(mockAviso);
        expect(httpMock.get).toHaveBeenCalledWith(
          'assets/json/317/renovacion.json'
        );
        done();
      });
    });
  });

  describe('obtenerRadio', () => {
    it('should return PreOperativo[] from the JSON file', (done) => {
      const mockRadio: PreOperativo[] = [
        { label: 'Radio1', value: '1' },
        { label: 'Radio2', value: '2' },
      ];
      httpMock.get.mockReturnValueOnce(of(mockRadio));

      service.obtenerRadio().subscribe((data) => {
        expect(data).toEqual(mockRadio);
        expect(httpMock.get).toHaveBeenCalledWith(
          'assets/json/317/tipoPersonaradio.json'
        );
        done();
      });
    });
  });
});
