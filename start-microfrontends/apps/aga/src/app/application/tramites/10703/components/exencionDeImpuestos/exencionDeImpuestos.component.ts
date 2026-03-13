import {
  AGENTES_TABLA_DATOS,
  MECANCIA_OPTIONS,
  MERCANCIA_INSTALADA,
} from '../../enums/exencionDeImpuestos.enum';
import {
  Catalogo,
  CatalogoSelectComponent,
  InputCheckComponent,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MercanciaInstalada,
  RatioOption,
} from '../../models/exencion-impuestos.model';
import {
  Solicitud10703State,
  Tramite10703Store,
} from '../../estados/tramite10703.store';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ExencionDeImpuestosService } from '../../services/exencion-de-impuestos.service';
import { Tramite10703Query } from '../../estados/tramite10703.query';
@Component({
  selector: 'app-exencion-de-impuestos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    InputCheckComponent,
    InputRadioComponent,
    TablaDinamicaComponent,
    NotificacionesComponent,
  ],
  templateUrl: './exencionDeImpuestos.component.html',
})
export class ExencionDeImpuestosComponent implements OnInit, OnDestroy {
  /**
   * Catálogo de aduanas.
   */
  aduana!: Catalogo[];
  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud10703State;

  /**
   * Lista de años disponibles.
   * @type {Catalogo[]}
   */
  ano!: Catalogo[];

  /**
   * Lista de unidades de medida disponibles.
   * @type {Catalogo[]}
   */
  unidadMedida!: Catalogo[];

  /**
   * Lista de condiciones de mercancía disponibles.
   * @type {Catalogo[]}
   */
  condicionMercancia!: Catalogo[];

  /**
   * Formulario de trámite.
   */
  tramiteForm!: FormGroup;

  /**
   * Formulario para agregar mercancías.
   */
  agregarMercanciasForm!: FormGroup;

  /**
   * Encabezado de la tabla de mercancías.
   */
  public mercanciaHeaderData: string[] = [];

  /**
   * Opciones para los botones de radio.
   */
  radioOptions!: RatioOption[];

  /**
   * Subject utilizado para destruir suscripciones y evitar fugas de memoria.
   */
  private destroy$: Subject<void> = new Subject<void>();
  /**
   * Lista de países disponibles.
   * @type {Catalogo[]}
   */
  pais!: Catalogo[];

  /**
   * Propiedad `usoEspecifico` que almacena un conjunto de opciones específicas
   * relacionadas con un catálogo de selección.
   * Se define como un array de objetos `Catalogo`.
   */
  usoEspecifico!: Catalogo[];

  /**
   * Datos de la tabla de capacidad instalada
   * @property {any[]} mercanciaDatos
   */
  mercanciaDatos: MercanciaInstalada[] = [] as MercanciaInstalada[];

  /**
   * Configuración para las columnas de la tabla de vehículos.
   */
  ParqueAgentes = AGENTES_TABLA_DATOS;

  /**
   * Tipo de selección para la tabla de capacidad instalada
   * @property {TablaSeleccion} constructorapacidadInstaladaTablaSeleccion
   */
  constructorapacidadInstaladaTablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Encabezados de la tabla de mercancia instalada
   * @property {any} mercanciaInstaladaEncabezado
   */
  mercanciaInstaladaEncabezado = MERCANCIA_INSTALADA;

  /**
   * Referencia al elemento del modal para agregar mercancías.
   */
  @ViewChild('modalAgregarMercancias') modalElement!: ElementRef;

  /**
   * Tipo de selección de tabla (CHECKBOX).
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Indica si un archivo está seleccionado.
   */
  enableModficarBoton: MercanciaInstalada[] = [];

  /**
   * Declaración de la variable nuevaNotificacion de tipo Notificacion.
   * Se utiliza para almacenar y gestionar notificaciones dentro del sistema.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  constructor(
    private fb: FormBuilder,
    private exencionDeImpuestosService: ExencionDeImpuestosService,
    private store: Tramite10703Store,
    private query: Tramite10703Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroy$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método `ngOnInit` que se ejecuta al inicializar el componente.
   * Se encarga de cargar datos iniciales, catálogos y configurar el estado de la solicitud.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
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
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.agregarMercanciasForm.disable();
      this.tramiteForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.agregarMercanciasForm.enable();
      this.tramiteForm.enable();
    }
  }

  /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */
  inicializarFormulario(): void {
    /**
     * Llama a los métodos que inicializan los catálogos requeridos en el formulario.
     */
    this.inicializaCatalogos();

    /**
     * Llama a la función que obtiene los datos de la exención de impuestos.
     */
    this.inicializaExencionDelmpustos();

    /**
     * Carga la información inicial sobre las mercancías.
     */
    this.inicializaMercancias();

    /**
     * Obtiene los datos de la tabla de mercancías y los almacena.
     */
    this.getMercanciaTbl();

    /**
     * Configura las opciones de selección para indicar si hay mercancía o no.
     */
    this.radioOptions = MECANCIA_OPTIONS;

    /**
     * Suscripción al estado de la solicitud para actualizar `solicitudState` cuando cambia.
     * La suscripción se finaliza automáticamente cuando `destroy$` emite una señal.
     */
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudState = seccionState;

          /**
           * Inicializa el formulario de exención de impuestos con los valores actuales del estado.
           */
          this.getExencionDelmpuestor();
        })
      )
      .subscribe();

    /**
     * Inicializa el formulario para agregar mercancías.
     */
    this.initagregarMercanciasForm();
  }

  /**
   * Método `getExencionDelmpuestor` para inicializar el formulario de solicitud de exención de impuestos.
   * Configura los valores con base en el estado actual de la solicitud (`solicitudState`).
   */
  getExencionDelmpuestor(): void {
    this.tramiteForm = this.fb.group({
      /**
       * Grupo `importadorExportador` que contiene la información del importador o exportador.
       */
      importadorExportador: this.fb.group({
        /**
         * Selección de aduana con validación obligatoria.
         */
        aduana: [this.solicitudState?.aduana, [Validators.required]],

        /**
         * Propiedad `manifesto` deshabilitada, cargada desde el estado de la solicitud.
         */
        manifesto: [{ value: this.solicitudState?.manifesto, disabled: true }],

        /**
         * Indica si la persona es física, deshabilitado para evitar cambios.
         */
        personaFisica: [
          { value: this.solicitudState?.personaFisica, disabled: true },
        ],

        /**
         * Indica si el organismo es público, propiedad deshabilitada.
         */
        organismoPublico: [
          { value: this.solicitudState?.organismoPublico, disabled: true },
        ],

        /**
         * Uso específico de la mercancía.
         */
        usoEspecifico: [this.solicitudState?.usoEspecifico],

        /**
         * Opción deshabilitada basada en el estado de la solicitud.
         */
        opcion: [{ value: this.solicitudState?.opcion, disabled: true }],

        /**
         * Correo electrónico del solicitante, deshabilitado para evitar cambios.
         */
        correoElectronico: [
          { value: this.solicitudState?.correoElectronico, disabled: true },
        ],

        /**
         * Teléfono del solicitante, deshabilitado.
         */
        telefono: [{ value: this.solicitudState?.telefono, disabled: true }],

        /**
         * Dirección del solicitante, incluyendo número interior y exterior.
         */
        numeroInterior: [
          { value: this.solicitudState?.numeroInterior, disabled: true },
        ],
        numeroExterior: [
          { value: this.solicitudState?.numeroExterior, disabled: true },
        ],
        calle: [{ value: this.solicitudState?.calle, disabled: true }],
        nombre: [{ value: this.solicitudState?.nombre, disabled: true }],
        estado: [{ value: this.solicitudState?.estado, disabled: true }],
        pais: [{ value: this.solicitudState?.pais, disabled: true }],
        codigoPostal: [
          { value: this.solicitudState?.codigoPostal, disabled: true },
        ],
        colonia: [{ value: this.solicitudState?.colonia, disabled: true }],
      }),
    });
  }

  /**
   * Método `initagregarMercanciasForm` para inicializar el formulario de mercancías.
   */
  initagregarMercanciasForm(): void {
    this.agregarMercanciasForm = this.fb.group({
      /**
       * Grupo `datosMercancia` que contiene la información de la mercancía.
       */
      datosMercancia: this.fb.group({
        /**
         * Tipo de mercancía, deshabilitado para evitar modificaciones.
         */
        tipoDeMercancia: [
          { value: this.solicitudState?.tipoDeMercancia, disabled: true },
        ],

        /**
         * Condición en la que se encuentra la mercancía.
         */
        condicionMercancia: [this.solicitudState?.condicionMercancia],

        /**
         * Información específica de la mercancía, campo deshabilitado.
         */
        especificoMercancia: [
          { value: this.solicitudState?.especificoMercancia, disabled: true },
        ],

        /**
         * Unidad de medida de la mercancía.
         */
        unidadMedida: [this.solicitudState?.unidadMedida],

        /**
         * Año de fabricación o adquisición de la mercancía.
         */
        ano: [this.solicitudState?.ano],

        /**
         * Cantidad de mercancía, campo deshabilitado.
         */
        cantidad: [{ value: this.solicitudState?.cantidad, disabled: true }],

        /**
         * Información del vehículo si la mercancía es un automóvil.
         * Se incluyen marca, modelo y número de serie.
         */
        marca: [{ value: this.solicitudState?.marca, disabled: true }],
        modelo: [{ value: this.solicitudState?.modelo, disabled: true }],
        serie: [{ value: this.solicitudState?.serie, disabled: true }],
        vehiculo: [{ value: this.solicitudState?.vehiculo, disabled: true }],
      }),
    });
  }
  /**
   * Método `abrirDialogoMercancias` que abre un modal para agregar mercancías.
   */
  abrirDialogoMercancias(): void {
    if (this.enableModficarBoton.length === 0) {
      this.nuevaNotificacion = {
        /**
         * Tipo de notificación: alerta.
         */
        tipoNotificacion: 'alert',

        /**
         * Categoría de la notificación: peligro (danger).
         */
        categoria: 'danger',

        /**
         * Modo de la notificación: acción requerida.
         */
        modo: 'action',

        /**
         * Título de la notificación (actualmente vacío).
         */
        titulo: '',

        /**
         * Mensaje de la notificación, indicando que 1 - El archivo debe conteneral menos un registro.
         */
        mensaje: 'Seleccione un registro',

        /**
         * Indica si la notificación debe cerrarse automáticamente (false = no se cerrará).
         */
        cerrar: false,

        /**
         * Tiempo de espera antes de cerrar la notificación (2000 milisegundos).
         */
        tiempoDeEspera: 2000,

        /**
         * Texto del botón de aceptación en la notificación.
         */
        txtBtnAceptar: 'Aceptar',

        /**
         * Texto del botón de cancelación en la notificación (actualmente vacío).
         */
        txtBtnCancelar: '',
      };
    } else {
      /**
       * Muestra el modal con el ID 'modalAgregarMercancias' si existe en el DOM.
       * Utiliza la clase Modal de Bootstrap para inicializar y mostrar el modal.
       */
      const MODAL_ELEMENT = document.getElementById('modalAgregarMercancias');
      if (MODAL_ELEMENT) {
        const MODAL = new bootstrap.Modal(MODAL_ELEMENT);
        MODAL.show();
      }
    }
  }

  /**
   * Método `getMercanciaTbl` que obtiene los datos de la tabla de mercancías desde el servicio.
   */
  getMercanciaTbl(): void {
    /**
     * Llamada al servicio `exencionDeImpuestosService.getMercanciaTbl()` para obtener los datos.
     * Se utiliza `pipe(takeUntil(this.destroy$))` para cancelar la suscripción cuando `destroy$` emite.
     */
    this.exencionDeImpuestosService
      .getMercanciaTbl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: MercanciaInstalada[]) => {
        this.mercanciaDatos = resp;
      });
  }

  /**
   * Método `inicializaCatalogos` que obtiene y almacena los datos de los catálogos necesarios.
   * Se realiza una serie de llamadas a servicios y se combinan las respuestas con `merge()`.
   */
  private inicializaCatalogos(): void {
    /**
     * Obtiene los datos de la aduana desde el servicio.
     */
    const ADUANA$ = this.exencionDeImpuestosService.getAduanaIngresara().pipe(
      map((resp) => {
        this.aduana = resp.data;
      })
    );

    /**
     * Obtiene los datos del uso específico desde el servicio.
     */
    const USO_ESPECIFICO$ = this.exencionDeImpuestosService
      .getusoEspecifico()
      .pipe(
        map((resp) => {
          this.usoEspecifico = resp.data;
        })
      );

    /**
     * Obtiene la lista de países desde el servicio.
     */
    const PAIS$ = this.exencionDeImpuestosService.getPais().pipe(
      map((resp) => {
        this.pais = resp.data;
      })
    );

    /**
     * Obtiene el año disponible desde el servicio.
     */
    const ANO$ = this.exencionDeImpuestosService.getAno().pipe(
      map((resp) => {
        this.ano = resp.data;
      })
    );

    /**
     * Obtiene la unidad de medida desde el servicio.
     */
    const UNIDAD_MEDIDA$ = this.exencionDeImpuestosService
      .getUnidadMedida()
      .pipe(
        map((resp) => {
          this.unidadMedida = resp.data;
        })
      );

    /**
     * Obtiene la condición de la mercancía desde el servicio.
     */
    const CONDICION_MERCANCIA$ = this.exencionDeImpuestosService
      .getCondicionMercancia()
      .pipe(
        map((resp) => {
          this.condicionMercancia = resp.data;
        })
      );

    /**
     * Se combinan todas las solicitudes y suscripciones para ejecutarlas simultáneamente.
     * Se cancela la suscripción cuando `destroy$` emite una señal.
     */
    merge(
      ADUANA$,
      PAIS$,
      USO_ESPECIFICO$,
      ANO$,
      UNIDAD_MEDIDA$,
      CONDICION_MERCANCIA$
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  /**
   * Método `inicializaMercancias` que obtiene y almacena información inicial de mercancías.
   */
  inicializaMercancias(): void {
    const INICIALIZAR_MERCANCIAS$ = this.exencionDeImpuestosService
      .getInicializarMercancias()
      .pipe(
        map((resp) => {
          /**
           * Si la respuesta tiene un código 200, se actualiza el estado del formulario.
           */
          if (resp.code === 200) {
            this.store.updateFormState(resp.data[0]);
          }
        })
      );

    /**
     * Se ejecuta la solicitud y se cancela cuando `destroy$` emite una señal.
     */
    merge(INICIALIZAR_MERCANCIAS$).pipe(takeUntil(this.destroy$)).subscribe();
  }

  /**
   * Método `inicializaExencionDelmpustos` que obtiene y almacena los datos de exención de impuestos.
   */
  inicializaExencionDelmpustos(): void {
    const INICIALIZAR_DATOSFORMULARIO$ = this.exencionDeImpuestosService
      .getInicializarDatos()
      .pipe(
        map((resp) => {
          /**
           * Se actualiza el estado del formulario con los datos obtenidos.
           */
          this.store.updateFormState(resp);
        })
      );

    /**
     * Se ejecuta la solicitud y se cancela cuando `destroy$` emite una señal.
     */
    merge(INICIALIZAR_DATOSFORMULARIO$)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  /**
   * Método `aduanaSeleccion` que maneja la selección de aduana por parte del usuario.
   */
  aduanaSeleccion(): void {
    /**
     * Obtiene el valor de la aduana seleccionada en el formulario.
     */
    const ADUANA = this.tramiteForm.get('importadorExportador.aduana')?.value;

    /**
     * Convierte el valor a número y actualiza el estado.
     */
    this.store.setAduana(Number(ADUANA));
  }

  /**
   * Maneja la fila seleccionada en la tabla de mercancías.
   * fila Fila seleccionada.
   */
  manejarFilaSeleccionada(fila: MercanciaInstalada[]): void {
    /**
     * Si la fila está vacía, deshabilita el botón de modificar.
     * Si hay filas seleccionadas, habilita el botón de modificar.
     */
    this.enableModficarBoton = fila;
  }

  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destroy$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
