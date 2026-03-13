import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Catalogo, CatalogoSelectComponent, CatalogosService, InputFecha, InputFechaComponent, InputRadioComponent, REGEX_LLAVE_DE_PAGO_DE_DERECHO, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';
import { FECHA_DE_PAGO } from '../../../../shared/constantes/pago-de-derechos.enum';
import { PagoDeDerecho } from '../../../../shared/models/tercerosrelacionados.model';


/**
 * Interfaz que define una opción para un control de selección tipo radio button.
 * @interface RadioOpcion
 * @property {string} label - Etiqueta visible para el usuario.
 * @property {string} value - Valor interno asignado a la opción seleccionada.
 */
export interface RadioOpcion {
    /**
     * Etiqueta visible para el usuario.
     */
    label: string;
    /**
     * Valor interno asignado a la opción seleccionada.
     */
    value: string;
}

/**
 * Modelo para capturar la información correspondiente al pago de derechos.
 * @interface PagoDeDerechos
 * @property {string} exentoPago Indica si el pago está exento (Sí/No).
 * @property {string} justificacion Justificación del motivo de exención (si aplica).
 * @property {string} claveReferencia Clave de referencia para el pago.
 * @property {string} cadenaDependencia Cadena generada por la dependencia para pago.
 * @property {string} banco Nombre del banco donde se realiza el pago.
 * @property {string} llavePago Llave única para realizar el pago.
 * @property {string} importePago Monto del pago.
 * @property {string} fechaPago Fecha en que se realizó el pago.
 */
export interface PagoDeDerechos {
  /**
   * Indica si el pago está exento (Sí/No).
   */
  exentoPago: string;
  /**
   * Justificación del motivo de exención (si aplica).
   */
  justificacion: string;
  /**
   * Clave de referencia para el pago.
   */
  claveReferencia: string;
  /**
   * Cadena generada por la dependencia para pago.
   */
  cadenaDependencia: string;
  /**
   * Nombre del banco donde se realiza el pago.
   */
  banco: string;
  /**
   * Llave única para realizar el pago.
   */
  llavePago: string;
  /**
   * Monto del pago.
   */
  importePago: string;
  /**
   * Fecha en que se realizó el pago.
   */
  fechaPago: string;
}


@Component({
  selector: 'app-pago-derechos',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    InputFechaComponent,
    CatalogoSelectComponent,
    InputRadioComponent,
    FormsModule
  ],
  templateUrl: './pago-de-derecho.component.html',
  styleUrl: './pago-de-derecho.component.scss',
})
export class PagsDeDerechoComponent implements OnDestroy, OnInit, AfterViewInit, OnChanges {
  /**
    * Configuración predeterminada para el campo de fecha de pago.
    */
  fechaInicioInput: InputFecha = FECHA_DE_PAGO;


  /**
   * Lista de opciones para el selector de justificación.
   */
  justificacionSelector: Catalogo[] = [];

  /**
   * Indica si se debe establecer la fecha de pago.
   * @type {boolean}
   * @default true
   * @see https://compodoc.app/
   *
   * @description
   * Esta propiedad controla si el campo de fecha de pago debe ser editable o no.
   */
  public setFecha = true;

  /**
* bandera para indicar que el formulario fue tocado
*/
  markTouched: boolean = false;


  /**
   * Formulario reactivo que gestiona los campos del pago de derechos.
   */
  pagoForm: FormGroup = this.fb.group({
    exentoPago: [""],
    justificacion: [""],
    claveReferencia: [""],
    cadenaDependencia: [""],
    banco: [""],
    llavePago: ["", [Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
    importePago: [""],
    fechaPago: [""]
  });


  /**
   * Opciones disponibles para el campo de radio sobre la exención de pago.
   */
  radioOptions: RadioOpcion[] = [
    { label: "No", value: "no" },
    { label: "Sí", value: "si" }
  ];

  /**
   * Sujeto para manejar la destrucción de observables y evitar fugas de memoria.
   */
  private destroyNotifier$ = new Subject<void>();
  /**
   * @desc Objeto que contiene la información relacionada con el pago de derechos.
   * @type {PagoDeDerechos}
   * @memberof PagoDeDerechoComponent
   * @input
   * @description [Compodoc] Propiedad de entrada que recibe los datos del pago de derechos para ser utilizados en el componente.
   */
  @Input() pagoDeDerechos: PagoDeDerechos = {} as PagoDeDerechos;

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   *
   * @type {boolean}
   * @default false
   * @see https://compodoc.app/
   *
   * @description
   * Cuando es verdadero, el formulario se presenta únicamente para visualización,
   * deshabilitando la edición de los campos.
   */
  @Input() esFormularioSoloLectura: boolean = false;


  /**
   * @description
   * Evento emitido cuando se produce un cambio en el pago de derechos.
   *
   * @param pagoChanged - Emite un objeto de tipo `PagoDeDerechos` con la información actualizada del pago.
   *
   * @event
   */
  @Output() pagoChanged = new EventEmitter<PagoDeDerechos>();

  @Input() pagoSelect: PagoDeDerecho = {
    justificacionSelector: [],
    bancoSelector: []

  };
  /**
   * Constructor del componente. Inyecta los servicios y realiza una carga inicial de catálogos.
   * @param fb Constructor de formularios reactivos.
   * @param httpServicios Cliente HTTP para peticiones.
   * @param certificadoZoosanitarioServices Servicio para actualizar datos de pago.
   * @param certificadoZoosanitarioQuery Fuente de datos del estado actual de certificado.
   * @param consultaQuery Fuente de datos del estado de consulta.
   */
  constructor(
    private readonly fb: FormBuilder,

  ) {
  }
  /**
   * @inheritdoc
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * @remarks
   * Este método inicializa el formulario `pagoForm` con los valores provenientes del objeto `pagoDeDerechos`.
   * Si alguna propiedad no está definida, se asigna un valor por defecto.
   *
   * @see https://angular.io/guide/lifecycle-hooks
   *
   * @memberof PagoDeDerechoComponent
   */
  ngOnInit(): void {
    if (this.pagoForm.value.exentoPago === 'no') {
      this.pagoForm.get('llavePago')?.disable();
      this.pagoForm.get('fechaPago')?.disable();
      this.fechaInicioInput.habilitado = true;
 
    }
 
  }

ngOnChanges(changes: SimpleChanges): void {
  // Verificamos si la propiedad 'pagoDeDerechos' ha cambiado y tiene un valor válido
  if (changes['pagoDeDerechos'] && changes['pagoDeDerechos'].currentValue) {
    const DATA = changes['pagoDeDerechos'].currentValue;

    // Normalización: Convertimos 'No' o 'Si' a minúsculas para que coincida con radioOptions
    const EXTENTONORMALIZADO = DATA.exentoPago?.toLowerCase() === 'si' ? 'si' : 'no';

    // Actualizamos el formulario con los valores entrantes
    this.pagoForm.patchValue({
      exentoPago: EXTENTONORMALIZADO,
      justificacion: DATA.justificacion || '',
      // Si los valores vienen vacíos, se asignan valores por defecto según la lógica de negocio
      claveReferencia: DATA.claveReferencia || '',
      cadenaDependencia: DATA.cadenaDependencia || '',
      banco: DATA.banco || '',
      llavePago: DATA.llavePago || '',
      importePago: DATA.importePago || '',
      // Si no hay fecha, utilizamos el método estático para formatear la fecha actual
      fechaPago: DATA.fechaPago || ''
    }, { emitEvent: false }); // Evitamos disparar eventos infinitos durante la carga inicial

    // Ejecutamos la lógica de habilitar/deshabilitar campos basada en el nuevo estado
    this.radioChange();
  }
}
  /**
   * @inheritdoc
   * @description
   * Método del ciclo de vida de Angular que se ejecuta después de que la vista del componente ha sido inicializada.
   *
   * @remarks
   * Este método habilita o deshabilita el formulario `pagoForm` dependiendo del valor de `esFormularioSoloLectura`.
   *
   * @see https://angular.io/guide/lifecycle-hooks
   *
   * @memberof PagoDeDerechoComponent
   */
  ngAfterViewInit(): void {
    if (this.esFormularioSoloLectura) {
      this.pagoForm.disable();
    }
    else {
      this.pagoForm.enable();
      this.radioChange();
    }
  }

  static formatDate(): string {
    const DATE = new Date();
    const DAY = String(DATE.getDate()).padStart(2, '0');
    const MONTH = String(DATE.getMonth() + 1).padStart(2, '0');
    const YEAR = DATE.getFullYear();
    return `${DAY}/${MONTH}/${YEAR}`;
  }




  radioChange(): void {
    if (!this.esFormularioSoloLectura && this.pagoForm.value.exentoPago === 'si') {
      this.pagoForm.get('justificacion')?.enable();
      this.pagoForm.get('claveReferencia')?.disable();
      this.pagoForm.get('cadenaDependencia')?.disable();
      this.pagoForm.get('banco')?.disable();
      this.pagoForm.get('llavePago')?.disable();
      this.pagoForm.get('importePago')?.disable();
      this.pagoForm.get('fechaPago')?.disable();
      this.pagoForm.reset();
      this.pagoForm.patchValue({ exentoPago: 'si' });

    }
    else if (!this.esFormularioSoloLectura && this.pagoForm.value.exentoPago === 'no') {
      this.fechaInicioInput.required = true;
      this.fechaInicioInput.habilitado = true;
      this.pagoForm.get('justificacion')?.disable();
      this.pagoForm.get('claveReferencia')?.disable();
      this.pagoForm.get('cadenaDependencia')?.disable();
      const BANCO_CONTROL = this.pagoForm.get('banco');
      BANCO_CONTROL?.setValidators([Validators.required]);
      BANCO_CONTROL?.disable();
      this.pagoForm.get('llavePago')?.disable();
      this.pagoForm.get('llavePago')?.setValidators([Validators.required,
      Validators.pattern(REGEX_LLAVE_DE_PAGO_DE_DERECHO),
      Validators.maxLength(30)]);
      this.pagoForm.get('importePago')?.disable();
      this.pagoForm.get('fechaPago')?.disable();
      this.pagoForm.get('fechaPago')?.clearValidators();
    }
  }

  /**
* @method onFechaCambiada
* @description Actualiza la fecha de pago en el formulario.
*
* @param {string} fecha - Fecha seleccionada en el componente `InputFecha`.
*/
  onFechaCambiada(fecha: string): void {
    this.pagoForm.patchValue({ fechaPago: fecha });
    this.pagoForm.get('fechaPago')?.markAsTouched();
    // Validar manualmente la fecha
    this.validarFechaFutura(fecha);
    this.pagoForm.get('fechaPago')?.updateValueAndValidity();
    this.actualizarPago();
  }

  /**
   * @method validarFechaFutura
   * @description Valida si la fecha seleccionada es futura y establece errores manualmente.
   *
   * @param {string} fecha - Fecha en formato DD/MM/YYYY.
   */
  validarFechaFutura(fecha: string): void {
    if (!fecha) {
      return;
    }
   
    const FECHA_PARTES = fecha.split('/');
    if (FECHA_PARTES.length !== 3) {
      return;
    }
   
    const DIA = parseInt(FECHA_PARTES[0], 10);
    // Los meses en JavaScript son 0-indexed
    const MES = parseInt(FECHA_PARTES[1], 10) - 1;
    const ANIO = parseInt(FECHA_PARTES[2], 10);
   
    const FECHA_SELECCIONADA = new Date(ANIO, MES, DIA);
    const FECHA_ACTUAL = new Date();
   
    // Normalizar las fechas para comparar solo días (sin horas)
    FECHA_SELECCIONADA.setHours(0, 0, 0, 0);
    FECHA_ACTUAL.setHours(0, 0, 0, 0);
   
    const CONTROL = this.pagoForm.get('fechaPago');
    if (CONTROL) {
      if (FECHA_SELECCIONADA > FECHA_ACTUAL) {
        // Establecer error manualmente
        CONTROL.setErrors({ futureDateNotAllowed: true });
      } else {
        // Limpiar el error específico pero mantener otros errores
        const ERRORS = CONTROL.errors;
        if (ERRORS) {
          delete ERRORS['futureDateNotAllowed'];
          if (Object.keys(ERRORS).length === 0) {
            CONTROL.setErrors(null);
          } else {
            CONTROL.setErrors(ERRORS);
          }
        }
      }
    }
  }

  /**
   * @description Verifica si un control del formulario es inválido.
   * @param nombreControl El nombre del control a verificar.
   * @returns Verdadero si el control es inválido y está tocado o modificado, de lo contrario, falso.
   */
  esInvalido(nombreControl: string): boolean {
    const CONTROL = this.pagoForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * @desc Actualiza el objeto de pago de derechos y emite el evento correspondiente.
   * @memberof PagoDeDerechoComponent
   */
  actualizarPago(): void {
    this.actualizarTodoelForm();
  }

  /**
 * @desc Actualiza los datos al cambiar algun campo.
 * @memberof PagoDeDerechoComponent
 */
  actualizarTodoelForm(): void {
    const DATOS_PAGOS = {
      exentoPago: this.pagoForm.value.exentoPago,
      justificacion: this.pagoForm.get('justificacion')?.value,
      claveReferencia: this.pagoForm.get('claveReferencia')?.value,
      cadenaDependencia: this.pagoForm.get('cadenaDependencia')?.value,
      banco: this.pagoForm.get('banco')?.value,
      llavePago: this.pagoForm.get('llavePago')?.value,
      importePago: this.pagoForm.get('importePago')?.value,
      fechaPago: this.pagoForm.get('fechaPago')?.value
    }
    if(this.pagoForm.get('claveReferencia')?.value ||
      this.pagoForm.get('cadenaDependencia')?.value ||
      this.pagoForm.get('importePago')?.value){
        this.pagoChanged.emit(DATOS_PAGOS);
    }
   
  }


  /**
   * @description Método que se ejecuta al hacer clic en el botón "Borrar".
   * Resetea el formulario de pago y restablece los valores predeterminados.
   * @param {void}
   * @returns {void}
   */
  onBorrar(): void {
    this.setFecha = false;
    const EXTENDO_PAGO = JSON.parse(JSON.stringify(this.pagoForm.get('exentoPago')?.value));
    this.pagoForm.patchValue({
      exentoPago: EXTENDO_PAGO ? EXTENDO_PAGO : 'no',
      fechaPago: '',
      llavePago: '',
      banco: '',
      justificacion: ''
    });
    setTimeout(() => {
      this.setFecha = true;
    })
  }
  /**
   * @method validarFormulario
   * @description
   *
   * @returns {boolean} 
   *
   * @memberof PagoDeDerechoComponent
   */
  validarFormulario(): boolean {
    this.markTouched = true;
    if (!this.esFormularioSoloLectura && this.pagoForm.value.exentoPago === 'si') {
      this.pagoForm.get('justificacion')?.setValidators([Validators.required]);
      this.pagoForm.get('fechaPago')?.setValidators([Validators.required]);
      this.pagoForm.get('claveReferencia')?.clearValidators();
      this.pagoForm.get('cadenaDependencia')?.clearValidators();
      this.pagoForm.get('banco')?.clearValidators();
      this.pagoForm.get('llavePago')?.clearValidators();
      this.pagoForm.get('importePago')?.clearValidators();
    } else if (!this.esFormularioSoloLectura && this.pagoForm.value.exentoPago === 'no') {
      this.pagoForm.get('justificacion')?.clearValidators();
      this.pagoForm.get('claveReferencia')?.clearValidators();
      this.pagoForm.get('cadenaDependencia')?.clearValidators();
      this.pagoForm.get('banco')?.setValidators([Validators.required]);
      this.pagoForm.get('llavePago')?.setValidators([
        Validators.required,
        Validators.pattern(REGEX_LLAVE_DE_PAGO_DE_DERECHO),
        Validators.maxLength(30)
      ]);
      this.pagoForm.get('importePago')?.clearValidators();
      this.pagoForm.get('fechaPago')?.clearValidators();
    }
    Object.keys(this.pagoForm.controls).forEach(key => {
      this.pagoForm.get(key)?.updateValueAndValidity();
    });

    if (this.pagoForm.valid) {
      return true;
    }
    this.pagoForm.markAllAsTouched();
    return false;
  }
  /**
  * Limpia las suscripciones para evitar fugas de memoria al destruir el componente.
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

