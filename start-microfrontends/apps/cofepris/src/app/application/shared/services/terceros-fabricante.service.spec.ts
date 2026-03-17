import { TercerosFabricanteService } from './terceros-fabricante.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { TercerosFabricanteQuery } from '../estados/queries/terceros-fabricante.query';

describe('TercerosFabricanteService (Jest)', () => {
  let service: TercerosFabricanteService;
  let httpClient: jest.Mocked<HttpClient>;
  let query: jest.Mocked<TercerosFabricanteQuery>;

  beforeEach(() => {
    httpClient = {
      get: jest.fn(),
    } as any;

    query = {
      selectSolicitud$: of({ test: 'state' }),
    } as any;

    service = new TercerosFabricanteService(httpClient, query);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getObtenerEstadoList should call http.get with correct URL and type', (done) => {
    const mockResponse = { data: 'test' };
    httpClient.get.mockReturnValueOnce(of(mockResponse));
    service.getObtenerEstadoList().subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/260501/seleccion.json');
      done();
    });
  });

  it('getObtenerTablaDatos should call http.get with correct URL and type', (done) => {
    const mockResponse = { tabla: [] };
    httpClient.get.mockReturnValueOnce(of(mockResponse));
    service.getObtenerTablaDatos().subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/260501/tablaDatos.json');
      done();
    });
  });

  it('getObtenerMercanciasDatos should call http.get with correct URL and type', (done) => {
    const mockResponse = { mercancias: [] };
    httpClient.get.mockReturnValueOnce(of(mockResponse));
    service.getObtenerMercanciasDatos().subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/260501/mercanciasDatos.json');
      done();
    });
  });

  it('getData should call http.get with correct URL and type', (done) => {
    const mockResponse = [{ id: 1, nombre: 'test' }];
    httpClient.get.mockReturnValueOnce(of(mockResponse));
    service.getData().subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/260501/terceros-relacionados.json');
      done();
    });
  });

  it('getTable should call http.get with correct URL and type', (done) => {
    const mockResponse = [{ permiso: 'A' }];
    httpClient.get.mockReturnValueOnce(of(mockResponse));
    service.getTable().subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClient.get).toHaveBeenCalledWith('assets/json/260501/terceros.json');
      done();
    });
  });

  it('getTercerosFabricanteState should return selectSolicitud$ from query', (done) => {
    service.getTercerosFabricanteState().subscribe((state) => {
      expect(state).toEqual({ test: 'state' });
      done();
    });
  });
});