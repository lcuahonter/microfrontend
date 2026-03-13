// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { AvisoModifyService } from './aviso-modify.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockHttpClient {
  post() {};
}

describe('AvisoModifyService', () => {
  let service;

  beforeEach(() => {
    service = new AvisoModifyService({});
  });

  it('should run #getAvisoModify()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.getAvisoModify();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #cargarDatosPersonaFusion()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.cargarDatosPersonaFusion();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #gridsubFusionOescision()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.gridsubFusionOescision();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getSelectRangoDias()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getSelectRangoDias();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getAdicianFraccionOption()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getAdicianFraccionOption();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getAdicianFraccionNicoModOptions()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getAdicianFraccionNicoModOptions();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getAdicianFraccionUnidadMedidaModOption()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getAdicianFraccionUnidadMedidaModOption();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getAdicianFraccionActivRelProcModOption()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getAdicianFraccionActivRelProcModOption();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getAdicianFraccioncveFraccionCorrelacionModOption()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getAdicianFraccioncveFraccionCorrelacionModOption();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getCapacidadAlmacenamiento()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getCapacidadAlmacenamiento();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getEntidadFederativa()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getEntidadFederativa();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getGridDomiciliosModificados()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getGridDomiciliosModificados();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getGridMostrarGridModificado()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getGridMostrarGridModificado();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getEnSuCaracterDe()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getEnSuCaracterDe();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getNacionalidad()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getNacionalidad();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getPreOperativo()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getPreOperativo();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getGridMiembrosEmpresas()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getGridMiembrosEmpresas();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getSeccionMiembrosRevocados()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getSeccionMiembrosRevocados();
    expect(service.http.get).toHaveBeenCalled();
  });

});