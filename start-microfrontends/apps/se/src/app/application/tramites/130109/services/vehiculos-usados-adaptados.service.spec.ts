import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VehiculosUsadosAdaptadosService } from './vehiculos-usados-adaptados.service';
import { Tramite130109Store } from '../../../estados/tramites/tramites130109.store';
import { Tramite130109Query } from '../../../estados/queries/tramite130109.query';
import { CatalogoServices } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { PROC_130109 } from '../servers/api-route';
import { Tramite130109State } from '../../../estados/tramites/tramites130109.store';

describe('VehiculosUsadosAdaptadosService', () => {
  let service: VehiculosUsadosAdaptadosService;
  let httpMock: HttpTestingController;

  const tramiteStoreMock = {
    actualizarEstado: jest.fn(),
  };

  const tramiteQueryMock = {
    selectSolicitud$: of({ foo: 'bar' } as unknown as Tramite130109State),
  };

  const catalogoServiceMock = {
    regimenesCatalogo: jest.fn(),
    clasificacionRegimenCatalogo: jest.fn(),
    fraccionesArancelariasCatalogo: jest.fn(),
    unidadesMedidaTarifariaCatalogo: jest.fn(),
    entidadesFederativasCatalogo: jest.fn(),
    representacionFederalCatalogo: jest.fn(),
    todosPaisesSeleccionados: jest.fn(),
    tratadosAcuerdoCatalogo: jest.fn(),
    getpaisesBloqueCatalogo: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VehiculosUsadosAdaptadosService,
        { provide: Tramite130109Store, useValue: tramiteStoreMock },
        { provide: Tramite130109Query, useValue: tramiteQueryMock },
        { provide: CatalogoServices, useValue: catalogoServiceMock },
      ],
    });

    service = TestBed.inject(VehiculosUsadosAdaptadosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* -------------------- STORE / QUERY -------------------- */

  it('should return all state from query', (done) => {
    service.getAllState().subscribe((state) => {
      expect(state).toEqual({ foo: 'bar' });
      done();
    });
  });

  it('should update form state in store', () => {
    const mockState = { test: true } as unknown as Tramite130109State;
    service.actualizarEstadoFormulario(mockState);
    expect(tramiteStoreMock.actualizarEstado).toHaveBeenCalledWith(mockState);
  });

  /* -------------------- HTTP -------------------- */

  it('should call guardarDatosPost', () => {
    const payload = { test: 1 };
    const response = { codigo: '00' };

    service.guardarDatosPost(payload).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(PROC_130109.GUARDAR);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(response);
  });

  it('should call getDatosDeLaSolicitud', () => {
    const response = { codigo: '00' };

    service.getDatosDeLaSolicitud('123').subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(PROC_130109.MOSTRAR + '123');
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('should call getMostrarPartidasService', () => {
    const response = { datos: [] };

    service.getMostrarPartidasService(10).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(PROC_130109.MOSTAR_PARTIDAS + 10);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  /* -------------------- CATALOGOS -------------------- */

  it('should get regimen catalogo', (done) => {
    catalogoServiceMock.regimenesCatalogo.mockReturnValue(
      of({ datos: [{ clave: 'R1' }] })
    );

    service.getRegimenCatalogo('130109').subscribe((res) => {
      expect(res).toEqual([{ clave: 'R1' }]);
      done();
    });
  });

  it('should get fraccion catalogo', (done) => {
    catalogoServiceMock.fraccionesArancelariasCatalogo.mockReturnValue(
      of({ datos: [{ clave: '0101' }] })
    );

    service.getFraccionCatalogoService('ID').subscribe((res) => {
      expect(res.length).toBe(1);
      done();
    });
  });

  /* -------------------- PURE METHODS -------------------- */

  it('should generate payload datos', () => {
    const state = {
      tableBodyData: [
        {
          cantidad: '2',
          descripcion: 'DESC',
          precioUnitarioUSD: '10',
          totalUSD: '20',
        },
      ],
      cantidad: '2',
      descripcion: 'DESC AUT',
      valorFacturaUSD: '20',
      fraccion: '0101',
      unidadMedida: 'KG',
    } as unknown as Tramite130109State;

    const result = service.getPayloadDatos(state) as any[];

    expect(result.length).toBe(1);
    expect(result[0].unidadesSolicitadas).toBe(2);
    expect(result[0].importeTotalUSD).toBe(20);
  });

  it('should reverse map partidas de la mercancia', () => {
    const input = [
      {
        unidadesSolicitadas: '5',
        unidadMedidaDescripcion: 'KG',
        fraccionArancelariaDescripcion: '0101',
        descripcionSolicitada: 'TEST',
        importeUnitarioUSDAutorizado: '10',
        importeTotalUSDAutorizado: '50',
        unidadesAutorizadas: '5',
        descripcionAutorizada: 'AUT',
      },
    ];

    const result = service.reverseMapPartidasDeLaMercancia(input);

    expect(result.length).toBe(1);
    expect(result[0]['cantidad']).toBe('5');
    expect(result[0]['totalUSD']).toBe('50');
  });

  it('should reverse build solicitud 130109', () => {
    const built = {
      tipo_solicitud_pexim: 'SOL',
      cve_regimen: 'REG',
      mercancia: {
        condicionMercancia: 'NUEVO',
        descripcion: 'DESC',
        fraccionArancelaria: { cveFraccion: '0101' },
        unidadMedidaTarifaria: { clave: 'KG' },
        cantidadTarifaria: '5',
        valorFacturaUSD: '50',
        partidasMercancia: [
          {
            unidadesSolicitadas: '5',
            importeTotalUSDAutorizado: '50',
          },
        ],
      },
      representacionFederal: {
        cve_entidad_federativa: '09',
        cve_unidad_administrativa: '001',
      }
    };

    const result = service.reverseBuildSolicitud130109(built);

    expect(result['cantidadTotal']).toBe('5');
    expect(result['valorTotalUSD']).toBe('50');
  });
});
