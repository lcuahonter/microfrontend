// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { SolicitudService } from './solicitud.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockHttpClient {
  post() {};
}

describe('SolicitudService', () => {
  let service;

  beforeEach(() => {
    service = new SolicitudService({});
  });

  it('should run #getDatosSolicitante()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosSolicitante();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getDatosModificacion()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosModificacion();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getModificacion()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getModificacion();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getDatosTableData()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getDatosTableData();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerComplimentaria()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerComplimentaria();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerAnexo()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerAnexo();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerFederetarios()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerFederetarios();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerOperacion()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerOperacion();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #obtenerTramiteDatos()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerTramiteDatos();
    expect(service.http.get).toHaveBeenCalled();
  });

  it('should map data from #obtenerComplimentaria()', (done) => {
    service.http = service.http || {};
    const payload = { data: [{ id: 1, name: 'x' }] };
    service.http.get = jest.fn().mockReturnValue(observableOf(payload));
    service.obtenerComplimentaria().subscribe((res) => {
      expect(service.http.get).toHaveBeenCalled();
      expect(res).toEqual(payload.data);
      done();
    });
  });

  it('should map data from #obtenerAnexo()', (done) => {
    service.http = service.http || {};
    const payload = { data: [{ id: 2, file: 'a.pdf' }] };
    service.http.get = jest.fn().mockReturnValue(observableOf(payload));
    service.obtenerAnexo().subscribe((res) => {
      expect(service.http.get).toHaveBeenCalled();
      expect(res).toEqual(payload.data);
      done();
    });
  });

  it('should map data from #obtenerPlanta()', (done) => {
    service.http = service.http || {};
    const payload = { data: [{ id: 3, planta: 'P' }] };
    service.http.get = jest.fn().mockReturnValue(observableOf(payload));
    service.obtenerPlanta().subscribe((res) => {
      expect(service.http.get).toHaveBeenCalled();
      expect(res).toEqual(payload.data);
      done();
    });
  });

  it('should return JSONResponse on successful #obtenerBuscarSocioAccionista()', (done) => {
    service.http = service.http || {};
    const response = { ok: true, data: [{ name: 'socio' }] };
    service.http.post = jest.fn().mockReturnValue(observableOf(response));
    service.obtenerBuscarSocioAccionista({}).subscribe((res) => {
      expect(service.http.post).toHaveBeenCalled();
      expect(res).toBe(response);
      done();
    });
  });

  it('should emit error on failed #obtenerBuscarSocioAccionista()', (done) => {
    service.http = service.http || {};
    service.http.post = jest.fn().mockReturnValue(throwError(() => new Error('network')));
    service.obtenerBuscarSocioAccionista({}).subscribe({
      next: () => {
        // should not be called
        expect(true).toBe(false);
      },
      error: (err) => {
        expect(service.http.post).toHaveBeenCalled();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Error al obtener la lista');
        done();
      },
    });
  });

  it('should return JSONResponse on successful #guardar()', (done) => {
    service.http = service.http || {};
    const response = { ok: true, id: 123 };
    service.http.post = jest.fn().mockReturnValue(observableOf(response));
    service.guardar({} as any).subscribe((res) => {
      expect(service.http.post).toHaveBeenCalled();
      expect(res).toBe(response);
      done();
    });
  });

  it('should call correct asset path for #getDatosSolicitante()', (done) => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf([]));
    service.getDatosSolicitante().subscribe(() => {
      expect(service.http.get).toHaveBeenCalledWith('assets/json/80302/datosSolicitante.json');
      done();
    });
  });

  it('should call #obtenerAnexoExportacion with params and handle success', (done) => {
    service.http = service.http || {};
    const resp = { ok: true };
    service.http.get = jest.fn().mockReturnValue(observableOf(resp));
    const params = { a: 1 } as any;
    service.obtenerAnexoExportacion(params).subscribe((r) => {
      expect(service.http.get).toHaveBeenCalled();
      // second arg should include params object
      const callArgs = (service.http.get as jest.Mock).mock.calls[0][1];
      expect(callArgs).toBeDefined();
      expect(callArgs.params).toEqual(params);
      expect(r).toBe(resp);
      done();
    });
  });

  it('should emit error on failed #obtenerAnexoExportacion()', (done) => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(throwError(() => new Error('net')));
    service.obtenerAnexoExportacion({}).subscribe({
      next: () => expect(true).toBe(false),
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Error al obtener la lista');
        done();
      },
    });
  });

  it('should return JSONResponse on successful #obtenerBuscarNotarios()', (done) => {
    service.http = service.http || {};
    const response = { ok: true, data: [] };
    service.http.post = jest.fn().mockReturnValue(observableOf(response));
    service.obtenerBuscarNotarios({} as any).subscribe((res) => {
      expect(service.http.post).toHaveBeenCalled();
      expect(res).toBe(response);
      done();
    });
  });

  it('should emit error on failed #obtenerBuscarNotarios()', (done) => {
    service.http = service.http || {};
    service.http.post = jest.fn().mockReturnValue(throwError(() => new Error('net')));
    service.obtenerBuscarNotarios({} as any).subscribe({
      next: () => expect(true).toBe(false),
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Error al obtener la lista');
        done();
      },
    });
  });

  it('should emit error on failed #actualizarDomicilios()', (done) => {
    service.http = service.http || {};
    service.http.post = jest.fn().mockReturnValue(throwError(() => new Error('net')));
    service.actualizarDomicilios({} as any).subscribe({
      next: () => expect(true).toBe(false),
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Error al actualizar la lista');
        done();
      },
    });
  });

  it('getAllState should return Tramite80302Query.selectSolicitud$', (done) => {
    // mock the Tramite80302Query with an observable
    service.Tramite80302Query = { selectSolicitud$: observableOf({ state: 'ok' }) } as any;
    service.getAllState().subscribe((s) => {
      expect(s).toEqual({ state: 'ok' });
      done();
    });
  });

  it('should map data from #obtenerFederetarios()', (done) => {
    service.http = service.http || {};
    const payload = { data: [{ id: 5, federetario: 'F' }] };
    service.http.get = jest.fn().mockReturnValue(observableOf(payload));
    service.obtenerFederetarios().subscribe((res) => {
      expect(service.http.get).toHaveBeenCalled();
      expect(res).toEqual(payload.data);
      done();
    });
  });

  it('should map data from #obtenerOperacion()', (done) => {
    service.http = service.http || {};
    const payload = { data: [{ id: 6, operacion: 'O' }] };
    service.http.get = jest.fn().mockReturnValue(observableOf(payload));
    service.obtenerOperacion().subscribe((res) => {
      expect(service.http.get).toHaveBeenCalled();
      expect(res).toEqual(payload.data);
      done();
    });
  });

  it('getDatosTableData should call correct asset and return data', (done) => {
    service.http = service.http || {};
    const payload = [{ id: 7, dato: 'D' }];
    service.http.get = jest.fn().mockReturnValue(observableOf(payload));
    service.getDatosTableData().subscribe((res) => {
      expect(service.http.get).toHaveBeenCalledWith('assets/json/80302/datosTabla.json');
      expect(res).toBe(payload);
      done();
    });
  });

  it('getDatosModificacion and getModificacion should call correct asset', (done) => {
    service.http = service.http || {};
    const payload = [{ id: 8 }];
    service.http.get = jest.fn().mockReturnValue(observableOf(payload));
    service.getDatosModificacion().subscribe((r1) => {
      expect(service.http.get).toHaveBeenCalledWith('assets/json/80302/modificacion.json');
      service.getModificacion().subscribe((r2) => {
        expect(service.http.get).toHaveBeenCalled();
        expect(r2).toBe(payload);
        done();
      });
    });
  });

  it('should return error when #obtenerPlanta fails', (done) => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(throwError(() => new Error('fail')));
    service.obtenerPlanta().subscribe({
      next: () => expect(true).toBe(false),
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('fail');
        done();
      },
    });
  });

  it('should emit error on failed #guardar()', (done) => {
    service.http = service.http || {};
    service.http.post = jest.fn().mockReturnValue(throwError(() => new Error('net')));
    service.guardar({} as any).subscribe({
      next: () => expect(true).toBe(false),
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        // error message is built inside catchError; ensure it's an Error
        done();
      },
    });
  });

  it('should return JSONResponse on successful #actualizarDomicilios()', (done) => {
    service.http = service.http || {};
    const response = { ok: true };
    service.http.post = jest.fn().mockReturnValue(observableOf(response));
    service.actualizarDomicilios({} as any).subscribe((res) => {
      expect(service.http.post).toHaveBeenCalled();
      expect(res).toBe(response);
      done();
    });
  });

  it('should map data from #obtenerServicios()', (done) => {
    service.http = service.http || {};
    const payload = { data: [{ id: 4, servicio: 'S' }] };
    service.http.get = jest.fn().mockReturnValue(observableOf(payload));
    service.obtenerServicios().subscribe((res) => {
      expect(service.http.get).toHaveBeenCalled();
      expect(res).toEqual(payload.data);
      done();
    });
  });

  it('should call #obtenerAnexoImportacion with params and handle success', (done) => {
    service.http = service.http || {};
    const resp = { ok: true };
    service.http.get = jest.fn().mockReturnValue(observableOf(resp));
    const params = { b: 2 } as any;
    service.obtenerAnexoImportacion(params).subscribe((r) => {
      expect(service.http.get).toHaveBeenCalled();
      const callArgs = (service.http.get as jest.Mock).mock.calls[0][1];
      expect(callArgs).toBeDefined();
      expect(callArgs.params).toEqual(params);
      expect(r).toBe(resp);
      done();
    });
  });

  it('should emit error on failed #obtenerAnexoImportacion()', (done) => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(throwError(() => new Error('net')));
    service.obtenerAnexoImportacion({}).subscribe({
      next: () => expect(true).toBe(false),
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Error al obtener la lista');
        done();
      },
    });
  });

  it('should return JSONResponse on successful #obtenerOperacionImmex()', (done) => {
    service.http = service.http || {};
    const response = { ok: true, data: [] };
    service.http.post = jest.fn().mockReturnValue(observableOf(response));
    service.obtenerOperacionImmex({} as any).subscribe((res) => {
      expect(service.http.post).toHaveBeenCalled();
      expect(res).toBe(response);
      done();
    });
  });

  it('should emit error on failed #obtenerOperacionImmex()', (done) => {
    service.http = service.http || {};
    service.http.post = jest.fn().mockReturnValue(throwError(() => new Error('net')));
    service.obtenerOperacionImmex({} as any).subscribe({
      next: () => expect(true).toBe(false),
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Error al obtener la lista');
        done();
      },
    });
  });

  it('should call #obtenerBitacora with params and handle success', (done) => {
    service.http = service.http || {};
    const resp = { ok: true };
    service.http.get = jest.fn().mockReturnValue(observableOf(resp));
    const params = { c: 3 } as any;
    service.obtenerBitacora(params).subscribe((r) => {
      expect(service.http.get).toHaveBeenCalled();
      const callArgs = (service.http.get as jest.Mock).mock.calls[0][1];
      expect(callArgs).toBeDefined();
      expect(callArgs.params).toEqual(params);
      expect(r).toBe(resp);
      done();
    });
  });

  it('should emit error on failed #obtenerBitacora()', (done) => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(throwError(() => new Error('net')));
    service.obtenerBitacora({}).subscribe({
      next: () => expect(true).toBe(false),
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Error al obtener la lista');
        done();
      },
    });
  });

  it('should call #obtenerDatosCertificacionSat with params and handle success', (done) => {
    service.http = service.http || {};
    const resp = { ok: true };
    service.http.get = jest.fn().mockReturnValue(observableOf(resp));
    const params = { d: 4 } as any;
    service.obtenerDatosCertificacionSat(params).subscribe((r) => {
      expect(service.http.get).toHaveBeenCalled();
      const callArgs = (service.http.get as jest.Mock).mock.calls[0][1];
      expect(callArgs).toBeDefined();
      expect(callArgs.params).toEqual(params);
      expect(r).toBe(resp);
      done();
    });
  });

  it('should emit error on failed #obtenerDatosCertificacionSat()', (done) => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(throwError(() => new Error('net')));
    service.obtenerDatosCertificacionSat({}).subscribe({
      next: () => expect(true).toBe(false),
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Error al obtener la lista');
        done();
      },
    });
  });

  it('should return JSONResponse on successful #obtenerListaDomicilios()', (done) => {
    service.http = service.http || {};
    const response = { ok: true, data: [] };
    service.http.post = jest.fn().mockReturnValue(observableOf(response));
    service.obtenerListaDomicilios({} as any).subscribe((res) => {
      expect(service.http.post).toHaveBeenCalled();
      expect(res).toBe(response);
      done();
    });
  });

  it('should emit error on failed #obtenerListaDomicilios()', (done) => {
    service.http = service.http || {};
    service.http.post = jest.fn().mockReturnValue(throwError(() => new Error('net')));
    service.obtenerListaDomicilios({} as any).subscribe({
      next: () => expect(true).toBe(false),
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Error al obtener la lista');
        done();
      },
    });
  });

});