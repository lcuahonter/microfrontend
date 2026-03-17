// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { PermisoExportacionPirotecniaService } from './permiso-exportacion-pirotecnia.service';
import { HttpClient } from '@angular/common/http';
import { Tramite240120Store } from '../estados/tramite240120Store.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite240120Store {}

describe('PermisoExportacionPirotecniaService', () => {
  let service;

  beforeEach(() => {
    service = new PermisoExportacionPirotecniaService({}, {});
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite240120Store = service.tramite240120Store || {};
    service.tramite240120Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
    expect(service.tramite240120Store.update).toHaveBeenCalled();
  });

  it('should run #obtenerRegistroTomarMuestrasDatos()', async () => {
    service.httpClient = service.httpClient || {};
    service.httpClient.get = jest.fn();
    service.obtenerRegistroTomarMuestrasDatos();
    expect(service.httpClient.get).toHaveBeenCalled();
  });

});