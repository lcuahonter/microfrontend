// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { AutorizacionImportacionService } from './autorizacion-importacion.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockHttpClient {
  post() {};
}

describe('AutorizacionImportacionService', () => {
  let service;

  beforeEach(() => {
    service = new AutorizacionImportacionService({});
  });

  it('should run #obtenerDatosSolicitante()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerDatosSolicitante();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerSolicitudTabla()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerSolicitudTabla();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerFederativa()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerFederativa();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerAduanas()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerAduanas();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerAduaneras()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerAduaneras();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerRecintoFiscalizado()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerRecintoFiscalizado();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerTipoDeDocumento()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerTipoDeDocumento();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerMedioDeTransporte()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerMedioDeTransporte();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerPaisDeProcedencia()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerPaisDeProcedencia();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerSiNo()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerSiNo();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerTipoDeDestino()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerTipoDeDestino();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getDatosConsulta()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosConsulta();
    expect(service.http.get).toHaveBeenCalled();
  });

});