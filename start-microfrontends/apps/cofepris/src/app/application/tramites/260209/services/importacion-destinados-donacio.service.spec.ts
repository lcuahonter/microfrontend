// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ImportacionDestinadosDonacioService } from './importacion-destinados-donacio.service';
import { HttpClient } from '@angular/common/http';
import { Tramite260209Store } from '../estados/tramite260209Store.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite260209Store {}

describe('ImportacionDestinadosDonacioService', () => {
  let service;

  beforeEach(() => {
    service = new ImportacionDestinadosDonacioService({}, {});
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite260209Store = service.tramite260209Store || {};
    service.tramite260209Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
    expect(service.tramite260209Store.update).toHaveBeenCalled();
  });

  it('should run #getRegistroTomaMuestrasMercanciasData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getRegistroTomaMuestrasMercanciasData();
    expect(service.http.get).toHaveBeenCalled();
  });

});