// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ImportacionDeVehiculosService } from './importacion-de-vehiculos.service';
import { HttpClient } from '@angular/common/http';
import { CatalogoServices } from '@ng-mf/data-access-user';
import { Tramite130111Query } from '../../../estados/queries/tramite130111.query';

const MockHttpClient = {
  post: () => {}
};

const MockTramite130111Store = {};

const MockTramite130111Query = {};

describe('ImportacionDeVehiculosService', () => {
  let service;

  beforeEach(() => {
    service = new ImportacionDeVehiculosService({}, {}, {}, {});
  });

  it('should run #getListaDePaisesDisponibles()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getListaDePaisesDisponibles();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getPaisesPorBloque()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getPaisesPorBloque({});
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getEntidadFederativa()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getEntidadFederativa();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getRepresentacionFederal()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getRepresentacionFederal();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getSolicitudeOptions()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getSolicitudeOptions();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getProductoOptions()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getProductoOptions();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getTablaDatos()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getTablaDatos();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite130111Store = service.tramite130111Store || {};
    service.tramite130111Store.actualizarEstado = jest.fn();
    service.actualizarEstadoFormulario({});
    expect(service.tramite130111Store.actualizarEstado).toHaveBeenCalled();
  });

  it('should run #getDatosDeLaSolicitud()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosDeLaSolicitud();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #guardarDatosPost()', async () => {
    service.http = service.http || {};
    service.http.post = jest.fn().mockReturnValue(observableOf('post'));
    service.guardarDatosPost({});
    expect(service.http.post).toHaveBeenCalled();
  });

  it('should run #getRegimenCatalogo()', async () => {
    service.catalogoServices = service.catalogoServices || {};
    service.catalogoServices.regimenesCatalogo = jest.fn().mockReturnValue(observableOf({}));
    service.getRegimenCatalogo({});
    expect(service.catalogoServices.regimenesCatalogo).toHaveBeenCalled();
  });

  it('should run #getClasificacionRegimenCatalogo()', async () => {
    service.catalogoServices = service.catalogoServices || {};
    service.catalogoServices.clasificacionRegimenCatalogo = jest.fn().mockReturnValue(observableOf({}));
    service.getClasificacionRegimenCatalogo({});
    expect(service.catalogoServices.clasificacionRegimenCatalogo).toHaveBeenCalled();
  });

   it('should return datos array when response contains datos', (done) => {
    const mockResponse = { datos: [{ id: 1, nombre: 'Fracción 1' }] };
    service.catalogoServices.fraccionesArancelariasCatalogo = jest.fn().mockReturnValue(observableOf(mockResponse));

    service.getFraccionCatalogoService('123').subscribe((result) => {
      expect(result).toEqual(mockResponse.datos);
      expect(service.catalogoServices.fraccionesArancelariasCatalogo)
        .toHaveBeenCalledWith('123', 'TITPEX.130111');
      done();
    });
  });
  it('should run #getUMTService()', async () => {
    service.catalogoServices = service.catalogoServices || {};
    service.catalogoServices.unidadesMedidaTarifariaCatalogo = jest.fn().mockReturnValue(observableOf({}));
    service.getUMTService({}, {});
    expect(service.catalogoServices.unidadesMedidaTarifariaCatalogo).toHaveBeenCalled();
  });

  it('should run #getEntidadesFederativasCatalogo()', async () => {
    service.catalogoServices = service.catalogoServices || {};
    service.catalogoServices.entidadesFederativasCatalogo = jest.fn().mockReturnValue(observableOf({}));
    service.getEntidadesFederativasCatalogo({});
    expect(service.catalogoServices.entidadesFederativasCatalogo).toHaveBeenCalled();
  });

  it('should run #getRepresentacionFederalCatalogo()', async () => {
    service.catalogoServices = service.catalogoServices || {};
    service.catalogoServices.representacionFederalCatalogo = jest.fn().mockReturnValue(observableOf({}));
    service.getRepresentacionFederalCatalogo({}, {});
    expect(service.catalogoServices.representacionFederalCatalogo).toHaveBeenCalled();
  });

  it('should run #getTodosPaisesSeleccionados()', async () => {
    service.catalogoServices = service.catalogoServices || {};
    service.catalogoServices.todosPaisesSeleccionados = jest.fn().mockReturnValue(observableOf({}));
    service.getTodosPaisesSeleccionados({});
    expect(service.catalogoServices.todosPaisesSeleccionados).toHaveBeenCalled();
  });

  it('should run #getBloqueService()', async () => {
    service.catalogoServices = service.catalogoServices || {};
    service.catalogoServices.tratadosAcuerdoCatalogo = jest.fn().mockReturnValue(observableOf({}));
    service.getBloqueService({});
    expect(service.catalogoServices.tratadosAcuerdoCatalogo).toHaveBeenCalled();
  });

  it('should run #getMostrarPartidasService()', async () => {
    service.catalogoServices = service.catalogoServices || {};
    service.catalogoServices.mostrarPartidasSolicitud = jest.fn().mockReturnValue(observableOf({}));
    service.getMostrarPartidasService({}, {});
    expect(service.catalogoServices.mostrarPartidasSolicitud).toHaveBeenCalled();
  });

  it('should run #getPaisesPorBloqueService()', async () => {
    service.catalogoServices = service.catalogoServices || {};
    service.catalogoServices.getpaisesBloqueCatalogo = jest.fn().mockReturnValue(observableOf({}));
    service.getPaisesPorBloqueService({}, {});
    expect(service.catalogoServices.getpaisesBloqueCatalogo).toHaveBeenCalled();
  });

  it('should run #getAllState()', async () => {
    service.tramite130111Query = service.tramite130111Query || {};
    service.tramite130111Query.selectSolicitud$ = 'selectSolicitud$';
    service.getAllState();

  });

  it('should run #buildPartidasMercancia()', async () => {

    service.buildPartidasMercancia({
      tableBodyData: {},
      cantidadPartidasDeLaMercancia: {},
      descripcionPartidasDeLaMercancia: {},
      valorPartidaUSDPartidasDeLaMercancia: {},
      fraccion: {},
      unidadMedida: {}
    });

  });

  it('should run #buildMercancia()', async () => {
    service.buildPartidasMercancia = jest.fn();
    service.buildMercancia({
      cantidad: {},
      valorFacturaUSD: {},
      producto: {},
      solicitud: {},
      descripcion: {},
      usoEspecifico: {},
      justificacionImportacionExportacion: {},
      observaciones: {},
      unidadMedida: {},
      fraccion: {}
    });
    expect(service.buildPartidasMercancia).toHaveBeenCalled();
  });

  it('should run #buildProductor()', async () => {

    service.buildProductor();

  });

  it('should run #buildSolicitante()', async () => {

    service.buildSolicitante();

  });

  it('should run #buildRepresentacionFederal()', async () => {

    service.buildRepresentacionFederal({
      entidad: {},
      representacion: {}
    });

  });

  it('should run #buildEntidadesFederativas()', async () => {

    service.buildEntidadesFederativas({
      entidad: {}
    });

  });

});