import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { ConsultaioQuery, REGEX_IMPORTE_PAGO, REGEX_LLAVE_DE_PAGO } from "@ng-mf/data-access-user";
import { Tramite260911State, Tramite260911Store } from '../../estados/tramite260911.store';
import { CommonModule } from '@angular/common';
import { PagoDeDerechosService } from '../../services/pago-de-derechos.service';
import { Tramite260911Query } from '../../estados/tramite260911.query';

import { ReactiveFormsModule } from '@angular/forms';
import { TituloComponent } from '@libs/shared/data-access-user/src';

/**
 * Interfaz que define la estructura de un banco en el catálogo.
 * Basada en la estructura real que retorna el servicio.
 */
interface Banco {
  /** Nombre del banco utilizado en el template */
  name: string;
  /** Propiedades adicionales que pueda tener el objeto banco */
  [key: string]: unknown;
}
/**
 * Componente para el manejo del formulario de pago de derechos del trámite 260911.
 * 
 * Este componente gestiona la captura, validación y persistencia de la información
 * relacionada con los pagos de derechos para el trámite de modificación del permiso
 * sanitario de importación. Incluye validaciones personalizadas para fechas y formatos
 * de pago, así como integración con el store de estado del trámite.
 * 
 * Características principales:
 * - Formulario reactivo con validaciones personalizadas
 * - Integración con el store de estado del trámite
 * - Validación de fechas límite y formatos de pago
 * - Manejo de estados de solo lectura y habilitado/deshabilitado
 * - Carga dinámica de catálogo de bancos
 * 
 * @author SuNombre
 * @version 1.0
 */
@Component({
  selector: 'app-pago-de-derechos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent],
  providers: [PagoDeDerechosService],
  templateUrl: './pago-de-derechos.component.html',
  styleUrls: ['./pago-de-derechos.component.scss'],
})
export class PagoDeDerechosComponent implements OnInit, OnDestroy, OnChanges {

  /**
   * Indica si se deben mostrar los errores relacionados con el campo de pago.
   * Cuando es `true`, los mensajes de error del campo de pago serán visibles en la interfaz.
   */
   public mostrarErroresDeCampoPago: boolean = false;
   

  /** Formulario reactivo para la captura de datos de pago de derechos */
  public pagoDeDerechosForm!: FormGroup;
  
  /** Subject para manejar la destrucción de suscripciones */
  public destroyed$ = new Subject<void>();
  
  /** Estado seleccionado del trámite 260911 */
  estadoSeleccionado!: Tramite260911State;
  
/** Lista de bancos disponibles para selección */
  public bancoList: Banco[] = [];
  
  /** Bandera que indica si el formulario está en modo de solo lectura */
  esFormularioSoloLectura: boolean = false;

  /** Propiedad de entrada que indica si el componente está deshabilitado */
  @Input() disabled: boolean = false;
  
  /** Propiedad de entrada que especifica el tipo de trámite */
  @Input() tipoTramite: string = '';

   /**
 * Indica si el botón "Continuar" ha sido presionado por el usuario.
 */
  public isContinuarButtonClicked: boolean = false;

  /**
   * Constructor del componente.
   * @param fb - Constructor de formularios reactivos de Angular
   * @param tramite260911Query - Query para consultar el estado del trámite 260911
   * @param tramite260911Store - Store para actualizar el estado del trámite 260911
   * @param servicio - Servicio para operaciones de pago de derechos
   * @param consultaQuery - Query para consultar el estado general de la consulta
   */
  constructor(
    private fb: FormBuilder,
    private tramite260911Query: Tramite260911Query,
    private tramite260911Store: Tramite260911Store,
    private servicio: PagoDeDerechosService,
    private consultaQuery: ConsultaioQuery
  ) { }

  /**
   * Hook de inicialización del componente.
   * Configura las suscripciones al estado de consulta y carga la lista de bancos.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(state => {
        this.esFormularioSoloLectura = state.readonly;
        this.inicializarEstadoFormulario();
      });

    this.getBancoList();
    
  }

  /**
   * Hook que se ejecuta cuando cambian las propiedades de entrada.
   * Actualiza el estado del formulario basado en los cambios de entrada.
   */
  ngOnChanges(): void {
    
    if (this.pagoDeDerechosForm) {
      if (!this.esFormularioSoloLectura && !this.disabled) {
        this.pagoDeDerechosForm.enable();
      } else {
        this.pagoDeDerechosForm.disable();
      }
    }
  }

  /**
   * Inicializa el estado del formulario basado en las condiciones actuales.
   * Crea el formulario y establece su estado de habilitado/deshabilitado.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.crearForm();
      this.pagoDeDerechosForm.disable();
    } else {
      this.crearForm();
      
      if (!this.disabled && (this.tipoTramite === '1' || this.tipoTramite === '2')) {
        this.pagoDeDerechosForm.enable();
      } else {
        this.pagoDeDerechosForm.disable();
      }
    }
  }

  /**
   * Crea el formulario reactivo con los campos de pago de derechos.
   * Configura las validaciones y se suscribe al estado del trámite para actualizar valores.
   */
  crearForm(): void {
    this.tramite260911Query.selectTramite260911$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(state => {
        this.estadoSeleccionado = state;
        
        if (this.pagoDeDerechosForm) {
          this.pagoDeDerechosForm.patchValue({
            claveDeReferencia: state.claveDeReferencia,
            cadenaPagoDependencia: state.cadenaPagoDependencia,
            clave: state.clave,
            llaveDePago: state.llaveDePago,
            fecPago: state.fecPago,
            impPago: state.impPago
          });
        }
      });

   this.pagoDeDerechosForm = this.fb.group(
  {
    claveDeReferencia: [
      this.estadoSeleccionado?.claveDeReferencia ?? '',
      [Validators.maxLength(50)]
    ],
    cadenaPagoDependencia: [
      this.estadoSeleccionado?.cadenaPagoDependencia ?? '',
      [Validators.maxLength(50)]
    ],
    clave: [
      this.estadoSeleccionado?.clave ?? ''
    ],
    llaveDePago: [
      this.estadoSeleccionado?.llaveDePago ?? '',
      [Validators.pattern(REGEX_LLAVE_DE_PAGO)]
    ],
    fecPago: [
      this.estadoSeleccionado?.fecPago ?? '',
      [PagoDeDerechosComponent.fechaLimValidator()]
    ],
    impPago: [
      this.estadoSeleccionado?.impPago ?? '',
      [Validators.maxLength(30), Validators.pattern(REGEX_IMPORTE_PAGO), PagoDeDerechosComponent.noComaValidator()]
    ]
  },
  {
    validators: [PagoDeDerechosComponent.camposDependientesValidator()]
  }
);

  }

  /**
 * Validador que obliga a completar todos los campos si al menos uno está lleno.
 * Aplica el error 'required' solo si algún campo tiene valor y otros no.
 */
public static camposDependientesValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const FORM = group as FormGroup;
    const FIELDS = [
      'claveDeReferencia',
      'cadenaPagoDependencia',
      'clave',
      'llaveDePago',
      'fecPago',
      'impPago'
    ];

    const ANY_FILLED = FIELDS.some(field => {
      const VALUE = FORM.get(field)?.value;
      return VALUE !== null && VALUE !== undefined && VALUE !== '';
    });

    if (!ANY_FILLED) {
      FIELDS.forEach(field => {
        const CONTROL = FORM.get(field);
        if (CONTROL?.hasError('required')) {
          const CURRENT_ERRORS = { ...CONTROL.errors };
          delete CURRENT_ERRORS['required'];
          CONTROL.setErrors(Object.keys(CURRENT_ERRORS).length > 0 ? CURRENT_ERRORS : null);
        }
      });
      return null;
    }

    // If any field is filled, all must be filled
    let hasError = false;
    FIELDS.forEach(field => {
      const CONTROL = FORM.get(field);
      const VALUE = CONTROL?.value;
      if (VALUE === null || VALUE === undefined || VALUE === '') {
        CONTROL?.setErrors({
          ...CONTROL.errors,
          required: true,
          custom: 'Todos los campos de pago son requeridos'
        });
        hasError = true;
      } else {
        if (CONTROL?.hasError('required')) {
          const CURRENT_ERRORS = { ...CONTROL.errors };
          delete CURRENT_ERRORS['required'];
          delete CURRENT_ERRORS['custom'];
          CONTROL.setErrors(Object.keys(CURRENT_ERRORS).length > 0 ? CURRENT_ERRORS : null);
        }
      }
    });

    return hasError ? { required: true } : null;
  };
}


  /**
   * Obtiene la lista de bancos disponibles desde el servicio.
   * Se suscribe al servicio para recibir actualizaciones de la lista de bancos.
   */
  getBancoList(): void {
    this.servicio.onBancoList()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(data => {
       this.bancoList = ((data as unknown) as Banco[]).map(item => ({
         ...item
       })) as Banco[];
      });
  }

  /**
   * Validador personalizado para fechas límite.
   * Valida que la fecha ingresada no sea posterior a la fecha actual.
   * @returns Función validadora que retorna error si la fecha es futura
   */
  public static fechaLimValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const VAL = control.value;
      if (VAL) {
        const [YEAR, MONTH, DAY] = VAL.split('-').map((str: string) => Number(str));
        const FECHA = new Date(YEAR, MONTH - 1, DAY);
        const TODAY = new Date();
        if (FECHA.getTime() > TODAY.getTime()) {
          return { fechaLim: true };
        }
      }
      return null;
    };
  }

  /**
   * Validador personalizado para evitar comas en campos de texto.
   * Valida que el valor del campo no contenga comas.
   * @returns Función validadora que retorna error si contiene comas
   */
  public static noComaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const VAL = control.value;
      if (VAL && typeof VAL === 'string' && VAL.includes(',')) {
        return { noComa: true };
      }
      return null;
    };
  }

  /**
   * Verifica si un control específico del formulario es inválido.
   * @param controlName - Nombre del control a verificar
   * @returns true si el control es inválido y ha sido tocado o modificado
   */
  public esInvalido(controlName: string): boolean {
    const CTRL = this.pagoDeDerechosForm.get(controlName);
    if (!CTRL) { return false; }
    return CTRL.invalid && (CTRL.touched || CTRL.dirty);
  }

  /**
   * Actualiza el store con el valor de un campo específico del formulario.
   * @param form - Formulario que contiene el campo
   * @param campo - Nombre del campo cuyo valor se actualizará en el store
   */
  public setValoresStore(form: FormGroup, campo: string): void {
    const CTRL = form.get(campo);
    if (!CTRL) { return; }
    const VALOR = CTRL.value;
    this.tramite260911Store.setTramite260911State({ [campo]: VALOR });
    this.mostrarErroresDeCampoPago = false;
  }

  /**
   * Valida que un campo no contenga comas y actualiza su validez.
   * @param field - Nombre del campo a validar
   */
  public validarSinComas(field: string): void {
    const CTRL = this.pagoDeDerechosForm.get(field);
    if (!CTRL) { return; }
    CTRL.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Valida que la fecha de un campo no sea futura y actualiza su validez.
   * @param field - Nombre del campo de fecha a validar
   */
  public validarFechaFutura(field: string): void {
    const CTRL = this.pagoDeDerechosForm.get(field);
    if (!CTRL) { return; }
    CTRL.updateValueAndValidity({ emitEvent: false });
  }

   /**
   * Resetea todos los campos del formulario de pago de derechos y actualiza el store.
   * Marca los controles como pristine y untouched para ocultar errores de campos requeridos después de borrar.
   * Se invoca al hacer clic en el botón "Borrar datos del pago".
   */

public resetPagoDeDerechos(): void {
  if (!this.pagoDeDerechosForm) { return; }
  this.pagoDeDerechosForm.reset();
  Object.values(this.pagoDeDerechosForm.controls).forEach(c => {
    c.markAsPristine();
    c.markAsUntouched();
    c.updateValueAndValidity();
  });
  this.mostrarErroresDeCampoPago = false; // <-- Reset flag
  this.tramite260911Store.setTramite260911State({
    claveDeReferencia: '',
    cadenaPagoDependencia: '',
    clave: '',
    llaveDePago: '',
    fecPago: '',
    impPago: ''
  });
}

  /**
   * Verifica si todos los campos de pago están vacíos.
   * @returns true si todos los campos están vacíos, false en caso contrario
   */
  public areAllPaymentFieldsEmpty(): boolean {
    if (!this.pagoDeDerechosForm) { return true; }
    const VALUES = this.pagoDeDerechosForm.value;
    return Object.values(VALUES).every(v => v === null || v === '' || v === undefined);
  }

  /**
   * Verifica si algún campo de pago tiene información capturada.
   * @returns true si al menos un campo tiene información, false si todos están vacíos
   */
  public hasAnyPaymentFieldFilled(): boolean {
    if (!this.pagoDeDerechosForm) { return false; }
    const VALUES = this.pagoDeDerechosForm.value;
    return Object.values(VALUES).some(v => v !== null && v !== '' && v !== undefined);
  }

  /**
   * Valida que el pago esté completo y sea válido.
   * Marca todos los campos como tocados para mostrar errores de validación.
   * @returns true si el pago está completo y válido, false en caso contrario
   */
 public validatePagoCompleto(): boolean {
  if (!this.pagoDeDerechosForm) {
    return false;
  }

  Object.values(this.pagoDeDerechosForm.controls).forEach(ctrl => {
    ctrl.markAsTouched();
    ctrl.markAsDirty();
    ctrl.updateValueAndValidity();
  });

  // Trigger form-level validation
  this.pagoDeDerechosForm.updateValueAndValidity();

  return this.pagoDeDerechosForm.valid;
}


  /**
   * Determina si debe mostrarse el banner de error de campos de pago requeridos.
   * @returns true si hay campos llenos pero el formulario es inválido
   */
  public showPagoRequiredErrorBanner(): boolean {
    return this.hasAnyPaymentFieldFilled() && this.pagoDeDerechosForm.invalid;
  }

  /**
   * Hook de destrucción del componente.
   * Completa el subject para cancelar todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

    /**
 * Ejecuta la validación del formulario de solicitud y reinicia el indicador
 * del botón "Continuar" a su estado inicial.
 */
  formularioSolicitudValidacion(): boolean {
    this.isContinuarButtonClicked = false;
    
    const CLAVE_REFERENCIA_VALUE = this.pagoDeDerechosForm.get('claveDeReferencia')?.value;
    const CADENA_DEPENDENCIA_VALUE = this.pagoDeDerechosForm.get('cadenaPagoDependencia')?.value;
    const LLAVE_PAGO_VALUE = this.pagoDeDerechosForm.get('llaveDePago')?.value;
    const IMPORTE_PAGO_VALUE = this.pagoDeDerechosForm.get('impPago')?.value;
    const FECHA_PAGO_VALUE = this.pagoDeDerechosForm.get('fecPago')?.value;
    const BANCO_PAGO_VALUE = this.pagoDeDerechosForm.get('clave')?.value;
    
    const ANY_FIELDS_HAVE_VALUE= (CLAVE_REFERENCIA_VALUE !== '' && CLAVE_REFERENCIA_VALUE !== null) ||
    (CADENA_DEPENDENCIA_VALUE !== '' && CADENA_DEPENDENCIA_VALUE !== null) ||
    (LLAVE_PAGO_VALUE !== '' && LLAVE_PAGO_VALUE !== null) ||
    (IMPORTE_PAGO_VALUE !== '' && IMPORTE_PAGO_VALUE !== null ) ||
    (FECHA_PAGO_VALUE !== '' && FECHA_PAGO_VALUE !== null ) ||
    (BANCO_PAGO_VALUE !== '' && BANCO_PAGO_VALUE !== null &&BANCO_PAGO_VALUE !== '-1');
    
    if (ANY_FIELDS_HAVE_VALUE) {
      this.pagoDeDerechosForm.markAllAsTouched();
      this.isContinuarButtonClicked = true;
    }
    
    return this.isAllFieldHaveValue();
  }

  isAllFieldHaveValue(): boolean {
    const CLAVE_REFERENCIA_VALUE = this.pagoDeDerechosForm.get('claveDeReferencia')?.value;
    const CADENA_DEPENDENCIA_VALUE = this.pagoDeDerechosForm.get('cadenaPagoDependencia')?.value;
    const LLAVE_PAGO_VALUE = this.pagoDeDerechosForm.get('llaveDePago')?.value;
    const IMPORTE_PAGO_VALUE = this.pagoDeDerechosForm.get('impPago')?.value;
    const FECHA_PAGO_VALUE = this.pagoDeDerechosForm.get('fecPago')?.value;
    const BANCO_PAGO_VALUE = this.pagoDeDerechosForm.get('clave')?.value;
    
    const ALL_FIELDS_VALID = (CLAVE_REFERENCIA_VALUE !== '' && CLAVE_REFERENCIA_VALUE !== null) && 
                            (CADENA_DEPENDENCIA_VALUE !== '' && CADENA_DEPENDENCIA_VALUE !== null) && 
                            (LLAVE_PAGO_VALUE !== '' && LLAVE_PAGO_VALUE !== null) && 
                            (IMPORTE_PAGO_VALUE !== '' && IMPORTE_PAGO_VALUE !== null ) && 
                            (FECHA_PAGO_VALUE !== '' && FECHA_PAGO_VALUE !== null )&&
                            (BANCO_PAGO_VALUE !== '' && BANCO_PAGO_VALUE !== null && BANCO_PAGO_VALUE !== '-1');
    return ALL_FIELDS_VALID;
  }
}