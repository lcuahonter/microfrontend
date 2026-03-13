// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ImmerModificacionService } from './immer-modificacion.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockHttpClient {
  post() {};
}

describe('ImmerModificacionService', () => {
  let service;

  beforeEach(() => {
    service = new ImmerModificacionService({});
  });

  it('should run #getTablaData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getTablaData({});
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getDatosSolicitante()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosSolicitante();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getDatosModificacion()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosModificacion();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getModificacion()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getModificacion();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getDatosTableData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosTableData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerComplimentaria()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerComplimentaria();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerAnexo()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerAnexo();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerFederetarios()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerFederetarios();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerOperacion()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerOperacion();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerPlanta()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerPlanta();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerServicios()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerServicios();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerListaEstado()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerListaEstado();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerDomicilios()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerDomicilios();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerBitacora()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerBitacora();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerDatosGenerales()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerDatosGenerales();
    expect(service.http.get).toHaveBeenCalled();
  });

});