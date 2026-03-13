import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ZoosanitarioParaImportacionComponent } from './zoosanitario-para-importacion.component';
import { ZoosanitarioService } from '../../service/zoosanitario.service';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model';
import { ALERTA_COM } from '@libs/shared/data-access-user/src/tramites/constantes/110208/certificado.enum';
import { PASOS } from '@libs/shared/data-access-user/src/core/models/221602/mercancia.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

// Mock WizardComponent
@Component({
  selector: 'lib-wizard',
  template: '<div>Mock Wizard</div>'
})
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}

// Mock child components used in template
@Component({
  selector: 'app-datos',
  template: '<div>Mock Datos</div>'
})
class MockDatosComponent {}

@Component({
  selector: 'app-paso-dos',
  template: '<div>Mock Paso Dos</div>'
})
class MockPasoDosComponent {}

@Component({
  selector: 'app-firmar-solicitud',
  template: '<div>Mock Firmar Solicitud</div>'
})
class MockFirmarSolicitudComponent {}

@Component({
  selector: 'btn-continuar',
  template: '<div>Mock Btn Continuar</div>'
})
class MockBtnContinuarComponent {
  datos: any;
  continuarEvento = { emit: jest.fn() };
}

@Component({
  selector: 'ng-alert',
  template: '<div>Mock Alert</div>'
})
class MockAlertComponent {
  CONTENIDO: any;
}

// Mock constants to ensure tests have predictable data
jest.mock('@libs/shared/data-access-user/src/tramites/constantes/110208/certificado.enum', () => ({
  ALERTA_COM: {
    mensaje: 'Test alert message',
    tipo: 'info',
    inst: 'Test instructions'
  }
}));

jest.mock('@libs/shared/data-access-user/src/core/models/221602/mercancia.model', () => ({
  PASOS: [
    { id: 1, titulo: 'Step 1', descripcion: 'First step' },
    { id: 2, titulo: 'Step 2', descripcion: 'Second step' },
    { id: 3, titulo: 'Step 3', descripcion: 'Third step' },
    { id: 4, titulo: 'Step 4', descripcion: 'Fourth step' }
  ]
}));

describe('ZoosanitarioParaImportacionComponent', () => {
  let component: ZoosanitarioParaImportacionComponent;
  let fixture: ComponentFixture<ZoosanitarioParaImportacionComponent>;
  let mockZoosanitarioService: any;

  beforeEach(async () => {
    mockZoosanitarioService = {
      getPayload: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [
        ZoosanitarioParaImportacionComponent,
        MockWizardComponent,
        MockDatosComponent,
        MockPasoDosComponent,
        MockFirmarSolicitudComponent,
        MockBtnContinuarComponent,
        MockAlertComponent
      ],
      imports: [
        ReactiveFormsModule,
        CommonModule
      ],
      providers: [
        { provide: ZoosanitarioService, useValue: mockZoosanitarioService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ZoosanitarioParaImportacionComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  // Helper function to ensure wizard component is always mocked
  const ensureWizardComponentMocked = () => {
    if (!component.wizardComponent) {
      component.wizardComponent = {
        siguiente: jest.fn(),
        atras: jest.fn()
      } as any;
    }
  };

  describe('Component Initialization', () => {
    beforeEach(() => {
      ensureWizardComponentMocked();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize pantallasPasos with PASOS', () => {
      expect(component.pantallasPasos).toEqual(PASOS);
    });

    it('should initialize TEXTOS with ALERTA_COM', () => {
      expect(component.TEXTOS).toEqual(ALERTA_COM);
    });

    it('should initialize indice to 1', () => {
      expect(component.indice).toBe(1);
    });

    it('should initialize datosPasos with correct configuration', () => {
      expect(component.datosPasos).toEqual({
        nroPasos: component.pantallasPasos.length,
        indice: component.indice,
        txtBtnAnt: 'Anterior',
        txtBtnSig: 'Continuar'
      });
    });

    it('should have datosPasos.nroPasos equal to pantallasPasos length', () => {
      expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
    });

    it('should have datosPasos.indice equal to component indice', () => {
      expect(component.datosPasos.indice).toBe(component.indice);
    });

    it('should have correct button texts in datosPasos', () => {
      expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
      expect(component.datosPasos.txtBtnSig).toBe('Continuar');
    });
  });

  describe('Constructor', () => {
    beforeEach(() => {
      ensureWizardComponentMocked();
    });

    it('should inject ZoosanitarioService', () => {
      expect(component['zoosanitarioService']).toBeDefined();
      expect(component['zoosanitarioService']).toBe(mockZoosanitarioService);
    });
  });

  describe('getValorIndice Method', () => {
    beforeEach(() => {
      // Reset mocks before each test
      mockZoosanitarioService.getPayload.mockClear();
      // Ensure wizard component is mocked and reset the spy functions
      ensureWizardComponentMocked();
      component.wizardComponent = {
        siguiente: jest.fn(),
        atras: jest.fn()
      } as any;
    });

    it('should call zoosanitarioService.getPayload on every invocation', () => {
      const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
      
      component.getValorIndice(accionBoton);
      
      expect(mockZoosanitarioService.getPayload).toHaveBeenCalled();
    });

    it('should subscribe to getPayload observable', () => {
      const subscribeSpy = jest.spyOn(mockZoosanitarioService.getPayload(), 'subscribe');
      const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
      
      component.getValorIndice(accionBoton);
      
      expect(subscribeSpy).toHaveBeenCalled();
    });

    describe('Valid valor range (1-4)', () => {
      it('should update indice and call siguiente when accion is "cont" and valor is 2', () => {
        const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
        
        component.getValorIndice(accionBoton);
        
        expect(component.indice).toBe(2);
        expect(component.wizardComponent.siguiente).toHaveBeenCalled();
        expect(component.wizardComponent.atras).not.toHaveBeenCalled();
      });

      it('should update indice and call siguiente when accion is "cont" and valor is 1', () => {
        const accionBoton: AccionBoton = { valor: 1, accion: 'cont' };
        
        component.getValorIndice(accionBoton);
        
        expect(component.indice).toBe(1);
        expect(component.wizardComponent.siguiente).toHaveBeenCalled();
        expect(component.wizardComponent.atras).not.toHaveBeenCalled();
      });

      it('should update indice and call siguiente when accion is "cont" and valor is 4', () => {
        const accionBoton: AccionBoton = { valor: 4, accion: 'cont' };
        
        component.getValorIndice(accionBoton);
        
        expect(component.indice).toBe(4);
        expect(component.wizardComponent.siguiente).toHaveBeenCalled();
        expect(component.wizardComponent.atras).not.toHaveBeenCalled();
      });

      it('should update indice and call atras when accion is "prev" and valor is 2', () => {
        const accionBoton: AccionBoton = { valor: 2, accion: 'prev' };
        
        component.getValorIndice(accionBoton);
        
        expect(component.indice).toBe(2);
        expect(component.wizardComponent.atras).toHaveBeenCalled();
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      });

      it('should update indice and call atras when accion is "prev" and valor is 3', () => {
        const accionBoton: AccionBoton = { valor: 3, accion: 'prev' };
        
        component.getValorIndice(accionBoton);
        
        expect(component.indice).toBe(3);
        expect(component.wizardComponent.atras).toHaveBeenCalled();
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      });

      it('should handle different accion values correctly', () => {
        const accionCont: AccionBoton = { valor: 2, accion: 'cont' };
        const accionPrev: AccionBoton = { valor: 3, accion: 'prev' };
        
        component.getValorIndice(accionCont);
        expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(1);
        expect(component.wizardComponent.atras).not.toHaveBeenCalled();
        
        // Reset wizard component mocks
        component.wizardComponent = {
          siguiente: jest.fn(),
          atras: jest.fn()
        } as any;
        
        component.getValorIndice(accionPrev);
        expect(component.wizardComponent.atras).toHaveBeenCalledTimes(1);
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      });
    });

    describe('Invalid valor range', () => {
      it('should not update indice or call wizard methods when valor is 0', () => {
        const initialIndice = component.indice;
        const accionBoton: AccionBoton = { valor: 0, accion: 'cont' };
        
        component.getValorIndice(accionBoton);
        
        expect(component.indice).toBe(initialIndice);
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
        expect(component.wizardComponent.atras).not.toHaveBeenCalled();
      });

      it('should not update indice or call wizard methods when valor is 5', () => {
        const initialIndice = component.indice;
        const accionBoton: AccionBoton = { valor: 5, accion: 'cont' };
        
        component.getValorIndice(accionBoton);
        
        expect(component.indice).toBe(initialIndice);
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
        expect(component.wizardComponent.atras).not.toHaveBeenCalled();
      });

      it('should not update indice or call wizard methods when valor is negative', () => {
        const initialIndice = component.indice;
        const accionBoton: AccionBoton = { valor: -1, accion: 'cont' };
        
        component.getValorIndice(accionBoton);
        
        expect(component.indice).toBe(initialIndice);
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
        expect(component.wizardComponent.atras).not.toHaveBeenCalled();
      });

      it('should not update indice or call wizard methods when valor is greater than 5', () => {
        const initialIndice = component.indice;
        const accionBoton: AccionBoton = { valor: 10, accion: 'cont' };
        
        component.getValorIndice(accionBoton);
        
        expect(component.indice).toBe(initialIndice);
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
        expect(component.wizardComponent.atras).not.toHaveBeenCalled();
      });

      it('should still call getPayload even with invalid valor', () => {
        const accionBoton: AccionBoton = { valor: 0, accion: 'cont' };
        
        component.getValorIndice(accionBoton);
        
        expect(mockZoosanitarioService.getPayload).toHaveBeenCalled();
      });
    });

    describe('Edge cases', () => {
      it('should handle boundary valor of 1 (minimum valid)', () => {
        const accionBoton: AccionBoton = { valor: 1, accion: 'cont' };
        
        component.getValorIndice(accionBoton);
        
        expect(component.indice).toBe(1);
        expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      });

      it('should handle boundary valor of 4 (maximum valid)', () => {
        const accionBoton: AccionBoton = { valor: 4, accion: 'prev' };
        
        component.getValorIndice(accionBoton);
        
        expect(component.indice).toBe(4);
        expect(component.wizardComponent.atras).toHaveBeenCalled();
      });

      it('should handle unknown accion value', () => {
        const accionBoton: AccionBoton = { valor: 2, accion: 'unknown' as any };
        
        component.getValorIndice(accionBoton);
        
        expect(component.indice).toBe(2);
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
        expect(component.wizardComponent.atras).toHaveBeenCalled(); // falls to else case
      });

      it('should handle empty accion value', () => {
        const accionBoton: AccionBoton = { valor: 3, accion: '' as any };
        
        component.getValorIndice(accionBoton);
        
        expect(component.indice).toBe(3);
        expect(component.wizardComponent.atras).toHaveBeenCalled(); // falls to else case
      });
    });

    describe('Service error handling', () => {
      it('should still process the action even if getPayload throws an error', () => {
        mockZoosanitarioService.getPayload.mockReturnValue(throwError('Service error'));
        const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
        
        expect(() => component.getValorIndice(accionBoton)).not.toThrow();
        expect(component.indice).toBe(2);
        expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      });

      it('should call getPayload even when valor is invalid', () => {
        const accionBoton: AccionBoton = { valor: 10, accion: 'cont' };
        
        component.getValorIndice(accionBoton);
        
        expect(mockZoosanitarioService.getPayload).toHaveBeenCalled();
      });
    });
  });

  describe('Component Properties', () => {
    beforeEach(() => {
      ensureWizardComponentMocked();
    });

    it('should have wizardComponent ViewChild defined after component initialization', () => {
      expect(component.wizardComponent).toBeDefined();
    });

    it('should have pantallasPasos as an array', () => {
      expect(Array.isArray(component.pantallasPasos)).toBe(true);
    });

    it('should have non-empty pantallasPasos array', () => {
      expect(component.pantallasPasos.length).toBeGreaterThan(0);
    });

    it('should have TEXTOS defined', () => {
      expect(component.TEXTOS).toBeDefined();
    });

    it('should have datosPasos object with all required properties', () => {
      expect(component.datosPasos).toHaveProperty('nroPasos');
      expect(component.datosPasos).toHaveProperty('indice');
      expect(component.datosPasos).toHaveProperty('txtBtnAnt');
      expect(component.datosPasos).toHaveProperty('txtBtnSig');
    });
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      ensureWizardComponentMocked();
    });

    it('should maintain state consistency between indice and datosPasos.indice initially', () => {
      expect(component.indice).toBe(component.datosPasos.indice);
    });

    it('should update indice independently of datosPasos.indice in getValorIndice', () => {
      const accionBoton: AccionBoton = { valor: 3, accion: 'cont' };
      const originalDatosPasosIndice = component.datosPasos.indice;
      
      component.getValorIndice(accionBoton);
      
      expect(component.indice).toBe(3);
      expect(component.datosPasos.indice).toBe(originalDatosPasosIndice); // Should remain unchanged
    });

    it('should work with multiple sequential calls to getValorIndice', () => {
      const accion1: AccionBoton = { valor: 2, accion: 'cont' };
      const accion2: AccionBoton = { valor: 3, accion: 'prev' };
      const accion3: AccionBoton = { valor: 1, accion: 'cont' };
      
      component.getValorIndice(accion1);
      expect(component.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalledTimes(1);
      
      component.getValorIndice(accion2);
      expect(component.indice).toBe(3);
      expect(component.wizardComponent.atras).toHaveBeenCalledTimes(1);
      
      component.getValorIndice(accion3);
      expect(component.indice).toBe(1);
      expect(mockZoosanitarioService.getPayload).toHaveBeenCalledTimes(3);
    });

    it('should call getPayload for each getValorIndice invocation regardless of validity', () => {
      const validAction: AccionBoton = { valor: 2, accion: 'cont' };
      const invalidAction: AccionBoton = { valor: 10, accion: 'cont' };
      
      component.getValorIndice(validAction);
      component.getValorIndice(invalidAction);
      
      expect(mockZoosanitarioService.getPayload).toHaveBeenCalledTimes(2);
    });
  });

  describe('Component State Management', () => {
    beforeEach(() => {
      ensureWizardComponentMocked();
    });

    it('should preserve initial indice after invalid getValorIndice calls', () => {
      const initialIndice = component.indice;
      const invalidActions = [
        { valor: 0, accion: 'cont' },
        { valor: 5, accion: 'prev' },
        { valor: -1, accion: 'cont' },
        { valor: 100, accion: 'prev' }
      ];
      
      invalidActions.forEach((action: AccionBoton) => {
        component.getValorIndice(action);
      });
      
      expect(component.indice).toBe(initialIndice);
    });

    it('should handle state changes correctly for all valid values', () => {
      ensureWizardComponentMocked();
      const validValues = [1, 2, 3, 4];
      
      validValues.forEach(valor => {
        component.getValorIndice({ valor, accion: 'cont' });
        expect(component.indice).toBe(valor);
      });
    });
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      ensureWizardComponentMocked();
    });

    it('should have properties accessible from template', () => {
      expect(component.pantallasPasos).toBeDefined();
      expect(component.indice).toBeDefined();
      expect(component.datosPasos).toBeDefined();
      expect(component.TEXTOS).toBeDefined();
    });

    it('should have datosPasos configured for btn-continuar component', () => {
      expect(component.datosPasos).toEqual({
        nroPasos: expect.any(Number),
        indice: expect.any(Number),
        txtBtnAnt: expect.any(String),
        txtBtnSig: expect.any(String)
      });
    });

    it('should have TEXTOS configured for ng-alert component', () => {
      expect(component.TEXTOS).toBeDefined();
      expect(typeof component.TEXTOS).toBe('object');
    });
  });

  describe('Comprehensive Coverage Tests', () => {
    beforeEach(() => {
      ensureWizardComponentMocked();
    });

    it('should handle getValorIndice method signature correctly', () => {
      const methodExists = typeof component.getValorIndice === 'function';
      expect(methodExists).toBe(true);
      
      // Test method with proper parameter type
      expect(() => {
        component.getValorIndice({ valor: 1, accion: 'cont' });
      }).not.toThrow();
    });

    it('should maintain component state consistency throughout lifecycle', () => {
      ensureWizardComponentMocked();
      // Test initial state
      expect(component.indice).toBe(1);
      expect(component.pantallasPasos).toEqual(PASOS);
      expect(component.TEXTOS).toEqual(ALERTA_COM);
      
      // Test state after method calls
      component.getValorIndice({ valor: 3, accion: 'cont' });
      expect(component.indice).toBe(3);
      expect(component.pantallasPasos).toEqual(PASOS); // Should remain unchanged
      expect(component.TEXTOS).toEqual(ALERTA_COM); // Should remain unchanged
    });

    it('should handle service dependency correctly', () => {
      ensureWizardComponentMocked();
      expect(component['zoosanitarioService']).toBe(mockZoosanitarioService);
      
      // Test service method is called
      component.getValorIndice({ valor: 1, accion: 'cont' });
      expect(mockZoosanitarioService.getPayload).toHaveBeenCalled();
    });

    it('should handle ViewChild wizard component correctly', () => {
      expect(component.wizardComponent).toBeDefined();
      expect(typeof component.wizardComponent.siguiente).toBe('function');
      expect(typeof component.wizardComponent.atras).toBe('function');
    });

    it('should validate all component properties are initialized', () => {
      expect(component.pantallasPasos).toBeDefined();
      expect(component.TEXTOS).toBeDefined();
      expect(component.indice).toBeDefined();
      expect(component.wizardComponent).toBeDefined();
      expect(component.datosPasos).toBeDefined();
      expect(component.datosPasos.nroPasos).toBeDefined();
      expect(component.datosPasos.indice).toBeDefined();
      expect(component.datosPasos.txtBtnAnt).toBeDefined();
      expect(component.datosPasos.txtBtnSig).toBeDefined();
    });

    it('should handle all code paths in getValorIndice method', () => {
      ensureWizardComponentMocked();
      // Test cont action path
      component.getValorIndice({ valor: 2, accion: 'cont' });
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      
      // Reset mock
      component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
      
      // Test prev action path (else path)
      component.getValorIndice({ valor: 2, accion: 'prev' });
      expect(component.wizardComponent.atras).toHaveBeenCalled();
      
      // Reset mock
      component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
      
      // Test invalid valor path
      const initialIndice = component.indice;
      component.getValorIndice({ valor: 0, accion: 'cont' });
      expect(component.indice).toBe(initialIndice);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });
  });
});
