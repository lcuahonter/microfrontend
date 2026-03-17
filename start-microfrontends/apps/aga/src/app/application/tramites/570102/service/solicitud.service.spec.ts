import { TestBed } from '@angular/core/testing';
import { SolicitudService } from './solicitud.service';
import { HttpClient } from '@angular/common/http';
import { Tramite570102Store } from '../state/Tramite570102.store';
import { of } from 'rxjs';

describe('SolicitudService', () => {
  let service: SolicitudService;
  let httpMock: any;
  let storeMock: any;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    };
    storeMock = {
      setFolio: jest.fn(),
      setMotivoDelDes: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        SolicitudService,
        { provide: HttpClient, useValue: httpMock },
        { provide: Tramite570102Store, useValue: storeMock }
      ]
    });
    service = TestBed.inject(SolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call setFolio and setMotivoDelDes in actualizarEstadoFormulario', () => {
    const datos = { folio: 'F123', motivoDelDes: 'motivo' };
    service.actualizarEstadoFormulario(datos);
    expect(storeMock.setFolio).toHaveBeenCalledWith('F123');
    expect(storeMock.setMotivoDelDes).toHaveBeenCalledWith('motivo');
  });

  it('should return observable from getRegistroTomaMuestrasMercanciasData', (done) => {
    const mockData = { folio: 'F123', motivoDelDes: 'motivo' };
    httpMock.get.mockReturnValue(of(mockData));
    service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/570102/registro_toma_muestras_mercancias.json');
      done();
    });
  });
});