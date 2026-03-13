import { Catalogo, formatearFechaYyyyMmDd, InputFecha, InputFechaComponent, REGEX_SOLO_DIGITOS, TituloComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent, ConsultaioQuery, REGEX_NUMEROS } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FECHA_DE_PAGO, PagoDerechosFormState } from '../../models/pago-de-derechos.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs';
import { CAMPO_OBLIGATORIO_DERECHOS } from '../../constants/datos-solicitud.enum';
import { CommonModule } from '@angular/common';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';

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
  ],
  templateUrl: './pago-de-derechos.component.html',
  styleUrl: './pago-de-derechos.component.scss',
})
export class PagoDeDerechosComponent implements OnInit, OnDestroy, OnChanges {
/**
   * Lista de bancos obtenida desde el servicio SAGAR.
   * Contiene la información necesaria para seleccionar o validar un banco.
   */
 public bancoDatossagar: Catalogo[] = [];

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
   * @property {EventEmitter<PagoDerechosFormState>} updatePagoDerechos
   * @description Output property that emits the updated state of the payment form whenever changes occur.
   * This allows the parent component to stay synchronized with the form's state.
   */

  @Output() public updatePagoDerechos: EventEmitter<PagoDerechosFormState> =
    new EventEmitter<PagoDerechosFormState>();

  /**
   * @property idProcedimiento
   * @description Identificador del procedimiento asociado a este componente.
   * @type {number}
   */
  @Input() idProcedimiento!: number;

  /**
   * Indica si el formulario se encuentra en modo solo lectura.
   * Cuando es verdadero, los campos del formulario no pueden ser editados.
   * @property {boolean} esFormularioSoloLectura
   * @default false
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * @property {Subject<void>} destroyNotifier$
   * Subject utilizado para gestionar las desuscripciones automáticas y evitar fugas de memoria.
   * Se completa manualmente cuando el componente se destruye.
   * @private
   */
  private destroyNotifier$ = new Subject<void>();

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
  bancoDatos!: Catalogo[];

  /**
   * @property campoObligatorio
   * @description Indica si ciertos campos del formulario son obligatorios según el procedimiento.
   * @type {boolean}
   * @default true
   */
  public campoObligatorio = false;

  /**
   * @property mostrarMensajeComaVisible
   * @description Controla la visibilidad del mensaje de advertencia sobre el uso de comas.
   * @type {boolean}
   * @default false
   */
  public mostrarMensajeComaVisible = false;

  /**
   * @constructor
   * Inicializa el formulario y las dependencias del componente.
   *
   * @param fb - FormBuilder para construir el formulario reactivo.
   * @param datosSolicitudService - Servicio para obtener catálogos desde el backend.
   * @param {ConsultaioQuery} consultaioQuery - Servicio para consultar el estado de la aplicación.
   */
  constructor(
    private fb: FormBuilder,
    private datosSolicitudService: DatosSolicitudService,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState: { readonly: boolean }) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }
  /**
   * @method ngOnChanges
   * @description Hook que se ejecuta cuando cambian las propiedades de entrada del componente.
   * Si cambia el valor de 'esFormularioSoloLectura' y el formulario ya está inicializado,
   * habilita o deshabilita el formulario según corresponda.
   *
   * @param {SimpleChanges} changes - Objeto que contiene los cambios de las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['esFormularioSoloLectura'] && this.pagoDerechosForm) {
      if (this.esFormularioSoloLectura) {
        this.pagoDerechosForm.disable();
      } else {
        this.pagoDerechosForm.enable();
      }
    }
  }
  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormaulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.crearFormaulario();
    if (this.esFormularioSoloLectura) {
      this.pagoDerechosForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.pagoDerechosForm.enable();
    }
  }

  /**
   * Crea el formulario reactivo `agregarDestinatarioFinal` utilizando `FormBuilder`.
   * Define los campos y sus validaciones.
   *
   */
  crearFormaulario(): void {
    this.pagoDerechosForm = this.fb.group({
      claveReferencia: [
        this.pagoDerechoFormState?.claveReferencia || '',
       [Validators.required, Validators.maxLength(50)]
      ],
      cadenaDependencia: [
        this.pagoDerechoFormState?.cadenaDependencia || '',
        [Validators.required, Validators.maxLength(50)]
      ],
      llavePago: [
        this.pagoDerechoFormState?.llavePago || '',
        [Validators.required, Validators.maxLength(30)]
      ],
      fechaPago: [
        this.pagoDerechoFormState?.fechaPago || '',
        Validators.required,
      ],
      importePago: [
        this.pagoDerechoFormState?.importePago || '',
        [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS), Validators.maxLength(16)]
      ],
      banco: [this.pagoDerechoFormState?.banco || '', Validators.required],
    });

    this.pagoDerechosForm.valueChanges
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((valores) => {
      this.updatePagoDerechos.emit(valores);
    });
  }
  /**
   * @method ngOnInit
   * @description Hook que se ejecuta al inicializar el componente.
   * Carga los datos iniciales desde el store, configura el formulario
   * con esos valores y suscribe a cambios para mantener el estado sincronizado.
   */
  ngOnInit(): void {
    this.crearFormaulario();
    this.cargarDatos();
    this.campoObligatorio = CAMPO_OBLIGATORIO_DERECHOS.includes(
      this.idProcedimiento
    );

    if (this.esFormularioSoloLectura) {
      this.pagoDerechosForm.disable();
    }
  }
  /**
   * @method cargarDatos
   * @description Obtiene la lista de estados desde el servicio `DatosSolicitudService`
   * y la asigna a la propiedad `estadosDatos`.
   */
  cargarDatos(): void {
    this.datosSolicitudService
      .obtenerBancos(this.idProcedimiento)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.bancoDatossagar = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion
        }));
      });
  }

  /**
   * @method onReset
   * @description Limpia todos los campos del formulario de pago de derechos.
   */
  onReset(): void {
    if (this.pagoDerechosForm.invalid) {
      this.pagoDerechosForm.markAllAsTouched();
    }
    this.pagoDerechosForm.reset();
    this.pagoDerechosForm.markAsPristine();
  }

  /**
   * @method onFechaCambiada
   * @description Actualiza la fecha de pago en el formulario.
   *
   * @param {string} fecha - Fecha seleccionada en el componente `InputFecha`.
   */
  onFechaCambiada(fecha: string): void {
    let formattedDate = formatearFechaYyyyMmDd(fecha);
    this.pagoDerechosForm.patchValue({ fechaPago: fecha });
    this.pagoDerechosForm.get('fechaPago')?.setValue(formattedDate);
    this.pagoDerechosForm.get('fechaPago')?.markAsTouched();
  }

  /**
   * @method markFechaPagoAsTouched
   * @description Marca el campo de fecha de pago como tocado cuando el usuario interactúa con el componente.
   */
  markFechaPagoAsTouched(): void {
    const FECHA_CONTROL = this.pagoDerechosForm.get('fechaPago');
    FECHA_CONTROL?.markAsTouched();
    this.pagoDerechosForm.updateValueAndValidity();
  }

  /**
   * Hook del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   *
   * @method ngOnDestroy
   * @returns {void}
   */

  /**
   * @method onImportePagoInput
   * @description
   * Maneja el evento de entrada del campo "importePago" para asegurar que solo se permitan caracteres numéricos
   * y que la longitud máxima sea de 22 dígitos. Si el usuario ingresa un carácter no numérico, este será eliminado.
   * Además, si la longitud supera los 22 caracteres, el valor se recorta automáticamente.
   * El valor limpio se actualiza en el control reactivo sin emitir un nuevo evento de cambio.
   *
   * @param {Event} event - El evento de entrada generado por el campo de texto.
   *
   * @returns {void} No retorna ningún valor.
   */
  onImportePagoInput(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    INPUT.value = INPUT.value.replace(REGEX_NUMEROS, '').slice(0, 22);
    this.pagoDerechosForm
      .get('importePago')
      ?.setValue(INPUT.value, { emitEvent: false });
  }
  /*
  * @method ngOnDestroy
  * @description Hook del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * @method mostrarMensajeComa
   * @description Muestra el mensaje de advertencia sobre el uso de comas y lo oculta después de 3 segundos.
   *
   * @returns {void}
   */
  mostrarMensajeComa(): void {
    this.mostrarMensajeComaVisible = true;
    setTimeout(() => {
      this.mostrarMensajeComaVisible = false;
    }, 3000);
  }

  /**
   * @method toUppercase
   * @description Convierte el valor de un control a mayúsculas si es necesario.
   *
   * @param {string} controlName - El nombre del control a modificar.
   *
   * @returns {void}
   */
  toUppercase(controlName: string): void {
  const CONTROL = this.pagoDerechosForm.get(controlName);
  if (CONTROL && CONTROL.value) {
    const UPPERCASED = CONTROL.value.toUpperCase();
    if (CONTROL.value !== UPPERCASED) {
      CONTROL.setValue(UPPERCASED, { emitEvent: false });
    }
  }
}

}
