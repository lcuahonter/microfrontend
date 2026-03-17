// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ModificacionProgramaImmexBajaSubmanufactureraService } from './modificacion-programa-immex-baja-submanufacturera.service';
import { HttpClient } from '@angular/common/http';
import { Tramite80303Store } from '../estados/tramite80303Store.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite80303Store {}

describe('ModificacionProgramaImmexBajaSubmanufactureraService', () => {
  let service;

  beforeEach(() => {
    service = new ModificacionProgramaImmexBajaSubmanufactureraService({}, {});
  });

  it('should run #obtenerRespuestaPorUrl()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    service.tramite80303Store = service.tramite80303Store || {};
    service.tramite80303Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.obtenerRespuestaPorUrl('assets', '80303/modificacionProgramaImmexBajaSubmanufacturera.json');
    expect(service.httpServicios.get).toHaveBeenCalled();
    expect(service.tramite80303Store.update).toHaveBeenCalled();
  });

  it('should run #obtenerModicicacionDatos()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({}));
    service.tramite80303Store = service.tramite80303Store || {};
    service.tramite80303Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.obtenerModicicacionDatos();
    expect(service.httpServicios.get).toHaveBeenCalled();
  });
  it('should run #constructor()', async () => {
    expect(service).toBeTruthy();
  });


});