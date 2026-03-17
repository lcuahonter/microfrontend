// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { RegistrarProveedoresService } from './registrar-proveedores.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockHttpClient {
  post() {};
}

describe('RegistrarProveedoresService', () => {
  let service;

  beforeEach(() => {
    service = new RegistrarProveedoresService({});
  });

  it('should run #proveedoresManual()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.proveedoresManual();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getRegistroTomaMuestrasMercanciasData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getRegistroTomaMuestrasMercanciasData();
    expect(service.http.get).toHaveBeenCalled();
  });

});