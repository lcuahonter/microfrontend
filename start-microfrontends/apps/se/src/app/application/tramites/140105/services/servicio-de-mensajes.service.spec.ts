import { TestBed } from '@angular/core/testing';
import { ServicioDeMensajesService } from './servicio-de-mensajes.service';
import { DesistimientoStore } from '../estados/desistimiento-de-permiso.store';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Cancelacion, PermisosDatos } from '../models/cancelacion-de-solicitus.model';

describe('ServicioDeMensajesService', () => {
  let service: ServicioDeMensajesService;
  let desistimientoStore: DesistimientoStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const desistimientoStoreMock = {
      actualizarDatosForma: jest.fn(),
      update: jest.fn(),
      _select: jest.fn().mockReturnValue({ permisos: true }),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: DesistimientoStore, useValue: desistimientoStoreMock }
      ]
    });

    service = TestBed.inject(ServicioDeMensajesService);
    desistimientoStore = TestBed.inject(DesistimientoStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit a boolean message via enviarMensaje', (done) => {
    service.mensaje$.subscribe((msg) => {
      expect(msg).toBe(true);
      done();
    });
    service.enviarMensaje(true);
  });

  it('should emit a boolean value via establecerDatosDePermiso', (done) => {
    service.datos$.subscribe((msg) => {
      expect(msg).toBe(false);
      done();
    });
    service.establecerDatosDePermiso(false);
  });

  it('should call update on the store in actualizarEstadoFormulario', () => {
    const partial: Partial<PermisosDatos> = {};
    service.actualizarEstadoFormulario(partial);
    expect(desistimientoStore.update).toHaveBeenCalled();
  });

  it('should return observable from obtenerDatos', () => {
    const result = service.obtenerDatos();
    expect(result).toBeDefined();
  });

  it('should fetch data from getRegistroTomaMuestrasMercanciasData', () => {
    const mockResponse: PermisosDatos = { permisos: true } as any;
    service.getRegistroTomaMuestrasMercanciasData().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/140105/permisosCancelar.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should update store in cargarDatosSimulados', () => {
    const mockResponse: PermisosDatos = { permisos: true } as any;
    service.cargarDatosSimulados();
    const req = httpMock.expectOne('assets/json/140105/permisosCancelar.json');
    req.flush(mockResponse);
    expect(desistimientoStore.update).toHaveBeenCalled();
  });
});