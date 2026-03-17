// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { AutoridadService } from './autoridad.service';
import { HttpClient } from '@angular/common/http';
import { Tramite31501Store } from '../../../estados/tramites/tramite31501.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite31501Store {}

describe('AutoridadService', () => {
  let service;

  beforeEach(() => {
    service = new AutoridadService({}, {});
  });

  it('should run #agregarRequerimiento()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.agregarRequerimiento();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getTramiteList()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getTramiteList({});
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #agregarSolicitud()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.agregarSolicitud();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite31501Store = service.tramite31501Store || {};
    service.tramite31501Store.setMotivoCancelacion = jest.fn();
    service.tramite31501Store.setTipoDeRequerimiento = jest.fn();
    service.actualizarEstadoFormulario({
      motivoCancelacion: {},
      tipoDeRequerimiento: {}
    });
    expect(service.tramite31501Store.setMotivoCancelacion).toHaveBeenCalled();
    expect(service.tramite31501Store.setTipoDeRequerimiento).toHaveBeenCalled();
  });

});