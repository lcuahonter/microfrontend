import { PagoBancoService } from './pago-banco.service';
import { HttpClient } from '@angular/common/http';
import { TramitePagoBancoQuery } from '../estados/queries/pago-banco.query';
import { TramitePagoBancoStore, SolicitudPagoBancoState } from '../estados/stores/pago-banco.store';
import { of, throwError } from 'rxjs';
import { Catalogo } from '@libs/shared/data-access-user/src';

jest.mock('@angular/common/http');
jest.mock('../estados/queries/pago-banco.query');
jest.mock('../estados/stores/pago-banco.store');

describe('PagoBancoService (Jest)', () => {
  let service: PagoBancoService;
  let httpClient: jest.Mocked<HttpClient>;
  let query: jest.Mocked<TramitePagoBancoQuery>;
  let store: jest.Mocked<TramitePagoBancoStore>;

  beforeEach(() => {
    httpClient = {
      get: jest.fn()
    } as any;

    query = {
      selectSolicitud$: of({} as SolicitudPagoBancoState)
    } as any;

    store = {
      setClaveDeReferencia: jest.fn(),
      setCadenaDependencia: jest.fn(),
      setBanco: jest.fn(),
      setllaveDePago: jest.fn(),
      setFechaPago: jest.fn(),
      setImportePago: jest.fn()
    } as any;

    service = new PagoBancoService(httpClient, query, store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('consultarDatosBanco', () => {
    it('should call http.get with correct URL and return observable', (done) => {
      const mockData: Catalogo[] = [{ id: 1, nombre: 'Banco1', descripcion: 'Banco de prueba' } as Catalogo];
      httpClient.get.mockReturnValueOnce(of(mockData));

      service.consultarDatosBanco().subscribe(data => {
        expect(data).toEqual(mockData);
        expect(httpClient.get).toHaveBeenCalledWith('./assets/json/260501/banco-options.json');
        done();
      });
    });

    it('should propagate error from http.get', (done) => {
      const error = new Error('Network error');
      httpClient.get.mockReturnValueOnce(throwError(() => error));

      service.consultarDatosBanco().subscribe({
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });

  describe('getSolicitudPagoBancoState', () => {
    it('should return selectSolicitud$ observable from query', (done) => {
      const mockState = { claveDeReferencia: '123' } as SolicitudPagoBancoState;
      query.selectSolicitud$ = of(mockState);

      service.getSolicitudPagoBancoState().subscribe(state => {
        expect(state).toEqual(mockState);
        done();
      });
    });
  });

  describe('actualizarEstadoFormulario', () => {
    it('should call store setters with correct values', () => {
      const datos: SolicitudPagoBancoState = {
        claveDeReferencia: 'ref',
        cadenaDependencia: 'dep',
        banco: 'banco',
        llaveDePago: 'llave',
        fechaPago: '2024-01-01',
        importePago: 100 // <-- Change from '100' to 100
      } as unknown as SolicitudPagoBancoState;

      service.actualizarEstadoFormulario(datos);

      expect(store.setClaveDeReferencia).toHaveBeenCalledWith('ref');
      expect(store.setCadenaDependencia).toHaveBeenCalledWith('dep');
      expect(store.setBanco).toHaveBeenCalledWith('banco');
      expect(store.setllaveDePago).toHaveBeenCalledWith('llave');
      expect(store.setFechaPago).toHaveBeenCalledWith('2024-01-01');
      expect(store.setImportePago).toHaveBeenCalledWith(100);
    });
  });

  describe('getRegistroTomaMuestrasMercanciasData', () => {
    it('should call http.get with correct URL and return observable', (done) => {
      const mockState: SolicitudPagoBancoState = { claveDeReferencia: 'abc' } as SolicitudPagoBancoState;
      httpClient.get.mockReturnValueOnce(of(mockState));

      service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
        expect(data).toEqual(mockState);
        expect(httpClient.get).toHaveBeenCalledWith('assets/json/260501/registro_pago_banco.json');
        done();
      });
    });

    it('should propagate error from http.get', (done) => {
      const error = new Error('File not found');
      httpClient.get.mockReturnValueOnce(throwError(() => error));

      service.getRegistroTomaMuestrasMercanciasData().subscribe({
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });
});