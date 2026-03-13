// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { DesistimientoSolicitudService } from './desistimiento-solicitud.service';
import { HttpClient } from '@angular/common/http';
import { Tramite230301Store } from '../estados/tramites/tramites230301.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockSolicitud230301Store {}

describe('DesistimientoSolicitudService', () => {
  let service;

  beforeEach(() => {
    service = new DesistimientoSolicitudService({}, {});
  });

  it('should run #getDesistimientoSolicitud()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDesistimientoSolicitud({});
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite230301Store = service.tramite230301Store || {};
    service.tramite230301Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
    expect(service.tramite230301Store.update).toHaveBeenCalled();
  });

  it('should run #getRegistroTomaMuestrasMercanciasData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getRegistroTomaMuestrasMercanciasData();
    expect(service.http.get).toHaveBeenCalled();
  });

});