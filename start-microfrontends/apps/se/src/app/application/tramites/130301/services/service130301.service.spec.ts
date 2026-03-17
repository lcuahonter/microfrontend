import { TestBed } from '@angular/core/testing';
import { Solocitud130301Service } from './service130301.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Tramite130301Store } from '../../../estados/tramites/tramite130301.store';
import { Solicitud130301State } from '../../../estados/tramites/tramite130301.store';

describe('Solocitud130301Service', () => {
  let service: Solocitud130301Service;
  let httpMock: HttpTestingController;
  let tramite130301StoreMock: any;

  beforeEach(() => {
    tramite130301StoreMock = {
      setPaisEmisorCertificado: jest.fn(),
      setMixed: jest.fn(),
      setPaisDeOrigen: jest.fn(),
      setMotivoJustificacion: jest.fn(),
      setOtrasDeclaraciones: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Tramite130301Store, useValue: tramite130301StoreMock }
      ]
    });

    service = TestBed.inject(Solocitud130301Service);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe llamar a todos los setters del store con undefined si faltan propiedades en actualizarEstadoFormulario', () => {
    const datos: Partial<Solicitud130301State> = {};

    service.actualizarEstadoFormulario(datos as Solicitud130301State);

    expect(tramite130301StoreMock.setPaisEmisorCertificado).toHaveBeenCalledWith(undefined);
    expect(tramite130301StoreMock.setMixed).toHaveBeenCalledWith(undefined);
    expect(tramite130301StoreMock.setPaisDeOrigen).toHaveBeenCalledWith(undefined);
    expect(tramite130301StoreMock.setMotivoJustificacion).toHaveBeenCalledWith(undefined);
    expect(tramite130301StoreMock.setOtrasDeclaraciones).toHaveBeenCalledWith(undefined);
  });

  it('debe obtener los datos de registro toma muestras mercancias', () => {
    const mockResponse: Solicitud130301State = {
      paisEmisorCertificado: 'MX',
      mixed: true,
      paisDeOrigen: 'ZA',
      motivoJustificacion: 'Motivo',
      otrasDeclaraciones: 'Declaraciones',
      idSolicitud: 0,
      folioPermiso: '',
      loginRfc: ''
    };

    service.getRegistroTomaMuestrasMercanciasData().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/130301/registro_toma_muestras_mercancias.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});