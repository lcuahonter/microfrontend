import { TestBed } from '@angular/core/testing';
import { CancelarSolicitudService } from './cancelar-solicitud.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CancelarSolicitudState, CancelarSolicitudStore } from '../estados/tramite570101.store';
import { CancelarSolicitudForm, CancelarModalidad } from '../modelos/cancelar-solicitud.modalidad.model';

describe('CancelarSolicitudService', () => {
  let service: CancelarSolicitudService;
  let httpClientMock: any;
  let cancelarSolicitudStoreMock: any;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn()
    };

    cancelarSolicitudStoreMock = {
      update: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CancelarSolicitudService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: CancelarSolicitudStore, useValue: cancelarSolicitudStoreMock }
      ]
    });

    service = TestBed.inject(CancelarSolicitudService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener cancelar solicitud desde JSON', (done) => {
    const mockData: CancelarSolicitudForm = { campo1: 'valor1' } as any;
    httpClientMock.get.mockReturnValue(of(mockData));

    service.getCancelarSolicitud().subscribe((resp) => {
      expect(resp).toEqual(mockData);
      expect(httpClientMock.get).toHaveBeenCalledWith('/assets/json/570101/cancelarSolicitud.json');
      done();
    });
  });

  it('debería obtener select rango días', (done) => {
    const mockDias: string[] = ['1', '2', '3'];
    httpClientMock.get.mockReturnValue(of(mockDias));

    service.getSelectRangoDias().subscribe((resp) => {
      expect(resp).toEqual(mockDias);
      expect(httpClientMock.get).toHaveBeenCalledWith('/assets/json/570101/selectRangoDias.json');
      done();
    });
  });

  it('debería obtener tipo de solicitud', (done) => {
    const mockTipos: CancelarModalidad[] = [{
      id: 1, descripcion: 'Total'
    }];
    httpClientMock.get.mockReturnValue(of(mockTipos));

    service.getTipoSolicitud().subscribe((resp) => {
      expect(resp).toEqual(mockTipos);
      expect(httpClientMock.get).toHaveBeenCalledWith('/assets/json/570101/tipoSolicitud.json');
      done();
    });
  });

  it('debería actualizar estado del formulario en el store', () => {
    const mockEstado: Partial<CancelarSolicitudState> = { campoA: 'valorA' } as any;

    service.actualizarEstadoFormulario(mockEstado);

    expect(cancelarSolicitudStoreMock.update).toHaveBeenCalledWith(expect.any(Function));

    // simulamos el resultado de la función pasada a update
    const updateFn = cancelarSolicitudStoreMock.update.mock.calls[0][0];
    const result = updateFn({ campoB: 'valorB' });
    expect(result).toEqual({ campoB: 'valorB', campoA: 'valorA' });
  });

  it('debería obtener registro de toma de muestras de mercancías', (done) => {
    const mockRegistro: CancelarSolicitudState = { campoX: 'valorX' } as any;
    httpClientMock.get.mockReturnValue(of(mockRegistro));

    service.getRegistroTomaMuestrasMercanciasData().subscribe((resp) => {
      expect(resp).toEqual(mockRegistro);
      expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/570101/requestCancallar.json');
      done();
    });
  });
});
