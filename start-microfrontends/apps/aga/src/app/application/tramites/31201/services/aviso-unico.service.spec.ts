import { TestBed } from '@angular/core/testing';
import { AvisoUnicoService } from './aviso-unico.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { AvisoValor, PreOperativo } from '../models/aviso.model';

describe('AvisoUnicoService', () => {
  let service: AvisoUnicoService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    const httpMock = {
      get: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AvisoUnicoService,
        { provide: HttpClient, useValue: httpMock }
      ]
    });

    service = TestBed.inject(AvisoUnicoService);
    httpClientMock = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
  });

  describe('obtenerDatosLocalidad', () => {
    it('should return data when http get is successful', (done) => {
      const mockData = { localidad: 'ABC' };
      httpClientMock.get.mockReturnValue(of(mockData));

      service.obtenerDatosLocalidad().subscribe(data => {
        expect(data).toEqual(mockData);
        expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/31201/aviso.json');
        done();
      });
    });

    it('should throw error when http get fails', (done) => {
      const errorResponse = new Error('Error');
      httpClientMock.get.mockReturnValue(throwError(() => errorResponse));

      service.obtenerDatosLocalidad().subscribe({
        next: () => {},
        error: (error) => {
          expect(error).toBe(errorResponse);
          expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/31201/aviso.json');
          done();
        }
      });
    });
  });

  describe('getSolicitante', () => {
    it('should return AvisoValor data from JSON', (done) => {
      const mockSolicitante: AvisoValor = {
        claveReferencia: 'REF001',
        cadenaDependencia: 'DEP001',
        importePago: '1500'
      };

      httpClientMock.get.mockReturnValue(of(mockSolicitante));

      service.getSolicitante().subscribe(data => {
        expect(data).toEqual(mockSolicitante);
        expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/31201/renovacion.json');
        done();
      });
    });
  });

  describe('obtenerRadio', () => {
    it('should return array of PreOperativo', (done) => {
      const mockRadios: PreOperativo[] = [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' }
      ];

      httpClientMock.get.mockReturnValue(of(mockRadios));

      service.obtenerRadio().subscribe(data => {
        expect(data).toEqual(mockRadios);
        expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/31201/tipoPersonaradio.json');
        done();
      });
    });
  });
});
