import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {
  AlertComponent,
  Catalogo,
  ConsultaioQuery,
  InputFecha,
  InputFechaComponent,
  REGEX_LLAVE_DE_PAGO_DE_DERECHO,
  TituloComponent,
} from '@ng-mf/data-access-user';
import {CatalogoSelectComponent, CatalogoServices} from '@libs/shared/data-access-user/src';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  FECHA_DE_IMPORTACION_PAGO,
  FECHA_DE_PAGO,
  PagoDerechosFormState
} from '../../../models/terceros-relacionados.model';
import {
  PagoDerechosState,
  PagoDerechosStore
} from '../../../estados/stores/pago-de-derechos.store';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { BANCO } from '../../../constantes/datos-solicitud.enum';
import { CommonModule } from '@angular/common';
import { DatosSolicitudService } from '../../../services/datos-solicitud.service';
import { PagoDerechosQuery } from '../../../estados/queries/pago-derechos.query';

export function importePagoValidator(control: AbstractControl): ValidationErrors | null {
  const VALUE = control.value;

  // Allow empty — required validator will handle emptiness
  if (VALUE === null || VALUE === '') {
    return null;
  }

  // ✅ 1. Check if value is numeric
  const NUMERIC_REGEX = /^[0-9.]+$/;
  if (!NUMERIC_REGEX.test(VALUE)) {
    return { nonNumeric: true };
  }

  // ✅ 2. Check for valid format (max 15 digits and up to 2 decimals)
  const DECIMAL_REGEX = /^\d{1,15}(\.\d{1,2})?$/;
  if (!DECIMAL_REGEX.test(VALUE)) {
    return { invalidDecimal: true };
  }

  // ✅ All good
  return null;
}



/**
 * @component PagoDeDerechosComponent
 * @description Componente responsable de capturar y gestionar la información relacionada
 * con el pago de derechos. Utiliza formularios reactivos para validar los datos y
 * actualiza el estado del trámite automáticamente al detectar cambios.
 */
@Component({
  selector: 'app-pago-de-derechos',
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    InputFechaComponent,
    TituloComponent,
    AlertComponent
  ],
  templateUrl: './pago-de-derechos.component.html',
  styleUrl: './pago-de-derechos.component.css',
})
export class PagoDeDerechosComponent implements OnInit, OnDestroy, OnChanges {
  messageAlert: string = `
  <div style="text-align: center;">
    <strong>¡Precaución!</strong>
    <span class="fw-normal">
      Debes capturar todos los campos de pago de derechos.
    </span>
  </div>
`;
verificarAlerta:number[]=[];

  /**
   * @method eliminarMercancia
   * @description Emits an event to delete one or more merchandise items.
   * This method is used to notify the parent component about the deletion of selected merchandise items.
   *
   * @param {DetalleMercancia[]} datos - An array of merchandise details to be deleted.
   * @returns {void} This method does not return any value.
   */
  @Input() public pagoDerechoFormState!: PagoDerechosFormState;

  /**
   * Identificador del procedimiento recibido como entrada desde un componente padre.
   * @type {number}
   */
  @Input() public idProcedimiento!: number;

  /**
   * Indica si sólo se requiere el campo "colón".
   *
   * @type {boolean}
   * @default false
   */
  @Input() soloDosPuntosRequeridos: boolean = false;

  /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.
   */
  @Input() public formularioDeshabilitado: boolean = false;
  
  /**
   * @property {boolean} campoRequerido - Indica si el campo es obligatorio.
   */
  @Input() public campoRequerido: boolean = false;

       /**
         * @property {Subscription} subscription
         * @private
         * @description
         * Contenedor principal para gestionar suscripciones a observables que requieren
         * limpieza manual. Se utiliza como alternativa al patrón destroyNotifier$
         * para casos específicos que necesitan control granular de suscripciones.
         * 
         * @pattern Subscription Management
         * @purpose Agrupa múltiples suscripciones para limpieza eficiente
         * @cleanup Se desuscribe manualmente en ngOnDestroy()
         * @use_case Suscripciones que requieren lógica de limpieza personalizada
         * 
         * @example
         * ```typescript
         * this.subscription.add(
         *   this.service.getData().subscribe(data => { ... })
         * );
         * ```
         */
        private subscription: Subscription = new Subscription();
  
  
  /**
   * @property {EventEmitter<PagoDerechosFormState>} updatePagoDerechos
   * @description Output property that emits the updated state of the payment form whenever changes occur.
   * This allows the parent component to stay synchronized with the form's state.
   */

  @Output() public updatePagoDerechos: EventEmitter<PagoDerechosFormState> =
    new EventEmitter<PagoDerechosFormState>();

  /**
   * @property {Subject<void>} unsubscribe$
   * Subject utilizado para gestionar las desuscripciones automáticas y evitar fugas de memoria.
   * Se completa manualmente cuando el componente se destruye.
   * @private
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Indica si se debe mostrar la sección de información bancaria en la interfaz.
   * @type {boolean}
   */
  public mostrarBanco = true;

  /**
   * @property {InputFecha} fechaInicioInput
   * Objeto con la configuración de la fecha inicial del componente.
   */
  fechaInicioInput: InputFecha = FECHA_DE_PAGO;

  /**
   * @property {FormGroup} pagoDerechosForm
   * Formulario reactivo que captura los datos del pago de derechos.
   */
  pagoDerechosForm!: FormGroup;

  /**
   * @property {Catalogo[]} estadosDatos
   * Lista de estados obtenida desde el servicio de catálogos.
   */
  public estadosDatos: Catalogo[] = [];

  /**
   * Arreglo que contiene los datos del catálogo.
   * @type {Catalogo[]}
   */
  public bancoDatos: Catalogo[] = [];
  /**
   * Indica si el campo "banco" es obligatorio.
   * @type {boolean}
   */
  public bancoRequerido = true;

  /**
   * Indica si la fecha ingresada es válida (no es futura).
   * @type {boolean}
   */
  public esFechaValida: boolean = true;

  public isContinuarButtonClicked: boolean = false; 

  /**
   * Estado actual de la solicitud, obtenido del store.
   * @type {PagoDerechosState}
   */
  public solicitudState!: PagoDerechosState;

  /**
   * @constructor
   * Inicializa el formulario y las dependencias del componente.
   *
   * @param fb - FormBuilder para construir el formulario reactivo.
   * @param datosSolicitudService - Servicio para obtener catálogos desde el backend.
   * @param tramiteStore - Store que administra el estado del trámite actual.
   */
  constructor(
    private fb: FormBuilder,
    private datosSolicitudService: DatosSolicitudService,
    private pagoDerechosStore: PagoDerechosStore,
    private pagoDerechosQuery: PagoDerechosQuery,
    private consultaioQuery: ConsultaioQuery,
    private catalogoService: CatalogoServices
    
  ) {
    this.verificarAlerta=FECHA_DE_IMPORTACION_PAGO;

    // Inicializa el formulario.
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((seccionState) => { 
          this.formularioDeshabilitado = seccionState.readonly;
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * @method ngOnInit
   * @description Hook que se ejecuta al inicializar el componente.
   * Carga los datos iniciales desde el store, configura el formulario
   * con esos valores y suscribe a cambios para mantener el estado sincronizado.
   */
  ngOnInit(): void {
    if(this.idProcedimiento === 260513){
      this.fechaInicioInput.labelNombre='Fecha de pago'
      this.fechaInicioInput.required = true;
    }
    this.getBancoDatos();
    this.pagoDerechosQuery.selectSolicitud$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.mostrarBanco = BANCO.includes(this.idProcedimiento) ? true : false;
    const NOMULTISPACE = /^(?!.* {2,}).*$/;

    this.pagoDerechosForm = this.fb.group({
      claveReferencia: [
      this.pagoDerechoFormState?.claveReferencia || '',
      [
        Validators.maxLength(9),
        Validators.required,
        Validators.pattern(NOMULTISPACE),
      ],
      ],
      cadenaDependencia: [
      this.pagoDerechoFormState?.cadenaDependencia || '',
      [
        Validators.maxLength(14),
        Validators.required,
      ],
      ],
      estado: [this.pagoDerechoFormState?.estado || '', Validators.required],
      banco: [this.pagoDerechoFormState?.banco || '', Validators.required],
      llavePago: [
      this.pagoDerechoFormState?.llavePago || '',
      [
        Validators.pattern(REGEX_LLAVE_DE_PAGO_DE_DERECHO),
        Validators.maxLength(30),
        Validators.required,
      ],
      ],
      fechaPago: [this.pagoDerechoFormState?.fechaPago || '', Validators.required],
      importePago: [
      this.pagoDerechoFormState?.importePago || '',
      [
        importePagoValidator,
        Validators.maxLength(16),
        Validators.required,
      ],
      ],
      bancoObject: [this.pagoDerechoFormState?.bancoObject || ''],
    });
    this.pagoDerechosForm.valueChanges.subscribe((valores) => {
      this.updatePagoDerechos.emit(valores);
    });
    if (this.formularioDeshabilitado) {
      this.pagoDerechosForm.disable();
    }

    setTimeout(() => {

      this.pagoDerechosForm.patchValue(this.pagoDerechoFormState);
    }, 0);
  }

  /**
   * Hook que se ejecuta cuando cambian las propiedades de entrada del componente.
   * Permite habilitar o deshabilitar los formularios según el modo de solo lectura.
   * @param {SimpleChanges} changes - Cambios detectados en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagoDerechoFormState'] &&
      changes['pagoDerechoFormState'].currentValue &&
      this.pagoDerechosForm
    ) {
      this.pagoDerechosForm.patchValue(
        changes['pagoDerechoFormState'].currentValue
      );
    }
    if (changes['formularioDeshabilitado'] && this.pagoDerechosForm) {
      if (this.formularioDeshabilitado) {
        this.pagoDerechosForm.disable();
      } else {
        this.pagoDerechosForm.enable();
      }
    }
  }

  /**
   * @method cargarDatos
   * @description Obtiene la lista de estados desde el servicio `DatosSolicitudService`
   * y la asigna a la propiedad `estadosDatos`.
   */
  cargarDatos(): void {
    this.datosSolicitudService
      .obtenerListaEstados()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.estadosDatos = data;
        this.pagoDerechosForm.patchValue({
          estado: this.pagoDerechoFormState?.estado || '',
        });
      });
  }

  /**
   * @method getBancoDatos
   * Recupera los datos del banco desde el servicio `datosSolicitudService`
   * y los asigna a la propiedad `bancoDatos`.
   */
  getBancoDatos(): void {
    this.subscription.add(
            this.catalogoService
            .bancosCatalogo(String(this.idProcedimiento))
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((response) => {
              const DATOS = response.datos as Catalogo[];
              
              if (response) {
                this.bancoDatos = DATOS;
              }
            })
          );
  }

  /**
   * @method onReset
   * @description Limpia todos los campos del formulario de pago de derechos.
   */
  alReiniciar(): void {
    this.pagoDerechosForm.reset();
  }

  actualizarStore(): void {
    const VALORES_COMPLETOS = this.pagoDerechosForm.getRawValue();
    this.updatePagoDerechos.emit(VALORES_COMPLETOS);
  }

  
  /**
   * @method onFechaCambiada
   * @description Actualiza la fecha de pago en el formulario.
   *
   * @param {string} fecha - Fecha seleccionada en el componente `InputFecha`.
   */
  onFechaCambiada(fecha: string): void {
    this.pagoDerechosForm.patchValue({ fechaPago: fecha });
    this.pagoDerechosForm.get('fechaPago')?.markAsTouched();
    this.pagoDerechosForm.get('fechaPago')?.markAsDirty();
    this.setValoresStore(this.pagoDerechosForm, 'fechaPago', 'setFechaPago');
  }

  /**
   * @description Verifica si un control del formulario es inválido.
   * @param nombreControl El nombre del control a verificar.
   * @returns Verdadero si el control es inválido y está tocado o modificado, de lo contrario, falso.
   */
  esInvalido(nombreControl: string): boolean {
    if (
      nombreControl === 'fechaPago' &&
      this.pagoDerechosForm.get('fechaPago')?.value !== '' &&
      this.pagoDerechosForm.get('fechaPago')?.value !== null
    ) {
      this.esFechaPasada(this.pagoDerechosForm.get('fechaPago')?.value);
      if (!this.esFechaValida) {
        this.pagoDerechosForm
          .get('fechaPago')
          ?.setErrors({ esFechaPasada: true });
        return true;
      }

      this.pagoDerechosForm
        .get('fechaPago')
        ?.setErrors({ esFechaPasada: false });
      return false;
    }
    const CONTROL = this.pagoDerechosForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * @method esFechaPasada
   * @description Verifica si una fecha proporcionada es anterior a la fecha actual.
   *
   * @param {string} fechaStr - La fecha en formato de cadena que se desea evaluar.
   *
   * @returns {void} No retorna ningún valor, pero actualiza la propiedad `esFechaValida`
   * indicando si la fecha proporcionada es una fecha pasada.
   *
   * @example
   * // Supongamos que la fecha actual es 2023-03-15
   * this.esFechaPasada('2023-03-14'); // esFechaValida será true
   * this.esFechaPasada('2023-03-16'); // esFechaValida será false
   */
  esFechaPasada(fechaStr: string): void {
    if (!fechaStr) {
      this.esFechaValida = false;
      return;
    }

    const [DAY, MONTH, YEAR] = fechaStr.split('/').map(Number);

    const FECHA_ENTRADA = new Date(YEAR, MONTH - 1, DAY);
    const HOY = new Date();
    if (isNaN(FECHA_ENTRADA.getTime())) {
      this.esFechaValida = false;
      return;
    }
    HOY.setHours(0, 0, 0, 0);
    FECHA_ENTRADA.setHours(0, 0, 0, 0);
    this.esFechaValida = FECHA_ENTRADA <= HOY;
  }

  /**
   * Método para actualizar el banco seleccionado.
   * @param e {Catalogo} Banco seleccionado.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof PagoDerechosStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (
      this.pagoDerechosStore[metodoNombre] as (
        value: string | number | null
      ) => void
    )(VALOR);
  }

/**
 * Método para manejar la selección de banco.
 * @param event {any} Evento del select.
 */
onBancoSeleccionado(event: any): any {
  const SELECTEDVALUE = event.targety ? event.target.value : event;
  const BANCO = this.bancoDatos.find(b => b.clave === SELECTEDVALUE);
  const BANCOID = this.pagoDerechosForm.get('banco')?.value;
  const BANCO_OBJ = PagoDeDerechosComponent.generarCatalogoObjeto(this.bancoDatos, BANCOID);
  this.pagoDerechosForm.patchValue({ bancoObject: BANCO_OBJ ? BANCO_OBJ[0] : undefined });

  if (BANCO) {
    this.pagoDerechosForm.patchValue({ banco: BANCO.clave });
    this.pagoDerechosForm.get('banco')?.markAsTouched();
    this.pagoDerechosForm.get('banco')?.markAsDirty();
    this.setValoresStoreObject(BANCO, 'banco', 'setBancoObject');
  }
  return BANCO_OBJ ? BANCO_OBJ[0] : undefined;
}


/**
 * Método para actualizar el store con objeto completo.
 * @param catalogo {Catalogo} Objeto catalogo seleccionado.
 * @param campo {string} Nombre del campo del formulario.
 * @param metodoNombre {string} Nombre del método del store.
 */
setValoresStoreObject(
  catalogo: Catalogo,
  campo: string,
  metodoNombre: keyof PagoDerechosStore
): void {
  // Almacenar el objeto completo en el store
  (
    this.pagoDerechosStore[metodoNombre] as (
      value: Catalogo
    ) => void
  )(catalogo);
}

  /**
   * Genera un arreglo de objetos de catálogo que coinciden con el identificador proporcionado.
   *
   * @param {Catalogo[]} catalogo - Arreglo de objetos de catálogo.
   * @param {string} id - Identificador para filtrar los objetos del catálogo.
   * @returns {Catalogo[] | undefined} - Arreglo de objetos de catálogo que coinciden con el identificador, o undefined si no hay coincidencias.
   */
  static generarCatalogoObjeto(catalogo: Catalogo[], id: string): Catalogo[] | undefined {
    return catalogo.filter(item => item.clave === id);
  }
 
  formularioSolicitudValidacion(): boolean {
    this.isContinuarButtonClicked = false;
    
    const CLAVE_REFERENCIA_VALUE = this.pagoDerechosForm.get('claveReferencia')?.value;
    const CADENA_DEPENDENCIA_VALUE = this.pagoDerechosForm.get('cadenaDependencia')?.value;
    const LLAVE_PAGO_VALUE = this.pagoDerechosForm.get('llavePago')?.value;
    const IMPORTE_PAGO_VALUE = this.pagoDerechosForm.get('importePago')?.value;
    const FECHA_PAGO_VALUE = this.pagoDerechosForm.get('fechaPago')?.value;
    const BANCO_PAGO_VALUE = this.pagoDerechosForm.get('banco')?.value;
    
    const ANY_FIELDS_HAVE_VALUE= (CLAVE_REFERENCIA_VALUE !== '' && CLAVE_REFERENCIA_VALUE !== null) ||
    (CADENA_DEPENDENCIA_VALUE !== '' && CADENA_DEPENDENCIA_VALUE !== null) ||
    (LLAVE_PAGO_VALUE !== '' && LLAVE_PAGO_VALUE !== null) ||
    (IMPORTE_PAGO_VALUE !== '' && IMPORTE_PAGO_VALUE !== null ) ||
    (FECHA_PAGO_VALUE !== '' && FECHA_PAGO_VALUE !== null ) ||
    (BANCO_PAGO_VALUE !== '' && BANCO_PAGO_VALUE !== null &&BANCO_PAGO_VALUE !== '-1');
    
    if (ANY_FIELDS_HAVE_VALUE) {
      this.pagoDerechosForm.markAllAsTouched();
      this.isContinuarButtonClicked = true;
    }
  
    
    
    
    return this.isAllFieldHaveValue();
  }

  isAllFieldHaveValue(): boolean {
    const CLAVE_REFERENCIA_VALUE = this.pagoDerechosForm.get('claveReferencia')?.value;
    const CADENA_DEPENDENCIA_VALUE = this.pagoDerechosForm.get('cadenaDependencia')?.value;
    const LLAVE_PAGO_VALUE = this.pagoDerechosForm.get('llavePago')?.value;
    const IMPORTE_PAGO_VALUE = this.pagoDerechosForm.get('importePago')?.value;
    const FECHA_PAGO_VALUE = this.pagoDerechosForm.get('fechaPago')?.value;
    const BANCO_PAGO_VALUE = this.pagoDerechosForm.get('banco')?.value;
    
    const ALL_FIELDS_VALID = (CLAVE_REFERENCIA_VALUE !== '' && CLAVE_REFERENCIA_VALUE !== null) && 
                            (CADENA_DEPENDENCIA_VALUE !== '' && CADENA_DEPENDENCIA_VALUE !== null) && 
                            (LLAVE_PAGO_VALUE !== '' && LLAVE_PAGO_VALUE !== null) && 
                            (IMPORTE_PAGO_VALUE !== '' && IMPORTE_PAGO_VALUE !== null ) && 
                            (FECHA_PAGO_VALUE !== '' && FECHA_PAGO_VALUE !== null )&&
                            (BANCO_PAGO_VALUE !== '' && BANCO_PAGO_VALUE !== null && BANCO_PAGO_VALUE !== '-1');
    return ALL_FIELDS_VALID;
  }

  llavePagoCase(): void {
    const LLAVEPAGOCONTROL = this.pagoDerechosForm.get('llavePago');
    if (LLAVEPAGOCONTROL && LLAVEPAGOCONTROL.value) {
      const LLAVE_PAGO = LLAVEPAGOCONTROL.value.toUpperCase();
      LLAVEPAGOCONTROL.setValue(LLAVE_PAGO);
      this.setValoresStore(this.pagoDerechosForm, 'llavePago', 'setllavePago');
    }
  }

  public isAnyFieldFilledButNotAll(): boolean {
  const ANYFILLED = this.formularioSolicitudValidacion(); 
  const ALLFILLED = this.isAllFieldHaveValue();
  return ANYFILLED && !ALLFILLED;
  }

  public get continuarButtonClicked(): boolean {
    return this.isContinuarButtonClicked;
  }


  /**
   * Método que se ejecuta al destruir el componente.
   * Se encarga de liberar las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }
}

export function decimalValidator(maxDecimals: number = 2) {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    if (!control.value) {
      return null;
    }
    
    const VALOR = control.value.toString();
    
    if (isNaN(parseFloat(VALOR))) {
      return { invalidNumber: true };
    }
    
    const DECIMALPARTS = VALOR.split('.');
    if (DECIMALPARTS.length > 1 && DECIMALPARTS[1].length > maxDecimals) {
      return { tooManyDecimals: { max: maxDecimals, actual: DECIMALPARTS[1].length } };
    }
    
    return null;
  };
  
}
