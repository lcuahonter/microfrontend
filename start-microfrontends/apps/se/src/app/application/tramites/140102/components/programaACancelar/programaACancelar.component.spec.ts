import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramaACancelarComponent } from './programaACancelar.component';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { ProgramaACancelarService } from '../../services/programACancelar.service';
import { Tramite140101Store } from '../../../../estados/tramites/tramite140101.store';
import { Tramite140101Query } from '../../../../estados/queries/tramite140101.query';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src/core/services/shared/validaciones-formulario/validaciones-formulario.service';
import { ServiciosService } from '../../../../shared/services/servicios.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProgramaACancelar } from '../../../../shared/models/programa-cancelar.model';

describe('ProgramaACancelarComponent', () => {
  let component: ProgramaACancelarComponent;
  let fixture: ComponentFixture<ProgramaACancelarComponent>;
  let mockProgramaACancelarService: any;
  let mockTramite140101Store: any;
  let mockTramite140101Query: any;
  let mockFormValidator: any;
  let mockServiciosService: any;
  let mockChangeDetectorRef: any;

  const mockProgramaData: ProgramaACancelar = {
    folioPrograma: 'FOL123', 
    idProgramaSeleccionado: '1', 
    modalidad: 'MOD', 
    representacionFederal: 'REP', 
    tipoPrograma: 'TIPO', 
    estatus: 'ACTIVO',
    idProgramaAutorizado: 'AUTH123',
    movimientoProgramaSE: 'MOV001',
    rfc: 'RFC123456789',
    resolucion: 'RES001',
    unidadAdministrativa: 'UNIDAD001',
    fechaInicioVigencia: '2024-01-01',
    fechaFinVigencia: '2024-12-31',
    actividadProductiva: 'ACTIVIDAD001',
    fechaSuspension: null,
    contadorGrid: 1,
    idProgramaCompuesto: 'COMP001'
  };

  beforeEach(async () => {
    mockProgramaACancelarService = {
      obtenerDatos: jest.fn().mockReturnValue(of([mockProgramaData]))
    };
    mockTramite140101Store = {
      setDatosData: jest.fn(),
      setPrograma: jest.fn(),
      setRadioSelection: jest.fn()
    };
    mockTramite140101Query = {
      selectSolicitud$: of({
        programaACancelar: mockProgramaData,
        solicitudObservaciones: 'Obs',
        confirmar: true,
        radio: 0,
        datos: [mockProgramaData]
      })
    };
    mockFormValidator = {
      isValid: jest.fn().mockReturnValue(true)
    };
    mockServiciosService = {
      obtenerDatos: jest.fn().mockReturnValue(of({ datos: [mockProgramaData] })),
      cancelarProgramas: jest.fn().mockReturnValue(of({}))
    };
    mockChangeDetectorRef = {
      detectChanges: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ProgramaACancelarComponent, HttpClientTestingModule],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: ProgramaACancelarService, useValue: mockProgramaACancelarService },
        { provide: Tramite140101Store, useValue: mockTramite140101Store },
        { provide: Tramite140101Query, useValue: mockTramite140101Query },
        { provide: ValidacionesFormularioService, useValue: mockFormValidator },
        { provide: ServiciosService, useValue: mockServiciosService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramaACancelarComponent);
    component = fixture.componentInstance;
    component.idTipoTramite = '140101'; // Set required input
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('debe crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debe inicializar propiedades públicas correctamente', () => {
      // After fixture.detectChanges(), ngOnInit runs and sets radioId from state
      expect(component.radioId).toBe(0); // Set from mock state
      expect(component.datosTabla).toEqual([mockProgramaData]); // Set from mock state
      expect(component.totalItems).toBe(0);
      expect(component.currentPage).toBe(1);
      expect(component.itemsPerPage).toBe(5);
      expect(component.soloLectura).toBe(false);
    });

    it('debe llamar cargarDatos y inicializarFormulario en ngOnInit', () => {
      const cargarDatosSpy = jest.spyOn(component, 'cargarDatos');
      const inicializarFormularioSpy = jest.spyOn(component, 'inicializarFormulario');
      
      component.ngOnInit();
      
      expect(cargarDatosSpy).toHaveBeenCalled();
      expect(inicializarFormularioSpy).toHaveBeenCalled();
    });
  });

  describe('Form Initialization', () => {
    it('debe inicializar el formulario con los valores correctos del estado', () => {
      component.inicializarFormulario();
      
      expect(component.programaForm).toBeDefined();
      expect(component.programaForm.get('folioPrograma')?.value).toBe('FOL123');
      expect(component.programaForm.get('idProgramaSeleccionado')?.value).toBe('1');
      expect(component.programaForm.get('solicitudObservaciones')?.value).toBe('Obs');
      expect(component.programaForm.get('confirmar')?.value).toBe(true);
    });

    it('debe deshabilitar el formulario si soloLectura es true', () => {
      component.soloLectura = true;
      component.inicializarFormulario();
      
      expect(component.programaForm.disabled).toBe(true);
    });

    it('debe manejar estado undefined en inicializarFormulario', () => {
      mockTramite140101Query.selectSolicitud$ = of(undefined);
      
      expect(() => component.inicializarFormulario()).not.toThrow();
    });

    it('debe establecer radioId y datosTabla correctamente', () => {
      component.inicializarFormulario();
      
      expect(component.radioId).toBe(0);
      expect(component.datosTabla).toEqual([mockProgramaData]);
    });
  });

  describe('Data Loading', () => {
    it('debe cargar datos correctamente', () => {
      component.cargarDatos();
      
      expect(mockServiciosService.obtenerDatos).toHaveBeenCalledWith('140101', 'AAL0409235E6');
      expect(mockTramite140101Store.setDatosData).toHaveBeenCalledWith([mockProgramaData]);
      expect(component.datosTabla).toEqual([mockProgramaData]);
    });

    it('debe manejar datos vacíos en cargarDatos', () => {
      mockServiciosService.obtenerDatos.mockReturnValue(of({ datos: null }));
      
      component.cargarDatos();
      
      expect(component.datosTabla).toEqual([]);
    });

    it('debe manejar respuesta sin propiedad datos', () => {
      mockServiciosService.obtenerDatos.mockReturnValue(of({}));
      
      component.cargarDatos();
      
      expect(component.datosTabla).toEqual([]);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.inicializarFormulario();
    });

    it('debe llamar a formValidator.isValid en isValid()', () => {
      const result = component.isValid('folioPrograma');
      
      expect(mockFormValidator.isValid).toHaveBeenCalledWith(component.programaForm, 'folioPrograma');
      expect(result).toBe(true);
    });

    it('debe retornar false cuando formValidator.isValid retorna false', () => {
      mockFormValidator.isValid.mockReturnValue(false);
      
      const result = component.isValid('folioPrograma');
      
      expect(result).toBe(false);
    });

    it('debe retornar null cuando formValidator.isValid retorna null', () => {
      mockFormValidator.isValid.mockReturnValue(null);
      
      const result = component.isValid('folioPrograma');
      
      expect(result).toBe(null);
    });

    it('debe retornar true si el formulario es válido en isFormValido', () => {
      jest.spyOn(component.programaForm, 'valid', 'get').mockReturnValue(true);
      
      const result = component.isFormValido();
      
      expect(result).toBe(true);
    });

    it('debe marcar todos los campos como tocados y retornar false si el formulario es inválido', () => {
      jest.spyOn(component.programaForm, 'valid', 'get').mockReturnValue(false);
      const markAllAsTouchedSpy = jest.spyOn(component.programaForm, 'markAllAsTouched');
      
      const result = component.isFormValido();
      
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('debe verificar si un control es inválido en esInvalido', () => {
      const control = component.programaForm.get('solicitudObservaciones');
      if (control) {
        // Use Object.defineProperty to mock properties
        Object.defineProperty(control, 'invalid', { value: true, configurable: true });
        Object.defineProperty(control, 'touched', { value: true, configurable: true });
        Object.defineProperty(control, 'dirty', { value: false, configurable: true });
      }
      
      const result = component.esInvalido('solicitudObservaciones');
      
      expect(result).toBe(true);
    });

    it('debe retornar false si el control no existe en esInvalido', () => {
      const result = component.esInvalido('controlInexistente');
      
      expect(result).toBe(false);
    });

    it('debe retornar false si el control es válido en esInvalido', () => {
      const control = component.programaForm.get('solicitudObservaciones');
      if (control) {
        jest.spyOn(control, 'invalid', 'get').mockReturnValue(false);
      }
      
      const result = component.esInvalido('solicitudObservaciones');
      
      expect(result).toBe(false);
    });

    it('debe retornar false si el control no ha sido tocado ni modificado', () => {
      const control = component.programaForm.get('solicitudObservaciones');
      if (control) {
        Object.defineProperty(control, 'invalid', { value: true, configurable: true });
        Object.defineProperty(control, 'touched', { value: false, configurable: true });
        Object.defineProperty(control, 'dirty', { value: false, configurable: true });
      }
      
      const result = component.esInvalido('solicitudObservaciones');
      
      expect(result).toBe(false);
    });
  });

  describe('Row Selection', () => {
    beforeEach(() => {
      component.inicializarFormulario();
    });

    it('debe actualizar el formulario y el store al llamar valorDeAlternancia', () => {
      const row: ProgramaACancelar = { 
        ...mockProgramaData,
        folioPrograma: 'FOL999', 
        idProgramaSeleccionado: '2',
        idProgramaAutorizado: 'AUTH999'
      };
      component.datosTabla = [mockProgramaData, row];
      
      component.valorDeAlternancia(row);
      
      expect(mockTramite140101Store.setPrograma).toHaveBeenCalledWith(row);
      expect(mockTramite140101Store.setRadioSelection).toHaveBeenCalledWith(1);
      expect(component.radioId).toBe(1);
      expect(component.programaForm.get('folioPrograma')?.value).toBe('FOL999');
      expect(component.programaForm.get('idProgramaSeleccionado')?.value).toBe('2');
    });

    it('debe manejar fila no encontrada en datosTabla', () => {
      const row: ProgramaACancelar = { 
        ...mockProgramaData,
        idProgramaAutorizado: 'NO_EXISTE'
      };
      component.datosTabla = [mockProgramaData];
      
      component.valorDeAlternancia(row);
      
      expect(component.radioId).toBe(-1);
      expect(mockTramite140101Store.setRadioSelection).toHaveBeenCalledWith(-1);
    });

    it('debe encontrar correctamente el índice de la fila seleccionada', () => {
      const row = mockProgramaData;
      component.datosTabla = [row];
      
      component.valorDeAlternancia(row);
      
      expect(component.radioId).toBe(0);
    });
  });

  describe('Store Methods', () => {
    beforeEach(() => {
      component.inicializarFormulario();
    });

    it('debe actualizar el store con setValoresStore', () => {
      const mockStoreMethod = jest.fn();
      mockTramite140101Store.testMethod = mockStoreMethod;
      component.programaForm.patchValue({ folioPrograma: 'TEST_FOLIO' });
      
      component.setValoresStore(component.programaForm, 'folioPrograma', 'testMethod' as any);
      
      expect(mockStoreMethod).toHaveBeenCalledWith('TEST_FOLIO');
    });

    it('debe manejar campo inexistente en setValoresStore', () => {
      const mockStoreMethod = jest.fn();
      mockTramite140101Store.testMethod = mockStoreMethod;
      
      component.setValoresStore(component.programaForm, 'campoInexistente', 'testMethod' as any);
      
      expect(mockStoreMethod).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Component Lifecycle', () => {
    it('debe limpiar las suscripciones al destruir el componente', () => {
      const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
      const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('debe cancelar suscripciones usando takeUntil', () => {
      // Test that the destroy notifier completes subscriptions
      const spy = jest.spyOn(component.destroyNotifier$, 'next');
      const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
      
      component.ngOnDestroy();
      
      expect(spy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Input Properties', () => {
    it('debe aceptar soloLectura como input', () => {
      component.soloLectura = true;
      expect(component.soloLectura).toBe(true);
    });

    it('debe aceptar idTipoTramite como input', () => {
      component.idTipoTramite = '140102';
      expect(component.idTipoTramite).toBe('140102');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('debe manejar observable de estado que emite múltiples veces', () => {
      const stateSubject = new Subject();
      mockTramite140101Query.selectSolicitud$ = stateSubject.asObservable();
      
      // Create new component instance to avoid interference from beforeEach initialization
      const newComponent = TestBed.createComponent(ProgramaACancelarComponent).componentInstance;
      newComponent.idTipoTramite = '140101';
      
      // Initialize with new observable
      newComponent.inicializarFormulario();
      
      // Since the form is created synchronously with undefined state initially
      expect(newComponent.radioId).toBeUndefined();
      
      // Emit first state - this will update programaState via subscription
      stateSubject.next({ 
        programaACancelar: mockProgramaData, 
        radio: 1, 
        datos: [mockProgramaData],
        solicitudObservaciones: 'First obs',
        confirmar: false
      });
      
      // State is updated but radioId/datosTabla are only set during form initialization
      expect(newComponent.programaState.radio).toBe(1);
      
      // Emit second state
      stateSubject.next({ 
        programaACancelar: { ...mockProgramaData, folioPrograma: 'NEW_FOLIO' }, 
        radio: 2, 
        datos: [],
        solicitudObservaciones: 'Second obs',
        confirmar: true
      });
      
      expect(newComponent.programaState.radio).toBe(2);
      expect(newComponent.programaState.programaACancelar.folioPrograma).toBe('NEW_FOLIO');
    });

    it('debe manejar datos de array vacío en cargarDatos', () => {
      mockServiciosService.obtenerDatos.mockReturnValue(of({ datos: [] }));
      
      component.cargarDatos();
      
      expect(component.datosTabla).toEqual([]);
    });

    it('debe inicializar con formulario básico cuando no hay datos del estado', () => {
      mockTramite140101Query.selectSolicitud$ = of(null);
      
      component.inicializarFormulario();
      
      expect(component.programaForm).toBeDefined();
    });
  });
});