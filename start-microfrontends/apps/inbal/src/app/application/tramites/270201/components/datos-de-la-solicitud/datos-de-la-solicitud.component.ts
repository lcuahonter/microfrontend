/**
 * Importaciones necesarias para el funcionamiento del componente.
 */
import {
  Catalogo,
  CatalogoSelectComponent,
  InputRadioComponent,
  SolicitanteComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  REGEX_ALTO,
  REGEX_ANCHO,
  REGEX_ANO_DE_CREACION,
  REGEX_AVALUO,
  REGEX_DIAMETRO,
  REGEX_PROFUNDIDAD,
} from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite270201State, Tramite270201Store } from '../../estados/tramites/tramite270201.store';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { MANIFIESTOS_DECLARACION } from '../../constantes/aviso-siglos.enum';
import { ModalComponent } from '../modal/modal.component';
import { OPCIONES_DE_BOTON_DE_RADIO } from '../../constantes/aviso-siglos.enum';
import { ObraTablaDatos } from '../../models/aviso-siglos.models';
import { SolicitudService } from '../../services/solicitud.service';
import { TablaDatos } from '../../models/aviso-siglos.models';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TableComponent } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite270201Query } from '../../estados/queries/tramite270201.query';
import obraDeArteDummy from '@libs/shared/theme/assets/json/270201/obra-de-arte-dummy.json'; // adjust path if needed

/**
 * Constante que contiene el texto del manifiesto de alerta sobre la propiedad y datos técnicos de la obra(s).
 *
 * @constant {string} MANIFIESTO_ALERT
 */
const MANIFIESTO_ALERT =
  'Manifiesto que la información sobre la propiedad de la obra(s) y los datos técnicos de la obra(s) son ciertos y verdaderos.*';

/**
 * Constante que almacena el texto de alerta sobre la obra de arte.
 * Este mensaje advierte sobre la importancia de proporcionar las medidas de cada pieza para evitar afectar la dictaminación de la solicitud.
 *
 * @constant {string} OBRA_DE_ARTE_ALERT
 */
const OBRA_DE_ARTE_ALERT =
  'Nota: Es indispensable proporcionar las medidas de cada pieza, ya que de no hacerlo se puede afectar la dictaminación de su solicitud';

@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    TableComponent,
    TablaDinamicaComponent,
    TituloComponent,
    ReactiveFormsModule,
    AlertComponent,
    ModalComponent,
    InputRadioComponent,
    SolicitanteComponent,
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss',
})

/**
 * @component DatosDeLaSolicitudComponent
 * @description
 * Componente que gestiona los datos relacionados con la solicitud de trámite.
 * Proporciona funcionalidad para mostrar información de tablas, modales y formularios.
 */
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {
  /** Subject para destruir el componente */
  private destroy$ = new Subject<void>();

  /**
   * @property {boolean} showTableDiv
   * @description
   * Indica si el contenedor de la tabla debe estar visible.
   * @default true
   */
  showTableDiv = true;

  /**
   * @property {boolean} showObraDeArteModal
   * @description
   * Indica si el modal de la obra de arte está visible o no.
   * @default false
   */
  showObraDeArteModal = false;

  /**
   * @property {Catalogo[]} operacionData
   * @description
   * Almacena los datos relacionados con las operaciones.
   * @default []
   */
  operacionData: Catalogo[] = [];

  /**
   * @property {Catalogo[]} movimientoData
   * @description
   * Almacena los datos relacionados con los movimientos.
   * @default []
   */
  movimientoData: Catalogo[] = [];

  /**
   * @property {Catalogo[]} motivoData
   * @description
   * Almacena los datos relacionados con los motivos.
   * @default []
   */
  motivoData: Catalogo[] = [];

  /**
   * @property {Catalogo[]} paisData
   * @description
   * Almacena los datos relacionados con los países.
   * @default []
   */
  paisData: Catalogo[] = [];

  /**
   * @property {Catalogo[]} transporteData
   * @description
   * Almacena los datos relacionados con los transportes.
   * @default []
   */
  transporteData: Catalogo[] = [];

  /**
   * @property {Catalogo[]} aduanaData
   * @description
   * Almacena los datos relacionados con las aduanas.
   * @default []
   */
  aduanaData: Catalogo[] = [];

  /**
   * @property {Catalogo[]} monedaData
   * @description
   * Almacena los datos relacionados con las monedas.
   * @default []
   */
  monedaData: Catalogo[] = [];

  /**
   * @property {Catalogo[]} arancelariaData
   * @description
   * Almacena los datos relacionados con las fracciones arancelarias.
   * @default []
   */
  arancelariaData: Catalogo[] = [];

  /**
   * @property {string} TEXTO_MANIFIESTO_ALERT
   * @description
   * Contiene el texto del manifiesto de alerta.
   */
  TEXTO_MANIFIESTO_ALERT = MANIFIESTO_ALERT;

  /**
   * @property {string} TEXTO_OBRA_ALERT
   * @description
   * Contiene el texto de alerta relacionado con las obras de arte.
   */
  TEXTO_OBRA_ALERT = OBRA_DE_ARTE_ALERT;

  /**
   * @property {Array} opcionDeBotonDeRadio
   * @description
   * Contiene las opciones disponibles para un botón de radio.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * @property {FormGroup} solicitudFormGroup
   * @description
   * Representa el formulario reactivo principal para la solicitud.
   */
  solicitudFormGroup!: FormGroup;

  /**
   * @property {FormGroup} obraDeArteFormgroup
   * @description
   * Representa el formulario reactivo para gestionar datos de las obras de arte.
   */
  obraDeArteFormgroup!: FormGroup;

  /**
   * @property {string[]} tablaObraDeArteData
   * @description
   * Esta propiedad es un arreglo que almacena datos relacionados con las obras de arte.
   * Se utiliza para manejar y mostrar información sobre diferentes obras de arte en la aplicación.
   * Inicialmente, el arreglo está vacío y puede ser llenado con datos en tiempo de ejecución.
   */
  tablaObraDeArteData: string[] = [];

 /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
   esFormularioSoloLectura: boolean = false;

   /** Estado actual del trámite 270201 asociado a la solicitud. 
   * Contiene datos del flujo y validaciones del proceso. */
   public solicitudState!: Tramite270201State;

  /**
   * Texto de los manifiestos.
   */
  manifiestosText: string = '';

  /**
   * @constructor
   * @description
   * Inicializa el componente con las dependencias necesarias para gestionar el formulario,
   * el estado del trámite, y los servicios asociados. Se pueden agregar más detalles
   * o lógica al constructor según sea necesario.
   *
   * @param {FormBuilder} fb - Utilizado para construir y gestionar formularios reactivos.
   * @param {Tramite270201Store} tramite270201Store - Almacén que gestiona el estado del trámite 270201.
   * @param {SolicitudService} solicitudService - Servicio encargado de realizar solicitudes HTTP
   * @param {ConsultaioQuery} consultaioQuery - Query para obtener el estado del store de consulta IO.
   * y obtener datos relacionados con el trámite.
   */
  constructor(
    private fb: FormBuilder,
    private tramite270201Store: Tramite270201Store,
    private tramite270201Query: Tramite270201Query,
    private solicitudService: SolicitudService,
    private consultaioQuery: ConsultaioQuery
  ) {
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
   * @method ngOnInit
   * @description
   * Método del ciclo de vida que se ejecuta una vez que el componente ha sido inicializado.
   * Este método realiza múltiples acciones, como la suscripción a servicios para obtener datos,
   * la inicialización de formularios reactivos y la configuración de textos de alerta.
   *
   * @example
   * Uso dentro del componente:
   * ```
   * ngOnInit(): void {
   *   this.solicitudService.getOperacionData().subscribe((data) => {
   *     this.operacionData = data;
   *   });
   * }
   * ```
   */
  ngOnInit(): void {
   /** Texto que contiene los manifiestos declarados. */
    this.manifiestosText = MANIFIESTOS_DECLARACION.MANIFIESTOS;

      // Suscribe al estado del trámite y restaura las filas de la tabla si existen
  this.tramite270201Query.selectDatosSolicitud$
    .pipe(
      takeUntil(this.destroy$),
      map((solicitudState) => {
        this.solicitudState = solicitudState as Tramite270201State;

        // Restaurar las filas de la tabla de obras de arte si existen en el store
        if (
          this.solicitudState &&
          typeof this.solicitudState === 'object' &&
          this.solicitudState.ObraDeArte &&
          Array.isArray(this.solicitudState.ObraDeArte)
        ) {
          // Evita duplicados si navegas varias veces
          this.obraDeArteRowData = [...this.solicitudState.ObraDeArte];
        }

        /**
        * Verifica si no hay datos de obra de arte y, de ser así, inicializa el arreglo
        * con datos dummy y actualiza el store correspondiente.
        */
        if(this.obraDeArteRowData.length === 0) {
          const OBRA_DE_ARTE_ROW: TablaDatos = {
            tbodyData: obraDeArteDummy,
          };
          this.obraDeArteRowData.push(OBRA_DE_ARTE_ROW);
          this.tramite270201Store.setObraDeArte(this.obraDeArteRowData);
        }
      })
    )
    .subscribe();
    /**
     * @description
     * Obtiene los datos de las columnas para la tabla de obras de arte desde el servicio de solicitud.
     * Actualiza la propiedad `tablaObraDeArteData` con los datos recibidos.
     */
    this.solicitudService
      .getObraDeArteTabla()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ObraTablaDatos) => {
        this.tablaObraDeArteData = data.columns;
      });

    /**
     * Obtiene los datos de operación desde el servicio y los asigna a `operacionData`.
     */
    this.solicitudService
      .getOperacionData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.operacionData = data;
      });

    /**
     * Obtiene los datos de movimiento desde el servicio y los asigna a `movimientoData`.
     */
    this.solicitudService
      .getMovimientoData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.movimientoData = data;
      });

    /**
     * Obtiene los datos de país desde el servicio y los asigna a `paisData`.
     */
    this.solicitudService
      .getPaisData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.paisData = data;
      });

    /**
     * Obtiene los datos de transporte desde el servicio y los asigna a `transporteData`.
     */
    this.solicitudService
      .getTransporteData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.transporteData = data;
      });

    /**
     * Obtiene los datos de aduana desde el servicio y los asigna a `aduanaData`.
     */
    this.solicitudService
      .getAduanaData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.aduanaData = data;
      });

    /**
     * Obtiene los datos de motivo desde el servicio y los asigna a `motivoData`.
     */
    this.solicitudService
      .getMotivoData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.motivoData = data;
      });

    /**
     * Obtiene los datos de moneda desde el servicio y los asigna a `monedaData`.
     */
    this.solicitudService
      .getMonedaData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.monedaData = data;
      });

    /**
     * Obtiene los datos de fracciones arancelarias desde el servicio y los asigna a `arancelariaData`.
     */
    this.solicitudService
      .getArancelariaData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.arancelariaData = data;
      });

    /**
     * Inicializa el formulario reactivo principal para gestionar la solicitud.
     */
    this.initializeSolicitudFormGroup();

    /**
     * Inicializa el formulario reactivo para gestionar datos de las obras de arte.
     */
    this.initializeObraDeArteFormGroup();

    /** Llama al método que configura el formulario según el estado de solo lectura. */
    this.inicializarEstadoFormulario();
  }

 /**
   * Determina si se debe cargar un formulario nuevo o uno existente.  
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else if(this.solicitudFormGroup && this.obraDeArteFormgroup) {
       this.solicitudFormGroup.enable();
       this.obraDeArteFormgroup.enable();
    }
  }


   /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.initializeSolicitudFormGroup();
    this.initializeObraDeArteFormGroup();
    if (this.solicitudFormGroup && this.esFormularioSoloLectura) {
      this.solicitudFormGroup.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.solicitudFormGroup.enable();
    } 

    if (this.obraDeArteFormgroup && this.esFormularioSoloLectura) {
      this.obraDeArteFormgroup.disable();
      if (this.obraDeArteRowData.length === 0) {
      const OBRA_DE_ARTE_ROW: TablaDatos = {
      tbodyData: obraDeArteDummy,
    };
    this.obraDeArteRowData.push(OBRA_DE_ARTE_ROW);
  }
    } else if (!this.esFormularioSoloLectura) {
      this.obraDeArteFormgroup.enable();
    }
  }

  /**
   * @method initializeSolicitudFormGroup
   * @description
   * Método encargado de inicializar el grupo de formularios reactivos para la solicitud.
   * Define los controles y validaciones requeridas para cada campo del formulario.
   * Este formulario se utiliza para capturar datos clave relacionados con el trámite 270201.
   *
   * @example
   * Uso del método:
   * ```
   * this.initializeSolicitudFormGroup();
   * console.log(this.solicitudFormGroup.value);
   * ```
   */
  initializeSolicitudFormGroup(): void {
    /**
     * @property {FormGroup} solicitudFormGroup
     * @description
     * Grupo de formularios reactivos que contiene los siguientes controles:
     *
     * - tipoDeOperacion: Representa el tipo de operación seleccionada.
     * - tipoDeMovimiento: Representa el tipo de movimiento seleccionado.
     * - motivo: Captura el motivo del trámite.
     * - pais: Almacena el país relacionado con el trámite.
     * - ciudad: Captura la ciudad asociada al trámite.
     * - medioTransporte: Representa el transporte utilizado en el trámite.
     * - aduanaEntrada: Define la aduana de entrada correspondiente al trámite.
     *
     * Cada control incluye validaciones utilizando la clase `Validators`.
     */
    this.solicitudFormGroup = this.fb.group({
      /**
       * @control tipoDeOperacion
       * @description
       * Control reactivo para el tipo de operación seleccionada.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      tipoDeOperacion: new FormControl('', [Validators.required]),

      /**
       * @control tipoDeMovimiento
       * @description
       * Control reactivo para el tipo de movimiento seleccionado.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      tipoDeMovimiento: new FormControl('', [Validators.required]),

      /**
       * @control motivo
       * @description
       * Control reactivo para capturar el motivo del trámite.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      motivo: new FormControl('', [Validators.required]),

      /**
       * @control pais
       * @description
       * Control reactivo para almacenar el país relacionado con el trámite.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      pais: new FormControl('', [Validators.required]),

      /**
       * @control ciudad
       * @description
       * Control reactivo para capturar la ciudad asociada al trámite.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      ciudad: new FormControl('', [
        Validators.required,
        Validators.maxLength(250),
      ]),

      /**
       * @control medioTransporte
       * @description
       * Control reactivo para representar el transporte utilizado en el trámite.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      medioTransporte: new FormControl('', [Validators.required]),

      /**
       * @control aduanaEntrada
       * @description
       * Control reactivo para definir la aduana de entrada correspondiente al trámite.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      aduanaEntrada: new FormControl('', [Validators.required]),

        /**
       * @control manifiesto
       * @description
       * Control de formulario para el campo 'manifiesto'
       * Es obligatorio y debe ser completado.
       * @default true
       */
      manifiesto: new FormControl({ value: true, disabled: this.esFormularioSoloLectura },
      [Validators.required]),
    });

      /** Suscribe al estado de solicitud 270201 y lo asigna a `solicitudState`.  
      * Usa `takeUntil` para limpiar la suscripción al destruir el componente. */
      this.tramite270201Query.selectDatosSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudState = seccionState as Tramite270201State;
        })
      )
      .subscribe()

        this.solicitudFormGroup.patchValue({
          tipoDeOperacion: this.solicitudState.tipoDeOperacion,
          tipoDeMovimiento: this.solicitudState.tipoDeMovimiento,
          motivo: this.solicitudState.motivo,
          pais: this.solicitudState.pais,
          ciudad: this.solicitudState.ciudad,
          medioTransporte: this.solicitudState.medioTransporte,
          aduanaEntrada: this.solicitudState.aduanaEntrada,
        });
  }

  /**
   * @method initializeObraDeArteFormGroup
   * @description
   * Método encargado de inicializar el grupo de formularios reactivos para capturar los datos
   * de una obra de arte. Define los controles y las validaciones requeridas para cada campo del
   * formulario. Este formulario asegura que los datos relacionados con la obra de arte sean
   * registrados de manera precisa y cumplan con las reglas de validación.
   *
   * @example
   * Uso del método:
   * ```
   * this.initializeObraDeArteFormGroup();
   * console.log(this.obraDeArteFormgroup.value);
   * ```
   */
  initializeObraDeArteFormGroup(): void {
    /**
     * @property {FormGroup} obraDeArteFormgroup
     * @description
     * Grupo de formularios reactivos que contiene los siguientes controles:
     *
     * - autor: Nombre del autor de la obra.
     * - titulo: Título de la obra de arte.
     * - tecnicaDeRealizacion: Técnica utilizada en la realización de la obra.
     * - medidas: Dimensiones generales de la obra.
     * - alto: Altura de la obra en centímetros.
     * - ancho: Anchura de la obra en centímetros.
     * - profundidad: Profundidad de la obra en centímetros.
     * - diametro: Diámetro de la obra en centímetros.
     * - variables: Variables adicionales relacionadas con la obra.
     * - anoDeCreacion: Año en el que la obra fue creada.
     * - avaluo: Valor estimado de la obra.
     * - moneda: Moneda utilizada en el avalúo.
     * - propietario: Propietario actual de la obra.
     * - fraccionArancelaria: Fracción arancelaria asociada a la obra.
     * - descripcionArancelaria: Descripción detallada de la fracción arancelaria.
     *
     * Todos los controles incluyen validaciones utilizando la clase `Validators` para asegurar
     * que los datos sean válidos.
     */
    this.obraDeArteFormgroup = this.fb.group({
      /**
       * @control autor
       * @description
       * Control reactivo para registrar el nombre del autor de la obra.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      autor: ['', [Validators.required, Validators.maxLength(250)]],

      /**
       * @control titulo
       * @description
       * Control reactivo para registrar el título de la obra de arte.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      titulo: ['', [Validators.required, Validators.maxLength(250)]],

      /**
       * @control tecnicaDeRealizacion
       * @description
       * Control reactivo para registrar la técnica utilizada en la realización de la obra.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      tecnicaDeRealizacion: [
        '',
        [Validators.required, Validators.maxLength(250)],
      ],

      /**
       * @control medidas
       * @description
       * Control reactivo para registrar las dimensiones generales de la obra.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      medidas: ['1', [Validators.required]],

      /**
       * @control alto
       * @description
       * Control reactivo para registrar la altura de la obra en centímetros.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      alto: ['', [Validators.required, Validators.pattern(REGEX_ALTO)]],

      /**
       * @control ancho
       * @description
       * Control reactivo para registrar la anchura de la obra en centímetros.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      ancho: ['', [Validators.required, Validators.pattern(REGEX_ANCHO)]],

      /**
       * @control profundidad
       * @description
       * Control reactivo para registrar la profundidad de la obra en centímetros.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      profundidad: [
        '',
        [Validators.required, Validators.pattern(REGEX_PROFUNDIDAD)],
      ],

      /**
       * @control diametro
       * @description
       * Control reactivo para registrar el diámetro de la obra en centímetros.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      diametro: ['', [Validators.required, Validators.pattern(REGEX_DIAMETRO)]],

      /**
       * @control variables
       * @description
       * Control reactivo para registrar variables adicionales relacionadas con la obra.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      variables: ['', [Validators.required, Validators.maxLength(150)]],

      /**
       * @control anoDeCreacion
       * @description
       * Control reactivo para registrar el año de creación de la obra de arte.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      anoDeCreacion: [
        '',
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern(REGEX_ANO_DE_CREACION),
        ],
      ],

      /**
       * @control avaluo
       * @description
       * Control reactivo para registrar el valor estimado de la obra de arte.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      avaluo: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(REGEX_AVALUO),
        ],
      ],

      /**
       * @control moneda
       * @description
       * Control reactivo para registrar la moneda utilizada en el avalúo.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      moneda: ['', [Validators.required]],

      /**
       * @control propietario
       * @description
       * Control reactivo para registrar el propietario actual de la obra de arte.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      propietario: ['', [Validators.required, Validators.maxLength(250)]],

      /**
       * @control fraccionArancelaria
       * @description
       * Control reactivo para registrar la fracción arancelaria asociada a la obra.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      fraccionArancelaria: ['', [Validators.required]],

      /**
       * @control descripcionArancelaria
       * @description
       * Control reactivo para registrar una descripción detallada de la fracción arancelaria.
       * Es obligatorio y debe ser completado.
       * @default ''
       */
      descripcionArancelaria: ['', [Validators.required]],
    });


  /** Suscribe al estado de solicitud 270201 y lo asigna a `solicitudState`.  
 * Usa `takeUntil` para limpiar la suscripción al destruir el componente. */
   this.tramite270201Query.selectDatosSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudState = seccionState as Tramite270201State;
        })
      )
      .subscribe()

          this.obraDeArteFormgroup.patchValue({
          autor: this.solicitudState.autor,
          titulo: this.solicitudState.titulo,
          tecnicaDeRealizacion: this.solicitudState.tecnicaDeRealizacion,
          alto: this.solicitudState.alto,
          ancho: this.solicitudState.ancho,
          profundidad: this.solicitudState.profundidad,
          diametro: this.solicitudState.diametro,
          variables: this.solicitudState.variables,
          anoDeCreacion: this.solicitudState.anoDeCreacion,
          avaluo: this.solicitudState.avaluo,
          moneda: this.solicitudState.moneda,
          propietario: this.solicitudState.propietario,
          fraccionArancelaria: this.solicitudState.fraccionArancelaria,
          descripcionArancelaria: this.solicitudState.descripcionArancelaria,
        });
  }

  /**
   * @method actualizarOperacion
   * @description
   * Actualiza el estado con el tipo de operación seleccionado en el formulario de solicitud.
   * Obtiene el valor del campo `tipoDeOperacion` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarOperacion();
   * console.log('Tipo de operación actualizada.');
   * ```
   */
  actualizarOperacion(): void {
    const OPERACION = this.solicitudFormGroup.get('tipoDeOperacion')?.value;
    if (OPERACION !== null) {
      this.tramite270201Store.setOperacion(OPERACION);
    }
  }

  /**
   * @method actualizarMovimiento
   * @description
   * Actualiza el estado con el tipo de movimiento seleccionado en el formulario de solicitud.
   * Obtiene el valor del campo `tipoDeMovimiento` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarMovimiento();
   * console.log('Tipo de movimiento actualizado.');
   * ```
   */
  actualizarMovimiento(): void {
    const MOVIMIENTO = this.solicitudFormGroup.get('tipoDeMovimiento')?.value;
    this.tramite270201Store.setMovimiento(MOVIMIENTO);
  }

  /**
   * @method actualizarMotivo
   * @description
   * Actualiza el estado con el motivo seleccionado en el formulario de solicitud.
   * Obtiene el valor del campo `motivo` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarMotivo();
   * console.log('Motivo actualizado.');
   * ```
   */
  actualizarMotivo(): void {
    const MOTIVO = this.solicitudFormGroup.get('motivo')?.value;
    this.tramite270201Store.setMotivo(MOTIVO);
  }

  /**
   * @method actualizarPais
   * @description
   * Actualiza el estado con el país seleccionado en el formulario de solicitud.
   * Obtiene el valor del campo `pais` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarPais();
   * console.log('País actualizado.');
   * ```
   */
  actualizarPais(): void {
    const PAIS = this.solicitudFormGroup.get('pais')?.value;
    this.tramite270201Store.setPais(PAIS);
  }

  /**
   * @method actualizarCiudad
   * @description
   * Actualiza el estado con la ciudad seleccionada en el formulario de solicitud.
   * Obtiene el valor del campo `ciudad` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarCiudad();
   * console.log('Ciudad actualizada.');
   * ```
   */
  actualizarCiudad(): void {
    const CIUDAD = this.solicitudFormGroup.get('ciudad')?.value;
    this.tramite270201Store.setCiudad(CIUDAD);
  }

  /**
   * @method actualizarTransporte
   * @description
   * Actualiza el estado con el medio de transporte seleccionado en el formulario de solicitud.
   * Obtiene el valor del campo `medioTransporte` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarTransporte();
   * console.log('Medio de transporte actualizado.');
   * ```
   */
  actualizarTransporte(): void {
    const TRANSPORTE = this.solicitudFormGroup.get('medioTransporte')?.value;
    this.tramite270201Store.setTransporte(TRANSPORTE);
  }

  /**
   * @method actualizarAduana
   * @description
   * Actualiza el estado con la aduana de entrada seleccionada en el formulario de solicitud.
   * Obtiene el valor del campo `aduanaEntrada` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarAduana();
   * console.log('Aduana de entrada actualizada.');
   * ```
   */
  actualizarAduana(): void {
    const ADUANA = this.solicitudFormGroup.get('aduanaEntrada')?.value;
    this.tramite270201Store.setAduana(ADUANA);
  }

  /**
   * @method actualizarAutor
   * @description
   * Actualiza el estado con el autor de la obra de arte seleccionado en el formulario de solicitud.
   * Obtiene el valor del campo `autor` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarAutor();
   * console.log('Autor de la obra actualizado.');
   * ```
   */
  actualizarAutor(): void {
    const AUTOR = this.obraDeArteFormgroup.get('autor')?.value;
    this.tramite270201Store.setAutor(AUTOR);
  }

  /**
   * @method actualizarTitulo
   * @description
   * Actualiza el estado con el título de la obra de arte seleccionado en el formulario de solicitud.
   * Obtiene el valor del campo `titulo` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarTitulo();
   * console.log('Título de la obra actualizado.');
   * ```
   */
  actualizarTitulo(): void {
    const TITULO = this.obraDeArteFormgroup.get('titulo')?.value;
    this.tramite270201Store.setTitulo(TITULO);
  }

  /**
   * @method actualizarTecnica
   * @description
   * Actualiza el estado con la técnica de realización seleccionada en el formulario de solicitud.
   * Obtiene el valor del campo `tecnicaDeRealizacion` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarTecnica();
   * console.log('Técnica de realización actualizada.');
   * ```
   */
  actualizarTecnica(): void {
    const TECNICA = this.obraDeArteFormgroup.get('tecnicaDeRealizacion')?.value;
    this.tramite270201Store.setTecnica(TECNICA);
  }

  /**
   * @method actualizarAlto
   * @description
   * Actualiza el estado con la altura de la obra de arte seleccionada en el formulario de solicitud.
   * Obtiene el valor del campo `alto` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarAlto();
   * console.log('Altura de la obra actualizada.');
   * ```
   */
  actualizarAlto(): void {
    const ALTO = this.obraDeArteFormgroup.get('alto')?.value;
    this.tramite270201Store.setAlto(ALTO);
  }

  /**
   * @method actualizarAncho
   * @description
   * Actualiza el estado con el ancho de la obra de arte seleccionada en el formulario de solicitud.
   * Obtiene el valor del campo `ancho` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarAncho();
   * console.log('Anchura de la obra actualizada.');
   * ```
   */
  actualizarAncho(): void {
    const ANCHO = this.obraDeArteFormgroup.get('ancho')?.value;
    this.tramite270201Store.setAncho(ANCHO);
  }

  /**
   * @method actualizarProfundidad
   * @description
   * Actualiza el estado con la profundidad de la obra de arte seleccionada en el formulario de solicitud.
   * Obtiene el valor del campo `profundidad` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarProfundidad();
   * console.log('Profundidad de la obra actualizada.');
   * ```
   */
  actualizarProfundidad(): void {
    const PROFUNDIDAD = this.obraDeArteFormgroup.get('profundidad')?.value;
    this.tramite270201Store.setProfundidad(PROFUNDIDAD);
  }

  /**
   * @method actualizarDiametro
   * @description
   * Actualiza el estado con el diámetro de la obra de arte seleccionada en el formulario de solicitud.
   * Obtiene el valor del campo `diametro` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarDiametro();
   * console.log('Diámetro de la obra actualizado.');
   * ```
   */
  actualizarDiametro(): void {
    const DIAMETRO = this.obraDeArteFormgroup.get('diametro')?.value;
    this.tramite270201Store.setDiametro(DIAMETRO);
  }

  /**
   * @method actualizarVariables
   * @description
   * Actualiza el estado con las variables adicionales de la obra de arte seleccionadas en el formulario de solicitud.
   * Obtiene el valor del campo `variables` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarVariables();
   * console.log('Variables adicionales de la obra actualizadas.');
   * ```
   */
  actualizarVariables(): void {
    const VARIABLES = this.obraDeArteFormgroup.get('variables')?.value;
    this.tramite270201Store.setVariables(VARIABLES);
  }

  /**
   * @method actualizarAnoDeCreacion
   * @description
   * Actualiza el estado con el año de creación de la obra de arte seleccionado en el formulario de solicitud.
   * Obtiene el valor del campo `anoDeCreacion` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarAnoDeCreacion();
   * console.log('Año de creación actualizado.');
   * ```
   */
  actualizarAnoDeCreacion(): void {
    const ANO_DE_CREACION =
      this.obraDeArteFormgroup.get('anoDeCreacion')?.value;
    this.tramite270201Store.setAnoDeCreacion(ANO_DE_CREACION);
  }

  /**
   * @method actualizarAvaluo
   * @description
   * Actualiza el estado con el avalúo de la obra de arte seleccionado en el formulario de solicitud.
   * Obtiene el valor del campo `avaluo` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarAvaluo();
   * console.log('Avalúo actualizado.');
   * ```
   */
  actualizarAvaluo(): void {
    const AVALUO = this.obraDeArteFormgroup.get('avaluo')?.value;
    this.tramite270201Store.setAvaluo(AVALUO);
  }

  /**
   * @method actualizarMoneda
   * @description
   * Actualiza el estado con la moneda asociada al avalúo seleccionada en el formulario de solicitud.
   * Obtiene el valor del campo `moneda` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarMoneda();
   * console.log('Moneda actualizada.');
   * ```
   */
  actualizarMoneda(): void {
    const MONEDA = this.obraDeArteFormgroup.get('moneda')?.value;
    this.tramite270201Store.setMoneda(MONEDA);
  }

  /**
   * @method actualizarPropietario
   * @description
   * Actualiza el estado con el propietario de la obra de arte seleccionado en el formulario de solicitud.
   * Obtiene el valor del campo `propietario` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarPropietario();
   * console.log('Propietario actualizado.');
   * ```
   */
  actualizarPropietario(): void {
    const PROPIETARIO = this.obraDeArteFormgroup.get('propietario')?.value;
    this.tramite270201Store.setPropietario(PROPIETARIO);
  }

  /**
   * @method actualizarFraccionArancelaria
   * @description
   * Actualiza el estado con la fracción arancelaria seleccionada en el formulario de solicitud.
   * Obtiene el valor del campo `fraccionArancelaria` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarFraccionArancelaria();
   * console.log('Fracción arancelaria actualizada.');
   * ```
   */
  actualizarFraccionArancelaria(): void {
    const FRACCION_ARANCELARIA = this.obraDeArteFormgroup.get(
      'fraccionArancelaria'
    )?.value;
    if (FRACCION_ARANCELARIA !== null && FRACCION_ARANCELARIA !== undefined) {
      this.tramite270201Store.setFraccionArancelaria(FRACCION_ARANCELARIA);
    }
  }

  /**
   * @method actualizarDescArancelaria
   * @description
   * Actualiza el estado con la descripción arancelaria de la obra seleccionada en el formulario de solicitud.
   * Obtiene el valor del campo `descripcionArancelaria` y lo envía al almacén del trámite.
   *
   * @example
   * Uso del método:
   * ```
   * this.actualizarDescArancelaria();
   * console.log('Descripción arancelaria actualizada.');
   * ```
   */
  actualizarDescArancelaria(): void {
    const DESCRIPCION_ARANCELARIA = this.obraDeArteFormgroup.get(
      'descripcionArancelaria'
    )?.value;
    this.tramite270201Store.setDescripcionArancelaria(DESCRIPCION_ARANCELARIA);
  }

  /**
   * Arreglo que almacena los datos de las filas de la tabla de obras de arte.
   *
   * @type {TablaDatos[]}
   */
  obraDeArteRowData: TablaDatos[] = [];

  /**
   * Función que alterna la visibilidad del div de la tabla y el modal de obras de arte.
   * Cambia el estado de `showTableDiv` y `showObraDeArteModal` a su valor opuesto.
   *
   * @returns {void}
   */
  toggleObraDeArte(): void {
    this.showTableDiv = !this.showTableDiv;
    this.showObraDeArteModal = !this.showObraDeArteModal;
  }

  /**
   * Función que maneja el envío del formulario de obra de arte.
   * Esta función procesa los datos del formulario, crea un objeto con los datos de la obra de arte,
   * y actualiza la lista de obras de arte en la tabla.
   *
   * @returns {void}
   */
  submitDeArteForm(): void {
    /**
     * Obtiene el valor de la etiqueta de las medidas seleccionadas en el formulario.
     */
    const MEDIDAS_VALUE = OPCIONES_DE_BOTON_DE_RADIO.find(
      (option) => option.value === this.obraDeArteFormgroup.value.medidas
    )?.label;

    /**
     * Obtiene la descripción de la fracción arancelaria seleccionada en el formulario.
     */
    const ARANCELARIA_VALUE = this.arancelariaData.find(
      (item: Catalogo) =>
        item.id === this.obraDeArteFormgroup.value.fraccionArancelaria
    )?.descripcion;

    /**
     * Obtiene la descripción de la moneda seleccionada en el formulario.
     */
    const MONEDA_VALUE = this.monedaData.find(
      (item: Catalogo) => item.id === this.obraDeArteFormgroup.value.moneda
    )?.descripcion;

    /**
     * Crea un objeto que representa una fila en la tabla de obras de arte.
     * Este objeto contiene los datos relevantes de la obra de arte.
     */
    const OBRA_DE_ARTE_ROW = {
      tbodyData: [
        this.obraDeArteFormgroup.value.autor,
        this.obraDeArteFormgroup.value.titulo,
        this.obraDeArteFormgroup.value.tecnicaDeRealizacion,
        MEDIDAS_VALUE,
        this.obraDeArteFormgroup.value.ancho,
        this.obraDeArteFormgroup.value.alto,
        this.obraDeArteFormgroup.value.profundidad,
        this.obraDeArteFormgroup.value.diametro,
        this.obraDeArteFormgroup.value.variables,
        this.obraDeArteFormgroup.value.anoDeCreacion,
        this.obraDeArteFormgroup.value.avaluo,
        MONEDA_VALUE,
        this.obraDeArteFormgroup.value.propietario,
        ARANCELARIA_VALUE,
        this.obraDeArteFormgroup.value.descripcionArancelaria,
      ],
    };

    /**
     * Agrega la nueva obra de arte a la lista de obras de arte.
     */
    this.obraDeArteRowData.push(OBRA_DE_ARTE_ROW);

    /**
     * Actualiza el almacenamiento de obras de arte en la tienda.
     */
    this.tramite270201Store.setObraDeArte(this.obraDeArteRowData);

    /**
     * Alterna la visibilidad del div de la tabla y el modal de obras de arte.
     */
    this.showTableDiv = !this.showTableDiv;
    this.showObraDeArteModal = !this.showObraDeArteModal;
  }
  /*
   * Método del ciclo de vida de Angular - destruye el componente
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}