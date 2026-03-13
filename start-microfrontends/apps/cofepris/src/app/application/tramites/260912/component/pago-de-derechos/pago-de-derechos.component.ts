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
import { Tramite260912Store, Tramites260912State } from '../../estados/tramite-260912.store';
import { CommonModule } from '@angular/common';
import { PagoDeDerechosService } from '../../services/pago-de-derechos.service';
import { Tramite260912Query } from '../../estados/tramite-260912.query';

import { ReactiveFormsModule } from '@angular/forms';
import { TituloComponent } from '@libs/shared/data-access-user/src';

/**
 * Interfaz que define la estructura de un banco en el catálogo.
 * Basada en la estructura real que retorna el servicio.
 */
interface Banco {
  id: number;
  descripcion: string;
}

/**
 * Selector del componente
 * Habilita el uso independiente de este componente
 * Módulos necesarios
 * Proveedores de servicios para inyección de dependencias
 * Ruta del archivo HTML
 * Ruta del archivo CSS
 */
@Component({
  selector: 'app-pago-de-derechos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent],
  providers: [PagoDeDerechosService],
  templateUrl: './pago-de-derechos.component.html',
  styleUrl: './pago-de-derechos.component.scss',
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
  
  /** Estado seleccionado del trámite 260912 */
  estadoSeleccionado!: Tramites260912State;
  
/** Lista de bancos disponibles para selección */
  public bancoList: Banco[] = [];
  
  /** Bandera que indica si el formulario está en modo de solo lectura */
  esFormularioSoloLectura: boolean = false;

  /** Propiedad de entrada que indica si el componente está deshabilitado */
  @Input() disabled: boolean = false;
  
  /** Propiedad de entrada que especifica el tipo de trámite */
  @Input() tipoTramite: string = '';

  /**
   * Constructor del componente.
   * @param fb - Constructor de formularios reactivos de Angular
   * @param tramite260912Query - Query para consultar el estado del trámite 260912
   * @param tramite260912Store - Store para actualizar el estado del trámite 260912
   * @param servicio - Servicio para operaciones de pago de derechos
   * @param consultaQuery - Query para consultar el estado general de la consulta
   */
  constructor(
    private fb: FormBuilder,
    private tramite260912Query: Tramite260912Query,
    private tramite260912Store: Tramite260912Store,
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
    this.tramite260912Query.selectTramite260912$
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
        [
          Validators.maxLength(30), 
          Validators.pattern(REGEX_IMPORTE_PAGO), 
          PagoDeDerechosComponent.noComaValidator(),
          PagoDeDerechosComponent.numeroEnteroValidator(),
          PagoDeDerechosComponent.maxDecimalesValidator()
        ]
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
     this.bancoList = data as Banco[];
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
   * Validador personalizado para campos numéricos enteros.
   * Valida que el valor contenga solo números enteros.
   * @returns Función validadora que retorna error si no es un número entero válido
   */
  public static numeroEnteroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const VALUE = control.value;
      if (!VALUE) {
        return null;
      }
      
      const NUMERICREGEX = /^\d+(\.\d+)?$/;
      if (!NUMERICREGEX.test(VALUE.toString())) {
        return { numeroInvalido: true };
      }
      
      return null;
    };
  }

  /**
   * Validador personalizado para campos con máximo 2 decimales.
   * Valida que el valor tenga como máximo 2 decimales.
   * @returns Función validadora que retorna error si tiene más de 2 decimales
   */
  public static maxDecimalesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const VALUE = control.value;
      if (!VALUE) {
        return null;
      }
      
      const STRINGVALUE = VALUE.toString();
      
     
      if (STRINGVALUE.includes('.')) {
        const DECIMALPART = STRINGVALUE.split('.')[1];
        if (DECIMALPART && DECIMALPART.length > 2) {
          return { maxDecimales: true };
        }
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
    this.tramite260912Store.setTramite260912State({ [campo]: VALOR });
    this.mostrarErroresDeCampoPago = false;
  }

  /**
   * Valida el campo de importe con las reglas específicas.
   * @param field - Nombre del campo a validar
   */
  public validarImporte(field: string): void {
    const CTRL = this.pagoDeDerechosForm.get(field);
    if (!CTRL) { return; }
    CTRL.updateValueAndValidity({ emitEvent: false });
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

validarFechaFutura(controlName: string): void {
  const CONTROL = this.pagoDeDerechosForm.get(controlName);
  if (!CONTROL) {
    return;
  }
  
  const VALOR = CONTROL.value;
  if (VALOR) {
    const FECHA_SELECCIONADA = new Date(VALOR);
    const FECHA_ACTUAL = new Date();
    FECHA_ACTUAL.setHours(0, 0, 0, 0); 
    const CURRENT_ERRORS = CONTROL.errors || {};

    if (FECHA_SELECCIONADA > FECHA_ACTUAL) {
      CONTROL.setErrors({ ...CURRENT_ERRORS, custom: 'La fecha de pago debe ser menor o igual a la fecha actual.' });
    } else {
      if ('custom' in CURRENT_ERRORS) {
        delete CURRENT_ERRORS['custom'];
        CONTROL.setErrors(Object.keys(CURRENT_ERRORS).length ? CURRENT_ERRORS : null);
      }
    }
  }
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
  this.tramite260912Store.setTramite260912State({
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
}