import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DiamanteBrutoComponent } from './diamante-bruto.component';
import { DiamanteBrutoService } from '../../services/diamante-bruto.service';
import { Tramite130114Store } from '../../../../estados/tramites/tramite130114.store';
import { Tramite130114Query } from '../../../../estados/queries/tramite130114.query';
import { AlertComponent, BtnContinuarComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { AccionBoton } from '../../enums/diamante.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DiamanteBrutoComponent', () => {
  let component: DiamanteBrutoComponent;
  let fixture: ComponentFixture<DiamanteBrutoComponent>;
  let mockDiamanteBrutoService: jest.Mocked<DiamanteBrutoService>;
  let mockTramite130114Store: jest.Mocked<Tramite130114Store>;
  let mockTramite130114Query: jest.Mocked<Tramite130114Query>;
  let mockToastrService: jest.Mocked<ToastrService>;
  let mockWizardComponent: jest.Mocked<WizardComponent>;
  let mockPasoUnoComponent: jest.Mocked<PasoUnoComponent>;

  beforeEach(async () => {
    const diamanteBrutoServiceSpy = {
      getAllState: jest.fn(()=> of()),
      getPayloadDatos: jest.fn(()=> of()),
      guardarDatosPost: jest.fn(()=> of()),
      guardarPayloadDatos: jest.fn(()=> of())
    } as any;

    const tramite130114StoreSpy = {
      actualizarEstado: jest.fn(()=> of()),
      resetStore: jest.fn(()=> of())
    } as any;

    const tramite130114QuerySpy = {
      selectSolicitud$: of({ idSolicitud: 123 })
    } as any;

    const toastrServiceSpy = {
      success: jest.fn(()=> of()),
      error: jest.fn(()=> of())
    } as any;

    const wizardComponentSpy = {
      atras: jest.fn(()=> of()),
      siguiente: jest.fn(()=> of()),
      indiceActual: 0
    } as any;

    const pasoUnoComponentSpy = {
      solicitudComponent: {
        validarFormulario: jest.fn().mockReturnValue(true)
      }
    } as any;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PasoFirmaComponent, PasoCargaDocumentoComponent, BtnContinuarComponent, WizardComponent, AlertComponent,NotificacionesComponent],
      declarations: [DiamanteBrutoComponent, PasoUnoComponent],
      providers: [
        { provide: DiamanteBrutoService, useValue: diamanteBrutoServiceSpy },
        { provide: Tramite130114Store, useValue: tramite130114StoreSpy },
        { provide: Tramite130114Query, useValue: tramite130114QuerySpy },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DiamanteBrutoComponent);
    component = fixture.componentInstance;
    mockDiamanteBrutoService = TestBed.inject(DiamanteBrutoService) as jest.Mocked<DiamanteBrutoService>;
    mockTramite130114Store = TestBed.inject(Tramite130114Store) as jest.Mocked<Tramite130114Store>;
    mockTramite130114Query = TestBed.inject(Tramite130114Query) as jest.Mocked<Tramite130114Query>;
    mockToastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;
    
    component.wizardComponent = wizardComponentSpy;
    component.pasoUnoComponent = pasoUnoComponentSpy;
    mockWizardComponent = wizardComponentSpy;
    mockPasoUnoComponent = pasoUnoComponentSpy;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
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

      expect(mockWizardComponent.atras).toHaveBeenCalled();
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
    });
  
    it('should navigate to next step and update indices', () => {
      mockWizardComponent.indiceActual = 1;
      component.siguiente();

      expect(mockWizardComponent.siguiente).toHaveBeenCalled();
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
    });
 
    it('should validate form and proceed when indice is 1 and action is cont', () => {
      component.indice = 1;
      const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
      const obtenerDatosDelStoreSpy = jest.spyOn(component, 'obtenerDatosDelStore').mockImplementation();

      component.getValorIndice(accionBoton);

      expect(component.esFormaValido).toBe(false);
      expect(component.datosPasos.indice).toBe(1);
      expect(obtenerDatosDelStoreSpy).toHaveBeenCalledWith(accionBoton);
    });

    it('should set esFormaValido to true when form validation fails', () => {
      component.indice = 1;
      const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
  
      component.getValorIndice(accionBoton);

      expect(component.esFormaValido).toBe(false);
    });

    it('should call pasoNavegarPor when conditions are met', () => {
      component.indice = 2;
      const accionBoton: AccionBoton = { valor: 3, accion: 'cont' };
      const pasoNavegarPorSpy = jest.spyOn(component, 'pasoNavegarPor').mockImplementation();

      component.getValorIndice(accionBoton);

      expect(pasoNavegarPorSpy).toHaveBeenCalledWith(accionBoton);
    });
  
    it('should get state data and call guardar', () => {
      const mockState = { cantidad: '100' } as any;
      const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
      mockDiamanteBrutoService.getAllState.mockReturnValue(of(mockState));
      const guardarSpy = jest.spyOn(component, 'guardar').mockResolvedValue({} as any);

      component.obtenerDatosDelStore(accionBoton);

      expect(mockDiamanteBrutoService.getAllState).toHaveBeenCalled();
      expect(guardarSpy).toHaveBeenCalledWith(mockState, accionBoton);
    });
 
    it('should save data successfully and navigate', async () => {
      const mockItem = { 
        cantidad: '100', 
        valorFacturaUSD: '500',
        defaultSelect: 'test',
        producto: 'test',
        descripcion: 'test',
        usoEspecifico: 'test',
        justificacionImportacionExportacion: 'test',
        observaciones: 'test',
        unidadMedida: 'test',
        fraccion: 'test',
        regimen: 'test',
        clasificacion: 'test',
        entidad: 'test',
        representacion: 'test',
        fechasSeleccionadas: []
      } as any;
      const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
      const mockResponse = { 
        codigo: '00', 
        mensaje: 'Success',
        datos: { id_solicitud: 123, idSolicitud: 123 }
      } as any;
      
      component.solicitudState = { idSolicitud: 0 } as any;
      mockDiamanteBrutoService.getPayloadDatos.mockReturnValue([]);
      mockDiamanteBrutoService.guardarDatosPost.mockReturnValue(of(mockResponse));

      const result = await component.guardar(mockItem, accionBoton);

      expect(mockDiamanteBrutoService.guardarDatosPost).toHaveBeenCalled();
      expect(mockToastrService.success).toHaveBeenCalledWith('Success');
      expect(result).toEqual(mockResponse);
    });

    it('should handle error response with code 3', async () => {
      const mockItem = { cantidad: '100' } as any;
      const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
      const mockResponse = { 
        codigo: '3', 
        mensaje: 'Error',
        error: 'Validation error'
      };
      
      mockDiamanteBrutoService.getPayloadDatos.mockReturnValue([]);
      mockDiamanteBrutoService.guardarDatosPost.mockReturnValue(of(mockResponse as any));

      expect(component.esFormaValido).toBe(false);
    });

    it('should handle service error', async () => {
      const mockItem = { cantidad: '100' } as any;
      const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
      const error = new Error('Service error');
      
      mockDiamanteBrutoService.getPayloadDatos.mockReturnValue([]);
      mockDiamanteBrutoService.guardarDatosPost.mockReturnValue(throwError(error));

      await expect(component.guardar(mockItem, accionBoton)).rejects.toBe(error);
    });
 
    it('should navigate forward when action is cont', () => {
      const accionBoton: AccionBoton = { valor: 3, accion: 'cont' };

      component.pasoNavegarPor(accionBoton);

      expect(component.indice).toBe(3);
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
      const initialIndex = component.indice;

      component.pasoNavegarPor(accionBoton);

      expect(component.indice).toBe(initialIndex);
      expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    });
 
    it('should emit cargarArchivosEvento', () => {
      const emitSpy = jest.spyOn(component.cargarArchivosEvento, 'emit');

      component.onClickCargaArchivos();

      expect(emitSpy).toHaveBeenCalled();
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
      component.onCargaEnProgreso(false);
      expect(component.cargaEnProgreso).toBe(false);

      component.onCargaEnProgreso(true);
      expect(component.cargaEnProgreso).toBe(true);
    });
 
    it('should cleanup resources and reset store', () => {
      const nextSpy = jest.spyOn(component['destroyed$'], 'next');
      const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
      expect(mockTramite130114Store.resetStore).toHaveBeenCalled();
    });
  });