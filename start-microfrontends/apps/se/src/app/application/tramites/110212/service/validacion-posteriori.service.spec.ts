// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ValidacionPosterioriService } from './validacion-posteriori.service';
import { HttpClient } from '@angular/common/http';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { Tramite110212Store } from '../../../estados/tramites/tramite110212.store';
import { Tramite110212Query } from '../../../estados/queries/tramite110212.query';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite110212Store {}

@Injectable()
class MockTramite110212Query {}

describe('ValidacionPosterioriService', () => {
  let service;

  beforeEach(() => {
    service = new ValidacionPosterioriService({}, {}, {}, {});
  });

  it('should run #obtenerIdioma()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerIdioma();
  });

  it('should run #obtenerEntidadFederativa()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerEntidadFederativa();
  });

  it('should run #obtenerRepresentacionFederal()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerRepresentacionFederal();
  });

  it('should run #obtenerProductorPorExportador()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerProductorPorExportador();
  });

  it('should run #obtenerMercanciasDisponibles()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerMercanciasDisponibles();
  });

  it('should run #obtenerMercanciasSeleccionadas()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerMercanciasSeleccionadas();
  });

  it('should run #obtenerTratado()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerTratado();
  });

  it('should run #obtenerPais()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerPais();
  });

  it('should run #getDatosConsulta()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosConsulta();
  });

  it('should run #getAllState()', async () => {
    service.query = service.query || {};
    service.query.selectSolicitud$ = 'selectSolicitud$';
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
    service.guardarDatosPost({});
  });

  it('should run #buildMercanciaSeleccionadas()', async () => {

    service.buildMercanciaSeleccionadas([{}]);

  });

  it('should run #buildDatosCertificado()', async () => {

    service.buildDatosCertificado({
      formDatosCertificado: {
        'observacionesDates': {},
        'idiomaDates': {},
        'presentaDates': {},
        'precisaDates': {},
        'EntidadFederativaDates': {},
        'representacionFederalDates': {}
      }
    });

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
      mercanciaSeleccionadasTablaDatos: {}
    });
  });

  it('should run #buildDestinatario()', async () => {

    service.buildDestinatario({
      formDatosDelDestinatario: {
        'nombres': {},
        'primerApellido': {},
        'segundoApellido': {},
        'numeroDeRegistroFiscal': {},
        'razonSocial': {}
      },
      formDestinatario: {
        'ciudad': {},
        'calle': {},
        'numeroLetra': {},
        'lada': {},
        'telefono': {},
        'fax': {},
        'correoElectronico': {}
      },
      grupoRepresentativo: {
        lugar: '',
        nombreExportador: '',
        empresa: '',
        cargo: '',
        fax: '',
        telefono: '',
        correoElectronico: ''
      }
    });

  });

});