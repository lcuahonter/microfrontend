// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { AvisoUnicoService } from './aviso-unico.service';
import { HttpClient } from '@angular/common/http';
import { UnicoStore } from '../estados/renovacion.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockUnicoStore {}

describe('AvisoUnicoService', () => {
  let service;

  beforeEach(() => {
    service = new AvisoUnicoService({}, {});
  });

  it('should run #get()', async () => {
  });

  it('should run #obtenerDatosLocalidad()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerDatosLocalidad();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getSolicitante()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getSolicitante();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerRadio()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerRadio();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.unicoStore = service.unicoStore || {};
    service.unicoStore.setmapTipoTramite = jest.fn();
    service.unicoStore.setmapDeclaracionSolicitud = jest.fn();
    service.unicoStore.setenvioAviso = jest.fn();
    service.unicoStore.setnumeroAviso = jest.fn();
    service.unicoStore.setclaveReferencia = jest.fn();
    service.unicoStore.setnumeroOperacion = jest.fn();
    service.unicoStore.setcadenaDependencia = jest.fn();
    service.unicoStore.setbanco = jest.fn();
    service.unicoStore.setllavePago = jest.fn();
    service.unicoStore.setfechaPago = jest.fn();
    service.unicoStore.setimportePago = jest.fn();
    service.actualizarEstadoFormulario({
      mapTipoTramite: {},
      mapDeclaracionSolicitud: {},
      envioAviso: {},
      numeroAviso: {},
      claveReferencia: {},
      numeroOperacion: {},
      cadenaDependencia: {},
      banco: {},
      llavePago: {},
      fechaPago: {},
      importePago: {}
    });
    expect(service.unicoStore.setmapTipoTramite).toHaveBeenCalled();
    expect(service.unicoStore.setmapDeclaracionSolicitud).toHaveBeenCalled();
    expect(service.unicoStore.setenvioAviso).toHaveBeenCalled();
    expect(service.unicoStore.setnumeroAviso).toHaveBeenCalled();
    expect(service.unicoStore.setclaveReferencia).toHaveBeenCalled();
    expect(service.unicoStore.setnumeroOperacion).toHaveBeenCalled();
    expect(service.unicoStore.setcadenaDependencia).toHaveBeenCalled();
    expect(service.unicoStore.setbanco).toHaveBeenCalled();
    expect(service.unicoStore.setllavePago).toHaveBeenCalled();
    expect(service.unicoStore.setfechaPago).toHaveBeenCalled();
    expect(service.unicoStore.setimportePago).toHaveBeenCalled();
  });

  it('should run #getDatosDeTrtamitelDoc()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosDeTrtamitelDoc();
    expect(service.http.get).toHaveBeenCalled();
  });

});