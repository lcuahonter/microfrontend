// @ts-nocheck
import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { DatosSolicitudService } from './datos-solicitud.service';
import { RespuestaCatalogos } from '../models/datos-solicitud.model';
import { Catalogo } from '@ng-mf/data-access-user';

@Injectable()
class MockHttpClient {
  get = jest.fn();
  post = jest.fn();
}

describe('DatosSolicitudService', () => {
  let service: DatosSolicitudService;
  let mockHttpClient: MockHttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatosSolicitudService,
        { provide: HttpClient, useClass: MockHttpClient }
      ]
    });
    service = TestBed.inject(DatosSolicitudService);
    mockHttpClient = TestBed.inject(HttpClient) as any;
  });

  describe('obtenerRespuestaPorUrl', () => {
    it('should call httpServicios.get and assign data when response code is 200', () => {
      const mockResponse: RespuestaCatalogos = {
        code: 200,
        data: [{ id: 1, descripcion: 'Test' }],
        message: 'Success'
      };
      const mockSelf = {};
      const variable = 'testVariable';
      const url = '/test-url';

      mockHttpClient.get.mockReturnValue(observableOf(mockResponse));

      service.obtenerRespuestaPorUrl(mockSelf, variable, url);

      expect(mockHttpClient.get).toHaveBeenCalledWith('assets/json/test-url');
      // Allow time for subscription to complete
      setTimeout(() => {
        expect(mockSelf[variable]).toEqual(mockResponse.data);
      }, 0);
    });

    it('should assign empty array when response code is not 200', () => {
      const mockResponse: RespuestaCatalogos = {
        code: 404,
        data: [{ id: 1, descripcion: 'Test' }],
        message: 'Not Found'
      };
      const mockSelf = {};
      const variable = 'testVariable';
      const url = '/test-url';

      mockHttpClient.get.mockReturnValue(observableOf(mockResponse));

      service.obtenerRespuestaPorUrl(mockSelf, variable, url);

      setTimeout(() => {
        expect(mockSelf[variable]).toEqual([]);
      }, 0);
    });

    it('should assign empty array when response data is null', () => {
      const mockResponse: RespuestaCatalogos = {
        code: 200,
        data: null as any,
        message: 'Success'
      };
      const mockSelf = {};
      const variable = 'testVariable';
      const url = '/test-url';

      mockHttpClient.get.mockReturnValue(observableOf(mockResponse));

      service.obtenerRespuestaPorUrl(mockSelf, variable, url);

      setTimeout(() => {
        expect(mockSelf[variable]).toEqual([]);
      }, 0);
    });

    it('should not call httpServicios.get when self is null', () => {
      service.obtenerRespuestaPorUrl(null, 'variable', '/url');
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });

    it('should not call httpServicios.get when variable is empty', () => {
      service.obtenerRespuestaPorUrl({}, '', '/url');
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });

    it('should not call httpServicios.get when url is empty', () => {
      service.obtenerRespuestaPorUrl({}, 'variable', '');
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });
  });

  describe('obtenerListaPaises', () => {
    it('should return Observable<Catalogo[]> with pais data', (done) => {
      const mockData = {
        pais: [{ id: 1, descripcion: 'Mexico' }, { id: 2, descripcion: 'USA' }]
      };
      mockHttpClient.get.mockReturnValue(observableOf(mockData));

      service.obtenerListaPaises().subscribe(result => {
        expect(result).toEqual(mockData.pais);
        expect(mockHttpClient.get).toHaveBeenCalledWith('assets/json/cofepris/domicilio.json');
        done();
      });
    });

    it('should handle empty pais data', (done) => {
      const mockData = { pais: [] };
      mockHttpClient.get.mockReturnValue(observableOf(mockData));

      service.obtenerListaPaises().subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });

    it('should handle http error', (done) => {
      mockHttpClient.get.mockReturnValue(throwError('HTTP Error'));

      service.obtenerListaPaises().subscribe({
        next: () => fail('Should have thrown error'),
        error: (error) => {
          expect(error).toBe('HTTP Error');
          done();
        }
      });
    });
  });

  describe('obtenerListaEstados', () => {
    it('should return Observable<Catalogo[]> with estado data', (done) => {
      const mockData = {
        estado: [{ id: 1, descripcion: 'CDMX' }, { id: 2, descripcion: 'Jalisco' }]
      };
      mockHttpClient.get.mockReturnValue(observableOf(mockData));

      service.obtenerListaEstados().subscribe(result => {
        expect(result).toEqual(mockData.estado);
        expect(mockHttpClient.get).toHaveBeenCalledWith('assets/json/cofepris/domicilio.json');
        done();
      });
    });

    it('should handle empty estado data', (done) => {
      const mockData = { estado: [] };
      mockHttpClient.get.mockReturnValue(observableOf(mockData));

      service.obtenerListaEstados().subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  describe('getBancoDatos', () => {
    it('should return Observable<Catalogo[]> with banco data', (done) => {
      const mockData = {
        banco: [{ id: 1, descripcion: 'BBVA' }, { id: 2, descripcion: 'Santander' }]
      };
      mockHttpClient.get.mockReturnValue(observableOf(mockData));

      service.getBancoDatos().subscribe(result => {
        expect(result).toEqual(mockData.banco);
        expect(mockHttpClient.get).toHaveBeenCalledWith('assets/json/cofepris/bancoDatos.json');
        done();
      });
    });

    it('should handle empty banco data', (done) => {
      const mockData = { banco: [] };
      mockHttpClient.get.mockReturnValue(observableOf(mockData));

      service.getBancoDatos().subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  describe('obtenerListaMunicipios', () => {
    it('should return Observable<Catalogo[]> with municipio data', (done) => {
      const mockData = {
        municipio: [{ id: 1, descripcion: 'Miguel Hidalgo' }, { id: 2, descripcion: 'Benito Juarez' }]
      };
      mockHttpClient.get.mockReturnValue(observableOf(mockData));

      service.obtenerListaMunicipios().subscribe(result => {
        expect(result).toEqual(mockData.municipio);
        expect(mockHttpClient.get).toHaveBeenCalledWith('assets/json/cofepris/domicilio.json');
        done();
      });
    });

    it('should handle empty municipio data', (done) => {
      const mockData = { municipio: [] };
      mockHttpClient.get.mockReturnValue(observableOf(mockData));

      service.obtenerListaMunicipios().subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  describe('obtenerListaLocalidades', () => {
    it('should return Observable<Catalogo[]> with localidad data', (done) => {
      const mockData = {
        localidad: [{ id: 1, descripcion: 'Centro' }, { id: 2, descripcion: 'Norte' }]
      };
      mockHttpClient.get.mockReturnValue(observableOf(mockData));

      service.obtenerListaLocalidades().subscribe(result => {
        expect(result).toEqual(mockData.localidad);
        expect(mockHttpClient.get).toHaveBeenCalledWith('assets/json/cofepris/domicilio.json');
        done();
      });
    });

    it('should handle empty localidad data', (done) => {
      const mockData = { localidad: [] };
      mockHttpClient.get.mockReturnValue(observableOf(mockData));

      service.obtenerListaLocalidades().subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  describe('obtenerListaCodigosPostales', () => {
    it('should return Observable<Catalogo[]> with codigo_postal data', (done) => {
      const mockData = {
        codigo_postal: [{ id: 1, descripcion: '01000' }, { id: 2, descripcion: '01010' }]
      };
      mockHttpClient.get.mockReturnValue(observableOf(mockData));

      service.obtenerListaCodigosPostales().subscribe(result => {
        expect(result).toEqual(mockData.codigo_postal);
        expect(mockHttpClient.get).toHaveBeenCalledWith('assets/json/cofepris/domicilio.json');
        done();
      });
    });

    it('should handle empty codigo_postal data', (done) => {
      const mockData = { codigo_postal: [] };
      mockHttpClient.get.mockReturnValue(observableOf(mockData));

      service.obtenerListaCodigosPostales().subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  describe('obtenerListaColonias', () => {
    it('should return Observable<Catalogo[]> with colonia data', (done) => {
      const mockData = {
        colonia: [{ id: 1, descripcion: 'Roma Norte' }, { id: 2, descripcion: 'Condesa' }]
      };
      mockHttpClient.get.mockReturnValue(observableOf(mockData));

      service.obtenerListaColonias().subscribe(result => {
        expect(result).toEqual(mockData.colonia);
        expect(mockHttpClient.get).toHaveBeenCalledWith('assets/json/cofepris/domicilio.json');
        done();
      });
    });

    it('should handle empty colonia data', (done) => {
      const mockData = { colonia: [] };
      mockHttpClient.get.mockReturnValue(observableOf(mockData));

      service.obtenerListaColonias().subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  describe('Service Creation and Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have correct jsonUrl property', () => {
      expect((service as any).jsonUrl).toBe('assets/json/cofepris/domicilio.json');
    });

    it('should have httpServicios injected', () => {
      expect(service.httpServicios).toBeTruthy();
      expect(service.httpServicios).toBe(mockHttpClient);
    });
  });

});