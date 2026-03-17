// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ConcluirRelacionService } from './concluir-relacion.service';
import { HttpClient } from '@angular/common/http';
import { Tramite420102Store } from '../estados/tramite420102.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite420102Store {}

describe('ConcluirRelacionService', () => {
  let service;

  beforeEach(() => {
    service = new ConcluirRelacionService({}, {});
  });

  it('should run #obtenerTablerList()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerTablerList({});
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite420102Store = service.tramite420102Store || {};
    service.tramite420102Store.establecerRfc = jest.fn();
    service.tramite420102Store.establecerFechaInicial = jest.fn();
    service.tramite420102Store.establecerFechaFinal = jest.fn();
    service.tramite420102Store.establecerTablaDatos = jest.fn();
    service.actualizarEstadoFormulario({
      rfc: {},
      fechaInicial: {},
      fechaFinal: {},
      tableDatos: {}
    });
    expect(service.tramite420102Store.establecerRfc).toHaveBeenCalled();
    expect(service.tramite420102Store.establecerFechaInicial).toHaveBeenCalled();
    expect(service.tramite420102Store.establecerFechaFinal).toHaveBeenCalled();
    expect(service.tramite420102Store.establecerTablaDatos).toHaveBeenCalled();
  });

  it('should run #getRegistroTomaMuestrasMercanciasData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getRegistroTomaMuestrasMercanciasData();
    expect(service.http.get).toHaveBeenCalled();
  });

});