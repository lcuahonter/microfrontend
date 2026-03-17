// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { TramiteFolioService } from '../service/servicios-extraordinarios.service';
import { HttpClient } from '@angular/common/http';
import { Tramite11101Store } from '../estados/tramite11101.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockHttpClient {
  post() { };
}

@Injectable()
class MockTramiteFolioService {

  actualizarEstadoFormulario() { }
  getDatosDeTrtamitelDoc(): Observable<any> {
    return observableOf({});
  }
}

@Injectable()
class MockTramite11101Store { }

describe('TramiteFolioService', () => {
  let service;

  beforeEach(() => {
    service = new TramiteFolioService({}, {
      imports: [HttpClientTestingModule],
      providers: [Tramite11101Store, TramiteFolioService],

    });
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.store = service.store || {};
    service.store.setNumeroderegistro = jest.fn();
    service.store.setNobmreDenominationRazonSocial = jest.fn();
    service.store.setRfctaxid = jest.fn();
    service.store.setTelefono = jest.fn();
    service.store.setCorreoelectronico = jest.fn();
    service.store.setEntidadadfederativa = jest.fn();
    service.store.setAlcadilamunicipio = jest.fn();
    service.store.setColonia = jest.fn();
    service.store.setCodigopostal = jest.fn();
    service.store.setCalle = jest.fn();
    service.store.setNumeroletraexterior = jest.fn();
    service.store.setNumeroletrainterior = jest.fn();
    service.store.setEntrecalle = jest.fn();
    service.store.setYcalle = jest.fn();
    service.actualizarEstadoFormulario({
      numeroderegistro: {},
      NobmreDenominationRazonSocial: {},
      rfctaxid: {},
      Telefono: {},
      correoelectronico: {},
      alcadilamunicipio: {},
      colonia: {},
      codigopostal: {},
      calle: {},
      numeroletraexterior: {},
      numeroletrainterior: {},
      entrecalle: {},
      ycalle: {}
    });
  });

  it('should run #getDatosDeTrtamitelDoc()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosDeTrtamitelDoc();
  });
});