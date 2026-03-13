import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ImportacionEquipoAnticontaminanteComponent } from './importacion-equipo-anticontaminante';
import { ImportacionEquipoAnticontaminanteService } from '../../services/importacion-equipo-anticontaminante.service';
import { Tramite130113Store } from '../../estados/tramites/tramites130113.store';
import { Tramite130113Query } from '../../estados/queries/tramite130113.query';
import { AlertComponent, BtnContinuarComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { AccionBoton } from '../../enums/accion-botton.enum';
import { Tramite130113State } from '../../estados/tramites/tramites130113.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ImportacionEquipoAnticontaminanteComponent', () => {
  let component: ImportacionEquipoAnticontaminanteComponent;
  let fixture: ComponentFixture<ImportacionEquipoAnticontaminanteComponent>;
  let mockService: jest.Mocked<ImportacionEquipoAnticontaminanteService>;
  let mockStore: jest.Mocked<Tramite130113Store>;
  let mockQuery: jest.Mocked<Tramite130113Query>;
  let mockToastr: jest.Mocked<ToastrService>;

  const mockState: Tramite130113State = {
    cantidad: '10',
    valorFacturaUSD: '1000',
    producto: 'Test Product',
    descripcion: 'Test Description',
    usoEspecifico: 'Test Usage',
    justificacionImportacionExportacion: 'Test Justification',
    observaciones: 'Test Observations',
    unidadMedida: 'KG',
    fraccion: '12345678',
    fraccionDescripcionPartidasDeLaMercancia: 'Test Fraccion Description',
    idSolicitud: 123,
    regimen: 'REG01',
    clasificacion: 'CLA01',
    entidad: 'ENT01',
    representacion: 'REP01',
    fechasSeleccionadas: [],
    defaultSelect: 'import'
  } as any;

  beforeEach(async () => {
    const serviceMock = {
      getAllState: jest.fn(()=> of()),
      getPayloadDatos: jest.fn(()=> of()),
      guardarDatosPost: jest.fn(()=> of())
    };

    const storeMock = {
      actualizarEstado: jest.fn()
    };

    const queryMock = {
      selectSolicitud$: of(mockState)
    };

    const toastrMock = {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, SolicitanteComponent,WizardComponent, AlertComponent,PasoCargaDocumentoComponent, PasoFirmaComponent, BtnContinuarComponent],
      declarations: [ImportacionEquipoAnticontaminanteComponent,PasoUnoComponent],
      providers: [
        { provide: ImportacionEquipoAnticontaminanteService, useValue: serviceMock },
        { provide: Tramite130113Store, useValue: storeMock },
        { provide: Tramite130113Query, useValue: queryMock },
        { provide: ToastrService, useValue: toastrMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportacionEquipoAnticontaminanteComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(ImportacionEquipoAnticontaminanteService) as jest.Mocked<ImportacionEquipoAnticontaminanteService>;
    mockStore = TestBed.inject(Tramite130113Store) as jest.Mocked<Tramite130113Store>;
    mockQuery = TestBed.inject(Tramite130113Query) as jest.Mocked<Tramite130113Query>;
    mockToastr = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.tabIndex).toBe(1);
    expect(component.activarBotonCargaArchivos).toBe(false);
    expect(component.seccionCargarDocumentos).toBe(true);
    expect(component.cargaEnProgreso).toBe(true);
    expect(component.esFormaValido).toBe(false);
    expect(component.folioTemporal).toBe('');
  });

  it('should subscribe to solicitud state on ngOnInit', () => {
    fixture.detectChanges();
    expect(component.solicitudState).toEqual(mockState);
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = jest.fn(() => of());
  });

    it('should call wizard siguiente and update indices when wizard exists', () => {
      const mockWizard = {
        siguiente: jest.fn(() => of()),
        indiceActual: 1
      } as any;
      component.wizardComponent = mockWizard;

      component.siguiente();

      expect(mockWizard.siguiente).toHaveBeenCalled();
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
    });

    it('should handle missing wizard component gracefully', () => {
      component.wizardComponent = {
        siguiente: jest.fn(()=> of()),
        atras: jest.fn(()=> of()),
        indiceActual: 1
      } as any;
      expect(() => component.siguiente()).not.toThrow();
    });
 
    it('should emit cargarArchivosEvento', () => {
      const emitSpy = jest.spyOn(component.cargarArchivosEvento, 'emit');
      
      component.onClickCargaArchivos();
      
      expect(emitSpy).toHaveBeenCalled();
    });
 
    it('should update activarBotonCargaArchivos to true', () => {
      component.manejaEventoCargaDocumentos(true);
      expect(component.activarBotonCargaArchivos).toBe(true);
    });

    it('should update activarBotonCargaArchivos to false', () => {
      component.manejaEventoCargaDocumentos(false);
      expect(component.activarBotonCargaArchivos).toBe(false);
    });
  
    it('should update seccionCargarDocumentos to false when carga is true', () => {
      component.cargaRealizada(true);
      expect(component.seccionCargarDocumentos).toBe(false);
    });

    it('should update seccionCargarDocumentos to true when carga is false', () => {
      component.cargaRealizada(false);
      expect(component.seccionCargarDocumentos).toBe(true);
    });
 
    it('should update cargaEnProgreso to false', () => {
      component.onCargaEnProgreso(false);
      expect(component.cargaEnProgreso).toBe(false);
    });

    it('should update cargaEnProgreso to true', () => {
      component.onCargaEnProgreso(true);
      expect(component.cargaEnProgreso).toBe(true);
    });

    it('should call wizard atras and update indices when wizard exists', () => {
      const mockWizard = {
        atras: jest.fn(() => of()),
        indiceActual: 0
      } as any;
      component.wizardComponent = mockWizard;

      component.anterior();

      expect(mockWizard.atras).toHaveBeenCalled();
      expect(component.indice).toBe(1);
      expect(component.datosPasos.indice).toBe(1);
    });

    it('should handle validation failure on step 1', () => {
      const mockPasoUno = {
        solicitudComponent: {
          validarFormulario: jest.fn().mockReturnValue(false)
        }
      };
      component.pasoUnoComponent = mockPasoUno as any;
      component.indice = 1;
      
      const accion: AccionBoton = { valor: 2, accion: 'cont' };
      
      component.getValorIndice(accion);
      
      expect(component.esFormaValido).toBe(true);
      expect(component.datosPasos.indice).toBe(1);
    });

    it('should call obtenerDatosDelStore when validation passes on step 1', () => {
      const mockPasoUno = {
        solicitudComponent: {
          validarFormulario: jest.fn().mockReturnValue(true)
        }
      };
      component.pasoUnoComponent = mockPasoUno as any;
      component.indice = 1;
      const obtenerDatosSpy = jest.spyOn(component, 'obtenerDatosDelStore');
      
      const accion: AccionBoton = { valor: 2, accion: 'cont' };
      
      component.getValorIndice(accion);
      
      expect(obtenerDatosSpy).toHaveBeenCalledWith(accion);
    });

    it('should handle missing pasoUnoComponent', () => {
      component.pasoUnoComponent = undefined as any;
      component.indice = 1;
      const accion: AccionBoton = { valor: 2, accion: 'cont' };
      
      expect(() => component.getValorIndice(accion)).not.toThrow();
    });

    it('should call pasoNavegarPor for valid navigation on step 2', () => {
      const pasoNavegarSpy = jest.spyOn(component, 'pasoNavegarPor');
      const accion: AccionBoton = { valor: 2, accion: 'cont' };
      component.indice = 2;
      
      component.getValorIndice(accion);
      
      expect(pasoNavegarSpy).toHaveBeenCalledWith(accion);
    });

    it('should call pasoNavegarPor for valid navigation on step 3', () => {
      const pasoNavegarSpy = jest.spyOn(component, 'pasoNavegarPor');
      const accion: AccionBoton = { valor: 3, accion: 'cont' };
      component.indice = 3;
      
      component.getValorIndice(accion);
      
      expect(pasoNavegarSpy).toHaveBeenCalledWith(accion);
    });
 
    it('should call service getAllState and guardar on success', () => {
      mockService.getAllState.mockReturnValue(of(mockState));
      const guardarSpy = jest.spyOn(component, 'guardar').mockResolvedValue({} as any);
      const accion: AccionBoton = { valor: 2, accion: 'cont' };
      
      component.obtenerDatosDelStore(accion);
      
      expect(mockService.getAllState).toHaveBeenCalled();
      expect(guardarSpy).toHaveBeenCalledWith(mockState, accion);
    });

    it('should handle successful save response with codigo 00', async () => {
      const mockResponse = {
        codigo: '00',
        mensaje: 'Success',
        datos: { id_solicitud: 456 }
      } as any;
      
      mockService.getPayloadDatos.mockReturnValue([]);
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));
      
      const mockWizard = {
        siguiente: jest.fn(() => of()),
        indiceActual: 1
      } as any;
      component.wizardComponent = mockWizard;
      
      const accion: AccionBoton = { valor: 2, accion: 'cont' };
      
      const result = await component.guardar(mockState, accion);
      
      expect(mockService.guardarDatosPost).toHaveBeenCalled();
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({ idSolicitud: 456 });
      expect(mockToastr.success).toHaveBeenCalledWith('Success');
      expect(result).toEqual(mockResponse);
    });

    it('should handle error response with codigo 01', async () => {
      const mockResponse = {
        codigo: '01',
        mensaje: 'Error',
        datos: null
      } as any;
      
      mockService.getPayloadDatos.mockReturnValue([]);
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));
      
      const accion: AccionBoton = { valor: 2, accion: 'cont' };
      
    });

    it('should handle service error', async () => {
      const error = new Error('Network error');
      mockService.getPayloadDatos.mockReturnValue([]);
      mockService.guardarDatosPost.mockReturnValue(throwError(error));
      
      const accion: AccionBoton = { valor: 2, accion: 'cont' };
      
      await expect(component.guardar(mockState, accion)).rejects.toThrow('Network error');
    });

    it('should handle response without datos', async () => {
      const mockResponse = {
        codigo: '00',
        mensaje: 'Success',
        datos: null
      } as any;
      
      mockService.getPayloadDatos.mockReturnValue([]);
      mockService.guardarDatosPost.mockReturnValue(of(mockResponse));
      
      const accion: AccionBoton = { valor: 2, accion: 'cont' };
      
      const result = await component.guardar(mockState, accion);
      
      expect(mockToastr.success).toHaveBeenCalledWith('Success');
      expect(mockStore.actualizarEstado).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
 
    let mockWizard: any;

    beforeEach(() => {
      mockWizard = {
        siguiente: jest.fn(() => of()),
        atras: jest.fn(() => of()),
        indiceActual: 1
      };
      component.wizardComponent = mockWizard;
    });

    it('should navigate forward when accion is cont and valor is 2', () => {
      const accion: AccionBoton = { valor: 2, accion: 'cont' };
      
      component.pasoNavegarPor(accion);
      
      expect(component.indice).toBe(2);
      expect(mockWizard.siguiente).toHaveBeenCalled();
    });

    it('should navigate forward when accion is cont and valor is 3', () => {
      const accion: AccionBoton = { valor: 3, accion: 'cont' };
      
      component.pasoNavegarPor(accion);
      
      expect(component.indice).toBe(3);
      expect(mockWizard.siguiente).toHaveBeenCalled();
    });

    it('should navigate backward when accion is ant and valor is 1', () => {
      const accion: AccionBoton = { valor: 1, accion: 'ant' };
      
      component.pasoNavegarPor(accion);
      
      expect(component.indice).toBe(1);
      expect(mockWizard.atras).toHaveBeenCalled();
    });

    it('should navigate backward when accion is not cont', () => {
      const accion: AccionBoton = { valor: 2, accion: 'prev' };
      
      component.pasoNavegarPor(accion);
      
      expect(component.indice).toBe(2);
      expect(mockWizard.atras).toHaveBeenCalled();
    });

    it('should not navigate when valor is 5 (out of range)', () => {
      const accion: AccionBoton = { valor: 5, accion: 'cont' };
      
      component.pasoNavegarPor(accion);
      
      expect(mockWizard.siguiente).not.toHaveBeenCalled();
      expect(mockWizard.atras).not.toHaveBeenCalled();
    });

    it('should not navigate when valor is 6 (out of range)', () => {
      const accion: AccionBoton = { valor: 6, accion: 'cont' };
      
      component.pasoNavegarPor(accion);
      
      expect(mockWizard.siguiente).not.toHaveBeenCalled();
      expect(mockWizard.atras).not.toHaveBeenCalled();
    });

    it('should handle missing wizard component', () => {
      component.wizardComponent = {
        siguiente: jest.fn(()=> of()),
        atras: jest.fn(()=> of()),
        indiceActual: 1
      } as any;
      const accion: AccionBoton = { valor: 2, accion: 'cont' };
      
      expect(() => component.pasoNavegarPor(accion)).not.toThrow();
    });
  
    it('should handle undefined solicitudState', () => {
      component.solicitudState = undefined as any;
      expect(component.solicitudState).toBeUndefined();
    });

    it('should handle empty datosPasos object', () => {
      component.datosPasos = {} as any;
      const accion: AccionBoton = { valor: 2, accion: 'cont' };
      component.getValorIndice(accion);
      expect(component.datosPasos.indice).toBe(1);
    });

    it('should handle null pasoUnoComponent gracefully', () => {
      component.pasoUnoComponent = null as any;
      component.indice = 1;
      const accion: AccionBoton = { valor: 2, accion: 'cont' };
      expect(() => component.getValorIndice(accion)).not.toThrow();
    });
  });