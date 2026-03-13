// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { CorreccionInternaDeLaCofeprisService } from './correccion-interna-de-la-cofepris.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockHttpClient {
  post() {};
}

describe('CorreccionInternaDeLaCofeprisService', () => {
  let service;

  beforeEach(() => {
    service = new CorreccionInternaDeLaCofeprisService({});
  });

  it('should run #getTramitesAsociados()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getTramitesAsociados();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getSolicitudData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getSolicitudData();
    expect(service.http.get).toHaveBeenCalled();
  });

});