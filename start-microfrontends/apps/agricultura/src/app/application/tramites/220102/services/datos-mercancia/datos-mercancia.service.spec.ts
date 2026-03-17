import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DatosMercanciaService } from './datos-mercancia.service';
import { HttpClient } from '@angular/common/http';
import { SeccionLibStore, Catalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { FitosanitarioStore } from '../../estados/fitosanitario.store';
import { FinalDataToSend, MercanciaForm } from '../../models/fitosanitario.model';

describe('DatosMercanciaService', () => {
  let service: DatosMercanciaService;
  let httpClientMock: any;
  let seccionStoreMock: any;
  let fitosanitarioStoreMock: any;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn()
    };

    seccionStoreMock = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn()
    };

    fitosanitarioStoreMock = {
      actualizarDatosForma: jest.fn(),
      eliminarDatoPorId: jest.fn(),
      _select: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        DatosMercanciaService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: SeccionLibStore, useValue: seccionStoreMock },
        { provide: FitosanitarioStore, useValue: fitosanitarioStoreMock }
      ]
    });

    service = TestBed.inject(DatosMercanciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call obtenerSelectorList and return mapped data', (done) => {
    const responseMock: RespuestaCatalogos = {
      code: 200,
      data: [{ id: 1, descripcion: 'Item 1' }] as Catalogo[],
      message: 'Operación exitosa'
    };

    httpClientMock.get.mockReturnValue(of(responseMock));

    service.obtenerSelectorList('archivo.json').subscribe(data => {
      expect(data).toEqual(responseMock.data);
      expect(httpClientMock.get).toHaveBeenCalledWith(service.url + 'archivo.json');
      done();
    });
  });

  it('should call actualizarFormularioMovilizacion', () => {
    const form: MercanciaForm[] = [{ nombreComun: 'Maíz' } as MercanciaForm];
    service.actualizarFormularioMovilizacion(form);
    expect(fitosanitarioStoreMock.actualizarDatosForma).toHaveBeenCalledWith(form);
  });

  it('should call eliminarDatoPorId', () => {
    service.eliminarDatoPorId(5);
    expect(fitosanitarioStoreMock.eliminarDatoPorId).toHaveBeenCalledWith(5);
  });

  it('should return observable from obtenerDatos', () => {
    const mockState = { datos: [] } as FinalDataToSend;
    fitosanitarioStoreMock._select.mockReturnValue(of(mockState));

    service.obtenerDatos().subscribe(state => {
      expect(state).toEqual(mockState);
    });
  });

  it('should call botonDesactivarCampos with true', () => {
    service.botonDesactivarCampos(true);
    expect(seccionStoreMock.establecerSeccion).toHaveBeenCalledWith([true]);
    expect(seccionStoreMock.establecerFormaValida).toHaveBeenCalledWith([true]);
  });

  it('should call botonDesactivarCampos with false', () => {
    service.botonDesactivarCampos(false);
    expect(seccionStoreMock.establecerSeccion).toHaveBeenCalledWith([true]);
    expect(seccionStoreMock.establecerFormaValida).toHaveBeenCalledWith([false]);
  });

  it('should get mercancia.json data from obtenerDatosMercancia', (done) => {
    const mockData: FinalDataToSend = { datos: [] };
    httpClientMock.get.mockReturnValue(of(mockData));

    service.obtenerDatosMercancia().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientMock.get).toHaveBeenCalledWith(service.url + 'mercancia.json');
      done();
    });
  });
});
