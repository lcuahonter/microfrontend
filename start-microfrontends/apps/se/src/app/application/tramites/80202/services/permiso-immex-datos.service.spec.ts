// @ts-nocheck
import { Injectable } from '@angular/core';
import {  of as observableOf } from 'rxjs';
import { PermisoImmexDatosService } from './permiso-immex-datos.service';
import { HttpClient } from '@angular/common/http';
import { ImmexAmpliacionSensiblesStore } from '../estados/immex-ampliacion-sensibles.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockImmexAmpliacionSensiblesStore {}

describe('PermisoImmexDatosService', () => {
  let service;

  beforeEach(() => {
    service = new PermisoImmexDatosService({}, {});
  });

  it('should run #getDatos()', async () => {
    service.httpClient = service.httpClient || {};
    service.httpClient.get = jest.fn().mockReturnValue(observableOf({}));
    service.getDatos();
    expect(service.httpClient.get).toHaveBeenCalled();
  });

  it('should run #getRegistroTomaMuestrasMercanciasData()', async () => {
    service.httpClient = service.httpClient || {};
    service.httpClient.get = jest.fn();
    service.getRegistroTomaMuestrasMercanciasData();
    expect(service.httpClient.get).toHaveBeenCalled();
  });
  
});