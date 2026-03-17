import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { of, Subject, throwError } from 'rxjs';
import { SolicitarTransferenciaCuposMainComponent } from './solicitar-transferencia-cupos-main.component';
import { Tramite120501Query } from '../../estados/queries/tramite120501.query';
import { Tramite120501Store } from '../../estados/tramites/tramite120501.store';
import { LicitacionesDisponiblesService } from '../../services/licitaciones-disponibles.service';
import { AlertComponent, BtnContinuarComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { PasoSolicitanteComponent } from '../paso-solicitante/paso-solicitante.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SolicitarTransferenciaCuposMainComponent', () => {
  let component: SolicitarTransferenciaCuposMainComponent;
  let fixture: ComponentFixture<SolicitarTransferenciaCuposMainComponent>;
  let mockTramiteQuery: jest.Mocked<Tramite120501Query>;
  let mockTramiteStore: jest.Mocked<Tramite120501Store>;
  let mockToastrService: jest.Mocked<ToastrService>;
  let mockLicitacionesService: jest.Mocked<LicitacionesDisponiblesService>;
  let mockWizardComponent: jest.Mocked<WizardComponent>;
  let mockPasoSolicitanteComponent: any;

  const mockSolicitudState = {
    idMecanismo: 1,
    idSolicitud: 123,
    rfc: 'TEST123456789',
    entidadFederativa: 'CDMX',
    representacionFederal: 'REP01',
    montoRecibir: 1000,
    idAsignacion: 123,
    licitacionesDatos: {
      licitacionPublica: {
        idLicitacion: 1
      },
      fraccionArancelaria: 'FA123456',
      maximoTransferir: 500,
      montoTransferir: 300
    }
  } as any;

  beforeEach(async () => {
    mockTramiteQuery = {
      selectSolicitud$: of(mockSolicitudState)
    } as jest.Mocked<Tramite120501Query>;
    
    mockTramiteStore = {
      actualizarEstado: jest.fn()
    } as any;
    
    mockToastrService = {
      success: jest.fn(),
      error: jest.fn()
    } as any;
    
    mockLicitacionesService = {
      getAllState: jest.fn(() => of(mockSolicitudState)),
      getGuardarPayload: jest.fn(() => ({ test: 'payload' })),
      guardarDatosPost: jest.fn(() => of({ 
        id: 1, 
        descripcion: 'Success', 
        codigo: '00', 
        data: JSON.stringify({ id_solicitud: 12345 }), 
        mensaje: 'Success' 
      }))
    } as any;
    
    mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      indiceActual: 0
    } as any;

    mockPasoSolicitanteComponent = {
      LicitacionesVigentesComponent: {
        validarFormulario: jest.fn().mockReturnValue(true)
      }
    };

    await TestBed.configureTestingModule({
      declarations: [SolicitarTransferenciaCuposMainComponent,PasoSolicitanteComponent],
      imports: [HttpClientTestingModule, 
        WizardComponent, 
        SolicitanteComponent,
        BtnContinuarComponent,
        PasoCargaDocumentoComponent,
        PasoFirmaComponent,
        AlertComponent,
        ],
      providers: [
        { provide: Tramite120501Query, useValue: mockTramiteQuery },
        { provide: Tramite120501Store, useValue: mockTramiteStore },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: LicitacionesDisponiblesService, useValue: mockLicitacionesService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitarTransferenciaCuposMainComponent);
    component = fixture.componentInstance;
    component.wizardComponent = mockWizardComponent;
    component.pasoUnoComponent = mockPasoSolicitanteComponent;
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete (global as any).doDeepCopy;
    delete (global as any).esValidObject;
    delete (global as any).getValidDatos;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.esFormaValido).toBe(false);
    expect(component.idMecanismo).toBe(1); // Should match mockSolicitudState.idMecanismo
    expect(component.activarBotonCargaArchivos).toBe(false);
    expect(component.seccionCargarDocumentos).toBe(true);
    expect(component.cargaEnProgreso).toBe(true);
    expect(component.folioTemporal).toBe(0);
  });

  it('should subscribe to solicitud state on init', () => {
    component.ngOnInit();
    expect(component.solicitudState).toEqual(mockSolicitudState);
  });

  it('should handle getValorIndice with valid form on step 1', () => {
    const obtenerDatosSpy = jest.spyOn(component, 'obtenerDatosDelStore');
    const accionBoton = { accion: 'cont', valor: 2 };
    component.indice = 1;
    
    component.getValorIndice(accionBoton);
    
    expect(component.esFormaValido).toBe(false);
    expect(obtenerDatosSpy).toHaveBeenCalledWith(accionBoton);
  });

  it('should handle getValorIndice with invalid form on step 1', () => {
    mockPasoSolicitanteComponent.LicitacionesVigentesComponent.validarFormulario.mockReturnValue(false);
    const accionBoton = { accion: 'cont', valor: 2 };
    component.indice = 1;
    
    component.getValorIndice(accionBoton);
    
    expect(component.esFormaValido).toBe(true);
  });

  it('should navigate using pasoNavegarPor', () => {
    const pasoNavegarSpy = jest.spyOn(component, 'pasoNavegarPor');
    const accionBoton = { accion: 'cont', valor: 3 };
    component.indice = 2;
    
    component.getValorIndice(accionBoton);
    
    expect(pasoNavegarSpy).toHaveBeenCalledWith(accionBoton);
  });

  it('should call siguiente on wizard when action is cont', () => {
    const accionBoton = { accion: 'cont', valor: 2 };
    
    component.pasoNavegarPor(accionBoton);
    
    expect(component.indice).toBe(2);
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should call atras on wizard when action is not cont', () => {
    const accionBoton = { accion: 'ant', valor: 2 };
    
    component.pasoNavegarPor(accionBoton);
    
    expect(component.indice).toBe(2);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

  it('should get data from store and call guardar', () => {
    const mockData = { test: 'data' } as any;
    const accionBoton = { accion: 'cont', valor: 2 };
    mockLicitacionesService.getAllState.mockReturnValue(of(mockData));
    const guardarSpy = jest.spyOn(component, 'guardar');
    
    component.obtenerDatosDelStore(accionBoton);
    
    expect(mockLicitacionesService.getAllState).toHaveBeenCalled();
    expect(guardarSpy).toHaveBeenCalledWith(mockData, accionBoton);
  });

  it('should handle successful guardar response', async () => {
    const mockResponse = {
      id: 1,
      descripcion: 'Success response',
      codigo: '00',
      data: JSON.stringify({ id_solicitud: 12345 }),
      mensaje: 'Success'
    } as any;
    const mockPayload = { test: 'payload' };
    const accionBoton = { accion: 'cont', valor: 2 };
    
    mockLicitacionesService.getGuardarPayload.mockReturnValue(mockPayload);
    mockLicitacionesService.guardarDatosPost.mockReturnValue(of(mockResponse));
    
    const result = await component.guardar(mockSolicitudState, accionBoton);
    
    expect(mockLicitacionesService.getGuardarPayload).toHaveBeenCalledWith(mockSolicitudState);
    expect(mockLicitacionesService.guardarDatosPost).toHaveBeenCalledWith(mockPayload);
    expect(mockToastrService.success).toHaveBeenCalledWith('Success');
    expect(result).toEqual(mockResponse);
  });

  it('should handle error response in guardar', async () => {
    const mockResponse = {
      codigo: '01',
      mensaje: 'Error'
    } as any;
    const accionBoton = { accion: 'cont', valor: 2 };
    
    mockLicitacionesService.getGuardarPayload.mockReturnValue({});
    mockLicitacionesService.guardarDatosPost.mockReturnValue(of(mockResponse));
    
    await component.guardar(mockSolicitudState, accionBoton);
    
    expect(mockToastrService.error).toHaveBeenCalledWith('Error');
  });

  it('should navigate to previous step', () => {
    component.wizardComponent = { ...mockWizardComponent, indiceActual: 1 } as any;
    component.anterior();
    
    expect(mockWizardComponent.atras).toHaveBeenCalled();
    expect(component.indice).toBe(2); // indiceActual + 1
    expect(component.datosPasos.indice).toBe(2);
  });

  it('should navigate to next step', () => {
    component.wizardComponent = { ...mockWizardComponent, indiceActual: 1 } as any;
    component.siguiente();
    
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
    expect(component.indice).toBe(2); // indiceActual + 1
    expect(component.datosPasos.indice).toBe(2);
  });

  it('should emit cargar archivos event', () => {
    const emitSpy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    
    component.onClickCargaArchivos();
    
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should update activarBotonCargaArchivos', () => {
    component.manejaEventoCargaDocumentos(true);
    
    expect(component.activarBotonCargaArchivos).toBe(true);
  });

  it('should update seccionCargarDocumentos on carga realizada', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should update cargaEnProgreso', () => {
    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
  });

  it('should complete destroy notifier on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should handle guardar with error response', async () => {
    const errorResponse = {
      id: 1,
      descripcion: 'Error response',
      codigo: '01',
      data: '',
      mensaje: 'Error occurred'
    };
    mockLicitacionesService.guardarDatosPost.mockReturnValue(of(errorResponse));
    const accionBoton = { accion: 'cont', valor: 2 };
    
    await component.guardar(mockSolicitudState, accionBoton);
    
    expect(mockToastrService.error).toHaveBeenCalledWith('Error occurred');
  });

  it('should handle guardar with error in subscription', async () => {
    const error = new Error('Network error');
    mockLicitacionesService.guardarDatosPost.mockReturnValue(throwError(() => error));
    const accionBoton = { accion: 'cont', valor: 2 };
    
    try {
      await component.guardar(mockSolicitudState, accionBoton);
    } catch (e) {
      expect(e).toBe(error);
    }
  });

  it('should handle getValorIndice with valor out of range', () => {
    const accionBoton = { accion: 'cont', valor: 6 };
    const pasoNavegarSpy = jest.spyOn(component, 'pasoNavegarPor');
    
    component.getValorIndice(accionBoton);
    
    expect(pasoNavegarSpy).not.toHaveBeenCalled();
  });

  it('should handle pasoNavegarPor with valor out of range', () => {
    const accionBoton = { accion: 'cont', valor: 5 };
    
    component.pasoNavegarPor(accionBoton);
    
    expect(component.indice).toBe(1); // Should not change
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should update folioTemporal when guardar succeeds with valid response', async () => {
    const mockResponse = {
      id: 1,
      descripcion: 'Success response',
      codigo: '00',
      data: JSON.stringify({ id_solicitud: 98765 }),
      mensaje: 'Success'
    };
    mockLicitacionesService.guardarDatosPost.mockReturnValue(of(mockResponse));
    const accionBoton = { accion: 'cont', valor: 2 };
    
    // Mock the global functions used in the component
    (global as any).doDeepCopy = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
    (global as any).esValidObject = jest.fn(() => true);
    (global as any).getValidDatos = jest.fn(() => true);
    
    const responseCopy = {
      ...mockResponse,
      datos: { id_solicitud: 98765 }
    };
    (global as any).doDeepCopy.mockReturnValue(responseCopy);
    
    await component.guardar(mockSolicitudState, accionBoton);
    
    expect(component.folioTemporal).toBe(98765);
    expect(mockTramiteStore.actualizarEstado).toHaveBeenCalledWith({ idSolicitud: 98765 });
  });

  it('should set idSolicitud to 0 when datos.id_solicitud is invalid', async () => {
    const mockResponse = {
      id: 1,
      descripcion: 'Success response',
      codigo: '00',
      data: JSON.stringify({ id_solicitud: null }),
      mensaje: 'Success'
    };
    mockLicitacionesService.guardarDatosPost.mockReturnValue(of(mockResponse));
    const accionBoton = { accion: 'cont', valor: 2 };
    
    // Mock the global functions
    (global as any).doDeepCopy = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
    (global as any).esValidObject = jest.fn(() => true);
    (global as any).getValidDatos = jest.fn(() => false); // Invalid data
    
    const responseCopy = {
      ...mockResponse,
      datos: { id_solicitud: null }
    };
    (global as any).doDeepCopy.mockReturnValue(responseCopy);
    
    await component.guardar(mockSolicitudState, accionBoton);
    
    expect(mockTramiteStore.actualizarEstado).toHaveBeenCalledWith({ idSolicitud: 0 });
  });

  it('should handle guardar with idSolicitud instead of id_solicitud', async () => {
    const mockResponse = {
      id: 1,
      descripcion: 'Success response',
      codigo: '00',
      data: JSON.stringify({ idSolicitud: 54321 }),
      mensaje: 'Success'
    };
    mockLicitacionesService.guardarDatosPost.mockReturnValue(of(mockResponse));
    const accionBoton = { accion: 'cont', valor: 2 };
    
    // Mock the global functions
    (global as any).doDeepCopy = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
    (global as any).esValidObject = jest.fn(() => true);
    (global as any).getValidDatos = jest.fn(() => false); // Force to use idSolicitud fallback
    
    const responseCopy = {
      ...mockResponse,
      datos: { idSolicitud: 54321 }
    };
    (global as any).doDeepCopy.mockReturnValue(responseCopy);
    
    await component.guardar(mockSolicitudState, accionBoton);
    
    expect(component.folioTemporal).toBe(54321);
  });

  it('should handle guardar with ant action', async () => {
    const mockResponse = {
      id: 1,
      descripcion: 'Success response',
      codigo: '00',
      data: JSON.stringify({ id_solicitud: 12345 }),
      mensaje: 'Success'
    };
    mockLicitacionesService.guardarDatosPost.mockReturnValue(of(mockResponse));
    const accionBoton = { accion: 'ant', valor: 2 };
    
    // Mock the global functions
    (global as any).doDeepCopy = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
    (global as any).esValidObject = jest.fn(() => true);
    (global as any).getValidDatos = jest.fn(() => true);
    
    const responseCopy = {
      ...mockResponse,
      datos: { id_solicitud: 12345 }
    };
    (global as any).doDeepCopy.mockReturnValue(responseCopy);
    
    await component.guardar(mockSolicitudState, accionBoton);
    
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

  it('should set alertaNotificacion when moving to next step successfully', async () => {
    const mockResponse = {
      id: 1,
      descripcion: 'Success response',
      codigo: '00',
      data: JSON.stringify({ id_solicitud: 12345 }),
      mensaje: 'Success'
    };
    mockLicitacionesService.guardarDatosPost.mockReturnValue(of(mockResponse));
    const accionBoton = { accion: 'cont', valor: 2 };
    
    // Mock the global functions
    (global as any).doDeepCopy = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
    (global as any).esValidObject = jest.fn(() => true);
    (global as any).getValidDatos = jest.fn(() => true);
    
    const responseCopy = {
      ...mockResponse,
      datos: { id_solicitud: 12345 }
    };
    (global as any).doDeepCopy.mockReturnValue(responseCopy);
    
    await component.guardar(mockSolicitudState, accionBoton);
    
    expect(component.alertaNotificacion).toBeDefined();
    expect(component.alertaNotificacion.tipoNotificacion).toBe('banner');
    expect(component.alertaNotificacion.categoria).toBe('success');
  });

  it('should initialize pasosSolicitar from PASOS constant', () => {
    expect(component.pasosSolicitar).toBeDefined();
    expect(Array.isArray(component.pasosSolicitar)).toBe(true);
  });

  it('should initialize datosPasos with correct values', () => {
    expect(component.datosPasos).toBeDefined();
    expect(component.datosPasos.nroPasos).toBe(component.pasosSolicitar.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should handle subscription in constructor', () => {
    expect(component.solicitudState).toEqual(mockSolicitudState);
    expect(component.idMecanismo).toBe(1);
  });

  it('should handle subscription in ngOnInit', () => {
    component.ngOnInit();
    expect(component.solicitudState).toEqual(mockSolicitudState);
  });

  it('should emit event with correct parameters', () => {
    const emitSpy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(emitSpy).toHaveBeenCalledWith();
  });

  it('should handle texto property', () => {
    expect(component.texto).toBeDefined();
    expect(typeof component.texto).toBe('string');
    expect(component.texto.length).toBeGreaterThan(0);
  });

  it('should handle LOGIN property', () => {
    expect(component.LOGIN).toBe('');
  });

  it('should handle formErrorAlert property', () => {
    expect(component.formErrorAlert).toBeDefined();
  });
});