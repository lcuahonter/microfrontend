// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ImportacionArmamentoFisicasMoralesService } from './importacion-armamento-fisicas-morales.service';
import { HttpClient } from '@angular/common/http';
import { Tramite240102Store } from '../estados/tramite240102Store.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite240102Store {}

describe('ImportacionArmamentoFisicasMoralesService', () => {
  let service;

  beforeEach(() => {
    service = new ImportacionArmamentoFisicasMoralesService({}, {});
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite240102Store = service.tramite240102Store || {};
    service.tramite240102Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
    expect(service.tramite240102Store.update).toHaveBeenCalled();
  });

  it('should run #obtenerRegistroTomarMuestrasDatos()', async () => {
    service.httpClient = service.httpClient || {};
    service.httpClient.get = jest.fn();
    service.obtenerRegistroTomarMuestrasDatos();
    expect(service.httpClient.get).toHaveBeenCalled();
  });

});