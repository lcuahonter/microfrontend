import { TestBed } from '@angular/core/testing';
import { RegistroSolicitudService } from './registro-solicitud-service.service';
import { Tramite31802Store } from '../state/Tramite31802.store';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Solicitud31802State } from '../state/Tramite31802.store';

describe('RegistroSolicitudService', () => {
  let service: RegistroSolicitudService;
  let storeMock: any;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    storeMock = {
      setNumeroOficio: jest.fn(),
      setNumeroOperacion: jest.fn(),
      setLlave: jest.fn(),
      setManifiesto1: jest.fn(),
      setManifiesto2: jest.fn(),
      setManifiesto3: jest.fn(),
      setManifiesto4: jest.fn(),
      setManifiesto5: jest.fn(),
      setFechaPago: jest.fn(),
      setRenovacion: jest.fn(),
      setHomologacion: jest.fn(),
      setMonedaNacional: jest.fn(),
      setFechaInicio: jest.fn(),
      setFechaFinal: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Tramite31802Store, useValue: storeMock }
      ]
    });

    service = TestBed.inject(RegistroSolicitudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all store setters in actualizarEstadoFormulario', () => {
    const datos: Solicitud31802State = {
     numeroOficio: '12345',
      llave: 'llave',
      manifiesto1: true,
      manifiesto2: true,
      manifiesto3: true,
      numeroOperacion: '123',
      fechaPago: '2024-01-01',
      monedaNacional: 'MXN',
      renovacion: false,
      homologacion: false,
      fechaInicio: '25/12/2023',
      fechaFinal: '25/12/2024',
      manifiesto4: true,
      manifiesto5: true,
      opcion: 'no',
      valorSeleccionado: null
    };
    service.actualizarEstadoFormulario(datos);
    expect(storeMock.setNumeroOficio).toHaveBeenCalledWith('12345');
    expect(storeMock.setNumeroOperacion).toHaveBeenCalledWith('123');
    expect(storeMock.setLlave).toHaveBeenCalledWith('llave');
    expect(storeMock.setManifiesto1).toHaveBeenCalledWith(true);
    expect(storeMock.setManifiesto2).toHaveBeenCalledWith(true);
    expect(storeMock.setManifiesto3).toHaveBeenCalledWith(true);
    expect(storeMock.setFechaPago).toHaveBeenCalledWith('2024-01-01');
    expect(storeMock.setRenovacion).toHaveBeenCalledWith(false);
    expect(storeMock.setHomologacion).toHaveBeenCalledWith(false);
    expect(storeMock.setMonedaNacional).toHaveBeenCalledWith('MXN');
    expect(storeMock.setFechaInicio).toHaveBeenCalledWith('25/12/2023');
    expect(storeMock.setFechaFinal).toHaveBeenCalledWith('25/12/2024');
  });

  it('should get datos de aviso de renovacion doc from JSON', () => {
    const mockResponse: Solicitud31802State = {
     numeroOficio: '12345',
      llave: 'llave',
      manifiesto1: true,
      manifiesto2: true,
      manifiesto3: true,
      numeroOperacion: '123',
      fechaPago: '2024-01-01',
      monedaNacional: 'MXN',
      renovacion: false,
      homologacion: false,
      fechaInicio: '25/12/2023',
      fechaFinal: '25/12/2024',
      manifiesto4: true,
      manifiesto5: true,
      opcion: 'no',
      valorSeleccionado: null
    };
    service.getDatosDeAvisoRenovacionDoc().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/31802/aviso-de-renovacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});