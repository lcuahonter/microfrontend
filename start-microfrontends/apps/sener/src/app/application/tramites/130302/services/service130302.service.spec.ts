import { TestBed } from '@angular/core/testing';
import { Service130302Service } from './service130302.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Tramite130302Store } from '../estados/tramite130302.store';

describe('Service130302Service', () => {
  let service: Service130302Service;
  let httpClientMock: { get: jest.Mock };
  let tramite130302StoreMock: any;

  beforeEach(() => {
    httpClientMock = { get: jest.fn() };
    tramite130302StoreMock = {
      setfechaPago: jest.fn(),
      setprorrogaAl: jest.fn(),
      setmotivoJustificacion: jest.fn(),
      setotrasDeclaraciones: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        Service130302Service,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: Tramite130302Store, useValue: tramite130302StoreMock }
      ]
    });

    service = TestBed.inject(Service130302Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update all fields in actualizarEstadoFormulario', () => {
    const datos = {
      fechaPago: '2024-01-01',
      prorrogaAl: '2024-02-02',
      motivoJustificacion: 'Motivo',
      otrasDeclaraciones: 'Otras',
    };
    service.actualizarEstadoFormulario(datos as any);
    expect(tramite130302StoreMock.setfechaPago).toHaveBeenCalledWith('2024-01-01');
    expect(tramite130302StoreMock.setprorrogaAl).toHaveBeenCalledWith('2024-02-02');
    expect(tramite130302StoreMock.setmotivoJustificacion).toHaveBeenCalledWith('Motivo');
    expect(tramite130302StoreMock.setotrasDeclaraciones).toHaveBeenCalledWith('Otras');
  });

  it('should not call store methods if fields are missing in actualizarEstadoFormulario', () => {
    const datos = {};
    service.actualizarEstadoFormulario(datos as any);
    expect(tramite130302StoreMock.setfechaPago).not.toHaveBeenCalled();
    expect(tramite130302StoreMock.setprorrogaAl).not.toHaveBeenCalled();
    expect(tramite130302StoreMock.setmotivoJustificacion).not.toHaveBeenCalled();
    expect(tramite130302StoreMock.setotrasDeclaraciones).not.toHaveBeenCalled();
  });

  it('should call http.get with correct URL in getRegistroTomaMuestrasMercanciasData', (done) => {
    const mockResponse = { foo: 'bar' };
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.getRegistroTomaMuestrasMercanciasData().subscribe(resp => {
      expect(resp).toEqual(mockResponse);
      expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/130302/consulta.json');
      done();
    });
  });

  it('should have urlServer and urlServerCatalogos from ENVIRONMENT', () => {
    expect(service.urlServer).toBeDefined();
    expect(service.urlServerCatalogos).toBeDefined();
  });
});