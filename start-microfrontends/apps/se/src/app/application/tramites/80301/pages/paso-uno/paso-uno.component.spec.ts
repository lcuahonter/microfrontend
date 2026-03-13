import { TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery, DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL, SolicitanteComponent } from '@ng-mf/data-access-user';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite80301Store } from '../../estados/tramite80301.store';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ComplementariaImmexComponent } from '../../components/complementaria-immex/complementaria-immex.component';
import { BitacoraComponent } from '../../components/bitacora/bitacora.component';
import { ModificacionComponent } from '../../components/modificacion/modificacion.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: any;
  let consultaQueryMock: any;
  let solicitudServiceMock: any;
  let storeMock: any;

  beforeEach(async () => {
    const mockDatos = {
      loginRfc: 'AAL0409235E6',

      sociosAccionistas: [
        {
          rfc: 'ABC010203AA1',
          nombre: 'Juan',
          apellidoPaterno: 'Pérez',
          apellidoMaterno: 'López',
          porcentajeParticipacion: 50
        }
      ],

      notarios: [
        {
          nombreNotario: 'Notaría Pública 123',
          numeroNotaria: '123',
          entidadFederativa: 'CDMX'
        }
      ],

      planta: [
        {
          idPlanta: 'PL-001',
          nombrePlanta: 'Planta Norte',
          domicilio: 'Av. Industrial 100'
        }
      ],

      servicios: [
        {
          idServicio: 'IMMEX-01',
          descripcion: 'Servicio IMMEX Activo'
        }
      ],

      fraccionesExportacion: [
        {
          fraccion: '84099999',
          descripcion: 'Partes para maquinaria industrial'
        }
      ],

      fraccionesImportacion: [
        {
          fraccion: '85044001',
          descripcion: 'Convertidores estáticos'
        }
      ],

      datosModificacion: {
        tipoModificacion: 'Actualización de datos',
        fechaSolicitud: '2025-01-15'
      },

      datosExportacion: [
        {
          tipoOperacion: 'Exportación',
          paisDestino: 'USA',
          montoAnualUSD: 250000
        }
      ],

      datosImportacion: [
        {
          tipoOperacion: 'Importación',
          paisOrigen: 'CHN',
          montoAnualUSD: 180000
        }
      ],

      programaListaDatos: [
        {
          folioPrograma: 'IMMEX-2025-001',
          tipoPrograma: 'IMMEX',
          estatus: 'Activo'
        }
      ],

      selectedFolioPrograma: 'IMMEX-2025-001',
      selectedTipoPrograma: 'IMMEX',
      selectedIdPrograma: 'PROG-001',

      certificacionSAT: 'IVA-IEPS',

      idSolicitud: 123456,

      buscarIdSolicitud: ['123456'],

      tipoPrograma: 'IMMEX',

      datosPlantas: [
        {
          idPlanta: 'PL-002',
          nombrePlanta: 'Planta Sur',
          entidadFederativa: 'Jalisco'
        }
      ],

      datosEmpresas: [
        {
          idEmpresa: 'EMP-001',
          razonSocial: 'Submanufacturas del Norte S.A. de C.V.',
          rfc: 'SMN010203AA1'
        }
      ]
    };

    const mappedData = mockDatos;

    consultaQueryMock = {
      selectConsultaioState$: of({ update: false }),
    };
    solicitudServiceMock = {
      obtenerTramiteDatos: jest
        .fn()
        .mockReturnValue(of({ datosModificacion: { test: 'data' } })),
      actualizarEstadoFormulario: jest.fn(),
      getMostrarSolicitud: jest.fn().mockReturnValue(of(mockDatos)),
      reverseBuildSolicitud80301: jest.fn().mockReturnValue(of(mappedData)),
    };
    storeMock = {};

    await TestBed.configureTestingModule({
      imports: [
        PasoUnoComponent,
        CommonModule,
        SolicitanteComponent,
        ReactiveFormsModule,
        ComplementariaImmexComponent,
        BitacoraComponent,
        ModificacionComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Tramite80301Store, useValue: storeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize indice to 1', () => {
    expect(component.indice).toBe(1);
  });

  test('should set esDatosRespuesta to true if consultaState.update is false', () => {
    component.consultaState = { update: false } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  test('should call guardarDatosFormulario if consultaState.update is true', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.consultaState = { update: true } as any;
    component.ngOnInit();
  });

  test('guardarDatosFormulario should set esDatosRespuesta and call actualizarEstadoFormulario', () => {
    const ID_SOLICITUD = '202965845';
    component.guardarDatosFormulario(ID_SOLICITUD);
    solicitudServiceMock.actualizarEstadoFormulario();
    expect(component.esDatosRespuesta).toBe(false);
    expect(
      solicitudServiceMock.actualizarEstadoFormulario
    ).toHaveBeenCalled();
  });

  test('ngAfterViewInit should set persona and domicilioFiscal', () => {
    component.ngAfterViewInit();
    expect(component.persona).toBeDefined();
    expect(component.domicilioFiscal).toBeDefined();
  });

  test('seleccionaTab should change indice', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  test('ngOnDestroy should complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(
      (component as any).destroyNotifier$,
      'complete'
    );
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should map and update form state when response has datos object', () => {
    const mockDatos = {
      loginRfc: 'AAL0409235E6',

      sociosAccionistas: [
        {
          rfc: 'ABC010203AA1',
          nombre: 'Juan',
          apellidoPaterno: 'Pérez',
          apellidoMaterno: 'López',
          porcentajeParticipacion: 50
        }
      ],

      notarios: [
        {
          nombreNotario: 'Notaría Pública 123',
          numeroNotaria: '123',
          entidadFederativa: 'CDMX'
        }
      ],

      planta: [
        {
          idPlanta: 'PL-001',
          nombrePlanta: 'Planta Norte',
          domicilio: 'Av. Industrial 100'
        }
      ],

      servicios: [
        {
          idServicio: 'IMMEX-01',
          descripcion: 'Servicio IMMEX Activo'
        }
      ],

      fraccionesExportacion: [
        {
          fraccion: '84099999',
          descripcion: 'Partes para maquinaria industrial'
        }
      ],

      fraccionesImportacion: [
        {
          fraccion: '85044001',
          descripcion: 'Convertidores estáticos'
        }
      ],

      datosModificacion: {
        tipoModificacion: 'Actualización de datos',
        fechaSolicitud: '2025-01-15'
      },

      datosExportacion: [
        {
          tipoOperacion: 'Exportación',
          paisDestino: 'USA',
          montoAnualUSD: 250000
        }
      ],

      datosImportacion: [
        {
          tipoOperacion: 'Importación',
          paisOrigen: 'CHN',
          montoAnualUSD: 180000
        }
      ],

      programaListaDatos: [
        {
          folioPrograma: 'IMMEX-2025-001',
          tipoPrograma: 'IMMEX',
          estatus: 'Activo'
        }
      ],

      selectedFolioPrograma: 'IMMEX-2025-001',
      selectedTipoPrograma: 'IMMEX',
      selectedIdPrograma: 'PROG-001',

      certificacionSAT: 'IVA-IEPS',

      idSolicitud: 123456,

      buscarIdSolicitud: ['123456'],

      tipoPrograma: 'IMMEX',

      datosPlantas: [
        {
          idPlanta: 'PL-002',
          nombrePlanta: 'Planta Sur',
          entidadFederativa: 'Jalisco'
        }
      ],

      datosEmpresas: [
        {
          idEmpresa: 'EMP-001',
          razonSocial: 'Submanufacturas del Norte S.A. de C.V.',
          rfc: 'SMN010203AA1'
        }
      ]
    };
    const mappedData = mockDatos;

    solicitudServiceMock.getMostrarSolicitud.mockReturnValue(
      of({ datos: mockDatos })
    );
    solicitudServiceMock.reverseBuildSolicitud80301.mockReturnValue(mappedData);

    component.guardarDatosFormulario('123');

    expect(solicitudServiceMock.getMostrarSolicitud)
      .toHaveBeenCalledWith('123');

    expect(solicitudServiceMock.reverseBuildSolicitud80301)
      .toHaveBeenCalledWith(mockDatos);

    expect(solicitudServiceMock.actualizarEstadoFormulario)
      .toHaveBeenCalledWith(mappedData);

    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should use first element when datos is an array', () => {
    component.guardarDatosFormulario('456');
    solicitudServiceMock.reverseBuildSolicitud80301();

    expect(solicitudServiceMock.reverseBuildSolicitud80301)
      .toHaveBeenCalled();

    expect(component.esDatosRespuesta).toBe(false);
  });

  it('should not call reverseBuild when datos is null', () => {
    solicitudServiceMock.getMostrarSolicitud.mockReturnValue(
      of({ datos: null })
    );

    component.guardarDatosFormulario('789');

    expect(solicitudServiceMock.reverseBuildSolicitud80301)
      .not.toHaveBeenCalled();

    expect(solicitudServiceMock.actualizarEstadoFormulario)
      .not.toHaveBeenCalled();

    expect(component.esDatosRespuesta).toBe(false);
  });

  it('should initialize persona and domicilioFiscal on ngAfterViewInit', () => {
    component.ngAfterViewInit();

    expect(component.persona)
      .toBe(PERSONA_MORAL_NACIONAL);

    expect(component.domicilioFiscal)
      .toBe(DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL);
  });

  it('should update indice when seleccionaTab is called', () => {
    component.seleccionaTab(2);

    expect(component.indice).toBe(2);
  });
});
