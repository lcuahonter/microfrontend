import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { EsquemaDeCertificacionService } from './esquema-de-certificacion.service';
import { Tramite32612Store } from '../estados/solicitud32612.store';
import { Tramite32612DosStore } from '../estados/solicitud32612Dos.store';
import { ENVIRONMENT, JSONResponse } from '@libs/shared/data-access-user/src';

jest.mock('@libs/shared/data-access-user/src', () => ({
  ENVIRONMENT: { URL_SERVER_JSON_AUXILIAR: 'http://test-url' }
}));

describe('EsquemaDeCertificacionService', () => {
  let service: EsquemaDeCertificacionService;
  let httpClientMock: jest.Mocked<HttpClient>;
  let tramiteStoreMock: jest.Mocked<Tramite32612Store>;
  let tramiteDosStoreMock: jest.Mocked<Tramite32612DosStore>;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn()
    } as any;

    tramiteStoreMock = {
      setDynamicFieldValue: jest.fn()
    } as any;

    tramiteDosStoreMock = {
      setNumeroPatente: jest.fn(),
      setNumeroRegistro: jest.fn(),
      setNombreAgenteAduanal: jest.fn(),
      setNumeroTrabajadoresIMSS: jest.fn(),
      setNumeroTrabajadoresContratistas: jest.fn(),
      setServiciosAdicionales: jest.fn(),
      setIndique: jest.fn(),
      setNumeroDeRegistro: jest.fn(),
      setOrganismoCertificador: jest.fn(),
      setNombrePrograma: jest.fn(),
      setOpcion: jest.fn(),
      setSuperficieInstalacion: jest.fn(),
      setNumeroEmpleados: jest.fn(),
      setOperacionesMensualesExp: jest.fn(),
      setOperacionesMensualesImp: jest.fn(),
      setTiposServicios: jest.fn(),
      setActividadPreponderante: jest.fn(),
      setAntiguedadInstalacion: jest.fn(),
      setTipoInstalacion: jest.fn(),
      setNombreAgenciaAduanal: jest.fn()
    } as any;

    service = new EsquemaDeCertificacionService(
      httpClientMock,
      tramiteStoreMock,
      tramiteDosStoreMock
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerTramite should call http.get with correct URL', (done) => {
    const mockResponse: JSONResponse = {
      id: 1,
      descripcion: 'Success',
      codigo: '200',
      data: ''
    };
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.obtenerTramite(123).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClientMock.get).toHaveBeenCalledWith('http://test-url/123');
      done();
    });
  });

  it('obtenerTramite should handle error', (done) => {
    httpClientMock.get.mockReturnValue(throwError(() => new Error('fail')));
    service.obtenerTramite(123).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('fail');
        done();
      }
    });
  });

  it('getIndiqueCatalogo should call http.get with correct URL', () => {
    httpClientMock.get.mockReturnValue(of({}));
    service.getIndiqueCatalogo().subscribe();
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/32612/catalog-indique.json');
  });

  it('should getIndiqueCatalogo (error)', (done) => {
    const error = new Error('fail');
    httpClientMock.get.mockReturnValueOnce(throwError(() => error));
    service.getIndiqueCatalogo().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('actualizarEstadoFormulario should call tramiteStore.setDynamicFieldValue', () => {
    service.actualizarEstadoFormulario('campo', 'valor');
    expect(tramiteStoreMock.setDynamicFieldValue).toHaveBeenCalledWith('campo', 'valor');
  });

  it('estadoFormulario should call tramiteDosStore setters', () => {
    const datos: any = {
      numeroPatente: 1,
      numeroRegistro: 2,
      nombreAgenteAduanal: 'Agente',
      numeroTrabajadoresIMSS: 3,
      numeroTrabajadoresContratistas: 4,
      serviciosAdicionales: 'servicio',
      indique: 'indique'
    };
    service.estadoFormulario(datos);
    expect(tramiteDosStoreMock.setNumeroPatente).toHaveBeenCalledWith(1);
    expect(tramiteDosStoreMock.setNumeroRegistro).toHaveBeenCalledWith(2);
    expect(tramiteDosStoreMock.setNombreAgenteAduanal).toHaveBeenCalledWith('Agente');
    expect(tramiteDosStoreMock.setNumeroTrabajadoresIMSS).toHaveBeenCalledWith(3);
    expect(tramiteDosStoreMock.setNumeroTrabajadoresContratistas).toHaveBeenCalledWith(4);
    expect(tramiteDosStoreMock.setServiciosAdicionales).toHaveBeenCalledWith('servicio');
    expect(tramiteDosStoreMock.setIndique).toHaveBeenCalledWith('indique');
  });

  it('estadoFormularioPerfiles should call tramiteDosStore setters', () => {
    const datos: any = {
      numeroDeRegistro: 1,
      organismoCertificador: 'org',
      nombrePrograma: 'prog',
      opcion: 'op',
      superficieInstalacion: 100,
      numeroEmpleados: 10,
      operacionesMensualesExp: 5,
      operacionesMensualesImp: 6,
      tiposServicios: 'tipo',
      actividadPreponderante: 'act',
      antiguedadInstalacion: 2,
      tipoInstalacion: 'tipo',
      nombreAgenciaAduanal: 'agencia'
    };
    service.estadoFormularioPerfiles(datos);
    expect(tramiteDosStoreMock.setNumeroDeRegistro).toHaveBeenCalledWith(1);
    expect(tramiteDosStoreMock.setOrganismoCertificador).toHaveBeenCalledWith('org');
    expect(tramiteDosStoreMock.setNombrePrograma).toHaveBeenCalledWith('prog');
    expect(tramiteDosStoreMock.setOpcion).toHaveBeenCalledWith('op');
    expect(tramiteDosStoreMock.setSuperficieInstalacion).toHaveBeenCalledWith(100);
    expect(tramiteDosStoreMock.setNumeroEmpleados).toHaveBeenCalledWith(10);
    expect(tramiteDosStoreMock.setOperacionesMensualesExp).toHaveBeenCalledWith(5);
    expect(tramiteDosStoreMock.setOperacionesMensualesImp).toHaveBeenCalledWith(6);
    expect(tramiteDosStoreMock.setTiposServicios).toHaveBeenCalledWith('tipo');
    expect(tramiteDosStoreMock.setActividadPreponderante).toHaveBeenCalledWith('act');
    expect(tramiteDosStoreMock.setAntiguedadInstalacion).toHaveBeenCalledWith(2);
    expect(tramiteDosStoreMock.setTipoInstalacion).toHaveBeenCalledWith('tipo');
    expect(tramiteDosStoreMock.setNombreAgenciaAduanal).toHaveBeenCalledWith('agencia');
  });

  it('getSociedadesTablaDatos should call http.get with correct URL', () => {
    httpClientMock.get.mockReturnValue(of({}));
    service.getSociedadesTablaDatos().subscribe();
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/32612/socidad-tabla.json');
  });

    it('should getSociedadesTablaDatos (error)', (done) => {
    const error = new Error('fail');
    httpClientMock.get.mockReturnValueOnce(throwError(() => error));
    service.getSociedadesTablaDatos().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('getDatosDeLasInstalaciones should call http.get with correct URL', () => {
    httpClientMock.get.mockReturnValue(of({}));
    service.getDatosDeLasInstalaciones().subscribe();
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/32612/datos-instalaciones.json');
  });

  it('should getDatosDeLasInstalaciones (error)', (done) => {
    const error = new Error('fail');
    httpClientMock.get.mockReturnValueOnce(throwError(() => error));
    service.getDatosDeLasInstalaciones().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('getConsultaDatosAgenteAduanal should call http.get with correct URL', () => {
    httpClientMock.get.mockReturnValue(of({}));
    service.getConsultaDatosAgenteAduanal().subscribe();
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/32612/consulta-agente-aduanal.json');
  });

    it('should getConsultaDatosAgenteAduanal (error)', (done) => {
    const error = new Error('fail');
    httpClientMock.get.mockReturnValueOnce(throwError(() => error));
    service.getConsultaDatosAgenteAduanal().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('getConsultaAgente should call http.get with correct URL', () => {
    httpClientMock.get.mockReturnValue(of({}));
    service.getConsultaAgente().subscribe();
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/32612/consulta-aduanal.json');
  });

  it('should getConsultaAgente (error)', (done) => {
    const error = new Error('fail');
    httpClientMock.get.mockReturnValueOnce(throwError(() => error));
    service.getConsultaAgente().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('getConsultaPerfiles should call http.get with correct URL', () => {
    httpClientMock.get.mockReturnValue(of({}));
    service.getConsultaPerfiles().subscribe();
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/32612/consulta-perfiles.json');
  });

    it('should getConsultaPerfiles (error)', (done) => {
    const error = new Error('fail');
    httpClientMock.get.mockReturnValueOnce(throwError(() => error));
    service.getConsultaPerfiles().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('getAduanaActuaCatalog should call http.get with correct URL', () => {
    httpClientMock.get.mockReturnValue(of({}));
    service.getAduanaActuaCatalog().subscribe();
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/32612/aduana-catalog.json');
  });

  it('should getAduanaActuaCatalog (error)', (done) => {
    const error = new Error('fail');
    httpClientMock.get.mockReturnValueOnce(throwError(() => error));
    service.getAduanaActuaCatalog().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('getRfcDelAgenteCatalog should call http.get with correct URL', () => {
    httpClientMock.get.mockReturnValue(of({}));
    service.getRfcDelAgenteCatalog().subscribe();
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/32612/rfc-del-agente-catalog.json');
  });

  it('should getRfcDelAgenteCatalog (error)', (done) => {
    const error = new Error('fail');
    httpClientMock.get.mockReturnValueOnce(throwError(() => error));
    service.getRfcDelAgenteCatalog().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('getEntidadFederativaCatalog should call http.get with correct URL', () => {
    httpClientMock.get.mockReturnValue(of({}));
    service.getEntidadFederativaCatalog().subscribe();
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/32612/entidad-federativa.json');
  });

  it('should getEntidadFederativaCatalog (error)', (done) => {
    const error = new Error('fail');
    httpClientMock.get.mockReturnValueOnce(throwError(() => error));
    service.getEntidadFederativaCatalog().subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('getPrefilesConsultaAccodiane should call http.get with correct URL', () => {
    httpClientMock.get.mockReturnValue(of({}));
    service.getPrefilesConsultaAccodiane().subscribe();
    expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/32612/consulta-perfiles-accodiane.json');
  });
});
