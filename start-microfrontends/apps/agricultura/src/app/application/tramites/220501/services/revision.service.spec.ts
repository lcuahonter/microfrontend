import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RevisionService } from './revision.service';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Exportador, PagoDeDerechos } from '../models/pago-de-derechos.model';
import { Solicitud220501State } from '../estados/tramites220501.store';
import { Movilizacion } from '../models/datos-generales.model';

describe('RevisionService', () => {
  let service: RevisionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RevisionService],
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

  it('should fetch aduana ingreso data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [],
      message: ''
    };

    service.getAduanaIngreso().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220501/aduana-ingreso.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch oficina inspección data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [],
      message: ''
    };

    service.getOficianaInspeccion().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220501/oficiana-de-inspeccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch punto inspección data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [],
      message: ''
    };

    service.getPuntoInspeccion().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220501/punto-de-inspeccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch establecimiento data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [],
      message: ''
    };

    service.getEstablecimiento().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220501/establecimiento.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch régimen data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [],
      message: ''
    };

    service.getRegimenDestinaran().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220501/regimen-destinaran.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch movilización nacional data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [],
      message: ''
    };

    service.getMovilizacionNacional().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220501/movilizacion-nacional.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch punto verificación data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [],
      message: ''
    };

    service.getPuntoVerificacion().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220501/punto-verificacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch empresa transportista data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [],
      message: ''
    };

    service.getEmpresaTransportista().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220501/empresa-transportista.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch justificación data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [],
      message: ''
    };

    service.getJustificacion().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220501/justificacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch banco data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [],
      message: ''
    };

    service.getBanco().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220501/banco.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch pago de derechos data', () => {
    const mockResponse: PagoDeDerechos = {
      exentoPagoNo: 'No',
      exentoPagoSi: 'Yes',
      justificacion: 'Test',
      claveReferencia: '12345',
      cadenaDependencia: 'Dependencia',
      banco: 1,
      llavePago: 'Llave',
      importePago: '1000',
      fetchapago: '2025-04-22',
    };

    service.getPagoDeDerechos().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220501/pago-de-derechos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch datos de la solicitud', () => {
    const mockResponse: Solicitud220501State = {
      medioDeTransporte: 0,
      identificacionTransporte: '',
      esSolicitudFerros: '',
      totalGuias: '',
      foliodel: '',
      aduanaIngreso: 0,
      oficinaInspeccion: 0,
      puntoInspeccion: 0,
      claveUCON: '',
      establecimientoTIF: '',
      nombre: '',
      numeroguia: '',
      regimen: 0,
      capturaDatosMercancia: '',
      coordenadas: '',
      movilizacion: 0,
      transporte: '',
      punto: 0,
      nombreEmpresa: 0,
      exentoPagoNo: '',
      justificacion: '',
      claveReferencia: '',
      cadenaDependencia: '',
      banco: 0,
      llavePago: '',
      importePago: '',
      fetchapago: '',
      fraccionArancelaria: '',
      descripcionFraccion: '',
      nico: '',
      descripcion: '',
      unidaddeMedidaDeUMT: '',
      cantidadTotalUMT: '',
      saldoPendiente: '',
      saldoACapturar: '',
      mostrarSeccion: true,
      mercanciaTablaDatos: [],
      certificadoNumero: '',
      calculoResultado: ''
    };

    service.getDatosDelaSolicitud().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220501/datos-dela-solicitud.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch movilización data', () => {
    const mockResponse: Movilizacion = {
      coordenadas: '',
      nombre: '',
      medio: '',
      transporte: '',
      punto: ''
    };

    service.getMovilizacion().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/220501/movilizacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return exportador data successfully', () => {
    const MOCK_RESPONSE: Exportador[] = [
      {
        "nombre": "Miriam Lopez solis",
        "telefono": "52-2298456543",
        "correoElectronico": "miriam@gmail.com",
        "domicilio": "este es un domicilio address",
        "pais": "ANGOLA(REPUBLIC DE)"
      }
    ]
    service.obtenerTablaExportador().subscribe((data) => {
      expect(data).toEqual(MOCK_RESPONSE);
    });

    const req = httpMock.expectOne('assets/json/220501/exportador-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_RESPONSE);
  });

  it('should handle HTTP error correctly', () => {
    const mockError = { status: 500, statusText: 'Internal Server Error' };

    service.obtenerTablaExportador().subscribe({
      next: () => fail('Expected error, but got success response'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    });

    const req = httpMock.expectOne('assets/json/220501/exportador-tabla.json');
    req.flush({}, mockError);
  });
});
