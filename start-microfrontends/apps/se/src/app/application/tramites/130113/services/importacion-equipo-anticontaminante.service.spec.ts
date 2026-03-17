import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ImportacionEquipoAnticontaminanteService } from './importacion-equipo-anticontaminante.service';
import { Tramite130113Query } from '../estados/queries/tramite130113.query';
import { Tramite130113Store } from '../estados/tramites/tramites130113.store';
import { CatalogoServices } from '@ng-mf/data-access-user';
import { PROC_130113 } from '../servers/api-route';

describe('ImportacionEquipoAnticontaminanteService', () => {
  let service: ImportacionEquipoAnticontaminanteService;
  let httpMock: HttpTestingController;
  let mockQuery: jest.Mocked<Tramite130113Query>;
  let mockStore: jest.Mocked<Tramite130113Store>;
  let mockCatalogoServices: jest.Mocked<CatalogoServices>;

  beforeEach(() => {
    const queryMock = {
      selectSolicitud$: of({})
    } as jest.Mocked<Tramite130113Query>;
    
    const storeMock = {
      actualizarEstado: jest.fn()
    } as any;
    
    const catalogoMock = {
      regimenesCatalogo: jest.fn(),
      clasificacionRegimenCatalogo: jest.fn(),
      fraccionesArancelariasCatalogo: jest.fn(),
      unidadesMedidasTarifariasCatalogo: jest.fn(),
      entidadesFederativasCatalogo: jest.fn(),
      representacionFederalCatalogo: jest.fn(),
      todosPaisesSeleccionados: jest.fn(),
      tratadosAcuerdoCatalogo: jest.fn(),
      getpaisesBloqueCatalogo: jest.fn(),
      getFraccionesArancelariasAutoCompleteCatalogo: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ImportacionEquipoAnticontaminanteService,
        { provide: Tramite130113Query, useValue: queryMock },
        { provide: Tramite130113Store, useValue: storeMock },
        { provide: CatalogoServices, useValue: catalogoMock }
      ]
    });

    service = TestBed.inject(ImportacionEquipoAnticontaminanteService);
    httpMock = TestBed.inject(HttpTestingController);
    mockQuery = TestBed.inject(Tramite130113Query) as jest.Mocked<Tramite130113Query>;
    mockStore = TestBed.inject(Tramite130113Store) as jest.Mocked<Tramite130113Store>;
    mockCatalogoServices = TestBed.inject(CatalogoServices) as jest.Mocked<CatalogoServices>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call actualizarEstado on tramite store', () => {
    const mockData = {} as any;
    service.actualizarEstadoFormulario(mockData);
    expect(mockStore.actualizarEstado).toHaveBeenCalledWith(mockData);
  });

  it('should return observable from getAllState', () => {
    const result = service.getAllState();
    expect(result).toBe(mockQuery.selectSolicitud$);
  });

  it('should generate payload data correctly', () => {
    const mockState = {
      tableBodyData: [
        {
          cantidad: '10',
          descripcion: 'Test description',
          precioUnitarioUSD: '100',
          totalUSD: '1000',
          unidadDeMedida: 'KG'
        }
      ],
      cantidad: '10',
      descripcion: 'Authorized description',
      valorFacturaUSD: '1000',
      fraccion: '12345',
      unidadMedida: 'KG'
    } as any;

    const result = service.getPayloadDatos(mockState) as any[];
    
    expect(result).toEqual([{
      unidadesSolicitadas: 10,
      unidadesAutorizadas: 10,
      descripcionSolicitada: 'Test description',
      descripcionAutorizada: 'Authorized description',
      importeUnitarioUSD: 100,
      importeTotalUSD: 1000,
      autorizada: true,
      importeUnitarioUSDAutorizado: 100,
      importeTotalUSDAutorizado: 1000,
      fraccionArancelariaClave: '12345',
      unidadMedidaClave: 'KG',
      unidadMedidaDescripcion: 'KG'
    }]);
  });

  it('should handle empty tableBodyData in getPayloadDatos', () => {
    const mockState = { tableBodyData: null } as any;
    const result = service.getPayloadDatos(mockState);
    expect(result).toEqual([]);
  });

  it('should get datos de la solicitud', () => {
    const mockResponse = {} as any;
    
    service.getDatosDeLaSolicitud().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/130113/datos-de-la-solicitud.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get regimen catalogo', () => {
    const mockResponse = { datos: [{ id: '1', descripcion: 'Test' }] } as any;
    mockCatalogoServices.regimenesCatalogo.mockReturnValue(of(mockResponse));

    service.getRegimenCatalogo('123').subscribe(result => {
      expect(result).toEqual(mockResponse.datos);
    });

    expect(mockCatalogoServices.regimenesCatalogo).toHaveBeenCalledWith('123');
  });

  it('should get clasificacion regimen catalogo', () => {
    const mockResponse = { datos: [{ id: '1', descripcion: 'Test' }] } as any;
    mockCatalogoServices.clasificacionRegimenCatalogo.mockReturnValue(of(mockResponse));

    service.getClasificacionRegimenCatalogo('123').subscribe(result => {
      expect(result).toEqual(mockResponse.datos);
    });

    expect(mockCatalogoServices.clasificacionRegimenCatalogo).toHaveBeenCalledWith('130113', { tramite: 'TITPEX.130113', id: '123' });
  });

  it('should get fraccion catalogo', () => {
    const mockResponse = { datos: [{ id: '1', descripcion: 'Test' }] } as any;
    mockCatalogoServices.fraccionesArancelariasCatalogo.mockReturnValue(of(mockResponse));

    service.getFraccionCatalogoService('123').subscribe(result => {
      expect(result).toEqual(mockResponse.datos);
    });

    expect(mockCatalogoServices.fraccionesArancelariasCatalogo).toHaveBeenCalledWith('123', 'TITPEX.130113');
  });

  it('should get UMT service', () => {
    const mockResponse = { datos: [{ id: '1', descripcion: 'Test' }] } as any;
    mockCatalogoServices.unidadesMedidasTarifariasCatalogo.mockReturnValue(of(mockResponse));

    service.getUMTService('123', '456').subscribe(result => {
      expect(result).toEqual(mockResponse.datos);
    });

    expect(mockCatalogoServices.unidadesMedidasTarifariasCatalogo).toHaveBeenCalledWith('123', '456');
  });

  it('should get entidades federativas catalogo', () => {
    const mockResponse = { datos: [{ id: '1', descripcion: 'Test' }] } as any;
    mockCatalogoServices.entidadesFederativasCatalogo.mockReturnValue(of(mockResponse));

    service.getEntidadesFederativasCatalogo('123').subscribe(result => {
      expect(result).toEqual(mockResponse.datos);
    });

    expect(mockCatalogoServices.entidadesFederativasCatalogo).toHaveBeenCalledWith('123');
  });

  it('should get representacion federal catalogo', () => {
    const mockResponse = { datos: [{ id: '1', descripcion: 'Test' }] } as any;
    mockCatalogoServices.representacionFederalCatalogo.mockReturnValue(of(mockResponse));

    service.getRepresentacionFederalCatalogo('123', '456').subscribe(result => {
      expect(result).toEqual(mockResponse.datos);
    });

    expect(mockCatalogoServices.representacionFederalCatalogo).toHaveBeenCalledWith('123', '456');
  });

  it('should get todos paises seleccionados', () => {
    const mockResponse = { datos: [{ id: '1', descripcion: 'Test' }] } as any;
    mockCatalogoServices.todosPaisesSeleccionados.mockReturnValue(of(mockResponse));

    service.getTodosPaisesSeleccionados('123').subscribe(result => {
      expect(result).toEqual(mockResponse.datos);
    });

    expect(mockCatalogoServices.todosPaisesSeleccionados).toHaveBeenCalledWith('123');
  });

  it('should get bloque service', () => {
    const mockResponse = { datos: [{ id: '1', descripcion: 'Test' }] } as any;
    mockCatalogoServices.tratadosAcuerdoCatalogo.mockReturnValue(of(mockResponse));

    service.getBloqueService('123').subscribe(result => {
      expect(result).toEqual(mockResponse.datos);
    });

    expect(mockCatalogoServices.tratadosAcuerdoCatalogo).toHaveBeenCalledWith('123', 'TITRAC.TA');
  });

  it('should get mostrar partidas service', () => {
    const mockResponse = { datos: [] };
    const solicitudId = 123;

    service.getMostrarPartidasService(solicitudId).subscribe(result => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(PROC_130113.MOSTAR_PARTIDAS + solicitudId);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get paises por bloque service', () => {
    const mockResponse = { datos: [{ id: '1', descripcion: 'Test' }] } as any;
    mockCatalogoServices.getpaisesBloqueCatalogo.mockReturnValue(of(mockResponse));

    service.getPaisesPorBloqueService('tramite123', 'bloque456').subscribe(result => {
      expect(result).toEqual(mockResponse.datos);
    });

    expect(mockCatalogoServices.getpaisesBloqueCatalogo).toHaveBeenCalledWith('tramite123', 'bloque456');
  });

  it('should get fraccion descripcion partidas service', () => {
    const mockResponse = { datos: [{ id: '1', descripcion: 'Test' }] } as any;
    mockCatalogoServices.getFraccionesArancelariasAutoCompleteCatalogo.mockReturnValue(of(mockResponse));

    service.getFraccionDescripcionPartidasDeLaMercanciaService('tramite123', 'id456').subscribe(result => {
      expect(result).toEqual(mockResponse.datos);
    });

    expect(mockCatalogoServices.getFraccionesArancelariasAutoCompleteCatalogo).toHaveBeenCalledWith('tramite123', 'id456');
  });

  it('should save data via POST', () => {
    const mockBody = { test: 'data' };
    const mockResponse = { success: true };

    service.guardarDatosPost(mockBody).subscribe(result => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(PROC_130113.GUARDAR);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockBody);
    req.flush(mockResponse);
  });

  it('should handle null/undefined responses in catalog services', () => {
    mockCatalogoServices.regimenesCatalogo.mockReturnValue(of({ datos: null } as any));

    service.getRegimenCatalogo('123').subscribe(result => {
      expect(result).toEqual([]);
    });
  });
});