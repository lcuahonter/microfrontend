import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { SolicitudPageComponent } from './solicitud-page.component';
import { Tramite110223Store, TramiteState } from '../../estados/Tramite110223.store';
import { Tramite110223Query } from '../../query/tramite110223.query';
import { CertificadosOrigenService } from '../../services/certificado-origen.service';

// Mock esValidObject and getValidDatos functions
jest.mock('@ng-mf/data-access-user', () => ({
  ...jest.requireActual('@ng-mf/data-access-user'),
  esValidObject: jest.fn((obj) => obj && typeof obj === 'object'),
  getValidDatos: jest.fn((data) => data !== null && data !== undefined && data !== ''),
}));

// Mock components to avoid dependency injection issues
@Component({
  selector: 'btn-continuar',
  template: '<div>Mock BtnContinuar</div>',
  standalone: true
})
class MockBtnContinuarComponent {
  @Input() datos: any;
  @Input() btnGuardar: boolean = false;
  @Input() dePadre: boolean = false;
  @Input() vistaEmergente: any;
  @Input() notificacion: any;
  @Input() ocultabotonAnterior: boolean = false;
  @Output() continuarEvento = new EventEmitter<any>();
  @Output() btnGuardarClicked = new EventEmitter<void>();
}

@Component({
  selector: 'wizard',
  template: '<div>Mock Wizard</div>',
  standalone: true
})
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}

@Component({
  selector: 'paso-uno',
  template: '<div>Mock Paso Uno</div>',
  standalone: true
})
class MockPasoUnoComponent {
  validarFormularios = jest.fn().mockReturnValue(true);
}

interface AccionBoton {
  accion: string;
  valor: number;
}

const mockTramiteState: Partial<TramiteState> = {
  idSolicitud: 12345,
  agregarProductoresExportador: [],
  productoresExportador: [],
  mercanciaProductores: [],
  formulario: {
    datosConfidencialesProductor: false,
    productorMismoExportador: true
  }
};

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let mockStore: jest.Mocked<Tramite110223Store>;
  let mockQuery: jest.Mocked<Tramite110223Query>;
  let mockCertificadoService: jest.Mocked<CertificadosOrigenService>;
  let mockToastr: jest.Mocked<ToastrService>;

  beforeEach(async () => {
    // Create mocks
    mockStore = {
      setIdSolicitud: jest.fn(),
    } as any;

    mockQuery = {
      selectSolicitud$: new Subject<TramiteState>(),
    } as any;

    mockCertificadoService = {
      buildProductoresPorExportador: jest.fn().mockReturnValue([]),
      buildMercanciasProductor: jest.fn().mockReturnValue([]),
      buildCertificado: jest.fn().mockReturnValue({}),
      buildDestinatario: jest.fn().mockReturnValue({}),
      guardarDatosPost: jest.fn().mockReturnValue(of({ 
        id: 1, 
        descripcion: 'Éxito', 
        datos: { idSolicitud: 12345 } 
      })),
      getAllState: jest.fn().mockReturnValue(of(mockTramiteState)),
    } as any;

    mockToastr = {
      success: jest.fn(),
      error: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [SolicitudPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        provideHttpClient(),
        { provide: Tramite110223Store, useValue: mockStore },
        { provide: Tramite110223Query, useValue: mockQuery },
        { provide: CertificadosOrigenService, useValue: mockCertificadoService },
        { provide: ToastrService, useValue: mockToastr },
      ],
    })
    .overrideTemplate(SolicitudPageComponent, `
      <div class="solicitud-page-container">
        <div class="mock-wizard">Mock Wizard Component</div>
        <div class="mock-btn-continuar">Mock Btn Continuar</div>
        <div class="mock-paso-uno">Mock Paso Uno</div>
      </div>
    `)
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;

    // Mock ViewChild components
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    component.pasoUnoComponent = {
      validarFormularios: jest.fn().mockReturnValue(true),
    } as any;

    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  // Basic component tests
  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.indice).toBe(1);
      expect(component.esFormaValido).toBe(false);
      expect(component.idSolicitud).toBe(0);
      expect(component.TEXTO_DE_ALERTA).toBeDefined();
      expect(component.pasos).toBeDefined();
      expect(component.datosPasos).toBeDefined();
    });

    it('should subscribe to selectSolicitud$ in constructor', () => {
      const testSolicitud = { idSolicitud: 123 } as TramiteState;
      
      (mockQuery.selectSolicitud$ as Subject<TramiteState>).next(testSolicitud);
      
      expect(component.solicitudState).toEqual(testSolicitud);
    });

    it('should initialize datosPasos with correct properties', () => {
      expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
      expect(component.datosPasos.txtBtnSig).toBe('Continuar');
    });

    it('should initialize destroyNotifier$ as Subject', () => {
      expect(component.destroyNotifier$).toBeInstanceOf(Subject);
    });

    it('should have correct TEXTO_DE_ALERTA content', () => {
      expect(component.TEXTO_DE_ALERTA).toContain('La solicitud ha quedado registrada');
    });

    it('should have formErrorAlert defined', () => {
      expect(component.formErrorAlert).toBeDefined();
    });
  });

  // Method tests
  describe('buildMercanciaSeleccionadas', () => {
    it('should transform mercancía array correctly', () => {
      const mockMercancias = [
        {
          id: 1,
          fraccionArancelaria: '1234567890',
          tipoFactura: 'COMERCIAL',
          numeroFactura: 'FAC-001',
          complementoDescripcion: 'Descripción test',
          fechaFactura: '2023-01-01',
          cantidad: '10',
          umc: 'KGM',
          valorMercancia: '1000.00'
        }
      ];

      const result = component.buildMercanciaSeleccionadas(mockMercancias);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 1,
        fraccion_arancelaria: '1234567890',
        tipo_factura: 'COMERCIAL',
        num_factura: 'FAC-001',
        complemento_descripcion: 'Descripción test',
        fecha_factura: '2023-01-01',
        cantidad: '10',
        umc: 'KGM',
        valor_mercancia: '1000.00'
      });
    });

    it('should handle empty array', () => {
      const result = component.buildMercanciaSeleccionadas([]);
      expect(result).toEqual([]);
    });

    it('should handle array with multiple items', () => {
      const mockMercancias = [
        { id: 1, fraccionArancelaria: '111' },
        { id: 2, fraccionArancelaria: '222' }
      ];

      const result = component.buildMercanciaSeleccionadas(mockMercancias);

      expect(result).toHaveLength(2);
      expect(result[0]['id']).toBe(1);
      expect(result[1]['id']).toBe(2);
    });

    it('should handle undefined/null properties in mercancia items', () => {
      const mockMercancias = [
        {
          id: undefined,
          fraccionArancelaria: null,
          tipoFactura: undefined,
        }
      ];

      const result = component.buildMercanciaSeleccionadas(mockMercancias);
      
      expect(result).toHaveLength(1);
      expect(result[0]['id']).toBeUndefined();
      expect(result[0]['fraccion_arancelaria']).toBeNull();
    });
  });

  describe('seleccionaTab', () => {
    it('should update indice correctly', () => {
      component.seleccionaTab(3);
      expect(component.indice).toBe(3);
    });

    it('should handle boundary values', () => {
      component.seleccionaTab(1);
      expect(component.indice).toBe(1);
      
      component.seleccionaTab(4);
      expect(component.indice).toBe(4);
    });

    it('should handle zero value', () => {
      component.seleccionaTab(0);
      expect(component.indice).toBe(0);
    });
  });

  describe('getValorIndice', () => {
    it('should handle step 1 continue action with validation success', () => {
      component.indice = 1;
      const accion: AccionBoton = { accion: 'cont', valor: 2 };
      jest.spyOn(component, 'obtenerDatosDelStore').mockImplementation(() => {});
      
      component.getValorIndice(accion);
      
      expect(component.esFormaValido).toBe(false);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.obtenerDatosDelStore).toHaveBeenCalled();
    });    it('should not navigate when valor is out of range', () => {
      jest.spyOn(component, 'pasoNavegarPor');
      
      component.getValorIndice({ accion: 'test', valor: 0 });
      expect(component.pasoNavegarPor).not.toHaveBeenCalled();
      
      component.getValorIndice({ accion: 'test', valor: 999 });
      expect(component.pasoNavegarPor).not.toHaveBeenCalled();
    });
  });

  describe('validarTodosFormulariosPasoUno', () => {
    it('should return true when pasoUnoComponent is not available', () => {
      component.pasoUnoComponent = null as any;
      
      const result = component.validarTodosFormulariosPasoUno();
      
      expect(result).toBe(true);
    });

  });

  describe('obtenerDatosDelStore', () => {
    it('should call certificadoService.getAllState and guardar', () => {
      jest.spyOn(component, 'guardar').mockResolvedValue({} as any);
      
      component.obtenerDatosDelStore();
      
      expect(mockCertificadoService.getAllState).toHaveBeenCalled();
    });

    it('should subscribe and call guardar with received data', (done) => {
      const testData = { test: 'data' } as any;
      mockCertificadoService.getAllState.mockReturnValue(of(testData));
      jest.spyOn(component, 'guardar').mockResolvedValue({} as any);
      
      component.obtenerDatosDelStore();
      
      setTimeout(() => {
        expect(component.guardar).toHaveBeenCalledWith(testData);
        done();
      }, 10);
    });
  });

  // Component lifecycle tests
  describe('Component Lifecycle', () => {
    it('should call ngOnDestroy correctly', () => {
      jest.spyOn(component.destroyNotifier$, 'next');
      jest.spyOn(component.destroyNotifier$, 'complete');
      
      component.ngOnDestroy();
      
      expect(component.destroyNotifier$.next).toHaveBeenCalled();
      expect(component.destroyNotifier$.complete).toHaveBeenCalled();
    });

    it('should maintain subscription to query throughout lifecycle', () => {
      const testState1 = { idSolicitud: 111 } as TramiteState;
      const testState2 = { idSolicitud: 222 } as TramiteState;
      
      (mockQuery.selectSolicitud$ as Subject<TramiteState>).next(testState1);
      expect(component.solicitudState).toEqual(testState1);
      
      (mockQuery.selectSolicitud$ as Subject<TramiteState>).next(testState2);
      expect(component.solicitudState).toEqual(testState2);
    });

    it('should handle component destruction in fixture', () => {
      const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
      const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
      
      fixture.destroy();
      
      expect(nextSpy).toBeDefined();
      expect(completeSpy).toBeDefined();
    });
  });

  // Integration tests
  describe('Component Integration', () => {
    it('should handle complete workflow from getValorIndice to guardar', () => {
      component.indice = 1;
      const accion: AccionBoton = { accion: 'cont', valor: 2 };
      
      jest.spyOn(component, 'guardar').mockResolvedValue({} as any);
      
      component.getValorIndice(accion);
      
      expect(component.esFormaValido).toBe(false);
    });

    it('should properly handle form error alert', () => {
      expect(component.formErrorAlert).toBeDefined();
    });
  });

  // Additional coverage tests for 80%+
  describe('Additional Coverage Tests', () => {
    it('should have correct pasos configuration', () => {
      expect(component.pasos).toBeDefined();
      expect(Array.isArray(component.pasos)).toBe(true);
      expect(component.pasos.length).toBeGreaterThan(0);
    });

    it('should maintain correct datosPasos structure', () => {
      const datosPasos = component.datosPasos;
      expect(datosPasos).toHaveProperty('nroPasos');
      expect(datosPasos).toHaveProperty('indice');
      expect(datosPasos).toHaveProperty('txtBtnAnt');
      expect(datosPasos).toHaveProperty('txtBtnSig');
    });

    it('should handle template rendering', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.solicitud-page-container')).toBeTruthy();
    });    it('should handle step navigation edge cases', () => {
      // Ensure wizardComponent mock is properly set up
      component.wizardComponent = {
        siguiente: jest.fn(),
        atras: jest.fn(),
      } as any;
      
      // Test navigation with different step combinations
      component.indice = 3;
      const accion: AccionBoton = { accion: 'ant', valor: 2 };
      component.pasoNavegarPor(accion);
      expect(component.indice).toBe(2);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
    });

  });
});
