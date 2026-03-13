// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { PermisoSanitarioDispositivosMedicosService } from './permiso-sanitario-dispositivos-medicos.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockHttpClient {
  post() {};
}

describe('PermisoSanitarioDispositivosMedicosService', () => {
  let service;

  beforeEach(() => {
    service = new PermisoSanitarioDispositivosMedicosService({});
  });

  it('should run #getEstadosData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getEstadosData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getClaveScianData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getClaveScianData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getClaveDescripcionDelData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getClaveDescripcionDelData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getRegimenalqueData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getRegimenalqueData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getAduanaData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getAduanaData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getBancoData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getBancoData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getPaisData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getPaisData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getTramitesAsociados()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getTramitesAsociados();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getMercanciasData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getMercanciasData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getClasificacionDelProductoData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getClasificacionDelProductoData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getEspificarData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getEspificarData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getTipoProductoData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getTipoProductoData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getListaClaveData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getListaClaveData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getMercanciaCrosslistData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getMercanciaCrosslistData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getEstadoFisicoData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getEstadoFisicoData();
    expect(service.http.get).toHaveBeenCalled();
  });

});