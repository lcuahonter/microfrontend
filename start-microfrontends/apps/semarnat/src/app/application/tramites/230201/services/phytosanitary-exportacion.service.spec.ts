// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { PhytosanitaryExportacionService } from './phytosanitary-exportacion.service';
import { HttpClient } from '@angular/common/http';
import { Tramite230201Store } from '../estados/tramite230201.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite230201Store {}

describe('PhytosanitaryExportacionService', () => {
  let service;

  beforeEach(() => {
    service = new PhytosanitaryExportacionService({}, {});
  });

  it('should run #getPaisDeProcedencia()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getPaisDeProcedencia();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getAduana()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getAduana();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getPais()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getPais();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getMetaInfo()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getMetaInfo();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getEntidades()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getEntidades();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getDescripcionProducto()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDescripcionProducto();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #agregarSolicitud()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.agregarSolicitud();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #agregarDetalle()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.agregarDetalle();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getFraccionArancelaria()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getFraccionArancelaria();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getGenero()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getGenero();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getEspecie()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getEspecie();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getNombreComun()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getNombreComun();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getUnidadDeMedida()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getUnidadDeMedida();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getMedioDeTransporte()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getMedioDeTransporte();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getEstado()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getEstado();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getSavedData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getSavedData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.store = service.store || {};
    service.store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({
      aduana: {},
      paisDeProcedencia: {},
      pais: {},
      entidades: {},
      descripcionProducto: {},
      datosSolicitud: {},
      datosDetalle: {},
      fraccionArancelaria: {},
      descripcionFraccionArancelaria: {},
      cantidad: {},
      cantidadLetra: {},
      genero: {},
      especie: {},
      nombreComun: {},
      unidadDeMedida: {},
      lungarDeEntrada: {},
      destinoDeImportador: {},
      medioDeTransporte: {},
      numeroYDescripcion: {},
      codigoPostal: {},
      estado: {},
      calle: {},
      numeroExterior: {},
      numeroInterior: {},
      colonia: {},
      tercerosPopupState: {},
      destinatarios: {},
      claveDeReferencia: {},
      cadenaPagoDependencia: {},
      banco: {},
      llaveDePago: {},
      fecPago: {},
      impPago: {}
    });
    expect(service.store.update).toHaveBeenCalled();
  });

});