import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExpedicionCertificadosAsignacionService } from './expedicion-certificados-asignacion.service';
import { createInitialState, Tramite120202Store } from '../../../../estados/tramites/tramite120202.store';
import { Tramite120202Query } from '../../../../estados/queries/tramite120202.query';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { of } from 'rxjs';

describe('ExpedicionCertificadosAsignacionService', () => {
  let service: ExpedicionCertificadosAsignacionService;
  let store: Tramite120202Store;
  let query: Tramite120202Query;
  let httpService: HttpCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ExpedicionCertificadosAsignacionService,
        Tramite120202Store,
        Tramite120202Query,
        {
          provide: HttpCoreService,
          useValue: {
            post: jest.fn(),
            get: jest.fn()
          }
        }
      ]
    });
    service = TestBed.inject(ExpedicionCertificadosAsignacionService);
    store = TestBed.inject(Tramite120202Store);
    query = TestBed.inject(Tramite120202Query);
    httpService = TestBed.inject(HttpCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllState should return observable', (done) => {
  (query as any).selectSeccionState$ = of(createInitialState());
  service.getAllState().subscribe(val => {
    expect(val).toEqual(createInitialState());
    done();
  });
});

  it('guardarDatosPost should call httpService.post', () => {
    (httpService.post as jest.Mock).mockReturnValue(of({}));
    service.guardarDatosPost({ foo: 'bar' }).subscribe(res => {
      expect(httpService.post).toHaveBeenCalled();
      expect(res).toEqual({});
    });
  });

  it('getMostrarSolicitud should call httpService.get', () => {
    (httpService.get as jest.Mock).mockReturnValue(of({ data: 1 }));
    service.getMostrarSolicitud('1').subscribe(res => {
      expect(httpService.get).toHaveBeenCalled();
      expect(res).toEqual({ data: 1 });
    });
  });

  it('buildSolicitante should return solicitante object', () => {
    const result = service.buildSolicitante();
    expect(result).toHaveProperty('rfc');
    expect(result).toHaveProperty('nombre');
    expect(result).toHaveProperty('actividad_economica');
    expect(result).toHaveProperty('correo_electronico');
    expect(result).toHaveProperty('domicilio');
  });

  it('buildAsignacion should return asignacion object', () => {
    const item: any = {
      asignacionDatosForm: { idAsignacion: 1, numOficio: 'A', fechaInicio: '2024-01-01', fechaFinVigenciaAprobada: '2024-12-31' },
      controlMontosAsignacionForm: { montoDisponible: 10, sumaAprobada: 5, sumaExpedida: 2 },
      asignacionOficioNumeroForm: { cveAniosAutorizacion: '2024', numFolioAsignacionAux: 'AUX' },
      cupoDescripcionForm: {},
    };
    const result = service.buildAsignacion(item);
    expect(result).toHaveProperty('idAsignacion', 1);
    expect(result).toHaveProperty('mecanismoAsignacion');
  });

  it('buildMechanismoAsignacion should return mecanismo object', () => {
    const item: any = {
      asignacionDatosForm: { idMecanismoAsignacion: 1 },
      cupoDescripcionForm: {
        descClasificacionProducto: 'desc',
        mecanismoAsignacion: 'Asignación directa',
        regimenAduanero: 'reg',
        paisesCupo: ['MX'],
        descripcionProducto: 'prod',
        fechaInicioVigencia: '2024-01-01',
        fechaFinVigencia: '2024-12-31',
        unidadMedidaOficialCupo: 'kg',
        tratado: 'tratado',
        observaciones: 'obs',
        descripcionFundamento: 'fund'
      }
    };
    const result = service.buildMechanismoAsignacion(item);
    expect(result).toHaveProperty('idMecanismoAsignacion', 1);
    expect(result).toHaveProperty('descClasificacionProducto', 'desc');
    expect(result).toHaveProperty('nombreMecanismoAsignacion', 'Asignación directa');
    expect(result).toHaveProperty('paisesCupo');
  });

  it('buildSolicitud should return solicitud object', () => {
    const item: any = {
      cupoDescripcionForm: { fraccionesArancelarias: ['A'], descripcionProducto: 'desc' },
      cuerpoTabla: [{ montoExpedir: 1 }],
      representacionFederalForm: { clave: 'clave', representacionFederal: 'rep', estado: 'est' },
      asignacionDatosForm: {},
      controlMontosAsignacionForm: {},
      asignacionOficioNumeroForm: {},
    };
    const result = service.buildSolicitud(item);
    expect(result).toHaveProperty('cveFraccion', 'A');
    expect(result).toHaveProperty('cadenaMontos', '1');
    expect(result).toHaveProperty('solicitante');
    expect(result).toHaveProperty('unidadAdministrativaRepresentacionFederal');
    expect(result).toHaveProperty('asignacion');
  });

  it('buildExpediciones should return expediciones array', () => {
    const item: any = {
      cuerpoTabla: [{ montoExpedir: 1 }],
      asignacionDatosForm: { numOficio: 'A' },
      controlMontosAsignacionForm: { sumaAprobada: 2 },
      cupoDescripcionForm: { descripcionProducto: 'desc' }
    };
    const result = service.buildExpediciones(item);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('cantidad', 1);
  });

  it('buildPayload should return payload object', () => {
    const item: any = {
      idSolicitud: 1,
      distribucionSaldoForm: { totalExpedir: 2 },
      cupoDescripcionForm: { fraccionesArancelarias: ['A'], descripcionProducto: 'desc' },
      cuerpoTabla: [{ montoExpedir: 1 }],
      representacionFederalForm: { clave: 'clave', representacionFederal: 'rep', estado: 'est' },
      asignacionDatosForm: {},
      controlMontosAsignacionForm: {},
      asignacionOficioNumeroForm: {},
    };
    const result = service.buildPayload(item);
    expect(result).toHaveProperty('idSolicitud', 1);
    expect(result).toHaveProperty('totalExpedir', 2);
    expect(result).toHaveProperty('discriminatorValue', '120202');
    expect(result).toHaveProperty('solicitud');
    expect(result).toHaveProperty('expediciones');
  });

  it('reversePayload should return partial state', () => {
    const response = {
      asignacion: {
        idAsignacion: 1,
        numFolioAsignacion: 'A',
        fechaInicioVigencia: '2024-01-01',
        fechaFinVigenciaAprobada: '2024-12-31',
        impTotalAprobado: 2,
        impTotalExpedido: 1,
        montoDisponible: 3,
        mecanismoAsignacion: {
          descClasificacionProducto: 'desc',
          nombreMecanismoAsignacion: 'Asignación directa',
          regimen: 'reg',
          paisesCupo: [{ pais: { nombre: 'MX' } }],
          nombreProducto: 'prod',
          fechaInicioVigencia: '2024-01-01',
          fechaFinVigencia: '2024-12-31',
          unidadMedidaDescripcion: 'kg',
          nombreTratado: 'tratado',
          observaciones: 'obs',
          descripcionFundamento: 'fund'
        }
      },
      idSolicitud: 1,
      representacionFederalForm: { clave: 'clave', representacionFederal: 'rep', estado: 'est' },
      cuerpoTabla: [{ montoExpedir: 1 }],
      exp: [{ montoExpedir: 1 }],
      totalExpedir: 1,
      fraccionArancelaria: ['A'],
      expediciones: [{ cantidad: 1 }]
    };
    const result = service.reversePayload(response);
    expect(result).toHaveProperty('idSolicitud', 1);
    expect(result).toHaveProperty('representacionFederalForm');
    expect(result).toHaveProperty('asignacionDatosForm');
    expect(result).toHaveProperty('asignacionOficioNumeroForm');
    expect(result).toHaveProperty('controlMontosAsignacionForm');
    expect(result).toHaveProperty('cupoDescripcionForm');
    expect(result).toHaveProperty('distribucionSaldoForm');
    expect(result).toHaveProperty('cuerpoTabla');
    expect(result).toHaveProperty('mostrarDetalle', true);
  });
});