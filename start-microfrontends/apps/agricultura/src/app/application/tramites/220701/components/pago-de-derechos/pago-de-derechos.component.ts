/**
 * @component
 * @name PagoDeDerechosComponent
 * @description
 * Componente para la gestión del pago de derechos en el trámite 220701.
 * Permite capturar, validar y almacenar la información relacionada con el pago de derechos en trámites de importación de acuicultura.
 * Incluye lógica para la gestión de catálogos, validaciones, estado de la sección y comunicación con el store y servicios.
 * Utiliza formularios reactivos y consume múltiples servicios para obtener catálogos y datos relacionados.
 * Implementa la lógica de inicialización, carga de catálogos, manejo de estado y sincronización con el store de Akita.
 * 
 * @example
 * <pago-de-derechos [esFormularioSoloLectura]="true"></pago-de-derechos>
 */
import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Subject, delay, map, takeUntil, tap } from 'rxjs';

import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  ConsultaioQuery,
  InputFecha,
  InputFechaComponent,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
  TituloComponent,
} from '@libs/shared/data-access-user/src';

import { ConsultaioState } from '@ng-mf/data-access-user';

import { InputRadioComponent } from '@libs/shared/data-access-user/src';

import {
  EXPEDICION_FACTURA_FECHA,
  TIPO_RADIO,
} from '../../constantes/inspeccion-fisica-zoosanitario.enums';

import {
  PagoDeDerechos,
  PagoDeDerechosRevision,
} from '../../modelos/acuicola.model';
import { OpcionDeRadio } from '../../modelos/importacion-de-acuicultura.module';
import { PagosDeDerechosFormInt } from '../../modelos/datos-de-interfaz.model';

import { AcuicolaService } from '../../servicios/acuicola.service';

import { TramiteStore } from '../../estados/tramite220701.store';
import { TramiteStoreQuery } from '../../estados/tramite220701.query';

import * as moment from 'moment';
/**
 * @component
 * @name PagoDeDerechosComponent
 * @description
 * Componente para la gestión del pago de derechos en el trámite 220701.
 * Permite capturar, validar y almacenar la información relacionada con el pago de derechos en trámites de importación de acuicultura.
 * Incluye lógica para la gestión de catálogos, validaciones, estado de la sección y comunicación con el store y servicios.
 * Utiliza formularios reactivos y consume múltiples servicios para obtener catálogos y datos relacionados.
 * Implementa la lógica de inicialización, carga de catálogos, manejo de estado y sincronización con el store de Akita.
 * 
 * @example
 * <pago-de-derechos [esFormularioSoloLectura]="true"></pago-de-derechos>
 */
@Component({
  selector: 'pago-de-derechos',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
    ReactiveFormsModule,
    InputRadioComponent,
  ],
  templateUrl: './pago-de-derechos.component.html',
  styleUrl: './pago-de-derechos.component.scss',
})

/**
 * @class PagoDeDerechosComponent
 * @implements {OnInit, OnDestroy, OnChanges}
 * @description Componente para la gestión del pago de derechos.
 * Maneja el formulario de pagos y su estado, así como la interacción con catálogos y servicios relacionados.
 */
export class PagoDeDerechosComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * @property {FormGroup} pagosDeDerechosForm
   * @description Formulario reactivo para el pago de derechos.
   */
  pagosDeDerechosForm!: FormGroup;

  /**
   * @property {PagosDeDerechosFormInt} pagosDeDerechosState
   * @description Estado del formulario de pago de derechos.
   */
  pagosDeDerechosState!: PagosDeDerechosFormInt;

   /**
   * Configuración para el input de fecha de salida.
   * Proporciona un valor inicial para el campo de fecha.
   * @type {InputFecha}
   */
  fechaFinalInput: InputFecha = EXPEDICION_FACTURA_FECHA;

  /**
   * @property {CatalogosSelect} banco
   * @description Información del banco seleccionado en el formulario.
   */
  banco!: CatalogosSelect;

  /**
   * @property {CatalogosSelect} bancoRevision
   * @description Información del banco seleccionado en el formulario de revisión.
   */
  bancoRevision!: CatalogosSelect;

  /**
   * @property {OpcionDeRadio[]} exentoPagoRadio
   * @description Opciones de radio para la exención de pago.
   */
  exentoPagoRadio: OpcionDeRadio[] = TIPO_RADIO;

  /**
   * @property {OpcionDeRadio[]} exentoPagoRevisionRadio
   * @description Opciones de radio para la exención de pago en revisión.
   */
  exentoPagoRevisionRadio: OpcionDeRadio[] = TIPO_RADIO;

  /**
   * @property {string} fechaPagoDate
   * @description Fecha seleccionada para el pago.
   * @default ''
   */
  fechaPagoDate: string = '';

  /**
   * @property {string} exentoPagoValor
   * @description Valor seleccionado para la exención de pago.
   * @default 'Si'
   */
  exentoPagoValor: string = 'Si';

  /**
   * @property {string} exentoPagoRevisionValor
   * @description Valor seleccionado para la exención de pago en revisión.
   * @default 'Si'
   */
  exentoPagoRevisionValor: string = 'Si';

  /**
   * @property {Catalogo[]} justificacionCatalogo
   * @description Catálogo de justificaciones para la exención de pago.
   */
  justificacionCatalogo: Catalogo[] = [];

  /**
   * @property {InputFecha} fechaInicioInput
   * @description Configuración de la fecha de inicio para la expedición de la factura.
   */
  fechaInicioInput: InputFecha = EXPEDICION_FACTURA_FECHA;

  /**
   * @property {boolean} esFormularioSoloLectura
   * @description Indica si el formulario debe mostrarse solo en modo de lectura.
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * @property {ConsultaioState} consultaState
   * @description Estado actual de la consulta gestionado por el store ConsultaioQuery.
   */
  @Input() consultaState?: ConsultaioState;

  /**
   * @property {string} setFecha
   * @description Propiedad opcional para almacenar la fecha seleccionada o calculada en el componente.
   */
  @Input() setFecha: string = '';

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para manejar la desuscripción de observables y evitar fugas de memoria.
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * @property {SeccionLibState} seccion
   * @description Estado actual de la sección en la tienda de Akita.
   */
  private seccion!: SeccionLibState;

  /**
   * @constructor
   * @param {FormBuilder} fb Servicio para la creación de formularios reactivos.
   * @param {AcuicolaService} acuicolaService Servicio para manejar datos relacionados con acuicultura.
   * @param {TramiteStoreQuery} tramiteStoreQuery Consulta de estado de la tienda Akita para trámites.
   * @param {TramiteStore} tramiteStore Tienda Akita para manejar el estado del trámite.
   * @param {SeccionLibQuery} seccionQuery Consulta de estado de la tienda Akita para secciones.
   * @param {SeccionLibStore} seccionStore Tienda Akita para manejar el estado de la sección.
   * @param {ConsultaioQuery} consultaioQuery Consulta Akita para manejar y actualizar el estado de una sección.
   * @param {ChangeDetectorRef} cdr Servicio para controlar la detección de cambios.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly acuicolaService: AcuicolaService,
    private tramiteStoreQuery: TramiteStoreQuery,
    private tramiteStore: TramiteStore,
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    private consultaioQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.cdr.detectChanges();
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * @getter isBorrarButtonDisabled
   * @description Determina si el botón "Borrar datos del pago" debe estar deshabilitado.
   * @returns {boolean} True si está en modo consulta (solo lectura), false en caso contrario.
   */
  get isBorrarButtonDisabled(): boolean {
    return this.consultaState?.readonly ?? this.esFormularioSoloLectura;
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.pagosDeDerechosForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.pagosDeDerechosForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario reactivo con los campos requeridos.
   * Configura validaciones y deshabilita ciertos campos según sea necesario.
   *
   * @method inicializarFormulario
   * @returns {void}
   */
  inicializarFormulario(): void {
    this.tramiteStoreQuery.selectSolicitudTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.pagosDeDerechosState = seccionState.PagosDeDerechosState;
        })
      )
      .subscribe();

    // Establecer exentoPagoValor a 'Si' si no está ya establecido desde el estado
    if (!this.pagosDeDerechosState?.exentoPago) {
      this.exentoPagoValor = 'Si';
    } else {
      this.exentoPagoValor = this.pagosDeDerechosState.exentoPago;
    }

    // Establecer exentoPagoRevisionValor a 'Si' si no está ya establecido desde el estado
    if (!this.pagosDeDerechosState?.exentoPagoRevision) {
      this.exentoPagoRevisionValor = 'Si';
    } else {
      this.exentoPagoRevisionValor = this.pagosDeDerechosState.exentoPagoRevision;
    }

    this.pagosDeDerechosForm = this.fb.group({
      justificacion: [
        {value: '', disabled: true},
        Validators.required,
      ],
      claveDeReferencia: [
        {value: this.pagosDeDerechosState?.claveDeReferencia || '', disabled: true},
        Validators.required,
      ],
      cadenaDependencia: [
        {value: this.pagosDeDerechosState?.cadenaDependencia || '', disabled: true},
        Validators.required,
      ],
      banco: [
        {value: this.pagosDeDerechosState?.banco || '', disabled: true}, 
        Validators.required
      ],
      exentoPago: [
        {value: this.pagosDeDerechosState?.exentoPago || 'Si', disabled: true},
        Validators.required,
      ],
      llaveDePago: [
        {value: this.pagosDeDerechosState?.llaveDePago || '', disabled: true},
        Validators.required,
      ],
      fechaInicio: [
        {value: this.pagosDeDerechosState?.fechaInicio || '', disabled: true},
        Validators.required,
      ],
      importeDePago: [
        {value: this.pagosDeDerechosState?.importeDePago || '', disabled: true},
        Validators.required,
      ],
      claveDeReferenciaRevision: [
        {value: this.pagosDeDerechosState?.claveDeReferenciaRevision || '', disabled: true},
        Validators.required,
      ],
      cadenaDependenciaRevision: [
        {value: '', disabled: true},
        Validators.required,
      ],
      justificacionRevision: [
        {value: '', disabled: true},
        Validators.required,
      ],
      bancoRevision: [
        {value: this.pagosDeDerechosState?.bancoRevision || '', disabled: true},
        Validators.required,
      ],
      llaveDePagoRevision: [
        {value: this.pagosDeDerechosState?.llaveDePagoRevision || '', disabled: true},
        Validators.required,
      ],
      fechaInicioRevision: [
        {value: this.pagosDeDerechosState?.fechaInicioRevision || '', disabled: true},
        Validators.required,
      ],
      importeDePagoRevision: [
        {value: this.pagosDeDerechosState?.importeDePagoRevision || '', disabled: true},
        Validators.required,
      ],
      exentoPagoRevision: [
        {value: this.pagosDeDerechosState?.exentoPagoRevision || 'Si', disabled: true},
        Validators.required,
      ],
    });
  }

  /**
   * @method ngOnInit
   * @description Inicializa el componente, suscribe a cambios en el estado del trámite y carga los datos necesarios.
   */
  ngOnInit(): void {
    /**
     * Suscripción a los cambios en el estado del trámite para obtener los datos de pago de derechos.
     */
    this.tramiteStoreQuery.selectSolicitudTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.pagosDeDerechosState = seccionState.PagosDeDerechosState;
        })
      )
      .subscribe();

    this.obtenerListaJustificacion();
    this.getBancoDatos();
    this.pagoDeCargarDatos();
    this.pagoDerechosRevision();
    this.inicializarEstadoFormulario();

    /**
     * Suscripción a los cambios en el estado del trámite para actualizar el formulario de pagos de derechos.
     */
    this.tramiteStoreQuery.selectSolicitudTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map(
          (seccionState: { PagosDeDerechosState: PagosDeDerechosFormInt }) => {
            if (seccionState) {
              this.pagosDeDerechosState = seccionState.PagosDeDerechosState;
              const PATCH_DATA = { ...this.pagosDeDerechosState };
              // Asegurar que exentoPago permanezca 'Si' y deshabilitado
              if (PATCH_DATA.exentoPago !== 'Si') {
                PATCH_DATA.exentoPago = 'Si';
                this.exentoPagoValor = 'Si';
              }
              // Asegurar que exentoPagoRevision permanezca 'Si' y deshabilitado
              if (PATCH_DATA.exentoPagoRevision !== 'Si') {
                PATCH_DATA.exentoPagoRevision = 'Si';
                this.exentoPagoRevisionValor = 'Si';
              }
              this.pagosDeDerechosForm.patchValue(PATCH_DATA);
              // Volver a deshabilitar todos los controles especificados después del parcheo
              this.pagosDeDerechosForm.get('justificacion')?.disable();
              this.pagosDeDerechosForm.get('claveDeReferencia')?.disable();
              this.pagosDeDerechosForm.get('cadenaDependencia')?.disable();
              this.pagosDeDerechosForm.get('banco')?.disable();
              this.pagosDeDerechosForm.get('exentoPago')?.disable();
              this.pagosDeDerechosForm.get('llaveDePago')?.disable();
              this.pagosDeDerechosForm.get('fechaInicio')?.disable();
              this.pagosDeDerechosForm.get('importeDePago')?.disable();
              this.pagosDeDerechosForm.get('claveDeReferenciaRevision')?.disable();
              this.pagosDeDerechosForm.get('cadenaDependenciaRevision')?.disable();
              this.pagosDeDerechosForm.get('justificacionRevision')?.disable();
              this.pagosDeDerechosForm.get('bancoRevision')?.disable();
              this.pagosDeDerechosForm.get('llaveDePagoRevision')?.disable();
              this.pagosDeDerechosForm.get('fechaInicioRevision')?.disable();
              this.pagosDeDerechosForm.get('importeDePagoRevision')?.disable();
              this.pagosDeDerechosForm.get('exentoPagoRevision')?.disable();
            }
          }
        )
      )
      .subscribe();

    /**
     * Observa los cambios en el estado del formulario y actualiza el estado del trámite en la tienda Akita.
     *
     * - Se suscribe a los cambios de estado del formulario `pagosDeDerechosForm`.
     * - Aplica un retraso de 10ms antes de ejecutar la lógica.
     * - Obtiene el estado actual del formulario y lo almacena en la tienda Akita.
     * - Finaliza la suscripción cuando `destroyNotifier$` emite un valor para evitar fugas de memoria.
     */
    this.pagosDeDerechosForm.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(10),
        tap(() => {
          const ACTIVE_STATE = { ...this.pagosDeDerechosForm.value };
          this.tramiteStore.setPagoDeDerechosTramite(ACTIVE_STATE);
        })
      )
      .subscribe();

    /**
     * Observa el estado de la sección y actualiza la variable local `seccion`.
     *
     * - Se suscribe a `selectSeccionState$` para obtener cambios en el estado de la sección.
     * - Al recibir un nuevo estado, se asigna a la variable `seccion`.
     * - La suscripción se finaliza automáticamente cuando `destroyNotifier$` emite un valor para evitar fugas de memoria.
     */
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * @method pagoDeCargarDatos
   * @description Obtiene y carga los datos de pago de derechos desde el servicio `acuicolaService`.
   *
   * - Se suscribe al método `pagoDeCargarDatos()` del servicio.
   * - Los datos obtenidos son aplicados al formulario `pagosDeDerechosForm`.
   * - La suscripción se gestiona con `takeUntil(this.destroyNotifier$)` para evitar fugas de memoria.
   *
   * @see {@link AcuicolaService} para la obtención de datos.
   * @see {@link pagosDeDerechosForm} para el almacenamiento de los datos en el formulario.
   */
  pagoDeCargarDatos(): void {
    this.acuicolaService
      .pagoDeCargarDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: PagoDeDerechos) => {
        // Crear datos de parcheo con exentoPago establecido a 'Si'
        const PATCH_DATA = { 
          ...data, 
          exentoPago: 'Si' 
        };
        this.exentoPagoValor = 'Si';
        this.pagosDeDerechosForm.patchValue(PATCH_DATA);
        // Volver a deshabilitar todos los controles especificados después del parcheo
        this.pagosDeDerechosForm.get('justificacion')?.disable();
        this.pagosDeDerechosForm.get('claveDeReferencia')?.disable();
        this.pagosDeDerechosForm.get('cadenaDependencia')?.disable();
        this.pagosDeDerechosForm.get('banco')?.disable();
        this.pagosDeDerechosForm.get('exentoPago')?.disable();
        this.pagosDeDerechosForm.get('llaveDePago')?.disable();
        this.pagosDeDerechosForm.get('fechaInicio')?.disable();
        this.pagosDeDerechosForm.get('importeDePago')?.disable();
        this.pagosDeDerechosForm.get('cadenaDependenciaRevision')?.disable();
      });
  }

  /**
   * @method getBancoDatos
   * @description Obtiene los datos del catálogo de bancos desde `acuicolaService` y los asigna a la propiedad `banco`.
   *
   * - Se suscribe a `getBancoDatos()` del servicio.
   * - Verifica que el código de respuesta sea `200` antes de procesar los datos.
   * - Crea un objeto de configuración para el catálogo de bancos.
   *
   * @see {@link AcuicolaService} para la obtención de datos bancarios.
   * @see {@link banco} para el almacenamiento de los datos del catálogo de bancos.
   */
  getBancoDatos(): void {
    this.acuicolaService
      .getBancoDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.banco = {
            labelNombre: 'Banco',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
          this.bancoRevision = {
            labelNombre: 'Banco',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * @method obtenerListaJustificacion
   * @description Obtiene la lista de justificaciones desde el servicio y actualiza el catálogo de justificaciones disponibles.
   */
  private obtenerListaJustificacion(): void {
    this.acuicolaService
      .obtenerDetallesDelCatalogo('justificacion.json')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (data) => {
          this.justificacionCatalogo = data.data as Catalogo[];
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  /**
   * @method pagoDerechosRevision
   * @description Obtiene y carga los datos de revisión de pago de derechos desde `acuicolaService`.
   *
   * - Se suscribe a `getPagoDerechosRevision()` del servicio.
   * - Los datos obtenidos se asignan al formulario `pagosDeDerechosForm`.
   * - Usa `takeUntil(this.destroyNotifier$)` para manejar la desuscripción y evitar fugas de memoria.
   *
   * @see {@link AcuicolaService} para la obtención de datos de revisión de pago.
   * @see {@link pagosDeDerechosForm} para almacenar los datos en el formulario.
   */
  pagoDerechosRevision(): void {
    this.acuicolaService
      .getPagoDerechosRevision()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: PagoDeDerechosRevision) => {
        this.pagosDeDerechosForm.patchValue(data);
        // Asegurar que todos los controles especificados permanezcan deshabilitados después de cualquier parcheo
        this.pagosDeDerechosForm.get('justificacion')?.disable();
        this.pagosDeDerechosForm.get('claveDeReferencia')?.disable();
        this.pagosDeDerechosForm.get('cadenaDependencia')?.disable();
        this.pagosDeDerechosForm.get('banco')?.disable();
        this.pagosDeDerechosForm.get('exentoPago')?.disable();
        this.pagosDeDerechosForm.get('llaveDePago')?.disable();
        this.pagosDeDerechosForm.get('fechaInicio')?.disable();
        this.pagosDeDerechosForm.get('importeDePago')?.disable();
        this.pagosDeDerechosForm.get('claveDeReferenciaRevision')?.disable();
        this.pagosDeDerechosForm.get('cadenaDependenciaRevision')?.disable();
        this.pagosDeDerechosForm.get('justificacionRevision')?.disable();
        this.pagosDeDerechosForm.get('bancoRevision')?.disable();
        this.pagosDeDerechosForm.get('llaveDePagoRevision')?.disable();
        this.pagosDeDerechosForm.get('fechaInicioRevision')?.disable();
        this.pagosDeDerechosForm.get('importeDePagoRevision')?.disable();
      });
  }

  /**
   * @method cambioValorRadio
   * @description Cambia el valor de un campo del formulario y actualiza el valor de exentoPagoValor.
   * @param {string} nombreControl - Nombre del campo del formulario.
   * @param {string} valor - Nuevo valor a asignar.
   */
  cambioValorRadio(nombreControl: string, valor: string): void {
    this.pagosDeDerechosForm.patchValue({
      [nombreControl]: valor,
    });
    this.exentoPagoValor = valor;
  }
  /**
   * @method cambioValorRadioRevision
   * @description Cambia el valor de un campo del formulario en revisión y actualiza el valor de exentoPagoRevisionValor.
   * @param {string} nombreControl - Nombre del campo del formulario.
   * @param {string} valor - Nuevo valor a asignar.
   */
  cambioValorRadioRevision(nombreControl: string, valor: string): void {
    this.pagosDeDerechosForm.patchValue({
      [nombreControl]: valor,
    });
    this.exentoPagoRevisionValor = valor;
  }

  /**
   * @method ngOnChanges
   * @description Método del ciclo de vida de Angular que se ejecuta cuando cambian las propiedades de entrada del componente.
   * Si la propiedad `setFecha` es una cadena, la divide en día, mes y año, crea un objeto de fecha usando `moment.utc`
   * y genera el formulario correspondiente. Además, habilita el control 'fechaInicio' en el formulario de pagos de derechos.
   */
  ngOnChanges(): void {
    if (
      typeof this.setFecha === 'string' &&
      this.setFecha.trim() !== '' &&
      this.setFecha.includes('/')
    ) {
      const FECHA = this.setFecha.split('/');
      if (FECHA.length === 3) {
        const OBJECT_DATE = moment.utc(`${FECHA[2]}-${FECHA[1]}-${FECHA[0]}`);
        if (typeof this.generarFormulario === 'function') {
          this.generarFormulario(OBJECT_DATE);
        }
        // Mantener fechaInicio deshabilitado ya que está en la lista de campos a deshabilitar
        if (
          this.pagosDeDerechosForm &&
          this.pagosDeDerechosForm.controls['fechaInicio']
        ) {
          this.pagosDeDerechosForm.controls['fechaInicio'].disable();
        }
      }
    }
  }
  /**
   * @method generarFormulario
   * @description Genera o actualiza el formulario con la fecha proporcionada.
   * @param {moment.Moment} fecha Fecha en formato moment.Moment
   */
  generarFormulario(fecha: moment.Moment): void {
    if (
      this.pagosDeDerechosForm &&
      this.pagosDeDerechosForm.controls['fechaInicio']
    ) {
      this.pagosDeDerechosForm.patchValue({
        fechaInicio: fecha.format('YYYY-MM-DD'),
      });
    }
  }
  
  /**
   * Actualiza la fecha de inicio en el formulario.
   * @method cambioFechaInicio
   * @param {string} nuevoValor - Nueva fecha de inicio.
   */
  cambioFechaInicio(nuevoValor: string): void {
    this.pagosDeDerechosForm.patchValue({
      fechaInicio: nuevoValor,
    });
  }

  /**
   * Actualiza la fecha de inicio de revisión en el formulario.
   * @method cambioFechaInicioRevision
   * @param {string} nuevoValor - Nueva fecha de inicio de revisión.
   */
  cambioFechaInicioRevision(nuevoValor: string): void {
    this.pagosDeDerechosForm.patchValue({
      fechaInicioRevision: nuevoValor,
    });
  }

  /**
   * Actualiza la fecha de pago en el formulario.
   * @method cambioFechaFinal
   * @param {string} nuevoValor - Nueva fecha de pago.
   */
  cambioFechaFinal(nuevoValor: string): void {
    this.pagosDeDerechosForm.patchValue({
      fechaPago: nuevoValor,
    });
    this.fechaPagoDate = nuevoValor;
  }


  /**
   * Borra todos los datos del formulario de pago de derechos.
   * Resetea los valores del formulario y actualiza el store.
   * @method borrarDatosPago
   */
  borrarDatosPago(): void {
    this.pagosDeDerechosForm.patchValue({
      justificacion: '',
      claveDeReferencia: '',
      cadenaDependencia: '',
      banco: '',
      llaveDePago: '',
      fechaInicio: '',
      importeDePago: '',
      justificacionRevision: '',
      claveDeReferenciaRevision: '',
      cadenaDependenciaRevision: '',
      bancoRevision: '',
      llaveDePagoRevision: '',
      fechaInicioRevision: '',
      importeDePagoRevision: '',
    });
    this.fechaPagoDate = '';
    const VALOR = this.pagosDeDerechosForm.value;
    this.tramiteStore.setPagoDeDerechosTramite(VALOR);
  }

  /**
   * Actualiza el valor de un campo en el formulario y lo guarda en el store.
   * Aplica lógica especial para patchear valores en consulta flow cuando se seleccionan banco o bancoRevision.
   * @method setValoresStore
   * @param {FormGroup} formulario - El formulario con el campo que se está actualizando.
   * @param {string} campo - El nombre del campo que se actualizará.
   */
  setValoresStore(
    _formulario: FormGroup,
    _campo: string,
  ): void {
    this.actualizarValoresConsulta();
    const VALOR = this.pagosDeDerechosForm.value;
    this.tramiteStore.setPagoDeDerechosTramite(VALOR);
  }

  /**
   * Actualiza ciertos valores en el formulario basados en condiciones específicas para el flujo de consulta.
   * Si se selecciona un banco y estamos en modo consulta, se patchean valores de ejemplo.
   * @method actualizarValoresConsulta
   */
  actualizarValoresConsulta(): void {
    // Solo aplicar la lógica de patcheo en modo de solo lectura (consulta flow)
    if (!this.esFormularioSoloLectura) {
      return;
    }

    const HOY = moment().format('YYYY-MM-DD');
    const FORM_VALUES = this.pagosDeDerechosForm.value;

    // Si se selecciona un banco en la sección principal y justificación tiene valor
    if (FORM_VALUES.banco && FORM_VALUES.justificacion) {
      this.pagosDeDerechosForm.patchValue({
        claveDeReferencia: 'valor',
        cadenaDependencia: 'valor',
        llaveDePago: 'valor',
        fechaInicio: HOY,
        importeDePago: 'valor',
      });
    }

    // Si se selecciona un banco en la sección de revisión y justificación revisión tiene valor
    if (FORM_VALUES.bancoRevision && FORM_VALUES.justificacionRevision) {
      this.pagosDeDerechosForm.patchValue({
        claveDeReferenciaRevision: 'valor',
        cadenaDependenciaRevision: 'valor',
        llaveDePagoRevision: 'valor',
        fechaInicioRevision: HOY,
        importeDePagoRevision: 'valor',
      });
    }
  }

  /**
   * @method ngOnDestroy
   * @description Maneja la limpieza de recursos antes de destruir el componente.
   *
   * - Emite un valor en `destroyNotifier$` para notificar a los observables que deben completar.
   * - Llama a `complete()` en `destroyNotifier$` para liberar memoria y evitar fugas de suscripciones.
   *
   * @see {@link destroyNotifier$} Subject utilizado para cancelar suscripciones activas.
   */

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
