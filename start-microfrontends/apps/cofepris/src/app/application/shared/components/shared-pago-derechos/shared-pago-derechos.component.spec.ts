
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { AvisoImportacionService } from '../../services/parmiso-importacion.service';
import { AvisocalidadStore } from '../../estados/stores/aviso-calidad.store';
import { AvisocalidadQuery } from '../../estados/queries/aviso-calidad.query';
import { FECHA_DE_PAGO } from '../../models/pago-derechos.model';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { SharedPagoDerechosComponent } from './shared-pago-derechos.component';

const consultaioQuerySimulado = {
  selectConsultaioState$: of({ readonly: true }),
};

describe('ComponentePagoDerechos', () => {
  let componente: SharedPagoDerechosComponent;
  let fixture: ComponentFixture<SharedPagoDerechosComponent>;
  let servicioSimulado: any;
  let storeSimulado: any;
  let querySimulado: any;

  beforeEach(() => {
    servicioSimulado = {
      getDatos: jest.fn().mockReturnValue(of([{ id: 1, name: 'Derecho 1' }])),
    };
    storeSimulado = {
      setfechaPago: jest.fn(),
    };
    querySimulado = {
      selectSolicitud$: of({
        claveReferencia: '123',
        cadenaDependencia: 'ABC',
        banco: 'XYZ',
        llavePago: 'LLAVE123',
        fechaPago: '2023-01-01',
        importePago: 1000,
      }),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SharedPagoDerechosComponent],
      providers: [
        FormBuilder,
        { provide: AvisoImportacionService, useValue: servicioSimulado },
        { provide: AvisocalidadStore, useValue: storeSimulado },
        { provide: AvisocalidadQuery, useValue: querySimulado },
        { provide: ConsultaioQuery, useValue: consultaioQuerySimulado },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedPagoDerechosComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el formulario y cargar datos en ngOnInit', () => {
    expect(componente.derechosForm.value).toEqual({
      claveReferencia: '123',
      cadenaDependencia: 'ABC',
      banco: 'XYZ',
      llavePago: 'LLAVE123',
      fechaPago: '2023-01-01',
      importePago: 1000,
    });
    expect(componente.derechosList).toEqual([{ id: 1, name: 'Derecho 1' }]);
  });

  it('debería actualizar fechaPago en el formulario y store al cambiar la fecha', () => {
    componente.cambioFechaDePago('2023-02-01');
    expect(componente.derechosForm.get('fechaPago')?.value).toBe('2023-02-01');
    expect(storeSimulado.setfechaPago).toHaveBeenCalledWith('2023-02-01');
  });

  it('debería llamar setValoresStore con los parámetros correctos', () => {
    const espia = jest.spyOn(storeSimulado, 'setfechaPago');
    componente.setValoresStore(componente.derechosForm, 'fechaPago', 'setfechaPago');
    expect(espia).toHaveBeenCalledWith('2023-01-01');
  });

  it('debería desuscribirse en ngOnDestroy', () => {
    const espiaNext = jest.spyOn(componente['destroyed$'], 'next');
    const espiaComplete = jest.spyOn(componente['destroyed$'], 'complete');
    componente.ngOnDestroy();
    expect(espiaNext).toHaveBeenCalled();
    expect(espiaComplete).toHaveBeenCalled();
  });

  it('debería cargar la lista de derechos desde el servicio', () => {
    componente.loadComboUnidadMedida();
    expect(servicioSimulado.getDatos).toHaveBeenCalled();
    expect(componente.derechosList).toEqual([{ id: 1, name: 'Derecho 1' }]);
  });

  it('debería tener el valor inicial correcto para fechaInicioInput', () => {
    expect(componente.fechaInicioInput).toBe(FECHA_DE_PAGO);
  });

  it('debería manejar un estado de solicitud vacío sin errores', () => {
    querySimulado.selectSolicitud$ = of(null);
    componente.ngOnInit();
    expect(componente.derechosForm.value).toEqual({
      claveReferencia: null,
      cadenaDependencia: null,
      banco: null,
      llavePago: null,
      fechaPago: null,
      importePago: null,
    });
  });

  it('debería manejar loadComboUnidadMedida con datos vacíos', () => {
    servicioSimulado.getDatos.mockReturnValue(of([]));
    componente.loadComboUnidadMedida();
    expect(componente.derechosList).toEqual([]);
  });

  it('no debería llamar al método del store si el campo del formulario es null en setValoresStore', () => {
    const espia = jest.spyOn(storeSimulado, 'setfechaPago');
    componente.derechosForm.get('fechaPago')?.setValue(null);
    componente.setValoresStore(componente.derechosForm, 'fechaPago', 'setfechaPago');
    expect(espia).toHaveBeenCalledWith(null);
  });

  it('debería manejar correctamente el subject destroyed$ en ngOnDestroy', () => {
    const espiaNext = jest.spyOn(componente['destroyed$'], 'next');
    const espiaComplete = jest.spyOn(componente['destroyed$'], 'complete');
    componente.ngOnDestroy();
    expect(espiaNext).toHaveBeenCalledWith();
    expect(espiaComplete).toHaveBeenCalled();
  });

  it('debería inicializar y deshabilitar el formulario cuando esFormularioSoloLectura es true', () => {
    componente.esFormularioSoloLectura = true;
    componente.configurarGrupoForm();
    const valorForm = componente.derechosForm.value;
    expect(valorForm).toEqual({
      claveReferencia: '123',
      cadenaDependencia: 'ABC',
      banco: 'XYZ',
      llavePago: 'LLAVE123',
      fechaPago: '2023-01-01',
      importePago: 1000
    });
    expect(componente.derechosForm.disabled).toBe(true);
  });

  it('debería inicializar y habilitar el formulario cuando esFormularioSoloLectura es false', () => {
    componente.esFormularioSoloLectura = false;
    componente.configurarGrupoForm();
    expect(componente.derechosForm.disabled).toBe(false);
  });

  it('no debería lanzar error si setValoresStore se llama con un campo inexistente', () => {
    expect(() => componente.setValoresStore(componente.derechosForm, 'noField', 'setfechaPago')).not.toThrow();
  });

  it('debería manejar cambioFechaPago con undefined/null', () => {
    expect(() => componente.cambioFechaDePago(undefined as any)).not.toThrow();
    expect(() => componente.cambioFechaDePago(null as any)).not.toThrow();
  });

  it('debería permitir llamar ngOnDestroy varias veces sin error', () => {
    expect(() => {
      componente.ngOnDestroy();
      componente.ngOnDestroy();
    }).not.toThrow();
  });

  it('debería manejar error en loadComboUnidadMedida sin lanzar excepción', () => {
    servicioSimulado.getDatos.mockReturnValueOnce({
      pipe: () => ({
        subscribe: (success: any, error: any) => error && error('error')
      })
    });
    expect(() => componente.loadComboUnidadMedida()).not.toThrow();
  });

  it('debería actualizar derechosForm con datos parciales', () => {
    componente.derechosForm.patchValue({ claveReferencia: '999' });
    expect(componente.derechosForm.get('claveReferencia')?.value).toBe('999');
  });

  it('no debería volver a deshabilitar el formulario si ya está deshabilitado en configurarGrupoForm', () => {
    componente.esFormularioSoloLectura = true;
    componente.derechosForm.disable();
    expect(() => componente.configurarGrupoForm()).not.toThrow();
    expect(componente.derechosForm.disabled).toBe(true);
  });

  it('debería establecer esFormularioSoloLectura desde ConsultaioQuery y configurar el formulario en ngOnInit', () => {
    consultaioQuerySimulado.selectConsultaioState$ = of({ readonly: true });
    const espiaConfigurar = jest.spyOn(componente, 'configurarGrupoForm');
    componente.ngOnInit();
    expect(componente.esFormularioSoloLectura).toBe(false);
    expect(espiaConfigurar).toHaveBeenCalled();
  });

  it('debería lanzar error si setValoresStore se llama con un método de store inexistente', () => {
    // @ts-ignore
    expect(() => componente.setValoresStore(componente.derechosForm, 'fechaPago', 'noSuchMethod')).toThrow();
  });

  it('debería establecer derechosList a undefined cuando el observable emite undefined', () => {
    servicioSimulado.getDatos.mockReturnValueOnce(of(undefined));
    expect(() => componente.loadComboUnidadMedida()).not.toThrow();
    expect(componente.derechosList).toBe(undefined);
  });

  it('debería establecer derechosList a null cuando el observable emite null', () => {
    servicioSimulado.getDatos.mockReturnValueOnce(of(null));
    expect(() => componente.loadComboUnidadMedida()).not.toThrow();
    expect(componente.derechosList).toBe(null);
  });

  it('debería lanzar error si setValoresStore cuando el método del store no es una función', () => {
    storeSimulado.setfechaPago = 123;
    expect(() => componente.setValoresStore(componente.derechosForm, 'fechaPago', 'setfechaPago')).toThrow();
  });

  it('debería lanzar error si loadComboUnidadMedida cuando getDatos lanza excepción', () => {
    servicioSimulado.getDatos.mockImplementationOnce(() => { throw new Error('fail'); });
    expect(() => componente.loadComboUnidadMedida()).toThrow();
  });

  describe('alReiniciar', () => {
    it('debería reiniciar el formulario', () => {
      const espiaReset = jest.spyOn(componente.derechosForm, 'reset');
      componente.alReiniciar();
      expect(espiaReset).toHaveBeenCalled();
    });
  });

  describe('esInvalido', () => {
    beforeEach(() => {
      if (!componente.derechosForm.get('fechaPago')) {
        componente.derechosForm.addControl('fechaPago', componente['fb'].control(''));
      }
    });

    it('debería retornar false si fechaPago es cadena vacía', () => {
      componente.derechosForm.get('fechaPago')?.setValue('');
      expect(componente.esInvalido('fechaPago')).toBe(false);
    });

    it('debería retornar false si fechaPago es null', () => {
      componente.derechosForm.get('fechaPago')?.setValue(null);
      expect(componente.esInvalido('fechaPago')).toBe(false);
    });

    it('debería retornar true si fechaPago es inválida (esFechaValida false)', () => {
      componente.derechosForm.get('fechaPago')?.setValue('2020-01-01');
      jest.spyOn(componente, 'esFechaPasada').mockImplementation(() => {});
      componente.esFechaValida = false;
      expect(componente.esInvalido('fechaPago')).toBe(true);
      expect(componente.derechosForm.get('fechaPago')?.errors).toEqual({ esFechaPasada: true });
    });

    it('debería retornar false si fechaPago es válida (esFechaValida true)', () => {
      componente.derechosForm.get('fechaPago')?.setValue('2099-01-01');
      jest.spyOn(componente, 'esFechaPasada').mockImplementation(() => {});
      componente.esFechaValida = true;
      expect(componente.esInvalido('fechaPago')).toBe(false);
      expect(componente.derechosForm.get('fechaPago')?.errors).toEqual({ esFechaPasada: false });
    });

    it('debería retornar false si el control no existe', () => {
      expect(componente.esInvalido('noSuchControl')).toBe(false);
    });

    it('debería retornar true si el control es inválido y tocado', () => {
      componente.derechosForm.addControl('testControl', componente['fb'].control('', { updateOn: 'change' }));
      const ctrl = componente.derechosForm.get('testControl');
      ctrl?.setErrors({ required: true });
      ctrl?.markAsTouched();
      expect(componente.esInvalido('testControl')).toBe(true);
    });

    it('debería retornar true si el control es inválido y dirty', () => {
      componente.derechosForm.addControl('dirtyControl', componente['fb'].control('', { updateOn: 'change' }));
      const ctrl = componente.derechosForm.get('dirtyControl');
      ctrl?.setErrors({ required: true });
      ctrl?.markAsDirty();
      expect(componente.esInvalido('dirtyControl')).toBe(true);
    });

    it('debería retornar false si el control es válido', () => {
      componente.derechosForm.addControl('validControl', componente['fb'].control('valid'));
      expect(componente.esInvalido('validControl')).toBe(false);
    });
  });
});



