// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { AcuicolaService } from './acuicola.service';
import { HttpClient } from '@angular/common/http';
import { TramiteStore } from '../estados/tramite220703.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramiteStore {}

describe('AcuicolaService', () => {
  let service;

  beforeEach(() => {
    service = new AcuicolaService({}, {});
  });
  it('should run #obtenerDatosCertificados()', async () => {
    service.http = service.http || {};
    const mockData = { data: { certificados: 'test' } };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockData));
    
    service.obtenerDatosCertificados().subscribe(result => {
      expect(result).toEqual(mockData.data);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/datos-certificados.json');
  });
  it('should run #getHoraDeInspeccion()', async () => {
    service.http = service.http || {};
    const mockResponse = { data: ['hora1', 'hora2'] };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getHoraDeInspeccion().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/hora-de-inspeccion.json');
  });
  it('should run #getAduanaDeIngreso()', async () => {
    service.http = service.http || {};
    const mockResponse = { data: ['aduana1', 'aduana2'] };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getAduanaDeIngreso().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/aduana-de-ingreso.json');
  });
  it('should run #getOficinaDeInspeccion()', async () => {
    service.http = service.http || {};
    const mockResponse = { data: ['oficina1', 'oficina2'] };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getOficinaDeInspeccion().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/oficina-de-inspeccion.json');
  });
  it('should run #getPuntoDeInspeccion()', async () => {
    service.http = service.http || {};
    const mockResponse = { data: ['punto1', 'punto2'] };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getPuntoDeInspeccion().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/punto-de-inspeccion.json');
  });
  it('should run #obtenerResponsableDatos()', async () => {
    service.http = service.http || {};
    const mockData = { data: { nombre: 'Juan', apellido: 'Perez' } };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockData));
    
    service.obtenerResponsableDatos().subscribe(result => {
      expect(result).toEqual(mockData.data);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/responsable-inspeccion.json');
  });
  it('should run #getTipoContenedor()', async () => {
    service.http = service.http || {};
    const mockResponse = { data: ['tipo1', 'tipo2'] };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getTipoContenedor().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/tipo-contenedor.json');
  });
  it('should run #getMedioDeTransporte()', async () => {
    service.http = service.http || {};
    const mockResponse = { data: ['medio1', 'medio2'] };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getMedioDeTransporte().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/medio-de-transporte.json');
  });
  it('should run #getBancoDatos()', async () => {
    service.http = service.http || {};
    const mockResponse = { data: ['banco1', 'banco2'] };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getBancoDatos().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/banco-datos.json');
  });
  it('should run #pagoDeCargarDatos()', async () => {
    service.http = service.http || {};
    const mockData = { data: { pago: 'test data' } };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockData));
    
    service.pagoDeCargarDatos().subscribe(result => {
      expect(result).toEqual(mockData.data);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/pago-de-derechos.json');
  });
  it('should run #getPagoDerechosRevision()', async () => {
    service.http = service.http || {};
    const mockData = { data: { revision: 'test revision' } };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockData));
    
    service.getPagoDerechosRevision().subscribe(result => {
      expect(result).toEqual(mockData.data);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/pago-de-derechos-revision.json');
  });
  it('should run #getRegimenAlQueSeDestinara()', async () => {
    service.http = service.http || {};
    const mockResponse = { data: ['regimen1', 'regimen2'] };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getRegimenAlQueSeDestinara().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/regimen-al-que-se-destinara.json');
  });
  it('should run #getDatosParaMovilizacion()', async () => {
    service.http = service.http || {};
    const mockResponse = { data: ['dato1', 'dato2'] };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getDatosParaMovilizacion().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/datos-para-movilizacio.json');
  });
  it('should run #getPuntoDeVerificacion()', async () => {
    service.http = service.http || {};
    const mockResponse = { data: ['punto1', 'punto2'] };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getPuntoDeVerificacion().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/punto-de-verificacion.json');
  });
  it('should run #getDatosMercancia()', async () => {
    service.http = service.http || {};
    const mockResponse = [{ id: 1, nombre: 'mercancia1' }, { id: 2, nombre: 'mercancia2' }];
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getDatosMercancia().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/datos-de-mercancia.json');
  });
  it('should run #getMercanciaDatos()', async () => {
    service.http = service.http || {};
    const mockResponse = [{ id: 1, type: 'merchandise1' }, { id: 2, type: 'merchandise2' }];
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getMercanciaDatos().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/datos-de-merchandise.json');
  });
  it('should run #getExportadorDatos()', async () => {
    service.http = service.http || {};
    const mockResponse = [{ id: 1, nombre: 'exportador1' }, { id: 2, nombre: 'exportador2' }];
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getExportadorDatos().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/datos-de-exportador.json');
  });
  it('should run #getDestinoDatos()', async () => {
    service.http = service.http || {};
    const mockResponse = [{ id: 1, nombre: 'destino1' }, { id: 2, nombre: 'destino2' }];
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getDestinoDatos().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/datos-de-destino.json');
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramiteStore = service.tramiteStore || {};
    service.tramiteStore.setCertificadosAutorizados = jest.fn();
    service.tramiteStore.setJustificacion = jest.fn();
    service.tramiteStore.setAduanaDeIngreso = jest.fn();
    service.tramiteStore.setOficinaDeInspeccion = jest.fn();
    service.tramiteStore.setPuntoDeInspeccion = jest.fn();
    service.tramiteStore.setNombreInspector = jest.fn();
    service.tramiteStore.setHoraDeInspeccion = jest.fn();
    service.tramiteStore.setPrimerApellido = jest.fn();
    service.tramiteStore.setSegundoApellido = jest.fn();
    service.tramiteStore.setCantidadContenedores = jest.fn();
    service.tramiteStore.setTipoContenedor = jest.fn();
    service.tramiteStore.setMedioDeTransporte = jest.fn();
    service.tramiteStore.setIdentificacionTransporte = jest.fn();
    service.tramiteStore.setEsSolicitudFerros = jest.fn();
    service.tramiteStore.setBanco = jest.fn();
    service.tramiteStore.setLlaveDePago = jest.fn();
    service.tramiteStore.setFechaPagoDeDerechos = jest.fn();
    service.tramiteStore.setImporteDePago = jest.fn();
    service.tramiteStore.setClaveDeReferencia = jest.fn();
    service.tramiteStore.setNumeroDeGuia = jest.fn();
    service.tramiteStore.setRegimenAlQueDestina = jest.fn();
    service.tramiteStore.setDatosParaMovilizacion = jest.fn();
    service.tramiteStore.setPuntoDeVerificacion = jest.fn();
    service.tramiteStore.setFolioDelTramite = jest.fn();
    service.tramiteStore.setCadenaDependenciaRevision = jest.fn();
    service.tramiteStore.setBancoRevision = jest.fn();
    service.tramiteStore.setLlaveDePagoRevision = jest.fn();
    service.tramiteStore.setFechaPagoDeDerechosRevision = jest.fn();
    service.tramiteStore.setImporteDePagoRevision = jest.fn();
    service.tramiteStore.setFechaDeInspeccion = jest.fn();
    service.tramiteStore.setFechaDePago = jest.fn();
    service.tramiteStore.setIdentificacionDelTransporte = jest.fn();
    service.tramiteStore.setNombreDeLaEmpresaTransportista = jest.fn();
    service.actualizarEstadoFormulario({
      certificadosAutorizados: {},
      justificacion: {},
      aduanaDeIngreso: {},
      oficinaDeInspeccion: {},
      puntoDeInspeccion: {},
      nombreInspector: {},
      horaDeInspeccion: {},
      primerApellido: {},
      segundoApellido: {},
      cantidadContenedores: {},
      tipoContenedor: {},
      medioDeTransporte: {},
      identificacionTransporte: {},
      esSolicitudFerros: {},
      banco: {},
      llaveDePago: {},
      fechaPagoDeDerechos: {},
      importeDePago: {},
      claveDeReferencia: {},
      numeroDeGuia: {},
      regimenAlQueDestina: {},
      datosParaMovilizacion: {},
      puntoDeVerificacion: {},
      cadenaDependenciaRevision: {},
      bancoRevision: {},
      llaveDePagoRevision: {},
      fechaPagoDeDerechosRevision: {},
      importeDePagoRevision: {},
      fechaDePago: {},
      identificacionDelTransporte: {},
      nombreDeLaEmpresaTransportista: {}
    });
    expect(service.tramiteStore.setCertificadosAutorizados).toHaveBeenCalled();
    expect(service.tramiteStore.setJustificacion).toHaveBeenCalled();
    expect(service.tramiteStore.setAduanaDeIngreso).toHaveBeenCalled();
    expect(service.tramiteStore.setOficinaDeInspeccion).toHaveBeenCalled();
    expect(service.tramiteStore.setPuntoDeInspeccion).toHaveBeenCalled();
    expect(service.tramiteStore.setNombreInspector).toHaveBeenCalled();
    expect(service.tramiteStore.setHoraDeInspeccion).toHaveBeenCalled();
    expect(service.tramiteStore.setPrimerApellido).toHaveBeenCalled();
    expect(service.tramiteStore.setSegundoApellido).toHaveBeenCalled();
    expect(service.tramiteStore.setCantidadContenedores).toHaveBeenCalled();
    expect(service.tramiteStore.setTipoContenedor).toHaveBeenCalled();
    expect(service.tramiteStore.setMedioDeTransporte).toHaveBeenCalled();
    expect(service.tramiteStore.setIdentificacionTransporte).toHaveBeenCalled();
    expect(service.tramiteStore.setEsSolicitudFerros).toHaveBeenCalled();
    expect(service.tramiteStore.setBanco).toHaveBeenCalled();
    expect(service.tramiteStore.setLlaveDePago).toHaveBeenCalled();
    expect(service.tramiteStore.setFechaPagoDeDerechos).toHaveBeenCalled();
    expect(service.tramiteStore.setImporteDePago).toHaveBeenCalled();
    expect(service.tramiteStore.setClaveDeReferencia).toHaveBeenCalled();
    expect(service.tramiteStore.setNumeroDeGuia).toHaveBeenCalled();
    expect(service.tramiteStore.setRegimenAlQueDestina).toHaveBeenCalled();
    expect(service.tramiteStore.setDatosParaMovilizacion).toHaveBeenCalled();
    expect(service.tramiteStore.setPuntoDeVerificacion).toHaveBeenCalled();
    expect(service.tramiteStore.setFolioDelTramite).toHaveBeenCalled();
    expect(service.tramiteStore.setCadenaDependenciaRevision).toHaveBeenCalled();
    expect(service.tramiteStore.setBancoRevision).toHaveBeenCalled();
    expect(service.tramiteStore.setLlaveDePagoRevision).toHaveBeenCalled();
    expect(service.tramiteStore.setFechaPagoDeDerechosRevision).toHaveBeenCalled();
    expect(service.tramiteStore.setImporteDePagoRevision).toHaveBeenCalled();
    expect(service.tramiteStore.setFechaDePago).toHaveBeenCalled();
    expect(service.tramiteStore.setIdentificacionDelTransporte).toHaveBeenCalled();
    expect(service.tramiteStore.setNombreDeLaEmpresaTransportista).toHaveBeenCalled();
  });  it('should run #getServiciosData()', async () => {
    service.http = service.http || {};
    const mockResponse = { estado: 'activo', servicios: ['servicio1', 'servicio2'] };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockResponse));
    
    service.getServiciosData().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220703/datos-precargados.json');
  });

  it('should initialize with correct apiUrl', () => {
    expect(service['apiUrl']).toBe('assets/json/220703/');
  });

  it('should handle empty data responses in obtenerDatosCertificados', () => {
    service.http = service.http || {};
    const mockData = { data: null };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockData));
    
    service.obtenerDatosCertificados().subscribe(result => {
      expect(result).toBeNull();
    });
  });

  it('should handle empty data responses in obtenerResponsableDatos', () => {
    service.http = service.http || {};
    const mockData = { data: {} };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockData));
    
    service.obtenerResponsableDatos().subscribe(result => {
      expect(result).toEqual({});
    });
  });

  it('should handle empty data responses in pagoDeCargarDatos', () => {
    service.http = service.http || {};
    const mockData = { data: undefined };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockData));
    
    service.pagoDeCargarDatos().subscribe(result => {
      expect(result).toBeUndefined();
    });
  });

  it('should handle empty data responses in getPagoDerechosRevision', () => {
    service.http = service.http || {};
    const mockData = { data: [] };
    service.http.get = jest.fn().mockReturnValue(observableOf(mockData));
    
    service.getPagoDerechosRevision().subscribe(result => {
      expect(result).toEqual([]);
    });
  });

});