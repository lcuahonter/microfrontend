import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ControlesFisicoComponent } from './controles-fisico.component';
import { Solicitud32605Store } from '../../../estados/solicitud32605.store';
import { Solicitud32605Query } from '../../../estados/solicitud32605.query';

describe('ControlesFisicoComponent', () => {
  let component: ControlesFisicoComponent;
  let fixture: ComponentFixture<ControlesFisicoComponent>;
  let mockStore: any;
  let mockQuery: any;
  let formBuilder: FormBuilder;

  const mockSolicitudState = {
    perfiles: {
      procedimientoDocumentado: 'Test procedimiento',
      indiqueNumero: 'Test numero',
      cargosFunciones: 'Test cargos',
      casoContratarse: 'Test caso',
      casoContar: 'Test contar',
      describirProcedimiento: 'Test descripcion',
      indiqueMecanismos: 'Test mecanismos',
      indicarEmpleados: 'Test empleados',
      indiqueIdentifica: 'Test identifica',
      describaEmpresa: 'Test empresa',
      indiqueAsegura: 'Test asegura',
      procedimientoParaControl: 'Test control',
      senaleRegistros: 'Test registros',
      senaleQuien: 'Test quien',
      describaRecepion: 'Test recepcion',
      indiqueEncargado: 'Test encargado',
      indiqueIdentfica: 'Test identifica2',
      senaleComo: 'Test como',
      describaCaracteristicas: 'Test caracteristicas',
      senaleAccion: 'Test accion',
      registroVisitantes: 'Test visitantes'
    }
  };

  beforeEach(async () => {
    mockStore = {
      actualizarEstado: jest.fn()
    };

    mockQuery = {
      selectSolicitud$: of(mockSolicitudState)
    };

    await TestBed.configureTestingModule({
      imports: [ControlesFisicoComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Solicitud32605Store, useValue: mockStore },
        { provide: Solicitud32605Query, useValue: mockQuery }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlesFisicoComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario en ngOnInit', () => {
    expect(component.controlesFisico).toBeDefined();
    expect(component.controlesFisico.get('procedimientoDocumentado')).toBeDefined();
    expect(component.controlesFisico.get('indiqueNumero')).toBeDefined();
    expect(component.controlesFisico.get('cargosFunciones')).toBeDefined();
  });

  describe('actualizarFormularioConEstado', () => {
    beforeEach(() => {
      component.crearFormularioControlesFisico();
    });

    it('debe retornar si controlesFisico es null', () => {
      component.controlesFisico = null as any;
      
      expect(() => component.actualizarFormularioConEstado()).not.toThrow();
    });

    it('debe retornar si solicitudState.perfiles es null', () => {
      (component as any).solicitudState = { perfiles: null };
      
      expect(() => component.actualizarFormularioConEstado()).not.toThrow();
    });

    it('debe retornar si solicitudState es null', () => {
      (component as any).solicitudState = null;
      
      expect(() => component.actualizarFormularioConEstado()).not.toThrow();
    });

    it('debe actualizar controles del formulario con valores del estado', () => {
      (component as any).solicitudState = mockSolicitudState;
      
      component.controlesFisico.get('procedimientoDocumentado')?.setValue('Old value');
      component.controlesFisico.get('indiqueNumero')?.setValue('Old number');
      
      component.actualizarFormularioConEstado();
      
      expect(component.controlesFisico.get('procedimientoDocumentado')?.value).toBe('Test procedimiento');
      expect(component.controlesFisico.get('indiqueNumero')?.value).toBe('Test numero');
    });

    it('no debe actualizar controles si el valor del estado es undefined', () => {
      (component as any).solicitudState = {
        perfiles: {
          procedimientoDocumentado: undefined,
          indiqueNumero: 'Valid value'
        }
      };
      
      component.controlesFisico.get('procedimientoDocumentado')?.setValue('Original value');
      component.controlesFisico.get('indiqueNumero')?.setValue('Original number');
      
      component.actualizarFormularioConEstado();
      
      expect(component.controlesFisico.get('procedimientoDocumentado')?.value).toBe('Original value');
      expect(component.controlesFisico.get('indiqueNumero')?.value).toBe('Valid value');
    });

    it('no debe actualizar controles si el valor del estado es null', () => {
      (component as any).solicitudState = {
        perfiles: {
          procedimientoDocumentado: null,
          indiqueNumero: 'Valid value'
        }
      };
      
      component.controlesFisico.get('procedimientoDocumentado')?.setValue('Original value');
      
      component.actualizarFormularioConEstado();
      
      expect(component.controlesFisico.get('procedimientoDocumentado')?.value).toBe('Original value');
    });

    it('no debe actualizar controles si el valor del estado es string vacío', () => {
      (component as any).solicitudState = {
        perfiles: {
          procedimientoDocumentado: '',
          indiqueNumero: 'Valid value'
        }
      };
      
      component.controlesFisico.get('procedimientoDocumentado')?.setValue('Original value');
      
      component.actualizarFormularioConEstado();
      
      expect(component.controlesFisico.get('procedimientoDocumentado')?.value).toBe('Original value');
    });

    it('no debe actualizar controles si el valor ya es igual', () => {
      (component as any).solicitudState = {
        perfiles: {
          procedimientoDocumentado: 'Same value'
        }
      };
      
      component.controlesFisico.get('procedimientoDocumentado')?.setValue('Same value');
      const setValueSpy = jest.spyOn(component.controlesFisico.get('procedimientoDocumentado')!, 'setValue');
      
      component.actualizarFormularioConEstado();
      
      expect(setValueSpy).not.toHaveBeenCalled();
    });

    it('debe actualizar múltiples controles correctamente', () => {
      (component as any).solicitudState = mockSolicitudState;
      
      component.controlesFisico.get('procedimientoDocumentado')?.setValue('Old 1');
      component.controlesFisico.get('cargosFunciones')?.setValue('Old 2');
      component.controlesFisico.get('describaEmpresa')?.setValue('Old 3');
      
      component.actualizarFormularioConEstado();
      
      expect(component.controlesFisico.get('procedimientoDocumentado')?.value).toBe('Test procedimiento');
      expect(component.controlesFisico.get('cargosFunciones')?.value).toBe('Test cargos');
      expect(component.controlesFisico.get('describaEmpresa')?.value).toBe('Test empresa');
    });
  });

  describe('setValoresStore', () => {
    let testForm: FormGroup;

    beforeEach(() => {
      testForm = formBuilder.group({
        testField: ['test value'],
        nullField: [null],
        undefinedField: [undefined],
        emptyStringField: [''],
        numberField: [123],
        booleanField: [true]
      });
      
      jest.clearAllMocks();
    });

    it('debe retornar si el form es null', () => {
      component.setValoresStore(null, 'testField');
      
      expect(mockStore.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe actualizar el store cuando el control tiene un valor válido', () => {
      component.setValoresStore(testForm, 'testField');
      
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { testField: 'test value' }
      });
    });

    it('no debe actualizar el store cuando el control tiene valor null', () => {
      component.setValoresStore(testForm, 'nullField');
      
      expect(mockStore.actualizarEstado).not.toHaveBeenCalled();
    });

    it('no debe actualizar el store cuando el control tiene valor undefined', () => {
      component.setValoresStore(testForm, 'undefinedField');
      
      expect(mockStore.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe actualizar el store cuando el control tiene string vacío', () => {
      component.setValoresStore(testForm, 'emptyStringField');
      
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { emptyStringField: '' }
      });
    });

    it('no debe actualizar el store si el control no existe', () => {
      component.setValoresStore(testForm, 'nonExistentField');
      
      expect(mockStore.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe manejar valores numéricos correctamente', () => {
      component.setValoresStore(testForm, 'numberField');
      
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { numberField: 123 }
      });
    });

    it('debe manejar valores booleanos correctamente', () => {
      component.setValoresStore(testForm, 'booleanField');
      
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { booleanField: true }
      });
    });

    it('debe manejar múltiples campos correctamente', () => {
      component.setValoresStore(testForm, 'testField');
      component.setValoresStore(testForm, 'numberField');
      
      expect(mockStore.actualizarEstado).toHaveBeenCalledTimes(2);
      expect(mockStore.actualizarEstado).toHaveBeenNthCalledWith(1, {
        perfiles: { testField: 'test value' }
      });
      expect(mockStore.actualizarEstado).toHaveBeenNthCalledWith(2, {
        perfiles: { numberField: 123 }
      });
    });
  });

  describe('Métodos estáticos auxiliares', () => {
    it('debe crear controles principales correctamente', () => {
      const perfiles = {
        procedimientoDocumentado: 'Test',
        indiqueNumero: '123'
      };
      
      const controles = (ControlesFisicoComponent as any).crearControlesPrincipales(perfiles);
      
      expect(controles.procedimientoDocumentado[0]).toBe('Test');
      expect(controles.indiqueNumero[0]).toBe('123');
      expect(controles.cargosFunciones[0]).toBe('');
    });

    it('debe crear controles secundarios correctamente', () => {
      const perfiles = {
        indiqueAsegura: 'Test seguridad',
        senaleRegistros: 'Test registros'
      };
      
      const controles = (ControlesFisicoComponent as any).crearControlesSecundarios(perfiles);
      
      expect(controles.indiqueAsegura[0]).toBe('Test seguridad');
      expect(controles.senaleRegistros[0]).toBe('Test registros');
      expect(controles.procedimientoParaControl[0]).toBe('');
    });
  });

  describe('Ciclo de vida del componente', () => {
    it('debe limpiar las suscripciones en ngOnDestroy', () => {
      const destroySpy = jest.spyOn((component as any).destroyNotifier$, 'next');
      const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
      
      component.ngOnDestroy();
      
      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('debe suscribirse al estado en ngOnInit', () => {
      const subscribeSpy = jest.spyOn(mockQuery.selectSolicitud$, 'pipe');
      
      component.ngOnInit();
      
      expect(subscribeSpy).toHaveBeenCalled();
    });
  });
});
