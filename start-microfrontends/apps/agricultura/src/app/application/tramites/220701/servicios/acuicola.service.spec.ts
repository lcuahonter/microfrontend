import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AcuicolaService } from './acuicola.service';
import { DatosDelTramite, PagoDeDerechos, PagoDeDerechosRevision, ResponsableInspección } from '../modelos/acuicola.model';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

describe('AcuicolaService', () => {
  let service: AcuicolaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AcuicolaService]
    });
    service = TestBed.inject(AcuicolaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerDetallesDelCatalogo should GET the correct file', () => {
    const mockResponse = { data: 'test' } as unknown as RespuestaCatalogos;
    service.obtenerDetallesDelCatalogo('test.json').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220701/test.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('obtenerDatosCertificados should return DatosDelTramite', () => {
    const mockData: DatosDelTramite = { foo: 'bar' } as any;
    service.obtenerDatosCertificados().subscribe(res => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/220701/datos-certificados.json');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockData });
  });

  it('getHoraDeInspeccion should return RespuestaCatalogos', () => {
    const mockResponse = { data: 'hora' } as unknown as RespuestaCatalogos;
    service.getHoraDeInspeccion().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220701/hora-de-inspeccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getAduanaDeIngreso should return RespuestaCatalogos', () => {
    const mockResponse = { data: 'aduana' } as unknown as RespuestaCatalogos;
    service.getAduanaDeIngreso().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220701/aduana-de-ingreso.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getOficinaDeInspeccion should return RespuestaCatalogos', () => {
    const mockResponse = { data: 'oficina' } as unknown as RespuestaCatalogos;
    service.getOficinaDeInspeccion().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220701/oficina-de-inspeccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getPuntoDeInspeccion should return RespuestaCatalogos', () => {
    const mockResponse = { data: 'punto' } as unknown as RespuestaCatalogos;
    service.getPuntoDeInspeccion().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220701/punto-de-inspeccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('obtenerResponsableDatos should return ResponsableInspección', () => {
    const mockResponse: ResponsableInspección = {
      nombreInsp: 'Juan',
      primerApellido: 'Perez',
      segundoApellido: 'Lopez',
      cantidadContenedores: 5
    };
    service.obtenerResponsableDatos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220701/responsable-inspeccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getTipoContenedor should return RespuestaCatalogos', () => {
    const mockResponse = { data: 'contenedor' } as unknown as RespuestaCatalogos;
    service.getTipoContenedor().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220701/tipo-contenedor.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getMedioDeTransporte should return RespuestaCatalogos', () => {
    const mockResponse = { data: 'transporte' } as unknown as RespuestaCatalogos;
    service.getMedioDeTransporte().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220701/medio-de-transporte.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getBancoDatos should return RespuestaCatalogos', () => {
    const mockResponse = { data: 'banco' } as unknown as RespuestaCatalogos;
    service.getBancoDatos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220701/banco-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('pagoDeCargarDatos should return PagoDeDerechos', () => {
    const mockResponse: PagoDeDerechos = {
        claveDeReferencia: 'clave123',
        cadenaDependencia: 'dependencia123',
        banco: 'Banco XYZ',
        llaveDePago: 'llave123',
        fechaInicio: '',
        importeDePago: ''
    };
    service.pagoDeCargarDatos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220701/pago-de-derechos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getPagoDerechosRevision should return PagoDeDerechosRevision', () => {
    const mockResponse: PagoDeDerechosRevision = {
      claveDeReferenciaRevision: 'clave123',
      cadenaDependenciaRevision: 'dependencia123',
      bancoRevision: 'Banco XYZ',
      llaveDePagoRevision: 'llave123',
      fechaInicioRevision: '',
      importeDePagoRevision: '',
    };
    service.getPagoDerechosRevision().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220701/pago-de-derechos-revision.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});