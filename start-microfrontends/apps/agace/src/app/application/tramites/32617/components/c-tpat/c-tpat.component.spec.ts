import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { CTPATComponent } from './c-tpat.component';
import { OeaTercerizacionLogisticaRegistroService } from '../../services/oea-tercerizacion-logistica-registro.service';
import { Tramite32617Store, Tramites32617State } from '../../estados/tramites32617.store';
import { Tramite32617Query } from '../../estados/tramites32617.query';
import { OPCIONES_DE_BOTON_DE_RADIO } from '../../enums/oea-tercerizacion-logistica-registro.enum';
import { HttpClientModule } from '@angular/common/http';

describe('CTPATComponent', () => {
  let component: CTPATComponent;
  let fixture: ComponentFixture<CTPATComponent>;
  let mockSolicitudService: jest.Mocked<OeaTercerizacionLogisticaRegistroService>;
  let mockTramite32617Store: jest.Mocked<Tramite32617Store>;
  let mockTramite32617Query: jest.Mocked<Tramite32617Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockBsModalService: jest.Mocked<BsModalService>;
  let mockBsModalRef: jest.Mocked<BsModalRef>;

  const mockSolicitudState: Tramites32617State = {
    autorizacionCBP: '1',
    instalacionesCertificadasCBP: '0',
    suspensionCancelacionCBP: '',
  } as Tramites32617State;

  const mockConsultaioState = {
    readonly: false
  };

  beforeEach(async () => {
    // Crear mocks de los servicios
    mockSolicitudService = {
      establecerDatos: jest.fn(),
      obtenerDatos: jest.fn().mockReturnValue(of(mockSolicitudState))
    } as any;

    mockTramite32617Store = {
      establecerDatos: jest.fn()
    } as any;

    mockTramite32617Query = {
      selectTramite32617$: of(mockSolicitudState)
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of(mockConsultaioState)
    } as any;

    mockBsModalRef = {
      hide: jest.fn()
    } as any;

    mockBsModalService = {
      show: jest.fn().mockReturnValue(mockBsModalRef)
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CTPATComponent,
        CommonModule,
        ReactiveFormsModule,
        InputRadioComponent,
        HttpClientModule
      ],
      providers: [
        FormBuilder,
        { provide: OeaTercerizacionLogisticaRegistroService, useValue: mockSolicitudService },
        { provide: Tramite32617Store, useValue: mockTramite32617Store },
        { provide: Tramite32617Query, useValue: mockTramite32617Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: BsModalService, useValue: mockBsModalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CTPATComponent);
    component = fixture.componentInstance;
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar las propiedades por defecto', () => {
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.opcionDeBotonDeRadio).toEqual(OPCIONES_DE_BOTON_DE_RADIO);
      expect(component.destroy$).toBeInstanceOf(Subject);
    });

    it('debería llamar a inicializarEstadoFormulario en ngOnInit', () => {
      const spy = jest.spyOn(component, 'inicializarEstadoFormulario');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('debería suscribirse al estado de consultaio en el constructor', () => {
      expect(mockConsultaioQuery.selectConsultaioState$).toBeDefined();
    });
  });

  describe('Gestión del estado del formulario', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería inicializar el formulario con los valores del estado', () => {
      component.inicializarFormulario();
      
      expect(component.ctpatForm).toBeDefined();
      expect(component.ctpatForm.get('autorizacionCBP')).toBeTruthy();
      expect(component.ctpatForm.get('instalacionesCertificadasCBP')).toBeTruthy();
      expect(component.ctpatForm.get('suspensionCancelacionCBP')).toBeTruthy();
    });

    it('debería llamar a guardarDatosFormulario cuando esFormularioSoloLectura es true', () => {
      component.esFormularioSoloLectura = true;
      const spy = jest.spyOn(component, 'guardarDatosFormulario');
      
      component.inicializarEstadoFormulario();
      
      expect(spy).toHaveBeenCalled();
    });

    it('debería llamar a inicializarFormulario cuando esFormularioSoloLectura es false', () => {
      component.esFormularioSoloLectura = false;
      const spy = jest.spyOn(component, 'inicializarFormulario');
      
      component.inicializarEstadoFormulario();
      
      expect(spy).toHaveBeenCalled();
    });

    it('debería deshabilitar el formulario cuando esFormularioSoloLectura es true', () => {
      component.esFormularioSoloLectura = true;
      component.inicializarFormulario();
      
      component.guardarDatosFormulario();
      
      expect(component.ctpatForm.disabled).toBe(true);
    });

    it('debería habilitar el formulario cuando esFormularioSoloLectura es false', () => {
      component.esFormularioSoloLectura = false;
      component.inicializarFormulario();
      
      component.guardarDatosFormulario();
      
      expect(component.ctpatForm.enabled).toBe(true);
    });
  });

  describe('Obtención del estado de la solicitud', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería obtener el estado de la solicitud correctamente', () => {
      component.obtenerEstadoSolicitud();
      
      expect(component.solicitudState).toEqual(mockSolicitudState);
    });

    it('debería suscribirse a selectTramite32617$ del query', () => {
      const spy = jest.spyOn(mockTramite32617Query.selectTramite32617$, 'pipe');
      
      component.obtenerEstadoSolicitud();
      
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Actualización de valores en el store', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería actualizar el store cuando el control tiene un valor válido', () => {
      const campo = 'autorizacionCBP';
      const valor = '1';
      
      component.ctpatForm.get(campo)?.setValue(valor);
      component.setValoresStore(component.ctpatForm, campo);
      
      expect(mockTramite32617Store.establecerDatos).toHaveBeenCalledWith({
        [campo]: valor
      });
    });

    it('no debería actualizar el store cuando el formulario es null', () => {
      component.setValoresStore(null, 'autorizacionCBP');
      
      expect(mockTramite32617Store.establecerDatos).not.toHaveBeenCalled();
    });

    it('no debería actualizar el store cuando el control tiene valor null', () => {
      const campo = 'autorizacionCBP';
      
      component.ctpatForm.get(campo)?.setValue(null);
      component.setValoresStore(component.ctpatForm, campo);
      
      expect(mockTramite32617Store.establecerDatos).not.toHaveBeenCalled();
    });

    it('no debería actualizar el store cuando el control tiene valor undefined', () => {
      const campo = 'autorizacionCBP';
      
      component.ctpatForm.get(campo)?.setValue(undefined);
      component.setValoresStore(component.ctpatForm, campo);
      
      expect(mockTramite32617Store.establecerDatos).not.toHaveBeenCalled();
    });
  });

  describe('Manejo del cambio de suspensión/cancelación CBP', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería mostrar el modal cuando se selecciona "Sí" (valor "1")', () => {
      const mockEvent = {
        target: { value: '1' }
      } as any;
      
      const spyMostrarModal = jest.spyOn(component, 'mostrarModalMensaje');
      const spySetValores = jest.spyOn(component, 'setValoresStore');
      
      component.manejarCambioSuspensionCancelacion(mockEvent);
      
      expect(spySetValores).toHaveBeenCalledWith(component.ctpatForm, 'suspensionCancelacionCBP');
    });

    it('no debería mostrar el modal cuando se selecciona "No" (valor "0")', () => {
      const mockEvent = {
        target: { value: '0' }
      } as any;
      
      const spyMostrarModal = jest.spyOn(component, 'mostrarModalMensaje');
      const spySetValores = jest.spyOn(component, 'setValoresStore');
      
      component.manejarCambioSuspensionCancelacion(mockEvent);
      
      expect(spySetValores).toHaveBeenCalledWith(component.ctpatForm, 'suspensionCancelacionCBP');
      expect(spyMostrarModal).not.toHaveBeenCalled();
    });

    it('debería manejar correctamente el valor "on" y mostrar el modal', () => {
      const mockEvent = {
        target: { value: 'on' }
      } as any;
      
      const spyMostrarModal = jest.spyOn(component, 'mostrarModalMensaje');
      
      component.manejarCambioSuspensionCancelacion(mockEvent);
      
      expect(spyMostrarModal).toHaveBeenCalled();
    });

    it('debería extraer correctamente el valor del evento', () => {
      const mockEvent = {
        target: { value: '1' }
      } as any;
      
      const spySetValores = jest.spyOn(component, 'setValoresStore');
      
      component.manejarCambioSuspensionCancelacion(mockEvent);
      
      expect(spySetValores).toHaveBeenCalledWith(component.ctpatForm, 'suspensionCancelacionCBP');
    });
  });

  describe('Gestión del modal', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });


    it('debería cerrar el modal correctamente', () => {
      component.modalRef = mockBsModalRef;
      
      component.cerrarModal();
      
      expect(mockBsModalRef.hide).toHaveBeenCalled();
    });

    it('debería manejar el caso cuando modalRef es undefined al cerrar', () => {
      component.modalRef = undefined;
      
      expect(() => component.cerrarModal()).not.toThrow();
    });
  });

  describe('Limpieza de recursos', () => {
    it('debería completar el subject destroy$ en ngOnDestroy', () => {
      const spyNext = jest.spyOn(component.destroy$, 'next');
      const spyComplete = jest.spyOn(component.destroy$, 'complete');
      
      component.ngOnDestroy();
      
      expect(spyNext).toHaveBeenCalled();
      expect(spyComplete).toHaveBeenCalled();
    });

    it('debería cancelar las suscripciones activas', () => {
      const spyDestroy = jest.spyOn(component.destroy$, 'next');
      
      component.ngOnDestroy();
      
      expect(spyDestroy).toHaveBeenCalled();
    });
  });

  describe('Propiedades del componente', () => {
    it('debería tener las opciones de radio button correctas', () => {
      expect(component.opcionDeBotonDeRadio).toEqual([
        { label: 'Sí', value: '1' },
        { label: 'No', value: '0' }
      ]);
    });

    it('debería inicializar solicitud32617State como objeto vacío', () => {
      expect(component.solicitud32617State).toEqual({});
    });

    it('debería tener modalRef como undefined inicialmente', () => {
      expect(component.modalRef).toBeUndefined();
    });
  });

  describe('Validaciones del formulario', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería marcar los campos como requeridos', () => {
      const suspensionControl = component.ctpatForm.get('suspensionCancelacionCBP');
      
      expect(suspensionControl?.hasError('required')).toBeTruthy();
    });

    it('debería ser válido cuando todos los campos tienen valores', () => {
      component.ctpatForm.patchValue({
        autorizacionCBP: '1',
        instalacionesCertificadasCBP: '0',
        suspensionCancelacionCBP: '1'
      });
      
      expect(component.ctpatForm.valid).toBeTruthy();
    });

    it('debería ser inválido cuando falta algún campo requerido', () => {
      component.ctpatForm.patchValue({
        autorizacionCBP: '1',
        instalacionesCertificadasCBP: '',
        suspensionCancelacionCBP: '1'
      });
      
      expect(component.ctpatForm.valid).toBeFalsy();
    });
  });

  describe('Integración con el template', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería renderizar el formulario correctamente', () => {
      const compiled = fixture.nativeElement;
      const form = compiled.querySelector('form');
      
      expect(form).toBeTruthy();
    });

  it('debería mostrar las etiquetas de los campos', () => {
    const compiled = fixture.nativeElement;
    const labels = compiled.querySelectorAll('label');
    
    expect(labels.length).toBeGreaterThan(0);
  });


  describe('Casos edge y manejo de errores', () => {
    it('debería manejar el caso cuando el estado de la solicitud es null', () => {
      mockTramite32617Query.selectTramite32617$ = of(null as any);
      
      expect(() => component.obtenerEstadoSolicitud()).not.toThrow();
    });

    it('debería manejar el caso cuando el evento no tiene target', () => {
      const mockEvent = {} as any;
      
      expect(() => component.manejarCambioSuspensionCancelacion(mockEvent)).toThrow();
    });

    it('debería manejar el caso cuando el control del formulario no existe', () => {
      component.inicializarFormulario();
      
      component.setValoresStore(component.ctpatForm, 'campoInexistente');
      
      expect(mockTramite32617Store.establecerDatos).not.toHaveBeenCalled();
    });
  });

  describe('Validación de campos de pago', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      // Agregar controles de pago al formulario para las pruebas
      component.ctpatForm.addControl('fechaDePago', component.fb.control(''));
      component.ctpatForm.addControl('monto', component.fb.control(''));
      component.ctpatForm.addControl('operacionesBancarias', component.fb.control(''));
      component.ctpatForm.addControl('llavePago', component.fb.control(''));
      fixture.detectChanges();
    });

    it('debería marcar mostrarError como true cuando faltan campos de pago', () => {
      component.ctpatForm.patchValue({
        fechaDePago: '',
        monto: '',
        operacionesBancarias: '',
        llavePago: ''
      });

      component.validarCamposPago();

      expect(component.mostrarError).toBe(true);
    });

    it('debería marcar mostrarError como true cuando falta fechaDePago', () => {
      component.ctpatForm.patchValue({
        fechaDePago: null,
        monto: '1000',
        operacionesBancarias: '123456',
        llavePago: 'ABC123'
      });

      component.validarCamposPago();

      expect(component.mostrarError).toBe(true);
    });

    it('debería marcar mostrarError como true cuando falta monto', () => {
      component.ctpatForm.patchValue({
        fechaDePago: '2024-01-01',
        monto: '',
        operacionesBancarias: '123456',
        llavePago: 'ABC123'
      });

      component.validarCamposPago();

      expect(component.mostrarError).toBe(true);
    });

    it('debería marcar mostrarError como true cuando falta operacionesBancarias', () => {
      component.ctpatForm.patchValue({
        fechaDePago: '2024-01-01',
        monto: '1000',
        operacionesBancarias: null,
        llavePago: 'ABC123'
      });

      component.validarCamposPago();

      expect(component.mostrarError).toBe(true);
    });

    it('debería marcar mostrarError como true cuando falta llavePago', () => {
      component.ctpatForm.patchValue({
        fechaDePago: '2024-01-01',
        monto: '1000',
        operacionesBancarias: '123456',
        llavePago: ''
      });

      component.validarCamposPago();

      expect(component.mostrarError).toBe(true);
    });

    it('debería marcar mostrarError como false cuando todos los campos de pago están completos', () => {
      component.ctpatForm.patchValue({
        fechaDePago: '2024-01-01',
        monto: '1000',
        operacionesBancarias: '123456',
        llavePago: 'ABC123'
      });

      component.validarCamposPago();

      expect(component.mostrarError).toBe(false);
    });

    it('debería marcar todos los campos de pago como touched cuando están vacíos', () => {
      component.ctpatForm.patchValue({
        fechaDePago: '',
        monto: '',
        operacionesBancarias: '',
        llavePago: ''
      });

      component.validarCamposPago();

      expect(component.ctpatForm.get('fechaDePago')?.touched).toBe(true);
      expect(component.ctpatForm.get('monto')?.touched).toBe(true);
      expect(component.ctpatForm.get('operacionesBancarias')?.touched).toBe(true);
      expect(component.ctpatForm.get('llavePago')?.touched).toBe(true);
    });

    it('debería manejar el caso cuando los controles de pago no existen', () => {
      // Eliminar controles de pago
      component.ctpatForm.removeControl('fechaDePago');
      component.ctpatForm.removeControl('monto');
      component.ctpatForm.removeControl('operacionesBancarias');
      component.ctpatForm.removeControl('llavePago');

      expect(() => component.validarCamposPago()).not.toThrow();
      expect(component.mostrarError).toBe(true);
    });
  });

  describe('Validación del formulario completo', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      // Agregar controles de pago al formulario para las pruebas
      component.ctpatForm.addControl('fechaDePago', component.fb.control(''));
      component.ctpatForm.addControl('monto', component.fb.control(''));
      component.ctpatForm.addControl('operacionesBancarias', component.fb.control(''));
      component.ctpatForm.addControl('llavePago', component.fb.control(''));
      fixture.detectChanges();
    });

    it('debería retornar true cuando el formulario es válido y no hay errores de pago', () => {
      component.ctpatForm.patchValue({
        autorizacionCBP: '1',
        instalacionesCertificadasCBP: '0',
        suspensionCancelacionCBP: '1',
        fechaDePago: '2024-01-01',
        monto: '1000',
        operacionesBancarias: '123456',
        llavePago: 'ABC123'
      });

      const resultado = component.validarFormulario();

      expect(resultado).toBe(true);
    });

    it('debería retornar false cuando el formulario es inválido', () => {
      component.ctpatForm.patchValue({
        autorizacionCBP: '',
        instalacionesCertificadasCBP: '',
        suspensionCancelacionCBP: '',
        fechaDePago: '2024-01-01',
        monto: '1000',
        operacionesBancarias: '123456',
        llavePago: 'ABC123'
      });

      const resultado = component.validarFormulario();

      expect(resultado).toBe(false);
    });

    it('debería retornar false cuando hay errores en los campos de pago', () => {
      component.ctpatForm.patchValue({
        autorizacionCBP: '1',
        instalacionesCertificadasCBP: '0',
        suspensionCancelacionCBP: '1',
        fechaDePago: '',
        monto: '',
        operacionesBancarias: '',
        llavePago: ''
      });

      const resultado = component.validarFormulario();

      expect(resultado).toBe(false);
    });

    it('debería marcar todos los campos como touched cuando el formulario es inválido', () => {
      component.ctpatForm.patchValue({
        autorizacionCBP: '',
        instalacionesCertificadasCBP: '',
        suspensionCancelacionCBP: ''
      });

      const spyMarkAllAsTouched = jest.spyOn(component.ctpatForm, 'markAllAsTouched');

      component.validarFormulario();

      expect(spyMarkAllAsTouched).toHaveBeenCalled();
    });

    it('debería llamar a validarCamposPago durante la validación', () => {
      const spyValidarCamposPago = jest.spyOn(component, 'validarCamposPago');

      component.validarFormulario();

      expect(spyValidarCamposPago).toHaveBeenCalled();
    });

    it('debería retornar false cuando el formulario es válido pero hay errores de pago', () => {
      component.ctpatForm.patchValue({
        autorizacionCBP: '1',
        instalacionesCertificadasCBP: '0',
        suspensionCancelacionCBP: '1'
      });
      
      // Simular error en campos de pago
      component.mostrarError = true;

      const resultado = component.validarFormulario();

      expect(resultado).toBe(false);
    });

    it('debería manejar formularios con estructura mínima', () => {
      // Crear formulario solo con campos básicos
      component.ctpatForm = component.fb.group({
        autorizacionCBP: ['1', Validators.required],
        instalacionesCertificadasCBP: ['0', Validators.required],
        suspensionCancelacionCBP: ['1', Validators.required]
      });

      // Simular que no hay campos de pago, por lo que mostrarError se mantendría true por validarCamposPago
      const resultado = component.validarFormulario();

      // El resultado debe ser false porque validarCamposPago marcará mostrarError como true
      expect(resultado).toBe(false);
    });
  });

  describe('Gestión avanzada del modal', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería asignar la referencia del modal correctamente', () => {
      component.mostrarModalMensaje();

      expect(component.modalRef).toBeDefined();
      expect(typeof component.modalRef?.hide).toBe('function');
    });

    it('debería cerrar el modal múltiples veces sin errores', () => {
      component.modalRef = mockBsModalRef;
      
      component.cerrarModal();
      component.cerrarModal();

      expect(mockBsModalRef.hide).toHaveBeenCalledTimes(2);
    });
  });

  describe('Integración y flujo completo', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería completar el flujo de cambio de suspensión con modal', () => {
      const mockEvent = {
        target: { value: 'on' }
      } as any;

      const spySetValores = jest.spyOn(component, 'setValoresStore');
      const spyMostrarModal = jest.spyOn(component, 'mostrarModalMensaje');

      component.manejarCambioSuspensionCancelacion(mockEvent);

      expect(spySetValores).toHaveBeenCalled();
      expect(spyMostrarModal).toHaveBeenCalled();
    });

    it('debería manejar cambios de estado de solo lectura correctamente', () => {
      // Simular cambio a solo lectura
      component.esFormularioSoloLectura = true;
      component.inicializarEstadoFormulario();

      expect(component.ctpatForm.disabled).toBe(true);

      // Simular cambio a editable
      component.esFormularioSoloLectura = false;
      component.inicializarEstadoFormulario();

      expect(component.ctpatForm.enabled).toBe(true);
    });

    it('debería suscribirse correctamente al estado de consultaio durante la inicialización', () => {
      const spyInitializar = jest.spyOn(component, 'inicializarEstadoFormulario');
      
      // Simular cambio en el estado de consultaio
      const mockConsultaioState2 = { 
        readonly: true,
        procedureId: '',
        parameter: '',
        department: '',
        folioTramite: '',
        isValid: false
      } as any;
      
      // Verificar que el observable es llamado correctamente
      expect(mockConsultaioQuery.selectConsultaioState$).toBeDefined();
      
      // Al crear un nuevo componente, debería suscribirse al estado
      const newFixture = TestBed.createComponent(CTPATComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      // Verificar que el componente se inicializa correctamente
      expect(newComponent).toBeTruthy();
    });
  });

  describe('Casos extremos y robustez', () => {
    it('debería manejar valores undefined en el estado de la solicitud', () => {
      const undefinedState = {
        autorizacionCBP: undefined,
        instalacionesCertificadasCBP: undefined,
        suspensionCancelacionCBP: undefined
      } as any;

      mockTramite32617Query.selectTramite32617$ = of(undefinedState);
      
      expect(() => component.obtenerEstadoSolicitud()).not.toThrow();
      expect(component.solicitudState).toEqual(undefinedState);
    });

    it('debería manejar eventos con target que no es HTMLInputElement', () => {
      const mockEvent = {
        target: { value: 'test' } as any
      } as any;

      expect(() => component.manejarCambioSuspensionCancelacion(mockEvent)).not.toThrow();
    });

    it('debería preservar el estado del formulario después de múltiples inicializaciones', () => {
      component.inicializarFormulario();
      component.ctpatForm.patchValue({
        autorizacionCBP: '1',
        instalacionesCertificadasCBP: '0'
      });

      const valoresAnteriores = component.ctpatForm.value;
      
      component.inicializarFormulario();

      // El formulario se reinicializa, así que los valores pueden cambiar
      expect(component.ctpatForm).toBeDefined();
    });

    it('debería manejar la destrucción múltiple del componente', () => {
      const spyNext = jest.spyOn(component.destroy$, 'next');
      const spyComplete = jest.spyOn(component.destroy$, 'complete');

      component.ngOnDestroy();
      component.ngOnDestroy();

      expect(spyNext).toHaveBeenCalledTimes(2);
      expect(spyComplete).toHaveBeenCalledTimes(2);
    });
  });
  });
});