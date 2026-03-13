import { TestBed } from '@angular/core/testing';
import { ProsecService } from './prosec.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AutorizacionProsecStore } from '../estados/autorizacion-prosec.store';
import { Catalogo, RespuestaCatalogos } from '@ng-mf/data-access-user';
import { ProsecState } from '../estados/autorizacion-prosec.store';

describe('ProsecService', () => {
  let service: ProsecService;
  let httpClientMock: any;
  let storeMock: any;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn()
    };
    storeMock = {
      setModalidad: jest.fn(),
      setEstado: jest.fn(),
      setRepresentacionFederal: jest.fn(),
      setActividadProductiva: jest.fn(),
      setSector: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setcontribuyentes: jest.fn(),
      setSectorDatos: jest.fn(),
      setProducirDatos: jest.fn(),
      setPlantasDatos: jest.fn(),
      setProductorDatos: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ProsecService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: AutorizacionProsecStore, useValue: storeMock }
      ]
    });
    service = TestBed.inject(ProsecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerMenuDesplegable should return catalogos data', (done) => {
    const mockResponse: RespuestaCatalogos = { 
      data: [{ id: 1, descripcion: 'Banco' }] as Catalogo[], 
      code: 200, 
      message: 'OK' 
    };
    httpClientMock.get.mockReturnValue(of(mockResponse));

    service.obtenerMenuDesplegable('bancos.json').subscribe(data => {
      expect(data).toEqual(mockResponse.data);
      expect(httpClientMock.get).toHaveBeenCalledWith('../../../../../assets/json/90101/bancos.json');
      done();
    });
  });

  it('obtenerTablaDatos should return generic array', (done) => {
    const mockData = [{ foo: 'bar' }];
    httpClientMock.get.mockReturnValue(of(mockData));

    service.obtenerTablaDatos<any>('tabla.json').subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientMock.get).toHaveBeenCalledWith('../../../../../assets/json/90101/tabla.json');
      done();
    });
  });

  it('getAcuiculturaData should return ProsecState data', (done) => {
    const mockState: ProsecState = {} as ProsecState;
    httpClientMock.get.mockReturnValue(of(mockState));

    service.getAcuiculturaData().subscribe(data => {
      expect(data).toEqual(mockState);
      expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/90101/prosec_form.json');
      done();
    });
  });

  it('actualizarEstadoFormulario should call store methods with correct arguments', () => {
    const datos: ProsecState = {
      modalidad: 'mod1',
      Estado: 'estado1',
      RepresentacionFederal: 'rep1',
      ActividadProductiva: 'act1',
      Sector: 'sec1',
      Fraccion_arancelaria: 'frac1',
      contribuyentes: ['c1', 'c2']
    } as any;

    service.actualizarEstadoFormulario(datos);

    expect(storeMock.setModalidad).toHaveBeenCalledWith(datos.modalidad);
    expect(storeMock.setEstado).toHaveBeenCalledWith(datos.Estado);
    expect(storeMock.setRepresentacionFederal).toHaveBeenCalledWith(datos.RepresentacionFederal);
    expect(storeMock.setActividadProductiva).toHaveBeenCalledWith(datos.ActividadProductiva);
    expect(storeMock.setSector).toHaveBeenCalledWith(datos.Sector);
    expect(storeMock.setFraccionArancelaria).toHaveBeenCalledWith(datos.Fraccion_arancelaria);
    expect(storeMock.setcontribuyentes).toHaveBeenCalledWith(datos.contribuyentes);
  });
});