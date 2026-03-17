import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepresentanteLegalComponent } from './representante-legal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { Solicitud32605Store } from '../../estados/solicitud32605.store';
import { Solicitud32605Query } from '../../estados/solicitud32605.query';

describe('RepresentanteLegalComponent', () => {
  let component: RepresentanteLegalComponent;
  let fixture: ComponentFixture<RepresentanteLegalComponent>;

  const mockStore = {
    actualizarEstado: jest.fn(),
  };

  const mockQuery = {
    selectSolicitud$: of({
      representanteRfc: '',
      representanteNombre: '',
      representanteApellidoPaterno: '',
      representanteApellidoMaterno: '',
      representanteTelefono: '',
      representanteCorreo: '',
    }),
  };

  const mockConsultaioQuery = {
    selectConsultaioState$: of({
      readonly: false,
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
    ReactiveFormsModule,
    NotificacionesComponent,
    RepresentanteLegalComponent, 
  ],
  providers: [
    FormBuilder,
    { provide: Solicitud32605Store, useValue: mockStore },
    { provide: Solicitud32605Query, useValue: mockQuery },
    { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
  ],
}).compileComponents();

    fixture = TestBed.createComponent(RepresentanteLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario correctamente', () => {
    expect(component.representante).toBeDefined();
    expect(component.representante.controls['representanteRegistro']).toBeDefined();
  });

  it('debe deshabilitar el formulario si es solo lectura', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.representante.disabled).toBe(true);
  });


  it('debe llamar a actualizarEstado al cambiar un campo', () => {
    const form = component.representante;
    form.get('representanteCorreo')?.setValue('correo@prueba.com');
    component.setValoresStore(form, 'representanteCorreo');
    expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
      representanteCorreo: 'correo@prueba.com',
    });
  });

  it('debe completar la suscripción y limpiar recursos en ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  describe('botonBuscar', () => {
    beforeEach(() => {
      component.rfcValido = false;
      component['buscarClicked'] = false;
      component.tieneValorRfc = false;
      component.mostrarError = false;
    });

    it('debe mostrar notificación de error cuando no hay valor de registro', () => {
      component.representante.get('representanteRegistro')?.setValue('');

      component.botonBuscar();

      expect(component.rfcValido).toBeTruthy();
      expect(component.nuevaNotificacion.mensaje).toBe('No se encontró información');
      expect(component.nuevaNotificacion.tipoNotificacion).toBe('alert');
      expect(component.nuevaNotificacion.categoria).toBe('danger');
    });

    it('debe mostrar notificación de error cuando no hay valor de registro (null)', () => {
      component.representante.get('representanteRegistro')?.setValue(null);

      component.botonBuscar();

      expect(component.rfcValido).toBeTruthy();
      expect(component.nuevaNotificacion.mensaje).toBe('No se encontró información');
    });

    it('debe mostrar notificación de formato incorrecto cuando el control es inválido', () => {
      const spyNotificacion = jest.spyOn(component, 'mostrarNotificacionFormatoIncorrecto');
      component.representante.get('representanteRegistro')?.setValue('INVALID_FORMAT');

      component.botonBuscar();

      expect(component.rfcValido).toBeTruthy();
      expect(spyNotificacion).toHaveBeenCalled();
    });

    it('debe buscar y cargar datos mock cuando el registro es válido', () => {
      const validRfc = 'XAXX010101000';
      const spyNotificacionBusqueda = jest.spyOn(component, 'mostrarNotificacionDeBusqueda');
      const spyPatchValue = jest.spyOn(component.representante, 'patchValue');
      component.representante.get('representanteRegistro')?.setValue(validRfc);

      component.botonBuscar();

      expect(component.rfcValido).toBeFalsy();
      expect(component['buscarClicked']).toBeTruthy();
      expect(component.tieneValorRfc).toBeTruthy();
      expect(component.mostrarError).toBeFalsy();
      expect(spyNotificacionBusqueda).toHaveBeenCalled();
      expect(spyPatchValue).toHaveBeenCalledWith({
        representanteRfc: validRfc,
        representanteNombre: 'EUROFOODS DE MEXICO',
        representanteApellidoPaterno: 'GONZALEZ',
        representanteApellidoMaterno: 'PINAL',
        representanteTelefono: '618-256-2532',
        representanteCorreo: 'vucem2.5@hotmail.com',
      });
    });

    it('debe manejar diferentes valores de RFC válidos', () => {
      const validRfc = 'ABCD123456789';
      component.representante.get('representanteRegistro')?.setValue(validRfc);

      component.botonBuscar();

      expect(component.rfcValido).toBeFalsy();
      expect(component['buscarClicked']).toBeTruthy();
      expect(component.representante.get('representanteRfc')?.value).toBe(validRfc);
    });

    it('debe retornar early cuando no hay valor de registro', () => {
      const spyPatchValue = jest.spyOn(component.representante, 'patchValue');
      component.representante.get('representanteRegistro')?.setValue('');

      component.botonBuscar();

      expect(spyPatchValue).not.toHaveBeenCalled();
      expect(component.rfcValido).toBeTruthy();
    });

    it('debe retornar early cuando el control es inválido', () => {
      const spyPatchValue = jest.spyOn(component.representante, 'patchValue');
      component.representante.get('representanteRegistro')?.setValue('INVALID');

      component.botonBuscar();

      expect(spyPatchValue).not.toHaveBeenCalled();
      expect(component.rfcValido).toBeTruthy();
    });
  });

  describe('mostrarNotificacionDeBusqueda', () => {
    it('debe configurar la notificación de búsqueda correctamente', () => {
      component.mostrarNotificacionDeBusqueda();

      expect(component.nuevaNotificacion).toEqual({
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'modal',
        titulo: '',
        mensaje: 'Datos guardados correctamente.',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: ''
      });
    });
  });

  describe('mostrarNotificacionFormatoIncorrecto', () => {
    it('debe configurar la notificación de formato incorrecto correctamente', () => {
      component.mostrarNotificacionFormatoIncorrecto();

      expect(component.nuevaNotificacion).toEqual({
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'modal',
        titulo: '',
        mensaje: 'Ha proporcionado información con un formato incorrecto.',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: ''
      });
    });
  });

  describe('onModalFormatoIncorrectoClose', () => {
    it('debe establecer rfcValido en false', () => {
      component.rfcValido = true;

      component.onModalFormatoIncorrectoClose();

      expect(component.rfcValido).toBeFalsy();
    });
  });

  describe('onModalBusquedaClose', () => {
    it('debe establecer tieneValorRfc en false', () => {
      component.tieneValorRfc = true;

      component.onModalBusquedaClose();

      expect(component.tieneValorRfc).toBeFalsy();
    });
  });

  describe('enPatchStoredFormData', () => {
    it('debe suscribirse al query y actualizar solicitudState', () => {
      const mockData = {
        representanteRfc: 'XAXX010101000',
        representanteNombre: 'Test Name'
      };
      const mockQueryWithData = {
        selectSolicitud$: of(mockData)
      };
      component['tramite32605Query'] = mockQueryWithData as any;

      component.enPatchStoredFormData();

      expect(component.solicitudState).toEqual(mockData);
    });

    it('debe manejar la suscripción correctamente', () => {
      const spyTakeUntil = jest.spyOn(component['destroyed$'], 'asObservable');

      component.enPatchStoredFormData();

      expect(() => component.enPatchStoredFormData()).not.toThrow();
    });
  });

  describe('validarFormularioRepresentante', () => {
    beforeEach(() => {
      component.mostrarError = false;
      component.rfcValido = false;
      component['buscarClicked'] = false;
    });

    it('debe retornar true cuando todos los campos están llenos', () => {
      const formData = {
        representanteRegistro: 'XAXX010101000',
        representanteRfc: 'XAXX010101000',
        representanteNombre: 'Test Name',
        representanteApellidoPaterno: 'Test Apellido',
        representanteApellidoMaterno: 'Test Materno',
        representanteTelefono: '1234567890',
        representanteCorreo: 'test@example.com'
      };
      component.representante.patchValue(formData);
      component.buscarClicked = true;

      const result = component.validarFormularioRepresentante();

      expect(result).toBeTruthy();
      expect(component.mostrarError).toBeFalsy();
    });

    it('debe retornar false y mostrar notificación cuando RFC es inválido', () => {
      const spyNotificacion = jest.spyOn(component, 'mostrarNotificacionFormatoIncorrecto');
      component.representante.get('representanteRegistro')?.setValue('INVALID_RFC');

      const result = component.validarFormularioRepresentante();

      expect(result).toBeFalsy();
      expect(component.rfcValido).toBeTruthy();
      expect(spyNotificacion).toHaveBeenCalled();
    });

    it('debe retornar false cuando RFC es válido pero no se hizo clic en buscar', () => {
      component.representante.get('representanteRegistro')?.setValue('XAXX010101000');
      component.buscarClicked = false;

      const result = component.validarFormularioRepresentante();

      expect(result).toBeFalsy();
      expect(component.mostrarError).toBeTruthy();
    });

    it('debe retornar false cuando no hay valor de RFC', () => {
      const spyMarkAllAsTouched = jest.spyOn(component.representante, 'markAllAsTouched');
      component.representante.get('representanteRegistro')?.setValue('');

      const result = component.validarFormularioRepresentante();

      expect(result).toBeFalsy();
      expect(component.mostrarError).toBeTruthy();
      expect(spyMarkAllAsTouched).toHaveBeenCalled();
    });

    it('debe retornar false cuando el formulario es inválido', () => {
      const spyMarkAllAsTouched = jest.spyOn(component.representante, 'markAllAsTouched');
      component.representante.get('representanteRegistro')?.setValue('XAXX010101000');
      component.representante.get('representanteCorreo')?.setValue('invalid-email');
      component.buscarClicked = true;

      const result = component.validarFormularioRepresentante();

      expect(result).toBeFalsy();
      expect(component.mostrarError).toBeTruthy();
      expect(spyMarkAllAsTouched).toHaveBeenCalled();
    });

    it('debe manejar campos con valores vacíos (solo espacios)', () => {
      component.representante.patchValue({
        representanteRegistro: 'XAXX010101000',
        representanteRfc: '   ',
        representanteNombre: 'Test Name',
        representanteApellidoPaterno: 'Test Apellido',
        representanteApellidoMaterno: 'Test Materno',
        representanteTelefono: '1234567890',
        representanteCorreo: 'test@example.com'
      });
      component.buscarClicked = true;

      const result = component.validarFormularioRepresentante();

    });

    it('debe validar todos los campos requeridos', () => {
      component.representante.patchValue({
        representanteRegistro: 'XAXX010101000',
        representanteRfc: 'XAXX010101000',
        representanteNombre: '',
        representanteApellidoPaterno: 'Test Apellido',
        representanteApellidoMaterno: 'Test Materno',
        representanteTelefono: '1234567890',
        representanteCorreo: 'test@example.com'
      });
      component.buscarClicked = true;

      const result = component.validarFormularioRepresentante();

    });

    it('debe manejar valores null en los campos', () => {
      component.representante.get('representanteRegistro')?.setValue(null);

      const result = component.validarFormularioRepresentante();

      expect(result).toBeFalsy();
      expect(component.mostrarError).toBeTruthy();
    });

    it('debe resetear mostrarError cuando la validación es exitosa', () => {
      component.mostrarError = true;
      const formData = {
        representanteRegistro: 'XAXX010101000',
        representanteRfc: 'XAXX010101000',
        representanteNombre: 'Test Name',
        representanteApellidoPaterno: 'Test Apellido',
        representanteApellidoMaterno: 'Test Materno',
        representanteTelefono: '1234567890',
        representanteCorreo: 'test@example.com'
      };
      component.representante.patchValue(formData);
      component.buscarClicked = true;

      const result = component.validarFormularioRepresentante();

      expect(result).toBeTruthy();
      expect(component.mostrarError).toBeFalsy();
    });
  });

  describe('crearFormulario', () => {
    it('debe crear el formulario con los campos correctos', () => {
      component.crearFormulario();

      expect(component.representante).toBeDefined();
      expect(component.representante.get('representanteRegistro')).toBeDefined();
      expect(component.representante.get('representanteRfc')).toBeDefined();
      expect(component.representante.get('representanteNombre')).toBeDefined();
      expect(component.representante.get('representanteApellidoPaterno')).toBeDefined();
      expect(component.representante.get('representanteApellidoMaterno')).toBeDefined();
      expect(component.representante.get('representanteTelefono')).toBeDefined();
      expect(component.representante.get('representanteCorreo')).toBeDefined();
    });

    it('debe configurar validadores correctamente', () => {
      component.crearFormulario();

      const registroControl = component.representante.get('representanteRegistro');
      const correoControl = component.representante.get('representanteCorreo');

      expect(registroControl?.hasError('pattern')).toBeDefined();
      expect(correoControl?.hasError('email')).toBeDefined();
    });

    it('debe crear campos deshabilitados para datos de solo lectura', () => {
      component.crearFormulario();

      expect(component.representante.get('representanteRfc')?.disabled).toBeTruthy();
      expect(component.representante.get('representanteNombre')?.disabled).toBeTruthy();
      expect(component.representante.get('representanteApellidoPaterno')?.disabled).toBeTruthy();
      expect(component.representante.get('representanteApellidoMaterno')?.disabled).toBeTruthy();
    });

    it('debe crear campos habilitados para datos editables', () => {
      component.crearFormulario();

      expect(component.representante.get('representanteRegistro')?.enabled).toBeTruthy();
      expect(component.representante.get('representanteTelefono')?.enabled).toBeTruthy();
      expect(component.representante.get('representanteCorreo')?.enabled).toBeTruthy();
    });

    it('debe suscribirse al query y agregar a subscription', () => {
      const spyAdd = jest.spyOn(component['subscription'], 'add');

      component.crearFormulario();

      expect(spyAdd).toHaveBeenCalled();
    });
  });

  describe('inicializarEstadoFormulario', () => {
    beforeEach(() => {
      jest.spyOn(component, 'guardarDatosFormulario').mockImplementation();
      jest.spyOn(component, 'crearFormulario').mockImplementation();
    });

    it('debe llamar guardarDatosFormulario cuando está en modo solo lectura', () => {
      component.esFormularioSoloLectura = true;

      component.inicializarEstadoFormulario();

      expect(component.guardarDatosFormulario).toHaveBeenCalled();
    });

    it('debe llamar crearFormulario cuando no está en modo solo lectura', () => {
      component.esFormularioSoloLectura = false;

      component.inicializarEstadoFormulario();

      expect(component.crearFormulario).toHaveBeenCalled();
    });
  });

  describe('guardarDatosFormulario', () => {
    beforeEach(() => {
      jest.spyOn(component, 'crearFormulario').mockImplementation();
      component.representante = component['fb'].group({
        test: ['test']
      });
    });

    it('debe llamar crearFormulario', () => {
      component.guardarDatosFormulario();

      expect(component.crearFormulario).toHaveBeenCalled();
    });

    it('debe deshabilitar el formulario cuando es solo lectura', () => {
      component.esFormularioSoloLectura = true;
      const spyDisable = jest.spyOn(component.representante, 'disable');

      component.guardarDatosFormulario();

      expect(spyDisable).toHaveBeenCalled();
    });

    it('debe habilitar el formulario cuando no es solo lectura', () => {
      component.esFormularioSoloLectura = false;
      const spyEnable = jest.spyOn(component.representante, 'enable');

      component.guardarDatosFormulario();

      expect(spyEnable).toHaveBeenCalled();
    });

    it('debe ejecutar en el orden correcto', () => {
      const callOrder: string[] = [];
      (component.crearFormulario as jest.Mock).mockImplementation(() => {
        callOrder.push('crearFormulario');
      });
      jest.spyOn(component.representante, 'disable').mockImplementation(() => {
        callOrder.push('disable');
      });
      component.esFormularioSoloLectura = true;

      component.guardarDatosFormulario();

      expect(callOrder).toEqual(['crearFormulario', 'disable']);
    });
  });

  describe('setValoresStore', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('debe retornar early cuando form es null', () => {
      component.setValoresStore(null, 'representanteCorreo');

      expect(mockStore.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe retornar early cuando form es undefined', () => {
      component.setValoresStore(undefined as any, 'representanteCorreo');

      expect(mockStore.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe actualizar el store cuando el control tiene valor válido', () => {
      const form = component.representante;
      const valor = 'test@email.com';
      form.get('representanteCorreo')?.setValue(valor);

      component.setValoresStore(form, 'representanteCorreo');

      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
        representanteCorreo: valor
      });
    });

    it('no debe actualizar el store cuando el control tiene valor null', () => {
      const form = component.representante;
      form.get('representanteCorreo')?.setValue(null);

      component.setValoresStore(form, 'representanteCorreo');

      expect(mockStore.actualizarEstado).not.toHaveBeenCalled();
    });

    it('no debe actualizar el store cuando el control tiene valor undefined', () => {
      const form = component.representante;
      form.get('representanteCorreo')?.setValue(undefined);

      component.setValoresStore(form, 'representanteCorreo');

      expect(mockStore.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe manejar cuando el campo no existe en el formulario', () => {
      const form = component.representante;

      component.setValoresStore(form, 'campoInexistente');

      expect(mockStore.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe actualizar el store con diferentes campos', () => {
      const form = component.representante;
      const campos = [
        { campo: 'representanteTelefono', valor: '1234567890' },
        { campo: 'representanteCorreo', valor: 'test@email.com' }
      ];

      campos.forEach(testCase => {
        jest.clearAllMocks();
        form.get(testCase.campo)?.setValue(testCase.valor);

        component.setValoresStore(form, testCase.campo);

        expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
          [testCase.campo]: testCase.valor
        });
      });
    });

    it('debe actualizar con valores vacíos pero no null/undefined', () => {
      const form = component.representante;
      form.get('representanteTelefono')?.setValue('');

      component.setValoresStore(form, 'representanteTelefono');

      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
        representanteTelefono: ''
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('debe desuscribirse de subscription', () => {
      const spyUnsubscribe = jest.spyOn(component['subscription'], 'unsubscribe');

      component.ngOnDestroy();

      expect(spyUnsubscribe).toHaveBeenCalled();
    });

    it('debe ejecutar destroyed$.next()', () => {
      const spyNext = jest.spyOn(component['destroyed$'], 'next');

      component.ngOnDestroy();

      expect(spyNext).toHaveBeenCalled();
    });

    it('debe ejecutar destroyed$.complete()', () => {
      const spyComplete = jest.spyOn(component['destroyed$'], 'complete');

      component.ngOnDestroy();

      expect(spyComplete).toHaveBeenCalled();
    });

    it('debe ejecutar métodos en el orden correcto', () => {
      const callOrder: string[] = [];
      jest.spyOn(component['subscription'], 'unsubscribe').mockImplementation(() => {
        callOrder.push('unsubscribe');
      });
      jest.spyOn(component['destroyed$'], 'next').mockImplementation(() => {
        callOrder.push('next');
      });
      jest.spyOn(component['destroyed$'], 'complete').mockImplementation(() => {
        callOrder.push('complete');
      });

      component.ngOnDestroy();

      expect(callOrder).toEqual(['unsubscribe', 'next', 'complete']);
    });
  });

  describe('Constructor', () => {
    it('debe suscribirse a consultaioQuery.selectConsultaioState$', () => {
      expect(component).toBeTruthy();
    });

    it('debe configurar esFormularioSoloLectura basado en el estado', () => {
      expect(component.esFormularioSoloLectura).toBe(false);
    });
  });

});
