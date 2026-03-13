import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Catalogo, CatalogoSelectComponent, InputFecha, InputFechaComponent, InputRadioComponent, REGEX_LLAVE_DE_PAGO_DE_DERECHO, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FECHA_DE_PAGO } from '../../constantes/pago-de-derechos.enum';
import { PagoDeDerecho } from '../../models/tercerosrelacionados.model';
import { PagoDeDerechos } from '../../../tramites/220201/models/220201/capturar-solicitud.model';
import { RadioOpcion } from '../../../tramites/220201/models/220201/certificado-zoosanitario.model';

import { Subject, takeUntil } from 'rxjs';

import { SharedFormService } from '../../../tramites/220201/services/220201/SharedForm.service';

import { CertificadoZoosanitarioServiceService } from '../../../tramites/220201/services/220201/certificado-zoosanitario.service';
import { ZoosanitarioStore } from '../../../tramites/220201/estados/220201/zoosanitario.store';

@Component({
  selector: 'app-pago-de-derecho',
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
export class PagoDeDerechoComponent implements OnDestroy, OnInit, AfterViewInit, OnChanges {
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
   * variable para identificar desde donde se actualiza el form
   * @private
   */
  private actualizandoDesdePadre = false;
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
    private sharedService: SharedFormService,
    private readonly certificadoZoosanitarioServices: CertificadoZoosanitarioServiceService,
    public fitosanitarioStore: ZoosanitarioStore,
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
      this.pagoForm.get('llavePago')?.enable();
      this.pagoForm.get('fechaPago')?.enable();
      this.fechaInicioInput.habilitado = true;
      this.pagoForm.get('fechaPago')?.setValidators([Validators.required]);
      this.pagoForm.get('llavePago')?.setValidators([Validators.required,
      Validators.pattern(REGEX_LLAVE_DE_PAGO_DE_DERECHO),
      Validators.maxLength(30)]);
    } else {
      this.pagoForm.get('llavePago')?.disable();
      this.pagoForm.get('fechaPago')?.disable();
      this.fechaInicioInput.habilitado = false;
      this.pagoForm.get('fechaPago')?.clearValidators();
      this.pagoForm.get('fechaPago')?.setValue('');
      this.pagoForm.get('fechaPago')?.updateValueAndValidity();
      this.pagoForm.get('fechaPago')?.markAsUntouched();
      this.pagoForm.get('fechaPago')?.markAsPristine();
      this.pagoForm.get('fechaPago')?.setErrors(null);
      this.pagoForm.get('llavePago')?.setValue('');
      this.pagoForm.get('llavePago')?.updateValueAndValidity();
      this.pagoForm.get('llavePago')?.markAsUntouched();
      this.pagoForm.get('llavePago')?.markAsPristine();
      this.pagoForm.get('llavePago')?.setErrors(null);
    }
    this.sharedService.dataPagoDerechos$.pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
      if (data) {
        this.pagoForm.patchValue({
          exentoPago: data.ide_motivo_exento_pago || 'no',
          justificacion: '',
          claveReferencia: data.cve_referencia_bancaria || '',
          cadenaDependencia: data.cadena_pago_dependencia || '',
          banco: data.cve_banco || '',
          llavePago: data.llave_pago || '',
          importePago: data.imp_pago || '',
          fechaPago: data.fec_pago || PagoDeDerechoComponent.formatDate()
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagoDeDerechos'] && changes['pagoDeDerechos'].currentValue) {
      this.actualizandoDesdePadre = true;
      this.pagoForm.patchValue({
        exentoPago: this.pagoDeDerechos.exentoPago || 'no',
        justificacion: this.pagoDeDerechos.justificacion || '',
        claveReferencia: this.pagoDeDerechos.claveReferencia || '',
        cadenaDependencia: this.pagoDeDerechos.cadenaDependencia || '',
        banco: this.pagoDeDerechos.banco || '',
        llavePago: this.pagoDeDerechos.llavePago || '',
        importePago: this.pagoDeDerechos.importePago || '',
        fechaPago: this.pagoDeDerechos.fechaPago || PagoDeDerechoComponent.formatDate()
      });
      this.radioChange();
      this.actualizandoDesdePadre = false;
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
    if (this.esFormularioSoloLectura) {
      return;
    }

    const EXENTO = this.pagoForm.value.exentoPago;
    const JUSTIFICACION = this.pagoForm.get('justificacion');
    const CLAVE_REFERENCIA = this.pagoForm.get('claveReferencia');
    const CADENA_DEPENDENCIA = this.pagoForm.get('cadenaDependencia');
    const BANCO = this.pagoForm.get('banco');
    const LLAVE_PAGO = this.pagoForm.get('llavePago');
    const IMPORTE_PAGO = this.pagoForm.get('importePago');
    const FECHA_PAGO = this.pagoForm.get('fechaPago');

    let TODOS = [];
    if (EXENTO === 'si') {
      TODOS = [CLAVE_REFERENCIA, CADENA_DEPENDENCIA, BANCO, LLAVE_PAGO, IMPORTE_PAGO, FECHA_PAGO];
    } else {
      TODOS = [JUSTIFICACION];
    }

    TODOS.forEach(control => {
      control?.clearValidators();
      control?.reset();
      control?.disable({ emitEvent: false });
    });

    if (EXENTO === 'si') {
      // solo justificacion
      JUSTIFICACION?.enable({ emitEvent: false });
      JUSTIFICACION?.setValidators([Validators.required]);
    }

    if (EXENTO === 'no') {
      BANCO?.enable({ emitEvent: false });
      BANCO?.setValidators([Validators.required]);
      LLAVE_PAGO?.enable({ emitEvent: false });
      LLAVE_PAGO?.setValidators([Validators.required, Validators.pattern(REGEX_LLAVE_DE_PAGO_DE_DERECHO), Validators.maxLength(30)]);
      FECHA_PAGO?.enable({ emitEvent: false });
      FECHA_PAGO?.setValidators([Validators.required]);
      CADENA_DEPENDENCIA?.enable({ emitEvent: false });
      CADENA_DEPENDENCIA?.setValidators([Validators.required]);
      CLAVE_REFERENCIA?.enable({ emitEvent: false });
      CLAVE_REFERENCIA?.setValidators([Validators.required]);
      IMPORTE_PAGO?.enable({ emitEvent: false });
      IMPORTE_PAGO?.setValidators([Validators.required]);
    }

    // recalcular todo
    TODOS.forEach(control => {
      control?.updateValueAndValidity({ emitEvent: false });
    });
    this.actualizarPago();
  }

  radioChangeOld(): void {
    if (!this.esFormularioSoloLectura && this.pagoForm.value.exentoPago === 'si') {
      this.pagoForm.get('justificacion')?.enable();
      this.pagoForm.get('claveReferencia')?.disable();
      this.pagoForm.get('cadenaDependencia')?.disable();
      this.pagoForm.get('banco')?.disable();
      this.pagoForm.get('llavePago')?.disable();
      this.pagoForm.get('importePago')?.disable();
      this.pagoForm.get('fechaPago')?.enable();
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
      BANCO_CONTROL?.enable();
      this.pagoForm.get('llavePago')?.enable();
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
        CONTROL.markAsTouched();
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
    if (this.actualizandoDesdePadre) {
      return;
    }
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
    this.pagoChanged.emit(DATOS_PAGOS);

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
   * Verifies if the payment form (`pagoForm`) is valid. If the form is valid, returns `true`.
   * If the form is invalid, marks all form controls as touched to trigger validation messages and returns `false`.
   *
   * @returns {boolean} `true` if the form is valid, otherwise `false`.
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
      this.fitosanitarioStore.actualizarPagoDeDerechos(this.pagoForm.value as PagoDeDerechos);
      return true;
    }
    this.pagoForm.markAllAsTouched();
    return false;
  }

  /**
   * Guarda los datos de pago de derechos si el formulario es válido.
   * Valida el formulario y actualiza el store con los valores del formulario.
   *
   * @returns No retorna valor.
   */
  guardarDatosPagoDeDerechos(): void {
    if (this.validarFormulario()) {
      this.fitosanitarioStore.actualizarPagoDeDerechos(this.pagoForm.value as PagoDeDerechos);
    }
  }
  /**
  * Limpia las suscripciones para evitar fugas de memoria al destruir el componente.
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
