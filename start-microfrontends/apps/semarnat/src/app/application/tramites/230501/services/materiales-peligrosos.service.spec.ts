// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { MaterialesPeligrososService } from './materiales-peligrosos.service';
import { HttpClient } from '@angular/common/http';
import { Tramite230501Store } from '../estados/stores/tramite230501Store.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite230501Store {}

describe('MaterialesPeligrososService', () => {
  let service;

  beforeEach(() => {
    service = new MaterialesPeligrososService({}, {});
  });

  it('should run #inicializaPagoDerechosCatalogo()', async () => {
    service.obtenerRespuestaPorUrl = jest.fn();
    service.inicializaPagoDerechosCatalogo();
    expect(service.obtenerRespuestaPorUrl).toHaveBeenCalled();
  });

  it('should run #obtenerRespuestaPorUrl()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({
      code: {},
      data: {}
    }));
    service.obtenerRespuestaPorUrl({data: "self"}, 'listoBanco', '/230501/pagoDerechosBanco.json');
    expect(service.httpServicios.get).toHaveBeenCalled();
  });

  it('should run #convertirNumeroALetras()', async () => {

    service.convertirNumeroALetras({});

  });

  it('should run #obtenerListaPaises()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerListaPaises();
    expect(service.httpServicios.get).toHaveBeenCalled();
  });

  it('should run #obtenerListaEstados()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerListaEstados();
    expect(service.httpServicios.get).toHaveBeenCalled();
  });

  it('should run #obtenerListaMunicipios()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerListaMunicipios();
    expect(service.httpServicios.get).toHaveBeenCalled();
  });

  it('should run #obtenerListaLocalidades()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerListaLocalidades();
    expect(service.httpServicios.get).toHaveBeenCalled();
  });

  it('should run #obtenerListaCodigosPostales()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerListaCodigosPostales();
    expect(service.httpServicios.get).toHaveBeenCalled();
  });

  it('should run #obtenerListaColonias()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerListaColonias();
    expect(service.httpServicios.get).toHaveBeenCalled();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite230501Store = service.tramite230501Store || {};
    service.tramite230501Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
    expect(service.tramite230501Store.update).toHaveBeenCalled();
  });

  it('should run #getRegistroTomaMuestrasMercanciasData()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn();
    service.getRegistroTomaMuestrasMercanciasData();
    expect(service.httpServicios.get).toHaveBeenCalled();
  });

it('should handle error in #obtenerRespuestaPorUrl()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(throwError(() => new Error('Error occurred')));
    const self = { listoBanco: [] };
    service.obtenerRespuestaPorUrl(self, 'listoBanco', '/230501/pagoDerechosBanco.json');
    expect(self.listoBanco).toEqual([]);
    expect(service.httpServicios.get).toHaveBeenCalled();
});

it('should return correct value for #convertirNumeroALetras()', async () => {
    const result = service.convertirNumeroALetras(123);
    expect(result).toBe('ciento veintitres');
});

it('should return "cero" for #convertirNumeroALetras() when input is 0', async () => {
    const result = service.convertirNumeroALetras(0);
    expect(result).toBe('cero');
});

it('should return "cien" for #convertirNumeroALetras() when input is 100', async () => {
    const result = service.convertirNumeroALetras(100);
    expect(result).toBe('cien');
});

it('should handle empty response in #obtenerListaPaises()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({ pais: [] }));
    const result = await service.obtenerListaPaises().toPromise();
    expect(result).toEqual([]);
    expect(service.httpServicios.get).toHaveBeenCalled();
});

it('should handle empty response in #obtenerListaEstados()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({ estado: [] }));
    const result = await service.obtenerListaEstados().toPromise();
    expect(result).toEqual([]);
    expect(service.httpServicios.get).toHaveBeenCalled();
});

it('should handle empty response in #obtenerListaMunicipios()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({ municipio: [] }));
    const result = await service.obtenerListaMunicipios().toPromise();
    expect(result).toEqual([]);
    expect(service.httpServicios.get).toHaveBeenCalled();
});

it('should handle empty response in #obtenerListaLocalidades()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({ localidad: [] }));
    const result = await service.obtenerListaLocalidades().toPromise();
    expect(result).toEqual([]);
    expect(service.httpServicios.get).toHaveBeenCalled();
});

it('should handle empty response in #obtenerListaCodigosPostales()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({ codigo_postal: [] }));
    const result = await service.obtenerListaCodigosPostales().toPromise();
    expect(result).toEqual([]);
    expect(service.httpServicios.get).toHaveBeenCalled();
});

it('should handle empty response in #obtenerListaColonias()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(observableOf({ colonia: [] }));
    const result = await service.obtenerListaColonias().toPromise();
    expect(result).toEqual([]);
    expect(service.httpServicios.get).toHaveBeenCalled();
});

it('should handle error in #getRegistroTomaMuestrasMercanciasData()', async () => {
    service.httpServicios = service.httpServicios || {};
    service.httpServicios.get = jest.fn().mockReturnValue(throwError(() => new Error('Error occurred')));
    service.getRegistroTomaMuestrasMercanciasData().subscribe({
        error: (err) => {
            expect(err.message).toBe('Error occurred');
        },
    });
    expect(service.httpServicios.get).toHaveBeenCalled();
});

it('should update state correctly in #actualizarEstadoFormulario()', () => {
  const mockUpdateFn = jest.fn();
  service.tramite230501Store = {
    update: mockUpdateFn
  } as any;

  const mockState = { tipoSolicitud: 'Nuevo', datos: { nombre: 'Ejemplo' } };
  
  service.actualizarEstadoFormulario(mockState);

  // Get the argument passed into update()
  const updateCallback = mockUpdateFn.mock.calls[0][0]; // This is the updater function
  const updatedState = updateCallback({}); // Call it with an empty state to simulate internal usage

  expect(updatedState).toEqual(expect.objectContaining(mockState));
});

});