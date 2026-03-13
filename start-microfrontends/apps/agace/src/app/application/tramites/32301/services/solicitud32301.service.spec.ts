// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Solicitud32301Service } from './solicitud32301.service';
import { HttpClient } from '@angular/common/http';
import { Tramite32301Store } from '../estados/tramite32301.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite32301Store {
  update() {};
  setModificacionSociosHeader() {};
  setMostrarGridNuevoHeaderData() {};
  metodoNombre() {};
}

describe('Solicitud32301Service', () => {
  let service;

  beforeEach(() => {
    service = new Solicitud32301Service({}, {});
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite301Store = service.tramite301Store || {};
    service.tramite301Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
    expect(service.tramite301Store.update).toHaveBeenCalled();
  });

  it('should run #getRegistroTomaMuestrasMercanciasData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getRegistroTomaMuestrasMercanciasData();
    expect(service.http.get).toHaveBeenCalled();
  });

});