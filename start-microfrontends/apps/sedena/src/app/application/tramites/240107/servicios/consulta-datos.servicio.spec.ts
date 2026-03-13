// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ConsultaDatosService } from '../servicios/consulta-datos.servicio';
import { HttpClient } from '@angular/common/http';
import { Tramite240107Store } from '../estados/tramite240107Store.store';
import { SeccionLibStore } from '@ng-mf/data-access-user';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite240107Store {}

describe('ConsultaDatosService', () => {
  let service;

  beforeEach(() => {
    service = new ConsultaDatosService({}, {}, {});
  });

  it('should run #updateDatosDel()', async () => {
    service.tramiteStore = service.tramiteStore || {};
    service.tramiteStore.updateDatosDelTramiteFormState = jest.fn();
    service.updateDatosDel({});
    expect(service.tramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalled();
  });

  it('should run #updatePagoDerechos()', async () => {
    service.tramiteStore = service.tramiteStore || {};
    service.tramiteStore.updatePagoDerechosFormState = jest.fn();
    service.updatePagoDerechos({});
    expect(service.tramiteStore.updatePagoDerechosFormState).toHaveBeenCalled();
  });

  it('should run #updateDestinatario()', async () => {
    service.tramiteStore = service.tramiteStore || {};
    service.tramiteStore.updateDestinatarioFinalTablaDatos = jest.fn();
    service.updateDestinatario({});
    expect(service.tramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalled();
  });

  it('should run #updateProveedor()', async () => {
    service.tramiteStore = service.tramiteStore || {};
    service.tramiteStore.updateProveedorTablaDatos = jest.fn();
    service.updateProveedor({});
    expect(service.tramiteStore.updateProveedorTablaDatos).toHaveBeenCalled();
  });

  it('should run #updateMercancia()', async () => {
    service.tramiteStore = service.tramiteStore || {};
    service.tramiteStore.updateMercanciaTablaDatos = jest.fn();
    service.updateMercancia({});
    expect(service.tramiteStore.updateMercanciaTablaDatos).toHaveBeenCalled();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramiteStore = service.tramiteStore || {};
    service.tramiteStore.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
    expect(service.tramiteStore.update).toHaveBeenCalled();
  });

  it('should run #getDatosDeLaSolicitudData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosDeLaSolicitudData();
    expect(service.http.get).toHaveBeenCalled();
  });

});