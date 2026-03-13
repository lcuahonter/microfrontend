import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { SeguridadFisicaComponent } from './seguridad-fisica.component';
import { Solicitud32605Store } from '../../../estados/solicitud32605.store';
import { Solicitud32605Query } from '../../../estados/solicitud32605.query';

describe('SeguridadFisicaComponent', () => {
  let component: SeguridadFisicaComponent;
  let fixture: ComponentFixture<SeguridadFisicaComponent>;
  let storeMock: any;
  let queryMock: any;

  const mockSolicitudState = {
    perfiles: {
      indiqueMateriales: 'Test Material',
      queForma: 'Test Forma',
      personalResponsable: 'Test Personal',
      indiqueCuantas: 'Test Cuantas',
      indiqueMonitoreadas: 'Test Monitoreadas',
      detalleExisten: 'Test Detalle',
      describaAcceso: 'Test Acceso',
      describirTipo: 'Test Tipo',
      describaAreas: 'Test Areas',
      senaleMismas: 'Test Señale',
      casoNoContar: 'Test Caso',
      periodicidadVerifica: 'Test Periodicidad',
      indiqueTareas: 'Test Tareas',
      describaManera: 'Test Manera',
      indiqueSepara: 'Test Separa',
      senaleRestringido: 'Test Restringido',
      describaMonitoreo: 'Test Monitoreo',
      responsablesControlar: 'Test Responsables',
      estacionamientos: 'Test Estacionamientos',
      llevaEntrada: 'Test Entrada'
    }
  };

  beforeEach(async () => {
    storeMock = {
      actualizarEstado: jest.fn()
    };

    queryMock = {
      selectSolicitud$: of(mockSolicitudState)
    };

    await TestBed.configureTestingModule({
      imports: [SeguridadFisicaComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Solicitud32605Store, useValue: storeMock },
        { provide: Solicitud32605Query, useValue: queryMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguridadFisicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar correctamente en ngOnInit', () => {
    component.ngOnInit();
    expect(component.seguridadFisicaForm).toBeDefined();
  });

  describe('actualizarFormularioConEstado', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('debe retornar si seguridadFisicaForm no está definido', () => {
      component.seguridadFisicaForm = null as any;
      
      expect(() => component.actualizarFormularioConEstado()).not.toThrow();
    });

    it('debe retornar si solicitudState.perfiles no está definido', () => {
      component['solicitudState'] = { perfiles: null } as any;
      
      expect(() => component.actualizarFormularioConEstado()).not.toThrow();
    });

    it('debe actualizar controles del formulario con valores del estado', () => {
      component.seguridadFisicaForm.get('indiqueMateriales')?.setValue('Old Value');
      component.seguridadFisicaForm.get('queForma')?.setValue('Old Forma');
      
      component['solicitudState'] = {
        perfiles: {
          indiqueMateriales: 'New Material Value',
          queForma: 'New Forma Value',
          personalResponsable: 'New Personal'
        }
      } as any;

      component.actualizarFormularioConEstado();

      expect(component.seguridadFisicaForm.get('indiqueMateriales')?.value).toBe('New Material Value');
      expect(component.seguridadFisicaForm.get('queForma')?.value).toBe('New Forma Value');
      expect(component.seguridadFisicaForm.get('personalResponsable')?.value).toBe('New Personal');
    });

    it('no debe actualizar controles cuando STATE_VALUE es undefined', () => {
      const initialValue = 'Initial Value';
      component.seguridadFisicaForm.get('indiqueMateriales')?.setValue(initialValue);
      
      component['solicitudState'] = {
        perfiles: {
          indiqueMateriales: undefined
        }
      } as any;

      component.actualizarFormularioConEstado();

      expect(component.seguridadFisicaForm.get('indiqueMateriales')?.value).toBe(initialValue);
    });

    it('no debe actualizar controles cuando STATE_VALUE es null', () => {
      const initialValue = 'Initial Value';
      component.seguridadFisicaForm.get('indiqueMateriales')?.setValue(initialValue);
      
      component['solicitudState'] = {
        perfiles: {
          indiqueMateriales: null
        }
      } as any;

      component.actualizarFormularioConEstado();

      expect(component.seguridadFisicaForm.get('indiqueMateriales')?.value).toBe(initialValue);
    });

    it('no debe actualizar controles cuando STATE_VALUE es string vacío', () => {
      const initialValue = 'Initial Value';
      component.seguridadFisicaForm.get('indiqueMateriales')?.setValue(initialValue);
      
      component['solicitudState'] = {
        perfiles: {
          indiqueMateriales: ''
        }
      } as any;

      component.actualizarFormularioConEstado();

      expect(component.seguridadFisicaForm.get('indiqueMateriales')?.value).toBe(initialValue);
    });

    it('no debe actualizar control cuando el valor actual es igual al STATE_VALUE', () => {
      const sameValue = 'Same Value';
      const control = component.seguridadFisicaForm.get('indiqueMateriales');
      control?.setValue(sameValue);
      
      const setValueSpy = jest.spyOn(control!, 'setValue');
      
      component['solicitudState'] = {
        perfiles: {
          indiqueMateriales: sameValue
        }
      } as any;

      component.actualizarFormularioConEstado();

      expect(setValueSpy).not.toHaveBeenCalled();
    });

    it('debe actualizar múltiples controles correctamente', () => {
      component['solicitudState'] = {
        perfiles: {
          indiqueMateriales: 'Material 1',
          queForma: 'Forma 1',
          personalResponsable: 'Personal 1',
          indiqueCuantas: 'Cuantas 1',
          indiqueMonitoreadas: 'Monitoreadas 1'
        }
      } as any;

      component.actualizarFormularioConEstado();

      expect(component.seguridadFisicaForm.get('indiqueMateriales')?.value).toBe('Material 1');
      expect(component.seguridadFisicaForm.get('queForma')?.value).toBe('Forma 1');
      expect(component.seguridadFisicaForm.get('personalResponsable')?.value).toBe('Personal 1');
      expect(component.seguridadFisicaForm.get('indiqueCuantas')?.value).toBe('Cuantas 1');
      expect(component.seguridadFisicaForm.get('indiqueMonitoreadas')?.value).toBe('Monitoreadas 1');
    });
  });

  describe('setValoresStore', () => {
    let testForm: FormGroup;
    let fb: FormBuilder;

    beforeEach(() => {
      fb = TestBed.inject(FormBuilder);
      testForm = fb.group({
        testField: ['test value'],
        nullField: [null],
        undefinedField: [undefined],
        emptyStringField: [''],
        numberField: [123],
        booleanField: [true]
      });
    });

    it('debe retornar temprano si form es null', () => {
      component.setValoresStore(null, 'testField');
      expect(storeMock.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe actualizar el store cuando el control tiene un valor válido string', () => {
      component.setValoresStore(testForm, 'testField');
      expect(storeMock.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { testField: 'test value' }
      });
    });

    it('no debe actualizar el store cuando el control tiene valor null', () => {
      jest.clearAllMocks();
      component.setValoresStore(testForm, 'nullField');
      expect(storeMock.actualizarEstado).not.toHaveBeenCalled();
    });

    it('no debe actualizar el store cuando el control tiene valor undefined', () => {
      jest.clearAllMocks();
      component.setValoresStore(testForm, 'undefinedField');
      expect(storeMock.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe actualizar el store cuando el control tiene string vacío', () => {
      component.setValoresStore(testForm, 'emptyStringField');
      expect(storeMock.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { emptyStringField: '' }
      });
    });

    it('no debe actualizar el store si el control no existe', () => {
      jest.clearAllMocks();
      component.setValoresStore(testForm, 'nonExistentField');
      expect(storeMock.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe manejar valores numéricos correctamente', () => {
      component.setValoresStore(testForm, 'numberField');
      expect(storeMock.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { numberField: 123 }
      });
    });

    it('debe manejar valores booleanos correctamente', () => {
      component.setValoresStore(testForm, 'booleanField');
      expect(storeMock.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { booleanField: true }
      });
    });

    it('debe actualizar el store con el formulario del componente', () => {
      component.ngOnInit();
      
      component.seguridadFisicaForm.get('indiqueMateriales')?.setValue('Material Test');
      
      component.setValoresStore(component.seguridadFisicaForm, 'indiqueMateriales');
      
      expect(storeMock.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { indiqueMateriales: 'Material Test' }
      });
    });

    it('debe manejar múltiples campos del formulario del componente', () => {
      component.ngOnInit();
      
      component.seguridadFisicaForm.get('indiqueMateriales')?.setValue('Material Test');
      component.seguridadFisicaForm.get('queForma')?.setValue('Forma Test');
      component.seguridadFisicaForm.get('personalResponsable')?.setValue('Personal Test');
      
      component.setValoresStore(component.seguridadFisicaForm, 'indiqueMateriales');
      component.setValoresStore(component.seguridadFisicaForm, 'queForma');
      component.setValoresStore(component.seguridadFisicaForm, 'personalResponsable');
      
      expect(storeMock.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { indiqueMateriales: 'Material Test' }
      });
      expect(storeMock.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { queForma: 'Forma Test' }
      });
      expect(storeMock.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { personalResponsable: 'Personal Test' }
      });
    });
  });

  describe('Ciclo de vida del componente', () => {
    it('debe completar el destroyNotifier$ en ngOnDestroy', () => {
      const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('debe suscribirse a selectSolicitud$ en ngOnInit', () => {
      const subscribeSpy = jest.spyOn(queryMock.selectSolicitud$, 'pipe');
      
      component.ngOnInit();
      
      expect(subscribeSpy).toHaveBeenCalled();
    });
  });

  describe('Métodos estáticos de creación de controles', () => {
    it('debe crear controles básicos correctamente', () => {
      const perfiles = {
        indiqueMateriales: 'Test Material',
        queForma: 'Test Forma',
        personalResponsable: 'Test Personal'
      };

      const controles = (SeguridadFisicaComponent as any).crearControlesBasicos(perfiles);

      expect(controles['indiqueMateriales']).toEqual(['Test Material', expect.any(Function)]);
      expect(controles['queForma']).toEqual(['Test Forma', expect.any(Function)]);
      expect(controles['personalResponsable']).toEqual(['Test Personal', expect.any(Function)]);
    });

    it('debe crear controles de monitoreo correctamente', () => {
      const perfiles = {
        periodicidadVerifica: 'Test Periodicidad',
        indiqueTareas: 'Test Tareas',
        describaManera: 'Test Manera'
      };

      const controles = (SeguridadFisicaComponent as any).crearControlesMonitoreo(perfiles);

      expect(controles['periodicidadVerifica']).toEqual(['Test Periodicidad', expect.any(Function)]);
      expect(controles['indiqueTareas']).toEqual(['Test Tareas', expect.any(Function)]);
      expect(controles['describaManera']).toEqual(['Test Manera', expect.any(Function)]);
    });

    it('debe crear controles de acceso correctamente', () => {
      const perfiles = {
        politicasMecanismos: 'Test Políticas',
        procedimientoOperacion: 'Test Procedimiento',
        senaleEncuentran: 'Test Señale'
      };

      const controles = (SeguridadFisicaComponent as any).crearControlesAcceso(perfiles);

      expect(controles['politicasMecanismos']).toEqual(['Test Políticas', expect.any(Function)]);
      expect(controles['procedimientoOperacion']).toEqual(['Test Procedimiento', expect.any(Function)]);
      expect(controles['senaleEncuentran']).toEqual(['Test Señale', expect.any(Function)]);
    });

    it('debe crear controles de sistemas correctamente', () => {
      const perfiles = {
        indiqueRespaldo: 'Test Respaldo',
        describaAlarma: 'Test Alarma',
        indiqueUtilizan: 'Test Utilizan'
      };

      const controles = (SeguridadFisicaComponent as any).crearControlesSistemas(perfiles);

      expect(controles['indiqueRespaldo']).toEqual(['Test Respaldo', expect.any(Function)]);
      expect(controles['describaAlarma']).toEqual(['Test Alarma', expect.any(Function)]);
      expect(controles['indiqueUtilizan']).toEqual(['Test Utilizan', expect.any(Function)]);
    });

    it('debe crear controles de inspección correctamente', () => {
      const perfiles = {
        indiqueTiempo: 'Test Tiempo',
        contarPlanta: 'Test Planta',
        estosSistemas: 'Test Sistemas'
      };

      const controles = (SeguridadFisicaComponent as any).crearControlesInspeccion(perfiles);

      expect(controles['indiqueTiempo']).toEqual(['Test Tiempo', expect.any(Function)]);
      expect(controles['contarPlanta']).toEqual(['Test Planta', expect.any(Function)]);
      expect(controles['estosSistemas']).toEqual(['Test Sistemas', expect.any(Function)]);
    });
  });
});
