import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Service317Service } from './service317.service';
import { UnicoStore, UnicoState } from '../estados/renovacion.store';

describe('Service317Service', () => {
  let service: Service317Service;
  let httpMock: jest.Mocked<HttpClient>;
  let storeMock: jest.Mocked<UnicoStore>;

  beforeEach(() => {
    const httpClientMock = { get: jest.fn() } as unknown as jest.Mocked<HttpClient>;
    const unicoStoreMock = {
      setnumeroOperacion: jest.fn(),
      setbanco: jest.fn(),
      setllavePago: jest.fn(),
      setfechaPago: jest.fn(),
      setmapTipoTramite: jest.fn(),
    } as unknown as jest.Mocked<UnicoStore>;

    TestBed.configureTestingModule({
      providers: [
        Service317Service,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: UnicoStore, useValue: unicoStoreMock }
      ]
    });

    service = TestBed.inject(Service317Service);
    httpMock = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
    storeMock = TestBed.inject(UnicoStore) as jest.Mocked<UnicoStore>;
  });
describe('actualizarEstadoFormulario', () => {
  it('should call all store setters with provided values', () => {
    const datos: UnicoState = {
      mapTipoTramite: 'A',
      mapDeclaracionSolicitud: '',
      envioAviso: '',
      numeroAviso: '',
      claveReferencia: '',
      numeroOperacion: '123',
      cadenaDependencia: '',
      banco: 'BBVA',
      llavePago: 'LLAVE',
      fechaPago: '2024-01-01',
      importePago: '',
    };

    service.actualizarEstadoFormulario(datos);

    expect(storeMock.setnumeroOperacion).toHaveBeenCalledWith('123');
    expect(storeMock.setbanco).toHaveBeenCalledWith('BBVA');
    expect(storeMock.setllavePago).toHaveBeenCalledWith('LLAVE');
    expect(storeMock.setfechaPago).toHaveBeenCalledWith('2024-01-01');
    expect(storeMock.setmapTipoTramite).toHaveBeenCalledWith('A');
  });

  it('should not call setters if values are missing', () => {
    const datos: UnicoState = {
      mapTipoTramite: '',
      mapDeclaracionSolicitud: '',
      envioAviso: '',
      numeroAviso: '',
      claveReferencia: '',
      numeroOperacion: '',
      cadenaDependencia: '',
      banco: '',
      llavePago: '',
      fechaPago: '',
      importePago: '',
    };
    service.actualizarEstadoFormulario(datos);

    expect(storeMock.setnumeroOperacion).not.toHaveBeenCalled();
    expect(storeMock.setbanco).not.toHaveBeenCalled();
    expect(storeMock.setllavePago).not.toHaveBeenCalled();
    expect(storeMock.setfechaPago).not.toHaveBeenCalled();
    expect(storeMock.setmapTipoTramite).not.toHaveBeenCalled();
  });
});

describe('getRegistroTomaMuestrasMercanciasData', () => {
  it('should return UnicoState from the JSON file', (done) => {
    const mockState: UnicoState = {
      mapTipoTramite: '',
      mapDeclaracionSolicitud: '',
      envioAviso: '',
      numeroAviso: '',
      claveReferencia: '',
      numeroOperacion: '123',
      cadenaDependencia: '',
      banco: '',
      llavePago: '',
      fechaPago: '',
      importePago: '',
    };
    httpMock.get.mockReturnValueOnce(of(mockState));

    service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
      expect(data).toEqual(mockState);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/317/consulta.json');
      done();
    });
  });
});
});