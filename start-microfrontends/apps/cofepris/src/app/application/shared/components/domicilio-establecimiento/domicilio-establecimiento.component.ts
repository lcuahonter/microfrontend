import {
  CONDICIONES_JUEGOS_SURTIDOS,
  Catalogo,
  ConfiguracionColumna,
  CrossListLable,
  CrosslistComponent,
  Notificacion,
  NotificacionesComponent,
  REGEX_NUMERO_15_ENTEROS_3_DECIMALES,
  REGEX_SOLO_DIGITOS,
  REGEX_TEXTO_ALFANUMERICO_EXTENDIDO,
  TablaDinamicaComponent,
  TablaSeleccion,
  TipoNotificacionEnum,
  TituloComponent,
  ValidacionesFormularioService,
  doDeepCopy,
  esValidObject,
} from "@libs/shared/data-access-user/src";
import {
  CROSLISTA_DE_PAISES,
  DEFAULT_CONFIGURACION_VISIBILIDAD,
  INPUT_FECHA_CADUCIDAD_CONFIG,
} from "../../constantes/datos-domicilio-legal.enum";

 import {AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from "@angular/core";

import {
  ConfiguracionVisibilidad,
  DATOS_MERCANCIAS,
  MercanciasInfo,
  NICO_TABLA,
  NOMBRES_CAMPOS,
  NicoInfo,
} from "../../models/datos-domicilio-legal.model";
import {
  DatosDomicilioLegalState,
  DatosDomicilioLegalStore,
} from "../../estados/stores/datos-domicilio-legal.store";

import { Subject, map, switchMap, takeUntil } from "rxjs";
import { CatalogoSelectComponent } from "@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component";
import { CommonModule } from "@angular/common";
import { ConsultaioQuery } from "@ng-mf/data-access-user";
import { DatosDomicilioLegalQuery } from "../../estados/queries/datos-domicilio-legal.query";
import { DatosDomicilioLegalService } from "../../services/datos-domicilio-legal.service";
import Modal from "bootstrap/js/dist/modal";
import { ServicioDeFormularioService } from "../../services/forma-servicio/servicio-de-formulario.service";
import { Shared2605Service } from "../../services/shared2605/shared2605.service";
import { TablePaginationComponent } from "@ng-mf/data-access-user";
import { TooltipModule } from "ngx-bootstrap/tooltip";


export interface RespuestaTabla {
  code: number;
  data: NicoInfo[];
  message: string;
}

export interface MercanciasTabla {
  code: number;
  data: MercanciasInfo[];
  message: string;
}

/**
 * Componente para el domicilio del establecimiento.
 */
@Component({
  selector: "app-domicillo",
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    CrosslistComponent,
    TablePaginationComponent,
    TooltipModule,
    NotificacionesComponent,
  ],
  templateUrl: "./domicilio-establecimiento.component.html",
  styleUrls: ["./domicilio-establecimiento.component.scss"],
})
export class DomicilioComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
@Output() formValidityChange = new EventEmitter<boolean>();
public mostrarErrores = {
  codigoPostal: false,
  estado: false,
  muncipio: false,
  calle: false,
  telefono: false,
  aduanasEntradas:false ,
  avisoCheckbox: false,
  licenciaSanitaria: false,
};
/**
 * Indica si se deben mostrar los nombres (etiquetas) de los campos en el componente.
 *
 * @description
 * Valor booleano que controla la visibilidad de las etiquetas/nombres de los campos
 * dentro del componente DomicilioEstablecimiento. Usar `true` para mostrar las etiquetas
 * y `false` para ocultarlas.
 *
 * @type {boolean}
 * @default false
 * @public
 *
 * @compodoc
 * @input nombresCampos
 */
nombresCampos:boolean = false;

  @Input() identificacion: boolean = false;
  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  @Input() idProcedimiento!: number;
  
  /**
 * Bandera que indica si el RFC proporcionado desde el componente padre es válido.
 * Se utiliza para controlar la lógica de validación en el formulario.
 */
  @Input() rfcValido: boolean = false;

  /**
 * Bandera que indica si se debe validar el estado dentro del formulario.
 * Se recibe como entrada desde el componente padre y su valor por defecto es verdadero.
 */
  @Input() estadoValidte: boolean = false;

   /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
   public nuevaNotificacion!: Notificacion;

    /*
   * @descripcion Indica si se debe mostrar una notificación.
   */
  mostrarNotificacion = false;

  confirmEliminar: boolean = false;

   /**
   * @property {string[]} seleccionadasPaisDeOriginDatos
   * Lista de países seleccionados como origen.
   */
   public seleccionadasPaisDeOriginDatos: string[] = [];

   /**
   * @property {string[]} seleccionadasPaisfabrica
   * Lista de países seleccionados como origen.
   */
   public seleccionadasPaisfabrica: string[]= [];

   /**
   * @property {string[]} seleccionadasPaisElaboracion
   * Lista de países seleccionados como origen.
   */
   public seleccionadasPaisElaboracion: string[] = [];

   /**
   * @property {string[]} seleccionadasPaisProveedor
   * Lista de países seleccionados como origen.
   */
   public seleccionadasPaisProveedor: string[] = [];

   /**
   * @property {string[]} seleccionadasPaisDeProcedenciaDatos
   * Lista de países seleccionados como origen.
   */
   seleccionadasPaisDeProcedenciaDatos: string[] = [];
  /**
   * Indica si el campo GarantiasOfrecidasVisible es visible.
   */
  @Input() tieneUsoEspecifico: boolean = true;
  /**
   * Indica si el campo GarantiasOfrecidasVisible es visible.
   */
  @Input() isGarantiasOfrecidasVisible: boolean = false;
  /**
   * Indica si el campo AvisoLicenciaVisible es visible.
   */
  @Input() isAvisoLicenciaVisible: boolean = true;

  /**
   * Indica si el campo AduanasEntradaVisible es visible.
   */
  @Input() isAduanasEntradaVisible: boolean = false;

  /**
   * Referencia a los componentes de la lista de fechas.
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
   * Indica si se debe mostrar el número de registro en la interfaz.
   */
  @Input() mostrarNumeroRegistro: boolean = true;

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: DatosDomicilioLegalState;

  /**
   * Notificador para destruir observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constante para el mensaje de alerta.
   */
  INPUT_FECHA_CADUCIDAD_CONFIG = INPUT_FECHA_CADUCIDAD_CONFIG;
  /**
   * Configuración de visibilidad de los campos.
   */
  @Input() configuracionVisibilidad: ConfiguracionVisibilidad =
    DEFAULT_CONFIGURACION_VISIBILIDAD;

  /**
   * Indica si el campo esPaginacionVisible es visible.
   */
  @Input() esPaginacionVisible: boolean = false;

  /**
   * Indica si la sección de domicilio debe estar habilitada.
   * Cuando se establece en `true`, los campos de domicilio estarán disponibles para ingresar datos.
   * Este valor normalmente lo proporciona un componente padre para controlar el estado habilitado.
   */
  @Input() tieneDomicilioHabilitar: boolean = false;

  /**
   * Número total de elementos en la tabla.
   */
  totalElementos: number = 0;

  /**
   * Página actual de la paginación.
   */
  paginaActual: number = 1;

  /**
   * Cantidad de elementos por página en la paginación.
   */
  elementosPorPagina: number = 5;
  /**
   * Encabezados de la tabla de establecimientos.
   */
  public establecimientoHeaderData: string[] = [];

  /**
   * Contiene los datos del cuerpo de la tabla de establecimientos.
   */
  public establecimientoBodyData = [];

  /** Bandera de solo lectura (puedes adaptarla si tienes lógica para esto) */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Indica si el formulario es de actualización.
   */
  public esFormularioActualizacion: boolean = false;

  /**
   * Indica si el formulario de mercancías ha sido enviado.
   */
  public tieneFormularioMercanciasEnviado: boolean = false;

  /**
   * Datos completos de los establecimientos.
   */
  public fullEstablecimientoBodyData = [];
  estadoFisicoCatalogo: Catalogo[] = [];
  /**
   * Constructor del componente.
   * @param fb
   * @param DatosDomicilioLegalStore
   * @param DatosDomicilioLegalQuery
   * @param service
   */
  constructor(
    public readonly fb: FormBuilder,
    private datosDomicilioLegalStore: DatosDomicilioLegalStore,
    private datosDomicilioLegalQuery: DatosDomicilioLegalQuery,
    private service: DatosDomicilioLegalService,
    private consultaioQuery: ConsultaioQuery,
    private servicioDeFormularioService: ServicioDeFormularioService,
    private validacionesService: ValidacionesFormularioService,
    private sharedSvc: Shared2605Service
  ) {
    // Inicializa el formulario.
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.esFormularioActualizacion = seccionState.update;
          this.inicializarEstadoFormulario();
        }),
      )
      .subscribe();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de estados.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
     * Método para obtener el catálogo de estado físico de mercancía.
     */
    obtenerEstadoFisicoCatalogo(): void {
      if (this.idProcedimiento && this.estadoValidte) {
        this.service.estadoFisicoMercanciaCatalogo(this.idProcedimiento.toString())
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe((response) => {
            this.estadoFisicoCatalogo = response.datos ?? [];
          });
      }
    }

  /**
   * Método para obtener el valor de la fecha seleccionada.
   */
  obtenerDataMercanciasDatos(): void {
    this.service
      .getObtenerDataMercanciasDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.mercanciasTablaDatos = data?.data;
      });
  }

  /**
   * Carga datos y deshabilita el formulario si es solo lectura.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.domicilio.disable();
    }
  }

  /**
   * Inicializa el formulario reactivo para capturar el estado seleccionado.
   */
  inicializarFormulario(): void {
    this.datosDomicilioLegalQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          if (seccionState.nicoTabla.length) {
            this.nicoTablaDatos = seccionState.nicoTabla;
          }
          if (seccionState.mercanciaTabla.length) {
            this.mercanciasTablaDatos = seccionState.mercanciaTabla;
          }
          if(this.domicilio){
        this.domicilio.patchValue(
        {
          codigoPostal: seccionState.codigoPostal,
          estado: seccionState.estado,
          muncipio: seccionState.muncipio,
          localidad: seccionState.localidad,
          colonia: seccionState.colonia,
          calle: seccionState.calle,
          lada: seccionState.lada,
          telefono: seccionState.telefono,
          regimen: seccionState.regimen,
          aduanasEntradas: seccionState.aduanaId ?? [],
          numeroPermiso: seccionState.numeroPermiso,
          paisDeOriginDatos: seccionState.paisDeOriginDatos ?? [],
          paisDeProcedenciaDatos: seccionState.paisDeProcedenciaDatos ?? [],
          avisoCheckbox: seccionState.avisoCheckbox,
          licenciaSanitaria: seccionState.licenciaSanitaria
        },
      );
      }
        this.seleccionadasAduanasEntradaDatos = this.solicitudState?.aduanasDeEntrada || [];
        }),
      )
      .subscribe();
    this.configurarFormularioDomicillio();
  }
  /** Valida Código Postal: permite cualquier valor, pero si es numérico debe tener 5 dígitos; retorna error si no cumple. */
static codigoPostalValidator(control: AbstractControl): ValidationErrors | null {
   const VALOR = control.value;
  if (!VALOR) { return null; }
  if (!/^\d{1,12}$/.test(VALOR)) {
    return { invalidCodigoPostal: true }; }
  return null;
}


  configurarFormularioDomicillio(): void {
    this.domicilio = this.fb.group({
      codigoPostal: [
        this.solicitudState?.codigoPostal,
        [
          Validators.required,
          Validators.maxLength(12),
          Validators.pattern("^[0-9]+$"),
          DomicilioComponent.codigoPostalValidator
        ],
      ],
      estado: [this.solicitudState?.estado, Validators.required],
      muncipio: [
        this.solicitudState?.muncipio,
        [Validators.required, Validators.maxLength(120)],
      ],
      localidad: [
        this.solicitudState?.localidad,
        [Validators.pattern(REGEX_TEXTO_ALFANUMERICO_EXTENDIDO)],
      ],
      colonia: [
        this.solicitudState?.colonia,
        [Validators.pattern(REGEX_TEXTO_ALFANUMERICO_EXTENDIDO)],
      ],
      calle: [
        this.solicitudState?.calle,
        [Validators.required, Validators.maxLength(100)],
      ],
      lada: [this.solicitudState?.lada,Validators.maxLength(5)],
      telefono: [
        this.solicitudState?.telefono,
        [
          Validators.required,
          Validators.maxLength(this.idProcedimiento === 260513 ? 24 : 30),
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        ],
      ],
      regimen: [this.solicitudState?.regimen],
      aduanasEntradas: [this.solicitudState?.aduanasEntradas || [], [Validators.required]],
      numeroPermiso: [this.solicitudState?.numeroPermiso],
      paisDeOriginDatos: [this.solicitudState?.paisDeOriginDatos || []],
      paisDeProcedenciaDatos:[this.solicitudState?.paisDeProcedenciaDatos || []]
    });
    this.seleccionadasAduanasEntradaDatos = JSON.parse(JSON.stringify(this.solicitudState?.aduanasDeEntrada || []));
    if (this.isGarantiasOfrecidasVisible) {
      this.domicilio.addControl(
        "garantiasOfrecidas",
        this.fb.control(this.solicitudState?.garantiasOfrecidas, [Validators.required]),
      );
    }

    if (this.isAvisoLicenciaVisible) {
      this.domicilio.addControl(
        "avisoCheckbox",
        this.fb.control(this.solicitudState?.avisoCheckbox),
      );
      this.domicilio.addControl(
        "licenciaSanitaria",
        this.fb.control(this.solicitudState?.licenciaSanitaria),
      );
    }

    /**
     * Configura el grupo de formularios 'domicilio' con controles y validadores según el estado actual de la solicitud.
     */
    if (this.tieneDomicilioHabilitar) {
      this.domicilio.disable();
    }
    /**
     * Añade el control 'numeroRegistro' al formulario 'domicilio' si la propiedad
     * `mostrarNumeroRegistro` es verdadera.
     *
     * El control incluye las siguientes validaciones:
     * - Requerido (`Validators.required`)
     * - Longitud máxima de 50 caracteres (`Validators.maxLength(50)`)
     */

    this.servicioDeFormularioService.registerForm(
      "domicilioForm",
      this.domicilio,
    );
    this.servicioDeFormularioService.formTouched$.subscribe((formName) => {
      if (formName === "domicilioForm") {
        this.domicilio.markAllAsTouched();
      }
    });
  }

  /**
   * compo doc
   * @method esValido
   * @description
   * Verifica si un campo específico del formulario es válido.
   * @param campo El nombre del campo que se desea validar.
   * @returns {boolean | null} Un valor booleano que indica si el campo es válido.
   */
  public esValido(campo: string): boolean | null {
    return this.validacionesService.isValid(this.domicilio, campo);
  }

  /**
   * Grupo de formularios principal.
   * @property {FormGroup} domicilio
   */
  domicilio!: FormGroup;

  /**
   * Lista de países disponibles para la selección de origen.
   */
  public seleccionarAduanasEntrada: string[] = [];

  /** Lista del catálogo de aduanasEntradas disponible para su uso en el componente o en formularios relacionados. */
  public aduanaCatalogo: Catalogo[] = [];

  /**
   * Botones para gestionar la lista cruzada de países de origen.
   */
  aduanasEntradaBotons = [
    {
      btnNombre: "Agregar todos",
      class: "btn-default",
      funcion: (): void => this.crossList.toArray()[0].agregar("t"),
    },
    {
      btnNombre: "Agregar selección",
      class: "btn-primary",
      funcion: (): void => this.crossList.toArray()[0].agregar(""),
    },
    {
      btnNombre: "Restar selección",
      class: "btn-primary",
      funcion: (): void => this.crossList.toArray()[0].quitar(""),
    },
    {
      btnNombre: "Restar todos",
      class: "btn-default",
      funcion: (): void => this.crossList.toArray()[0].quitar("t"),
    },
  ];

  /**
   * Etiquetas para la lista cruzada de países de origen.
   */
  public aduanasEntradaLabel: CrossListLable = {
    tituluDeLaIzquierda: "Aduanas de entrada disponibles:",
    derecha: "Aduanas de entrada seleccionadas*:",
  };

  /**
   * Lista de países seleccionados como origen.
   */
  public seleccionadasAduanasEntradaDatos: string[] = [];

  /**
   * Maneja el evento de cambio para las entradas de aduanasEntradas seleccionadas.
   * Actualiza el estado interno y el control del formulario con los eventos proporcionados.
   *
   * @param events - Un arreglo de cadenas que representan las entradas de aduanasEntradas seleccionadas.
   */
  aduanasEntradaSeleccionadasChange(events: string[]): void {
    this.mostrarErrores.aduanasEntradas =false;
    this.seleccionadasAduanasEntradaDatos = events;
    const ADUANA_IDS = this.aduanaCatalogo
      .filter(item => events.includes(item.descripcion))
      .map(item => String(item.clave));
    this.datosDomicilioLegalStore.setAduanaId(ADUANA_IDS);
    this.domicilio.patchValue({
      aduanasEntradas: events,
    });
    this.setValoresStore(
      this.domicilio,
      "aduanasEntradas",
      "setAduanasDeEntrada",
    );

     const SELECTEDADUANASOBJ = events
    .map(desc => this.aduanaCatalogo.find(a => a.descripcion === desc))
    .filter((a): a is Catalogo => Boolean(a))
    .map(a => ({ clave: a.clave, descripcion: a.descripcion }));

  this.setValoresStore(
    this.domicilio,
    "SELECTEDADUANASOBJ",
    "setAduanasDeEntradaObj"
  );
  const control = this.domicilio.get('aduanasEntradas');
  if (control) {
    control.clearValidators();
    control.updateValueAndValidity();
  }
  }

  /**
   * Grupo de formularios para el agente aduanal.
   */
  formAgente!: FormGroup;

  /**
   * Grupo de formularios para las mercancias.
   */
  formMercancias!: FormGroup;

  /**
   * Control de formulario para la aduanasDeEntradaFecha.
   */
  aduanasDeEntradaFecha: FormControl = new FormControl("");

  /**
   * Control de formulario para la fecha aduanasDeEntradaFechaSeleccionada.
   */
  aduanasDeEntradaFechaSeleccionada: FormControl = new FormControl("");

  /**
   * Control de formulario para la aduanasDeEntradaFechaSeleccionada.
   */
  estado: Catalogo[] = [];

   /**
   * Control de formulario para la clave scian.
   */
  public claveScianLista: Catalogo[] = [];

  /**
   * Control de formulario para la clave scian.
   */
  public UMCLista: Catalogo[] = [];

  /** Lista de elementos del catálogo de clasificación toxicológica disponibles en el componente. */
  public clasificacionToxicologicaLista: Catalogo[] = [];

  /** Lista de elementos del catálogo de objeto de importación disponibles para su selección en el formulario. */
  public objetoImportacionLista: Catalogo[] = [];

  /**
   * Tabla de selección de checkbox.
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Tabla de selección de radio.
   */
  nicoTabla: ConfiguracionColumna<NicoInfo>[] = NICO_TABLA;

  /**
   * Datos de la tabla de selección de radio.
   */
  nicoTablaDatos: NicoInfo[] = [];
  nicoTablaDatosCheck:boolean = false;

  /**
   * Tabla de selección de checkbox.
   */
  mercanciasTabla: ConfiguracionColumna<MercanciasInfo>[] = DATOS_MERCANCIAS;

  /**
   * Datos de la tabla de selección de checkbox.
   */
  mercanciasTablaDatos: MercanciasInfo[] = [];

  mercanciasTablaCheck:boolean = false;

  /**
   * Lista de mercancías seleccionadas.
   */
  public seleccionarlistaMercancias: MercanciasInfo[] = [];

  /**
   * Lista de aduanasEntradas de entrada seleccionadas.
   */
  aduanasDeEntradaSeleccionadas: string[] = [];

  /**
   * Lista de aduanasEntradas de entrada seleccionadas.
   */
  aduanasDeEntradaDatos: string[] = [];

  /**
   * Indica si la sección es colapsable.
   * @property {boolean} colapsable
   */
  colapsable: boolean = false;

  /**
   * Indica si la sección es colapsableDuos.
   * @property {boolean} colapsableDuos
   */
  colapsableDuos: boolean = false;

  /**
   * @property {NicoInfo[]} personaparas - Arreglo que contiene información de personas relacionadas.
   * @description Lista de objetos NicoInfo que representan las personas asociadas al establecimiento.
   * @type {NicoInfo[]}
   */
  personaparas: NicoInfo[] = [];

  /**
   * Indica si la sección es colapsableTres.
   * @property {boolean} colapsableTres
   */
  colapsableTres: boolean = false;
  /**
   * Indica si la sección es colapsableTres.
   * @property {boolean} colapsableTress
   */
  colapsableTress: boolean = false;

  /** Lista del catálogo de países disponible para su uso en el componente o formulario. */
  public paisesCatalogo: Catalogo[] = [];

  /** Arreglo de nombres de países utilizados para operaciones internas o visualización en el componente. */
  public paises: string[] = [];

  /**
   * Lista de paises.
   */
  public crosListaDePaises = CROSLISTA_DE_PAISES;

  /**
   * Lista de rangos de días seleccionarOrigenDelPais.
   */
  seleccionarOrigenDelPais: string[] = [];

  /**
   * Lista de rangos de días seleccionarOrigenDelPaisDuos.
   */
  seleccionarOrigenDelPaisDuos: string[] = this.crosListaDePaises;

  /**
   * Lista de rangos de días seleccionarOrigenDelPaisTres.
   */
  seleccionarOrigenDelPaisTres: string[] = this.crosListaDePaises;

  /**
   * Lista de rangos de días seleccionarOrigenDelPaisCuatro.
   */
  seleccionarOrigenDelPaisCuatro: string[] = this.crosListaDePaises;

  /**
   * Lista de rangos de días seleccionarOrigenDelPaisCinco.
   */
  seleccionarOrigenDelPaisCinco: string[] = [];
  /**
   * Instancia del Modal de Bootstrap utilizada para controlar la visualización y el comportamiento del cuadro de diálogo modal
   * dentro del componente DomicilioEstablecimientoComponent.
   *
   * */
  modalInstance!: Modal; /**
   * Lista de mercancías agregadas por el usuario.
   */
  listaMercancias: MercanciasInfo[] = [];
  /**
   * Etiqueta de la lista de fechas.
   * */
  public paisDeProcedenciaLabel: CrossListLable = {
    tituluDeLaIzquierda: "País productor del ingrediente activo:",
    derecha: "País(es) seleccionado(s)*:",
  };

  /**
   * Etiqueta de la lista de fechas.
   * */
  public paisDeDondeLabel: CrossListLable = {
    tituluDeLaIzquierda: "País donde se elabora el producto(FORMULADO):",
    derecha: "País(es) seleccionado(s)*:",
  };

  /**
   * Etiqueta de la lista de fechas.
   * */
  public paisOrigenLabel: CrossListLable = {
    tituluDeLaIzquierda: "País de origen:",
    derecha: "País(es) seleccionado(s)*:",
  };

  /**
   * Etiqueta de la lista de fechas.
   * */
  public paisEmbarqueLabel: CrossListLable = {
    tituluDeLaIzquierda: "País de procedencia:",
    derecha: "País(es) seleccionado(s)*:",
  };

  /**
   * Objeto que representa la configuración de etiquetas para la selección del país donde se elabora el producto.
   *
   * @property {string} tituluDeLaIzquierda - Etiqueta que se muestra a la izquierda, indicando el título "país donde se elabora el producto".
   * @property {string} derecha - Etiqueta que se muestra a la derecha, indicando los países seleccionados.
   */
  public paisDondeSeElabora: CrossListLable = {
    tituluDeLaIzquierda: "País donde se elabora el producto:",
    derecha: "País(es) seleccionado(s)*:",
  };

  /**
   * Objeto que representa la configuración de la lista cruzada para el campo "País de procedencia".
   *
   * @property {string} tituluDeLaIzquierda - Etiqueta que se muestra en el lado izquierdo de la lista, indicando el país de procedencia.
   * @property {string} derecha - Etiqueta que se muestra en el lado derecho de la lista, indicando los países seleccionados.
   */
  public paisDeProcedencia: CrossListLable = {
    tituluDeLaIzquierda: "País de procedencia:",
    derecha: "País(es) seleccionado(s)*:",
  };

  /**
   * @method
   * @description
   * Muestra el modal asociado al modelo de clave.
   *
   * @returns {void}
   *
   * @memberof DomicilioEstablecimientoComponent
   */
  public mostrarModeloClave(): void {
    this.modalInstance.show();
  }

  /**
   * Objeto que representa la configuración de etiquetas para la selección de país de origen.
   *
   * @property {string} tituluDeLaIzquierda - Etiqueta que se muestra a la izquierda, indicando el título "País de origen".
   * @property {string} derecha - Etiqueta que se muestra a la derecha, indicando los países seleccionados.
   */
  public paisDeOrigen: CrossListLable = {
    tituluDeLaIzquierda: "País de origen:",
    derecha: "País(es) seleccionado(s)*:",
  };

  /**
   * Catálogo de fracciones arancelarias y sus descripciones.
   * @property {Array<{ fraccion: string, descripcion: string }>} fraccionesCatalogo
   */
  fraccionesCatalogo = [
    { fraccion: "0101.21.01", descripcion: "Caballos de carrera" },
    { fraccion: "0201.30.00", descripcion: "Carne de bovino congelada" },
    { fraccion: "0402.10.01", descripcion: "Leche en polvo, sin azúcar" },
    { fraccion: "1006.30.99", descripcion: "Arroz semiblanqueado" },
  ];
  /**
   * Estado de colapsabilidad para los diferentes países.
   */
  public paisDeOriginColapsable: boolean = false;
  /**
   * Estado de colapsabilidad para el país donde se fabrica.
   */
  public paisDoneFabricaColapsable: boolean = false;
  /**
   * Indica si la sección colapsable para el "País donde se elabora el producto" está expandida o colapsada.
   * Cuando es `true`, la sección está expandida; cuando es `false`, está colapsada.
   */
  public paisDoneProductoColapsable: boolean = false;
  /**
   * Estado de colapsabilidad para el país proveedor.
   */
  public paisProveedorColapsable: boolean = false;
  /**
   * Estado de colapsabilidad para el país de procedencia.
   * Cuando es `true`, la sección está expandida; cuando es `false`, está colapsada.
   */
  public paisProcedenciaDelColapsable: boolean = false;
  /**
   * Etiqueta de la lista de fechas.
   * */
  ngOnInit(): void {
    this.datosDomicilioLegalQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        }),
      )
      .subscribe();

    this.service.event$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((valor) => {
          this.tieneDomicilioHabilitar = valor as boolean;
          if (!this.tieneDomicilioHabilitar && this.esFormularioSoloLectura === false) {
            this.domicilio.enable();
          }
        }),
      )
      .subscribe();
      this.domicilio.valueChanges.subscribe(() => {
          this.mostrarErrores.codigoPostal = false;
    this.mostrarErrores.estado = false;
    this.mostrarErrores.muncipio = false;
    this.mostrarErrores.calle = false;
    this.mostrarErrores.telefono = false;
    this.mostrarErrores.avisoCheckbox = false;
    this.mostrarErrores.licenciaSanitaria = false;
      })
    this.obtenerEstadoList();
    this.obtenerClaveSvian();
    this.obtenerUMCList(); 
    this.obtenerAduanas();
    this.obtenerClasificacionToxicologica();
    this.obtenerObjetoImportacion();
    this.obtenerpaisesLista();
    this.obtenerMercanciasDatos();
    this.configurarFormularioDomicillio();
    this.obtenerEstadoFisicoCatalogo();
    this.formAgente = this.fb.group({
      claveScianModal: [
        this.solicitudState?.claveScianModal,
        Validators.required,
      ],
      claveDescripcionModal: [
        { value: this.solicitudState?.claveDescripcionModal, disabled: true },
        Validators.required,
      ],
    });
    this.formMercancias = this.fb.group({
      nombreComercial: [""],
      nombreComun: [""],
      nombreCientifico: [""],
      fraccionArancelaria: [
        "",
        [
          Validators.required,
          Validators.pattern(REGEX_SOLO_DIGITOS),
          Validators.minLength(8),
        ],
      ],

      descripcionFraccion: [{ value: "", disabled: true }],
      cantidadUMT: [
        "",
        [
          Validators.required,
          Validators.pattern(REGEX_NUMERO_15_ENTEROS_3_DECIMALES),
        ],
      ],
      UMT: [{ value: "", disabled: true }],
      cantidadUMC: [
        "",
        [
          Validators.required,
          Validators.pattern(REGEX_NUMERO_15_ENTEROS_3_DECIMALES),
        ],
      ],
      UMC: ["", Validators.required],
      porcentajeConcentracion: [
        "",
        [Validators.required, Validators.maxLength(100)],
      ],
      clasificacionToxicologica: ["", Validators.required],
      objetoImportacion: ["", Validators.required],
         estadoFisico: [
       "",
    this.estadoValidte ? [Validators.required] : [],
      ],
      estadoFisicoOtro: [
     "",
        [Validators.maxLength(100)],
      ],
      objetoImportacionOtro: [
       "",
        [Validators.maxLength(100)],
      ],
      numeroRegistroSanitario:[],
      numeroCas: [],
    });

    /**
     * Si la propiedad `mostrarNumeroRegistro` es verdadera, agrega el control
     * `numeroRegistro` al formulario `formMercancias`.
     *
     * Este control se inicializa con un valor vacío y contiene las siguientes validaciones:
     * - `Validators.required`: el campo es obligatorio.
     * - `Validators.maxLength(50)`: el valor no debe superar los 50 caracteres.
     */
    if (this.mostrarNumeroRegistro) {
      this.formMercancias.addControl(
        "numeroRegistro",
        this.fb.control(
          "",
          this.idProcedimiento === 260509
            ? [Validators.maxLength(50)]
            : [Validators.required, Validators.maxLength(50)]
        )
      );
    }

    if (this.configuracionVisibilidad.paisOrigen) {
      this.formMercancias.addControl(
        "paisDeOriginDatos",
        this.fb.control(this.seleccionadasPaisDeOriginDatos, [Validators.required]),
      );
    }

    if (this.configuracionVisibilidad.paisFabrica) {
      this.formMercancias.addControl(
        "paisFabrica",
        this.fb.control(this.seleccionadasPaisfabrica, [Validators.required]),
      );
    }

    if (this.configuracionVisibilidad.paisElaboracion) {
      this.formMercancias.addControl(
        "paisElaboracion",
        this.fb.control(this.seleccionadasPaisElaboracion, [Validators.required]),
      );
    }

    if (this.configuracionVisibilidad.paisProveedor) {
      this.formMercancias.addControl(
        "paisProveedor",
        this.fb.control(this.seleccionadasPaisProveedor, [Validators.required]),
      );
    }

    if (this.configuracionVisibilidad.paisProcedencia) {
      this.formMercancias.addControl(
        "paisDeProcedenciaDatos",
        this.fb.control(this.seleccionadasPaisDeProcedenciaDatos, [Validators.required]),
      );
    }

    if(this.tieneUsoEspecifico) {
      this.formMercancias.addControl(
        "usoEspecifico",
        this.fb.control(
          "",
          this.idProcedimiento === 260509
            ? [Validators.maxLength(1000)]
            : [Validators.required, Validators.maxLength(1000)]
        )
      );
    }



    this.seleccionadasAduanasEntradaDatos =
      this.solicitudState?.aduanasDeEntrada;

    this.inicializarEstadoFormulario();
    
  if (Array.isArray(this.solicitudState.aduanasDeEntrada) && this.solicitudState.aduanasDeEntrada.length>0)
  {
    this.aduanasEntradaSeleccionadasChange(this.solicitudState.aduanasDeEntrada);
    
  }
const aduanasDeEntrada = this.datosDomicilioLegalStore.getValue()?.paisDeOriginDatos;
if (Array.isArray(aduanasDeEntrada) && aduanasDeEntrada.length>0 && this.solicitudState.aduanasDeEntrada.length==0) {
 this.aduanasEntradaSeleccionadasChange(aduanasDeEntrada)
}
  this.formValidityChange.emit(this.domicilio.valid);
   this.sharedSvc.domicilioValidity=this.domicilio.valid;
  }

/**
   * Valida un campo del formulario.
   *
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }
  /**
   * @method cerrarModalScian
   * @description Oculta el modal relacionado con el catálogo SCIAN.
   * @returns {void}
   *
   * @memberof DomicilioEstablecimientoComponent
   */
  cerrarModalScian(): void {
    this.modalInstance.hide();
  }

  /**
   * @method limpiarScianForm
   * @description Limpia y reinicia el formulario asociado al agente SCian.
   * @returns {void}
   *
   * @memberof DomicilioEstablecimientoComponent
   */
  limpiarScianForm(): void {
    Object.keys(this.formAgente.controls).forEach((key) => {
      this.formAgente.get(key)?.setValue(null);
    });
  }

  /**
   * Guarda los datos del formulario del agente SCIAN en la tabla Nico.
   *
   * Si el formulario `formAgente` es válido, crea un nuevo objeto `NicoInfo` con los valores
   * de los campos `claveScianModal` y `claveDescripcionModal`, lo agrega al arreglo `nicoTablaDatos`,
   * limpia el formulario y cierra el modal correspondiente.
   *
   * @returns {void}
   * @memberof DomicilioComponent
   */
  guardarScian(): void {
    if (this.formAgente.valid) {
      const NUEVO_DATO: NicoInfo = {
        clave_Scian: this.formAgente.get("claveScianModal")?.value,
        descripcion_Scian: this.formAgente.get("claveDescripcionModal")?.value,
      };

      const EXISTS = this.nicoTablaDatos.some(
        (item) =>
          item.clave_Scian === NUEVO_DATO.clave_Scian &&
          item.descripcion_Scian === NUEVO_DATO.descripcion_Scian,
      );

      if (!EXISTS) {
        this.nicoTablaDatos.push(NUEVO_DATO);
        this.nicoTablaDatos = [...this.nicoTablaDatos];
        this.datosDomicilioLegalStore.setNicoTabla(this.nicoTablaDatos);
        this.formAgente.reset();
        this.cerrarModalScian();
    } else {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: 'info',
        modo: '',
        titulo: 'Alerta',
        mensaje: 'Datos duplicados.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-sm'
      };
      this.mostrarNotificacion = true;
      this.formAgente.reset();
      
    }
      //this.nicoTablaDatos.push(NUEVO_DATO);
      this.nicoTablaDatos = [...this.nicoTablaDatos];
      
     
    }

    this.formMercancias
      .get("fraccionArancelaria")
      ?.valueChanges.subscribe((valor: string) => {
        const MATCHED = this.fraccionesCatalogo.find((item) =>
          item.fraccion.startsWith(valor),
        );
        const DESCRIPCION = MATCHED ? MATCHED.descripcion : "";
        this.formMercancias.get("descripcionFraccion")?.setValue(DESCRIPCION);
      });
  }

  /**
   * Botones de acción disponibles para gestionar las listas de fechas.
   */
  readonly paisDeProcedenciaBotones = [
    {
      btnNombre: "Agregar todos",
      class: "btn-default uno",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("uno");
          })
        ].agregar("t"),
    },
    {
      btnNombre: "Agregar selección",
      class: "btn-primary uno",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("uno");
          })
        ].agregar(""),
    },
    {
      btnNombre: "Restar selección",
      class: "btn-primary uno",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("uno");
          })
        ].quitar(""),
    },
    {
      btnNombre: "Restar todos",
      class: "btn-default uno",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("uno");
          })
        ].quitar("t"),
    },
  ];

  /**
   * Botones de acción disponibles para gestionar las listas de fechas.
   */
  readonly paisDeProcedenciaBotonesDuos = [
    {
      btnNombre: "Agregar todos",
      class: "btn-default duos",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("duos");
          })
        ].agregar("t"),
    },
    {
      btnNombre: "Agregar selección",
      class: "btn-primary duos",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("duos");
          })
        ].agregar(""),
    },
    {
      btnNombre: "Restar selección",
      class: "btn-primary duos",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("duos");
          })
        ].quitar(""),
    },
    {
      btnNombre: "Restar todos",
      class: "btn-default duos",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("duos");
          })
        ].quitar("t"),
    },
  ];

  /**
   * Botones de acción disponibles para gestionar las listas de fechas.
   */
  readonly paisDeProcedenciaBotonesTres = [
    {
      btnNombre: "Agregar todos",
      class: "btn-default tres",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("tres");
          })
        ].agregar("t"),
    },
    {
      btnNombre: "Agregar selección",
      class: "btn-primary tres",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("tres");
          })
        ].agregar(""),
    },
    {
      btnNombre: "Restar selección",
      class: "btn-primary tres",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("tres");
          })
        ].quitar(""),
    },
    {
      btnNombre: "Restar todos",
      class: "btn-default tres",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("tres");
          })
        ].quitar("t"),
    },
  ];
  /**
   * Botones de acción disponibles para gestionar las listas de fechas.
   */
  readonly paisDeProcedenciaBotonesCuatro = [
    {
      btnNombre: "Agregar todos",
      class: "btn-default cuatro",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("cuatro");
          })
        ].agregar("t"),
    },
    {
      btnNombre: "Agregar selección",
      class: "btn-primary cuatro",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("cuatro");
          })
        ].agregar(""),
    },
    {
      btnNombre: "Restar selección",
      class: "btn-primary cuatro",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("cuatro");
          })
        ].quitar(""),
    },
    {
      btnNombre: "Restar todos",
      class: "btn-default cuatro",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("cuatro");
          })
        ].quitar("t"),
    },
  ];

  /**
   * Botones de acción disponibles para gestionar las listas de fechas.
   */
  readonly paisDeProcedenciaBotonesCinco = [
    {
      btnNombre: "Agregar todos",
      class: "btn-default cinco",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("cinco");
          })
        ].agregar("t"),
    },
    {
      btnNombre: "Agregar selección",
      class: "btn-primary cinco",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("cinco");
          })
        ].agregar(""),
    },
    {
      btnNombre: "Restar selección",
      class: "btn-primary cinco",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("cinco");
          })
        ].quitar(""),
    },
    {
      btnNombre: "Restar todos",
      class: "btn-default cinco",
      funcion: (): void =>
        this.crossList.toArray()[
          this.crossList.toArray().findIndex((item, ind) => {
            return item.botones?.[0]?.class.includes("cinco");
          })
        ].quitar("t"),
    },
  ];

  /**
   * Método para obtener el valor de la fecha seleccionada.
   * @param event
   */
  obtenerEstadoList(): void {
    if (this.idProcedimiento) {
    this.service
      .obtenerEstadoList(this.idProcedimiento?.toString())
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.estado = data.datos ?? [];
      });
    } else {
      this.service
      .getObtenerEstadoList()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.estado = data;
      });
    }
  }

  /**
   * Método para obtener el valor de clave scian.
   * @param event
   */
  obtenerClaveSvian(): void {
    if (this.idProcedimiento) {
      this.service
      .getClaveSvianList(this.idProcedimiento?.toString())
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.claveScianLista = data.datos ?? [];
      });
    }
  }

  /**
   * Método para obtener el valor de UMC.
   * @param event
   */
  obtenerUMCList(): void {
    if (this.idProcedimiento) {
      this.service
      .getUMCList(this.idProcedimiento?.toString())
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.UMCLista = data.datos ?? [];
      });
    }
  }

  /**
   * Método para obtener el valor de aduana.
   * @param event
   */
  obtenerAduanas(): void {
    if (this.idProcedimiento) {
      this.service
      .getAduanasList(this.idProcedimiento?.toString())
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.aduanaCatalogo = data.datos ?? [];
        this.seleccionarAduanasEntrada = this.aduanaCatalogo.map(item => item.descripcion);
          let aduanas = this.solicitudState?.aduanasDeEntrada;
          if (aduanas && !Array.isArray(aduanas)) {
            aduanas = [aduanas];
          }
          this.seleccionadasAduanasEntradaDatos = (aduanas || []).map(String);
          if (this.domicilio) {
            this.domicilio.patchValue({
              aduanasEntradas: this.seleccionadasAduanasEntradaDatos,
            });
          }
        });
    } else {
      this.seleccionarAduanasEntrada = CROSLISTA_DE_PAISES;
      let aduanas = this.solicitudState?.aduanasDeEntrada;
      if (aduanas && !Array.isArray(aduanas)) {
        aduanas = [aduanas];
      }
      this.seleccionadasAduanasEntradaDatos = (aduanas || []).map(String);
      if (this.domicilio) {
        this.domicilio.patchValue({
          aduanasEntradas: this.seleccionadasAduanasEntradaDatos,
        });
      }
    }
  }

  /**
   * Método para obtener el valor de clasificacion toxicologica.
   * @param event
   */
  obtenerClasificacionToxicologica(): void {
    if (this.idProcedimiento) {
      this.service
      .getClasificacionToxicologicaList(this.idProcedimiento?.toString())
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.clasificacionToxicologicaLista = data.datos ?? [];
      });
    }
    


  }

  /**
   * Método para obtener el valor de objeto importacion.
   * @param event
   */
  obtenerObjetoImportacion(): void {
    if (this.idProcedimiento) {
      this.service
      .getObjetoImportacionList(this.idProcedimiento?.toString())
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.objetoImportacionLista = data.datos ?? [];
      });
    }
  }

  /**
   * Método para obtener el valor de paises.
   * @param event
   */
  obtenerpaisesLista(): void {
    if (this.idProcedimiento) {
      this.service
      .getPaisesList(this.idProcedimiento?.toString())
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.paisesCatalogo = data.datos ?? [];
        this.paises = this.paisesCatalogo.map(item => item.descripcion);
        this.seleccionarOrigenDelPais = this.paises;
        this.seleccionarOrigenDelPaisCinco = this.paises;
      });
    } else {
      this.seleccionarOrigenDelPais = this.crosListaDePaises;
      this.seleccionarOrigenDelPaisCinco = this.crosListaDePaises;
    }
  }


  /**
   * @method onClaveScianChange
   * @description Maneja el evento de cambio del dropdown y actualiza el campo de descripción.
   * @param {Event} event - Evento de cambio del dropdown.
   */
  onClaveScianChange(event: Event): void {
    const SELECTED_VALUE = (event.target as HTMLSelectElement).value;
    let SELECTED_OPTION;
    if (this.idProcedimiento) {
      SELECTED_OPTION = this.claveScianLista?.find((item) => Number(item.clave) === Number(SELECTED_VALUE));
    } else {
      SELECTED_OPTION = this.estado?.find((item) => item.id === Number(SELECTED_VALUE));
    }

    if (SELECTED_OPTION) {
      this.formAgente.patchValue({
        claveDescripcionModal: SELECTED_OPTION.descripcion,
      });
    }
  }
  /**
   * Método para obtener el valor de la fecha seleccionada.
   */

  /**
   * Método para obtener el valor de la fecha seleccionada.
   */
  obtenerMercanciasDatos(): void {
    this.mercanciasTablaDatos = this.listaMercancias;
  }

  /**
   * Método para obtener el valor de la fecha seleccionada.
   * @param event
   */
  onAvisoCheckboxChange(event: Event): void {
    const CHECKBOX = event.target as HTMLInputElement;
    const LICENCIA_SANITARIA_CONTROL = this.domicilio.get("licenciaSanitaria");
    if (CHECKBOX.checked) {
      LICENCIA_SANITARIA_CONTROL?.clearValidators();
      LICENCIA_SANITARIA_CONTROL?.updateValueAndValidity();
      LICENCIA_SANITARIA_CONTROL?.disable();
      this.servicioDeFormularioService.updateControlValidator(
        "domicilioForm",
        "licenciaSanitaria",
        [],
      );
    } else {
      LICENCIA_SANITARIA_CONTROL?.setValidators([Validators.required]);
      LICENCIA_SANITARIA_CONTROL?.updateValueAndValidity();
      LICENCIA_SANITARIA_CONTROL?.enable();
      this.servicioDeFormularioService.updateControlValidator(
        "domicilioForm",
        "licenciaSanitaria",
        [Validators.required],
      );
    }
  }

  /**
   * Alterna el estado colapsable de la sección del formulario.
   * @method mostrar_colapsable
   */
  mostrar_colapsable(orden: number): void {
    if (orden === 1) {
      this.paisDeOriginColapsable = !this.paisDeOriginColapsable;
    } else if (orden === 2) {
      this.paisDoneFabricaColapsable = !this.paisDoneFabricaColapsable;
    }
    this.colapsable = !this.colapsable;
  }

  /**
   * Alterna el estado colapsable de la sección del formulario.
   * @method mostrar_colapsableDuos
   */
  mostrar_colapsableDuos(): void {
    this.colapsableDuos = !this.colapsableDuos;
    this.paisDoneProductoColapsable = !this.paisDoneProductoColapsable;
  }

  /**
   * Alterna el estado colapsable de la sección del formulario.
   * @method mostrar_colapsableTres
   */
  mostrar_colapsableTres(): void {
    this.colapsableTres = !this.colapsableTres;
    this.paisProveedorColapsable = !this.paisProveedorColapsable;
  }

  /**
   * Alterna el estado colapsable de la sección del formulario.
   * @method mostrar_colapsableTress
   */
  mostrar_procedencia(): void {
    this.colapsableTress = !this.colapsableTress;
    this.paisProcedenciaDelColapsable = !this.paisProcedenciaDelColapsable;
  }
  /**
   * Sets the value of the 'descripcionFraccion' field in the 'formMercancias' form group to the string 'descripcionFraccion'.
   * If the control does not exist, no action is taken.
   */
  setDescripcionFraccion(): void {
    if(this.formMercancias.get("fraccionArancelaria")?.invalid) {
      return;
    }
    const CLAVE_OBJ = {
      clave: this.formMercancias.get("fraccionArancelaria")?.value,
      idProcedimiento: String(this.idProcedimiento)
    };
    this.sharedSvc.getFraccionDescripcion(CLAVE_OBJ.clave, CLAVE_OBJ.idProcedimiento)
      .pipe(
        takeUntil(this.destroyNotifier$),
        switchMap((fraccionResponse) => {
          if (esValidObject(fraccionResponse)) {
            const DATOS = doDeepCopy(fraccionResponse);
            if (esValidObject(DATOS.datos)) {
              this.formMercancias.get("descripcionFraccion")?.setValue(DATOS?.datos?.descripcionAlternativa);
              this.setValoresStore(this.formMercancias, 'descripcionFraccion', 'setDescripcionFraccion');
              return this.sharedSvc.getUnidad(CLAVE_OBJ.clave, CLAVE_OBJ.idProcedimiento);
            } else if (DATOS?.causa) {
              // Limpiar descripcionFraccion, setDescripcionFraccion, UMT y setUMT cuando sean inválidos

              this.formMercancias.get("descripcionFraccion")?.setValue("");
              this.setValoresStore(this.formMercancias, 'descripcionFraccion', 'setDescripcionFraccion');
              this.formMercancias.get("UMT")?.setValue("");
              this.setValoresStore(this.formMercancias, 'UMT', 'setUMT');
              this.mostrarModalCausa(DATOS.causa);
              throw new Error('Fracción call failed: ' + DATOS.causa);
            }
          }
          // También limpiar si no es un objeto válido
          this.formMercancias.get("descripcionFraccion")?.setValue("");
          this.setValoresStore(this.formMercancias, 'descripcionFraccion', 'setDescripcionFraccion');
          this.formMercancias.get("UMT")?.setValue("");
          this.setValoresStore(this.formMercancias, 'UMT', 'setUMT');
          throw new Error('Fracción call failed');
        })
      )
      .subscribe({
        next: (unidadResponse) => {
          const UNIDAD_DATOS = doDeepCopy(unidadResponse);
          if (esValidObject(UNIDAD_DATOS.datos)) {
            this.formMercancias.get("UMT")?.setValue(UNIDAD_DATOS?.datos?.descripcion);
            this.setValoresStore(this.formMercancias, 'UMT', 'setUMT');
          }
        },
        error: (error) => {
          // Esto ya se manejó arriba
        }
      });
  }

  mostrarModalCausa(causa: string): void {
    this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
                     categoria: 'danger',
                     modo: 'action',
                     titulo: 'Dato incorrecto',
                     mensaje: causa,
                     cerrar: true,
                     tiempoDeEspera: 2000,
                     txtBtnAceptar: 'Aceptar',
                     txtBtnCancelar: '',
                     alineacionBtonoCerrar: 'flex-row-reverse'
    };
    this.mostrarNotificacion = true;
  }
  /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof DatosDomicilioLegalStore,
  ): void {
    if(this.formMercancias.getRawValue()?.estadoFisico === '5' && this.estadoValidte ){
        this.formMercancias.get("estadoFisicoOtro")?.setValidators([Validators.required, Validators.maxLength(100)]);
        this.formMercancias.get("estadoFisicoOtro")?.updateValueAndValidity();
      }
      else{
        this.formMercancias.get("estadoFisicoOtro")?.setValidators([]);
        this.formMercancias.get("estadoFisicoOtro")?.updateValueAndValidity();
      }
      if(this.formMercancias.getRawValue()?.objetoImportacion === 'OBIM.OTR' && this.estadoValidte){
        this.formMercancias.get("objetoImportacionOtro")?.setValidators([Validators.required, Validators.maxLength(100)]);
        this.formMercancias.get("objetoImportacionOtro")?.updateValueAndValidity();
      }
      else{
           this.formMercancias.get("objetoImportacionOtro")?.setValidators([]);
        this.formMercancias.get("objetoImportacionOtro")?.updateValueAndValidity();
      }
      let VALOR;
    if (campo === "SELECTEDADUANASOBJ") {
    VALOR = this.seleccionadasAduanasEntradaDatos
      .map(desc => this.aduanaCatalogo.find(a => a.descripcion === desc))
      .filter((a): a is Catalogo => Boolean(a))
      .map(a => ({ clave: a.clave, descripcion: a.descripcion }));
   } else if (campo === "aduanasEntradas") {
    // Always pass an array for aduanasEntradas
    VALOR = Array.isArray(form.get(campo)?.value)
      ? form.get(campo)?.value
      : form.get(campo)?.value ? [form.get(campo)?.value] : [];
  } 
  else if(campo === "SELECTED_PAISES_OBJ"){
    VALOR = this.seleccionadasPaisDeOriginDatos
      .map(desc => this.paisesCatalogo.find(a => a.descripcion === desc))
      .filter((a): a is Catalogo => Boolean(a))
      .map(a => ({ clave: a.clave, descripcion: a.descripcion }));
  }
  else if(campo === "SELECTED_PAISES_PROCEDENCIA_OBJ"){
    VALOR = this.seleccionadasPaisDeProcedenciaDatos
      .map(desc => this.paisesCatalogo.find(a => a.descripcion === desc))
      .filter((a): a is Catalogo => Boolean(a))
      .map(a => ({ clave: a.clave, descripcion: a.descripcion }));
  }
   else {
    VALOR = form.get(campo)?.value;
  }
     (
      this.datosDomicilioLegalStore[metodoNombre] as (
        value: any,
      ) => void
    )(VALOR);
    this.servicioDeFormularioService.setFormValue("domicilioForm", {
      [campo]: VALOR,
    });
    this.formValidityChange.emit(this.domicilio.valid);
  }

  agregarMercanciaModal(): void {
    this.seleccionarlistaMercancias = [];
    this.formMercancias.reset();
    this.openModal();
  }
  cancelarMercancia(): void {
    this.formMercancias.reset();
    this.seleccionadasPaisDeOriginDatos=[];
    this.seleccionadasPaisDeProcedenciaDatos=[];
    this.seleccionadasPaisfabrica=[];
    this.seleccionadasPaisElaboracion=[];
    this.seleccionadasPaisProveedor=[];
    this.modalInstance.hide();

  }
  /** Devuelve la descripción de un elemento del catálogo según su clave.
 * @param lista - Lista de objetos con 'clave' y 'descripcion'.
 * @param clave - Clave del elemento a buscar; retorna '' si no se encuentra.
 */
  public bindDescripcion(lista: Catalogo[],clave: string): string {
  return lista.find(item => item.clave === clave)?.descripcion || '';
  }

  /**
   * Agrega una nueva mercancía a la lista de mercancías si el formulario es válido.
   *
   * - Si el formulario `formMercancias` es válido, obtiene los valores actuales del formulario,
   *   crea un nuevo objeto de mercancía y lo agrega a `listaMercancias`.
   * - Luego, imprime la lista actualizada en la consola y reinicia el formulario.
   *
   * @remarks
   * Este método se utiliza para gestionar la adición dinámica de mercancías en el componente.
   */
  agregarMercancia(): void {
    this.tieneFormularioMercanciasEnviado = true;
    if (!this.formMercancias.invalid) {
      const RAW = this.formMercancias.getRawValue();
      const PAIS_DE_ORIGIN_DATOS_OBJ = (RAW.paisDeOriginDatos || [])
        .map((desc: string) => this.paisesCatalogo.find(p => p.descripcion === desc))
        .filter((p: Catalogo): p is Catalogo => Boolean(p))
        .map((p: Catalogo) => ({ clave: p.clave, descripcion: p.descripcion }));

    const PAIS_DE_PROCEDENCIA_DATOS_OBJ = (RAW.paisDeProcedenciaDatos || [])
      .map((desc: string) => this.paisesCatalogo.find(p => p.descripcion === desc))
      .filter((p: Catalogo): p is Catalogo => Boolean(p))
      .map((p: Catalogo) => ({ clave: p.clave, descripcion: p.descripcion }));

      const NUEVA_MERCANCIA: MercanciasInfo = {
        ...RAW,
        cantidadUmt: RAW.cantidadUMT,
        cantidadUmc: RAW.cantidadUMC,
        umc:this.bindDescripcion(this.UMCLista, RAW.UMC),
        umcClave: RAW.UMC,
        unidadMedidaTarifa: RAW.UMT,
        paisOrigen:RAW.paisProveedor,
      paisProcedenciaUltimoPuerto:RAW.paisDeProcedenciaDatos,
      paisProduccionIngredienteActivo: RAW.paisFabrica,
      paisElaboracionProducto: RAW.paisElaboracion,
      numeroRegistroSanitario:RAW.numeroRegistro,
      numeroCas:RAW.numeroCas,
      porcentajeConcentracion:RAW.porcentajeConcentracion,
      clasificacionToxicologica:this.bindDescripcion(this.clasificacionToxicologicaLista,RAW.clasificacionToxicologica),
      clasificacionToxicologicaClave: RAW.clasificacionToxicologica,
      objetoImportacion: this.bindDescripcion(this.objetoImportacionLista,RAW.objetoImportacion),
      objetoImportacionClave: RAW.objetoImportacion,
      paisDeOriginDatosObj: PAIS_DE_ORIGIN_DATOS_OBJ,
      paisDeProcedenciaDatosObj: PAIS_DE_PROCEDENCIA_DATOS_OBJ,
      estadoFisico: this.bindDescripcion(this.estadoFisicoCatalogo, RAW.estadoFisico),
      estadoFisicoClave: RAW.estadoFisico,
    };
      const INDEX = this.listaMercancias.findIndex(
        (item) =>
          item.fraccionArancelaria === NUEVA_MERCANCIA.fraccionArancelaria,
      );

      if (INDEX !== -1) {
        // Update existing row
        this.listaMercancias[INDEX] = NUEVA_MERCANCIA;
      } else {
        // Add new row
        this.listaMercancias.push(NUEVA_MERCANCIA);
      }
      this.mercanciasTablaDatos = [...this.listaMercancias];
      this.datosDomicilioLegalStore.setMercanciasTabla(this.mercanciasTablaDatos);
      this.formMercancias.reset();
      this.seleccionadasPaisDeOriginDatos=[];
      this.seleccionadasPaisfabrica=[];
      this.seleccionadasPaisElaboracion=[];
      this.seleccionadasPaisProveedor=[];
      this.seleccionadasPaisDeProcedenciaDatos=[];
      
    

      const MODAL_ELEMENT = document.getElementById("modalAddAgentMercancias");
      if (MODAL_ELEMENT) {
        const MODAL_INSTANCE =
          Modal.getInstance(MODAL_ELEMENT) || new Modal(MODAL_ELEMENT);
        MODAL_INSTANCE?.hide();
        setTimeout(() => {
          document
            .querySelectorAll(".modal-backdrop")
            .forEach((el) => el.remove());
          document.body.classList.remove("modal-open");
          document.body.style.removeProperty("overflow");
          document.body.style.removeProperty("padding-right");
        }, 100);
        this.seleccionarlistaMercancias=[];
      }
      this.tieneFormularioMercanciasEnviado = false;
    } else {
      this.formMercancias.markAllAsTouched();
    }
  }

openModal():void {
  const MODAL = new Modal(document.getElementById('modalAddAgentMercancias')!);
  MODAL.show();
}

  /**
   * Actualiza la paginación de la tabla de establecimientos.
   * Corta los datos de la tabla según la página actual y el número de elementos por página.
   */
  /**
   * Actualiza la paginación de la tabla de establecimientos.
   * Corta los datos de la tabla según la página actual y el número de elementos por página.
   */
  actualizarPaginacion(): void {
    const INDICE_INICIAL = (this.paginaActual - 1) * this.elementosPorPagina;
    this.establecimientoBodyData = this.fullEstablecimientoBodyData.slice(
      INDICE_INICIAL,
      INDICE_INICIAL + this.elementosPorPagina,
    );
  }
  /**   * Autocompleta el campo de fracción arancelaria con la descripción correspondiente.
   *   * Si el campo de fracción arancelaria tiene un valor, realiza una solicitud al servicio para obtener
   *   * la descripción asociada y actualiza el formulario con esa información.
   */
  autoCompleteFraccionArancelaria(): void {
    const FRACCION = this.formMercancias.get("fraccionArancelaria")?.value;
    if (FRACCION) {
      this.service
        .getFraccionArancelaria()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((data): void => {
          this.formMercancias.patchValue({
            descripcionFraccion: data?.descripcion,
            UMT: data?.umt,
          });
        });
    }
  }

  /**
   * Método que se ejecuta cuando se cambia de página en la paginación.
   * @param {number} page - Número de la página seleccionada.
   */
  /**
   * Método que se ejecuta cuando se cambia de página en la paginación.
   * @param {number} pagina - Número de la página seleccionada.
   */
  onCambioDePagina(pagina: number): void {
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  /**
   * Método que se ejecuta cuando cambia el número de elementos por página.
   * @param {number} elementosPorPagina - Número de elementos a mostrar por página.
   */
  onCambioElementosPorPagina(elementosPorPagina: number): void {
    this.elementosPorPagina = elementosPorPagina;
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  /**
   * @method limpiar
   * @description
   * Método que limpia el formulario del agente aduanal.
   * @param {forma}
   */
  // eslint-disable-next-line class-methods-use-this
  public limpiar(forma: FormGroup, tipo?: string): void {
    if (forma) {
        if (tipo === 'mercancias') {   
    this.seleccionarOrigenDelPaisDuos = [];
    this.seleccionarOrigenDelPaisTres = [];
    this.seleccionarOrigenDelPaisCuatro = [];
    this.seleccionarOrigenDelPaisCinco = [];
  }
      this.seleccionadasPaisDeOriginDatos = [];
      this.seleccionadasPaisDeProcedenciaDatos = [];
      this.seleccionadasPaisfabrica=[];
      this.seleccionadasPaisElaboracion=[];
      this.seleccionadasPaisProveedor=[];
      forma.reset();
    }
  }

   /**
   * Maneja el evento de cambio para las selecciones de país de procedencia.
   *
   * @param events - Un arreglo de cadenas que representa los países seleccionados.
   *
   * Actualiza la propiedad `seleccionadasPaisDeProcedenciaDatos` con los valores seleccionados
   * y sincroniza el formulario `mercanciaForm` con los datos actualizados.
   */
   paisDeProcedenciaSeleccionadasChange(events: string[]): void {
    this.seleccionadasPaisDeProcedenciaDatos = events;
    const IDS = this.paisesCatalogo
      .filter(item => events.includes(item.descripcion))
      .map(item => String(item.clave));
    this.datosDomicilioLegalStore.setPaisProcedenciaId(IDS);
  this.formMercancias.patchValue({
      paisDeProcedenciaDatos: events,
    });
    this.setValoresStore(
      this.formMercancias,
      "paisDeProcedenciaDatos",
      "setPaisDeProcedenciaDatos",
    );

    const SELECTED_PAISES_PROCEDENCIA_OBJ = events
    .map(desc => this.paisesCatalogo.find(p => p.descripcion === desc))
    .filter((p): p is Catalogo => Boolean(p))
    .map(p => ({ clave: p.clave, descripcion: p.descripcion }));

  
  this.setValoresStore(
    this.formMercancias,
    "SELECTED_PAISES_PROCEDENCIA_OBJ",
    "setPaisDeProcedenciaDatosObj"
  );
  }

  /**
   * Maneja el evento de cambio para las selecciones de país de procedencia.
   *
   * @param events - Un arreglo de cadenas que representa los países seleccionados.
   *
   * Actualiza la propiedad `seleccionadasPaisDeProcedenciaDatos` con los valores seleccionados
   * y sincroniza el formulario `mercanciaForm` con los datos actualizados.
   */
   paisProveedorSeleccionadasChange(events: string[]): void {
    this.seleccionadasPaisProveedor = events;
    const IDS = this.paisesCatalogo
      .filter(item => events.includes(item.descripcion))
      .map(item => String(item.clave));
    this.datosDomicilioLegalStore.setPaisOrigenId(IDS);
    this.formMercancias.patchValue({
      paisProveedor: events,
    });
    this.setValoresStore(
      this.formMercancias,
      "paisProveedor",
      "setPaisProveedor",
    );
  }

  /**
   * Maneja el evento de cambio para las selecciones de país de procedencia.
   *
   * @param events - Un arreglo de cadenas que representa los países seleccionados.
   *
   * Actualiza la propiedad `seleccionadasPaisDeProcedenciaDatos` con los valores seleccionados
   * y sincroniza el formulario `mercanciaForm` con los datos actualizados.
   */
   paisElaboracionSeleccionadasChange(events: string[]): void {
    this.seleccionadasPaisElaboracion = events;
    const IDS = this.paisesCatalogo
      .filter(item => events.includes(item.descripcion))
      .map(item => String(item.clave));
    this.datosDomicilioLegalStore.setPaisElaboraId(IDS);
    this.formMercancias.patchValue({
      paisElaboracion: events,
    });
    this.setValoresStore(
      this.formMercancias,
      "paisElaboracion",
      "setPaisElaboracion",
    );
  }

   /**
   * Maneja el evento de cambio para las selecciones de país de procedencia.
   *
   * @param events - Un arreglo de cadenas que representa los países seleccionados.
   *
   * Actualiza la propiedad `seleccionadasPaisDeProcedenciaDatos` con los valores seleccionados
   * y sincroniza el formulario `mercanciaForm` con los datos actualizados.
   */
   paisfabricaSeleccionadasChange(events: string[]): void {
    this.seleccionadasPaisfabrica = events;
    const IDS = this.paisesCatalogo
      .filter(item => events.includes(item.descripcion))
      .map(item => String(item.clave));
    this.datosDomicilioLegalStore.setPaisIngredienteActivoId(IDS);
    this.formMercancias.patchValue({
      paisFabrica: events,
    });
    this.setValoresStore(
      this.formMercancias,
      "paisFabrica",
      "setPaisFabrica",
    );
  }


   /**
   * Método que se ejecuta cuando cambia la selección de países de origen.
   * Actualiza la lista de países seleccionados y sincroniza el formulario de mercancía
   * con los datos seleccionados.
   *
   * @param events - Arreglo de cadenas que representa los países seleccionados.
   */
   paisDeOriginSeleccionadasChange(events: string[]): void {
    this.seleccionadasPaisDeOriginDatos = events;
      this.formMercancias.patchValue({
      paisDeOriginDatos: events,
    });
    this.setValoresStore(
      this.formMercancias,
      "paisDeOriginDatos",
      "setPaisDeOriginDatos",
    );

    const SELECTED_PAISES_OBJ = events
    .map(desc => this.paisesCatalogo.find(p => p.descripcion === desc))
    .filter((p): p is Catalogo => Boolean(p))
    .map(p => ({ clave: p.clave, descripcion: p.descripcion }));

  this.setValoresStore(
    this.formMercancias,
    "SELECTED_PAISES_OBJ",
    "setPaisDeOriginDatosObj"
  );

  }

  /**
   * @method seleccionarlistaSeccionMercancias
   * @description
   * Método que selecciona una lista de secciones de mercancías.
   * @param {event}
   */
  public seleccionarlistaSeccionMercancias(event: MercanciasInfo[]): void {
    this.seleccionarlistaMercancias = event;
  }

  public seleccionarlistaSeccionNico(event: NicoInfo[]): void {
    this.personaparas = event;
  }

  onConfirmacionEliminar(accion:boolean):void{
    if(accion && this.confirmEliminar){
      this.nicoTablaDatos = this.nicoTablaDatos.filter(
        (item) =>
          !this.personaparas.some(
            (selected) =>
              selected.clave_Scian === item.clave_Scian &&
              selected.descripcion_Scian === item.descripcion_Scian,
          ),
      );
      this.personaparas = [];
      this.confirmEliminar=false;
      if (this.formAgente) {
        this.formAgente.reset();
      }
      if (this.datosDomicilioLegalStore && typeof this.datosDomicilioLegalStore.setNicoTabla === 'function') {
        this.datosDomicilioLegalStore.setNicoTabla(this.nicoTablaDatos);
      }
    }
    this.mostrarNotificacion = false;

  }

  public eliminarScian(): void {
    if (!this.personaparas || this.personaparas.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: 'info',
        modo: '',
        titulo: '',
        mensaje: 'Selecciona un registro.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-sm'
      };
      this.mostrarNotificacion = true;
    }
    else 
       {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: 'info',
        modo: 'modal',
        titulo: '',
        mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
        tamanioModal: 'modal-sm'
      };
      this.confirmEliminar=true;
    }
  }

  /**
 * Maneja la confirmación del modal para eliminar partidas seleccionadas.
 * Si la bandera `confirmandoEliminarPartida` está activa, elimina las partidas seleccionadas
 * y restablece la bandera. Además, oculta la notificación.
 */
onConfirmacionModal(accion: boolean): void {
  
  this.mostrarNotificacion = false;
}


  /**
   * @method eliminarMercancia
   * @description
   * Método que elimina una mercancía de la lista de mercancías seleccionadas.
   */
  public eliminarMercancia(): void {
    if (this.seleccionarlistaMercancias.length > 0) {
      this.mercanciasTablaDatos = this.mercanciasTablaDatos.filter((item) => {
        return !this.seleccionarlistaMercancias.some(
          (selectedItems) =>
            selectedItems.nombreComercial === item.nombreComercial &&
            selectedItems.nombreComun === item.nombreComun &&
            selectedItems.fraccionArancelaria === item.fraccionArancelaria &&
            selectedItems.objetoImportacion === item.objetoImportacion &&
            selectedItems.cantidadUmt === item.cantidadUmt,
        );
      });
      this.listaMercancias = [...this.mercanciasTablaDatos];
      this.seleccionarlistaMercancias = [];
    }
       else{
           this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: 'info',
        modo: 'modal',
        titulo: '',
        mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-sm'
      };
      this.mostrarNotificacion=true;
        }
    
  }

  /**
   * @method modificarMercancia
   *
   * @description
   * Método que modifica una mercancía de la lista de mercancías seleccionadas.
   */
  public modificarMercancia(): void {
    if (this.seleccionarlistaMercancias.length !== 0) {
      const SELECTED = this.seleccionarlistaMercancias[0];
      this.formMercancias.patchValue({
        nombreComercial: SELECTED.nombreComercial,
        nombreComun: SELECTED.nombreComun,
        nombreCientifico: SELECTED.nombreCientifico,
        usoEspecifico: SELECTED.usoEspecifico,
        fraccionArancelaria: SELECTED.fraccionArancelaria,
        descripcionFraccion: SELECTED.descripcionFraccion,
        cantidadUMT: SELECTED.cantidadUmt,
        UMT: SELECTED.unidadMedidaTarifa,
        cantidadUMC: SELECTED.cantidadUmc || SELECTED.cantidadUmc,
        UMC: SELECTED.umcClave ?? SELECTED.umc,        
        porcentajeConcentracion: SELECTED.porcentajeConcentracion,
        clasificacionToxicologica: SELECTED.clasificacionToxicologicaClave ?? SELECTED.clasificacionToxicologica,
        objetoImportacion: SELECTED.objetoImportacionClave ?? SELECTED.objetoImportacion,
        paisDeOriginDatos: Array.isArray(SELECTED.paisDeOriginDatosObj) && SELECTED.paisDeOriginDatosObj.length > 0
  ? SELECTED.paisDeOriginDatosObj.map(p => p.descripcion)
  : SELECTED.paisOrigen,
        paisDeProcedenciaDatos:SELECTED.paisProcedenciaUltimoPuerto,
        estadoFisico: SELECTED.estadoFisicoClave ?? SELECTED.estadoFisico,
         estadoFisicoOtro: SELECTED.estadoFisicoOtro,
         numeroRegistroSanitario: SELECTED.numeroRegistroSanitario,
         numeroCas: SELECTED.numeroCas,
         objetoImportacionOtro: SELECTED.objetoImportacionOtro,
        ...(this.formMercancias.contains("numeroRegistro") && {
          numeroRegistro: SELECTED.numeroRegistroSanitario,
        }),
      });
      this.openModal();
      this.seleccionadasPaisDeOriginDatos = Array.isArray(SELECTED.paisDeOriginDatosObj)
  ? SELECTED.paisDeOriginDatosObj.map(p => p.descripcion)
  : [];
 
   this.seleccionadasPaisfabrica = Array.isArray(SELECTED.paisFabrica)
      ? SELECTED.paisFabrica
      : SELECTED.paisFabrica
        ? [SELECTED.paisFabrica]
        : [];

   this.seleccionadasPaisElaboracion = Array.isArray(SELECTED.paisElaboracion)
      ? SELECTED.paisElaboracion
      : SELECTED.paisElaboracion
        ? [SELECTED.paisElaboracion]
        : [];
  
          this.seleccionadasPaisProveedor = Array.isArray(SELECTED.paisProveedor)
      ? SELECTED.paisProveedor
      : SELECTED.paisProveedor
        ? [SELECTED.paisProveedor]
        : [];
    
        this.seleccionadasPaisDeProcedenciaDatos = Array.isArray(SELECTED.paisProcedenciaUltimoPuerto)
      ? SELECTED.paisProcedenciaUltimoPuerto
      : SELECTED.paisProcedenciaUltimoPuerto
        ? [SELECTED.paisProcedenciaUltimoPuerto]
        : [];

        this.formMercancias.patchValue({
          paisElaboracion: this.seleccionadasPaisElaboracion,
          paisFabrica: this.seleccionadasPaisfabrica,
          paisProveedor: this.seleccionadasPaisProveedor
        });
 }
        else{
           this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: 'info',
        modo: 'modal',
        titulo: '',
        mensaje: this.idProcedimiento === 260510 ? 'Selecciona sólo un registro para modificar.' : '¿Estás seguro que deseas eliminar los registros marcados?',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-sm'
      };
      this.mostrarNotificacion=true;
        }
  }
  ngAfterViewInit(): void {
    if (this.identificacion) {
      this.formMercancias
        .get("nombreComercial")
        ?.setValidators([Validators.required, Validators.maxLength(1000)]);
      this.formMercancias
        .get("nombreComun")
        ?.setValidators([Validators.required, Validators.maxLength(250)]);
      this.formMercancias
        .get("nombreCientifico")
        ?.setValidators([Validators.required, Validators.maxLength(1000)]);
      this.formMercancias.get("nombreComercial")?.updateValueAndValidity();
      this.formMercancias.get("nombreComun")?.updateValueAndValidity();
      this.formMercancias.get("nombreCientifico")?.updateValueAndValidity();
    }
    if (!this.rfcValido || this.esFormularioSoloLectura === true) {
      this.domicilio.disable();
    } else {
      this.domicilio.enable();
    }
    if(!this.isAvisoLicenciaVisible) {
       this.formMercancias
        .get("licenciaSanitaria")
        ?.setValidators([]);
      this.formMercancias
        .get("avisoCheckbox")
        ?.setValidators([]);
      this.formMercancias.get("licenciaSanitaria")?.updateValueAndValidity();
      this.formMercancias.get("avisoCheckbox")?.updateValueAndValidity();
    }
    this.nombresCampos = NOMBRES_CAMPOS.includes(this.idProcedimiento ?? 0) ? true : false;
    if(this.nombresCampos){
      // this.formMercancias.get("numeroRegistroSanitario")?.setValidators([Validators.required]);
      // this.formMercancias.get("numeroRegistroSanitario")?.updateValueAndValidity();
      this.formMercancias.get("numeroRegistro")?.setValidators([]);   
      this.formMercancias.get("numeroRegistro")?.updateValueAndValidity();
      this.formMercancias.get("numeroCas")?.setValidators([Validators.required]);
      this.formMercancias.get("numeroCas")?.updateValueAndValidity();
     }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.formMercancias) {
      return;
    }
    if (changes["rfcValido"]) {
      if (!this.rfcValido || this.esFormularioSoloLectura === true) {
        this.domicilio.disable();
      } else {
        this.domicilio.enable();
      }
    }
  }
  validatorButtonClick(): boolean {
   let ISVALID = true;
  // Check all required fields in 'domicilio' and set mostrarErrores accordingly
  const REQUIREDFIELDS = [
  'codigoPostal',
  'estado',
  'muncipio',
  'calle',
  'telefono',
  'aduanasEntradas'
] as (keyof typeof this.mostrarErrores)[];
 if (this.isAvisoLicenciaVisible) {

    const AVISOCONTROL = this.domicilio.get('avisoCheckbox');
    const LICENCIACONTROL = this.domicilio.get('licenciaSanitaria');
    const AVISO_CHECKED = AVISOCONTROL?.value;
    const LICENCIA_VALOR = LICENCIACONTROL?.value;

    if (AVISO_CHECKED) {
      REQUIREDFIELDS.push('avisoCheckbox');
      AVISOCONTROL?.setValidators([Validators.required]);
      AVISOCONTROL?.updateValueAndValidity();
      LICENCIACONTROL?.clearValidators();
      LICENCIACONTROL?.updateValueAndValidity();
      this.mostrarErrores.licenciaSanitaria = false;
      this.mostrarErrores.avisoCheckbox = false;
    } else if(LICENCIA_VALOR){
      REQUIREDFIELDS.push('licenciaSanitaria');
      LICENCIACONTROL?.setValidators([Validators.required]);
      LICENCIACONTROL?.updateValueAndValidity();
      AVISOCONTROL?.clearValidators();
      AVISOCONTROL?.updateValueAndValidity();
      this.mostrarErrores.licenciaSanitaria = false;
      this.mostrarErrores.avisoCheckbox = false;
    } else {
      REQUIREDFIELDS.push('licenciaSanitaria', 'avisoCheckbox');
      LICENCIACONTROL?.setValidators([Validators.required]);
      LICENCIACONTROL?.updateValueAndValidity();
      AVISOCONTROL?.setValidators([Validators.required]);
      AVISOCONTROL?.updateValueAndValidity();
      this.mostrarErrores.licenciaSanitaria = true;
      this.mostrarErrores.avisoCheckbox = true;
      ISVALID = false;
    }
  }
REQUIREDFIELDS.forEach((field) => {
    const VALUE = this.domicilio.get(field)?.value;
    this.mostrarErrores[field] = !VALUE;
    if (!VALUE) {
      ISVALID = false;
    }
  });
   if(this.domicilio.invalid){
    this.domicilio.markAllAsTouched();
    ISVALID = false;
   }
   
   if(this.nicoTablaDatos.length === 0){
    this.nicoTablaDatosCheck = true;
    ISVALID = false;
   }
   else{
    this.nicoTablaDatosCheck = false;
   }
   if(this.mercanciasTablaDatos.length === 0){
    this.mercanciasTablaCheck=true;
    ISVALID = false;
   }
   else{
    this.mercanciasTablaCheck=false;
   }
   if(this.seleccionadasAduanasEntradaDatos.length === 0){
    this.mostrarErrores.aduanasEntradas =true;
     ISVALID = false;
   }
   return ISVALID;
  }
  

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
