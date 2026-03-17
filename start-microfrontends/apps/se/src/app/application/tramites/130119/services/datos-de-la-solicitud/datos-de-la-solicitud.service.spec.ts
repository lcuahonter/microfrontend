import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DatosDeLaSolicitudService } from './datos-de-la-solicitud.service';
import { CatalogoServices, JSONResponse, formatearFechaYyyyMmDd } from '@libs/shared/data-access-user/src';
import { Tramite130119Store } from '../../estados/store/tramite130119.store';
import { Tramite130119Query } from '../../estados/queries/tramite130119.query';
import { Tramite130119State } from '../../estados/store/tramite130119.store';
import { PROC_130119 } from '../../servers/api-route';

describe('DatosDeLaSolicitudService', () => {
  let service: DatosDeLaSolicitudService;
  let httpMock: HttpTestingController;
  let catalogoServicesMock: jest.Mocked<CatalogoServices>;
  let tramite130119StoreMock: jest.Mocked<Tramite130119Store>;
  let tramite130119QueryMock: jest.Mocked<Tramite130119Query>;

  const mockCatalogo = [
    { id: '1', nombre: 'Opcion 1' },
    { id: '2', nombre: 'Opcion 2' }
  ];

  const mockTramiteState: Tramite130119State = {
    loginRfc: 'RFC123456789',
    idSolicitud: 1,
    regimen: 'REG001',
    clasificacionDeRegimen: 'CLAS001',
    fraccionArancelaria: 'FRAC001',
    descripcion: 'Descripción mercancía',
    umt: 'UMT001',
    paisOrigen: 'PAIS001',
    cantidad: '100',
    valorFacturaUSD: '5000',
    fechaExpedicionFactura: new Date('2023-01-01'),
    observaciones: 'Observaciones test',
    estado: 'EST001',
    representacionFederal: 'REP001'
  } as any;

  beforeEach(() => {
    const catalogoSpy = {
      regimenesCatalogo: jest.fn(),
      getClasificacionRegimen: jest.fn(),
      getFraccionesCatalogo: jest.fn(),
      unidadesMedidasTarifariasCatalogo: jest.fn(),
      paisesBloqueCatalogo: jest.fn(),
      estadosCatalogo: jest.fn(),
      representacionFederalCatalogo10: jest.fn()
    } as any;

    const storeSpy = {
      establecerDatos: jest.fn()
    } as any;

    const querySpy = {
      selectTramite130119$: of(mockTramiteState)
    } as jest.Mocked<Tramite130119Query>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DatosDeLaSolicitudService,
        { provide: CatalogoServices, useValue: catalogoSpy },
        { provide: Tramite130119Store, useValue: storeSpy },
        { provide: Tramite130119Query, useValue: querySpy }
      ]
    });

    service = TestBed.inject(DatosDeLaSolicitudService);
    httpMock = TestBed.inject(HttpTestingController);
    catalogoServicesMock = TestBed.inject(CatalogoServices) as jest.Mocked<CatalogoServices>;
    tramite130119StoreMock = TestBed.inject(Tramite130119Store) as jest.Mocked<Tramite130119Store>;
    tramite130119QueryMock = TestBed.inject(Tramite130119Query) as jest.Mocked<Tramite130119Query>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return regimen catalog', () => {
    const mockResponse = { datos: mockCatalogo } as any;
    catalogoServicesMock.regimenesCatalogo.mockReturnValue(of(mockResponse));

    service.getRegimen('123').subscribe(result => {
      expect(result).toEqual(mockCatalogo);
    });

    expect(catalogoServicesMock.regimenesCatalogo).toHaveBeenCalledWith('123');
  });

  it('should return empty array when datos is null', () => {
    catalogoServicesMock.regimenesCatalogo.mockReturnValue(of({ datos: null } as any));

    service.getRegimen('123').subscribe(result => {
      expect(result).toEqual([]);
    });
  });

  it('should return clasificacion regimen catalog', () => {
    const mockResponse = { datos: mockCatalogo } as any;
    catalogoServicesMock.getClasificacionRegimen.mockReturnValue(of(mockResponse));

    service.getClasificacionDeRegimen('123', 'REG001').subscribe(result => {
      expect(result).toEqual(mockCatalogo);
    });

    expect(catalogoServicesMock.getClasificacionRegimen).toHaveBeenCalledWith('123', 'REG001');
  });

  it('should return fraccion arancelaria catalog', () => {
    const mockResponse = { datos: mockCatalogo } as any;
    catalogoServicesMock.getFraccionesCatalogo.mockReturnValue(of(mockResponse));

    service.getFraccionArancelaria('123').subscribe(result => {
      expect(result).toEqual(mockCatalogo);
    });

    expect(catalogoServicesMock.getFraccionesCatalogo).toHaveBeenCalledWith('123');
  });

  it('should return UMT catalog', () => {
    const mockResponse = { datos: mockCatalogo } as any;
    catalogoServicesMock.unidadesMedidasTarifariasCatalogo.mockReturnValue(of(mockResponse));

    service.getUMTCatalogo('123', 'FRAC001').subscribe(result => {
      expect(result).toEqual(mockCatalogo);
    });

    expect(catalogoServicesMock.unidadesMedidasTarifariasCatalogo).toHaveBeenCalledWith('123', 'FRAC001');
  });

  it('should return pais catalog', () => {
    const mockResponse = { datos: mockCatalogo } as any;
    catalogoServicesMock.paisesBloqueCatalogo.mockReturnValue(of(mockResponse));

    service.getPais('123').subscribe(result => {
      expect(result).toEqual(mockCatalogo);
    });

    expect(catalogoServicesMock.paisesBloqueCatalogo).toHaveBeenCalledWith('123');
  });

  it('should return estado catalog', () => {
    const mockResponse = { datos: mockCatalogo } as any;
    catalogoServicesMock.estadosCatalogo.mockReturnValue(of(mockResponse));

    service.getEstado('123').subscribe(result => {
      expect(result).toEqual(mockCatalogo);
    });

    expect(catalogoServicesMock.estadosCatalogo).toHaveBeenCalledWith('123');
  });

  it('should return representacion federal catalog', () => {
    const mockResponse = { datos: mockCatalogo } as any;
    catalogoServicesMock.representacionFederalCatalogo10.mockReturnValue(of(mockResponse));

    service.getRepresentacionfederal('123', 'EST001').subscribe(result => {
      expect(result).toEqual(mockCatalogo);
    });

    expect(catalogoServicesMock.representacionFederalCatalogo10).toHaveBeenCalledWith('123', 'EST001');
  });

  it('should get datos from JSON file', () => {
    service.obtenerDatosDeLaSolicitud().subscribe(result => {
      expect(result).toEqual(mockTramiteState);
    });

    const req = httpMock.expectOne('./assets/json/130119/datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockTramiteState);
  });

  it('should set datos in store', () => {
    service.establecerDatosDeLaSolicitud(mockTramiteState);

    expect(tramite130119StoreMock.establecerDatos).toHaveBeenCalledWith({ ...mockTramiteState });
  });

  it('should return state from query', () => {
    service.getAllState().subscribe(result => {
      expect(result).toEqual(mockTramiteState);
    });
  });

  it('should send POST request', () => {
    const mockBody = { test: 'data' };
    const mockResponse: JSONResponse = { success: true, message: 'Success' } as any;

    service.guardarDatosPost(mockBody).subscribe(result => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(PROC_130119.GUARDAR);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockBody);
    req.flush(mockResponse);
  });
});