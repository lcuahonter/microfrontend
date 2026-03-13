import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';

import { HistoricoFabricantesComponent } from './historico-fabricantes.component';
import { ElegibilidadDeTextilesStore } from '../../estados/elegibilidad-de-textiles.store';
import { ElegibilidadDeTextilesQuery } from '../../queries/elegibilidad-de-textiles.query';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { SeccionLibQuery } from '@ng-mf/data-access-user';
import { ElegibilidadTextilesService } from '../../services/elegibilidad-textiles/elegibilidad-textiles.service';
import { HistoricoColumns } from '../../models/elegibilidad-de-textiles.model';
import { ERROR_FORMA_ALERT } from '../../constantes/elegibilidad-de-textiles.enums';

describe('HistoricoFabricantesComponent', () => {
  let component: HistoricoFabricantesComponent;
  let fixture: ComponentFixture<HistoricoFabricantesComponent>;
  let mockElegibilidadDeTextilesStore: any;
  let mockElegibilidadDeTextilesQuery: any;
  let mockSeccionLibStore: any;
  let mockSeccionLibQuery: any;
  let mockElegibilidadTextilesService: any;
  let mockChangeDetectorRef: any;

  const mockHistoricoData: HistoricoColumns = {
    nombreFabricante: 'Test Fabricante',
    numeroRegistroFiscal: 'RFC123456789',
    direccion: 'Test Address',
    correoElectrónico: 'test@example.com',
    telefono: '1234567890'
  };

  beforeEach(async () => {
    mockElegibilidadDeTextilesStore = {
      actualizarPaginacionElegibilidadDeTextiles: jest.fn(),
      actualizarTextilesFormData: jest.fn()
    };

    mockElegibilidadDeTextilesQuery = {
      selectAll: jest.fn().mockReturnValue([]),
      selectTextile$: of({
        exportadorFabricanteMismo: '',
        numeroRegistroFiscal: '',
        formaValida: [{ descripcion: 'VALIDO' }]
      })
    };

    mockSeccionLibStore = {
      updateErrorMessage: jest.fn(),
      updateIsLoading: jest.fn(),
      establecerFormaValida: jest.fn(),
      establecerSeccion: jest.fn()
    };

    mockSeccionLibQuery = {
      getValue: jest.fn().mockReturnValue({
        isLoading: false,
        errorMessage: null
      }),
      selectSeccionState$: of({
        isLoading: false,
        errorMessage: null
      })
    };

    mockElegibilidadTextilesService = {
      postElegibilidadFabricantes: jest.fn().mockResolvedValue({}),
      getElegibilidadFabricantes: jest.fn().mockResolvedValue([]),
      obtenerTablaDatos: jest.fn().mockReturnValue(of([]))
    };

    mockChangeDetectorRef = {
      detectChanges: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        HistoricoFabricantesComponent,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: ElegibilidadDeTextilesStore, useValue: mockElegibilidadDeTextilesStore },
        { provide: ElegibilidadDeTextilesQuery, useValue: mockElegibilidadDeTextilesQuery },
        { provide: SeccionLibStore, useValue: mockSeccionLibStore },
        { provide: SeccionLibQuery, useValue: mockSeccionLibQuery },
        { provide: ElegibilidadTextilesService, useValue: mockElegibilidadTextilesService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricoFabricantesComponent);
    component = fixture.componentInstance;
    
    const mockBootstrapModal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    
    Object.defineProperty(window, 'bootstrap', {
      value: {
        Modal: jest.fn().mockImplementation(() => mockBootstrapModal)
      },
      writable: true
    });
    
    component.radioOptions = [
      { label: 'Test Option 1', value: '1' },
      { label: 'Test Option 2', value: '2' }
    ];
    
    jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      const mockElement = document.createElement('div');
      mockElement.id = id;
      return mockElement;
    });
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.selectedValue).toBeNull();
      expect(component.selectedFabricantesNacionales).toEqual([]);
      expect(component.formularioAlertaError).toBe('');
      expect(component.esFormaValido).toBe(false);
      expect(component.mostrarOpcionNacional).toBe(false);
    });

    it('should call ngOnInit', () => {
      const spy = jest.spyOn(component, 'initActionFormBuild');
      const spy2 = jest.spyOn(component, 'recuperarDatos');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });

  describe('Form Methods', () => {
    it('should initialize form in initActionFormBuild', () => {
      component.initActionFormBuild();
      expect(component.historicoFabricantesForm).toBeDefined();
      expect(component.historicoFabricantesForm.get('tipoFabricante')).toBeDefined();
    });

    it('should handle value change in alValorCambiar', () => {
      const testValue = 'testValue';
      component.alValorCambiar(testValue);
      expect(component.valorSeleccionado).toBe(testValue);
    });

    it('should handle value change in alValorCambiar', () => {
      component.alValorCambiar('No');
      expect(component.valorSeleccionado).toBe('No');
      expect(component.mostrarOpcionNacional).toBe(true);
      
      component.alValorCambiar('Si');
      expect(component.valorSeleccionado).toBe('Si');
      expect(component.mostrarOpcionNacional).toBe(false);
    });
  });

  describe('Data Management', () => {
    it('should handle selection change in onSeleccionNacionalChange', () => {
      const testData: HistoricoColumns[] = [mockHistoricoData];
      component.onSeleccionNacionalChange(testData);
      expect(component.selectedFabricantesNacionales).toEqual(testData);
    });

    it('should handle non-array input in onSeleccionNacionalChange', () => {
      component.onSeleccionNacionalChange(mockHistoricoData as any);
      expect(component.selectedFabricantesNacionales).toEqual([]);
    });

    it('should call recuperarDatos to load data', () => {
      const spy = jest.spyOn(mockElegibilidadTextilesService, 'obtenerTablaDatos');
      component.recuperarDatos();
      expect(spy).toHaveBeenCalledWith('historico-fabricantes.json');
    });
  });

  describe('Modal Management', () => {
    beforeEach(() => {
      const mockElement = document.createElement('div');
      jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);
    });

    it('should open modal when abrirModalEliminar is called with no selection', () => {
      component.selectedFabricantesNacionales = [];
      component.abrirModalEliminar();
      expect(() => component.abrirModalEliminar()).not.toThrow();
    });

    it('should open modal when abrirModalAgregar is called with selection', () => {
      component.selectedFabricantesNacionales = [mockHistoricoData];
      component.fabricantesAsociados = [];
      component.abrirModalAgregar();
      expect(() => component.abrirModalAgregar()).not.toThrow();
    });
  });

  describe('Getter Properties', () => {
    it('should return correct value for puedeEliminar when selectedFabricantes has items', () => {
      component.selectedFabricantes = [mockHistoricoData];
      expect(component.puedeEliminar).toBe(true);
    });

    it('should return false for puedeEliminar when selectedFabricantes is empty', () => {
      component.selectedFabricantes = [];
      expect(component.puedeEliminar).toBe(false);
    });

    it('should return filtered radio options', () => {
      const options = component.filteredRadioOptions;
      expect(Array.isArray(options)).toBe(true);
    });
  });

  describe('Form Validation and State', () => {
    it('should handle onValueChange method', () => {
      const testValue = 'testValue';
      component.onValueChange(testValue);
      expect(component.selectedValue).toBe(testValue);
    });

    it('should validate form state', () => {
      expect(component.esFormaValido).toBeDefined();
      expect(typeof component.esFormaValido).toBe('boolean');
    });

    it('should handle form error messages', () => {
      expect(component.formularioAlertaError).toBeDefined();
      expect(typeof component.formularioAlertaError).toBe('string');
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle ngOnDestroy', () => {
      const spy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(spy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Business Logic Methods', () => {
    it('should handle eliminarFabricantesAsociados', () => {
      const formBuilder = TestBed.inject(FormBuilder);
      
      component.historicoFabricantesForm = formBuilder.group({
        fabricantesAsociados: [[mockHistoricoData]],
        exportadorFabricanteMismo: [''],
        numeroRegistroFiscal: [''],
      });
      

      component.selectedFabricantes = [mockHistoricoData];
      component.fabricantesAsociados = [mockHistoricoData];
      
      expect(component.selectedFabricantes.length).toBeGreaterThan(0);
      expect(component.fabricantesAsociados.length).toBeGreaterThan(0);
      
      jest.clearAllMocks();
      
      component.eliminarFabricantesAsociados();
      
      expect(component.selectedFabricantes).toEqual([]);
      expect(component.fabricantesAsociados).toEqual([]);
    });

    it('should handle asociadasFabricanteNuevo with valid RFC', () => {
      component.fabricantesNacionales = [mockHistoricoData];
      component.historicoFabricantesForm.get('numeroRegistroFiscal')?.setValue('RFC123456789');
      
      component.asociadasFabricanteNuevo();
      
      expect(component.fabricantesAsociados).toEqual([mockHistoricoData]);
    });

    it('should handle asociadasFabricanteNuevo with invalid RFC', () => {
      component.fabricantesNacionales = [mockHistoricoData];
      component.historicoFabricantesForm.get('numeroRegistroFiscal')?.setValue('INVALID_RFC');
      
      component.asociadasFabricanteNuevo();
      
      expect(component.fabricantesAsociados).toEqual([]);
    });
  });

  describe('Static Methods', () => {
    it('should handle verDetalle static method', () => {
      expect(() => HistoricoFabricantesComponent.verDetalle({})).not.toThrow();
    });
  });
});