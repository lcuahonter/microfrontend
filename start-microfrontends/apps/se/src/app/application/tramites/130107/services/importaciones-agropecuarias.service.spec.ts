import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImportacionesAgropecuariasService } from './importaciones-agropecuarias.service';
import { CatalogoServices, HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Tramite130107Query } from '../../../estados/queries/tramite130107.query';
import { of } from 'rxjs';
import { PROC_130107 } from '../servers/api-route';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';

describe('ImportacionesAgropecuariasService', () => {
  let service: ImportacionesAgropecuariasService;
  let httpMock: HttpTestingController;

  const mockCatalogoServices = {
    regimenesCatalogo: jest.fn(),
    getClasificacionRegimen: jest.fn(),
    fraccionesArancelariasCatalogo: jest.fn(),
    unidadesMedidasTarifariasCatalogo: jest.fn(),
    entidadesFederativasCatalogo: jest.fn(),
    todosPaisesSeleccionados: jest.fn(),
    tratadosAcuerdoCatalogo: jest.fn(),
    getpaisesBloqueCatalogo: jest.fn(),
  };

  const mockHttpCoreService = {
    get: jest.fn()
  };

  const mockQuery = {
    selectSolicitud$: of({ test: 'state' })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ImportacionesAgropecuariasService,
        { provide: CatalogoServices, useValue: mockCatalogoServices },
        { provide: HttpCoreService, useValue: mockHttpCoreService },
        { provide: Tramite130107Query, useValue: mockQuery },
      ],
    });

    service = TestBed.inject(ImportacionesAgropecuariasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllState() should return query state', (done) => {
    service.getAllState().subscribe(res => {
      expect(res).toEqual({ test: 'state' });
      done();
    });
  });

  it('obtenerTramite() should call GET and return JSONResponse', () => {
    const mockResponse: JSONResponse = { id: 1, descripcion: 'test', codigo: '00', data: '', datos: [{ id: 1 }] };

    service.obtenerTramite(1).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('obtenerTramite() should handle error response', (done) => {
    service.obtenerTramite(100).subscribe({
      error: (err) => {
        expect(err.status).toBe(500);
        done();
      },
    });

    const req = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/100`);
    req.flush('Error', { status: 500, statusText: 'Server error' });
  });

  it('guardarDatos() should POST payload', () => {
    const payload = { id: 1 };

    service.guardarDatos(payload).subscribe();

    const req = httpMock.expectOne(PROC_130107.GUARDAR);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
  });

  it('getBloqueService() should call catalogoServices.tratadosAcuerdoCatalogo()', (done) => {
    mockCatalogoServices.tratadosAcuerdoCatalogo.mockReturnValue(of({ datos: [{ id: 1 }] }));

    service.getBloqueService('130107').subscribe(res => {
      expect(res).toEqual([{ id: 1 }]);
      expect(mockCatalogoServices.tratadosAcuerdoCatalogo).toHaveBeenCalledWith('130107', 'TITRAC.TA');
      done();
    });
  });

  it('getRepresentacionFederalCatalogo should call httpService.get()', (done) => {
    mockHttpCoreService.get.mockReturnValue(of({ datos: [{ clave: 'MX' }] }));

    service.getRepresentacionFederalCatalogo('09').subscribe(res => {
      expect(res).toEqual([{ clave: 'MX' }]);
      done();
    });

    expect(mockHttpCoreService.get).toHaveBeenCalled();
  });

  it('getPayloadDatos() should transform state into payload array', () => {
    const item: any = {
      tableBodyData: [
        { cantidad: '10', descripcion: 'TEST DESC', precioUnitarioUSD: '2', totalUSD: '20' }
      ],
      cantidad: '10',
      descripcion: 'AUT DESC',
      valorFacturaUSD: '200',
      fraccion: '123',
      unidadMedida: 'KG'
    };

    const result = service.getPayloadDatos(item) as any[];
    expect(result[0]).toEqual({
      unidadesSolicitadas: 10,
      unidadesAutorizadas: 10,
      descripcionSolicitada: 'TEST DESC',
      descripcionAutorizada: 'AUT DESC',
      importeUnitarioUSD: 2,
      importeTotalUSD: 20,
      autorizada: true,
      importeUnitarioUSDAutorizado: 2,
      importeTotalUSDAutorizado: 200,
      fraccionArancelariaClave: '123',
      unidadMedidaClave: 'KG'
    });
  });

  it('should call regimenesCatalogo and return formatted data', (done) => {
    const mockResponse = { datos: [{ id: 1, nombre: 'Regimen 1' }] };
    mockCatalogoServices.regimenesCatalogo.mockReturnValue(of(mockResponse));

    service.getRegimenCatalogo('123').subscribe((result) => {
      expect(mockCatalogoServices.regimenesCatalogo).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockResponse.datos);
      done();
    });
  });

  it('should return empty array when regimen response is null', (done) => {
    mockCatalogoServices.regimenesCatalogo.mockReturnValue(of(null));

    service.getRegimenCatalogo('123').subscribe((result) => {
      expect(result).toEqual([]);
      done();
    });
  });

  it('should call getClasificacionRegimen and return formatted data', (done) => {
    const mockResponse = { datos: [{ id: 10, nombre: 'Clasificacion' }] };
    mockCatalogoServices.getClasificacionRegimen.mockReturnValue(of(mockResponse));

    service.getClasificacionRegimenCatalogo('XYZ').subscribe((result) => {
      expect(mockCatalogoServices.getClasificacionRegimen)
        .toHaveBeenCalledWith('130107', 'XYZ');
      expect(result).toEqual(mockResponse.datos);
      done();
    });
  });

  it('should call fraccionesArancelariasCatalogo with fixed key', (done) => {
    const mockResponse = { datos: [{ id: 20, nombre: 'Fracción' }] };
    mockCatalogoServices.fraccionesArancelariasCatalogo.mockReturnValue(of(mockResponse));

    service.getFraccionCatalogoService('777').subscribe((result) => {
      expect(mockCatalogoServices.fraccionesArancelariasCatalogo)
        .toHaveBeenCalledWith('777', 'TITPEX.130107');
      expect(result).toEqual(mockResponse.datos);
      done();
    });
  });

  it('should call unidadesMedidasTarifariasCatalogo', (done) => {
    const mockResponse = { datos: [{ id: 30, nombre: 'UMT' }] };
    mockCatalogoServices.unidadesMedidasTarifariasCatalogo.mockReturnValue(of(mockResponse));

    service.getUMTService('111', 'ABC').subscribe((result) => {
      expect(mockCatalogoServices.unidadesMedidasTarifariasCatalogo)
        .toHaveBeenCalledWith('111', 'ABC');
      expect(result).toEqual(mockResponse.datos);
      done();
    });
  });

  it('should call entidadesFederativasCatalogo', (done) => {
    const mockResponse = { datos: [{ id: 40, nombre: 'Estado' }] };
    mockCatalogoServices.entidadesFederativasCatalogo.mockReturnValue(of(mockResponse));

    service.getEntidadesFederativasCatalogo('555').subscribe((result) => {
      expect(mockCatalogoServices.entidadesFederativasCatalogo)
        .toHaveBeenCalledWith('555');
      expect(result).toEqual(mockResponse.datos);
      done();
    });
  });
});