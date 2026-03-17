// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ImportaciónDeSustanciasQuímicasService } from './importación-de-sustancias-químicas.service';
import { HttpClient } from '@angular/common/http';
import { Tramite240105Store } from '../estados/tramite240105Store.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite240105Store {}

describe('ImportaciónDeSustanciasQuímicasService', () => {
  let service;

  beforeEach(() => {
    service = new ImportaciónDeSustanciasQuímicasService({}, {});
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite240105Store = service.tramite240105Store || {};
    service.tramite240105Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
    expect(service.tramite240105Store.update).toHaveBeenCalled();
  });

  it('should run #obtenerRegistroTomarMuestrasDatos()', async () => {
    service.httpClient = service.httpClient || {};
    service.httpClient.get = jest.fn();
    service.obtenerRegistroTomarMuestrasDatos();
    expect(service.httpClient.get).toHaveBeenCalled();
  });

});