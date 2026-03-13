import { ModificacionPermisoLabService } from './modificacion-permiso-lab.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import {
  DatosDelSolicituteSeccionState,
  DatosDelSolicituteSeccionStateStore
} from '../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import {
  PermisoImportacionBiologicaState,
  PermisoImportacionBiologicaStore
} from '../../../shared/estados/permiso-importacion-biologica.store';

jest.mock('@angular/common/http');

describe('ModificacionPermisoLabService', () => {
  let service: ModificacionPermisoLabService;
  let httpMock: jest.Mocked<HttpClient>;
  let datosStoreMock: jest.Mocked<DatosDelSolicituteSeccionStateStore>;
  let permisoStoreMock: jest.Mocked<PermisoImportacionBiologicaStore>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    } as any;

    datosStoreMock = {
      update: jest.fn()
    } as any;

    permisoStoreMock = {
      setClaveDeReferncia: jest.fn(),
      setCadenaDeLaDependencia: jest.fn(),
      setBanco: jest.fn(),
      setLlaveDePago: jest.fn(),
      setFechaDePago: jest.fn(),
      setImporteDePago: jest.fn()
    } as any;

    service = new ModificacionPermisoLabService(
      httpMock,
      datosStoreMock,
      permisoStoreMock
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('actualizarEstadoFormulario', () => {
    it('should call update on datosDelSolicituteSeccionStateStore with provided data', () => {
      const datos: DatosDelSolicituteSeccionState = { foo: 'bar' } as any;
      service.actualizarEstadoFormulario(datos);
      expect(datosStoreMock.update).toHaveBeenCalledWith(datos);
    });
  });

  describe('actualizarValoresFormularioPagoDerechos', () => {
    it('should call all setters on permisoImportacionBiologicaStore with correct values', () => {
      const datos: PermisoImportacionBiologicaState = {
        setClaveDeReferncia: 'clave',
        setCadenaDeLaDependencia: 'cadena',
        setBanco: 'banco',
        setLlaveDePago: 'llave',
        setFechaDePago: 'fecha',
        setImporteDePago: 123
      } as any;

      service.actualizarValoresFormularioPagoDerechos(datos);

      expect(permisoStoreMock.setClaveDeReferncia).toHaveBeenCalledWith('clave');
      expect(permisoStoreMock.setCadenaDeLaDependencia).toHaveBeenCalledWith('cadena');
      expect(permisoStoreMock.setBanco).toHaveBeenCalledWith('banco');
      expect(permisoStoreMock.setLlaveDePago).toHaveBeenCalledWith('llave');
      expect(permisoStoreMock.setFechaDePago).toHaveBeenCalledWith('fecha');
      expect(permisoStoreMock.setImporteDePago).toHaveBeenCalledWith(123);
    });
  });

  describe('obtenerDatosInicialesFormulario', () => {
    it('should call http.get with correct URL and return its observable', done => {
      const mockResponse: DatosDelSolicituteSeccionState = { foo: 'bar' } as any;
      httpMock.get.mockReturnValue(of(mockResponse));

      service.obtenerDatosInicialesFormulario().subscribe(res => {
        expect(res).toEqual(mockResponse);
        expect(httpMock.get).toHaveBeenCalledWith('assets/json/260918/inicializar_formulario.json');
        done();
      });
    });
  });

  describe('obtenerValoresFormularioPagoDerechos', () => {
    it('should call http.get with correct URL and return its observable', done => {
      const mockResponse: PermisoImportacionBiologicaState = { foo: 'bar' } as any;
      httpMock.get.mockReturnValue(of(mockResponse));

      service.obtenerValoresFormularioPagoDerechos().subscribe(res => {
        expect(res).toEqual(mockResponse);
        expect(httpMock.get).toHaveBeenCalledWith('assets/json/260918/inicializar-formulario-pago-derechos.json');
        done();
      });
    });
  });
});