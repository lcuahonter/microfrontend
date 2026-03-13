import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RevisionService } from './revision.service';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { PagoDeDerechos } from '../modelos/pago-de-derechos.model';
import { Movilizacion } from '../modelos/datos-generales.model';

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAduanaIngreso should GET aduana-ingreso.json', () => {
    const mockResponse = { data: 'aduana' } as unknown as RespuestaCatalogos;
    service.getAduanaIngreso().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220501/aduana-ingreso.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getOficianaInspeccion should GET oficiana-de-inspeccion.json', () => {
    const mockResponse = { data: 'oficina' } as unknown as RespuestaCatalogos;
    service.getOficianaInspeccion().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220501/oficiana-de-inspeccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getPuntoInspeccion should GET punto-de-inspeccion.json', () => {
    const mockResponse = { data: 'punto' } as unknown as RespuestaCatalogos;
    service.getPuntoInspeccion().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220501/punto-de-inspeccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getEstablecimiento should GET establecimiento.json', () => {
    const mockResponse = { data: 'establecimiento' } as unknown as RespuestaCatalogos;
    service.getEstablecimiento().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220501/establecimiento.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getRegimenDestinaran should GET regimen-destinaran.json', () => {
    const mockResponse = { data: 'regimen' } as unknown as RespuestaCatalogos;
    service.getRegimenDestinaran().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220501/regimen-destinaran.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getMovilizacionNacional should GET movilizacion-nacional.json', () => {
    const mockResponse = { data: 'movilizacion' } as unknown as RespuestaCatalogos;
    service.getMovilizacionNacional().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220501/movilizacion-nacional.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getPuntoVerificacion should GET punto-verificacion.json', () => {
    const mockResponse = { data: 'verificacion' } as unknown as RespuestaCatalogos;
    service.getPuntoVerificacion().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220501/punto-verificacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getEmpresaTransportista should GET empresa-transportista.json', () => {
    const mockResponse = { data: 'empresa' } as unknown as RespuestaCatalogos;
    service.getEmpresaTransportista().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220501/empresa-transportista.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getJustificacion should GET justificacion.json', () => {
    const mockResponse = { data: 'justificacion' } as unknown as RespuestaCatalogos;
    service.getJustificacion().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220501/justificacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getBanco should GET banco.json', () => {
    const mockResponse = { data: 'banco' } as unknown as RespuestaCatalogos;
    service.getBanco().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220501/banco.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getPagoDeDerechos should GET pago-de-derechos.json', () => {
    const mockResponse: PagoDeDerechos = {
        justificacion: 'Example justification',
        claveReferencia: 'ABC123',
        exentoPagoNo: '',
        exentoPagoSi: '',
        cadenaDependencia: '',
        banco: 0,
        llavePago: '',
        importePago: '',
        fetchapago: ''
    };
    service.getPagoDeDerechos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220501/pago-de-derechos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getMovilizacion should GET movilizacion.json', () => {
    const mockResponse: Movilizacion = {
      nombre: 'Movilización',
      coordenadas: '',
      medio: '',
      transporte: '',
      punto: ''
    };
    service.getMovilizacion().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/220501/movilizacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});