// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ConsultaAvisoAcreditacionService } from './consulta-aviso-acreditacion.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockHttpClient {
  post() {};
}

describe('ConsultaAvisoAcreditacionService', () => {
  let service;

  beforeEach(() => {
    service = new ConsultaAvisoAcreditacionService({});
  });

  it('should run #getListaDeDocumentos()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getListaDeDocumentos({});
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getDatosDeTabla()', async () => {
    service.selectedRowSource = service.selectedRowSource || {};
    service.selectedRowSource.getValue = jest.fn();
    service.getDatosDeTabla();
    expect(service.selectedRowSource.getValue).toHaveBeenCalled();
  });

  it('should run #setUpdatedRow()', async () => {
    service.selectedRowSource = service.selectedRowSource || {};
    service.selectedRowSource.next = jest.fn();
    service.setUpdatedRow({});
    expect(service.selectedRowSource.next).toHaveBeenCalled();
  });

  it('should run #getDatosConsulta()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosConsulta();
    expect(service.http.get).toHaveBeenCalled();
  });

});