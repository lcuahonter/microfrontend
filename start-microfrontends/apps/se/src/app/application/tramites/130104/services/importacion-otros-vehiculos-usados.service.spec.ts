import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Catalogo, CatalogoServices, HttpCoreService, JsonResponseCatalogo } from '@ng-mf/data-access-user';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { MostrarPartidas } from '@libs/shared/data-access-user/src';

import { ImportacionOtrosVehiculosUsadosService } from './importacion-otros-vehiculos-usados.service';
import { Tramite130104State, Tramite130104Store } from '../../../estados/tramites/tramite130104.store';
import { Tramite130104Query } from '../../../estados/queries/tramite130104.query';
import { PROC_130104 } from '../servers/api-route';

describe('ImportacionOtrosVehiculosUsadosService', () => {
  let service: ImportacionOtrosVehiculosUsadosService;
  let httpMock: HttpTestingController;
  let mockCatalogoServices: jest.Mocked<CatalogoServices>;
  let mockHttpCoreService: jest.Mocked<HttpCoreService>;
  let mockStore: jest.Mocked<Tramite130104Store>;
  let mockQuery: jest.Mocked<Tramite130104Query>;  const mockCatalogData: Catalogo[] = [
    { id: 1, clave: '1', descripcion: 'Test Item 1' },
    { id: 2, clave: '2', descripcion: 'Test Item 2' }
  ];

  const mockTramiteState: Tramite130104State = {
    idSolicitud: 123,
    producto: 'CONDMER.N',
    descripcion: 'Test description',
    fraccion: '87012101',
    cantidad: '10',
    valorPartidaUSD: 1000,
    unidadMedida: '6',
    solicitud: 'TISOL.I',
    defaultSelect: 'Inicial',
    defaultProducto: 'CONDMER.U',
    regimen: '01',
    clasificacion: '01',
    filaSeleccionada: [],
    cantidadPartidasDeLaMercancia: '10',
    valorPartidaUSDPartidasDeLaMercancia: '1000',
    descripcionPartidasDeLaMercancia: 'Test description',
    valorFacturaUSD: '1000',
    bloque: '',
    usoEspecifico: 'Test uso',
    justificacionImportacionExportacion: 'Test justification',
    observaciones: 'Test observations',
    entidad: 'DGO',
    representacion: '1016',
    mostrarTabla: false,
    modificarPartidasDelaMercanciaForm: {
      cantidadPartidasDeLaMercancia: '',
      valorPartidaUSDPartidasDeLaMercancia: '',
      descripcionPartidasDeLaMercancia: ''
    },
    mostrarPartidas: [],
    cantidadTotal: '',
    valorTotalUSD: '',
    fechasSeleccionadas: [],    tableBodyData: [
      {
        id: '1',
        cantidad: '5',
        descripcion: 'Test vehicle',
        precioUnitarioUSD: '200',
        totalUSD: '1000',
        unidadDeMedida: 'Pieza',
        fraccionFrancelaria: '87012101'
      }
    ]
  };

  beforeEach(() => {
  const catalogoServicesMock = {
    entidadesFederativasCatalogo: jest.fn(() => of({ datos: mockCatalogData })),
    representacionFederalCatalogo: jest.fn(() => of({ datos: mockCatalogData })),
    unidadesMedidaTarifariaCatalogo: jest.fn(() => of({ datos: mockCatalogData })),
    clasificacionRegimenCatalogo: jest.fn(() => of({ datos: mockCatalogData })),
    fraccionesArancelariasCatalogo: jest.fn(() => of({ datos: mockCatalogData })),
    tratadosAcuerdoCatalogo: jest.fn(() => of({ datos: mockCatalogData })),
    regimenesCatalogo: jest.fn(() => of({ datos: mockCatalogData })),
    getpaisesBloqueCatalogo: jest.fn(() => of({ datos: mockCatalogData }))
  };

    const httpCoreServiceMock = {
      get: jest.fn()
    };

    const storeMock = {
      actualizarEstado: jest.fn()
    };

    const queryMock = {
      selectSolicitud$: of(mockTramiteState)
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ImportacionOtrosVehiculosUsadosService,
        { provide: CatalogoServices, useValue: catalogoServicesMock },
        { provide: HttpCoreService, useValue: httpCoreServiceMock },
        { provide: Tramite130104Store, useValue: storeMock },
        { provide: Tramite130104Query, useValue: queryMock }
      ],
    });

    service = TestBed.inject(ImportacionOtrosVehiculosUsadosService);
    httpMock = TestBed.inject(HttpTestingController);
    mockCatalogoServices = TestBed.inject(CatalogoServices) as jest.Mocked<CatalogoServices>;
    mockHttpCoreService = TestBed.inject(HttpCoreService) as jest.Mocked<HttpCoreService>;
    mockStore = TestBed.inject(Tramite130104Store) as jest.Mocked<Tramite130104Store>;
    mockQuery = TestBed.inject(Tramite130104Query) as jest.Mocked<Tramite130104Query>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('Store Methods', () => {
    it('should update form state', () => {
      const testData = { ...mockTramiteState, descripcion: 'Updated description' };
          
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith(testData);
    });

    it('should get all state', () => {
      service.getAllState().subscribe(state => {
        expect(state).toEqual(mockTramiteState);
      });
    });
  });

  describe('HTTP Methods', () => {
    it('should fetch datos de la solicitud', () => {
      const mockResponse = mockTramiteState;

       const req = httpMock.expectOne('assets/json/130104/datos-de-la-solicitud.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });    it('should get tipo factura', () => {
      const mockResponse: JsonResponseCatalogo = {
        codigo: '00',
        mensaje: 'Success',
        datos: mockCatalogData
      };
      
      mockHttpCoreService.get.mockReturnValue(of(mockResponse));

      service.getTipoFactura().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(mockHttpCoreService.get).toHaveBeenCalledWith(
        PROC_130104.TIPO_FACTURA,
        {},
        false
      );
    });

    it('should save data via POST', () => {
      const testPayload = { test: 'data' };
      const mockResponse = { codigo: '00', mensaje: 'Success' };

      service.guardarDatosPost(testPayload).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(expect.stringContaining('guardar'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(testPayload);
      req.flush(mockResponse);
    });

  });

  describe('Catalog Service Methods', () => {    it('should get paises por bloque service', () => {
      const tramite = '130104';
      const bloqueId = 'BLQ001';

      service.getPaisesPorBloqueService(tramite, bloqueId).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.getpaisesBloqueCatalogo).toHaveBeenCalledWith(tramite, bloqueId);
    });

    it('should get entidad federativa', () => {
      const tramite = '130104';

      service.getEntidadFederativa(tramite).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.entidadesFederativasCatalogo).toHaveBeenCalledWith(tramite);
    });

    it('should get representacion federal', () => {
      const tramite = '130104';
      const cveEntidad = 'DGO';

      service.getRepresentacionFederal(tramite, cveEntidad).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.representacionFederalCatalogo).toHaveBeenCalledWith(tramite, 'MEX');
    });

    it('should get entidades federativas catalogo', () => {
      const id = '130104';

      service.getEntidadesFederativasCatalogo(id).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.entidadesFederativasCatalogo).toHaveBeenCalledWith(id);
    });

    it('should get representacion federal catalogo', () => {
      const id = '130104';
      const cveEntidad = 'DGO';

      service.getRepresentacionFederalCatalogo(id, cveEntidad).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.representacionFederalCatalogo).toHaveBeenCalledWith(id, cveEntidad);
    });

    it('should get UMT service', () => {
      const id = '130104';
      const fraccionId = '87012101';

      service.getUMTService(id, fraccionId).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.unidadesMedidaTarifariaCatalogo).toHaveBeenCalledWith(id, fraccionId);
    });

    it('should get clasificacion regimen catalogo', () => {
      const tramiteId = '01';
      const expectedPayload = { tramite: 'TITPEX.130108', id: tramiteId };

      service.getClasificacionRegimenCatalogo(tramiteId).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.clasificacionRegimenCatalogo).toHaveBeenCalledWith('130104', expectedPayload);
    });

    it('should get fraccion catalogo service', () => {
      const id = '130104';

      service.getFraccionCatalogoService(id).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.fraccionesArancelariasCatalogo).toHaveBeenCalledWith(id, 'TITPEX.130104');
    });

    it('should get bloque service', () => {
      const tramite = '130104';

      service.getBloqueService(tramite).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.tratadosAcuerdoCatalogo).toHaveBeenCalledWith(tramite, 'TITRAC.TA');
    });

    it('should get regimen catalogo', () => {
      const tramiteId = '130104';

      service.getRegimenCatalogo(tramiteId).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.regimenesCatalogo).toHaveBeenCalledWith(tramiteId);
    });
  });

  describe('Data Processing Methods', () => {
    it('should generate payload datos correctly', () => {
      const result = service.getPayloadDatos(mockTramiteState) as any[];
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        unidadesSolicitadas: 5,
        unidadesAutorizadas: 10,
        descripcionSolicitada: 'Test vehicle',
        descripcionAutorizada: 'Test description',
        importeUnitarioUSD: 200,
        importeTotalUSD: 1000,
        autorizada: true,
        importeUnitarioUSDAutorizado: 200,
        importeTotalUSDAutorizado: 1000,
        fraccionArancelariaClave: '87012101',
        unidadMedidaClave: '6',
        unidadMedidaDescripcion: 'Pieza'
      });
    });

    it('should handle empty tableBodyData', () => {
      const stateWithoutData = { ...mockTramiteState, tableBodyData: [] };
      const result = service.getPayloadDatos(stateWithoutData) as any[];
      
      expect(result).toHaveLength(0);
    });

    it('should handle non-array tableBodyData', () => {
      const stateWithInvalidData = { ...mockTramiteState, tableBodyData: null as any };
      const result = service.getPayloadDatos(stateWithInvalidData) as any[];
      
      expect(result).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle catalog service errors gracefully', () => {
      mockCatalogoServices.entidadesFederativasCatalogo.mockReturnValue(of({ datos: null } as any));

      service.getEntidadFederativa('130104').subscribe(data => {
        expect(data).toEqual([]);
      });
    });

    it('should handle undefined catalog response', () => {
      mockCatalogoServices.regimenesCatalogo.mockReturnValue(of(undefined as any));

      service.getRegimenCatalogo('130104').subscribe(data => {
        expect(data).toEqual([]);
      });
    });
  });
});