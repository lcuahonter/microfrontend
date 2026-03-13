// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { AgriculturaApiService } from './agricultura-api.service';
import { HttpClient } from '@angular/common/http';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { FitosanitarioStore } from '../../estados/fitosanitario.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockFitosanitarioStore {}

describe('AgriculturaApiService', () => {
  let service;

  beforeEach(() => {
    service = new AgriculturaApiService({}, {}, {});
  });

  it('should run #obtenerSelectorList()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerSelectorList({});
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #updateDatosForma()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore.actualizarDatosForma = jest.fn();
    service.updateDatosForma({});
    expect(service.fitosanitarioStore.actualizarDatosForma).toHaveBeenCalled();
  });

  it('should run #updateMovilizacion()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore.actualizarMovilizacion = jest.fn();
    service.updateMovilizacion({});
    expect(service.fitosanitarioStore.actualizarMovilizacion).toHaveBeenCalled();
  });

  it('should run #updatePago()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore.actualizarPago = jest.fn();
    service.updatePago({});
    expect(service.fitosanitarioStore.actualizarPago).toHaveBeenCalled();
  });

  it('should run #limpiarFormulario()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore.limpiarFormulario = jest.fn();
    service.limpiarFormulario();
    expect(service.fitosanitarioStore.limpiarFormulario).toHaveBeenCalled();
  });

  it('should run #getDatosForma()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore._select = jest.fn().mockReturnValue([
      {
        "datos": {}
      }
    ]);
    service.getDatosForma();
    expect(service.fitosanitarioStore._select).toHaveBeenCalled();
  });

  it('should run #getPagoDeDerechosa()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore._select = jest.fn().mockReturnValue([
      {
        "pago": {}
      }
    ]);
    service.getPagoDeDerechosa();
    expect(service.fitosanitarioStore._select).toHaveBeenCalled();
  });

  it('should run #getMovilizacion()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore._select = jest.fn().mockReturnValue([
      {
        "movilizacion": {}
      }
    ]);
    service.getMovilizacion();
    expect(service.fitosanitarioStore._select).toHaveBeenCalled();
  });

  it('should run #getAllDatosForma()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore._select = jest.fn().mockReturnValue([
      null
    ]);
    service.getAllDatosForma();
    expect(service.fitosanitarioStore._select).toHaveBeenCalled();
  });

  it('should run #actualizarFormaValida()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore.actualizarformaValida = jest.fn();
    service.obtenerTodosLosStatus = jest.fn().mockReturnValue(observableOf({}));
    service.seccionStore = service.seccionStore || {};
    service.seccionStore.establecerSeccion = jest.fn();
    service.seccionStore.establecerFormaValida = jest.fn();
    service.actualizarFormaValida({});
    expect(service.fitosanitarioStore.actualizarformaValida).toHaveBeenCalled();
    expect(service.obtenerTodosLosStatus).toHaveBeenCalled();
    expect(service.seccionStore.establecerSeccion).toHaveBeenCalled();
    expect(service.seccionStore.establecerFormaValida).toHaveBeenCalled();
  });

  it('should run #obtenerTodosLosStatus()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore._select = jest.fn().mockReturnValue({
      0: {
        finalEnviar: {}
      },
      pipe: function() {}
    });
    service.obtenerTodosLosStatus();
    expect(service.fitosanitarioStore._select).toHaveBeenCalled();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore.actualizarDatosForma = jest.fn();
    service.fitosanitarioStore.actualizarMovilizacion = jest.fn();
    service.fitosanitarioStore.actualizarPago = jest.fn();
    service.fitosanitarioStore.tablaDatosFinal = jest.fn();
    service.fitosanitarioStore.updateTercerosExportador = jest.fn(); // <-- Add this mock
    service.fitosanitarioStore.updateTercerosRelacionados = jest.fn(); // <-- Add this mock
    service.actualizarEstadoFormulario({
      datos: {},
      movilizacion: {},
      pago: {},
      tablaDatos: {}
    });
    expect(service.fitosanitarioStore.actualizarDatosForma).toHaveBeenCalled();
    expect(service.fitosanitarioStore.actualizarMovilizacion).toHaveBeenCalled();
    expect(service.fitosanitarioStore.actualizarPago).toHaveBeenCalled();
    expect(service.fitosanitarioStore.tablaDatosFinal).toHaveBeenCalled();
    expect(service.fitosanitarioStore.updateTercerosExportador).toHaveBeenCalled(); // <-- Add this assertion
    expect(service.fitosanitarioStore.updateTercerosRelacionados).toHaveBeenCalled(); // <-- Add this assertion
  });

  it('should run #getDatosDeLaSolicitudData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosDeLaSolicitudData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should call http.get with correct URL in obtenerSelectorList()', async () => {
    const mockFileName = 'catalogo.json';
    const mockUrl = service.url + mockFileName;
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({ data: [{ id: 1 }] }));
    const result$ = service.obtenerSelectorList(mockFileName);
    result$.subscribe(data => {
      expect(data).toEqual([{ id: 1 }]);
    });
    expect(service.http.get).toHaveBeenCalledWith(mockUrl);
  });

  it('should call fitosanitarioStore.actualizarDatosForma with correct argument in updateDatosForma()', async () => {
    const datosForma = { test: 'value' };
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore.actualizarDatosForma = jest.fn();
    service.updateDatosForma(datosForma);
    expect(service.fitosanitarioStore.actualizarDatosForma).toHaveBeenCalledWith(datosForma);
  });

  it('should call fitosanitarioStore.actualizarMovilizacion with correct argument in updateMovilizacion()', async () => {
    const movilizacion = { movil: 'data' };
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore.actualizarMovilizacion = jest.fn();
    service.updateMovilizacion(movilizacion);
    expect(service.fitosanitarioStore.actualizarMovilizacion).toHaveBeenCalledWith(movilizacion);
  });

  it('should call fitosanitarioStore.actualizarPago with correct argument in updatePago()', async () => {
    const pagoDatos = { pago: 123 };
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore.actualizarPago = jest.fn();
    service.updatePago(pagoDatos);
    expect(service.fitosanitarioStore.actualizarPago).toHaveBeenCalledWith(pagoDatos);
  });

  it('should call fitosanitarioStore.limpiarFormulario in limpiarFormulario()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore.limpiarFormulario = jest.fn();
    service.limpiarFormulario();
    expect(service.fitosanitarioStore.limpiarFormulario).toHaveBeenCalled();
  });

  it('should call fitosanitarioStore._select with correct selector in getDatosForma()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore._select = jest.fn();
    service.getDatosForma();
    expect(service.fitosanitarioStore._select).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call fitosanitarioStore._select with correct selector in getPagoDeDerechosa()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore._select = jest.fn();
    service.getPagoDeDerechosa();
    expect(service.fitosanitarioStore._select).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call fitosanitarioStore._select with correct selector in getMovilizacion()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore._select = jest.fn();
    service.getMovilizacion();
    expect(service.fitosanitarioStore._select).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call fitosanitarioStore._select with correct selector in getAllDatosForma()', async () => {
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore._select = jest.fn();
    service.getAllDatosForma();
    expect(service.fitosanitarioStore._select).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call fitosanitarioStore.actualizarformaValida and seccionStore methods in actualizarFormaValida()', async () => {
    const updatedFormaValida = { section1: true, section2: false };
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore.actualizarformaValida = jest.fn();
    service.obtenerTodosLosStatus = jest.fn().mockReturnValue(observableOf(true));
    service.seccionStore = service.seccionStore || {};
    service.seccionStore.establecerSeccion = jest.fn();
    service.seccionStore.establecerFormaValida = jest.fn();
    service.actualizarFormaValida(updatedFormaValida);
    expect(service.fitosanitarioStore.actualizarformaValida).toHaveBeenCalledWith(updatedFormaValida);
    expect(service.seccionStore.establecerSeccion).toHaveBeenCalledWith([true]);
    expect(service.seccionStore.establecerFormaValida).toHaveBeenCalledWith([true]);
  });

  it('should call fitosanitarioStore._select and map in obtenerTodosLosStatus()', async () => {
    const mockFinalEnviar = { a: true, b: true };
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore._select = jest.fn().mockReturnValue(observableOf(mockFinalEnviar));
    const result$ = service.obtenerTodosLosStatus();
    result$.subscribe(result => {
      expect(result).toBe(true);
    });
    expect(service.fitosanitarioStore._select).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call fitosanitarioStore methods with correct arguments in actualizarEstadoFormulario()', async () => {
    const datosFinal = {
      datos: { a: 1 },
      movilizacion: { b: 2 },
      pago: { c: 3 },
      tablaDatos: { d: 4 }
    };
    service.fitosanitarioStore = service.fitosanitarioStore || {};
    service.fitosanitarioStore.actualizarDatosForma = jest.fn();
    service.fitosanitarioStore.actualizarMovilizacion = jest.fn();
    service.fitosanitarioStore.actualizarPago = jest.fn();
    service.fitosanitarioStore.tablaDatosFinal = jest.fn();
    service.fitosanitarioStore.updateTercerosExportador = jest.fn(); // <-- Add this mock
    service.fitosanitarioStore.updateTercerosRelacionados = jest.fn(); // <-- Add this mock
    service.actualizarEstadoFormulario(datosFinal);
    expect(service.fitosanitarioStore.actualizarDatosForma).toHaveBeenCalledWith(datosFinal.datos);
    expect(service.fitosanitarioStore.actualizarMovilizacion).toHaveBeenCalledWith(datosFinal.movilizacion);
    expect(service.fitosanitarioStore.actualizarPago).toHaveBeenCalledWith(datosFinal.pago);
    expect(service.fitosanitarioStore.tablaDatosFinal).toHaveBeenCalledWith(datosFinal.tablaDatos);
    expect(service.fitosanitarioStore.updateTercerosExportador).toHaveBeenCalled(); // <-- Add this assertion
    expect(service.fitosanitarioStore.updateTercerosRelacionados).toHaveBeenCalled(); // <-- Add this assertion
  });

  it('should call http.get with correct path in getDatosDeLaSolicitudData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosDeLaSolicitudData();
    expect(service.http.get).toHaveBeenCalledWith('assets/json/220202/datos-de-la-solicitud.json');
  });

});