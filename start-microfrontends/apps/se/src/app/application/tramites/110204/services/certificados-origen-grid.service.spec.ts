// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { CertificadosOrigenGridService } from './certificadosOrigenGrid.service';
import { HttpClient } from '@angular/common/http';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { Tramite110204Store } from '../estados/tramite110204.store';
import { Tramite110204Query } from '../estados/tramite110204.query';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite110204Store {}

@Injectable()
class MockTramite110204Query {}

describe('CertificadosOrigenGridService', () => {
  let service;

  beforeEach(() => {
    service = new CertificadosOrigenGridService({}, {}, {}, {});
  });

  it('should run #getAcuiculturaData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getAcuiculturaData();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.store = service.store || {};
    service.store.setEstado = jest.fn();
    service.store.setFactura = jest.fn();
    service.store.setUmc = jest.fn();
    service.store.setBloque = jest.fn();
    service.store.setaltaPlanta = jest.fn();
    service.store.setFormDatosCertificado = jest.fn();
    service.store.setFormCertificado = jest.fn();
    service.store.setFormMercancia = jest.fn();
    service.store.setbuscarMercancia = jest.fn();
    service.actualizarEstadoFormulario({
      estado: {},
      factura: {},
      umcs: {},
      paisBloques: {},
      altaPlanta: {},
      formDatosCertificado: {},
      formCertificado: {},
      mercanciaForm: {},
      buscarMercancia: {}
    });
  });

  it('should run #getAllState()', async () => {
    service.query = service.query || {};
    service.query.selectState$ = 'selectState$';
    service.getAllState();

  });

  it('should run #buscarMercanciasCert()', async () => {
    service.httpService = service.httpService || {};
    service.httpService.post = jest.fn().mockReturnValue(observableOf('post'));
    service.buscarMercanciasCert({});
  });

  it('should run #guardarDatosPost()', async () => {
    service.httpService = service.httpService || {};
    service.httpService.post = jest.fn().mockReturnValue(observableOf('post'));
    service.guardarDatosPost({});  });

  it('should run #buildMercanciaSeleccionadas()', async () => {

    service.buildMercanciaSeleccionadas([{}]);

  });

  it('should run #buildCertificado()', async () => {
    service.buildMercanciaSeleccionadas = jest.fn();
    service.buildCertificado({
      formCertificado: {
        'entidadFederativa': {},
        'bloque': {},
        'fraccionArancelaria': {},
        'nombreComercial': {},
        'fechaInicio': {},
        'fechaFin': {},
        'registroProducto': {},
        'si': {},
        'nombres': {},
        'primerApellido': {},
        'segundoApellido': {},
        'numeroDeRegistroFiscal': {},
        'razonSocial': {}
      },
      mercanciaTabla: {}
    });
  });

  it('should run #buildDatosCertificado()', async () => {

    service.buildDatosCertificado({
      formDatosCertificado: {
        'observacionesDates': {},
        'idiomaDates': {},
        'EntidadFederativaDates': {},
        'representacionFederalDates': {}
      }
    });

  });

});