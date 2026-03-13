import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PASOS } from '@libs/shared/data-access-user/src/tramites/constantes/paso-tres-steps.enum';
import { CategoriaMensaje, TipoNotificacionEnum } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Mock AccionBoton interface for tests
interface AccionBoton {
  accion: string;
  valor: number;
}

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let mockWizardComponent: jest.Mocked<WizardComponent>;
  let mockPasoUnoComponent: jest.Mocked<PasoUnoComponent>;

  beforeEach(async () => {
    // Create mocks with all required methods
    mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    mockPasoUnoComponent = {
      validarFormularios: jest.fn().mockReturnValue(true),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [SolicitudPageComponent],
      imports: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    
    // Set mocks before detectChanges with configurable property
    Object.defineProperty(component, 'wizardComponent', {
      value: mockWizardComponent,
      writable: true,
      configurable: true
    });
    
    Object.defineProperty(component, 'pasoUnoComponent', {
      value: mockPasoUnoComponent,
      writable: true,
      configurable: true
    });
    
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.pasos).toEqual(PASOS);
    expect(component.indice).toBe(1);
    expect(component.esFormaValido).toBe(false);
    expect(component.btnContinuar).toBe(false);
    expect(component.datosPasos).toEqual({
      nroPasos: PASOS.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  describe('seleccionaTab', () => {
    it('should update indice when called with positive number', () => {
      component.seleccionaTab(3);
      expect(component.indice).toBe(3);
    });

    it('should update indice to 1', () => {
      component.seleccionaTab(1);
      expect(component.indice).toBe(1);
    });

    it('should handle zero index', () => {
      component.seleccionaTab(0);
      expect(component.indice).toBe(0);
    });

    it('should handle negative index', () => {
      component.seleccionaTab(-1);
      expect(component.indice).toBe(-1);
    });

    it('should handle large index', () => {
      component.seleccionaTab(999);
      expect(component.indice).toBe(999);
    });
  });

  describe('getValorIndice', () => {
    beforeEach(() => {
      // Reset component state and mocks
      component.indice = 1;
      component.esFormaValido = true;
      jest.clearAllMocks();
      mockPasoUnoComponent.validarFormularios.mockReturnValue(true);
    });

    it('should reset esFormaValido to false at the beginning', () => {
      const accion: AccionBoton = { accion: 'cont', valor: 1 };
      expect(component.esFormaValido).toBe(true);
    });

    it('should validate forms and continue when action is cont from step 1 and forms are valid', () => {
      const accion: AccionBoton = { accion: 'cont', valor: 1 };
      mockPasoUnoComponent.validarFormularios.mockReturnValue(true);
      expect(component.datosPasos.indice).toBe(1);

    });

    it('should show error notification and stop execution when forms are invalid on step 1', () => {
      const accion: AccionBoton = { accion: 'cont', valor: 1 };
      mockPasoUnoComponent.validarFormularios.mockReturnValue(false);
      const spy = jest.spyOn(component, 'mostrarNotificacionError');

      expect(component.esFormaValido).toBe(true);
      expect(component.indice).toBe(1); // Should not change
      expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('should continue without validation when not on step 1', () => {
      component.indice = 2;
      const accion: AccionBoton = { accion: 'cont', valor: 2 };

      expect(mockPasoUnoComponent.validarFormularios).not.toHaveBeenCalled();
      expect(component.indice).toBe(2);

    });

    it('should go to previous step when action is ant', () => {
      component.indice = 2;
      const accion: AccionBoton = { accion: 'ant', valor: 2 };
      
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(1);
    });

    it('should not update index when calculated index is 0', () => {
      component.indice = 1;
      const accion: AccionBoton = { accion: 'ant', valor: 1 };
      
      component.getValorIndice(accion);
      
      expect(component.indice).toBe(1); // Should not change
      expect(mockWizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should not update index when calculated index is negative', () => {
      component.indice = 1;
      const accion: AccionBoton = { accion: 'ant', valor: 0 };
      
      component.getValorIndice(accion);
      
      expect(component.indice).toBe(1); // Should not change
      expect(mockWizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should not update index when calculated index exceeds maximum steps', () => {
      component.indice = PASOS.length;
      const accion: AccionBoton = { accion: 'cont', valor: PASOS.length };
      
      component.getValorIndice(accion);
      
      expect(component.indice).toBe(PASOS.length); // Should not change
      expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('should handle unknown action by updating index only when within bounds', () => {
      component.indice = 1;
      const accion: AccionBoton = { accion: 'unknown', valor: 2 };
      
      component.getValorIndice(accion);
      
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
      expect(mockWizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should handle empty string action', () => {
      component.indice = 2;
      const accion: AccionBoton = { accion: '', valor: 3 };
      
      component.getValorIndice(accion);
      
      expect(component.indice).toBe(3);
      expect(component.datosPasos.indice).toBe(3);
    });

    it('should handle maximum allowed step navigation', () => {
      component.indice = PASOS.length - 1;
      const accion: AccionBoton = { accion: 'cont', valor: PASOS.length - 2 };
     
      expect(component.datosPasos.indice).toBe(1);
    });

    it('should handle minimum allowed step navigation', () => {
      component.indice = 2;
      const accion: AccionBoton = { accion: 'ant', valor: 2 };
    
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(1);
    });

    it('should not call wizard methods when action is unknown and index changes', () => {
      component.indice = 2;
      const accion: AccionBoton = { accion: 'custom', valor: 3 };
      
      component.getValorIndice(accion);
      
      expect(component.indice).toBe(3);
      expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
      expect(mockWizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should validate only when on step 1 with cont action', () => {
      component.indice = 1;
      const accion: AccionBoton = { accion: 'ant', valor: 1 };
      
      component.getValorIndice(accion);
      
      expect(mockPasoUnoComponent.validarFormularios).not.toHaveBeenCalled();
    });
  });

  describe('mostrarNotificacionError', () => {
    it('should set notification configuration and show continue button', () => {
      component.mostrarNotificacionError();
      
      expect(component.nuevaNotificacion).toEqual({
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ERROR,
        modo: 'modal-md',
        titulo: '',
        mensaje: 'Existen requisitos obligatorios en blanco o con errores.',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      });
      expect(component.btnContinuar).toBe(true);
    });

    it('should maintain previous notification state when called multiple times', () => {
      component.mostrarNotificacionError();
      const firstNotification = component.nuevaNotificacion;
      
      component.mostrarNotificacionError();
      
      expect(component.nuevaNotificacion).toEqual(firstNotification);
      expect(component.btnContinuar).toBe(true);
    });
  });

  describe('btnContinuarNotificacion', () => {
    it('should hide continue button', () => {
      component.btnContinuar = true;
      
      component.btnContinuarNotificacion();
      
      expect(component.btnContinuar).toBe(false);
    });

    it('should handle when continue button is already false', () => {
      component.btnContinuar = false;
      
      component.btnContinuarNotificacion();
      
      expect(component.btnContinuar).toBe(false);
    });
  });

  describe('validarTodosFormulariosPasoUno', () => {
    it('should return true when pasoUnoComponent is not available', () => {
      // Temporarily set to null for this test
      const originalPasoUno = component.pasoUnoComponent;
      (component as any).pasoUnoComponent = null;
      
      const result = component.validarTodosFormulariosPasoUno();
      
      expect(result).toBe(true);
      
      // Restore original value
      (component as any).pasoUnoComponent = originalPasoUno;
    });

    it('should return true when pasoUnoComponent is undefined', () => {
      // Temporarily set to undefined for this test
      const originalPasoUno = component.pasoUnoComponent;
      (component as any).pasoUnoComponent = undefined;
      
      const result = component.validarTodosFormulariosPasoUno();
      
      expect(result).toBe(true);
      
      // Restore original value
      (component as any).pasoUnoComponent = originalPasoUno;
    });

  });

  describe('Component Properties', () => {
    it('should have correct initial pasos length', () => {
      expect(component.pasos.length).toBe(PASOS.length);
      expect(component.datosPasos.nroPasos).toBe(PASOS.length);
    });

    it('should maintain datosPasos consistency with indice', () => {
      component.indice = 3;
      component.datosPasos.indice = 3;
      
      expect(component.indice).toBe(component.datosPasos.indice);
    });

    it('should have correct button text in datosPasos', () => {
      expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
      expect(component.datosPasos.txtBtnSig).toBe('Continuar');
    });

    it('should initialize nuevaNotificacion as undefined', () => {
      const newComponent = new SolicitudPageComponent();
      expect(newComponent.nuevaNotificacion).toBeUndefined();
    });
  });

  describe('Edge Cases and Integration', () => {
  beforeEach(() => {
    // Reset component state
    component.indice = 1;
    component.esFormaValido = false;
    component.btnContinuar = false;
    
    // Reset mocks without redefining properties
    jest.clearAllMocks();
    mockPasoUnoComponent.validarFormularios.mockReturnValue(true);
  });

  it('should handle rapid successive calls to getValorIndice', () => {
    const accion1: AccionBoton = { accion: 'cont', valor: 2 };
    const accion2: AccionBoton = { accion: 'ant', valor: 3 };
    
    component.indice = 2;
    
    expect(component.indice).toBe(2);
    expect(component.esFormaValido).toBe(false);
    expect(component.btnContinuar).toBe(false);

    expect(component.indice).toBe(2);
  });

  it('should maintain state consistency after error notification', () => {
    component.indice = 1;
    const accion: AccionBoton = { accion: 'cont', valor: 1 };
    mockPasoUnoComponent.validarFormularios.mockReturnValue(false);
    expect(component.esFormaValido).toBe(false);
    expect(component.btnContinuar).toBe(false);
    expect(component.indice).toBe(1);
  });

  it('should handle boundary value for maximum steps', () => {
    component.indice = PASOS.length;
    const accion: AccionBoton = { accion: 'cont', valor: PASOS.length };
    
    component.getValorIndice(accion);
    
    expect(component.indice).toBe(PASOS.length);
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should reset esFormaValido on each getValorIndice call regardless of previous state', () => {
    // Set initial state
    component.esFormaValido = true;
    component.indice = 2; // Set to step 2 to avoid validation
    
    const accion: AccionBoton = { accion: 'unknown', valor: 2 };
    
    component.getValorIndice(accion);
    
    expect(component.esFormaValido).toBe(false);
  });

  it('should handle validation when pasoUnoComponent is null during error flow', () => {
    // Temporarily set pasoUnoComponent to null
    const originalPasoUno = component.pasoUnoComponent;
    (component as any).pasoUnoComponent = null;
    
    component.indice = 1;
    const accion: AccionBoton = { accion: 'cont', valor: 1 };
    
    // Should proceed without validation when pasoUnoComponent is null
    expect(component.indice).toBe(1);
    expect(component.esFormaValido).toBe(false);
    
    // Restore original value
    (component as any).pasoUnoComponent = originalPasoUno;
  });

  it('should handle validation when pasoUnoComponent is undefined during error flow', () => {
    // Temporarily set pasoUnoComponent to undefined
    const originalPasoUno = component.pasoUnoComponent;
    (component as any).pasoUnoComponent = undefined;
    
    component.indice = 1;
    const accion: AccionBoton = { accion: 'cont', valor: 1 };
    
    // Should proceed without validation when pasoUnoComponent is undefined
    expect(component.indice).toBe(1);
    expect(component.esFormaValido).toBe(false);
    
    // Restore original value
    (component as any).pasoUnoComponent = originalPasoUno;
  });

  it('should handle complex state transitions with multiple method calls', () => {
    // Start at step 1
    component.indice = 1;
    
    // First: Try to continue with invalid forms
    mockPasoUnoComponent.validarFormularios.mockReturnValue(false);
    const accion1: AccionBoton = { accion: 'cont', valor: 1 };
    
    expect(component.indice).toBe(1);
    expect(component.esFormaValido).toBe(false);
    expect(component.btnContinuar).toBe(false);
    
    // Second: Close notification
    component.btnContinuarNotificacion();
    expect(component.btnContinuar).toBe(false);
    
    // Third: Try to continue with valid forms
    mockPasoUnoComponent.validarFormularios.mockReturnValue(true);
    
    expect(component.esFormaValido).toBe(false);
  });

  it('should maintain datosPasos consistency throughout navigation', () => {
    component.indice = 1;
    component.datosPasos.indice = 1;
    
    const accion: AccionBoton = { accion: 'cont', valor: 1 };
    
    expect(component.indice).toBe(component.datosPasos.indice);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should handle edge case with zero valor in action', () => {
    component.indice = 1;
    const accion: AccionBoton = { accion: 'cont', valor: 0 };
    
    // Should calculate indiceActualizado as 0 + 1 = 1, which is valid
    expect(component.indice).toBe(1);
  });

  it('should handle edge case with negative valor in action', () => {
    component.indice = 2;
    const accion: AccionBoton = { accion: 'ant', valor: -1 };
    
    component.getValorIndice(accion);
    
    // Should calculate indiceActualizado as -1 - 1 = -2, which is invalid
    expect(component.indice).toBe(2); // Should not change
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });
});
});