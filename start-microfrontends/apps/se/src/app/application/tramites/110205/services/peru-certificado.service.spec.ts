// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { PeruCertificadoService } from './peru-certificado.service';
import { HttpClient } from '@angular/common/http';
import { HttpCoreService } from '@ng-mf/data-access-user';
import { Tramite110205Store } from '../estados/tramite110205.store';
import { Tramite110205Query } from '../estados/tramite110205.query';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite110205Store {}

@Injectable()
class MockTramite110205Query {}

describe('PeruCertificadoService', () => {
  let service;

  beforeEach(() => {
    service = new PeruCertificadoService({}, {}, {}, {});
  });

  it('should run #obtenerMenuDesplegable()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerMenuDesplegable({});
  });

  it('should run #obtenerTablaDatos()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerTablaDatos({});
  });

  it('should run #obtenerProductorPorExportador()', async () => {
    service.httpService = service.httpService || {};
    service.httpService.get = jest.fn();
    service.obtenerProductorPorExportador({});
  });

  it('should run #obtenerProductoruNevo()', async () => {
    service.httpService = service.httpService || {};
    service.httpService.post = jest.fn().mockReturnValue(observableOf('post'));
    service.obtenerProductoruNevo({});
  });

  it('should run #obtenerMercancia()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerMercancia();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite110205Store = service.tramite110205Store || {};
    service.tramite110205Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
  });

  it('should run #getRegistroTomaMuestrasMercanciasData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getRegistroTomaMuestrasMercanciasData();
  });

  it('should run #getTipoFactura()', async () => {
    service.httpService = service.httpService || {};
    service.httpService.get = jest.fn();
    service.getTipoFactura();
  });

  it('should run #getAllState()', async () => {
    service.query = service.query || {};
    service.query.selectPeru$ = 'selectPeru$';
    service.getAllState();

  });

  it('should run #guardarDatosPost()', async () => {
    service.httpService = service.httpService || {};
    service.httpService.post = jest.fn().mockReturnValue(observableOf('post'));
    service.guardarDatosPost({});
  });

  it('should run #postSolicitud()', async () => {
    service.http = service.http || {};
    service.http.post = jest.fn().mockReturnValue(observableOf('post'));
    service.postSolicitud({});
  });

  it('should run #buscarMercanciasCert()', async () => {
    service.httpService = service.httpService || {};
    service.httpService.post = jest.fn().mockReturnValue(observableOf('post'));
    service.buscarMercanciasCert({});
  });

  it('should run #buildProductoresPorExportador()', async () => {

    service.buildProductoresPorExportador([{
      nombreProductor: {},
      numeroRegistroFiscal: {},
      direccion: {},
      correoElectronico: {},
      telefono: {},
      fax: {}
    }]);

  });

  it('should run #buildMercanciasProductor()', async () => {

    service.buildMercanciasProductor([{
      fraccionArancelaria: {},
      cantidad: {},
      unidadMedida: {},
      valorMercancia: {},
      fetchFactura: {},
      numeroFactura: {},
      complementoDescripcion: {},
      rfcProductor1: {}
    }]);

  });

});