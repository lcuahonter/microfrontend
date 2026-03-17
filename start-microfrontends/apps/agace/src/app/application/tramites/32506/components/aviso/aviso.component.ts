import {
  AlertComponent,
  CatalogoSelectComponent,
  ConsultaioQuery,
  ConsultaioState,
  InputFecha,
  InputFechaComponent,
  InputHoraComponent,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  REGEX_ALFANUMERICO_CON_ESPACIOS,
  REGEX_ALFANUMERICO_CON_ESPACIOS_REEMPLAZAR,
  REGEX_IMPORTE_PAGO,
  REGEX_NUMEROS,
  REGEX_REEMPLAZAR,
  REGEX_SOLO_NUMEROS,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import {
  AvisoTabla,
  AvisoTablaDatos,
  Catalogo,
  CatalogoLista,
  DesperdicioTabla,
  DesperdicioTablaDatos,
  PedimentoTabla,
  PedimentoTablaDatos,
  ProcesoTabla,
  ProcesoTablaDatos,
} from '../../models/aviso-destruccion.model';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FECHA_INGRESO,
  HORA_DESTRUCCION,
  TABLA_DESPERDICIO,
  TABLA_DE_DATOS,
  TABLA_PEDIMENTO,
  TABLA_PROCESO,
  TEXTOS,
  TIPACA,
  TIPAVI,
} from '../../constants/aviso-destruccion.enum';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite32506State,
  Tramite32506Store,
} from '../../estados/tramite32506.store';
import { AvisoDestruccionService } from '../../services/aviso-destruccion.service';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { Tramite32506Query } from '../../estados/tramite32506.query';

/**
 * Componente para gestionar el aviso de traslado.
 *
 * Este componente permite al usuario capturar, editar y gestionar la información
 * relacionada con el aviso de traslado, incluyendo datos de la empresa, mercancías,
 * domicilios y otros detalles necesarios para el trámite 32506.
 */
@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html',
  styleUrl: './aviso.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    InputFechaComponent,
    InputHoraComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    AlertComponent,
    NotificacionesComponent,
    InputRadioComponent,
  ],
  standalone: true,
})
export class AvisoComponent implements OnInit, OnDestroy {
  /**
   * @property {string} HORA_DESTRUCCION
   * @description Hora de destrucción predefinida para el aviso.
   */
  HORA_DESTRUCCION: string = HORA_DESTRUCCION;
  /**
   * @property {FormGroup} avisoFormulario
   * @description Formulario reactivo que contiene los datos del aviso en el trámite.
   */
  avisoFormulario!: FormGroup;

  /**
   * @property {FormGroup} procesoFormulario
   * @description Formulario reactivo que contiene los datos del aviso en el trámite.
   */
  procesoFormulario!: FormGroup;

  /**
   * @property {FormGroup} desperdicioFormulario
   * @description Formulario reactivo que contiene los datos del aviso en el trámite.
   */
  desperdicioFormulario!: FormGroup;
  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Sujeto utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();
  /**
   * @property {Tramite32506State} tramiteState
   * @description Estado actual del trámite 32506, que contiene toda la información relevante del proceso.
   */
  public tramiteState!: Tramite32506State;
  /**
   * @property {InputFecha} fechaInicioInput
   * @description Representa la fecha de inicio predefinida para el formulario.
   * Por defecto, se inicializa con el valor de `FECHA_INGRESO`.
   */
  public fechaInicioInput: InputFecha = FECHA_INGRESO;
  /**
   * @property {Catalogo[]} entidadFederativa
   * @description Lista de entidades federativas cargadas desde un catálogo.
   */
  entidadFederativa: Catalogo[] = [];
  /**
   * @property {Catalogo[]} delegacionMunicipio
   * @description Lista de delegaciones o municipios cargados desde un catálogo.
   */
  delegacionMunicipio: Catalogo[] = [];
  /**
   * @property {Catalogo[]} colonia
   * @description Lista de colonias cargadas desde un catálogo.
   */
  colonia: Catalogo[] = [];
  /**
   * @property {TablaSeleccion} tablaSeleccion
   * @description Propiedad que representa la tabla de selección utilizada en el componente.
   */
  /**
   * @property {string} INPUT
   * @description Cadena de texto utilizada como entrada en el componente.
   *
   * Esta propiedad puede ser utilizada para almacenar valores temporales
   * o como referencia en diferentes métodos del componente.
   */
  INPUT: HTMLInputElement = document.createElement('input');

  /**
   * @property {TablaSeleccion} tablaSeleccion
   * @description Propiedad que representa la tabla de selección utilizada en el componente.
   */
  tablaSeleccion = TablaSeleccion;

  /**
   * @property {object} tablaDeDatos
   * @description Configuración de la tabla de datos utilizada en el componente.
   * Contiene las definiciones de las columnas (encabezados) y los datos que se mostrarán en la tabla.
   */
  tablaDeDatos = TABLA_DE_DATOS;

  /**
   * @property {AvisoTabla[]} filaSeleccionadaLista
   * @description Lista de filas seleccionadas en la tabla de avisos.
   * Contiene los datos de las filas seleccionadas por el usuario.
   */
  filaSeleccionadaLista: AvisoTabla[] = [];
  /**
   * @property {ElementRef} modalDomicilio
   * @description Referencia al elemento del modal de domicilio en la plantilla HTML.
   * Utilizado para abrir o manipular el modal de domicilio.
   */
  @ViewChild('modalDomicilio') modalDomicilio!: ElementRef;
  /**
   * @property {ElementRef} closeDomicilio
   * @description Referencia al botón o elemento que cierra el modal de domicilio.
   * Utilizado para cerrar el modal de manera programática.
   */
  @ViewChild('closeDomicilio') public closeDomicilio!: ElementRef;

  /**
   * @property {ElementRef} modalProceso
   * @description Referencia al elemento del modal de domicilio en la plantilla HTML.
   * Utilizado para abrir o manipular el modal de Proceso.
   */

  @ViewChild('modalProceso') modalProceso!: ElementRef;

  /**
   * @property {ElementRef} closeProceso
   * @description Referencia al botón o elemento que cierra el modal de Proceso.
   * Utilizado para cerrar el modal de manera programática.
   */
  @ViewChild('closeProceso') public closeProceso!: ElementRef;

  /**
   * @property {ElementRef} modalDesperdicio
   * @description Referencia al elemento del modal de domicilio en la plantilla HTML.
   * Utilizado para abrir o manipular el modal de Desperdicio.
   */

  @ViewChild('modalDesperdicio') modalDesperdicio!: ElementRef;

  /**
   * @property {ElementRef} closeDesperdicio
   * @description Referencia al botón o elemento que cierra el modal de Desperdicio.
   * Utilizado para cerrar el modal de manera programática.
   */
  @ViewChild('closeDesperdicio') public closeDesperdicio!: ElementRef;

  /**
   * @property {ElementRef} modalPedimento
   * @description Referencia al elemento del modal de domicilio en la plantilla HTML.
   * Utilizado para abrir o manipular el modal de Pedimento.
   */

  @ViewChild('modalPedimento') modalPedimento!: ElementRef;

  /**
   * @property {ElementRef} closePedimento
   * @description Referencia al botón o elemento que cierra el modal de Pedimento.
   * Utilizado para cerrar el modal de manera programática.
   */
  @ViewChild('closePedimento') public closePedimento!: ElementRef;

  /**
   * @property {FormGroup} domicilioFormulario
   * @description Formulario reactivo que contiene los datos relacionados con el domicilio.
   * Este formulario incluye campos como nombre comercial, entidad federativa, municipio, colonia, calle, número exterior, número interior, código postal, RFC, hora y fecha de destrucción.
   */
  domicilioFormulario!: FormGroup;

  /**
   * @property {object} tablaPedimento
   * @description Configuración de la tabla de Pedimento utilizada en el componente.
   * Contiene las definiciones de las columnas (encabezados) y los datos que se mostrarán en la tabla.
   */
  tablaPedimento = TABLA_PEDIMENTO;

  /**
   * @property {object} tablaProceso
   * @description Configuración de la tabla de Proceso utilizada en el componente.
   * Contiene las definiciones de las columnas (encabezados) y los datos que se mostrarán en la tabla.
   */
  tablaProceso = TABLA_PROCESO;

  /**
   * @property {object} tablaDesperdicio
   * @description Configuración de la tabla de desperdicios utilizada en el componente.
   * Contiene las definiciones de las columnas (encabezados) y los datos que se mostrarán en la tabla.
   */
  tablaDesperdicio = TABLA_DESPERDICIO;

  /**
   * @property {PedimentoTabla[]} filaSeleccionadaPedimentoLista
   * @description Lista de filas seleccionadas en la tabla de Pedimento.
   * Contiene los datos de las filas seleccionadas por el usuario en la tabla de Pedimento.
   */
  filaSeleccionadaPedimentoLista: PedimentoTabla[] = [];

  /**
   * @property {ProcesoTabla[]} filaSeleccionadaProcesoLista
   * @description Lista de filas seleccionadas en la tabla de Pedimento.
   * Contiene los datos de las filas seleccionadas por el usuario en la tabla de Pedimento.
   */
  filaSeleccionadaProcesoLista: ProcesoTabla[] = [];
  /**
   * @property {DesperdicioTabla[]} filaSeleccionadaDesperdicioLista
   * @description Lista de filas seleccionadas en la tabla de Desperdicio.
   * Contiene los datos de las filas seleccionadas por el usuario en la tabla de Desperdicio.
   */

  filaSeleccionadaDesperdicioLista: DesperdicioTabla[] = [];
  /**
   * @property {FormGroup} pedimentoFormulario
   * @description Formulario reactivo que contiene los datos relacionados con la pedimento.
   */
  pedimentoFormulario!: FormGroup;
  /**
   * @property {Catalogo[]} fraccionArancelaria
   * @description Lista de fracciones arancelarias cargadas desde un catálogo.
   * Utilizadas para seleccionar la fracción arancelaria correspondiente a la mercancía.
   */
  fraccionArancelaria: Catalogo[] = [];
  /**
   * @property {Catalogo[]} unidadMedida
   * @description Lista de unidades de medida cargadas desde un catálogo.
   * Utilizadas para seleccionar la unidad de medida correspondiente a la mercancía.
   */
  unidadMedida: Catalogo[] = [];
  /**
   * @property {any} TIPAVI
   * @description Constante que representa los tipos de aviso disponibles en el sistema.
   */
  TIPAVI = TIPAVI;
  /**
   * @property {any} TIPACA
   * @description Constante que representa los tipos de catálogo disponibles en el sistema.
   */
  TIPACA = TIPACA;
  /**
   * @property {any} TEXTOS
   * @description Constante que contiene textos o mensajes utilizados en el componente.
   */
  TEXTOS = TEXTOS;
  /**
   * Representa una nueva instancia de notificación asociada con el componente.
   * Esta propiedad se utiliza para gestionar y almacenar datos de notificaciones.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado de la consulta de datos.
   */
  consultaioState!: ConsultaioState;

  /**
   * @name DESCARGAR_LINK
   * @description
   * Referencia al elemento `<a>` usado para disparar la descarga programática.
   * Está marcada con el operador "!" porque la referencia se inicializa en tiempo de ejecución
   * (por ejemplo con @ViewChild).
   *
   * Uso típico: en el template se añade `<a #descargarLink style="display:none"></a>` y en
   * el componente se captura con `@ViewChild('descargarLink') DESCARGAR_LINK!: HTMLAnchorElement;`
   *
   * @type {HTMLAnchorElement}
   * @memberof DownloadExcelComponent
   */
  DESCARGAR_LINK!: HTMLAnchorElement;

  /**
   * Constructor del componente.
   *
   * @param {FormBuilder} fb - Constructor para crear formularios reactivos.
   * @param {Tramite32506Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite32506Query} tramiteQuery - Query para obtener el estado del trámite.
   * @param {avisoDestruccionService} avisoDestruccionService - Servicio para obtener datos relacionados con el aviso.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validar formularios.
   */
  constructor(
    public fb: FormBuilder,
    public store: Tramite32506Store,
    public tramiteQuery: Tramite32506Query,
    public avisoDestruccionService: AvisoDestruccionService,
    private validacionesService: ValidacionesFormularioService,
    public consultaioQuery: ConsultaioQuery
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   *
   * Configura los formularios, carga los datos iniciales y suscribe al estado del trámite.
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaioState = seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
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
      this.avisoFormulario.disable();
      this.domicilioFormulario.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.avisoFormulario.enable();
      this.domicilioFormulario.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * @method setValoresStore
   * @description Método para establecer valores en el store del trámite.
   * Obtiene el valor de un campo específico de un formulario y lo asigna al método correspondiente del store.
   *
   * @param {FormGroup} form - Formulario reactivo del cual se obtiene el valor.
   * @param {string} campo - Nombre del campo dentro del formulario.
   * @param {keyof Tramite32506Store} metodoNombre - Nombre del método del store donde se asignará el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32506Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }
  /**
   * @method cargarFraccionArancelaria
   * @description Método para cargar la lista de fracciones arancelarias desde el servicio `avisoDestruccionService`.
   * Los datos obtenidos se asignan a la propiedad `fraccionArancelaria`.
   *
   * @returns {void}
   */
  public cargarFraccionArancelaria(): void {
    this.avisoDestruccionService
      .obtenerFraccionArancelaria()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.fraccionArancelaria = datos.datos;
      });
  }
  /**
   * @method cargarUnidadMedida
   * @description Método para cargar la lista de unidades de medida desde el servicio `avisoDestruccionService`.
   * Los datos obtenidos se asignan a la propiedad `unidadMedida`.
   *
   * @returns {void}
   */
  public cargarUnidadMedida(): void {
    this.avisoDestruccionService
      .obtenerUnidadMedida()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.unidadMedida = datos.datos;
      });
  }
  /**
   * @method cargarFederativa
   * @description Método para cargar la lista de entidades federativas desde el servicio `avisoDestruccionService`.
   * Los datos obtenidos se asignan a la propiedad `entidadFederativa`.
   *
   * @returns {void}
   */
  public cargarFederativa(): void {
    this.avisoDestruccionService
      .obtenerFederativa()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.entidadFederativa = datos.datos;
      });
  }
  /**
   * @method cargarMunicipio
   * @description Método para cargar la lista de municipios desde el servicio `avisoDestruccionService`.
   * Los datos obtenidos se asignan a la propiedad `delegacionMunicipio`.
   *
   * @returns {void}
   */
  public cargarMunicipio(): void {
    this.avisoDestruccionService
      .obtenerMunicipio()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.delegacionMunicipio = datos.datos;
      });
  }
  /**
   * @method cargarColonias
   * @description Método para cargar la lista de colonias desde el servicio `avisoDestruccionService`.
   * Los datos obtenidos se asignan a la propiedad `colonia`.
   *
   * @returns {void}
   */
  public cargarColonias(): void {
    this.avisoDestruccionService
      .obtenerColonias()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.colonia = datos.datos;
      });
  }
  /**
   * @method cargarAvisoTabla
   * @description Método para cargar los datos de la tabla de avisos desde el servicio `avisoDestruccionService`.
   * Los datos obtenidos se asignan a la propiedad `tablaDeDatos.datos`.
   *
   * @returns {void}
   */
  public cargarAvisoTabla(): void {
    this.avisoDestruccionService
      .obtenerAvisoTabla()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: AvisoTablaDatos) => {
        this.tablaDeDatos.datos = datos.datos;
      });
  }

  /**
   * Carga los datos del proceso en la tabla utilizando el servicio `avisoDestruccionService`.
   *
   * Este método realiza una solicitud para obtener los datos del proceso y los asigna
   * a la propiedad `datos` de `tablaProceso`. Utiliza `takeUntil` para gestionar la
   * suscripción y evitar fugas de memoria.
   *
   * @remarks
   * Este método depende de `avisoDestruccionService` para obtener los datos y de
   * `destroyNotifier$` para manejar la finalización de la suscripción.
   *
   * @returns {void} No retorna ningún valor.
   */
  public cargarProcesoTabla(): void {
    this.avisoDestruccionService
      .obtenerProcesoTabla()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: ProcesoTablaDatos) => {
        this.tablaProceso.datos = datos.datos;
      });
  }

  /**
   * @method cargarDesperdicioTabla
   * @description Método para cargar los datos de la tabla de desperdicios desde el servicio `avisoDestruccionService`.
   *
   * - Realiza una solicitud para obtener los datos de desperdicios y los asigna a la propiedad `tablaDesperdicio.datos`.
   * - Utiliza `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   *
   * @returns {void}
   */
  public cargarDesperdicioTabla(): void {
    this.avisoDestruccionService
      .obtenerDesperdicioTabla()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: DesperdicioTablaDatos) => {
        this.tablaDesperdicio.datos = datos.datos;
      });
  }

  /**
   * @method cargarPedimentoTabla
   * @description Este método se encarga de cargar los datos de la tabla de pedimentos
   * obtenidos desde el servicio `avisoDestruccionService` y asignarlos a la propiedad
   * `datos` de la tabla de pedimentos.
   *
   * @returns {void} No retorna ningún valor.
   *
   * @example
   * // Ejemplo de uso:
   * this.cargarPedimentoTabla();
   *
   * @remarks
   * Este método utiliza el operador `takeUntil` para gestionar la suscripción y evitar
   * fugas de memoria. Los datos obtenidos deben cumplir con la estructura definida en
   * `PedimentoTablaDatos`.
   */
  public cargarPedimentoTabla(): void {
    this.avisoDestruccionService
      .obtenerPedimentoTabla()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: PedimentoTablaDatos) => {
        this.tablaPedimento.datos = datos.datos;
      });
  }

  /**
   * @method inicializarFormulario
   * @description Método para inicializar el formulario reactivo `avisoFormulario` con los datos del estado actual del trámite.
   *
   * - Agrupa diferentes secciones del formulario como `adaceFormulario`, `datosEmpresa`, `datosAviso`, `direccionOrigen`, entre otros.
   * - Aplica validaciones específicas a cada campo, como longitud máxima, patrones y campos obligatorios.
   * - Llama al método `verificaTipoAviso` para realizar validaciones adicionales según el tipo de aviso seleccionado.
   *
   * @returns {void}
   */
  inicializarFormulario(): void {
    this.avisoFormulario = this.fb.group({
      adaceFormulario: this.fb.group({
        adace: [
          { value: this.tramiteState?.avisoFormulario?.adace, disabled: true },
          [Validators.required],
        ],
      }),
      datosEmpresa: this.fb.group({
        valorProgramaImmex: [
          this.tramiteState?.avisoFormulario?.valorProgramaImmex,
          [
            Validators.required,
            Validators.maxLength(9),
            Validators.pattern(REGEX_IMPORTE_PAGO),
          ],
        ],
        valorAnioProgramaImmex: [
          this.tramiteState?.avisoFormulario?.valorAnioProgramaImmex,
          [
            Validators.required,
            Validators.maxLength(4),
            Validators.pattern(REGEX_IMPORTE_PAGO),
          ],
        ],
      }),
      datosAviso: this.fb.group({
        tipoAviso: [
          this.tramiteState?.avisoFormulario?.tipoAviso,
          [Validators.required],
        ],
        justificacion: [
          {
            value: this.tramiteState?.avisoFormulario?.justificacion,
            disabled: true,
          },
          [Validators.required, Validators.maxLength(250)],
        ],
        periodicidadMensualDestruccion: [
          {
            value:
              this.tramiteState?.avisoFormulario
                ?.periodicidadMensualDestruccion,
            disabled: true,
          },
          [Validators.required, Validators.maxLength(2)],
        ],
        fechaTranslado: [
          {
            value: this.tramiteState?.avisoFormulario?.fechaTranslado,
            disabled: true,
          },
          Validators.required,
        ],
      }),
      direccionOrigen: this.fb.group({
        nombreComercial: [
          this.tramiteState?.avisoFormulario?.nombreComercial,
          [Validators.maxLength(250)],
        ],
        claveEntidadFederativa: [
          this.tramiteState?.avisoFormulario?.claveEntidadFederativa,
          [Validators.required],
        ],
        claveDelegacionMunicipio: [
          this.tramiteState?.avisoFormulario?.claveDelegacionMunicipio,
          [Validators.required],
        ],
        claveColonia: [
          this.tramiteState?.avisoFormulario?.claveColonia,
          [Validators.required],
        ],
        calle: [
          this.tramiteState?.avisoFormulario?.calle,
          [Validators.required, Validators.maxLength(250)],
        ],
        numeroExterior: [
          this.tramiteState?.avisoFormulario?.numeroExterior,
          [
            Validators.required,
            Validators.maxLength(15),
            Validators.pattern(REGEX_ALFANUMERICO_CON_ESPACIOS),
          ],
        ],
        numeroInterior: [
          this.tramiteState?.avisoFormulario?.numeroInterior,
          [
            Validators.maxLength(15),
            Validators.pattern(REGEX_ALFANUMERICO_CON_ESPACIOS),
          ],
        ],
        codigoPostal: [
          this.tramiteState?.avisoFormulario?.codigoPostal,
          [
            Validators.required,
            Validators.maxLength(5),
            Validators.pattern(REGEX_SOLO_NUMEROS),
          ],
        ],
      }),
      tipoCarga: [
        this.tramiteState?.avisoFormulario?.tipoCarga,
        [Validators.required],
      ],
      archivoMasivo: [null],
    });
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
          if (!this.consultaioState.readonly && this.consultaioState.update) {
            this.tablaDeDatos.datos = [];
            this.tablaDeDatos.datos = [
              ...this.tablaDeDatos.datos,
              { ...this.tramiteState.destruccionMercanciasTabla[0] },
            ];
          }
          this.avisoFormulario.patchValue({
            adaceFormulario: {
              adace: this.tramiteState.avisoFormulario.adace,
            },
            datosEmpresa: {
              valorProgramaImmex:
                this.tramiteState.avisoFormulario.valorProgramaImmex,
              valorAnioProgramaImmex:
                this.tramiteState.avisoFormulario.valorAnioProgramaImmex,
            },
            datosAviso: {
              tipoAviso: this.tramiteState.avisoFormulario.tipoAviso,
              justificacion: this.tramiteState.avisoFormulario.justificacion,
              periodicidadMensualDestruccion:
                this.tramiteState.avisoFormulario
                  .periodicidadMensualDestruccion,
              fechaTranslado: this.tramiteState.avisoFormulario.fechaTranslado,
            },
            direccionOrigen: {
              nombreComercial:
                this.tramiteState.avisoFormulario.nombreComercial,
              claveEntidadFederativa:
                this.tramiteState.avisoFormulario.claveEntidadFederativa,
              claveDelegacionMunicipio:
                this.tramiteState.avisoFormulario.claveDelegacionMunicipio,
              claveColonia: this.tramiteState.avisoFormulario.claveColonia,
              calle: this.tramiteState.avisoFormulario.calle,
              numeroExterior: this.tramiteState.avisoFormulario.numeroExterior,
              numeroInterior: this.tramiteState.avisoFormulario.numeroInterior,
              codigoPostal: this.tramiteState.avisoFormulario.codigoPostal,
            },
            tipoCarga: this.tramiteState.avisoFormulario.tipoCarga,
          });
        })
      )
      .subscribe();
    this.inicializarDomicilioFormulario();
    this.cargarFederativa();
    this.cargarMunicipio();
    this.cargarColonias();
    this.inicializarPedimentoFormulario();
    this.inicializarProcesoFormulario();
    this.inicializarDesperdicioFormulario();
    this.cargarFraccionArancelaria();
    this.cargarUnidadMedida();
  }
  /**
   * @method adaceFormulario
   * @description Getter para obtener el grupo de controles `adaceFormulario` del formulario `avisoFormulario`.
   *
   * @returns {FormGroup} El grupo de controles `adaceFormulario`.
   */
  get adaceFormulario(): FormGroup {
    return this.avisoFormulario.get('adaceFormulario') as FormGroup;
  }
  /**
   * @method datosEmpresa
   * @description Getter para obtener el grupo de controles `datosEmpresa` del formulario `avisoFormulario`.
   *
   * @returns {FormGroup} El grupo de controles `datosEmpresa`.
   */
  get datosEmpresa(): FormGroup {
    return this.avisoFormulario.get('datosEmpresa') as FormGroup;
  }
  /**
   * @method datosAviso
   * @description Getter para obtener el grupo de controles `datosAviso` del formulario `avisoFormulario`.
   *
   * @returns {FormGroup} El grupo de controles `datosAviso`.
   */
  get datosAviso(): FormGroup {
    return this.avisoFormulario.get('datosAviso') as FormGroup;
  }
  /**
   * @method direccionOrigen
   * @description Getter para obtener el grupo de controles `direccionOrigen` del formulario `avisoFormulario`.
   *
   * @returns {FormGroup} El grupo de controles `direccionOrigen`.
   */
  get direccionOrigen(): FormGroup {
    return this.avisoFormulario.get('direccionOrigen') as FormGroup;
  }
  /**
   * @method inicializarDomicilioFormulario
   * @description Método para inicializar el formulario reactivo `domicilioFormulario` con los datos del estado actual del trámite.
   *
   * - Agrupa los campos relacionados con el domicilio, como `nombreComercial`, `claveEntidadFederativa`, `claveDelegacionMunicipio`, entre otros.
   * - Aplica validaciones específicas a cada campo, como longitud máxima, patrones y campos obligatorios.
   *
   * @returns {void}
   */
  inicializarDomicilioFormulario(): void {
    this.domicilioFormulario = this.fb.group({
      nombreComercial: [
        this.tramiteState?.domicilioFormulario?.nombreComercial,
        [Validators.maxLength(250)],
      ],
      claveEntidadFederativa: [
        this.tramiteState?.domicilioFormulario?.claveEntidadFederativa,
        [Validators.required],
      ],
      claveDelegacionMunicipio: [
        this.tramiteState?.domicilioFormulario?.claveDelegacionMunicipio,
        [Validators.required],
      ],
      claveColonia: [
        this.tramiteState?.domicilioFormulario?.claveColonia,
        [Validators.required],
      ],
      calle: [
        this.tramiteState?.domicilioFormulario?.calle,
        [Validators.required, Validators.maxLength(250)],
      ],
      numeroExterior: [
        this.tramiteState?.domicilioFormulario?.numeroExterior,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(REGEX_IMPORTE_PAGO),
        ],
      ],
      numeroInterior: [
        this.tramiteState?.domicilioFormulario?.numeroInterior,
        [Validators.maxLength(15), Validators.pattern(REGEX_IMPORTE_PAGO)],
      ],
      codigoPostal: [
        this.tramiteState?.domicilioFormulario?.codigoPostal,
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern(REGEX_SOLO_NUMEROS),
        ],
      ],
      rfc: [this.tramiteState?.domicilioFormulario?.rfc, [Validators.required]],
      horaDestruccion: [
        this.tramiteState?.avisoFormulario?.horaDestruccion,
        [Validators.required],
      ],
      fechaDestruccion: [
        this.tramiteState?.avisoFormulario?.fechaDestruccion,
        [Validators.required],
      ],
    });
  }
  /**
   * @method inicializarPedimentoFormulario
   * @description Método para inicializar el formulario reactivo `pedimentoFormulario` con los datos del estado actual del trámite.
   *
   * - Agrupa los campos relacionados con la mercancía, como `claveFraccionArancelaria`, `nico`, `cantidad`, entre otros.
   * - Aplica validaciones específicas a cada campo, como longitud máxima, patrones y campos obligatorios.
   *
   * @returns {void}
   */
  inicializarPedimentoFormulario(): void {
    this.pedimentoFormulario = this.fb.group({
      patenteAutorizacion: [
        this.tramiteState?.pedimentoFormulario?.patenteAutorizacion,
        [Validators.required, Validators.maxLength(4)],
      ],
      pedimento: [
        this.tramiteState?.pedimentoFormulario?.pedimento,
        [Validators.required, Validators.maxLength(7)],
      ],
      claveAduanaPedimento: [
        this.tramiteState?.pedimentoFormulario?.claveAduanaPedimento,
        [Validators.required],
      ],
      claveFraccionArancelariaPedimento: [
        this.tramiteState?.pedimentoFormulario
          ?.claveFraccionArancelariaPedimento,
        Validators.required,
      ],
      nicoPedimento: [
        this.tramiteState?.pedimentoFormulario?.nicoPedimento,
        [Validators.required, Validators.maxLength(2)],
      ],
      cantidadPedimento: [
        this.tramiteState?.pedimentoFormulario?.cantidadPedimento,
        [Validators.required, Validators.maxLength(15)],
      ],
      claveUnidadMedidaPedimento: [
        this.tramiteState?.pedimentoFormulario?.claveUnidadMedidaPedimento,
        [Validators.required],
      ],
    });
  }

  /**
   * @method inicializarProcesoFormulario
   * @description Método para inicializar el formulario reactivo `procesoFormulario` con los datos del estado actual del trámite.
   *
   * - Agrupa los campos relacionados con el proceso destructivo, como `descripcionProcesoDestruccion`.
   * - Aplica validaciones específicas a cada campo, como campos obligatorios.
   *
   * @returns {void}
   */
  inicializarProcesoFormulario(): void {
    this.procesoFormulario = this.fb.group({
      descripcionProcesoDestruccion: [
        this.tramiteState?.procesoFormulario?.descripcionProcesoDestruccion,
        Validators.required,
      ],
    });
  }

  /**
   * @method inicializarDesperdicioFormulario
   * @description Método para inicializar el formulario reactivo `desperdicioFormulario` con los datos del estado actual del trámite.
   *
   * - Agrupa los campos relacionados con los desperdicios, como `descripcionDesperdicio`, `cantidadDesp`, `claveUnidadMedidaDesp`, entre otros.
   * - Aplica validaciones específicas a cada campo, como longitud máxima, patrones y campos obligatorios.
   *
   * @returns {void}
   */
  inicializarDesperdicioFormulario(): void {
    this.desperdicioFormulario = this.fb.group({
      descripcionDesperdicio: [
        this.tramiteState?.desperdicioFormulario?.descripcionDesperdicio,
        Validators.required,
      ],
      cantidadDesp: [
        this.tramiteState?.desperdicioFormulario?.cantidadDesp,
        [Validators.required, Validators.maxLength(15)],
      ],
      claveUnidadMedidaDesp: [
        this.tramiteState?.desperdicioFormulario?.claveUnidadMedidaDesp,
        [Validators.required],
      ],
      porcentaje: [
        this.tramiteState?.desperdicioFormulario?.porcentaje,
        [Validators.required, Validators.maxLength(3)],
      ],
      descripcionMercancia: [
        this.tramiteState?.desperdicioFormulario?.descripcionMercancia,
        [Validators.required],
      ],
      circunstanciaHechos: [
        this.tramiteState?.desperdicioFormulario?.circunstanciaHechos,
        [Validators.required],
      ],
    });
  }

  /**
   * @method isValid
   * @description Método para verificar si un campo específico de un formulario es válido.
   *
   * - Utiliza el servicio `validacionesService` para realizar la validación.
   *
   * @param {FormGroup} form - Formulario reactivo que contiene el campo a validar.
   * @param {string} field - Nombre del campo a validar.
   * @returns {boolean | null} Retorna `true` si el campo es válido, `false` si no lo es, o `null` si no se puede determinar.
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }
  /**
   * @method cambioFechaIngreso
   * @description Método para actualizar la fecha de traslado en el formulario y en el store.
   *
   * - Establece el nuevo valor en el campo `fechaTranslado` del formulario `datosAviso`.
   * - Marca el campo como no modificado y actualiza el store con el nuevo valor.
   *
   * @param {string} nuevo_valor - Nuevo valor de la fecha de traslado.
   * @returns {void}
   */
  public cambioFechaIngreso(nuevo_valor: string): void {
    this.datosAviso.get('fechaTranslado')?.setValue(nuevo_valor);
    this.datosAviso.get('fechaTranslado')?.markAsUntouched();
    this.store.setAvisoFormularioFechaTranslado(nuevo_valor);
  }
  /**
   * @method filaSeleccionada
   * @description Método para manejar las filas seleccionadas en la tabla de avisos.
   *
   * - Actualiza la propiedad `filaSeleccionadaLista` con las filas seleccionadas.
   *
   * @param {AvisoTabla[]} evento - Lista de filas seleccionadas en la tabla de avisos.
   * @returns {void}
   */
  filaSeleccionada(evento: AvisoTabla[]): void {
    this.filaSeleccionadaLista = evento;
  }

  /**
   * Método para modificar los datos del domicilio.
   *
   * Este método se encarga de actualizar el formulario de domicilio con los datos
   * de la fila seleccionada en la tabla de avisos.
   */
  modificarDomicilio(): void {
    if (this.filaSeleccionadaLista.length > 0) {
      this.domicilioFormulario.patchValue({
        nombreComercial: this.filaSeleccionadaLista?.[0]?.nombreComercial,
        claveEntidadFederativa:
          this.filaSeleccionadaLista?.[0]?.entidadFederativa,
        claveDelegacionMunicipio:
          this.filaSeleccionadaLista?.[0]?.alcaldioOMuncipio,
        claveColonia: this.filaSeleccionadaLista?.[0]?.colonia,
        calle: this.filaSeleccionadaLista?.[0]?.calle,
        numeroExterior: this.filaSeleccionadaLista?.[0]?.numeroExterior,
        numeroInterior: this.filaSeleccionadaLista?.[0]?.numeroInterior,
        codigoPostal: this.filaSeleccionadaLista?.[0]?.codigoPostal,
        rfc: this.filaSeleccionadaLista?.[0]?.rfc,
        horaDestruccion: this.filaSeleccionadaLista?.[0]?.horaDestruccion,
        fechaDestruccion: this.filaSeleccionadaLista?.[0]?.fechaDestruccion,
      });
      const MODAL_INSTANCE = new Modal(this.modalDomicilio.nativeElement);
      MODAL_INSTANCE.show();
    }
  }
  /**
   * @method filaSeleccionadaPedimento
   * @description Método para manejar las filas seleccionadas en la tabla de Pedimento.
   *
   * - Actualiza la propiedad `filaSeleccionadaPedimentoLista` con las filas seleccionadas.
   *
   * @param {PedimentoTabla[]} evento - Lista de filas seleccionadas en la tabla de Pedimento.
   * @returns {void}
   */
  filaSeleccionadaPedimento(evento: PedimentoTabla[]): void {
    this.filaSeleccionadaPedimentoLista = evento;
  }

  /**
   * @method filaSeleccionaProceso
   * @description Actualiza la lista de filas seleccionadas en el proceso basado en el evento proporcionado.
   * @param {ProcesoTabla[]} evento - Lista de objetos `ProcesoTabla` que representan las filas seleccionadas.
   * @returns {void} Este método no retorna ningún valor.
   */
  filaSeleccionaProceso(evento: ProcesoTabla[]): void {
    this.filaSeleccionadaProcesoLista = evento;
  }

  /**
   * @description Maneja el evento de selección de filas en la tabla de desperdicios.
   * Actualiza la lista de filas seleccionadas con los datos proporcionados.
   *
   * @param evento - Arreglo de objetos de tipo `DesperdicioTabla` que representan las filas seleccionadas.
   */
  filaSeleccionaDesperdicio(evento: DesperdicioTabla[]): void {
    this.filaSeleccionadaDesperdicioLista = evento;
  }

  /**
   * @method eliminarPedimento
   * @description Método para eliminar las filas seleccionadas de la tabla de Pedimento.
   *
   * - Filtra los datos de la tabla para excluir las filas seleccionadas.
   * - Limpia la lista de filas seleccionadas.
   *
   * @returns {void}
   */
  eliminarPedimento(): void {
    this.tablaPedimento.datos = this.tablaPedimento.datos.filter(
      (ele) => !this.filaSeleccionadaPedimentoLista.includes(ele)
    );
    this.filaSeleccionadaPedimentoLista = [];
  }
  /**
   * @method eliminarDomicilio
   * @description Método para eliminar las filas seleccionadas de la tabla de domicilios.
   *
   * - Filtra los datos de la tabla para excluir las filas seleccionadas.
   * - Limpia la lista de filas seleccionadas.
   *
   * @returns {void}
   */
  eliminarDomicilio(): void {
    this.tablaDeDatos.datos = this.tablaDeDatos.datos.filter(
      (ele) => !this.filaSeleccionadaLista.includes(ele)
    );
    this.filaSeleccionadaLista = [];
  }

  /**
   * @method eliminarProceso
   * @description Método para eliminar las filas seleccionadas de la tabla de Proceso.
   *
   * - Filtra los datos de la tabla para excluir las filas seleccionadas.
   * - Limpia la lista de filas seleccionadas.
   *
   * @returns {void}
   */
  eliminarProceso(): void {
    this.tablaProceso.datos = this.tablaProceso.datos.filter(
      (ele) => !this.filaSeleccionadaProcesoLista.includes(ele)
    );
    this.filaSeleccionadaProcesoLista = [];
  }

  /**
   * Elimina los elementos seleccionados de la tabla de desperdicios.
   *
   * Este método filtra los datos de la tabla de desperdicio, eliminando
   * aquellos elementos que están presentes en la lista de filas seleccionadas.
   * Después de realizar la eliminación, la lista de filas seleccionadas se vacía.
   *
   * @returns {void} No retorna ningún valor.
   */
  eliminarDesperdicio(): void {
    this.tablaDesperdicio.datos = this.tablaDesperdicio.datos.filter(
      (ele) => !this.filaSeleccionadaDesperdicioLista.includes(ele)
    );
    this.filaSeleccionadaDesperdicioLista = [];
  }

  /**
   * @method verificaTipoAviso
   * @description Método para verificar el tipo de aviso seleccionado en el formulario.
   *
   * - Obtiene el valor del tipo de aviso desde el formulario y lo actualiza en el store.
   * - Habilita o deshabilita los campos `idTransaccion` y `motivoProrroga` según el tipo de aviso seleccionado.
   *
   * @returns {void}
   */
  verificaTipoAviso(): void {
    const TIPO_AVISO = this.avisoFormulario.get('datosAviso.tipoAviso')?.value;
    this.store.setAvisoFormularioTipoAviso(TIPO_AVISO);
    this.avisoFormulario.get('datosAviso.justificacion')?.enable();
    this.avisoFormulario
      .get('datosAviso.periodicidadMensualDestruccion')
      ?.enable();
    if (TIPO_AVISO === TIPAVI[0].value) {
      this.avisoFormulario.get('datosAviso.justificacion')?.disable();
      this.avisoFormulario
        .get('datosAviso.periodicidadMensualDestruccion')
        ?.disable();
    }
    if (TIPO_AVISO === TIPAVI[1].value) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje:
          '¿Desea cambiar el tipo de destrucción que se reporta? Si acepta se eliminarán todos los registros.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
    }
  }

  /**
   * @method abiertoDomicilio
   * @description Método para abrir el modal de domicilio.
   *
   * - Utiliza la referencia al modal de domicilio para mostrarlo en la interfaz.
   *
   * @returns {void}
   */
  abiertoDomicilio(): void {
    const TIPO_AVISO = this.avisoFormulario.get('datosAviso.tipoAviso')?.value;
    if (!TIPO_AVISO) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje:
          'Debe seleccionar un tipo de destrucción que se reporta para poder agregar información.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else {
      if (this.modalDomicilio) {
        if (this.esFormularioSoloLectura) {
          this.pedimentoFormulario.disable();
        } else if (!this.esFormularioSoloLectura) {
          this.pedimentoFormulario.enable();
        } else {
          // No se requiere ninguna acción en el formulario
        }
        this.domicilioFormulario.reset();
        const MODAL_INSTANCE = new Modal(this.modalDomicilio.nativeElement);
        MODAL_INSTANCE.show();
      }
    }
  }

  /**
   * @method abiertoProceso
   * @description Método para abrir el modal de proceso.
   *
   * - Utiliza la referencia al modal de proceso para mostrarlo en la interfaz.
   *
   * @returns {void}
   */
  abiertoProceso(): void {
    if (this.modalProceso) {
      const MODAL_INSTANCE = new Modal(this.modalProceso.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * @description Abre un modal para mostrar información relacionada con desperdicios.
   * Si el elemento `modalDesperdicio` está definido, se crea una instancia de `Modal`
   * utilizando el elemento nativo y se muestra el modal.
   *
   * @method
   * @memberof AvisoComponent
   * @returns {void} No retorna ningún valor.
   */
  abiertoDesperdicio(): void {
    if (this.modalDesperdicio) {
      const MODAL_INSTANCE = new Modal(this.modalDesperdicio.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * @method abiertoPedimento
   * @description Método para abrir el modal de pedimento.
   *
   * - Utiliza la referencia al modal de pedimento para mostrarlo en la interfaz.
   *
   * @returns {void}
   */
  abiertoPedimento(): void {
    if (this.modalPedimento) {
      const MODAL_INSTANCE = new Modal(this.modalPedimento.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * @method agregarDomicilio
   * @description Método para agregar domicilios a la tabla de avisos.
   *
   * - Carga los datos de la tabla de avisos y cierra el modal de domicilio.
   *
   * @returns {void}
   */
  agregarDomicilio(): void {
    const VALORES = this.domicilioFormulario.value;
    const DATOS = {
      id: this.filaSeleccionadaLista?.[0]?.id
        ? this.filaSeleccionadaLista?.[0]?.id
        : (this.tablaDeDatos?.datos?.length || 0) + 1,
      nombreComercial: VALORES.nombreComercial,
      entidadFederativa: VALORES.claveEntidadFederativa,
      alcaldioOMuncipio: VALORES.claveDelegacionMunicipio,
      colonia: VALORES.claveColonia,
      calle: VALORES.calle,
      numeroExterior: VALORES.numeroExterior,
      numeroInterior: VALORES.numeroInterior,
      codigoPostal: VALORES.codigoPostal,
      rfc: '',
      horaDestruccion: VALORES?.horaDestruccion,
      fechaDestruccion: '',
    };
    if (this.filaSeleccionadaLista.length > 0) {
      DATOS.id = this.filaSeleccionadaLista[0].id;

      this.tablaDeDatos = {
        ...this.tablaDeDatos,
        datos: this.tablaDeDatos.datos.map((item) =>
          item.id === DATOS.id ? { ...DATOS } : item
        ),
      };
    } else {
      this.tablaDeDatos = {
        ...this.tablaDeDatos,
        datos: [...(this.tablaDeDatos?.datos || []), { ...DATOS }],
      };
    }
    this.domicilioFormulario.reset();
    this.filaSeleccionadaLista = [];
    this.closeDomicilio.nativeElement.click();
    this.abrirModal();
  }

  /**
   * Agrega un nuevo proceso a la tabla y gestiona el cierre del modal actual
   * y la apertura de un nuevo modal.
   *
   * @remarks
   * Este método realiza las siguientes acciones:
   * 1. Llama al método `cargarProcesoTabla` para agregar el proceso a la tabla.
   * 2. Simula un clic en el elemento `closeProceso` para cerrar el modal actual.
   * 3. Llama al método `abrirModal` para abrir un nuevo modal.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  agregarProceso(): void {
    this.cargarProcesoTabla();
    this.closeProceso.nativeElement.click();
    this.abrirModal();
  }

  /**
   * @method agregarDesperdicio
   * @description Método para agregar desperdicios a la tabla de desperdicios.
   *
   * - Llama al método `cargarDesperdicioTabla` para cargar los datos de desperdicios.
   * - Cierra el modal de desperdicio utilizando la referencia `closeDesperdicio`.
   * - Abre un modal de notificación para confirmar que el registro fue agregado correctamente.
   *
   * @returns {void}
   */
  agregarDesperdicio(): void {
    this.cargarDesperdicioTabla();
    this.closeDesperdicio.nativeElement.click();
    this.abrirModal();
  }

  /**
   * Agrega un pedimento a la tabla y realiza las acciones necesarias para cerrar el modal actual
   * y abrir un nuevo modal.
   *
   * @remarks
   * Este método realiza las siguientes acciones:
   * 1. Llama al método `cargarPedimentoTabla` para cargar el pedimento en la tabla.
   * 2. Simula un clic en el elemento `closePedimento` para cerrar el modal actual.
   * 3. Llama al método `abrirModal` para abrir un nuevo modal.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  agregarPedimento(): void {
    this.cargarPedimentoTabla();
    this.closePedimento.nativeElement.click();
    this.abrirModal();
  }

  /**
   * @method sanitizeAlphanumeric
   * @description Método para limpiar un campo de formulario, eliminando caracteres no alfanuméricos.
   *
   * - Reemplaza caracteres no permitidos en el valor del campo y actualiza el formulario.
   *
   * @param {FormGroup} form - Formulario reactivo que contiene el campo a limpiar.
   * @param {string} control - Nombre del control dentro del formulario.
   * @param {Event} event - Evento que contiene el valor ingresado por el usuario.
   * @returns {void}
   */
  sanitizeAlphanumeric(form: FormGroup, control: string, event: Event): void {
    this.INPUT = event?.target as HTMLInputElement;
    const REEMPLAZAR = this.INPUT?.value.replace(REGEX_REEMPLAZAR, '');
    form.get(control)?.setValue(REEMPLAZAR, { emitEvent: false });
  }
  /**
   * @method sanitizeAlphanumericWithSpace
   * @description Método para limpiar un campo de formulario, eliminando caracteres no alfanuméricos excepto espacios.
   *
   * - Reemplaza caracteres no permitidos en el valor del campo y actualiza el formulario.
   *
   * @param {FormGroup} form - Formulario reactivo que contiene el campo a limpiar.
   * @param {string} control - Nombre del control dentro del formulario.
   * @param {Event} event - Evento que contiene el valor ingresado por el usuario.
   * @returns {void}
   */
  sanitizeAlphanumericWithSpace(
    form: FormGroup,
    control: string,
    event: Event
  ): void {
    this.INPUT = event?.target as HTMLInputElement;
    const REEMPLAZAR = this.INPUT?.value.replace(
      REGEX_ALFANUMERICO_CON_ESPACIOS_REEMPLAZAR,
      ''
    );
    form.get(control)?.setValue(REEMPLAZAR, { emitEvent: false });
  }
  /**
   * @method sanitizeNumeric
   * @description Método para limpiar un campo de formulario, eliminando caracteres no numéricos.
   *
   * - Reemplaza caracteres no permitidos en el valor del campo y actualiza el formulario.
   *
   * @param {FormGroup} form - Formulario reactivo que contiene el campo a limpiar.
   * @param {string} control - Nombre del control dentro del formulario.
   * @param {Event} event - Evento que contiene el valor ingresado por el usuario.
   * @returns {void}
   */
  sanitizeNumeric(form: FormGroup, control: string, event: Event): void {
    this.INPUT = event?.target as HTMLInputElement;
    const REEMPLAZAR = this.INPUT?.value.replace(REGEX_NUMEROS, '');
    form.get(control)?.setValue(REEMPLAZAR, { emitEvent: false });
  }
  /**
   * @method limpiar
   * @description Método para limpiar el campo de archivo masivo en el formulario.
   *
   * - Limpia el valor del input de archivo y del control correspondiente en el formulario.
   *
   * @param {HTMLInputElement} fileInput - Elemento de entrada de archivo que se va a limpiar.
   * @returns {void}
   */
  limpiar(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.avisoFormulario.get('archivoMasivo')?.setValue('');
  }
  /**
   * @method onArchivoMasivoSeleccionado
   * @description Método para manejar la selección de un archivo masivo.
   *
   * - Obtiene el archivo seleccionado y lo asigna al control correspondiente en el formulario.
   *
   * @param {Event} event - Evento que contiene el archivo seleccionado.
   * @returns {void}
   */
  onArchivoMasivoSeleccionado(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    if (INPUT?.files?.length) {
      const FILE = INPUT.files[0];
      this.avisoFormulario.get('archivoMasivo')?.setValue(FILE);
    }
  }
  /**
   * @method abrirModal
   * @description Método para abrir un modal de notificación.
   *
   * Este método configura una nueva notificación con los siguientes parámetros:
   * - `tipoNotificacion`: Tipo de notificación (en este caso, "alerta").
   * - `categoria`: Categoría de la notificación (en este caso, "peligro").
   * - `modo`: Modo de la notificación (en este caso, "acción").
   * - `titulo`: Título de la notificación (en este caso, vacío).
   * - `mensaje`: Mensaje de la notificación (en este caso, "El registro fue agregado correctamente.").
   * - `cerrar`: Indica si la notificación se puede cerrar manualmente (en este caso, `false`).
   * - `tiempoDeEspera`: Tiempo en milisegundos antes de que la notificación desaparezca automáticamente (en este caso, 2000 ms).
   * - `txtBtnAceptar`: Texto del botón de aceptación (en este caso, "Aceptar").
   * - `txtBtnCancelar`: Texto del botón de cancelación (en este caso, vacío).
   *
   * @example
   * // Llamar al método para abrir el modal de notificación
   * this.abrirModal();
   */
  public abrirModal(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'El registro fue agregado correctamente.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * @method descargarDatosCapturados
   * @description
   * Método que dispara la descarga de un archivo Excel ubicado en la carpeta `assets/pdf/`.
   *
   * Pasos que realiza:
   *  1. Crea dinámicamente un elemento `<a>`.
   *  2. Asigna la ruta al archivo Excel dentro de `assets`.
   *  3. Define el nombre con el que se descargará el archivo.
   *  4. Simula el clic en el enlace para iniciar la descarga automática.
   */
  descargarDatosCapturados(): void {
    this.DESCARGAR_LINK = document.createElement('a');
    this.DESCARGAR_LINK.href = 'assets/pdf/datosMercanciaDesperdicio.xlsx';
    this.DESCARGAR_LINK.download = 'datosMercanciaDesperdicio.xlsx';
    this.DESCARGAR_LINK.click();
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   *
   * - Completa el `Subject` `destroyNotifier$` para cancelar todas las suscripciones activas y evitar fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
