import {
  AICM,
  AIFA,
  ALERTA_DE_MANIFESTO_Y_DECLARACIONES,
  ALERTA_OPCIONS,
  DESHABILITADA_EN_INIT,
  DESHABILITADA_ESTADO_EN_INIT,
  ENABLE_FIELDS,
  ESCONDER_LICENCIA,
  HABITO_REGIMEN,
  MENSAJE_EMERGENTE_DE_CONFIRMACION,
  MENSAJE_SIN_FILA_SELECCIONADA,
  MODIFICADOR_MENSAJE_NO_FILA_SELECCIONADA,
  MOSTRAR_NOTIFICACION,
  NUMERO_TRAMITE,
  PROCEDIMIENTOS_DESHABILITAR_REPRESENTANTE,
  PROCEDIMIENTOS_NO_PARA_ELEMENTO_CALLE,
  PROCEDIMIENTOS_NO_PARA_ELEMENTO_COLAPSABLE,
  PROCEDIMIENTOS_NO_PARA_ELEMENTO_CORREO_ELECTRONIC,
  PROCEDIMIENTOS_NO_PARA_ELEMENTO_REGIMEN_Y_ADUNADEENTRADAS,
  PROCEDIMIENTOS_NO_PARA_ELEMENTO_RFC_DEL_SANITARIO,
  PROCEDIMIENTOS_NO_PARA_MANIFIESTOS_Y_DECLARACIONES,
  PROCEDIMIENTOS_PARA_CORREO_ELECTRONICO_EN_MISMA_FILA,
  PROCEDIMIENTOS_PARA_DESHABILITAR_APELLIDO_MATERNO,
  PROCEDIMIENTOS_PARA_DESHABILITAR_APELLIDO_PATERNO,
  PROCEDIMIENTOS_PARA_DESHABILITAR_NOMBRE_RAZON_SOCIAL,
  PROCEDIMIENTOS_PARA_MANIFIESTOS_Y_DECLARACIONES,
  PROCEDIMIENTOS_PARA_DESHABILITAR_RFC,
  RADIO_NO_SI,
  REPRESENTANTE_LEGAL,
  REPRESENTANTE_LEGAL_EN_INIT,
  REQUERIDO_TELEFONO,
  SIN_ACCION_AL_INICIAR,
  TEXTO_MANIFESTO_Y_DECLARACIONES
} from '../../../constantes/shared2606/datos-solicitud.enum';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  AlertComponent,
  CatalogoSelectComponent,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  REGEX_CORREO_ELECTRONICO,
  REGEX_IMPORTE_PAGO,
  REGEX_RFC,
  REGEX_SOLO_DIGITOS,
  REGEX_SOLO_NUMEROS,
  RegistroSolicitudService,
  TablaAcciones,
  TablaDinamicaComponent,
  TablePaginationComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  Catalogo,
  DatosDeTablaSeleccionados,
  DatosSolicitudFormState,
  MercanciaForm,
  OpcionConfig,
  ScianConfig,
  TablaMercanciasConfig,
  TablaMercanciasDatos,
  TablaOpcionConfig,
  TablaScianConfig,
} from '../../../models/shared2606/datos-solicitud.model';
import { CatalogoServices, ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosSolicitudService, RepresentanteData, RfcSearchPayload } from '../../../services/shared2606/datos-solicitud.service';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../datos-mercancia/datos-mercancia.component';
import { ScianDataService } from '../../../services/shared2606/scian-data.service';
import { ScianTablaComponent } from "../scian-tabla/scian-tabla.component";
import { ToastrService } from 'ngx-toastr';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import radio_si_no from '@libs/shared/theme/assets/json/260103/radio_si_no.json';

@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    AlertComponent,
    ReactiveFormsModule,
    FormsModule,
    NotificacionesComponent,
    TooltipModule,
    InputRadioComponent,
    TablePaginationComponent,
    DatosMercanciaComponent,
    ScianTablaComponent
  ],
  providers: [RegistroSolicitudService],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss',
})
export class DatosDeLaSolicitudComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  /**
   * @property {Subject<void>} destroyNotifier$
   * Subject utilizado para cancelar suscripciones activas al destruir el componente.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {ScianConfig<TablaScianConfig>} scianConfig
   * Configuración de la tabla SCIAN recibida como input.
   */
  @Input() public scianConfig!: ScianConfig<TablaScianConfig>;

  /**
   * Indica si existe un error en el campo de correo electrónico.
   *
   * - `true`: Se muestra el mensaje de error de correo electrónico no válido.
   * - `false`: No hay error, el correo electrónico es válido.
   */
  @Input() public correoElectronicoMensajeError: boolean = false;

  /**
   * @property {TablaMercanciasConfig<TablaMercanciasDatos>} tablaMercanciasConfig
   * Configuración de la tabla de mercancías recibida como input.
   */
  @Input()
  public tablaMercanciasConfig!: TablaMercanciasConfig<TablaMercanciasDatos>;

  /**
   * @property {OpcionConfig<TablaOpcionConfig>} opcionConfig
   * Configuración de la tabla de opciones.
   */
  @Input() public opcionConfig!: OpcionConfig<TablaOpcionConfig>;

  /**
   * @property {DatosSolicitudFormState} datosSolicitudFormState
   * Estado inicial del formulario de solicitud, recibido como input.
   */
  @Input() public datosSolicitudFormState!: DatosSolicitudFormState;

  /**
   * @property {MercanciaForm} mercanciaFormState
   * Estado inicial del formulario de mercancía, recibido como input.
   */
  @Input() public mercanciaFormState!: MercanciaForm;
  /**
   * @property {boolean} opcionesColapsableState
   * Estado colapsable inicial para mostrar u ocultar ciertas secciones.
   */
  @Input() public opcionesColapsableState!: boolean;
  /**
   * Indica si el estado del establecimiento está deshabilitado.
   */
  estadoDisabledEsatdoSeleccion: boolean = true;
  /**
   * Evento de salida que emite la acción seleccionada en la tabla de solicitudes.
   *
   * Permite comunicar al componente padre cuál fue la acción realizada
   * sobre una fila específica de la tabla (por ejemplo, "ver", "editar" o "eliminar").
   *
   * @event
   * @property {TablaOpcionConfig} row - Objeto con la información de la fila seleccionada.
   * @property {string} column - Nombre de la columna o acción ejecutada.
   */
  @Output() accioneSolitudValor = new EventEmitter<{
    row: TablaOpcionConfig;
    column: string;
  }>();

  /**
   * @property {number} idProcedimiento
   * Identificador único del procedimiento asociado a la solicitud.
   * Este valor es recibido como un input desde el componente padre.
   *
   * @decorador @Input
   */
  @Input() public idProcedimiento!: number;

  /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * @event opcionSeleccionado
   * Emite las opciones seleccionadas al componente padre.
   */
  @Output() opcionSeleccionado: EventEmitter<TablaOpcionConfig[]> =
    new EventEmitter<TablaOpcionConfig[]>();

  /**
   * @event scianSeleccionado
   * Emite los registros seleccionados de SCIAN.
   */
  @Output() scianSeleccionado: EventEmitter<TablaScianConfig[]> =
    new EventEmitter<TablaScianConfig[]>();

  /**
   * @event mercanciasSeleccionado
   * Emite los registros de mercancías seleccionados.
   */
  @Output() mercanciasSeleccionado: EventEmitter<TablaMercanciasDatos[]> =
    new EventEmitter<TablaMercanciasDatos[]>();

  /**
   * @event datosDeTablaSeleccionados
   * Emite una estructura que agrupa las selecciones de SCIAN, opciones y mercancías.
   */
  @Output() datosDeTablaSeleccionados: EventEmitter<DatosDeTablaSeleccionados> =
    new EventEmitter<DatosDeTablaSeleccionados>();

  /**
   * @event datasolicituActualizar
   * Emite el estado actualizado del formulario cada vez que cambia su valor.
   */
  @Output() datasolicituActualizar: EventEmitter<DatosSolicitudFormState> =
    new EventEmitter<DatosSolicitudFormState>();

  /**
   * @property {FormGroup} datosSolicitudForm
   * Formulario reactivo principal del componente.
   */
  public datosSolicitudForm!: FormGroup;

  /**
   * @property {boolean} isContinuarButtonClicked
   * Indica si el botón "Continuar" ha sido presionado.
   */
  public isContinuarButtonClicked: boolean = false;


  /**
   * @property {Catalogo[]} estadoDatos
   * Lista de estados para catálogos relacionados.
   */
  public estadoDatos: Catalogo[] = [];

  /**
   * @property {Catalogo[]} regimenDatos
   * Lista de regímenes disponibles.
   */
  public regimenDatos: Catalogo[] = [];

  /**
   * @property {string} AICM
   * Constante que representa el Aeropuerto Internacional de la Ciudad de México (AICM).
   */
  AICM = AICM;
  /**
   * @property {string} AIFA
   * Constante que representa el Aeropuerto Internacional Felipe Ángeles (AIFA).
   */
  AIFA = AIFA;

  /**
   * @property {Catalogo[]} adunasDeEntradasDatos
   * Lista de aduanas de entrada disponibles.
   */
  public adunasDeEntradasDatos: Catalogo[] = [];

  /**
   * @property {string} infoAlert
   * Clase CSS usada para mostrar alertas informativas.
   */
  public infoAlert = 'alert-info';

  /**
   * @property {string} alertaDeManifestoContenido
   * Mensaje de alerta relacionado con el manifiesto y declaraciones.
   */
  public alertaDeManifestoContenido = ALERTA_DE_MANIFESTO_Y_DECLARACIONES;

  /**
   * @method validarPasoUno
   * @description
   * Valida si el contenedor de datos de la solicitud y el formulario interno son válidos.
   */
  public enableFields = ENABLE_FIELDS;

  /**
   * @property {string} textoManifestoContenido
   * Texto que se muestra en el manifiesto y declaraciones.
   */
  public textoManifestoContenido = TEXTO_MANIFESTO_Y_DECLARACIONES;

  /**
   * @property {string} alertaOpicion
   * Mensaje de alerta para la tabla de opciones.
   */
  public alertaOpicion = ALERTA_OPCIONS;

  /**
   * @property {TablaMercanciasDatos[]} tablaMercanciasLista
   * Lista de mercancías mostradas en la tabla.
   */
  public tablaMercanciasLista: TablaMercanciasDatos[] = [];

  /**
   * @property {TablaScianConfig[]} scianLista
   * Lista de registros SCIAN seleccionados.
   */
  public scianLista: TablaScianConfig[] = [];

  /**
   * @property {TablaOpcionConfig[]} opcionLista
   * Lista de opciones seleccionadas.
   */
  public opcionLista: TablaOpcionConfig[] = [];

  /**
   * @property {boolean} opcionesColapsable
   * Controla el estado de colapsado de la sección de opciones.
   */
  public opcionesColapsable = false;

  /**
   * @property {boolean} mostrarElementoColapsable
   * Controla si se debe mostrar un elemento colapsable en la interfaz de usuario.
   *
   * @description
   * Este valor se utiliza para determinar si un elemento colapsable debe ser visible
   * o no, dependiendo de la lógica implementada en el componente.
   */
  public mostrarElementoColapsable = true;

  /**
   * @property {boolean} mostrarCorreoElectronico
   * Controla la visibilidad del campo de correo electrónico en el formulario.
   *
   * @description
   * Este valor se utiliza para determinar si el campo de correo electrónico debe ser visible
   * o no, dependiendo de la lógica implementada en el componente.
   */
  public mostrarCorreoElectronico = true;

  /**
   * Indica si se debe mostrar el campo de correo electrónico en la interfaz.
   * @type {boolean}
   */
  public mostrarCorreoElectronicoenMismaFila = true;

  /**
   * Indica si se debe mostrar la sección del representante legal en la interfaz.
   * @type {boolean}
   */
  public mostrarRepresentanteLegal = true;
  /**
   * Indica si se debe mostrar la sección del representante legal en la interfaz.
   * @type {boolean}
   */
  public MostrarRepresentanteLegal = true;
  /**
     * @property {boolean} esProcedimiento260210
     * @description Indica si el procedimiento actual corresponde al código 260210.
     * 
     */
  public esProcedimiento260210: boolean = false;

  /**
   * @property {boolean} mostrarRFCSanitario
   * Controla la visibilidad del campo de RFC sanitario en el formulario.
   *
   * @description
   * Este valor se utiliza para determinar si el campo de RFC sanitario debe ser visible
   * o no, dependiendo de la lógica implementada en el componente.
   */
  public mostrarRFCSanitario = true;

  /**
   * @property {boolean} mostrarRFCCalle
   * Controla la visibilidad del campo de RFC de calle en el formulario.
   *
   * @description
   * Este valor se utiliza para determinar si el campo de RFC de calle debe ser visible
   * o no, dependiendo de la lógica implementada en el componente.
   */
  public mostrarRFCCalle = true;

  /**
   * @property {Catalogo[]} regimenLaMercanciaDatos
   * Lista de regímenes relacionados con la mercancía.
   *
   * @description
   * Esta propiedad se utiliza para almacenar los regímenes asociados a la mercancía,
   * que son seleccionados por el usuario en el formulario.
   */
  public regimenLaMercanciaDatos: Catalogo[] = [];

  /**
   * @property {Catalogo[]} aduanaDatos
   * Lista de aduanas relacionadas con la mercancía.
   *
   * @description
   * Esta propiedad se utiliza para almacenar las aduanas asociadas a la mercancía,
   * que son seleccionadas por el usuario en el formulario.
   */
  public aduanaDatos: Catalogo[] = [];

  /**
   * @property {boolean} mostrarRegimenYAdunasDeEntradasDatos
   * Controla la visibilidad de los campos de régimen y aduanas de entrada en el formulario.
   *
   * @description
   * Este valor se utiliza para determinar si los campos relacionados con el régimen y las aduanas de entrada
   * deben ser visibles o no, dependiendo de la lógica implementada en el componente.
   */
  public mostrarRegimenYAdunasDeEntradasDatos: boolean = true;

  public esconderLicencia: boolean = false;

  /**
   * @property {string[]} elementosAnadidos
   * Lista de elementos adicionales que se deben mostrar en el formulario.
   */
  @Input() public elementosAnadidos!: string[];

  /**
   * @property {string[]} elementosRequeridos
   * Lista de elementos que son obligatorios en el formulario.
   */
  @Input() public elementosRequeridos!: string[];

  /**
   * Etiqueta que se muestra en el formulario para el campo de municipio o alcaldía.
   *
   * @type {string}
   * @default 'Municipio o alcaldía'
   */
  public etiquetaMunicipio: string = 'Municipio o alcaldía';

  /**
   * Lista de acciones disponibles para la tabla.
   *
   * @type {TablaAcciones[]}
   * @default []
   */
  @Input() tablaAcciones: TablaAcciones[] = [];

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public confirmacionAlerta: boolean = false;

  /**
   * Mensaje de alerta que se muestra al usuario.
   * @property {string} mensajeDeAlerta
   */
  public mensajeDeAlerta: string = MENSAJE_SIN_FILA_SELECCIONADA;

  /**
   * Mensaje de alerta que se muestra cuando no se ha seleccionado
   * una fila o se han seleccionado más de una al intentar modificar.
   *
   * Se inicializa con la constante `MODIFICADOR_MENSAJE_NO_FILA_SELECCIONADA`.
   */
  public modificadorMensajeDeAlerta: string =
    MODIFICADOR_MENSAJE_NO_FILA_SELECCIONADA;

  /**
   * Mensaje emergente que solicita confirmación al usuario antes
   * de ejecutar una acción importante (por ejemplo, eliminar un registro).
   *
   * Se inicializa con la constante `MENSAJE_EMERGENTE_DE_CONFIRMACION`.
   */
  public mensajeEmergenteConfirmacion: string =
    MENSAJE_EMERGENTE_DE_CONFIRMACION;

  /**
   * @description
   * Variable que almacena el índice del elemento que se desea eliminar de la lista de pedimentos.
   * Utilizada para realizar operaciones de eliminación en el arreglo `pedimentos`.
   */
  elementoParaEliminar!: number;

  /**
   * @description
   * Objeto que representa una nueva notificación.
   * Se utiliza para mostrar mensajes de alerta o información al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @description
   * Objeto que representa una nueva notificación de eliminación.
   * Se utiliza para mostrar mensajes de alerta o información al usuario.
   */
  public nuevaNotificacionEliminar!: Notificacion;

  /**
   * @description
   * Arreglo que almacena los pedimentos asociados al establecimiento.
   * Cada pedimento contiene información relevante para el trámite.
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * @description
   * Indica si se debe mostrar la notificación.
   */
  mostrarNotificacion: boolean = false;

  /** Indica si se debe mostrar la alerta del RFC. */
  mostrarRfcAlerta: boolean = false;

  /** Nueva notificación relacionada con el RFC. */
  public nuevaRfcNotificacion!: Notificacion;

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;
  /**
   * Representa el estado de un grupo de botones de radio, inicializado con el valor `radio_si_no`.
   * Esto se utiliza típicamente para manejar opciones binarias (por ejemplo, Sí/No).
   */
  public radioBtn = radio_si_no;
  /**
   * Representa el valor de selección predeterminado para un componente específico.
   * Esto puede ser una cadena o un número, inicializado como una cadena vacía.
   */
  public predeterminadoSeleccionar: string | number = '';

  /** Indica si el trámite es un manifiesto. */
  esManifesto: boolean = false;

  /**
   * Indica si el campo utiliza punto y coma como separador.
   */
  esPuntoYComa: boolean = false;

  /**
   * @const SIN_ACCION_AL_INICIAR
   * @description Lista de identificadores de procedimientos que no requieren acción al iniciar.
   * @type {number[]}
   */
  sinAccionAlIniciar = SIN_ACCION_AL_INICIAR;

  /**
   * Indica si el trámite no requiere acción al iniciar.
   */
  esSinAccionAlIniciar: boolean = false;

  /**
   * Indica si el formulario está en modo solo lectura.
   * @property {boolean} esFormularioSoloLectura
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Reference to the SCIAN modal element
   */
  @ViewChild('scianModal') scianModal!: ElementRef;


  /**
   * Indicates if the SCIAN modal is currently open
   */
  public scianModalAbierto: boolean = false;

  /**
  * Indicates if the merchandise modal is currently open
  */
  public mercanciaModalAbierto: boolean = false;

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

/** Mercancía seleccionada en la tabla. */
  public mercanciaSeleccionada: TablaMercanciasDatos | undefined;

  /** Indica si el campo de teléfono es requerido según el procedimiento. */
  public telefonoRequerido: number[] = REQUERIDO_TELEFONO;

  /** Indica los regímenes que deben estar deshabilitados según el procedimiento. */
  public disableRegimen: number[] = HABITO_REGIMEN;

  /** Evento que emite el ID de la solicitud prellenada. */
  @Output() idSolicitudPrellenado: EventEmitter<number> = new EventEmitter<number>();

  public isAccionModificar: boolean = false;
  /**
   * Constructor del componente.
   *
   * Inyecta los servicios y dependencias necesarias para la construcción del formulario,
   * la navegación y la consulta de datos.
   *
   * @param fb - Servicio de Angular para la creación y manejo de formularios reactivos.
   * @param router - Servicio de enrutamiento para la navegación entre páginas.
   * @param activatedRoute - Proporciona acceso a la ruta activa, incluyendo parámetros.
   * @param datosSolicitudService - Servicio para gestionar la información de la solicitud.
   * @param consultaioQuery - Servicio para la consulta de datos relacionados con la solicitud.
   * @param scianDataService - Servicio para la obtención de datos del catálogo SCIAN.
   * @param catalogoService - Servicio para la obtención de catálogos diversos.
   * @param cdr - Servicio para la detección de cambios en el componente.
   */
  constructor(
    public fb: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public datosSolicitudService: DatosSolicitudService,
    private consultaioQuery: ConsultaioQuery,
    private scianDataService: ScianDataService,
    private cdr: ChangeDetectorRef,
    private catalogoService: CatalogoServices,
    private toastr: ToastrService,
    private registroSolicitudService: RegistroSolicitudService


  ) {
    this.seleccionarFilaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: this.mensajeDeAlerta,
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
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
   * Crea el formulario, activa la escucha de cambios y sincroniza el estado con el input.
   */
  ngOnInit(): void {
    this.inicializarCatalogo(String(this.idProcedimiento));
    this.esProcedimiento260210 = this.idProcedimiento === NUMERO_TRAMITE.TRAMITE_260210;

    this.crearDatosSolicitudForm();
    this.actualizarDatosFormularioSolicitud();
    this.esManifesto =
      PROCEDIMIENTOS_NO_PARA_MANIFIESTOS_Y_DECLARACIONES.includes(
        this.idProcedimiento
      );
    this.mostrarNotificacion = MOSTRAR_NOTIFICACION.includes(
      this.idProcedimiento
    )
      ? true
      : false;

    this.esSinAccionAlIniciar = SIN_ACCION_AL_INICIAR.includes(
      this.idProcedimiento
    );

    this.mostrarCorreoElectronico =
      PROCEDIMIENTOS_NO_PARA_ELEMENTO_CORREO_ELECTRONIC.includes(
        this.idProcedimiento
      )
        ? true
        : false;
    this.opcionesColapsable = this.opcionesColapsableState;
    this.mostrarElementoColapsable =
      PROCEDIMIENTOS_NO_PARA_ELEMENTO_COLAPSABLE.includes(this.idProcedimiento)
        ? false
        : true;
    this.mostrarRFCSanitario =
      PROCEDIMIENTOS_NO_PARA_ELEMENTO_RFC_DEL_SANITARIO.includes(
        this.idProcedimiento
      )
        ? false
        : true;
    this.mostrarRFCCalle = PROCEDIMIENTOS_NO_PARA_ELEMENTO_CALLE.includes(
      this.idProcedimiento
    )
      ? false
      : true;

    this.mostrarCorreoElectronicoenMismaFila =
      PROCEDIMIENTOS_PARA_CORREO_ELECTRONICO_EN_MISMA_FILA.includes(
        this.idProcedimiento
      )
        ? true
        : false;

    this.mostrarRepresentanteLegal = REPRESENTANTE_LEGAL.includes(
      this.idProcedimiento
    )
      ? false
      : true;

    this.mostrarRegimenYAdunasDeEntradasDatos =
      PROCEDIMIENTOS_NO_PARA_ELEMENTO_REGIMEN_Y_ADUNADEENTRADAS.includes(
        this.idProcedimiento
      )
        ? false
        : true;

    this.esconderLicencia = ESCONDER_LICENCIA.includes(this.idProcedimiento);

    this.etiquetaMunicipio =
      this.idProcedimiento === NUMERO_TRAMITE.TRAMITE_260103
        ? 'Municipio y alcaldía'
        : 'Municipio o alcaldía';

    this.radioBtn = 
      this.idProcedimiento === NUMERO_TRAMITE.TRAMITE_260603 
        ? RADIO_NO_SI 
        : radio_si_no;

    Object.keys(this.datosSolicitudForm.controls).forEach((controlName) => {
      const CONTROL = this.datosSolicitudForm.get(controlName);
      CONTROL?.enable();


    });
    // Si el procedimiento es 260603 y el flag está activo, el campo será obligatorio
    if (this.idProcedimiento === 260603 && this.licenciaSanitariaRequerida) {
      this.licenciaSanitariaRequerida = true;
    }
    this.datosSolicitudForm.get('representanteRfc')?.enable();
  }

  /**
   * @method actualizarStore
   * @description Emite el estado actual del formulario al componente padre.
   */
  actualizarStore(): void {
    const VALORES_COMPLETOS = this.datosSolicitudForm.getRawValue();
    if (VALORES_COMPLETOS) {
      this.datasolicituActualizar.emit(VALORES_COMPLETOS);
    }
  }

  /**
   * @method inicializarCatalogo
   * @description Inicializa los catálogos necesarios para el formulario de solicitud.
   * @param {string} tramite - Identificador del trámite para cargar los catálogos correspondientes.
   */
  inicializarCatalogo(tramite: string): void {
    this.subscription.add(
      this.catalogoService
        .estadosCatalogo(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.estadoDatos = DATOS;
          }
        })
    );
    this.subscription.add(
      this.catalogoService
        .regimenesCatalogo(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];
          const REGIMENLIST = DATOS.filter(item => item.clave === '01');
          if (response) {
            this.regimenDatos = DATOS;
            if (REGIMENLIST.length > 0 && this.disableRegimen.includes(this.idProcedimiento)) {
              this.datosSolicitudForm.patchValue({
                regimen: REGIMENLIST[0].clave
              });
            }
          }
        })
    );

    this.subscription.add(
      this.catalogoService
        .aduanasCatalogo(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.adunasDeEntradasDatos = DATOS;
          }
        })
    );
  }

  /**
  * Método que emite el evento para abrir el modal de modificación con los datos de la mercancia seleccionada.
  * @param datos1 Los datos de la mercancia seleccionada.
  */
  patchOpcionesValue(datos1: TablaOpcionConfig): void {
    this.idSolicitudPrellenado.emit(datos1.id_solicitud);
    // this.patchDatosPrincipales(datos1);
    // this.patchDatosRepresentante(datos1);
    // this.patchDatosMercancia(datos1);
    // this.patchDatosOpcionales(datos1);

    // this.scianConfig.datos = datos1.scian;
    // this.tablaMercanciasConfig.datos = datos1.mercancias;
  }

  /**
   * @method patchDatosPrincipales
   * @description Actualiza los campos principales del formulario con los datos proporcionados.
   * @param datos1 - Objeto que contiene los datos principales a actualizar en el formulario.
   */
  private patchDatosPrincipales(datos1: TablaOpcionConfig): void {
    this.datosSolicitudForm.patchValue({
      rfcSanitario: datos1.rfcSanitario || '',
      denominacionRazon: datos1.denominacionRazon || '',
      correoElectronico: datos1.correoElectronico || '',
      codigoPostal: datos1.codigoPostal || '',
      estado: datos1.estado || '',
      municipioAlcaldia: datos1.municipioAlcaldia || '',
      localidad: datos1.localidad || '',
      colonia: datos1.colonia || '',
      calleYNumero: datos1.calleYNumero || '',
      calle: datos1.calle || '',
      lada: datos1.lada || '',
      telefono: datos1.telefono || ''
    });
  }

  /**
   * @method patchDatosRepresentante
   * @description Actualiza los campos relacionados con el representante legal en el formulario.
   * @param datos1 - Objeto que contiene los datos del representante a actualizar en el formulario.
   */
  private patchDatosRepresentante(datos1: TablaOpcionConfig): void {
    this.datosSolicitudForm.patchValue({
      representanteRfc: datos1.representanteRfc || '',
      representanteNombre: datos1.representanteNombre || '',
      apellidoPaterno: datos1.apellidoPaterno || '',
      apellidoMaterno: datos1.apellidoMaterno || ''
    });
  }

  /**
   * @method patchDatosMercancia
   * @description Actualiza los campos relacionados con la mercancía en el formulario.
   * @param datos1 - Objeto que contiene los datos de la mercancía a actualizar en el formulario.
   */
  private patchDatosMercancia(datos1: TablaOpcionConfig): void {
    this.datosSolicitudForm.patchValue({
      regimenLaMercancia: datos1.regimenLaMercancia || '',
      aduana: datos1.aduana || '',
      mercancias: datos1.mercancias || []
    });
  }

  /**
   * @method patchDatosOpcionales
   * @description Actualiza los campos opcionales del formulario con los datos proporcionados.
   * @param datos1 - Objeto que contiene los datos opcionales a actualizar en el formulario.
   */
  private patchDatosOpcionales(datos1: TablaOpcionConfig): void {
    this.datosSolicitudForm.patchValue({
      aviso: datos1.aviso || '',
      licenciaSanitaria: datos1.licenciaSanitaria || '',
      regimen: datos1.regimen || '',
      adunasDeEntradas: datos1.adunasDeEntradas || '',
      aeropuerto: datos1.aeropuerto || false,
      aeropuertoDos: datos1.aeropuertoDos || false,
      publico: datos1.publico || '',
      manifesto: datos1.manifesto || '',
      manifiestosCasillaDeVerificacion: datos1.manifiestosCasillaDeVerificacion || false
    });
  }

  /**
   * @method crearDatosSolicitudForm
   * @description Crea y configura el formulario reactivo con campos específicos deshabilitados por defecto
   */
  crearDatosSolicitudForm(): void {
    this.datosSolicitudForm = this.fb.group({
      rfcSanitario: [
        {
          value: this.datosSolicitudFormState.rfcSanitario,
          disabled: !ENABLE_FIELDS.includes(this.idProcedimiento) // Deshabilitado por defecto (como se muestra en la captura de pantalla)
        },
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(120),
          Validators.pattern(REGEX_RFC),
        ],
      ],
      denominacionRazon: [
        {
          value: this.datosSolicitudFormState.denominacionRazon,
          disabled: !ENABLE_FIELDS.includes(this.idProcedimiento)// Deshabilitado por defecto (como se muestra en la captura de pantalla)
        },
        [
          Validators.required,

          Validators.maxLength(120),
        ],
      ],
      correoElectronico: [
        {
          value: this.datosSolicitudFormState.correoElectronico,
          disabled: !ENABLE_FIELDS.includes(this.idProcedimiento)// Deshabilitado por defecto (como se muestra en la captura de pantalla)
        },
        [
          Validators.required,
          Validators.pattern(REGEX_CORREO_ELECTRONICO),
          Validators.minLength(2),
          Validators.maxLength(120),
        ],
      ],
      codigoPostal: [
        {
          value: this.datosSolicitudFormState.codigoPostal,
          disabled: !ENABLE_FIELDS.includes(this.idProcedimiento) // Deshabilitado por defecto (como se muestra en la captura de pantalla)
        },
        [
          Validators.required,

          Validators.maxLength(12),
          Validators.pattern(REGEX_SOLO_NUMEROS),
        ],
      ],
      estado: [
        {
          value: this.datosSolicitudFormState.estado,
          disabled: !ENABLE_FIELDS.includes(this.idProcedimiento)
        },
        [Validators.required],
      ],
      municipioAlcaldia: [
        {
          value: this.datosSolicitudFormState.municipioAlcaldia,
          disabled: !ENABLE_FIELDS.includes(this.idProcedimiento) // Deshabilitado por defecto (como se muestra en la captura de pantalla)
        },
        [
          Validators.required,

          Validators.maxLength(120),
        ],
      ],
      localidad: [
        {
          value: this.datosSolicitudFormState.localidad,
          disabled: !ENABLE_FIELDS.includes(this.idProcedimiento)// Deshabilitado por defecto (como se muestra en la captura de pantalla)
        },
        [Validators.pattern(REGEX_IMPORTE_PAGO)],
      ],
      colonia: [
        {
          value: this.datosSolicitudFormState.colonia,
          disabled: !ENABLE_FIELDS.includes(this.idProcedimiento) // Deshabilitado por defecto (como se muestra en la captura de pantalla)
        },
      ],
      calleYNumero: [
        {
          value: this.datosSolicitudFormState.calleYNumero,
          disabled: false, // Mantener habilitado (no se muestra deshabilitado en la captura de pantalla)
        },
        [Validators.required],
      ],
      calle: [
        {
          value: this.datosSolicitudFormState.calle,
          disabled: DESHABILITADA_EN_INIT.includes(this.idProcedimiento),
        },
        [Validators.required],
      ],
      lada: [
        {
          value: this.datosSolicitudFormState.lada,
          disabled: !ENABLE_FIELDS.includes(this.idProcedimiento) // Deshabilitado por defecto (como se muestra en la captura de pantalla)
        },
        [Validators.maxLength(5), Validators.pattern(REGEX_SOLO_DIGITOS)],
      ],
      telefono: [
        {
          value: this.datosSolicitudFormState.telefono,
          disabled: !ENABLE_FIELDS.includes(this.idProcedimiento) // Deshabilitado por defecto (como se muestra en la captura de pantalla)
        },
        [
          REQUERIDO_TELEFONO.includes(this.idProcedimiento) ? Validators.required : null,
          Validators.pattern(REGEX_SOLO_DIGITOS)
        ].filter(Boolean)
      ],
      aviso: [
        {
          value: this.datosSolicitudFormState.aviso,
          disabled: false,
        },
      ],
      licenciaSanitaria: [
        {
          value: this.datosSolicitudFormState.licenciaSanitaria,
          disabled: false, // Mantener habilitado (no se muestra deshabilitado en la captura de pantalla)
        },
        [Validators.required],
      ],
      regimen: [
        {
          value: this.datosSolicitudFormState.regimen,
          disabled: HABITO_REGIMEN.includes(this.idProcedimiento),
        },
        [Validators.required],
      ],
      adunasDeEntradas: [
        {
          value: this.datosSolicitudFormState.adunasDeEntradas
            ? this.datosSolicitudFormState.adunasDeEntradas
            : '',
          disabled: false,
        },
        [Validators.required],
      ],
      aeropuerto: [
        {
          value: this.datosSolicitudFormState.aeropuerto,
          disabled: false, // Mantener habilitado (las casillas de verificación deben ser seleccionables)
        },
        [Validators.required],
      ],
      aeropuertoDos: [
        {
          value: this.datosSolicitudFormState.aeropuertoDos,
          disabled: false, // Mantener habilitado (las casillas de verificación deben ser seleccionables)
        },
        [Validators.required],
      ],
      publico: [
        {
          value: this.datosSolicitudFormState.publico,
          disabled: false, // Mantener habilitado (los botones de radio deben ser seleccionables)
        },
        [Validators.required],
      ],
      representanteRfc: [
        {
          value: this.datosSolicitudFormState.representanteRfc,
          disabled: false,
        },
        [Validators.required],
      ],
      representanteNombre: [
        {
          value: this.datosSolicitudFormState.representanteNombre,
          disabled: REPRESENTANTE_LEGAL_EN_INIT.includes(this.idProcedimiento),
        },
        [Validators.required],
      ],
      apellidoPaterno: [
        {
          value: this.datosSolicitudFormState.apellidoPaterno,
          disabled: REPRESENTANTE_LEGAL_EN_INIT.includes(this.idProcedimiento),
        },
        [Validators.required],
      ],
      apellidoMaterno: [
        {
          value: this.datosSolicitudFormState.apellidoMaterno,
          disabled: REPRESENTANTE_LEGAL_EN_INIT.includes(this.idProcedimiento),
        },
        // Apellido materno no es requerido
      ],
      regimenLaMercancia: [
        {
          value: this.datosSolicitudFormState.regimenLaMercancia,
          disabled: false,
        },
        [Validators.required],
      ],
      aduana: [
        {
          value: this.datosSolicitudFormState.aduana,
          disabled: false,
        },
        [Validators.required],
      ],
      mercancias: [
        {
          value: this.tablaMercanciasConfig.datos,
          disabled: false,
        },
        matrizRequerida,
      ],
      manifesto: [
        {
          value: this.datosSolicitudFormState.manifesto,
          disabled: false,
        },
        // [PROCEDIMIENTOS_PARA_MANIFIESTOS_Y_DECLARACIONES.includes(this.idProcedimiento) ? Validators.required : null]
        // [Validators.required],
      ],
      manifiestosCasillaDeVerificacion: [
        {
          value: this.datosSolicitudFormState.manifiestosCasillaDeVerificacion,
          disabled: false,
        },
        [Validators.required],
      ],
    });


    if (this.mostrarNotificacion) {
      const EMPTY = Object.entries(this.datosSolicitudFormState)
        .filter(([key]) => key !== 'publico')
        .every(([, value]) => !value);
      if (EMPTY) {
        this.alternarControlesDeFormulario(false);
      }
    }
  }

  /**
   * @method ngAfterViewInit
   * @description
   * Hook del ciclo de vida de Angular que se ejecuta después de que se inicializa la vista del componente.
   * Verifica el estado del formulario y realiza las siguientes acciones:
   * - Si `formularioDeshabilitado` es `true` y existe `datosSolicitudForm`, deshabilita todo el formulario.
   * - En caso contrario, crea un nuevo formulario de datos de solicitud llamando a `crearDatosSolicitudForm()`.
   * 
   * Este método es especialmente útil para manejar el estado de habilitación/deshabilitación del formulario
   * después de que todos los elementos de la vista han sido inicializados.
   * 
   * @returns {void}
   */
  ngAfterViewInit(): void {
    if (this.formularioDeshabilitado && this.datosSolicitudForm) {
      this.datosSolicitudForm.disable();
    
    }
    else {
      this.crearDatosSolicitudForm()
      if (this.idProcedimiento === 260209) {
        Object.keys(this.datosSolicitudForm.controls).forEach((controlName) => {
          const CONTROL = this.datosSolicitudForm.get(controlName);
          if (controlName !== 'apellidoPaterno' && controlName !== 'representanteNombre' && controlName !== 'apellidoMaterno') {
            CONTROL?.enable();
          }


        });
      }
    }
    this.datosSolicitudForm.get('representanteRfc')?.enable();
  }

  /**
   * @method ngOnChanges
   * @description Hook que se ejecuta cuando cambian las propiedades de entrada del componente.
   * Permite habilitar o deshabilitar los formularios según el modo de solo lectura.
   * @param {SimpleChanges} changes - Cambios detectados en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formularioDeshabilitado'] && this.datosSolicitudForm) {
      if (this.formularioDeshabilitado) {
        this.datosSolicitudForm.disable();
      } else {
        this.datosSolicitudForm.enable();
      }
    }
    if (changes['datosSolicitudFormState'] &&
      changes['datosSolicitudFormState'].currentValue &&
      this.datosSolicitudForm
    ) {
      this.datosSolicitudForm.patchValue(
        changes['datosSolicitudFormState'].currentValue
      );
      this.cambioAviso();
      this.cambioLicenciaSanitaria();
      this.updateMercanciaTable();

    }
  }

  /**
 * @method actualizarDatosFormularioSolicitud
 * @description Actualiza las validaciones de los campos del formulario `datosSolicitudForm`
 * en función de los procedimientos definidos en `CAMPOS_REQUERIDOS_FORMULARIO_MAP`.
 
 */
  actualizarDatosFormularioSolicitud(): void {
    this.elementosRequeridos?.forEach((campo) => {
      const CONTROL = this.datosSolicitudForm.get(campo);
      if (CONTROL) {
        const EXISTING = CONTROL.validator
          ? Array.isArray(CONTROL.validator)
            ? CONTROL.validator
            : [CONTROL.validator]
          : [];
        const MERGED = [...EXISTING, Validators.required];
        CONTROL.setValidators(MERGED);
        CONTROL.updateValueAndValidity();
      }
    });
    const NO_LICENCIA = this.datosSolicitudForm?.get('licenciaSanitaria');
    if(this.esconderLicencia){
      NO_LICENCIA?.clearValidators();
      NO_LICENCIA?.updateValueAndValidity();
    }
  }

  /**
   * Valida si el campo de un formulario no contiene errores
   * @param {AbstractControl} control  : Control del formulario
   * @param {string} campo  : Nombre del campo a validar, si el control es un FormGroup
   * @returns {boolean | null} : Retorna true si el campo contiene errores y ha sido tocado, de lo contrario retorna false
   */
  // eslint-disable-next-line class-methods-use-this
  public isValid(control: AbstractControl, campo?: string): boolean | null {
    if (control instanceof FormGroup && campo) {
      return (
        control.controls[campo]?.errors && control.controls[campo]?.touched
      );
    }
    return control?.errors && control?.touched;
  }

  /**
   * Busca el RFC del representante en el formulario usando API calls similares al patrón de SE 80205.
   * Si existe el RFC, realiza una llamada al método del servicio para obtener los datos del representante.
   * Actualiza los campos relacionados con el nombre, apellido paterno y apellido materno.
   */
  buscarRepresentanteRfc(): void {
    const RFC_VALUE = this.datosSolicitudForm.get('representanteRfc')?.value?.trim();

    if (!RFC_VALUE || RFC_VALUE === '') {
      this.abrirRfcModal();
      return;
    }

    // Realizar llamada API con payload desde el store usando el método del servicio
    this.buscarDatosRepresentante(RFC_VALUE);
  }


  /**
   * Busca los datos del representante legal utilizando el RFC proporcionado.
   *
   * @param rfc - RFC del representante legal a buscar.
   *
   * Realiza una petición al servicio para obtener los datos del representante legal
   * según el RFC ingresado. Si la respuesta es válida y contiene datos, procesa la información
   * del representante. Si no se encuentran datos o la respuesta no es válida, muestra una advertencia
   * y carga datos predeterminados. En caso de error en la petición, muestra un mensaje de error
   * y notifica al usuario sobre el problema de conexión.
   */
  private buscarDatosRepresentante(rfc: string): void {
    const PAYLOAD: RfcSearchPayload = {
      rfcRepresentanteLegal: rfc
    };
    this.datosSolicitudService
      .buscarRepresentantePorRfc(this.idProcedimiento.toString(), PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          if (response?.codigo === '00' && Array.isArray(response.datos) && response.datos.length > 0) {
            this.procesarDatosRepresentante(response.datos[0]);
          } else {
            console.warn('Respuesta no válida del servidor:', response);
            this.toastr.warning('No se encontraron datos para el RFC proporcionado', 'Búsqueda de RFC');
            this.mostrarDatosPredeterminados();
          }
        },
        error: (error) => {
          console.error('Error en la búsqueda de RFC:', error);
          this.toastr.error('Error al buscar los datos del representante', 'Error de Búsqueda');
          this.mostrarErrorRfc('Error al conectar con el servidor. Por favor, intente nuevamente.');
        }
      });
  }

  /**
   * Datos predeterminados para el representante legal
   */
  // private readonly DATOS_PREDETERMINADOS = {
  //   representanteNombre: 'EUROFOODS DE MEXICO',
  //   apellidoPaterno: 'GONZALEZ',
  //   apellidoMaterno: 'PINAL',
  // };

  /**
   * Procesa los datos del representante obtenidos de la API
   */
  private procesarDatosRepresentante(data: RepresentanteData): void {
    // Usar el mismo campo de nombre para todos los procedimientos
    const NOMBRE_FIELD = data.nombre;

    // Construir el objeto de datos para actualizar el formulario
    const DATOS_FORMULARIO = {
      representanteNombre: NOMBRE_FIELD,
      apellidoPaterno: data.apellidoPaterno,
      apellidoMaterno: data.apellidoMaterno,

    };

    this.datosSolicitudForm.patchValue(DATOS_FORMULARIO);
    this.actualizarStore();

    // Deshabilitar los campos después de cargar los datos
    const NOMBRE_CONTROL = this.datosSolicitudForm.get('representanteNombre');
    const PATERNO_CONTROL = this.datosSolicitudForm.get('apellidoPaterno');
    const MATERNO_CONTROL = this.datosSolicitudForm.get('apellidoMaterno');
    if (
      !NOMBRE_CONTROL?.value || 
      !PATERNO_CONTROL?.value || 
      !MATERNO_CONTROL?.value
    ) {
      if (NOMBRE_CONTROL && NOMBRE_CONTROL.disabled) {
        NOMBRE_CONTROL.enable();
      }
      if (PATERNO_CONTROL && PATERNO_CONTROL.disabled) {
        PATERNO_CONTROL.enable();
      }
      if (MATERNO_CONTROL && MATERNO_CONTROL.disabled) {
        MATERNO_CONTROL.enable();
      }
    }
    else
    {
      if (NOMBRE_CONTROL && NOMBRE_CONTROL.enabled) { NOMBRE_CONTROL.disable(); }
      if (PATERNO_CONTROL && PATERNO_CONTROL.enabled) { PATERNO_CONTROL.disable(); }
      if (MATERNO_CONTROL && MATERNO_CONTROL.enabled) { MATERNO_CONTROL.disable(); }
  
  
    }
    // Mostrar solo el toast de éxito, no el modal
    this.toastr.success('Datos del representante cargados exitosamente', 'Búsqueda de RFC');
    // No llamar a mostrarNotificacionExito, así no aparece el modal
  }

  /**
   * Muestra datos predeterminados cuando no se encuentran en la API
   */
  private mostrarDatosPredeterminados(): void {
    const NOMBRE_CONTROL = this.datosSolicitudForm.get('representanteNombre');
    const PATERNO_CONTROL = this.datosSolicitudForm.get('apellidoPaterno');
    const MATERNO_CONTROL = this.datosSolicitudForm.get('apellidoMaterno');
    if (NOMBRE_CONTROL?.disabled) { NOMBRE_CONTROL.enable(); NOMBRE_CONTROL.setValue(''); }
    if (PATERNO_CONTROL?.disabled) { PATERNO_CONTROL.enable(); PATERNO_CONTROL.setValue(''); }
    if (MATERNO_CONTROL?.disabled) { MATERNO_CONTROL.enable(); MATERNO_CONTROL.setValue(''); }
  }

  /**
   * Muestra notificación de error para RFC inválido
   */
  private mostrarErrorRfc(mensaje: string): void {
    this.toastr.error(mensaje, 'Error de Validación');
    this.seleccionarFilaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: true,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.mostrarAlerta = true;
  }

  /**
   * Muestra notificación de éxito
   */
  private mostrarNotificacionExito(mensaje: string): void {
    this.seleccionarFilaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'success',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.mostrarAlerta = true;
  }

  /**
   * Muestra notificación informativa
   */
  private mostrarNotificacionInfo(mensaje: string): void {
    this.seleccionarFilaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'info',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.mostrarAlerta = true;
  }

  /**
   * Elimina elementos de la configuración SCIAN que coincidan con los elementos de la lista SCIAN.
   *
   * Este método filtra los datos de la configuración SCIAN (`scianConfig.datos`) eliminando
   * aquellos elementos cuya clave coincida con algún elemento de la lista SCIAN (`scianLista`).
   *
   * Si hay un elemento seleccionado (`scianSeleccionado`), emite los datos actualizados
   * de la configuración SCIAN.
   */
  eliminarScian(): void {
    this.scianConfig.datos = this.scianConfig.datos.filter(
      (idx: TablaScianConfig) => {
        return !this.scianLista.some(
          (idx2: TablaScianConfig) => idx2.clave === idx.clave
        );
      }
    );
    if (this.scianSeleccionado) {
      this.scianSeleccionado.emit(this.scianConfig.datos);
    }
  }

  /**
   * Cierra el modal de alerta.
   * @method cerrarModal
   * @returns {void}
   */
  aceptar(): void {
    this.mostrarAlerta = false;
  }

  /**
   * Elimina las mercancías seleccionadas de la lista de datos de la tabla.
   *
   * Este método filtra los datos de la tabla de mercancías (`tablaMercanciasConfig.datos`)
   * eliminando aquellos elementos cuya clasificación de producto coincide con
   * alguno de los elementos en la lista de mercancías (`tablaMercanciasLista`).
   *
   * Si hay mercancías seleccionadas (`mercanciasSeleccionado`), emite el evento
   * con los datos actualizados de la tabla de mercancías.
   */
  eliminarMercancias(): void {
    if (!this.tablaMercanciasLista.length) {
      this.confirmacionAlerta = true;
      return;
    }
    if (this.tablaMercanciasLista.length > 0) {
      this.seleccionarFilaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: this.mensajeEmergenteConfirmacion,
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
      this.confirmacionAlerta = true;
    }
  }

  /**
   * Elimina un pedimento de la lista de mercancías tras la confirmación del usuario.
   *
   * @param borrar Indica si el usuario confirmó la eliminación (`true`) o la canceló (`false`).
   *
   * ### Descripción:
   * - Si `borrar` es `true`:
   *   - Filtra los datos de `tablaMercanciasConfig.datos` eliminando aquellos
   *     que coincidan en `clasificacionProducto` con los elementos de `tablaMercanciasLista`.
   *   - Si existe un emisor en `mercanciasSeleccionado`, emite la lista actualizada de datos.
   *   - Elimina el elemento de la lista `pedimentos` en la posición `elementoParaEliminar`.
   * - Independientemente de la acción, desactiva la alerta de confirmación (`confirmacionAlerta = false`).
   *
   * ### Ejemplo de uso:
   * ```ts
   * eliminarPedimentoConfirmacion(true); // Elimina el pedimento
   * eliminarPedimentoConfirmacion(false); // Cancela la eliminación
   * ```
   */
  eliminarPedimentoConfirmacion(borrar: boolean): void {
    if (borrar) {
      this.tablaMercanciasConfig.datos =
        this.tablaMercanciasConfig.datos.filter((idx: TablaMercanciasDatos) => {
          return !this.tablaMercanciasLista.some(
            (idx2: TablaMercanciasDatos) =>
              idx2.clasificacionProducto === idx.clasificacionProducto
          );
        });
      if (this.mercanciasSeleccionado) {
        this.mercanciasSeleccionado.emit(this.tablaMercanciasConfig.datos);
      }
    }
    this.confirmacionAlerta = false;
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /**
   * Navega a la ruta de acciones
   * @param accionesPath
   */
  irAAcciones(accionesPath: string): void {
    this.router.navigate([accionesPath], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Agrega los elementos seleccionados de la lista SCIAN a la configuración actual
   * y emite los datos actualizados si hay un elemento seleccionado.
   * Luego, navega a la ruta de acciones correspondiente.
   *
   * @remarks
   * - Combina los datos existentes con los nuevos elementos seleccionados de la lista SCIAN.
   * - Emite un evento con los datos actualizados si `scianSeleccionado` está definido.
   * - Redirige al usuario a la ruta '../scian-selecion'.
   */
  agregarScian(): void {
    if (this.scianLista && this.scianLista.length > 0) {
      this.scianDataService.updateScianData(this.scianConfig.datos);
      if (this.scianSeleccionado) {
        this.scianSeleccionado.emit(this.scianConfig.datos);
      }
    }
    this.abrirScianModal();
  }

  /**
   * Abre el modal de selección SCIAN.
   * Este método establece la bandera `scianModalAbierto` en `true` y muestra el modal
   * utilizando la instancia de Bootstrap. Si el elemento modal no se encuentra, no realiza ninguna acción.
   */
  abrirScianModal(): void {
    this.scianModalAbierto = true;
    // Abrir el modal utilizando Bootstrap
    const MODALELEMENT = document.getElementById('scianModal');
    if (MODALELEMENT) {
      const MODAL = new (window as any).bootstrap.Modal(MODALELEMENT);
      MODAL.show();
    }
  }

  /**
   * Cierra el modal de selección SCIAN.
   *
   * Este método establece la bandera `scianModalAbierto` en `false` y oculta el modal
   * utilizando la instancia de Bootstrap. Si el elemento modal o su instancia no se encuentran,
   * no realiza ninguna acción.
   */
  cerrarScianModal(): void {
    this.scianModalAbierto = false;
    const MODALELEMENT = document.getElementById('scianModal');
    if (MODALELEMENT) {
      const MODAL = (window as any).bootstrap.Modal.getInstance(MODALELEMENT);
      if (MODAL) {
        MODAL.hide();
      }
    }
  }



  /**
   * Maneja la selección de SCIAN desde el modal
   */
  onScianSeleccionado(scianData: TablaScianConfig): void {
    if (this.scianConfig && this.scianConfig.datos) {
      const EXISTE = this.scianConfig.datos.find(item => item.clave === scianData.clave);
      if (!EXISTE) {
        this.scianConfig.datos = [...this.scianConfig.datos, scianData];

        this.scianDataService.updateScianData(this.scianConfig.datos);

        if (this.scianSeleccionado) {
          this.scianSeleccionado.emit(this.scianConfig.datos);
        }
        this.cdr.markForCheck();
      } else {
        this.seleccionarFilaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'warning',
          modo: 'action',
          titulo: '',
          mensaje: 'El elemento SCIAN seleccionado ya existe en la tabla.',
          cerrar: true,
          tiempoDeEspera: 2000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        this.mostrarAlerta = true;
      }
    } else {
      this.scianConfig = {
        ...this.scianConfig,
        datos: [scianData]
      };
      this.scianDataService.updateScianData(this.scianConfig.datos);
      if (this.scianSeleccionado) {
        this.scianSeleccionado.emit(this.scianConfig.datos);
      }
    }
  }



  /**
   * Agrega las mercancías seleccionadas a la configuración de la tabla y emite el evento correspondiente.
   *
   * Este método concatena los datos de la lista de mercancías seleccionadas con los datos existentes
   * en la configuración de la tabla. Si hay un elemento seleccionado, emite un evento con los datos
   * actualizados. Finalmente, navega a la ruta especificada para realizar acciones adicionales.
   *
   * @returns {void} Este método no devuelve ningún valor.
   */
  agregarMercancias(): void {
    this.mercanciaSeleccionada = undefined; // Clear any previous selection
    this.isAccionModificar = false;
    this.abrirMercanciaModal();
  }

  /**
   * Emite un evento con los datos seleccionados de las listas asociadas.
   *
   * Este método recopila las listas seleccionadas de `scianLista`,
   * `tablaMercanciasLista` y `opcionLista`, y las emite a través del
   * evento `datosDeTablaSeleccionados`.
   *
   * @remarks
   * Este método es útil para comunicar los datos seleccionados a otros
   * componentes o servicios que estén escuchando el evento emitido.
   */
  modificarDatos(): void {
    if (this.tablaMercanciasLista.length > 1) {
      this.seleccionarFilaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: this.modificadorMensajeDeAlerta,
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.mostrarAlerta = true;
    } else if (this.tablaMercanciasLista.length === 1) {
      // Establece los datos de la mercancía seleccionada antes de abrir el modal
      this.mercanciaSeleccionada = this.tablaMercanciasLista[0];
      this.isAccionModificar = true;
      this.abrirMercanciaModal();
    } else {
      // No hay mercancía seleccionada
      this.seleccionarFilaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe seleccionar una mercancía para modificar.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.mostrarAlerta = true;
    }
  }

  /**
   * Muestra u oculta una sección colapsable basada en el orden proporcionado.
   *
   * @param orden - Un número que indica el orden de la sección colapsable.
   *                Si el valor es 1, alterna el estado de `opcionesColapsable`.
   */
  mostrarColapsable(orden: number): void {
    if (orden === 1) {
      this.opcionesColapsable = !this.opcionesColapsable;
      this.datosDeTablaSeleccionados.emit({
        scianSeleccionados: this.scianLista,
        mercanciasSeleccionados: this.tablaMercanciasLista,
        opcionSeleccionados: this.opcionLista,
        opcionesColapsableState: this.opcionesColapsable,
      });
    }
  }
  /**
   * Método que se ejecuta cuando se cambia el estado de un elemento.
   * Actualmente no tiene implementación.
   *
   * @returns {void} No retorna ningún valor.
   */
  cambioDeEstado(event: Catalogo): void {
    if (this.idProcedimiento === NUMERO_TRAMITE.TRAMITE_260301) {
      if (event) {
        this.datosSolicitudForm
          .get('municipioAlcaldia')
          ?.setValue('DISTITO FEDERAL', { emitEvent: true });
      }
    }
  }

  /**
   * Verifica si un campo es requerido según la configuración de campos requeridos.
   *
   * @param {string} campo - Nombre del campo a verificar.
   * @returns {boolean} Retorna `true` si el campo es requerido, `false` en caso contrario.
   */
  esCampoRequerido(campo: string): boolean {
    return this.elementosRequeridos?.includes(campo) ?? false;
  }

  /**
   * Verifica si un campo adicional debe mostrarse según la configuración de procedimientos.
   *
   * @param {string} campo - Nombre del campo a verificar.
   * @returns {boolean} Retorna `true` si el campo adicional debe mostrarse, `false` en caso contrario.
   */
  mostrarCamposDelProcedimiento(campo: string): boolean {
    return this.elementosAnadidos?.includes(campo) ?? false;
  }

  /**
   * @method cambioAviso
   * @description Método que habilita o deshabilita el campo `aviso` en el formulario reactivo `datosSolicitudForm`
   * dependiendo del estado del checkbox seleccionado.
   *
   * @param {Event} event - Evento que se dispara al cambiar el estado del checkbox.
   * @returns {void} Este método no retorna ningún valor.
   **/
  cambioAviso(): void {
    const CHECKED = this.datosSolicitudForm.get('aviso')?.value;
    const LICENCIA_SANITARIA_CONTROL =
      this.datosSolicitudForm.get('licenciaSanitaria');

    if (CHECKED && LICENCIA_SANITARIA_CONTROL) {
      LICENCIA_SANITARIA_CONTROL?.clearValidators();
      LICENCIA_SANITARIA_CONTROL?.updateValueAndValidity();
      LICENCIA_SANITARIA_CONTROL?.disable();
    } else {
      LICENCIA_SANITARIA_CONTROL?.enable();
      LICENCIA_SANITARIA_CONTROL?.setValidators([Validators.required]);
      LICENCIA_SANITARIA_CONTROL?.updateValueAndValidity();
    }
  }

  /**
   * Habilita o deshabilita el control de formulario 'aviso' según el valor del campo de entrada.
   *
   * @param {Event} event - Evento de entrada proveniente de un elemento HTML.
   */
  cambioLicenciaSanitaria(): void {
    const VAL = this.datosSolicitudForm.get('licenciaSanitaria')?.value;
    if (VAL) {
      this.datosSolicitudForm.get('aviso')?.disable();
    } else {
      this.datosSolicitudForm.get('aviso')?.enable();
    }
  }

  /**
   * Método que se llama cuando se cambia el correo electrónico en el formulario.
   * Si el procedimiento es 260103 y los campos de correo electrónico y denominación/razón social
   * no están vacíos, establece valores predeterminados para varios campos del formulario.
   */
  cambireCorreoElectronico(): void {
    if (
      this.idProcedimiento === NUMERO_TRAMITE.TRAMITE_260103 &&
      this.datosSolicitudForm.get('correoElectronico')?.value !== '' &&
      this.datosSolicitudForm.get('denominacionRazon')?.value !== ''
    ) {
      this.datosSolicitudForm.get('codigoPostal')?.setValue(95270);
      this.datosSolicitudForm.get('estado')?.setValue('101');
      this.datosSolicitudForm.get('municipioAlcaldia')?.setValue('ALVARADO');
      this.datosSolicitudForm.get('localidad')?.setValue('ALVARADO');
      this.datosSolicitudForm.get('colonia')?.setValue('CENTRO');
    }
  }

  /**
   * Método que se llama cuando se envía el formulario.
   * Se utiliza para establecer los valores en el store de DatosDomicilioLegal.
   */
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje:
        'Por el momento no hay comunicación con el Sistema de COFEPRIS, favor de capturar su establecimiento.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.mostrarNotificacion = true;
    this.elementoParaEliminar = i;
  }

  /**
   * Método que maneja la lógica para mostrar un modal de confirmación
   * antes de eliminar registros marcados. Si no hay elementos en la lista
   * `scianLista`, muestra una alerta y detiene la ejecución.
   *
   * @remarks
   * Este método configura una notificación de tipo alerta con un mensaje
   * de confirmación para la eliminación de registros. La notificación incluye
   * opciones para aceptar o cancelar la acción.
   *
   * @returns {void} No retorna ningún valor.
   */
  eliminarModal(): void {
    if (!this.scianLista.length) {
      this.mostrarAlerta = true;
      return;
    }
    this.nuevaNotificacionEliminar = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
  }

  /**
   * Método que se llama cuando se elimina un registro de SCIAN.
   * @param {boolean} borrar - Indica si se debe eliminar el registro de SCIAN.
   * Si es verdadero, se llama al método `eliminarScian`.
   */
  getEliminarScianModal(borrar: boolean): void {
    if (borrar) {
      this.eliminarScian();
      this.nuevaNotificacion.cerrar = false;
    }
  }

  /**
   * Método que se llama cuando se busca un RFC en el modal de búsqueda.
   * Si el parámetro `buscar` es verdadero, se actualizan los campos del formulario
   * con valores predeterminados relacionados con el representante.
   *
   * @param {boolean} buscar - Indica si se debe buscar el RFC del representante.
   */
  obtenerModalDeBuscar(buscar: boolean): void {
    // Solo cerrar el modal de RFC, no modificar valores manualmente
    this.mostrarRfcAlerta = false;
  }
  /**
   * Método que verifica si un campo debe ser habilitado o deshabilitado
   * según el procedimiento actual.
   *
   * @param {string} campo - Nombre del campo a verificar.
   * @returns {boolean} Retorna `true` si el campo debe ser habilitado, `false` en caso contrario.
   */
  public controlYaDeshabilitado(campo: string): boolean {
    if (
      (campo === 'apellidoPaterno' ||
        campo === 'apellidoMaterno' ||
        campo === 'representanteNombre') &&
      (PROCEDIMIENTOS_PARA_DESHABILITAR_APELLIDO_MATERNO.includes(
        this.idProcedimiento
      ) ||
        PROCEDIMIENTOS_PARA_DESHABILITAR_NOMBRE_RAZON_SOCIAL.includes(
          this.idProcedimiento
        ) ||
        PROCEDIMIENTOS_PARA_DESHABILITAR_APELLIDO_PATERNO.includes(
          this.idProcedimiento
        )||PROCEDIMIENTOS_PARA_DESHABILITAR_RFC.includes(this.idProcedimiento))
    ) {
      return false;
    }
    return true;
  }

  /**
   * Indica si se ha seleccionado un establecimiento.
   * @property {boolean} establecimientoSeleccionado
   */
  public establecimientoSeleccionado: boolean = false;

  /**
   * Método que se llama cuando se envía el formulario.
   */
  alternarControlesDeFormulario(enable: boolean): void {
    if (!this.datosSolicitudForm) {
      return;
    }

    Object.keys(this.datosSolicitudForm.controls).forEach((controlName) => {
      const CONTROL = this.datosSolicitudForm.get(controlName);

      if (controlName === 'estado') {
        return;
      }

      if (enable && this.controlYaDeshabilitado(controlName)) {
        CONTROL?.enable();
      } else {
        CONTROL?.disable();
      }
    });

  }

  /**
   * Abre el modal de RFC y muestra una notificación de alerta.
   */
  abrirRfcModal(): void {
    this.mostrarRfcAlerta = true;
    this.nuevaRfcNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe ingresar el RFC.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Método que se llama cuando se elimina un pedimento.
   * @param {boolean} borrar - Indica si se debe eliminar el pedimento.
   * Si es verdadero, se elimina el pedimento en la posición `elementoParaEliminar` del arreglo `pedimentos`.
   */
  eliminarPedimento(borrar: boolean): void {
    const CAMPOS_REPRESENTANTE = [
      'representanteNombre',
      'apellidoPaterno',
      'apellidoMaterno'
    ];
    if (borrar) {
      this.habilitarCamposFormulario();
      this.mostrarNotificacion = false;
      this.pedimentos.splice(this.elementoParaEliminar, 1);
      if (PROCEDIMIENTOS_DESHABILITAR_REPRESENTANTE.includes(this.idProcedimiento)) {
        CAMPOS_REPRESENTANTE.forEach((campo) => {
          this.datosSolicitudForm.get(campo)?.disable();
        });
      }
    }
  }

  /**
   * @method habilitarCamposFormulario
   * @description Habilita todos los campos del formulario después de seleccionar establecimiento
   */
  private habilitarCamposFormulario(): void {
    if (!this.datosSolicitudForm) {
      return;
    }
    this.estadoDisabledEsatdoSeleccion = false;
    Object.keys(this.datosSolicitudForm.controls).forEach((controlName) => {
      const CONTROL = this.datosSolicitudForm.get(controlName);

      if (controlName === 'estado' || this.idProcedimiento === 260209 || this.idProcedimiento === 260210) {
        return;
      }

      if (this.controlYaDeshabilitado(controlName)|| controlName === 'representanteRfc') {
        CONTROL?.enable();
      }
    });


  }

  /**
   * Actualiza el valor de `predeterminadoSeleccionar` basado en el valor proporcionado.
   *
   * @param value - El nuevo valor a establecer para `predeterminadoSeleccionar`.
   *                Puede ser una cadena o un número.
   */
  public cambioDeValorIndique(value: string | number): void {
    this.datosSolicitudForm.get('publico')?.setValue(value);
    this.datosSolicitudForm.get('publico')?.markAsTouched();
    this.datosSolicitudForm.get('publico')?.updateValueAndValidity();
    this.predeterminadoSeleccionar = value;
  }

  /**
   * @method formularioSolicitudValidacion
   * Valida el formulario de solicitud verificando si todos los campos cumplen con las reglas de validación.
   * Si el formulario es inválido, marca todos los controles como tocados para mostrar los mensajes de error.
   *
   * @returns {boolean} - Retorna `true` si el formulario es válido, de lo contrario `false`.
   */
formularioSolicitudValidacion(): boolean {
  this.isContinuarButtonClicked = true;
  this.marcarTodosLosCamposComoTocados();

  if (this.verificarCamposValidosODeshabilitados()) {
    return true;
  }
  return false;
}

  /**
 * Marca todos los campos del formulario como tocados (touched) uno por uno.
 * Esto permite mostrar mensajes de validación para todos los campos.
 * @returns {void}
 */
  marcarTodosLosCamposComoTocados(): void {
    const EXCLUDED_FIELDS = [
      'aduana',
      'aeropuertoDos',
      'calleYNumero',
      'manifiestosCasillaDeVerificacion',
      ...(this.idProcedimiento === 260601 ? ['lada'] : []),
      'regimenLaMercancia',
      'aviso',
      'licenciaSanitaria',
      'rfcSanitario',
      'correoElectronico'
    ];
    if (!this.datosSolicitudForm) {

      return;
    }

    // Obtener todos los nombres de los controles
    const CONTROL_NAMES = Object.keys(this.datosSolicitudForm.controls);


    // Recorrer cada control y marcar como tocado
    CONTROL_NAMES.forEach((controlName: string) => {
      const CONTROL = this.datosSolicitudForm.get(controlName);

      if (CONTROL) {
        // Marca el control como tocado
        if (EXCLUDED_FIELDS.includes(controlName)) {

          return;
        }
        CONTROL.markAsTouched();

        // Opcional: También marcar como dirty para activar estados de validación adicionales

      }
    });
    if (this.idProcedimiento === 260203 && this.datosSolicitudForm.get('rfcSanitario')) {
      this.datosSolicitudForm.get('rfcSanitario')?.markAsTouched();
      this.datosSolicitudForm.get('rfcSanitario')?.updateValueAndValidity();
    }

    // Actualiza el estado de validación del formulario
    this.datosSolicitudForm.updateValueAndValidity();

  }

  /**
   * Verifica si todos los campos del formulario (excepto los excluidos) son válidos o están deshabilitados.
   * @returns {boolean} - Retorna `true` si todos los campos requeridos son válidos o están deshabilitados, `false` en caso contrario.
   */
verificarCamposValidosODeshabilitados(): boolean {
  if (!this.datosSolicitudForm) {
    console.warn('Form is not initialized');
    return false;
  }

  // Excluir 'manifiestosCasillaDeVerificacion' solo si el procedimiento NO es 260601
  const EXCLUDED_FIELDS = [
    'aduana',
    'aeropuertoDos',
    'calleYNumero',
    ...(this.idProcedimiento === 260601 ? ['lada'] : []),
    'manifiestosCasillaDeVerificacion',
    'regimenLaMercancia',
    'aviso',
    'licenciaSanitaria',
    'rfcSanitario'
  ];

  const CONTROL_NAMES = Object.keys(this.datosSolicitudForm.controls);

  let allFieldsValidOrDisabled = true;

  CONTROL_NAMES.forEach((controlName: string) => {
    const CONTROL = this.datosSolicitudForm.get(controlName);

    if (!CONTROL) {return;}

    // Omitir los campos excluidos
    if (EXCLUDED_FIELDS.includes(controlName)) {return;}

    // Los campos deshabilitados se consideran automáticamente válidos
    if (CONTROL.disabled) {return;}

    // Se encontró un campo inválido → marcar la validación como fallida
    if (!CONTROL.valid) {
      allFieldsValidOrDisabled = false;
    }
  });
  return allFieldsValidOrDisabled;
}


  /**
   * Emite el evento de acción seleccionada en la solicitud.
   *
   * @param event - Objeto que contiene la fila (`row`) de tipo `TablaOpcionConfig`
   * y la columna (`column`) que disparó la acción.
   *
   * @emits accioneSolitudValor - Envía el evento al componente padre con la información de la acción.
   */
  accionesSolitudValor(event: {
    row: TablaOpcionConfig;
    column: string;
  }): void {
    this.accioneSolitudValor.emit(event);
  }

  /**
  * Abre el modal de selección de mercancía
  */
  abrirMercanciaModal(): void {
    this.mercanciaModalAbierto = true;
    const MODALELEMENT = document.getElementById('mercanciaModal');
    if (MODALELEMENT) {
      const MODAL = new (window as any).bootstrap.Modal(MODALELEMENT);
      MODAL.show();
    }
  }

  /**
  * Cierra el modal de selección de mercancía
  */
  cerrarMercanciaModal(): void {
    this.mercanciaModalAbierto = false;
    this.mercanciaSeleccionada = undefined; // Limpiar selección al cerrar
    const MODALELEMENT = document.getElementById('mercanciaModal');
    if (MODALELEMENT) {
      const MODAL = (window as any).bootstrap.Modal.getInstance(MODALELEMENT);
      if (MODAL) {
        MODAL.hide();
      }
    }
  }

  /**
  * Maneja la selección de mercancía desde el modal
  */
  onMercanciaSeleccionado(mercanciaData: TablaMercanciasDatos): void {
    if (this.mercanciaSeleccionada) {
      // Busque el índice del objeto existente que coincida con TODAS las propiedades
      const INDEX = this.tablaMercanciasConfig.datos.findIndex(
        item => item.id === this.mercanciaSeleccionada?.id
      );

      if (INDEX !== -1) {
        // Reemplace ese objeto específico con los nuevos datos
        this.tablaMercanciasConfig.datos[INDEX] = { ...mercanciaData };
      }

    } else {
      // Agregar nueva mercancía si no hay nada seleccionado
      this.tablaMercanciasConfig.datos = [
        ...this.tablaMercanciasConfig.datos,
        mercanciaData
      ];
    }

    // Actualizar el valor del control del formulario
    this.datosSolicitudForm.get('mercancias')?.setValue(this.tablaMercanciasConfig.datos);

    if (this.mercanciasSeleccionado) {
      this.mercanciasSeleccionado.emit(this.tablaMercanciasConfig.datos);
    }

    // Limpiar selección de mercancía y cerrar modal
    this.mercanciaSeleccionada = undefined;
    this.cerrarMercanciaModal();

    // Forzar detección de cambios
    this.cdr.markForCheck();
  }

  /**
 * Actualiza la tabla después de cambios en la mercancía
 */
  private updateMercanciaTable(): void {
    this.datosSolicitudForm.get('mercancias')?.setValue(this.tablaMercanciasConfig.datos);
    this.datosSolicitudForm.get('mercancias')?.updateValueAndValidity();
  }

  /**
   * Emite un evento con los datos seleccionados de la tabla.
   *
   * Este método recopila las listas seleccionadas de SCIAN, mercancías y opciones,
   * y las emite a través del evento `datosDeTablaSeleccionados` para que puedan ser
   * procesadas por otros componentes o servicios.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Retorna `true` si el control de formulario 'mercancias' es inválido y ha sido tocado o modificado.
   * Útil para determinar cuándo mostrar errores de validación para el campo 'mercancias'.
   *
   * @returns {boolean} Indica si el control 'mercancias' es inválido y ha sido interactuado.
   */
  get isMercanciasInvalid(): boolean {
    const CONTROL = this.datosSolicitudForm.get('mercancias');
    return Boolean(CONTROL?.invalid && (CONTROL?.touched || CONTROL?.dirty));
  }

  /**
   * Indica si el campo No. de licencia sanitaria es obligatorio para el procedimiento 260603.
   */
  @Input() public licenciaSanitariaRequerida: boolean = false;

  /**
   * Devuelve si el campo de licencia sanitaria es requerido (para el template)
   */
  public isLicenciaSanitariaRequired(): boolean {
    // Solo obligatorio si el flag está activo, el procedimiento es 260603 y el checkbox de aviso NO está marcado
    return this.licenciaSanitariaRequerida && this.idProcedimiento === 260603 && !this.datosSolicitudForm?.get('aviso')?.value;
  }

  /**
   * Devuelve si el campo de licencia sanitaria está deshabilitado
   */
  public isLicenciaSanitariaDisabled(): boolean {
    // Deshabilitado si el checkbox de aviso está marcado
    return !!this.datosSolicitudForm?.get('aviso')?.value;
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores en submit.
   */
  public markAllFieldsAsTouched(): void {
    if (this.datosSolicitudForm) {
      this.datosSolicitudForm.markAllAsTouched();
    }
  }
}

/**
 * Valida que el valor del control sea una matriz no vacía.
 *
 * @param {AbstractControl} control - El control de formulario a validar.
 * @returns {ValidationErrors | null} - Retorna un objeto de errores si la validación falla, o `null` si pasa.
 */
export function matrizRequerida(
  control: AbstractControl
): ValidationErrors | null {
  const VALUE = control.value;
  return Array.isArray(VALUE) && VALUE.length === 0 ? { required: true } : null;
}
