// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ConsumoPersonalService } from './consumo-personal.service';
import { HttpClient } from '@angular/common/http';
import { Tramite260102Store } from '../estados/stores/tramite260102Store.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite260102Store {}

describe('ConsumoPersonalService', () => {
  let service;

  beforeEach(() => {
    service = new ConsumoPersonalService({}, {});
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite260102Store = service.tramite260102Store || {};
    service.tramite260102Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
    expect(service.tramite260102Store.update).toHaveBeenCalled();
  });



});