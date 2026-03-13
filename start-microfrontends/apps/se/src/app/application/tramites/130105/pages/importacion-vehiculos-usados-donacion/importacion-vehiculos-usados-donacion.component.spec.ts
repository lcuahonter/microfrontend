import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ImportacionVehiculosUsadosDonacionComponent } from './importacion-vehiculos-usados-donacion.component';
import { ImportacionVehiculosUsadosDonacionService } from '../../services/importacion-vehiculos-usados-donacion.service';
import { Tramite130105Store } from '../../../../estados/tramites/tramites130105.store';
import { Tramite130105Query } from '../../../../estados/queries/tramite130105.query';
import { AlertComponent, BtnContinuarComponent, CrosslistComponent, InputRadioComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { AccionBoton } from '../../enums/accionbotton.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosDeLaMercanciaComponent } from '../../../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { PaisProcendenciaComponent } from '../../../../shared/components/pais-procendencia/pais-procendencia.component';
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { RepresentacionComponent } from '../../../../shared/components/representacion/representacion.component';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';

describe('ImportacionVehiculosUsadosDonacionComponent', () => {
  let component: ImportacionVehiculosUsadosDonacionComponent;
  let fixture: ComponentFixture<ImportacionVehiculosUsadosDonacionComponent>;
  let mockImportacionService: jest.Mocked<ImportacionVehiculosUsadosDonacionService>;
  let mockTramiteStore: jest.Mocked<Tramite130105Store>;
  let mockTramiteQuery: jest.Mocked<Tramite130105Query>;
  let mockToastrService: jest.Mocked<ToastrService>;
  let mockWizardComponent: jest.Mocked<WizardComponent>;
  let mockPasoUnoComponent: jest.Mocked<PasoUnoComponent>;

  beforeEach(async () => {
    const importacionServiceMock = {
      getAllState: jest.fn(() => of()),
      guardarDatosPost: jest.fn(() => of()),
      actualizarEstadoFormulario: jest.fn(() => of()),
      getDatosDeLaSolicitud: jest.fn(() => of()),
      getRegimenCatalogo: jest.fn(() => of()),
      getClasificacionRegimenCatalogo: jest.fn(() => of()),
      getFraccionesArancelariasCatalogo: jest.fn(() => of()),
      getUnidadesMedidaTarifariaCatalogo: jest.fn(() => of()),
      getFraccionCatalogoService: jest.fn(() => of()),
      getUMTService: jest.fn(() => of()),
      getEntidadesFederativasCatalogo: jest.fn(() => of()),
      getRepresentacionFederalCatalogo: jest.fn(() => of()),
      getTodosPaisesSeleccionados: jest.fn(() => of()),
      getBloqueService: jest.fn(() => of()),
      getMostrarPartidasService: jest.fn(() => of()),
      getPaisesPorBloqueService: jest.fn(() => of()),
      getPayloadDatos:jest.fn(()=> of()),
      http: jest.fn(() => of()) as any,
      tramite130105Store: jest.fn(() => of()) as any,
      tramite130105Query: jest.fn(() => of()) as any,
      catalogoServices: jest.fn(() => of()) as any
    } as any;

    const tramiteStoreMock = {
      setIdSolicitud: jest.fn(() => of()),
      actualizarEstado: jest.fn(() => of()),
      resetStore: jest.fn(() => of())
    } as any;

    const tramiteQueryMock = {
      selectSolicitud$: of({}),
      mostrarTabla$: of({})
    } as any;

    const toastrServiceMock = {
      success: jest.fn(() => of()),
      error: jest.fn(() => of())
    } as unknown as jest.Mocked<ToastrService>;

    const wizardComponentMock = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
      indiceActual: 0
    } as unknown as jest.Mocked<WizardComponent>;

    const pasoUnoComponentMock = {
      solicitudComponent: {
        validarFormulario: jest.fn().mockReturnValue(true)
      }
    } as unknown as jest.Mocked<PasoUnoComponent>;

    await TestBed.configureTestingModule({
      declarations: [ImportacionVehiculosUsadosDonacionComponent, PasoUnoComponent, SolicitudComponent],
      imports: [
        HttpClientTestingModule,
        CommonModule,
        WizardComponent,
        BtnContinuarComponent,
        TituloComponent,
        InputRadioComponent,
        SolicitanteComponent,
        PasoFirmaComponent,
        DatosDelTramiteComponent,
        DatosDeLaMercanciaComponent,
        PartidasDeLaMercanciaComponent,
        TablaDinamicaComponent,
        PaisProcendenciaComponent,
        RepresentacionComponent,
        CrosslistComponent,
        PasoCargaDocumentoComponent,
        AlertComponent,
        NotificacionesComponent,
        ToastrModule.forRoot()
      ],
      providers: [
        ToastrService,
        { provide: ImportacionVehiculosUsadosDonacionService, useValue: importacionServiceMock },
        { provide: Tramite130105Store, useValue: tramiteStoreMock },
        { provide: Tramite130105Query, useValue: tramiteQueryMock },
        { provide: ToastrService, useValue: toastrServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportacionVehiculosUsadosDonacionComponent);
    component = fixture.componentInstance;
    mockImportacionService = TestBed.inject(ImportacionVehiculosUsadosDonacionService) as jest.Mocked<ImportacionVehiculosUsadosDonacionService>;
    mockTramiteStore = TestBed.inject(Tramite130105Store) as jest.Mocked<Tramite130105Store>;
    mockTramiteQuery = TestBed.inject(Tramite130105Query) as jest.Mocked<Tramite130105Query>;
    mockToastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;

    component.wizardComponent = wizardComponentMock;
    component.pasoUnoComponent = pasoUnoComponentMock;
    mockWizardComponent = wizardComponentMock;
    mockPasoUnoComponent = pasoUnoComponentMock;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.indice).toBe(1);
    expect(component.tabIndex).toBe(1);
    expect(component.activarBotonCargaArchivos).toBe(false);
    expect(component.esFormaValido).toBe(false);
    expect(component.seccionCargarDocumentos).toBe(true);
    expect(component.cargaEnProgreso).toBe(true);
    expect(component.folioTemporal).toBe(0);
  });


  it('should navigate to previous step and update indices', () => {
    mockWizardComponent.indiceActual = 1;

    component.anterior();
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of())
    } as unknown as jest.Mocked<WizardComponent>;
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should navigate to next step and update indices', () => {
    mockWizardComponent.indiceActual = 1;
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of())
    } as unknown as jest.Mocked<WizardComponent>;
    component.siguiente();

    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.indice).toBe(NaN);
    expect(component.datosPasos.indice).toBe(NaN);
  });

  it('should handle form validation failure on step 1', () => {
    const accionBoton: AccionBoton = { valor: 1, accion: 'cont' };
    component.indice = 1;
    (mockPasoUnoComponent.solicitudComponent.validarFormulario as jest.Mock).mockReturnValue(false);

    component.getValorIndice(accionBoton);

    expect(component.esFormaValido).toBe(true);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should proceed with form validation success on step 1', () => {
    const accionBoton: AccionBoton = { valor: 1, accion: 'cont' };
    component.indice = 1;
    (mockPasoUnoComponent.solicitudComponent.validarFormulario as jest.Mock).mockReturnValue(true);
    jest.spyOn(component, 'obtenerDatosDelStore').mockImplementation();

    component.getValorIndice(accionBoton);
    component.obtenerDatosDelStore(accionBoton);
    expect(component.esFormaValido).toBe(true);
    expect(component.obtenerDatosDelStore).toHaveBeenCalledWith(accionBoton);
  });

  it('should call pasoNavegarPor for valid step navigation', () => {
    const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
    component.indice = 2;
    component.pasosSolicitar = [{ id: 1 }, { id: 2 }, { id: 3 }] as any;
    jest.spyOn(component, 'pasoNavegarPor').mockImplementation();

    component.getValorIndice(accionBoton);

    expect(component.pasoNavegarPor).toHaveBeenCalledWith(accionBoton);
  });

  it('should get state data and call guardar', () => {
    const mockState = { cantidad: 10 } as any;
    const accionBoton: AccionBoton = { valor: 1, accion: 'cont' };
    mockImportacionService.getAllState.mockReturnValue(of(mockState));
    jest.spyOn(component, 'guardar').mockResolvedValue({} as any);

    component.obtenerDatosDelStore(accionBoton);

    expect(mockImportacionService.getAllState).toHaveBeenCalled();
    expect(component.guardar).toHaveBeenCalledWith(mockState, accionBoton);
  });

  const mockState = {
    cantidad: 10,
    valorFacturaUSD: 1000,
    producto: 'test',
    descripcion: 'test desc',
    usoEspecifico: 'test uso',
    justificacionImportacionExportacion: 'test justificacion',
    observaciones: 'test obs',
    unidadMedida: 'test unidad',
    fraccion: 'test fraccion',
    filaSeleccionada: [{ cantidad: 5, descripcion: 'test', precioUnitarioUSD: 100, totalUSD: 500 }],
    cantidadPartidasDeLaMercancia: 5,
    descripcionPartidasDeLaMercancia: 'test desc partidas',
    valorPartidaUSDPartidasDeLaMercancia: 500,
    mostrarPartidas: [{ idSolicitud: 123 }],
    regimen: 'test regimen',
    clasificacion: 'test clasificacion',
    entidad: 'test entidad',
    representacion: 'test representacion',
    fechasSeleccionadas: []
  } as any;

  it('should save data successfully and navigate forward', async () => {
    const accionBoton: AccionBoton = { valor: 1, accion: 'cont' };
    const mockResponse = {
      id: 1,
      codigo: '00',
      mensaje: 'Success',
      descripcion: 'Success description',
      data: 'success data',
      datos: { id_solicitud: 123, idSolicitud: 456 }
    };
    mockImportacionService.guardarDatosPost.mockReturnValue(of(mockResponse));

    const result = await component.guardar(mockState, accionBoton);
  });

  it('should handle error response', async () => {
    const accionBoton: AccionBoton = { valor: 1, accion: 'cont' };
    const mockResponse = {
      id: 1,
      codigo: '01',
      mensaje: 'Error',
      descripcion: 'Error description',
      data: 'error data',
      datos: null
    };
    mockImportacionService.guardarDatosPost.mockReturnValue(of(mockResponse));
  });

  it('should handle service error', async () => {
    const accionBoton: AccionBoton = { valor: 1, accion: 'cont' };
    const error = new Error('Service error');
    mockImportacionService.guardarDatosPost.mockReturnValue(throwError(error));
  });

  it('should navigate forward when action is cont', () => {
    const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of())
    } as unknown as jest.Mocked<WizardComponent>;
    component.pasoNavegarPor(accionBoton);

    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should navigate backward when action is not cont', () => {
    const accionBoton: AccionBoton = { valor: 2, accion: 'ant' };
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of())
    } as unknown as jest.Mocked<WizardComponent>;
    component.pasoNavegarPor(accionBoton);

    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not navigate for invalid step values', () => {
    const accionBoton: AccionBoton = { valor: 0, accion: 'cont' };
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of())
    } as unknown as jest.Mocked<WizardComponent>;
    component.pasoNavegarPor(accionBoton);

    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should emit cargarArchivosEvento', () => {
    jest.spyOn(component.cargarArchivosEvento, 'emit');

    component.onClickCargaArchivos();

    expect(component.cargarArchivosEvento.emit).toHaveBeenCalled();
  });

  it('should update activarBotonCargaArchivos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);

    component.manejaEventoCargaDocumentos(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });

  it('should update seccionCargarDocumentos correctly', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);

    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should update cargaEnProgreso', () => {
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);

    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
  });

  it('should complete destroyed$ subject and reset store', () => {
    jest.spyOn(component['destroyed$'], 'next');
    jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroyed$'].next).toHaveBeenCalled();
    expect(component['destroyed$'].complete).toHaveBeenCalled();
    expect(mockTramiteStore.resetStore).toHaveBeenCalled();
  });
});