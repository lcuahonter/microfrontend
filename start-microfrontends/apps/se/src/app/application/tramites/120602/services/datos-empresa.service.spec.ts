import { TestBed } from '@angular/core/testing';
import { DatosEmpresaService } from './datos-empresa.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Tramite120602Store } from '../estados/tramite-120602.store';
import { Tramite120602Query } from '../estados/tramite-120602.query';

describe('DatosEmpresaService', () => {
  let service: DatosEmpresaService;
  let httpMock: any;
  let storeMock: any;
  let queryMock: any;

  beforeEach(() => {
    httpMock = { get: jest.fn() };
    storeMock = {
      setNacionalidad: jest.fn(),
      setPersona: jest.fn(),
      setCadenaDependencia: jest.fn(),
      setTipoDeEmpresa: jest.fn(),
      setActividadEconomicaClave: jest.fn(),
      setEstado: jest.fn(),
      setRepresentacion: jest.fn()
    };
    queryMock = {};

    TestBed.configureTestingModule({
      providers: [
        DatosEmpresaService,
        { provide: HttpClient, useValue: httpMock },
        { provide: Tramite120602Store, useValue: storeMock },
        { provide: Tramite120602Query, useValue: queryMock }
      ]
    });

    service = TestBed.inject(DatosEmpresaService);
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerDatosTablaDeSocios debe llamar a http.get con la URL correcta', () => {
    httpMock.get.mockReturnValue(of([]));
    service.obtenerDatosTablaDeSocios().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('/assets/json/120602/datosSocios-table.json');
  });

  it('obtenerEstado debe llamar a http.get con la URL correcta', () => {
    httpMock.get.mockReturnValue(of([]));
    service.obtenerEstado().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('/assets/json/120602/tipoDeEmpresa.json');
  });

  it('obtenerDatosDeRepresentacionFederal debe llamar a http.get con la URL correcta', () => {
    httpMock.get.mockReturnValue(of([]));
    service.obtenerDatosDeRepresentacionFederal().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('/assets/json/120602/representacionFederal.json');
  });

  it('ObtenerTablaDeRepresentaciónFederal debe llamar a http.get con la URL correcta', () => {
    httpMock.get.mockReturnValue(of([]));
    service.ObtenerTablaDeRepresentaciónFederal().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('/assets/json/120602/representacionFederal-table.json');
  });

  it('getRegistroTomaMuestrasMercanciasData debe llamar a http.get con la URL correcta', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getRegistroTomaMuestrasMercanciasData().subscribe();
    expect(httpMock.get).toHaveBeenCalledWith('/assets/json/120602/datosEmpresa.json');
  });

  it('actualizarEstadoFormulario debe actualizar el store con FormSolicitud.datosImportadorExportador', () => {
    const datos = {
      FormSolicitud: {
        datosImportadorExportador: {
          nacionalidad: 'MX',
          persona: 'FISICA',
          cadenaDependencia: 'cadena'
        }
      },
      solicitudForm: undefined,
      representacionFederal: undefined
    };
    service.actualizarEstadoFormulario(datos as any);
    expect(storeMock.setNacionalidad).toHaveBeenCalledWith('MX');
    expect(storeMock.setPersona).toHaveBeenCalledWith('FISICA');
    expect(storeMock.setCadenaDependencia).toHaveBeenCalledWith('cadena');
  });

  it('actualizarEstadoFormulario debe actualizar el store con solicitudForm.tipoDeEmpresa y actividadEconomicaClave', () => {
    const datos = {
      FormSolicitud: {},
      solicitudForm: {
        tipoDeEmpresa: { id: 5 },
        actividadEconomicaClave: 'clave'
      },
      representacionFederal: undefined
    };
    service.actualizarEstadoFormulario(datos as any);
    expect(storeMock.setTipoDeEmpresa).toHaveBeenCalledWith('5');
    expect(storeMock.setActividadEconomicaClave).toHaveBeenCalledWith('clave');
  });

  it('actualizarEstadoFormulario debe actualizar el store con representacionFederal', () => {
    const datos = {
      FormSolicitud: {},
      solicitudForm: {},
      representacionFederal: {
        estado: { id: 7 },
        representacion: { id: 8 }
      }
    };
    service.actualizarEstadoFormulario(datos as any);
    expect(storeMock.setEstado).toHaveBeenCalledWith('7');
    expect(storeMock.setRepresentacion).toHaveBeenCalledWith('8');
  });
});