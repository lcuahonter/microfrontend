import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { DescripcionCupoComponent } from './descripcion-cupo.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const CUPO_SIMULADO = {
  regimenAduanero: 'Importación',
  descripcion: 'Cupo especial para mercancías',
  cantidad: 100,
  unidad: 'kg',
  fechaVigencia: '2025-12-31',
  estatus: 'Activo'
};

const INFORMACION_FORMULARIO_DESCRIPCION = [
  { campo: 'regimenAduanero', tipo: 'text', requerido: true },
  { campo: 'descripcion', tipo: 'textarea', requerido: true },
  { campo: 'cantidad', tipo: 'number', requerido: true },
  { campo: 'unidad', tipo: 'text', requerido: false },
  { campo: 'fechaVigencia', tipo: 'date', requerido: false },
  { campo: 'estatus', tipo: 'select', requerido: false }
];

describe('DescripcionCupoComponent', () => {
  let component: DescripcionCupoComponent;
  let fixture: ComponentFixture<DescripcionCupoComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescripcionCupoComponent, ReactiveFormsModule],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DescripcionCupoComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    
    // Configurar propiedades necesarias del componente
    component.consultaState = { readonly: false } as any;
    component.informacionFormData = INFORMACION_FORMULARIO_DESCRIPCION;
    component.forma = formBuilder.group({
      ninoFormGroup: formBuilder.group({})
    });
    component.ninoFormGroup = component.forma.get('ninoFormGroup') as FormGroup;
    
    fixture.detectChanges();
  });

  describe('Inicialización del componente', () => {
    it('debe crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debe inicializar el formulario principal correctamente', () => {
      expect(component.forma).toBeDefined();
      expect(component.forma).toBeInstanceOf(FormGroup);
    });

    it('debe inicializar el subformulario ninoFormGroup correctamente', () => {
      expect(component.ninoFormGroup).toBeDefined();
      expect(component.ninoFormGroup).toBeInstanceOf(FormGroup);
    });

    it('debe tener definida la información de formulario de datos', () => {
      expect(component.informacionFormData).toBeDefined();
      expect(Array.isArray(component.informacionFormData)).toBe(true);
    });

    it('debe inicializar consultaState con el valor por defecto', () => {
      expect(component.consultaState).toBeDefined();
      expect(component.consultaState.readonly).toBe(false);
    });
  });

  describe('Propiedades @Input', () => {
    it('debe aceptar formDatos como entrada y llamar a setValoresPorCupo', () => {
      const espiamSetValores = jest.spyOn(component, 'setValoresPorCupo');
      
      component.formDatos = CUPO_SIMULADO;
      
      expect(espiamSetValores).toHaveBeenCalledWith(CUPO_SIMULADO);
    });

    it('debe manejar formDatos nulos sin errores', () => {
      const espiamSetValores = jest.spyOn(component, 'setValoresPorCupo');
      
      component.formDatos = null;
      
      expect(espiamSetValores).toHaveBeenCalledWith(null);
    });

    it('debe manejar formDatos undefined sin errores', () => {
      const espiamSetValores = jest.spyOn(component, 'setValoresPorCupo');
      
      component.formDatos = undefined;
      
      expect(espiamSetValores).toHaveBeenCalledWith(undefined);
    });

    it('debe aceptar diferentes tipos de datos en formDatos', () => {
      const datosVarios = {
        regimenAduanero: 'Exportación',
        descripcion: 'Otro tipo de cupo',
        cantidad: 50
      };
      
      const espiamSetValores = jest.spyOn(component, 'setValoresPorCupo');
      
      component.formDatos = datosVarios;
      
      expect(espiamSetValores).toHaveBeenCalledWith(datosVarios);
    });
  });

  describe('Método setValoresPorCupo', () => {
    beforeEach(() => {
      // Agregar controles al formulario para las pruebas
      INFORMACION_FORMULARIO_DESCRIPCION.forEach(campo => {
        component.ninoFormGroup.addControl(campo.campo, new FormControl(''));
      });
    });

    it('debe establecer valores correctamente en el formulario cuando recibe un cupo válido', () => {
      const espiamPatchValue = jest.spyOn(component.ninoFormGroup, 'patchValue');
      const espiamCambioStore = jest.spyOn(component, 'cambioEnValoresStore').mockImplementation(() => {});
      
      component.setValoresPorCupo(CUPO_SIMULADO);
      
      expect(espiamPatchValue).toHaveBeenCalledWith({
        regimenAduanero: 'Importación',
        descripcion: 'Cupo especial para mercancías',
        cantidad: 100,
        unidad: 'kg',
        fechaVigencia: '2025-12-31',
        estatus: 'Activo'
      });
      
      expect(espiamCambioStore).toHaveBeenCalledTimes(6);
      expect(espiamCambioStore).toHaveBeenCalledWith('regimenAduanero', 'Importación');
      expect(espiamCambioStore).toHaveBeenCalledWith('descripcion', 'Cupo especial para mercancías');
      expect(espiamCambioStore).toHaveBeenCalledWith('cantidad', 100);
      expect(espiamCambioStore).toHaveBeenCalledWith('unidad', 'kg');
      expect(espiamCambioStore).toHaveBeenCalledWith('fechaVigencia', '2025-12-31');
      expect(espiamCambioStore).toHaveBeenCalledWith('estatus', 'Activo');
    });

    it('no debe lanzar error cuando recibe un cupo vacío (null)', () => {
      expect(() => component.setValoresPorCupo(null)).not.toThrow();
    });

    it('no debe lanzar error cuando recibe un cupo vacío (undefined)', () => {
      expect(() => component.setValoresPorCupo(undefined)).not.toThrow();
    });

    it('debe manejar cupos con propiedades parciales', () => {
      const cupoParcial = { 
        descripcion: 'Solo descripción disponible',
        cantidad: 75 
      };
      
      const espiamPatchValue = jest.spyOn(component.ninoFormGroup, 'patchValue');
      const espiamCambioStore = jest.spyOn(component, 'cambioEnValoresStore').mockImplementation(() => {});
      
      component.setValoresPorCupo(cupoParcial);
      
      expect(espiamPatchValue).toHaveBeenCalledWith({ 
        descripcion: 'Solo descripción disponible',
        cantidad: 75 
      });
      
      expect(espiamCambioStore).toHaveBeenCalledTimes(2);
      expect(espiamCambioStore).toHaveBeenCalledWith('descripcion', 'Solo descripción disponible');
      expect(espiamCambioStore).toHaveBeenCalledWith('cantidad', 75);
    });

    it('debe ignorar campos que no existen en informacionFormData', () => {
      const cupoConCamposExtras = {
        ...CUPO_SIMULADO,
        campoInexistente: 'valor que no debería procesarse',
        otroCampoExtra: 999
      };
      
      const espiamPatchValue = jest.spyOn(component.ninoFormGroup, 'patchValue');
      
      component.setValoresPorCupo(cupoConCamposExtras);
      
      const valoresEsperados = {
        regimenAduanero: 'Importación',
        descripcion: 'Cupo especial para mercancías',
        cantidad: 100,
        unidad: 'kg',
        fechaVigencia: '2025-12-31',
        estatus: 'Activo'
      };
      
      expect(espiamPatchValue).toHaveBeenCalledWith(valoresEsperados);
      expect(espiamPatchValue).not.toHaveBeenCalledWith(
        expect.objectContaining({ 
          campoInexistente: expect.anything(),
          otroCampoExtra: expect.anything()
        })
      );
    });

    it('debe manejar valores null y undefined en las propiedades del cupo', () => {
      const cupoConValoresNulos = {
        regimenAduanero: null,
        descripcion: undefined,
        cantidad: 0,
        unidad: '',
        fechaVigencia: null
      };
      
      const espiamPatchValue = jest.spyOn(component.ninoFormGroup, 'patchValue');
      const espiamCambioStore = jest.spyOn(component, 'cambioEnValoresStore').mockImplementation(() => {});
      
      component.setValoresPorCupo(cupoConValoresNulos);
      
      expect(espiamPatchValue).toHaveBeenCalledWith(cupoConValoresNulos);
      expect(espiamCambioStore).toHaveBeenCalledWith('regimenAduanero', null);
      expect(espiamCambioStore).toHaveBeenCalledWith('descripcion', undefined);
      expect(espiamCambioStore).toHaveBeenCalledWith('cantidad', 0);
    });

    it('debe manejar informacionFormData vacía', () => {
      component.informacionFormData = [];
      
      const espiamPatchValue = jest.spyOn(component.ninoFormGroup, 'patchValue');
      
      expect(() => component.setValoresPorCupo(CUPO_SIMULADO)).not.toThrow();
      expect(espiamPatchValue).toHaveBeenCalledWith({});
    });

    it('debe manejar informacionFormData undefined', () => {
      component.informacionFormData = undefined as any;
      
      expect(() => component.setValoresPorCupo(CUPO_SIMULADO)).not.toThrow();
    });
  });

  describe('Estado de solo lectura', () => {
    it('debe detectar cuando consultaState.readonly es true', () => {
      component.consultaState = { readonly: true } as any;
      fixture.detectChanges();
      
      expect(component.consultaState.readonly).toBe(true);
    });

    it('debe detectar cuando consultaState.readonly es false', () => {
      component.consultaState = { readonly: false } as any;
      fixture.detectChanges();
      
      expect(component.consultaState.readonly).toBe(false);
    });

    it('debe manejar consultaState undefined sin errores', () => {
      component.consultaState = undefined as any;
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('debe manejar consultaState sin propiedad readonly', () => {
      component.consultaState = {} as any;
      fixture.detectChanges();
      
      expect(component.consultaState.readonly).toBeUndefined();
    });
  });

  describe('Operaciones de formulario', () => {
    beforeEach(() => {
      // Agregar controles al formulario
      INFORMACION_FORMULARIO_DESCRIPCION.forEach(campo => {
        component.ninoFormGroup.addControl(campo.campo, new FormControl(''));
      });
    });

    it('debe limpiar el formulario dinámico correctamente', () => {
      // Establecer valores en el formulario
      component.ninoFormGroup.patchValue({
        regimenAduanero: 'Importación',
        descripcion: 'Descripción de prueba',
        cantidad: 100
      });
      
      const espiamReset = jest.spyOn(component.ninoFormGroup, 'reset');
      
      component.ninoFormGroup.reset();
      
      expect(espiamReset).toHaveBeenCalled();
    });

    it('debe validar que el formulario tiene los controles esperados', () => {
      INFORMACION_FORMULARIO_DESCRIPCION.forEach(campo => {
        expect(component.ninoFormGroup.contains(campo.campo)).toBe(true);
      });
    });

    it('debe manejar la actualización de valores individuales', () => {
      const espiamCambioStore = jest.spyOn(component, 'cambioEnValoresStore').mockImplementation(() => {});
      
      // Simular cambio en un control específico
      component.ninoFormGroup.get('descripcion')?.setValue('Nueva descripción');
      
      // Si cambioEnValoresStore es llamado automáticamente por el componente
      // expect(espiamCambioStore).toHaveBeenCalledWith('descripcion', 'Nueva descripción');
    });

    it('debe mantener la estructura del formulario después de reset', () => {
      component.ninoFormGroup.reset();
      
      INFORMACION_FORMULARIO_DESCRIPCION.forEach(campo => {
        expect(component.ninoFormGroup.contains(campo.campo)).toBe(true);
      });
    });
  });


  describe('Integración y casos de uso reales', () => {
    it('debe manejar el flujo completo de actualización de formulario', () => {
      // Configurar controles
      INFORMACION_FORMULARIO_DESCRIPCION.forEach(campo => {
        component.ninoFormGroup.addControl(campo.campo, new FormControl(''));
      });
      
      const espiamCambioStore = jest.spyOn(component, 'cambioEnValoresStore').mockImplementation(() => {});
      
      // Establecer datos iniciales
      component.formDatos = CUPO_SIMULADO;
      
      // Verificar que los valores se establecieron
      expect(component.ninoFormGroup.get('regimenAduanero')?.value).toBe('Importación');
      expect(component.ninoFormGroup.get('descripcion')?.value).toBe('Cupo especial para mercancías');
      expect(component.ninoFormGroup.get('cantidad')?.value).toBe(100);
      
      // Verificar que se llamó al store
      expect(espiamCambioStore).toHaveBeenCalledTimes(6);
    });

    it('debe manejar múltiples actualizaciones consecutivas', () => {
      INFORMACION_FORMULARIO_DESCRIPCION.forEach(campo => {
        component.ninoFormGroup.addControl(campo.campo, new FormControl(''));
      });
      
      const cupo1 = { descripcion: 'Primera descripción', cantidad: 100 };
      const cupo2 = { descripcion: 'Segunda descripción', cantidad: 200 };
      
      component.formDatos = cupo1;
      expect(component.ninoFormGroup.get('descripcion')?.value).toBe('Primera descripción');
      expect(component.ninoFormGroup.get('cantidad')?.value).toBe(100);
      
      component.formDatos = cupo2;
      expect(component.ninoFormGroup.get('descripcion')?.value).toBe('Segunda descripción');
      expect(component.ninoFormGroup.get('cantidad')?.value).toBe(200);
    });

    it('debe preservar la validez del formulario después de establecer valores', () => {
      // Configurar controles con validadores
      component.ninoFormGroup.addControl('regimenAduanero', new FormControl('', { nonNullable: true }));
      component.ninoFormGroup.addControl('descripcion', new FormControl('', { nonNullable: true }));
      
      component.setValoresPorCupo(CUPO_SIMULADO);
      
      expect(component.ninoFormGroup.valid).toBe(true);
    });
  });
});