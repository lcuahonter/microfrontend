import { TestBed } from '@angular/core/testing';
import { RegistroSolicitudService, SolicitudDatosResponse } from './registro-solicitud-service.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Tramite31803Store } from '../state/Tramite31803.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RegistroSolicitudService', () => {
  let service: RegistroSolicitudService;
  let httpClientSpy: jest.Mocked<HttpClient>;
  let tramite31803StoreSpy: jest.Mocked<Tramite31803Store>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(()=> of())
    } as any;

    tramite31803StoreSpy = {
      setNumeroOficio: jest.fn(),
      setClaveReferencia: jest.fn(),
      setCadenaDependencia: jest.fn(),
      setImportePago: jest.fn(),
      setFechaInicial: jest.fn(),
      setFechaFinal: jest.fn(),
      setBanco: jest.fn(),
      setNumeroOperacion: jest.fn(),
      setLlave: jest.fn(),
      setManifiesto1: jest.fn(),
      setManifiesto2: jest.fn(),
      setFechaPago: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [
        RegistroSolicitudService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Tramite31803Store, useValue: tramite31803StoreSpy }
      ]
    });

    service = TestBed.inject(RegistroSolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

    it('should update the store with provided data', () => {
      const datos = {
        numeroOficio: 'OF12345',
        claveReferencia: 'REF123',
        cadenaDependencia: 'DEP123',
        importePago: '1000',
        fechaInicial: '2024-01-01',
        fechaFinal: '2024-12-31',
        banco: 'Banco Test',
        numeroOperacion: '123',
        llave: 'abc',
        manifiesto1: 'man1',
        manifiesto2: 'man2',
        fechaPago: '2024-01-01'
      } as any;

      service.actualizarEstadoFormulario(datos);

      expect(tramite31803StoreSpy.setNumeroOficio).toHaveBeenCalledWith(datos.numeroOficio);
      expect(tramite31803StoreSpy.setClaveReferencia).toHaveBeenCalledWith(datos.claveReferencia);
      expect(tramite31803StoreSpy.setCadenaDependencia).toHaveBeenCalledWith(datos.cadenaDependencia);
      expect(tramite31803StoreSpy.setImportePago).toHaveBeenCalledWith(datos.importePago);
      expect(tramite31803StoreSpy.setFechaInicial).toHaveBeenCalledWith(datos.fechaInicial);
      expect(tramite31803StoreSpy.setFechaFinal).toHaveBeenCalledWith(datos.fechaFinal);
      expect(tramite31803StoreSpy.setBanco).toHaveBeenCalledWith(datos.banco);
      expect(tramite31803StoreSpy.setNumeroOperacion).toHaveBeenCalledWith(datos.numeroOperacion);
      expect(tramite31803StoreSpy.setLlave).toHaveBeenCalledWith(datos.llave);
      expect(tramite31803StoreSpy.setManifiesto1).toHaveBeenCalledWith(datos.manifiesto1);
      expect(tramite31803StoreSpy.setManifiesto2).toHaveBeenCalledWith(datos.manifiesto2);
      expect(tramite31803StoreSpy.setFechaPago).toHaveBeenCalledWith(datos.fechaPago);
    });

    it('should handle undefined values in data', () => {
      const datos = {
        numeroOficio: undefined,
        claveReferencia: undefined,
        cadenaDependencia: undefined,
        importePago: undefined,
        fechaInicial: undefined,
        fechaFinal: undefined,
        banco: undefined,
        numeroOperacion: '123',
        llave: 'abc',
        manifiesto1: 'man1',
        manifiesto2: 'man2',
        fechaPago: '2024-01-01'
      } as any;

      service.actualizarEstadoFormulario(datos);

      expect(tramite31803StoreSpy.setNumeroOficio).toHaveBeenCalledWith(undefined);
      expect(tramite31803StoreSpy.setClaveReferencia).toHaveBeenCalledWith(undefined);
      expect(tramite31803StoreSpy.setCadenaDependencia).toHaveBeenCalledWith(undefined);
      expect(tramite31803StoreSpy.setImportePago).toHaveBeenCalledWith(undefined);
      expect(tramite31803StoreSpy.setFechaInicial).toHaveBeenCalledWith(undefined);
      expect(tramite31803StoreSpy.setFechaFinal).toHaveBeenCalledWith(undefined);
      expect(tramite31803StoreSpy.setBanco).toHaveBeenCalledWith(undefined);
      expect(tramite31803StoreSpy.setNumeroOperacion).toHaveBeenCalledWith('123');
      expect(tramite31803StoreSpy.setLlave).toHaveBeenCalledWith('abc');
      expect(tramite31803StoreSpy.setManifiesto1).toHaveBeenCalledWith('man1');
      expect(tramite31803StoreSpy.setManifiesto2).toHaveBeenCalledWith('man2');
      expect(tramite31803StoreSpy.setFechaPago).toHaveBeenCalledWith('2024-01-01');
    });

    it('should call http.get with correct URL and return Catalogo[]', (done) => {
      const mockCatalogos: Catalogo[] = [{ id: 1, descripcion: 'Banco1' }];
      httpClientSpy.get.mockReturnValue(of(mockCatalogos));

      service.obtenerDatosBanco().subscribe(result => {
        expect(result).toEqual(mockCatalogos);
        expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31803/banco.json');
        done();
      });
    });

    it('should call http.get with correct URL and return SolicitudDatosResponse', (done) => {
      const mockResponse: SolicitudDatosResponse = {
        numeroOperacion: '123',
        banco: 'Banco1',
        llave: 'abc',
        manifiesto1: 'man1',
        manifiesto2: 'man2',
        fechaPago: '2024-01-01'
      };
      httpClientSpy.get.mockReturnValue(of(mockResponse));

      service.getRegistroTomaMuestrasMercanciasData().subscribe(result => {
        expect(result).toEqual(mockResponse);
        expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31803/solicitud-banco.json');
        done();
      });
    });

    it('should handle empty catalogo response for obtenerDatosBanco', (done) => {
      const mockCatalogos: Catalogo[] = [];
      httpClientSpy.get.mockReturnValue(of(mockCatalogos));

      service.obtenerDatosBanco().subscribe(result => {
        expect(result).toEqual([]);
        expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31803/banco.json');
        done();
      });
    });

    it('should update all store properties with complete data', () => {
      const datos = {
        numeroOficio: 'OF12345',
        claveReferencia: 'REF123',
        cadenaDependencia: 'DEP123',
        importePago: '1500.50',
        fechaInicial: '2024-01-01',
        fechaFinal: '2024-12-31',
        banco: 'BBVA',
        numeroOperacion: 'OP456789',
        llave: 'KEY123ABC',
        manifiesto1: 'MAN001',
        manifiesto2: 'MAN002',
        fechaPago: '2024-06-15'
      } as any;

      service.actualizarEstadoFormulario(datos);

      // Verify all methods were called exactly once
      expect(tramite31803StoreSpy.setNumeroOficio).toHaveBeenCalledTimes(1);
      expect(tramite31803StoreSpy.setClaveReferencia).toHaveBeenCalledTimes(1);
      expect(tramite31803StoreSpy.setCadenaDependencia).toHaveBeenCalledTimes(1);
      expect(tramite31803StoreSpy.setImportePago).toHaveBeenCalledTimes(1);
      expect(tramite31803StoreSpy.setFechaInicial).toHaveBeenCalledTimes(1);
      expect(tramite31803StoreSpy.setFechaFinal).toHaveBeenCalledTimes(1);
      expect(tramite31803StoreSpy.setBanco).toHaveBeenCalledTimes(1);
      expect(tramite31803StoreSpy.setNumeroOperacion).toHaveBeenCalledTimes(1);
      expect(tramite31803StoreSpy.setLlave).toHaveBeenCalledTimes(1);
      expect(tramite31803StoreSpy.setManifiesto1).toHaveBeenCalledTimes(1);
      expect(tramite31803StoreSpy.setManifiesto2).toHaveBeenCalledTimes(1);
      expect(tramite31803StoreSpy.setFechaPago).toHaveBeenCalledTimes(1);
    });
});