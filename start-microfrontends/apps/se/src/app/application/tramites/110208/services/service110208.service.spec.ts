// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Solocitud110208Service } from './service110208.service';
import { HttpClient } from '@angular/common/http';
import { Tramite110208Store } from '../../../estados/tramites/tramite110208.store';
import { Tramite110208Query } from '../../../estados/queries/tramite110208.query';
import { HttpCoreService } from '@libs/shared/data-access-user/src';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite110208Store {}

@Injectable()
class MockTramite110208Query {}

describe('Solocitud110208Service', () => {
  let service;

  beforeEach(() => {
    service = new Solocitud110208Service({}, {}, {}, {});
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite110208Store = service.tramite110208Store || {};
    service.tramite110208Store.setEntidadFederativa = jest.fn();
    service.tramite110208Store.setBloque = jest.fn();
    service.tramite110208Store.setFraccionArancelariaForm = jest.fn();
    service.tramite110208Store.setRegistroProductoForm = jest.fn();
    service.tramite110208Store.setNombreComercialForm = jest.fn();
    service.tramite110208Store.setFechaInicio = jest.fn();
    service.tramite110208Store.setFechaFinal = jest.fn();
    service.tramite110208Store.setTercerOperador = jest.fn();
    service.tramite110208Store.setMarca = jest.fn();
    service.tramite110208Store.setUmc = jest.fn();
    service.tramite110208Store.setCantidad = jest.fn();
    service.tramite110208Store.setValorDeLa = jest.fn();
    service.tramite110208Store.setComplementoDescripcion = jest.fn();
    service.tramite110208Store.setNFactura = jest.fn();
    service.tramite110208Store.setTipoDeFactura = jest.fn();
    service.tramite110208Store.setFechaFactura = jest.fn();
    service.tramite110208Store.setNombres = jest.fn();
    service.tramite110208Store.setPrimerApellido = jest.fn();
    service.tramite110208Store.setSegundoApellido = jest.fn();
    service.tramite110208Store.setNumeroFiscal = jest.fn();
    service.tramite110208Store.setRazonSocial = jest.fn();
    service.tramite110208Store.setCiudad = jest.fn();
    service.tramite110208Store.setCalle = jest.fn();
    service.tramite110208Store.setNumeroLetra = jest.fn();
    service.tramite110208Store.setLada = jest.fn();
    service.tramite110208Store.setTelefono = jest.fn();
    service.tramite110208Store.setFax = jest.fn();
    service.tramite110208Store.setCorreoElectronico = jest.fn();
    service.tramite110208Store.setPaisDestino = jest.fn();
    service.tramite110208Store.setMedioTransporte = jest.fn();
    service.tramite110208Store.setRutaCompleta = jest.fn();
    service.tramite110208Store.setPuertoDesembarque = jest.fn();
    service.tramite110208Store.setPuertoEmbarque = jest.fn();
    service.tramite110208Store.setObservaciones = jest.fn();
    service.tramite110208Store.setIdioma = jest.fn();
    service.tramite110208Store.setEntidadFederativaCertificado = jest.fn();
    service.tramite110208Store.setRepresentacionFederal = jest.fn();
    service.actualizarEstadoFormulario({
      entidadFederativa: {},
      bloque: {},
      fraccionArancelariaForm: {},
      registroProductoForm: {},
      nombreComercialForm: {},
      fechaInicio: {},
      fechaFinal: {},
      tercerOperador: {},
      marca: {},
      umc: {},
      cantidad: {},
      valorDeLa: {},
      complementoDescripcion: {},
      nFactura: {},
      tipoDeFactura: {},
      fechaFactura: {},
      nombres: {},
      primerApellido: {},
      segundoApellido: {},
      numeroFiscal: {},
      razonSocial: {},
      ciudad: {},
      calle: {},
      numeroLetra: {},
      lada: {},
      telefono: {},
      fax: {},
      correoElectronico: {},
      paisDestino: {},
      medioTransporte: {},
      rutaCompleta: {},
      puertoDeEmbarque: {},
      puertoDeDesembarque: {},
      observaciones: {},
      idioma: {},
      entidadFederativaCertificado: {},
      representacionFederal: {}
    });
    expect(service.tramite110208Store.setEntidadFederativa).toHaveBeenCalled();
    expect(service.tramite110208Store.setBloque).toHaveBeenCalled();
    expect(service.tramite110208Store.setFraccionArancelariaForm).toHaveBeenCalled();
    expect(service.tramite110208Store.setRegistroProductoForm).toHaveBeenCalled();
    expect(service.tramite110208Store.setNombreComercialForm).toHaveBeenCalled();
    expect(service.tramite110208Store.setFechaInicio).toHaveBeenCalled();
    expect(service.tramite110208Store.setFechaFinal).toHaveBeenCalled();
    expect(service.tramite110208Store.setTercerOperador).toHaveBeenCalled();
    expect(service.tramite110208Store.setMarca).toHaveBeenCalled();
    expect(service.tramite110208Store.setUmc).toHaveBeenCalled();
    expect(service.tramite110208Store.setCantidad).toHaveBeenCalled();
    expect(service.tramite110208Store.setValorDeLa).toHaveBeenCalled();
    expect(service.tramite110208Store.setComplementoDescripcion).toHaveBeenCalled();
    expect(service.tramite110208Store.setNFactura).toHaveBeenCalled();
    expect(service.tramite110208Store.setTipoDeFactura).toHaveBeenCalled();
    expect(service.tramite110208Store.setFechaFactura).toHaveBeenCalled();
    expect(service.tramite110208Store.setNombres).toHaveBeenCalled();
    expect(service.tramite110208Store.setPrimerApellido).toHaveBeenCalled();
    expect(service.tramite110208Store.setSegundoApellido).toHaveBeenCalled();
    expect(service.tramite110208Store.setNumeroFiscal).toHaveBeenCalled();
    expect(service.tramite110208Store.setRazonSocial).toHaveBeenCalled();
    expect(service.tramite110208Store.setCiudad).toHaveBeenCalled();
    expect(service.tramite110208Store.setCalle).toHaveBeenCalled();
    expect(service.tramite110208Store.setNumeroLetra).toHaveBeenCalled();
    expect(service.tramite110208Store.setLada).toHaveBeenCalled();
    expect(service.tramite110208Store.setTelefono).toHaveBeenCalled();
    expect(service.tramite110208Store.setFax).toHaveBeenCalled();
    expect(service.tramite110208Store.setCorreoElectronico).toHaveBeenCalled();
    expect(service.tramite110208Store.setPaisDestino).toHaveBeenCalled();
    expect(service.tramite110208Store.setMedioTransporte).toHaveBeenCalled();
    expect(service.tramite110208Store.setRutaCompleta).toHaveBeenCalled();
    expect(service.tramite110208Store.setPuertoEmbarque).toHaveBeenCalled();
    expect(service.tramite110208Store.setPuertoDesembarque).toHaveBeenCalled();
    expect(service.tramite110208Store.setObservaciones).toHaveBeenCalled();
    expect(service.tramite110208Store.setIdioma).toHaveBeenCalled();
    expect(service.tramite110208Store.setEntidadFederativaCertificado).toHaveBeenCalled();
    expect(service.tramite110208Store.setRepresentacionFederal).toHaveBeenCalled();
  });

  it('should run #getRegistroTomaMuestrasMercanciasData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getRegistroTomaMuestrasMercanciasData();
    // expect(service.http.get).toHaveBeenCalled();
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
    // expect(service.httpService.post).toHaveBeenCalled();
  });

  it('should run #guardarDatosPost()', async () => {
    service.httpService = service.httpService || {};
    service.httpService.post = jest.fn().mockReturnValue(observableOf('post'));
    service.guardarDatosPost({});
    // expect(service.httpService.post).toHaveBeenCalled();
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
        'registroProducto': {}
      },
      mercanciaTabla: {}
    });
    // expect(service.buildMercanciaSeleccionadas).toHaveBeenCalled();
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
        'correoElectronico': {},
        'paisDestin': {}
      },
      medioDeTransporteSeleccion: {
        clave: {}
      },
      rutaCompleta: {},
      puertoDeEmbarque: {},
      puertoDeDesembarque: {}
    });

  });

});