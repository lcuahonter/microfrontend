// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { MateriasPrimasDestinadosService } from './material-primas-destinados.service';
import { HttpClient } from '@angular/common/http';
import { Tramite260205Store } from '../estados/stores/tramite260205.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite260205Store {}

describe('MateriasPrimasDestinadosService', () => {
  let service;

  beforeEach(() => {
    service = new MateriasPrimasDestinadosService({}, {});
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite260205Store = service.tramite260205Store || {};
    service.tramite260205Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
    expect(service.tramite260205Store.update).toHaveBeenCalled();
  });

  it('should run #getTramiteDatos()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getTramiteDatos();
    expect(service.http.get).toHaveBeenCalled();
  });

});