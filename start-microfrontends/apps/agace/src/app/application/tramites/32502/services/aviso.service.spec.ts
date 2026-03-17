// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { AvisoService } from './aviso.service';
import { HttpClient } from '@angular/common/http';
import { Tramite32502Store } from '../../../estados/tramites/tramite32502.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite32502Store {}

describe('AvisoService', () => {
  let service;

  beforeEach(() => {
    service = new AvisoService({}, {});
  });

  it('should run #getFraccionArancelariaCatalogo()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getFraccionArancelariaCatalogo({});
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getFraccionReglaCatalogo()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getFraccionReglaCatalogo({});
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getTipoDocumento()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getTipoDocumento({});
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerDatosEstado()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerDatosEstado();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #establecerDatosEstado()', async () => {
    service.tramite32502Store = service.tramite32502Store || {};
    service.tramite32502Store.establecerDatos = jest.fn();
    service.establecerDatosEstado({});
    expect(service.tramite32502Store.establecerDatos).toHaveBeenCalled();
  });

});