// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ImportacionService } from './importacion.service';
import { HttpClient } from '@angular/common/http';
import { Tramite260203Store } from '../estados/stores/tramite260203Store.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite260203Store {}

describe('ImportacionService', () => {
  let service;

  beforeEach(() => {
    service = new ImportacionService({}, {});
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite260203Store = service.tramite260203Store || {};
    service.tramite260203Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
    expect(service.tramite260203Store.update).toHaveBeenCalled();
  });

  it('should run #getTramiteDatos()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getTramiteDatos();
    expect(service.http.get).toHaveBeenCalled();
  });

});