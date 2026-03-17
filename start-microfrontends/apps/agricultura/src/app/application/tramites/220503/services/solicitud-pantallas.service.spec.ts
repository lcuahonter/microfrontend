import { TestBed } from '@angular/core/testing';
import { SolicitudPantallasService } from './solicitud-pantallas.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CargarDatosIniciales, TipoContenedor } from '../models/solicitud-pantallas.model';
import { DatosDelTramiteRealizar } from '../models/solicitud-pantallas.model';

describe('SolicitudPantallasService', () => {
  let service: SolicitudPantallasService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn().mockReturnValue(of({ test: 'data' }))
    } as any;

    TestBed.configureTestingModule({
      providers: [
        SolicitudPantallasService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(SolicitudPantallasService);
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe llamar a http.get con la URL correcta en getData', () => {
    const mockResponse = { test: 'data' } as any;
    httpClientMock.get.mockReturnValue(of(mockResponse));

    const result$ = service.getData();

    expect(httpClientMock.get).toHaveBeenCalledWith(service['dataUrl']);
    result$.subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
  });

  it('debe llamar a http.get con la URL correcta en getDataDatosDelTramite', () => {
    const mockResponse = { test: 'data' } as any;
    httpClientMock.get.mockReturnValue(of(mockResponse));

    const result$ = service.getDataDatosDelTramite();

    expect(httpClientMock.get).toHaveBeenCalledWith(service['dataUrl']);
    result$.subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
  });

  it('debe llamar a http.get con la URL correcta en getDataResponsableInspeccion', () => {
    const mockResponse = { test: 'data' } as any;
    httpClientMock.get.mockReturnValue(of(mockResponse));

    const result$ = service.getDataResponsableInspeccion();

    expect(httpClientMock.get).toHaveBeenCalledWith(service['dataUrl']);
    result$.subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
  });

  it('debe llamar a getData en el constructor', () => {
    expect(httpClientMock.get).toHaveBeenCalled();
  });

  it('debe tener la propiedad dataUrl correcta', () => {
    expect(service['dataUrl']).toBe('../../../assets/json/220503/solicitud-pantallas-mock-data.json');
  });

  it('debe retornar un observable desde el método getData', () => {
    const result = service.getData();
    expect(result).toBeDefined();
    expect(typeof result.subscribe).toBe('function');
  });

  it('debe retornar un observable desde el método getDataDatosDelTramite', () => {
    const result = service.getDataDatosDelTramite();
    expect(result).toBeDefined();
    expect(typeof result.subscribe).toBe('function');
  });

  it('debe retornar un observable desde el método getDataResponsableInspeccion', () => {
    const result = service.getDataResponsableInspeccion();
    expect(result).toBeDefined();
    expect(typeof result.subscribe).toBe('function');
  });
});
