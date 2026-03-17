import { Solocitud10703Service } from './service10703.service';
import { Solicitud10703State, Tramite10703Store } from '../estados/tramite10703.store';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

jest.mock('@angular/common/http');

describe('Solocitud10703Service', () => {
  let service: Solocitud10703Service;
  let httpMock: jest.Mocked<HttpClient>;
  let tramite10703StoreMock: jest.Mocked<Tramite10703Store>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    } as any;

    tramite10703StoreMock = {
      setAduana: jest.fn()
    } as any;

    service = new Solocitud10703Service(httpMock, tramite10703StoreMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('exencionDeMercancias', () => {
    it('should call tramite10703Store.setAduana with the aduana from DATOS', () => {
      const datos: Solicitud10703State = { aduana: '123' } as any;
      service.exencionDeMercancias(datos);
      expect(tramite10703StoreMock.setAduana).toHaveBeenCalledWith('123');
    });

    it('should not throw if DATOS.aduana is undefined', () => {
      const datos: Solicitud10703State = {} as any;
      expect(() => service.exencionDeMercancias(datos)).not.toThrow();
      expect(tramite10703StoreMock.setAduana).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getExencionDeMercanciasData', () => {
    it('should call http.get with the correct URL', () => {
      const mockResponse = { aduana: 'test' } as unknown as Solicitud10703State;
      httpMock.get.mockReturnValue(of(mockResponse));
      service.getExencionDeMercanciasData().subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/10703/exencion_de_mercancias.json');
    });
  });

  describe('environment URLs', () => {
    it('should set urlServer and urlServerCatalogos from ENVIRONMENT', () => {
      expect(service.urlServer).toBeDefined();
      expect(service.urlServerCatalogos).toBeDefined();
    });
  });
});