// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { NuevoProgramaIndustrialService } from './nuevo-programa-industrial.service';
import { HttpClient } from '@angular/common/http';
import { Tramite80101Store } from '../estados/tramite80101.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite80101Store {}

describe('NuevoProgramaIndustrialService', () => {
  let service;

  beforeEach(() => {
    service = new NuevoProgramaIndustrialService({}, {});
  });

  it('should run #getDatos()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.getDatos();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerIngresoSelectList()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerIngresoSelectList();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerListaEstado()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.obtenerListaEstado();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getSubfabricantesDisponibles()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.getSubfabricantesDisponibles();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerComplimentos()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerComplimentos();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite80101Store = service.tramite80101Store || {};
    service.tramite80101Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
    expect(service.tramite80101Store.update).toHaveBeenCalled();
  });

  it('should run #getRegistroTomaMuestrasMercanciasData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getRegistroTomaMuestrasMercanciasData();
    expect(service.http.get).toHaveBeenCalled();
  });

it('should handle error in #getDatos()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(throwError(() => new Error('Error fetching data')));
    service.getDatos().subscribe({
        error: (err) => {
            expect(err.message).toBe('Error fetching data');
        },
    });
    expect(service.http.get).toHaveBeenCalled();
});

it('should handle error in #obtenerIngresoSelectList()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(throwError(() => new Error('Error fetching dropdown data')));
    service.obtenerIngresoSelectList().subscribe({
        error: (err) => {
            expect(err.message).toBe('Error fetching dropdown data');
        },
    });
    expect(service.http.get).toHaveBeenCalled();
});

it('should handle error in #obtenerListaEstado()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(throwError(() => new Error('Error fetching state list')));
    service.obtenerListaEstado().subscribe({
        error: (err) => {
            expect(err.message).toBe('Error fetching state list');
        },
    });
    expect(service.http.get).toHaveBeenCalled();
});

it('should handle error in #getSubfabricantesDisponibles()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(throwError(() => new Error('Error fetching subfabricantes')));
    service.getSubfabricantesDisponibles().subscribe({
        error: (err) => {
            expect(err.message).toBe('Error fetching subfabricantes');
        },
    });
    expect(service.http.get).toHaveBeenCalled();
});

it('should handle error in #obtenerComplimentos()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(throwError(() => new Error('Error fetching complementos')));
    service.obtenerComplimentos().subscribe({
        error: (err) => {
            expect(err.message).toBe('Error fetching complementos');
        },
    });
    expect(service.http.get).toHaveBeenCalled();
});

it('should handle error in #getRegistroTomaMuestrasMercanciasData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(throwError(() => new Error('Error fetching registro data')));
    service.getRegistroTomaMuestrasMercanciasData().subscribe({
        error: (err) => {
            expect(err.message).toBe('Error fetching registro data');
        },
    });
    expect(service.http.get).toHaveBeenCalled();
});

it('should update state correctly in #actualizarEstadoFormulario()', async () => {
    const mockState = { key: 'value' };
    service.tramite80101Store = service.tramite80101Store || {};
    service.tramite80101Store.update = jest.fn();
    service.actualizarEstadoFormulario(mockState);
    expect(service.tramite80101Store.update).toHaveBeenCalledWith(expect.any(Function));
});

it('should call HTTP GET with correct URL in #getDatos()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({ data: { InfoServicios: {} } }));
    service.getDatos().subscribe((data) => {
        expect(data).toEqual({});
    });
    expect(service.http.get).toHaveBeenCalledWith('assets/json/80205/ampliacion-servicios.json');
});

it('should call HTTP GET with correct URL in #obtenerIngresoSelectList()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({ data: [] }));
    service.obtenerIngresoSelectList().subscribe((data) => {
        expect(data).toEqual([]);
    });
    expect(service.http.get).toHaveBeenCalledWith('assets/json/80205/ampliacion-IMMEX-dropdown.json');
});

it('should call HTTP GET with correct URL in #obtenerListaEstado()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerListaEstado().subscribe((data) => {
        expect(data).toEqual({});
    });
    expect(service.http.get).toHaveBeenCalledWith('assets/json/80207/estado-datos.json');
});

it('should call HTTP GET with correct URL in #getSubfabricantesDisponibles()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({ data: [] }));
    service.getSubfabricantesDisponibles().subscribe((data) => {
        expect(data).toEqual([]);
    });
    expect(service.http.get).toHaveBeenCalledWith('assets/json/80207/submanufactureras-disponibles-datos.json');
});

it('should call HTTP GET with correct URL in #obtenerComplimentos()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerComplimentos().subscribe((data) => {
        expect(data).toEqual({});
    });
    expect(service.http.get).toHaveBeenCalledWith('assets/json/80102/datos-complimentos.json');
});

it('should call HTTP GET with correct URL in #getRegistroTomaMuestrasMercanciasData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.getRegistroTomaMuestrasMercanciasData().subscribe((data) => {
        expect(data).toEqual({});
    });
    expect(service.http.get).toHaveBeenCalledWith('assets/json/80101/respuestaDeActualizacionDe.json');
});

it('should update state correctly in #actualizarEstadoFormulario() with specific data', async () => {
    const mockState = { key: 'value' };
    service.tramite80101Store = service.tramite80101Store || {};
    service.tramite80101Store.update = jest.fn();
    service.actualizarEstadoFormulario(mockState);
    expect(service.tramite80101Store.update).toHaveBeenCalledWith(expect.any(Function));
    const updateFn = service.tramite80101Store.update.mock.calls[0][0];
    const updatedState = updateFn({ existingKey: 'existingValue' });
    expect(updatedState).toEqual({ existingKey: 'existingValue', key: 'value' });
});
});