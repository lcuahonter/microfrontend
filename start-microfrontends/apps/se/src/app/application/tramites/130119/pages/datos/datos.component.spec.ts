import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DatosComponent } from './datos.component';
import { LoginQuery, WizardComponent, JSONResponse, AlertComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, BtnContinuarComponent } from '@libs/shared/data-access-user/src';
import { DatosDeLaSolicitudService } from '../../services/datos-de-la-solicitud/datos-de-la-solicitud.service';
import { Tramite130119Store } from '../../estados/store/tramite130119.store';
import { Tramite130119Query } from '../../estados/queries/tramite130119.query';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { AccionBoton } from '../../modelos/aviso-importacion-maquinas.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let mockLoginQuery: jest.Mocked<LoginQuery>;
  let mockDatosDeLaSolicitudService: jest.Mocked<DatosDeLaSolicitudService>;
  let mockTramite130119Store: jest.Mocked<Tramite130119Store>;
  let mockTramite130119Query: jest.Mocked<Tramite130119Query>;
  let mockToastrService: jest.Mocked<ToastrService>;
  let mockWizardComponent: jest.Mocked<WizardComponent>;
  let mockPasoUnoComponent: any;

  beforeEach(async () => {
    const loginQueryMock = {
      selectLoginState$: of({ rfc: 'TEST123456789' })
    } as jest.Mocked<LoginQuery>;
    
    const datosDeLaSolicitudServiceMock = {
      getAllState: jest.fn(()=> of()),
      guardarPayloadDatos: jest.fn(()=> of()),
      guardarDatosPost: jest.fn(()=> of())
    } as any;
    
    const tramite130119StoreMock = {
      establecerDatos: jest.fn(()=> of()),
      resetStore: jest.fn(()=> of())
    } as any;
    
    const tramite130119QueryMock = {
      selectTramite130119$: of({ id: 1, status: 'active' })
    } as any;
    
    const toastrServiceMock = {
      success: jest.fn(),
      error: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [DatosComponent,PasoUnoComponent],
      imports: [
        HttpClientTestingModule, 
        WizardComponent, 
        AlertComponent,
        NotificacionesComponent,
        PasoCargaDocumentoComponent,
        PasoFirmaComponent, 
        BtnContinuarComponent
      ],
      providers: [
        { provide: LoginQuery, useValue: loginQueryMock },
        { provide: DatosDeLaSolicitudService, useValue: datosDeLaSolicitudServiceMock },
        { provide: Tramite130119Store, useValue: tramite130119StoreMock },
        { provide: Tramite130119Query, useValue: tramite130119QueryMock },
        { provide: ToastrService, useValue: toastrServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    
    mockLoginQuery = TestBed.inject(LoginQuery) as jest.Mocked<LoginQuery>;
    mockDatosDeLaSolicitudService = TestBed.inject(DatosDeLaSolicitudService) as jest.Mocked<DatosDeLaSolicitudService>;
    mockTramite130119Store = TestBed.inject(Tramite130119Store) as jest.Mocked<Tramite130119Store>;
    mockTramite130119Query = TestBed.inject(Tramite130119Query) as jest.Mocked<Tramite130119Query>;
    mockToastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;

    mockWizardComponent = {
      siguiente: jest.fn(() => {}),
      atras: jest.fn(() => {}),
      indiceActual: 1
    } as any;
    
    mockPasoUnoComponent = {
      datosDeLaSolicitudComponent: {
        validarFormulario: jest.fn().mockReturnValue(true)
      }
    };

    component.wizardComponent = mockWizardComponent;
    component.pasoUnoComponent = mockPasoUnoComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.folioTemporal).toBe(0);
    expect(component.activarBotonCargaArchivos).toBe(false);
    expect(component.esFormaValido).toBe(false);
    expect(component.seccionCargarDocumentos).toBe(true);
    expect(component.cargaEnProgreso).toBe(true);
    expect(component.isSaltar).toBe(false);
  });

  
    it('should navigate to previous step and update indices', () => {
      mockWizardComponent.indiceActual = 2;
      
      component.anterior();
      
      expect(mockWizardComponent.atras).toHaveBeenCalled();
      expect(component.indice).toBe(3);
      expect(component.datosPasos.indice).toBe(3);
    });
 
    it('should navigate to next step and update indices', () => {
      mockWizardComponent.indiceActual = 1;
      
      component.siguiente();
      
      expect(mockWizardComponent.siguiente).toHaveBeenCalled();
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
    });

    it('should jump to step 3 and navigate forward', () => {
      component.saltar();
      
      expect(component.indice).toBe(3);
      expect(component.datosPasos.indice).toBe(3);
      expect(mockWizardComponent.siguiente).toHaveBeenCalled();
    });
  
    it('should validate form when on step 1 and action is continue', () => {
      component.indice = 1;
      const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
      jest.spyOn(component, 'obtenerDatosDelStore');
      
      component.getValorIndice(accionBoton);
      
      expect(component.datosPasos.indice).toBe(1);
      expect(mockPasoUnoComponent.datosDeLaSolicitudComponent.validarFormulario).toHaveBeenCalled();
      expect(component.obtenerDatosDelStore).toHaveBeenCalledWith(accionBoton);
    });

    it('should set esFormaValido to true when form is invalid', () => {
      component.indice = 1;
      const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
      mockPasoUnoComponent.datosDeLaSolicitudComponent.validarFormulario.mockReturnValue(false);
      
      component.getValorIndice(accionBoton);
      
      expect(component.esFormaValido).toBe(true);
    });

    it('should call pasoNavegarPor when not on step 1 or valid range', () => {
      component.indice = 2;
      const accionBoton: AccionBoton = { valor: 3, accion: 'cont' };
      jest.spyOn(component, 'pasoNavegarPor');
      
      component.getValorIndice(accionBoton);
      
      expect(component.pasoNavegarPor).toHaveBeenCalledWith(accionBoton);
    });
 
    it('should get state data and call guardar', () => {
      const mockState = { id: 1, data: 'test' } as any;
      const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
      mockDatosDeLaSolicitudService.getAllState.mockReturnValue(of(mockState));
      jest.spyOn(component, 'guardar').mockResolvedValue({} as JSONResponse);
      
      component.obtenerDatosDelStore(accionBoton);
      
      expect(mockDatosDeLaSolicitudService.getAllState).toHaveBeenCalled();
      expect(component.guardar).toHaveBeenCalledWith(mockState, accionBoton);
    });
 
    const mockItem = { id: 1, data: 'test' } as any;
    const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };

    it('should handle successful response with codigo 00', async () => {
      const mockResponse: JSONResponse = {
        codigo: '00',
        mensaje: 'Success',
        datos: { id_solicitud: 123, idSolicitud: 123 }
      } as any;
      
      mockDatosDeLaSolicitudService.guardarPayloadDatos.mockReturnValue({});
      mockDatosDeLaSolicitudService.guardarDatosPost.mockReturnValue(of(mockResponse));
      
      const result = await component.guardar(mockItem, accionBoton);
      
      expect(component.esFormaValido).toBe(false);
      expect(component.folioTemporal).toBe(123);
      expect(mockTramite130119Store.establecerDatos).toHaveBeenCalledWith({ idSolicitud: 123 });
      expect(mockToastrService.success).toHaveBeenCalledWith('Success');
      expect(result).toEqual(mockResponse);
    });

    it('should handle service error', async () => {
      const error = new Error('Service error');
      mockDatosDeLaSolicitudService.guardarPayloadDatos.mockReturnValue({});
      mockDatosDeLaSolicitudService.guardarDatosPost.mockReturnValue(throwError(error));
      
      try {
        await component.guardar(mockItem, accionBoton);
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
 
    it('should navigate forward when action is cont', () => {
      const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
      
      component.pasoNavegarPor(accionBoton);
      
      expect(component.indice).toBe(2);
      expect(mockWizardComponent.siguiente).toHaveBeenCalled();
    });

    it('should navigate backward when action is not cont', () => {
      const accionBoton: AccionBoton = { valor: 2, accion: 'ant' };
      
      component.pasoNavegarPor(accionBoton);
      
      expect(component.indice).toBe(2);
      expect(mockWizardComponent.atras).toHaveBeenCalled();
    });

    it('should not navigate when valor is out of range', () => {
      const accionBoton: AccionBoton = { valor: 10, accion: 'cont' };
      const originalIndice = component.indice;
      
      component.pasoNavegarPor(accionBoton);
      
      expect(component.indice).toBe(originalIndice);
      expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    });
  
    it('should update isSaltar property', () => {
      component.onBlancoObligatoria(true);
      expect(component.isSaltar).toBe(true);

      component.onBlancoObligatoria(false);
      expect(component.isSaltar).toBe(false);
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
 
    it('should set seccionCargarDocumentos to false when carga is true', () => {
      component.cargaRealizada(true);
      expect(component.seccionCargarDocumentos).toBe(false);
    });

    it('should set seccionCargarDocumentos to true when carga is false', () => {
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
      expect(mockTramite130119Store.resetStore).toHaveBeenCalled();
    });
  });