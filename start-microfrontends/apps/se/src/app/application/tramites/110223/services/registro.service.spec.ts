// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { RegistroService } from './registro.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockHttpClient {
  post() {}
}

describe('RegistroService', () => {
  let service;

  beforeEach(() => {
    service = new RegistroService({});
  });

  it('should run #getTratado()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getTratado();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getPais()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getPais();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getIdioma()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getIdioma();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getPaisDestino()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getPaisDestino();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getTransporte()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getTransporte();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getEntidad()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getEntidad();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getRepresentacion()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getRepresentacion();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getTipoFactura()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getTipoFactura();
    expect(service.http.get).toHaveBeenCalled();
  });


  it('should run #getUnidadMedida()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getUnidadMedida();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getCatalogoById()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getCatalogoById({});
    expect(service.http.get).toHaveBeenCalled();
  });
});
