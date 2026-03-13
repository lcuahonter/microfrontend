// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { JuntaTecnicaRegistroService } from './junta-tecnica-registro.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockHttpClient {
  post() {};
}

describe('JuntaTecnicaRegistroService', () => {
  let service;

  beforeEach(() => {
    service = new JuntaTecnicaRegistroService({});
  });

  it('should run #getOptionLista()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getOptionLista({});
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getDatosConsulta()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosConsulta();
    expect(service.http.get).toHaveBeenCalled();
  });

});