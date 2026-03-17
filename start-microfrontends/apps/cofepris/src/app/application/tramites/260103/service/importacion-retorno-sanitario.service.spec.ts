// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ImportacionRetornoSanitarioService } from './importacion-retorno-sanitario.service';
import { HttpClient } from '@angular/common/http';
import { Tramite260103Store } from '../estados/tramite260103Store.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite260103Store {}

describe('ImportacionRetornoSanitarioService', () => {
  let service;

  beforeEach(() => {
    service = new ImportacionRetornoSanitarioService({}, {});
  });

  it('should run #obtenerOstro()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn();
    service.obtenerOstro();
    // expect(service.httpServicios.get).toHaveBeenCalled();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite260103Store = service.tramite260103Store || {};
    service.tramite260103Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
    // expect(service.tramite260103Store.update).toHaveBeenCalled();
  });

  it('should run #getTramiteDatos()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn();
    service.getTramiteDatos();
    // expect(service.httpServicios.get).toHaveBeenCalled();
  });

});