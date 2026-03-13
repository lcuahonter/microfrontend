import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { ControlesFisicoComponent } from './controles-fisico.component';
import { Tramite32609Store } from '../../../estados/tramites32609.store';
import { Tramite32609Query } from '../../../estados/tramites32609.query';

describe('ControlesFisicoComponent', () => {
  let component: ControlesFisicoComponent;
  let fixture: ComponentFixture<ControlesFisicoComponent>;
  let mockStore: jest.Mocked<Tramite32609Store>;
  let mockQuery: jest.Mocked<Tramite32609Query>;

  const mockSolicitudState = {
    perfiles: {
      procedimientoDocumentado: 'Procedimiento Documentado Test',
      indiqueNumero: '123',
      cargosFunciones: 'Cargo Test',
      casoContratarse: 'Caso Contratar Test',
      casoContar: 'Caso Contar Test',
      describirProcedimiento: 'Descripción Procedimiento Test',
      indiqueMecanismos: 'Mecanismos Test',
      indicarEmpleados: 'Empleados Test',
      indiqueIdentifica: 'Identifica Test',
      describaEmpresa: 'Empresa Test',
      indiqueAsegura: 'Asegura Test',
      procedimientoParaControl: 'Procedimiento Control Test',
      senaleRegistros: 'Registros Test',
      senaleQuien: 'Quien Test',
      describaRecepion: 'Recepcion Test',
      indiqueEncargado: 'Encargado Test',
      indiqueIdentfica: 'Identifica Test',
      senaleComo: 'Como Test',
      describaCaracteristicas: 'Características Test',
      senaleAccion: 'Accion Test',
      registroVisitantes: 'Visitantes Test'
    }
  };

  // Mock for InputRadioComponent
  const mockInputRadioComponent = {
    selector: 'app-input-radio',
    template: '<div></div>'
  };

  beforeEach(async () => {
    mockStore = {
      establecerDatos: jest.fn()
    } as any;

    mockQuery = {
      selectTramite32609$: of(mockSolicitudState)
    } as any;

    await TestBed.configureTestingModule({
      imports: [ControlesFisicoComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite32609Store, useValue: mockStore },
        { provide: Tramite32609Query, useValue: mockQuery }
      ]
    })
    .overrideComponent(ControlesFisicoComponent, {
      remove: {
        imports: []
      },
      add: {
        imports: [ReactiveFormsModule]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlesFisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with form created and state loaded', () => {
    expect(component.controlesFisico).toBeDefined();
    expect(component['solicitudState']).toEqual(mockSolicitudState);
  });

  describe('crearFormularioControlesFisico', () => {
    it('should create form with all required controls', () => {
      const expectedControls = [
        'procedimientoDocumentado', 'indiqueNumero', 'cargosFunciones', 
        'casoContratarse', 'casoContar', 'describirProcedimiento', 
        'indiqueMecanismos', 'indicarEmpleados', 'indiqueIdentifica', 
        'describaEmpresa', 'indiqueAsegura', 'procedimientoParaControl',
        'senaleRegistros', 'senaleQuien', 'describaRecepion', 
        'indiqueEncargado', 'indiqueIdentfica', 'senaleComo', 
        'describaCaracteristicas', 'senaleAccion', 'registroVisitantes'
      ];

      component['solicitudState'] = mockSolicitudState as any;
      component.crearFormularioControlesFisico();

      expectedControls.forEach(controlName => {
        expect(component.controlesFisico.get(controlName)).toBeDefined();
      });
    });

    it('should create form with state values', () => {
      component['solicitudState'] = mockSolicitudState as any;
      component.crearFormularioControlesFisico();

      expect(component.controlesFisico.get('procedimientoDocumentado')?.value).toBe('Procedimiento Documentado Test');
      expect(component.controlesFisico.get('indiqueNumero')?.value).toBe('123');
      expect(component.controlesFisico.get('cargosFunciones')?.value).toBe('Cargo Test');
      expect(component.controlesFisico.get('registroVisitantes')?.value).toBe('Visitantes Test');
    });

    it('should create form with empty values when state has no perfiles', () => {
      component['solicitudState'] = {} as any;
      component.crearFormularioControlesFisico();

      expect(component.controlesFisico.get('procedimientoDocumentado')?.value).toBe('');
      expect(component.controlesFisico.get('indiqueNumero')?.value).toBe('');
      expect(component.controlesFisico.get('cargosFunciones')?.value).toBe('');
    });

    it('should set required validators on all form controls', () => {
      component['solicitudState'] = mockSolicitudState as any;
      component.crearFormularioControlesFisico();

      Object.keys(component.controlesFisico.controls).forEach(controlName => {
        const control = component.controlesFisico.get(controlName);
        expect(control?.hasError('required')).toBeFalsy();
        
        control?.setValue('');
        expect(control?.hasError('required')).toBeTruthy();
      });
    });
  });

  describe('actualizarFormularioConEstado', () => {
    beforeEach(() => {
      component['solicitudState'] = mockSolicitudState as any;
      component.crearFormularioControlesFisico();
    });

    it('should update form controls with new state values', () => {
      const newState = {
        perfiles: {
          procedimientoDocumentado: 'Nuevo Procedimiento',
          indiqueNumero: '456',
          cargosFunciones: 'Nuevo Cargo',
          registroVisitantes: 'Nuevos Visitantes'
        }
      };

      component['solicitudState'] = newState as any;
      component.actualizarFormularioConEstado();

      expect(component.controlesFisico.get('procedimientoDocumentado')?.value).toBe('Nuevo Procedimiento');
      expect(component.controlesFisico.get('indiqueNumero')?.value).toBe('456');
      expect(component.controlesFisico.get('cargosFunciones')?.value).toBe('Nuevo Cargo');
      expect(component.controlesFisico.get('registroVisitantes')?.value).toBe('Nuevos Visitantes');
    });

    it('should not update when form is not initialized', () => {
      component.controlesFisico = null as any;
      
      expect(() => component.actualizarFormularioConEstado()).not.toThrow();
    });

    it('should not update when solicitudState has no perfiles', () => {
      component['solicitudState'] = {} as any;
      const initialValues = { ...component.controlesFisico.value };
      
      component.actualizarFormularioConEstado();
      
      expect(component.controlesFisico.value).toEqual(initialValues);
    });

    it('should skip fields with undefined, null or empty values', () => {
      component['solicitudState'] = {
        perfiles: {
          procedimientoDocumentado: '',
          indiqueNumero: '' as any,
          cargosFunciones: undefined,
          registroVisitantes: 'Valid Value'
        }
      } as any;

      const initialProcedimiento = component.controlesFisico.get('procedimientoDocumentado')?.value;
      const initialNumero = component.controlesFisico.get('indiqueNumero')?.value;
      const initialCargos = component.controlesFisico.get('cargosFunciones')?.value;

      component.actualizarFormularioConEstado();

      expect(component.controlesFisico.get('procedimientoDocumentado')?.value).toBe(initialProcedimiento);
      expect(component.controlesFisico.get('indiqueNumero')?.value).toBe(initialNumero);
      expect(component.controlesFisico.get('cargosFunciones')?.value).toBe(initialCargos);
      expect(component.controlesFisico.get('registroVisitantes')?.value).toBe('Valid Value');
    });
  });

  describe('setValoresStore', () => {
    beforeEach(() => {
      component['solicitudState'] = mockSolicitudState as any;
      component.crearFormularioControlesFisico();
    });

    it('should call store.establecerDatos with correct data when form and field are valid', () => {
      component.controlesFisico.get('procedimientoDocumentado')?.setValue('Nuevo Valor');
      
      component.setValoresStore(component.controlesFisico, 'procedimientoDocumentado');
      
      expect(mockStore.establecerDatos).toHaveBeenCalledWith({
        perfiles: { procedimientoDocumentado: 'Nuevo Valor' }
      });
    });

    it('should not call store when form is null', () => {
      component.setValoresStore(null, 'procedimientoDocumentado');
      
      expect(mockStore.establecerDatos).not.toHaveBeenCalled();
    });

    it('should not call store when control value is null', () => {
      component.controlesFisico.get('procedimientoDocumentado')?.setValue(null);
      
      component.setValoresStore(component.controlesFisico, 'procedimientoDocumentado');
      
      expect(mockStore.establecerDatos).not.toHaveBeenCalled();
    });

    it('should not call store when control value is undefined', () => {
      component.controlesFisico.get('procedimientoDocumentado')?.setValue(undefined);
      
      component.setValoresStore(component.controlesFisico, 'procedimientoDocumentado');
      
      expect(mockStore.establecerDatos).not.toHaveBeenCalled();
    });

    it('should call store when control value is empty string', () => {
      component.controlesFisico.get('procedimientoDocumentado')?.setValue('');
      
      component.setValoresStore(component.controlesFisico, 'procedimientoDocumentado');
      
      expect(mockStore.establecerDatos).toHaveBeenCalledWith({
        perfiles: { procedimientoDocumentado: '' }
      });
    });

    it('should not call store when field does not exist in form', () => {
      component.setValoresStore(component.controlesFisico, 'nonexistentField');
      
      expect(mockStore.establecerDatos).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyNotifier$ subject', () => {
      jest.spyOn(component['destroyNotifier$'], 'next');
      jest.spyOn(component['destroyNotifier$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(component['destroyNotifier$'].next).toHaveBeenCalled();
      expect(component['destroyNotifier$'].complete).toHaveBeenCalled();
    });
  });

  describe('Form Integration', () => {
    beforeEach(() => {
      component['solicitudState'] = mockSolicitudState as any;
      component.crearFormularioControlesFisico();
    });

    it('should validate form as invalid when required fields are empty', () => {
      Object.keys(component.controlesFisico.controls).forEach(controlName => {
        component.controlesFisico.get(controlName)?.setValue('');
      });

      expect(component.controlesFisico.valid).toBeFalsy();
    });

    it('should validate form as valid when all required fields have values', () => {
      Object.keys(component.controlesFisico.controls).forEach(controlName => {
        component.controlesFisico.get(controlName)?.setValue('Valid Value');
      });

      expect(component.controlesFisico.valid).toBeTruthy();
    });

    it('should have correct initial values from state', () => {
      expect(component.controlesFisico.get('procedimientoDocumentado')?.value).toBe('Procedimiento Documentado Test');
      expect(component.controlesFisico.get('indiqueNumero')?.value).toBe('123');
      expect(component.controlesFisico.get('registroVisitantes')?.value).toBe('Visitantes Test');
    });
  });
});
