// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { MaquilaMateriasPrimasService } from './maquila-materias-primas.service';
import { HttpClient } from '@angular/common/http';
import { Tramite260206Store } from '../estados/stores/tramite260206Store.store';

@Injectable()
class MockHttpClient {
  get() {
    return observableOf({});
  }
}

@Injectable()
class MockTramite260206Store {
  update() {}
}

describe('MaquilaMateriasPrimasService', () => {
  let service;

  beforeEach(() => {
    service = new MaquilaMateriasPrimasService(new MockHttpClient(), new MockTramite260206Store());
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    const mockStore = service.tramite260206Store || {};
    mockStore.update = jest.fn();
    service.tramite260206Store = mockStore;
    
    const testData = { someProperty: 'test' };
    service.actualizarEstadoFormulario(testData);
    
    expect(mockStore.update).toHaveBeenCalled();
  });

  it('should run #getTramiteDatos()', async () => {
    const mockHttp = service.http || {};
    mockHttp.get = jest.fn().mockReturnValue(observableOf({}));
    service.http = mockHttp;
    
    service.getTramiteDatos();
    
    expect(mockHttp.get).toHaveBeenCalledWith('assets/json/260206/datos.json');
  });

});