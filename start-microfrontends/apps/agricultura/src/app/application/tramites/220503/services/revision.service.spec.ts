import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RevisionService } from './revision.service';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { PagoDeDerechos } from '../models/pago-de-derechos.model';
import { Solicitud220503State } from '../estados/tramites220503.store';
import { Movilizacion } from '../models/datos-generales.model';

describe('RevisionService', () => {
  let service: RevisionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RevisionService]
    });
    service = TestBed.inject(RevisionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener AduanaIngreso', () => {
    const mockData: RespuestaCatalogos = { data: [], code: 200, message: '' };
    service.getAduanaIngreso().subscribe(res => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/220503/aduana-ingreso.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener OficianaInspeccion', () => {
    const mockData: RespuestaCatalogos = { data: [], code: 200, message: '' };
    service.getOficianaInspeccion().subscribe(res => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/220503/oficiana-de-inspeccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener PuntoInspeccion', () => {
    const mockData: RespuestaCatalogos = { data: [], code: 200, message: '' };
    service.getPuntoInspeccion().subscribe(res => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/220503/punto-de-inspeccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener Establecimiento', () => {
    const mockData: RespuestaCatalogos = { data: [], code: 200, message: '' };
    service.getEstablecimiento().subscribe(res => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/220503/establecimiento.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener RegimenDestinaran', () => {
    const mockData: RespuestaCatalogos = { data: [], code: 200, message: '' };
    service.getRegimenDestinaran().subscribe(res => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/220503/regimen-destinaran.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener MovilizacionNacional', () => {
    const mockData: RespuestaCatalogos = { data: [], code: 200, message: '' };
    service.getMovilizacionNacional().subscribe(res => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/220503/movilizacion-nacional.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener PuntoVerificacion', () => {
    const mockData: RespuestaCatalogos = { data: [], code: 200, message: '' };
    service.getPuntoVerificacion().subscribe(res => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/220503/punto-verificacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener EmpresaTransportista', () => {
    const mockData: RespuestaCatalogos = { data: [], code: 200, message: '' };
    service.getEmpresaTransportista().subscribe(res => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/220503/empresa-transportista.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener Justificacion', () => {
    const mockData: RespuestaCatalogos = { data: [], code: 200, message: '' };
    service.getJustificacion().subscribe(res => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/220503/justificacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener Banco', () => {
    const mockData: RespuestaCatalogos = { data: [], code: 200, message: '' };
    service.getBanco().subscribe(res => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/220503/banco.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener PagoDeDerechos', () => {
    const mockData: PagoDeDerechos = {
      exentoPago: 'false',
      justificacion: '',
      claveReferencia: '',
      cadenaDependencia: '',
      banco: 'Test Bank',
      llavePago: '',
      importePago: '0',
      fechaPago: ''
    };
    service.getPagoDeDerechos().subscribe(res => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/220503/pago-de-derechos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener DatosDelaSolicitud', () => {
    const mockData = { solicitud: 'test' } as unknown as Solicitud220503State;
    service.getDatosDelaSolicitud().subscribe(res => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/220503/datos-dela-solicitud.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener Movilizacion', () => {
    const mockData: Movilizacion = {
      coordenadas: '',
      nombre: '',
      medio: '',
      transporte: '',
      punto: ''
    };
    service.getMovilizacion().subscribe(res => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/220503/movilizacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
