import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Catalogo, CatalogoServices, JSONResponse } from '@ng-mf/data-access-user';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { MostrarPartidas } from '@libs/shared/data-access-user/src';

import { ControlPermisosPreviosExportacionService } from './control-permisos-previos-exportacion.service';
import { Tramite130217State, Tramite130217Store } from '../../../estados/tramites/tramite130217.store';
import { Tramite130217Query } from '../../../estados/queries/tramite130217.query';
import { PROC_130217 } from '../servers/api-route';
import { ProductoResponse } from '../../../shared/constantes/vehiculos-adaptados.enum';

describe('ControlPermisosPreviosExportacionService', () => {
  let service: ControlPermisosPreviosExportacionService;
  let httpMock: HttpTestingController;
  let mockCatalogoServices: jest.Mocked<CatalogoServices>;
  let mockStore: jest.Mocked<Tramite130217Store>;
  let mockQuery: jest.Mocked<Tramite130217Query>;
  const mockCatalogData: Catalogo[] = [
    { id: 1, clave: '1', descripcion: 'Test Item 1' },
    { id: 2, clave: '2', descripcion: 'Test Item 2' }
  ];

  const mockBaseResponse: BaseResponse<Catalogo[]> = {
    codigo: '00',
    datos: mockCatalogData,
    path: '/test',
    timestamp: new Date().toISOString(),
    mensaje: 'Success'
  };

  const mockTramiteState: Tramite130217State = {
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
    cantidadTotal: '',
    valorTotalUSD: '',
    fechasSeleccionadas: [],
    tableBodyData: [
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
      entidadesFederativasCatalogo: jest.fn(() => of(mockBaseResponse)),
      representacionFederalCatalogo: jest.fn(() => of(mockBaseResponse)),
      unidadesMedidaTarifariaCatalogo: jest.fn(() => of(mockBaseResponse)),
    clasificacionRegimenCatalogo: jest.fn(() => of(mockBaseResponse)),
    fraccionesArancelariasCatalogo: jest.fn(() => of(mockBaseResponse)),
    tratadosAcuerdoCatalogo: jest.fn(() => of(mockBaseResponse)),
    regimenesCatalogo: jest.fn(() => of(mockBaseResponse)),
    getpaisesBloqueCatalogo: jest.fn(() => of(mockBaseResponse)),
    todosPaisesSeleccionados: jest.fn(() => of(mockBaseResponse))
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
        ControlPermisosPreviosExportacionService,
        { provide: CatalogoServices, useValue: catalogoServicesMock },
        { provide: Tramite130217Store, useValue: storeMock },
        { provide: Tramite130217Query, useValue: queryMock }
      ],
    });

    service = TestBed.inject(ControlPermisosPreviosExportacionService);
    httpMock = TestBed.inject(HttpTestingController);
    mockCatalogoServices = TestBed.inject(CatalogoServices) as jest.Mocked<CatalogoServices>;
    mockStore = TestBed.inject(Tramite130217Store) as jest.Mocked<Tramite130217Store>;
    mockQuery = TestBed.inject(Tramite130217Query) as jest.Mocked<Tramite130217Query>;
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
      
      service.actualizarEstadoFormulario(testData);
      
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith(testData);
    });

    it('should get all state', () => {
      service.getAllState().subscribe(state => {
        expect(state).toEqual(mockTramiteState);
      });
    });
  });
  describe('HTTP Methods', () => {
    it('should get solicitude options', () => {
      const mockSolicitudResponse: ProductoResponse = {
        options: [
          { label: 'Test Solicitud', value: 'SOL1' }
        ],
        defaultSelect: 'SOL1'
      };

      service.getSolicitudeOptions().subscribe(data => {
        expect(data).toEqual(mockSolicitudResponse);
      });

      const req = httpMock.expectOne('assets/json/130217/solicitude-options.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockSolicitudResponse);
    });

    it('should save data via POST', () => {
      const testPayload = { test: 'data' };
      const mockResponse: JSONResponse = {
        id: 1,
        codigo: '00',
        descripcion: 'Success',
        data: '',
        datos: [],
        mensaje: 'Success'
      };

      service.guardarDatosPost(testPayload).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(PROC_130217.GUARDAR);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(testPayload);
      req.flush(mockResponse);
    });
  });

  describe('Catalog Service Methods', () => {
    it('should get regimen catalogo', () => {
      const tramiteId = '130217';

      service.getRegimenCatalogo(tramiteId).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.regimenesCatalogo).toHaveBeenCalledWith(tramiteId);
    });    it('should get clasificacion regimen catalogo', () => {
      const tramiteId = '01';
      const expectedPayload = { tramite: 'TITPEX.130108', id: tramiteId };

      service.getClasificacionRegimenCatalogo(tramiteId).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.clasificacionRegimenCatalogo).toHaveBeenCalledWith('130217', expectedPayload);
    });

    it('should get fraccion catalogo service', () => {
      const id = '130217';

      service.getFraccionCatalogoService(id).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.fraccionesArancelariasCatalogo).toHaveBeenCalledWith(id, 'TITPEX.130217');
    });

    it('should get UMT service', () => {
      const id = '130217';
      const fraccionId = '87012101';

      service.getUMTService(id, fraccionId).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.unidadesMedidaTarifariaCatalogo).toHaveBeenCalledWith(id, fraccionId);
    });

    it('should get entidades federativas catalogo', () => {
      const id = '130217';

      service.getEntidadesFederativasCatalogo(id).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.entidadesFederativasCatalogo).toHaveBeenCalledWith(id);
    });

    it('should get representacion federal catalogo', () => {
      const id = '130217';
      const cveEntidad = 'DGO';

      service.getRepresentacionFederalCatalogo(id, cveEntidad).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.representacionFederalCatalogo).toHaveBeenCalledWith(id, cveEntidad);
    });    it('should get todos paises seleccionados', () => {
      const id = '130217';

      service.getTodosPaisesSeleccionados(id).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.todosPaisesSeleccionados).toHaveBeenCalledWith(id);
    });

    it('should get bloque service', () => {
      const tramite = '130217';

      service.getBloqueService(tramite).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.tratadosAcuerdoCatalogo).toHaveBeenCalledWith(tramite, 'TITRAC.TA');
    });

    it('should get paises por bloque service', () => {
      const tramite = '130217';
      const bloqueId = 'BLQ001';

      service.getPaisesPorBloqueService(tramite, bloqueId).subscribe(data => {
        expect(data).toEqual(mockCatalogData);
      });

      expect(mockCatalogoServices.getpaisesBloqueCatalogo).toHaveBeenCalledWith(tramite, bloqueId);
    });
  });

  describe('Payload Generation Methods', () => {    it('should generate payload datos correctly', () => {
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
        unidadMedidaClave: '6'
      });
    });

    it('should generate payload mercancia correctly', () => {
      const result = service.getPayloadMercancia(mockTramiteState) as any;
      
      expect(result).toEqual({
        cantidadComercial: 0,
        cantidadTarifaria: 10,
        valorFacturaUSD: 1000,
        condicionMercancia: 'CONDMER.N',
        descripcion: 'Test description',
        usoEspecifico: 'Test uso',
        justificacionImportacionExportacion: 'Test justification',
        observaciones: 'Test observations',
        unidadMedidaTarifaria: { clave: '6' },
        fraccionArancelaria: { cveFraccion: '87012101' },
        partidasMercancia: expect.any(Array)
      });
    });

    it('should generate payload productor correctly', () => {
      const result = service.getPayloadProductor() as any;
      
      expect(result).toEqual({
        tipo_persona: true,
        nombre: 'Juan',
        apellido_materno: 'López',
        apellido_paterno: 'Norte',
        razon_social: 'Aceros Norte',
        descripcion_ubicacion: 'Calle Acero, No. 123, Col. Centro',
        rfc: 'AAL0409235E6',
        pais: 'SIN'
      });
    });

    it('should generate payload solicitante correctly', () => {
      const result = service.getPayloadSolicitante() as any;
      
      expect(result).toEqual({
        rfc: 'AAL0409235E6',
        nombre: 'Juan Pérez',
        es_persona_moral: true,
        certificado_serial_number: 'string'
      });
    });

    it('should generate payload representacion federal correctly', () => {
      const result = service.getPayloadRepresentacionFederal(mockTramiteState) as any;
      
      expect(result).toEqual({
        cve_entidad_federativa: 'DGO',
        cve_unidad_administrativa: '1016'
      });
    });

    it('should generate payload entidad federativa correctly', () => {
      const result = service.getPayloadEntidadFederativa(mockTramiteState) as any;
      
      expect(result).toEqual({
        cveEntidad: 'DGO'
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
      mockCatalogoServices.entidadesFederativasCatalogo.mockReturnValue(of({ 
        ...mockBaseResponse, 
        datos: null as any 
      }));

      service.getEntidadesFederativasCatalogo('130217').subscribe(data => {
        expect(data).toEqual([]);
      });
    });

    it('should handle undefined catalog response', () => {
      mockCatalogoServices.regimenesCatalogo.mockReturnValue(of(undefined as any));

      service.getRegimenCatalogo('130217').subscribe(data => {
        expect(data).toEqual([]);
      });
    });

    it('should handle empty datos response', () => {
      mockCatalogoServices.clasificacionRegimenCatalogo.mockReturnValue(of({ 
        ...mockBaseResponse, 
        datos: [] 
      }));

      service.getClasificacionRegimenCatalogo('01').subscribe(data => {
        expect(data).toEqual([]);
      });
    });

    it('should handle null datos in response', () => {
      mockCatalogoServices.fraccionesArancelariasCatalogo.mockReturnValue(of({ 
        ...mockBaseResponse, 
        datos: null as any 
      }));

      service.getFraccionCatalogoService('130217').subscribe(data => {
        expect(data).toEqual([]);
      });
    });
  });
});
