import { AvisoDeReciclajeServiceService } from './aviso-de-reciclaje-service.service';
import { DatoSolicitudStore } from '../estados/tramites/dato-solicitud.store';
import { EstadoDatoSolicitud } from '../models/datos-solicitud.model';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('AvisoDeReciclajeServiceService', () => {
  let service: AvisoDeReciclajeServiceService;
  let httpMock: jest.Mocked<HttpClient>;
  let storeMock: jest.Mocked<DatoSolicitudStore>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    } as any;

    storeMock = {
      actualizarSolicitudForm: jest.fn(),
      actualizarEmpresaReciclaje: jest.fn(),
      actualizarLugarReciclaje: jest.fn(),
      actualizarEmpresaTransportista: jest.fn(),
      actualizarPrecaucionesManejo: jest.fn()
    } as any;

    service = new AvisoDeReciclajeServiceService(httpMock, storeMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call store methods in actualizarEstadoFormulario', () => {
    const datos: EstadoDatoSolicitud = {
      solicitudForm: { a: 1 } as any,
      empresaReciclaje: { b: 2 } as any,
      lugarReciclaje: { c: 3 } as any,
      empresaTransportista: { d: 4 } as any,
      precaucionesManejo: { e: 5 } as any
    };
    service.actualizarEstadoFormulario(datos);
    expect(storeMock.actualizarSolicitudForm).toHaveBeenCalledWith(datos.solicitudForm);
    expect(storeMock.actualizarEmpresaReciclaje).toHaveBeenCalledWith(datos.empresaReciclaje);
    expect(storeMock.actualizarLugarReciclaje).toHaveBeenCalledWith(datos.lugarReciclaje);
    expect(storeMock.actualizarEmpresaTransportista).toHaveBeenCalledWith(datos.empresaTransportista);
    expect(storeMock.actualizarPrecaucionesManejo).toHaveBeenCalledWith(datos.precaucionesManejo);
  });

  it('should get datos solicitud inicial', () => {
    const mockResponse = { foo: 'bar' } as unknown as EstadoDatoSolicitud;
    httpMock.get.mockReturnValue(of(mockResponse));
    service.obtenerDatosSolicitudInicial().subscribe(res => {
      expect(res).toBe(mockResponse);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/231003/inicializar-formulario-datos.json');
  });

  it('should get datos completos formulario', () => {
    const mockResponse = { foo: 'baz' } as unknown as EstadoDatoSolicitud;
    httpMock.get.mockReturnValue(of(mockResponse));
    service.obtenerDatosCompletosFormulario().subscribe(res => {
      expect(res).toBe(mockResponse);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/231003/inicializar-formulario-datos-residuos.json');
  });
});