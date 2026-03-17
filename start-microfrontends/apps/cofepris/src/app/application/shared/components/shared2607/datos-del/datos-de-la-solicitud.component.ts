/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-implicit-coercion */
import { AL_DAR, AlertComponent, Catalogo, InputFecha, InputRadioComponent, Notificacion, NotificacionesComponent, Pedimento, REGEX_CORREO_ELECTRONICO, REGEX_SOLO_DIGITOS, REGEX_TEXTO_ALFANUMERICO_EXTENDIDO, TablaDinamicaComponent, TablaSeleccion, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { CLASIFICACION_PRODUCTO_DATA, CLAVE_SCIAN_DATA, DESCRIPCION_SCIAN_DATA, ESPECIFICAR_DATA, TIPO_PRODUCTO_DATA } from '../../../constantes/catalogs.enum';
import { CONFIGURACION_COLUMNAS_LISTA_CLAVE, CONFIGURACION_COLUMNAS_MERCANCIAS, CONFIGURACION_COLUMNAS_SOLI } from '../../../constantes/column-config.enum';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CrossList, MercanciaCrossList } from '../../../models/mercancia.model';
import { FilaData, FilaData2, ListaClave } from '../../../models/fila-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Solicitud260702State, Solicitud260702Store } from '../../../estados/stores/shared2607/tramites260702.store';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CrosslistComponent } from '@libs/shared/data-access-user/src';
import { DatosServiceService } from '../../../services/datos-service.service';
import { InputCheckComponent } from '@libs/shared/data-access-user/src';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';
import { Modal } from 'bootstrap';
import { ParticipanteInfo } from '../../../models/datos-de-la-solicitud.model';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrarSolicitudMcpService } from '../../../services/shared2607/registrar-solicitud-mcp.service';
import { Solicitud260702Query } from '../../../estados/queries/shared2607/tramites260702.query';
import { TEXTOS } from '../../../constantes/constantes.enum';
import { TituloComponent } from '@libs/shared/data-access-user/src';

/**
 * Componente para gestionar los datos de la solicitud.
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputRadioComponent,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    InputRadioComponent,
    InputFechaComponent,
    CrosslistComponent,
    InputCheckComponent,
    NotificacionesComponent,
    AlertComponent,
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrls: ['./datos-de-la-solicitud.component.scss'],
})
export class DatosdelasolicitudComponent implements OnInit, OnDestroy, OnChanges {

  /** 
   * Evento que emite el tipo de trámite seleccionado.
   * Se emite un valor de tipo string que representa el tipo de trámite.
   */
   @Output() tipoTramiteChange = new EventEmitter<string>();
    /**
     * Identificador del procedimiento actual.
     * Se utiliza para determinar la lógica específica del procedimiento.
     */
    public procedimientoId: string = '260701';

  /**
  * Indica si la sección es colapsable.
  * @type {boolean}
  * @default true
  */
  public colapsable: boolean = true;

  /** Formulario principal para los datos de la solicitud */
  dataDeLaSolicitudForm!: FormGroup;

  /** Constantes de texto utilizadas en el componente */
  TEXTOS = TEXTOS;

  /** Estado actual de los datos de la solicitud */
  dataDeLaSolicitudState!: Solicitud260702State;

  /** Sujeto para manejar la destrucción de observables */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Formulario para la clave SCIAN */
  clavaScianForm!: FormGroup;

  /** Indica si se muestra el formulario de clave SCIAN */
  public showClavaScianForm: boolean = false;
  /** Habilita o deshabilita el estado */
  habilitarEstado: boolean = true;

  /** Selección de mercancias */
  hercelosSeleccionados!: string;

  /** Datos seleccionados de mercancias */
  selectedMercanciasDatos: FilaData2[] = [];

  /** Configuración de la tabla de mercancias */
  public mercanciasConfiguracionTabla: FilaData2[] = [];

  /** Lista de claves para la tabla */
  public listaClaveTabla: ListaClave[] = [];

  /** Indica si el país de origen es colapsable */
  paisOrigen = false;
  /** Configuración del crosslist para el país de origen */
  paisOrigenCrossList: CrossList = {} as CrossList;

  /** Configuración del crosslist para el país de procedencia */
  paisProcedencisCrossList: CrossList = {} as CrossList;

  /** Indica si el país de procedencia es colapsable */
  paisProcedencisColapsable = false;

  /** Referencia al modal de alerta */
  @ViewChild('modalAlerta') modalElement!: ElementRef;

  /**
   * Configuración para la notificación actual.
   */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   * Índice del elemento que se desea eliminar.
   */
  elementoParaEliminar!: number;

  /**
   * Lista de pedimentos asociados a la solicitud.
   */
  pedimentos: Array<Pedimento> = [];

  /** Configuración para el campo de fecha de fabricación */
  fechaFabricacionDatos: InputFecha = {
    labelNombre: 'Fecha de fabricación',
    required: false,
    habilitado: true,
  };
  /**
   * Configuración para el campo de fecha de caducidad.
   * Incluye nombre de etiqueta, estado de requerido y habilitación.
   */
  fechaCaducidad: InputFecha = {
    labelNombre: 'Fecha de Caducidad',
    required: false,
    habilitado: true,
  };
  /** Índice de la fila en edición */
  ediciondeindicedefila: number | null = null;

  /** Indica si el uso específico es colapsable */
  usoEspecifico = false;

  /** Configuración del crosslist para el uso específico */
  usoEspecificoCrossList: CrossList = {} as CrossList;

  /** Índice de la fila seleccionada */
  indiceFilaSeleccionada: number | null = null;

  /** Fecha inicial seleccionada */
  fechaInicialSeleccionada: string = '';

  /** Fecha final seleccionada */
  fechaFinalSeleccionada: string = '';
  /** Opciones para el botón de radio */
  opcionDeBotonDeRadio = [
    { label: 'Prórroga', value: 'prorroga' },
    { label: 'Modificación', value: 'modificacion' },
    { label: 'Modificación y prórroga', value: 'modificacion_prorroga' },
  ];

  /** Tipo de selección para las mercancias */
  tipoSeleccionsoliMercancias: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /** Datos de la tabla */
  tableData: FilaData[] = [];
  /**
   * Datos de la tabla NICO
   */
  nicoTabla: FilaData[] = [];
  /** Conjunto de filas seleccionadas */
  filasSeleccionadas: Set<number> = new Set();

  /** Opciones para el botón de radio de hacerlos */
  hacerlosRadioOptions = [
    { label: 'No', value: 'no' },
    { label: 'Sí', value: 'si' },
  ];

  /** Fila seleccionada */
  selectedRow: FilaData | FilaData2 | null = null;

  /**
   * Control de formulario para la aduanasDeEntradaFechaSeleccionada.
   */
  estadoData: Catalogo[] = [];
  /**
   * Configuración de datos de estado
   */
  claveScianDatos: Catalogo[] = [];

  /** Configuración de datos de clave SCIAN */
  public claveScianData = CLAVE_SCIAN_DATA;

  /** Configuración de descripción del SCIAN */
  public descripcionDelScianData = DESCRIPCION_SCIAN_DATA;

  /** Configuración de datos del régimen */
  public regimenalqueData: Catalogo[] = [];

  /** Configuración de datos de la aduana */
  public aduanaData: Catalogo[] = [];

  /** Configuración para el campo de selección de clasificación del producto */
  public delProducto = CLASIFICACION_PRODUCTO_DATA;

  /** Configuración para especificar clasificación del producto */
  public especificarData = ESPECIFICAR_DATA;

  /** Configuración para el campo de selección del tipo de producto */
  public tipoProductoData = TIPO_PRODUCTO_DATA;

  /** 
   * Configuración de datos de UMC 
   */
  public umcData: Catalogo[] = [];

  /** 
   * Indica si se debe mostrar el botón de acción.
   * Cuando es `true`, el botón se muestra en la interfaz de usuario.
   */
  public mostraBtn: boolean = true;
  /**
   * Indica si se debe mostrar un error en la tabla.
   * Cuando es `true`, se muestra un mensaje de error indicando que la tabla no contiene datos válidos.
   */
  public mostrarErrorTabla: boolean = false;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Almacena el número o identificador del trámite (procedimiento) seleccionado o en curso.
   * Se obtiene del servicio DatosServiceService y puede ser utilizado para lógica relacionada con el trámite.
   */
  procedureNo: any;

  /** 
 * RFC del solicitante.
 * Este campo almacena el Registro Federal de Contribuyentes (RFC) del solicitante.
 * Ejemplo: 'MAVL621207C95'.
 */
  rfc: string = 'MAVL621207C95';
  /**
   * ID del procedimiento.
   * Este campo almacena el identificador único del procedimiento asociado a la solicitud.
   */
  @Input() idProcedimiento!: number;

  /**
   * idTramite
   * Este campo almacena el identificador único del trámite asociado a la solicitud.
   */
  public idTramite: string = '260201'
  /** 
   * ID de clasificación.
   * Este campo almacena el identificador de la clasificación del producto.
  */
  public idClasificacion: string = '1';
  /**
   * Evento que emite el estado de validez del formulario.
   * Se emite un valor booleano: `true` si el formulario es válido, `false` en caso contrario.
   * Útil para notificar a componentes padres sobre cambios en la validez del formulario.
   */
  @Output() formValidityChange = new EventEmitter<boolean>();


  /**
   * Indica si se ha activado el evento de continuar.
   * Este valor se utiliza para controlar el flujo de la solicitud
   * dependiendo de si el usuario ha decidido continuar con el proceso.
   */
  @Input() isContinuarTriggered: boolean = false;

  /** 
   * Identificador del procedimiento.
   * Este valor se utiliza para determinar la lógica específica del procedimiento en curso.
   */
  @Input() procedureID: string = '';

  /**
   * Constructor del componente.
   *
   * Inyecta los servicios y utilidades necesarias para:
   * - Crear y gestionar formularios reactivos (`FormBuilder`).
   * - Registrar solicitudes MCP (`RegistrarSolicitudMcpService`).
   * - Detectar y aplicar cambios manualmente en la vista (`ChangeDetectorRef`).
   * - Gestionar el estado del trámite 260702 (`Solicitud260702Store`).
   * - Consultar el estado del trámite 260702 (`Solicitud260702Query`).
   * - Consultar el estado general de la aplicación (`ConsultaioQuery`).
   *
   * @param fb Constructor de formularios reactivos.
   * @param registrarsolicitudmcp Servicio para registrar solicitudes MCP.
   * @param cdr Referencia para detección de cambios manual.
   * @param solicitud260702Store Store para manejar el estado del trámite 260702.
   * @param solicitud260702Query Query para acceder al estado del trámite 260702.
   * @param consultaioQuery Query para acceder al estado general de la consulta.
   */
  constructor(
    private fb: FormBuilder,
    private registrarsolicitudmcp: RegistrarSolicitudMcpService,
    private cdr: ChangeDetectorRef,
    private solicitud260702Store: Solicitud260702Store,
    private solicitud260702Query: Solicitud260702Query,
    private consultaioQuery: ConsultaioQuery,
    private service: RegistrarSolicitudMcpService,
    private datosService: DatosServiceService,
    private validacionesService: ValidacionesFormularioService
  ) {
    this.procedureNo = this.datosService.procedureNo;
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyed$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;

          this.inicializarEstadoFormulario();
        })
      )

      .subscribe();
  }

  /** Configuración de columnas para la tabla de solicitud */
  configuracionColumnasoli = CONFIGURACION_COLUMNAS_SOLI;

  /** Configuración de columnas para la tabla de mercancias */
  mercanciasDatos = CONFIGURACION_COLUMNAS_MERCANCIAS;

  /** Configuración de columnas para la lista de claves */
  listaClave = CONFIGURACION_COLUMNAS_LISTA_CLAVE;
  /**
   * Indica si la opción de modificación está seleccionada.
   */
  isModificacionSelected = false;
  /** Inicialización del componente */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();

  }

  

  /**
* Detecta cambios en las propiedades de entrada del componente y ejecuta validaciones cuando se activa el botón continuar.
* Utiliza Promise.resolve() para asegurar que la validación se ejecute en el próximo ciclo del event loop.
*/
  ngOnChanges(): void {
    if (this.isContinuarTriggered) {
      Promise.resolve().then(() => { 
     this.validarFormularios(); 
      });
    }
  }
  /**
 * Alterna el estado colapsable de la sección del formulario.
 * @returns {void}
 */
  public mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }
  /**
   * Constantes importadas desde el archivo de enumeración que contienen textos importantes y advertencias.
   * @type {typeof AL_DAR}
   */
  public TEXTO = AL_DAR;

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
   * Valida los formularios del componente.
   * @returns  {boolean} - `true` si el formulario es válido, `false` en caso contrario.
   */
  validarFormularios(): boolean {
    const FORM_GROUP = this.dataDeLaSolicitudForm.get('datosDelTramiteRealizar');
  const DATOS_DEL_MANIFIESTOS = this.dataDeLaSolicitudForm.get('datosDelManifiestos');

  const VALID =
    (FORM_GROUP?.valid ?? false) &&
    (DATOS_DEL_MANIFIESTOS?.valid ?? false);

  const TABLA_VALID = !!(this.nicoTabla && this.nicoTabla.length > 0);

  this.mostrarErrorTabla = !TABLA_VALID;

  if (!VALID) {
    FORM_GROUP?.markAllAsTouched();
    DATOS_DEL_MANIFIESTOS?.markAllAsTouched();
  }
  // Determina si el formulario y la tabla son válidos
  const ES_VALIDO_FINAL = VALID && TABLA_VALID;
  this.solicitud260702Store.setFormValidity('datosDelSolicitud', ES_VALIDO_FINAL);
  return VALID &&TABLA_VALID;
  }

  /**
   * Maneja el cambio de selección en el botón de radio.
   * @param event 
   */
  onRadioChange(event: string | number): void {
    /**
     * Actualiza la propiedad `isModificacionSelected` basada en el valor seleccionado.
     *   * - Si el valor seleccionado es 'modificacion', `isModificacionSelected` se establece en `true`.
     *   * - Para cualquier otro valor, se establece en `false`.
     */
    this.tipoTramiteChange.emit(String(event));
    const SELECTED_VALUE = String(event);
    const JUSTIFICATION_CTRL = this.datosDelTramiteRealizar.get('justification');

    if (SELECTED_VALUE === 'modificacion') {
      JUSTIFICATION_CTRL?.enable();
    } else {
      JUSTIFICATION_CTRL?.disable();
    }

    if(SELECTED_VALUE === 'prorroga') {
      this.mostraBtn = false;
      this.validacionesService.setMostrarButton(false);
    } else {
      this.mostraBtn = true;
      this.validacionesService.setMostrarButton(true);
    }
  }

  /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
    this.solicitud260702Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        // map((seccionState) => {
        //   this.dataDeLaSolicitudState = seccionState;

        // })
        map((seccionState) => { 
          this.dataDeLaSolicitudState = seccionState;
          if (this.esFormularioSoloLectura && seccionState.tableData) {
            this.tableData = [...seccionState.tableData];
          } else if (seccionState.tableData) {
            this.tableData = [...seccionState.tableData];
          }

        })
      )
      .subscribe();
      this.solicitud260702Query.selectSolicitud$
    .pipe(takeUntil(this.destroyed$))
    .subscribe(state => {
      this.nicoTabla = [...state.nicoTabla];
      
    });

    this.createForm();
    this.getEstadosData();
    this.getClaveScianData();
    this.createclaveScianForm();
    this.getClaveDescripcionDelData();
    this.getRegimenalqueData();
    this.getAduanaData();
    this.getMercanciasData();
    this.getEspificarData();
    this.getClasificacionDelProductoData();
    this.getTipoProductoData();
    this.getListaClaveData();
    this.getMercanciaCrosslistData();
    this.getUMCData();
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.dataDeLaSolicitudForm.disable();
      this.clavaScianForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.dataDeLaSolicitudForm.enable();
      this.clavaScianForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Método para crear el formulario principal de datos de la solicitud.
   * Inicializa un formulario reactivo con todos los campos necesarios y sus validaciones.
   */
  createForm(): void {
    this.dataDeLaSolicitudForm = this.fb.group({
      claveDeLosLotes: [
        this.dataDeLaSolicitudState?.claveDeLosLotes,
        Validators.required,
      ],
      fechaDeFabricacion: [
        this.dataDeLaSolicitudState?.fechaDeFabricacion,
        Validators.required,
      ],
      fechaDeCaducidad: [
        this.dataDeLaSolicitudState?.fechaDeCaducidad,
        Validators.required,
      ],
      descripcionFraccionArancelaria: [
        this.dataDeLaSolicitudState?.descripcionFraccionArancelaria,
        [Validators.required, Validators.maxLength(200)],
      ],
      cantidadUMT: [
        this.dataDeLaSolicitudState?.cantidadUMT,
        [
          Validators.required,
          Validators.pattern(REGEX_SOLO_DIGITOS),
        ]
      ],
      umt: [
        this.dataDeLaSolicitudState?.descripcionFraccionArancelaria,
        Validators.required,
      ],
      cantidadUMC: [
        this.dataDeLaSolicitudState?.cantidadUMC,
        [
          Validators.required,
          Validators.pattern(REGEX_SOLO_DIGITOS),
        ]
      ],
      umc: [this.dataDeLaSolicitudState?.umc, Validators.required],
      tipoProducto: [
        this.dataDeLaSolicitudState?.tipoProducto,
        Validators.required,
      ],
      clasificaionProductos: [
        this.dataDeLaSolicitudState?.clasificaionProductos,
        Validators.required,
      ],
      especificarProducto: [
        this.dataDeLaSolicitudState?.especificarProducto,
        Validators.required,
      ],
      nombreProductoEspecifico: [
        this.dataDeLaSolicitudState?.nombreProductoEspecifico,
        [Validators.required, Validators.maxLength(150)]
      ],
      marca: [this.dataDeLaSolicitudState?.marca, Validators.required],
      fraccionArancelaria: [
        this.dataDeLaSolicitudState?.fraccionArancelaria,
        [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS)],
      ],

      datosDelManifiestos: this.fb.group({
      mensaje: [this.dataDeLaSolicitudState?.mensaje, Validators.required],
      hacerlosPublicos: [this.dataDeLaSolicitudState?.hacerlosPublicos, Validators.required],
     
      }),
      datosDelTramiteRealizar: this.fb.group({
        tipoOperacion: [
          { value: this.dataDeLaSolicitudState?.tipoOperacion, disabled: false }
        ],
        justification: [
          {
            value: this.dataDeLaSolicitudState?.justification,
            disabled: true
          },
          [Validators.maxLength(2000)],
        ],
        denominacion: [
          this.dataDeLaSolicitudState?.denominacion,
          [Validators.required, Validators.maxLength(100)],
        ],
        correoElectronico: [
          this.dataDeLaSolicitudState?.correoElectronico,
          [Validators.required, Validators.pattern(REGEX_CORREO_ELECTRONICO), Validators.maxLength(100)],
        ],
        codigopostal: [
          this.dataDeLaSolicitudState?.codigopostal,
          [
            Validators.required,
            Validators.pattern(REGEX_SOLO_DIGITOS),
            Validators.maxLength(12),
          ],
        ],
        estado: [this.dataDeLaSolicitudState?.estado, Validators.required],
        municipoyalcaldia: [
          this.dataDeLaSolicitudState?.municipoyalcaldia,
        ],
        localidad: [
          this.dataDeLaSolicitudState?.localidad,
          [
            Validators.maxLength(120),
            Validators.pattern(REGEX_TEXTO_ALFANUMERICO_EXTENDIDO),
          ],
        ],
        colonia: [this.dataDeLaSolicitudState?.colonia, [Validators.maxLength(120)]],
        calle: [this.dataDeLaSolicitudState?.calle, [Validators.required, Validators.maxLength(100)]],
        lada: [this.dataDeLaSolicitudState?.lada, [
          Validators.minLength(5),
          Validators.maxLength(5),
          Validators.pattern(REGEX_SOLO_DIGITOS),
        ],],
        telefono: [this.dataDeLaSolicitudState?.telefono, [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(REGEX_SOLO_DIGITOS),
        ],],
        avisoDeFuncionamiento: [
          this.dataDeLaSolicitudState?.avisoDeFuncionamiento,
        ],
        licenciaSanitaria: [
          this.dataDeLaSolicitudState?.licenciaSanitaria,
        ],
        regimenalque: [
          this.dataDeLaSolicitudState?.regimenalque
        ],
        aduana: [this.dataDeLaSolicitudState?.aduana],
        rfc: [this.dataDeLaSolicitudState?.rfc || this.rfc, [Validators.required, Validators.maxLength(13)]],
        legalRazonSocial: [
          this.dataDeLaSolicitudState?.legalRazonSocial,
          Validators.required,
        ],
        apellidoPaterno: [
          this.dataDeLaSolicitudState?.apellidoPaterno,
          Validators.required,
        ],
        apellidoMaterno: [
          this.dataDeLaSolicitudState?.apellidoMaterno,
        ],
        mostraButton: [this.dataDeLaSolicitudState?.mostraButton]
      }),
    });
  }

  /**
   * Método para limpiar la notificación actual.
   * Establece el valor de `nuevaNotificacion` a `null` para eliminar cualquier notificación activa.
   */
  clearNotificacion(): void {
    this.nuevaNotificacion = null;
  }

  /**
   * Método para cerrar el modal de agregar mercancía.
   * Busca el elemento del modal en el DOM, lo oculta y limpia cualquier notificación activa.
   */
  closeModal(): void {
    const MODAL_ELEMENT = document.getElementById('modalAgregarMercancia');
    if (MODAL_ELEMENT) {
      const MODAL = new Modal(MODAL_ELEMENT);
      MODAL.hide();
      this.clearNotificacion(); // Limpia la notificación cuando el modal se cierra programáticamente
    }
  }

  /**
   * Método para eliminar un pedimento de la lista.
   * @param borrar Indica si se debe proceder con la eliminación del pedimento.
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.tableData = this.tableData.filter((row) => {
        const ROW_ID =
          row.id || (row.claveScianG && row.claveScianG.claveScian);
        return !this.filasSeleccionadas.has(Number(ROW_ID));
      });

      // Borrar la selección y la notificación
      this.filasSeleccionadas.clear();
      this.pedimentos.splice(this.elementoParaEliminar, 1);
      this.nuevaNotificacion = null; // Limpia la notificación
    }
  }

  /**
   * Método para abrir un modal y configurar la notificación correspondiente.
   * Dependiendo de los parámetros, muestra un mensaje de alerta para seleccionar un establecimiento,
   * notifica que no hay registros seleccionados o confirma la eliminación de registros seleccionados.
   *
   * @param i Índice del elemento que se desea eliminar (por defecto 0).
   * @param isSeleccionarEstablecimiento Indica si se debe mostrar el mensaje para seleccionar un establecimiento.
   */
  abrirModal(
    i: number = 0,
    isSeleccionarEstablecimiento: boolean = false
  ): void {
    if (isSeleccionarEstablecimiento) {
      // Condición específica para "Seleccionar establecimiento"
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje:
          'Por el momento no hay comunicación con el Sistema de COFEPRIS, favor de capturar su establecimiento.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
    } else if (!this.filasSeleccionadas || this.filasSeleccionadas.size === 0) {
      // No hay filas seleccionadas
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona un registro',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else {
      // Hay filas seleccionadas
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
    }

    this.elementoParaEliminar = i;
  }

  /**
   * Método para crear el formulario de clave SCIAN.
   * Inicializa un formulario reactivo con los campos `claveScian` y `descripcionDelScian`,
   * ambos marcados como requeridos.
   */
  createclaveScianForm(): void {
    this.clavaScianForm = this.fb.group({
      claveScianG: this.fb.group({
        claveScian: ['',],
        descripcionDelScian: [
          { value: this.dataDeLaSolicitudState?.descripcionDelScian, disabled: true },
          Validators.required,],
      }),
    });
  }

  /**
   * Método para obtener los datos del crosslist de mercancías.
   * Realiza una solicitud al servicio `registrarsolicitudmcp` para obtener los datos
   * y actualiza las propiedades `paisOrigenCrossList`, `paisProcedencisCrossList` y `usoEspecificoCrossList`.
   * En caso de error, muestra un mensaje en la consola.
   */

  getMercanciaCrosslistData(): void {
    this.registrarsolicitudmcp
      .getMercanciaCrosslistData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((respuesta: MercanciaCrossList[] | MercanciaCrossList) => {
        // If the response is an array, take the first element
        const DATA = Array.isArray(respuesta) ? respuesta[0] : respuesta;
        if (DATA) {
          this.paisOrigenCrossList = DATA.paisOrigenCrossList;
          this.paisProcedencisCrossList = DATA.paisProcedencisCrossList;
          this.usoEspecificoCrossList = DATA.usoEspecificoCrossList;
        }
      });
  }

  /** 
   * Obtiene los datos para la lista de claves 
   */
  getUMCData(): void {
    this.registrarsolicitudmcp
      .getUMCDatos(this.idProcedimiento?.toString() ?? '')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.umcData = data.datos as Catalogo[];
      });
  }
  /**
   * Método para alternar el estado colapsable del país de origen.
   * Cambia el valor de `paisOrigen` entre verdadero y falso.
   */
  paisOrigenColapsable(): void {
    this.paisOrigen = !this.paisOrigen;
  }

  /**
   * Método para alternar el estado colapsable del país de procedencia.
   * Cambia el valor de `paisProcedencisColapsable` entre verdadero y falso.
   */
  paisProcedencis_colapsable(): void {
    this.paisProcedencisColapsable = !this.paisProcedencisColapsable;
  }

  /**
   * Método para alternar el estado colapsable del uso específico.
   * Cambia el valor de `usoEspecifico` entre verdadero y falso.
   */
  usoEspecificoColapsable(): void {
    this.usoEspecifico = !this.usoEspecifico;
  }

  /** Obtiene los datos de los estados */
  getEstadosData(): void {
    if (this.idProcedimiento) {
      this.service
        .obtenerEstadoList(this.idProcedimiento?.toString())
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.estadoData = data.datos ?? [];
        });
    } else {
      this.service
        .getEstadosData()
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.estadoData = data;
        });
    }
  }
  /** Obtiene los datos de clave SCIAN */
  getClaveScianData(): void {
    if (this.idProcedimiento) {
      this.service
        .obtenerClavesScian(this.idProcedimiento?.toString())
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.claveScianDatos = data.datos ?? [];
        });
    } else {
      this.service
        .getClaveScianData()
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.claveScianDatos = data;
        });
    }
  }

  /**
   * Maneja el cambio en la selección de la clave SCIAN. 
   * @param event Evento de cambio del elemento select. 
   */
  onClaveScianChange(event: Event): void {
    const SELECTED_VALUE = (event.target as HTMLSelectElement).value;
    let SELECTED_OPTION;
    if (this.idProcedimiento) {
      SELECTED_OPTION = this.claveScianDatos?.find((item) => Number(item.clave) === Number(SELECTED_VALUE));
    }

    if (SELECTED_OPTION) {
      const CLAVE_SCIAN_G_CONTROL = this.clavaScianForm.get('claveScianG');
      if (CLAVE_SCIAN_G_CONTROL) {
        CLAVE_SCIAN_G_CONTROL.patchValue({
          descripcionDelScian: SELECTED_OPTION.descripcion,
        });
      }
    }
  }
  /** Obtiene los datos de descripción del SCIAN */
  getClaveDescripcionDelData(): void {
    this.registrarsolicitudmcp
      .getClaveDescripcionDelData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.descripcionDelScianData.catalogos = data as Catalogo[];
      });
  }

  /** Obtiene los datos del régimen */
  getRegimenalqueData(): void {
    if (this.idProcedimiento) {
      this.service
        .obtenerRegimenes(this.idProcedimiento?.toString())
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.regimenalqueData = data.datos ?? [];
        });
    } else {
      this.service
        .getRegimenalqueData()
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.regimenalqueData = data;
        });
    }
  }

  /** Obtiene los datos de la aduana */
  getAduanaData(): void {
    if (this.idProcedimiento) {
      this.service
        .obtenerAduanas(this.idProcedimiento?.toString())
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.aduanaData = data.datos ?? [];
        });
    } else {
      this.service
        .getAduanaData()
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.aduanaData = data;
        });
    }
  }
  /**
   * Método para habilitar el formulario de datos de la solicitud.
   * Cambia el estado de `habilitarEstado` a falso y habilita todos los campos del formulario.
   */
  aceptar(): void {
    this.dataDeLaSolicitudForm.enable();
    this.dataDeLaSolicitudForm.enable();
    this.habilitarEstado = false;
  }

  /** Obtiene los datos de mercancias */

  getMercanciasData(): void {
    this.registrarsolicitudmcp
      .getMercanciasData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.mercanciasConfiguracionTabla = data as unknown as FilaData2[];
      });
  }
  /** Obtiene los datos de clasificación del producto */
  getClasificacionDelProductoData(): void {
    if (this.idProcedimiento) {
      this.service
        .obtenerClasificacionProductos(this.idProcedimiento?.toString(), this.idTramite)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.delProducto.catalogos = data.datos as Catalogo[];
        });
    } else {
      this.service
        .getClasificacionDelProductoData()
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.delProducto.catalogos = data as Catalogo[];
        });
    }

  }
  /** Obtiene los datos para especificar clasificación del producto */
  getEspificarData(): void {
    if (this.idProcedimiento) {
      this.service
        .obtenerEspecificarClasificacionProducto(this.idProcedimiento?.toString(), this.idClasificacion)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.especificarData.catalogos = data.datos as Catalogo[];
        });
    } else {
      this.service
        .getEspificarData()
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.especificarData.catalogos = data as Catalogo[];
        });
    }
  }

  /** Obtiene los datos del tipo de producto */
  getTipoProductoData(): void {

    if (this.idProcedimiento) {
      this.service
        .obtenerTipoProducto(this.idProcedimiento?.toString(), this.idProcedimiento?.toString())
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.tipoProductoData.catalogos = data.datos as Catalogo[];
        });
    } else {
      this.service
        .getTipoProductoData()
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.tipoProductoData.catalogos = data as Catalogo[];
        });
    }
  }

  /** Obtiene los datos de la lista de claves */

  getListaClaveData(): void {
    this.registrarsolicitudmcp
      .getListaClaveData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.listaClaveTabla = data as unknown as ListaClave[];
      });
  }

  /** Muestra el modal de selección de establecimiento */

  seleccionarEstablecimiento(): void {
    this.abrirModal(0, true);
  }

  /** Maneja el evento de envío del formulario */

  onSubmit(): void {
    const MODAL_ELEMENT = document.getElementById('claveScianModal');
    if (MODAL_ELEMENT) {
      const MODAL_INSTANCE = Modal.getInstance(MODAL_ELEMENT) || new Modal(MODAL_ELEMENT);
      MODAL_INSTANCE.hide();
    }

    const CLAVE_SCIAN_G_VALUE = this.clavaScianForm.get('claveScianG')?.value;
    if (!CLAVE_SCIAN_G_VALUE || !CLAVE_SCIAN_G_VALUE.claveScian) {
      return;
    }

    // Find the selected claveScian in the catalog
    const SELECTED_CATALOG = this.claveScianDatos.find(
      (item: Catalogo) => String(item.id) === String(CLAVE_SCIAN_G_VALUE.claveScian)
    );

    // Prepare the row to add
    const NEW_ROW: FilaData = {
      id: this.tableData.length > 0 ? Math.max(...this.tableData.map(row => row.id)) + 1 : 1,
      claveScianG: {
        claveScian: SELECTED_CATALOG ? SELECTED_CATALOG.descripcion : CLAVE_SCIAN_G_VALUE.claveScian,
        descripcionDelScian: SELECTED_CATALOG ? SELECTED_CATALOG.descripcion : CLAVE_SCIAN_G_VALUE.descripcionDelScian
      }
    };

    this.tableData = [...this.tableData, NEW_ROW];
    this.nicoTabla = this.tableData;
    this.solicitud260702Store.setNicoTabla(this.nicoTabla);
    this.showClavaScianForm = false;
    this.clavaScianForm.reset();

    this.mostrarErrorTabla = false;
  }

  /** Última fila seleccionada */
  lastSelectedRow: FilaData2 | null = null;

  /** Maneja la selección de filas */
  onfilasSeleccionadas(filasSeleccionadas: FilaData[] | ListaClave[] | FilaData2[]): void {

    if (
      filasSeleccionadas.length > 0 &&
      'claveDeLosLotes' in filasSeleccionadas[0]
    ) {
      this.filasSeleccionadas = new Set(
        (filasSeleccionadas as ListaClave[]).map((row) =>
          Number(row.claveDeLosLotes)
        )
      );
      this.lastSelectedRow = null;

    } else if (filasSeleccionadas.length > 0 && 'id' in filasSeleccionadas[0]) {
      // Handles both FilaData and FilaData2 if both have 'id'
      this.filasSeleccionadas = new Set(
        (filasSeleccionadas as (FilaData | FilaData2)[]).map((row) => Number(row.id))
      );
    } else if (
      filasSeleccionadas[0] &&
      'claveScianG' in filasSeleccionadas[0] &&
      'claveScian' in filasSeleccionadas[0].claveScianG
    ) {
      this.filasSeleccionadas = new Set(
        (filasSeleccionadas as FilaData[]).map((row) =>
          Number(row.claveScianG.claveScian)
        )
      );

    } else {
      this.filasSeleccionadas.clear();
      this.lastSelectedRow = null;

    }
  }
  /** Elimina las filas seleccionadas */
  onEliminar(): void {
    if (!this.filasSeleccionadas || this.filasSeleccionadas.size === 0) {
      const MODAL_ELEMENT = document.getElementById('seleccionaRegistroModal');
      if (MODAL_ELEMENT) {
        const MODAL = new Modal(MODAL_ELEMENT);
        MODAL.show();
      }
    } else {
      const MODAL_ELEMENT = document.getElementById('confirmarEliminarModal');
      if (MODAL_ELEMENT) {
        const MODAL = new Modal(MODAL_ELEMENT);
        MODAL.show();
      }
    }
    this.clavaScianForm.reset();
    this.abrirModal();
  }

  /** Confirma la eliminación de las filas seleccionadas */
  confirmarEliminar(): void {
    this.listaClaveTabla = this.listaClaveTabla.filter(
      (row) => !this.filasSeleccionadas.has(Number(row.claveDeLosLotes))
    );


    this.filasSeleccionadas.clear();
    this.dataDeLaSolicitudForm.reset();
    this.abrirModal();

  }
  /** Limpia el formulario de clave SCIAN */
  onLimpiar(): void {
    this.clavaScianForm.reset();
  }

  /**
   * Muestra el formulario para agregar una nueva clave SCIAN.
   */
  onAgregar(): void {
    this.showClavaScianForm = true;

    setTimeout(() => {
      const MODAL_ELEMENT = document.getElementById('claveScianModal');
      if (MODAL_ELEMENT) {
        const MODAL_INSTANCE = Modal.getInstance(MODAL_ELEMENT) || new Modal(MODAL_ELEMENT);
        MODAL_INSTANCE.show();
      }
    }, 0);
  }

  /**
   * Elimina las filas seleccionadas de la tabla.
   * Si no hay filas seleccionadas, muestra un mensaje de advertencia en la consola.
   */
  onDelete(): void {
    if (!this.filasSeleccionadas || this.filasSeleccionadas.size === 0) {
      const MODAL_ELEMENT = document.getElementById('seleccionaRegistroModal');
      if (MODAL_ELEMENT) {
        const MODAL_INSTANCE = new Modal(MODAL_ELEMENT);
        MODAL_INSTANCE.show();
      }
    } else {
      const MODAL_ELEMENT = document.getElementById('confirmarEliminarModal');
      if (MODAL_ELEMENT) {
        const MODAL_INSTANCE = new Modal(MODAL_ELEMENT);
        MODAL_INSTANCE.show();
      }
    }
    this.clavaScianForm.reset();
    this.abrirModal();

  }

  /** Cancela la acción de agregar clave SCIAN */

  onCancelar(): void {
    this.showClavaScianForm = false;
    this.clavaScianForm.reset();

  }
  /** Agrega una nueva mercancia a la tabla */
  agregarMercanciaGrid(): void {
    const SELECTED_ID = Array.from(this.filasSeleccionadas)[0];
    const SELECTED_ROW_INDEX = this.mercanciasConfiguracionTabla.findIndex(
      (row) => row.id === SELECTED_ID
    );

    if (SELECTED_ROW_INDEX === -1) {
      return;
    }
    this.ediciondeindicedefila = SELECTED_ROW_INDEX;
    const SELECTED_ROW = this.mercanciasConfiguracionTabla[SELECTED_ROW_INDEX];

    this.dataDeLaSolicitudForm.patchValue({
      clasificaionProductos: this.delProducto.catalogos.find(
        (item) => item.descripcion === SELECTED_ROW.clasificaionProductos
      )?.id || SELECTED_ROW.clasificaionProductos || '',
      especificarProducto: this.especificarData.catalogos.find(
        (item) => item.descripcion === SELECTED_ROW.especificarProducto
      )?.id || SELECTED_ROW.especificarProducto || '',
      nombreProductoEspecifico: SELECTED_ROW.nombreProductoEspecifico || '',
      marca: SELECTED_ROW.marca || '',
      tipoProducto: this.tipoProductoData.catalogos.find(
        (item) => item.descripcion === SELECTED_ROW.tipoProducto
      )?.id || SELECTED_ROW.tipoProducto || '',
      fraccionArancelaria: SELECTED_ROW.fraccionArancelaria || '',
      descripcionFraccionArancelaria: SELECTED_ROW.descripcionFraccionArancelaria || '',
      cantidadUMT: SELECTED_ROW.cantidadUMT || '',
      umt: SELECTED_ROW.umt || '',
      cantidadUMC: SELECTED_ROW.cantidadUMC || '',
      umc: SELECTED_ROW.umc || '',
      paisDeOrigen: SELECTED_ROW.paisDeOrigen || '',
      paisDeProcedencia: SELECTED_ROW.paisDeProcedencia || '',
      usoEspecifico: SELECTED_ROW.usoEspecifico || '',
    });

    // abrir el modal
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
  }
  /** Maneja el evento de modificación de mercancias */
  onModificarMercancias(): void {
    if (!this.filasSeleccionadas || this.filasSeleccionadas.size === 0) {
      this.abrirModal(0, false);
    } else if (this.filasSeleccionadas.size > 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe seleccionar exactamente un registro para modificar.',
        cerrar: false,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-sm',
      };
    } else {
      this.onChange();
    }
  }
  /**
   * Maneja el cambio en el campo "Clave de los lotes".
   * Actualiza el valor de la clave en la fila seleccionada de la tabla.
   *
   * @param event Evento que contiene el valor ingresado en el campo.
   */
  onClaveDeLosLotesChange(event: Event): void {
    const TARGET = event.target as HTMLInputElement; // Cast EventTarget to HTMLInputElement

    if (TARGET && this.ediciondeindicedefila !== null) {
      const VALUE = TARGET.value;

      this.listaClaveTabla[this.ediciondeindicedefila] = {
        ...this.listaClaveTabla[this.ediciondeindicedefila],
        claveDeLosLotes: VALUE,
      };
    } else {
      /* empty */
    }
  }
  /** Maneja el cambio de la fecha de fabricación */

  onFechaDeFabricacionChange(value: string | null): void {
    this.dataDeLaSolicitudForm.get('fechaDeFabricacion')?.setValue(value);
    if (value && this.ediciondeindicedefila !== null) {
      this.listaClaveTabla[this.ediciondeindicedefila] = {
        ...this.listaClaveTabla[this.ediciondeindicedefila],
        fechaDeFabricacion: value,
      };
    }
  }

  /** Maneja el cambio de la fecha de caducidad */

  onFechaDeCaducidadChange(value: string): void {
    this.dataDeLaSolicitudForm.get('fechaDeCaducidad')?.setValue(value);
    if (this.ediciondeindicedefila !== null) {
      this.listaClaveTabla[this.ediciondeindicedefila] = {
        ...this.listaClaveTabla[this.ediciondeindicedefila],
        fechaDeCaducidad: value,
      };
    }
  }
  /** Agrega una nueva fila a la lista de claves */

  onAgregarListaClave(): void {
    const CLAVE_DE_LOS_LOTES = this.dataDeLaSolicitudForm.get('claveDeLosLotes')?.value;
    const FECHA_DE_FABRICACION = this.dataDeLaSolicitudForm.get('fechaDeFabricacion')?.value;
    const FECHA_DE_CADUCIDAD = this.dataDeLaSolicitudForm.get('fechaDeCaducidad')?.value;

    if (!CLAVE_DE_LOS_LOTES || !FECHA_DE_FABRICACION || !FECHA_DE_CADUCIDAD) {
      console.error('All fields are required to add a row.');
      return;
    }

    const NEW_ROW = {
      id: this.listaClaveTabla.length + 1,
      claveDeLosLotes: CLAVE_DE_LOS_LOTES,
      fechaDeFabricacion: FECHA_DE_FABRICACION,
      fechaDeCaducidad: FECHA_DE_CADUCIDAD,
    };

    this.listaClaveTabla = [...this.listaClaveTabla, NEW_ROW];
    this.dataDeLaSolicitudForm.reset();
  }

  /** Modifica una fila seleccionada en la lista de claves */

  onModificar(): void {
    if (this.filasSeleccionadas.size === 0) {
      return;
    }

    const INDICE_FILA_SELECCIONADA = Array.from(this.filasSeleccionadas)[0];
    const ROW_INDEX = this.listaClaveTabla.findIndex(
      (row) => Number(row.claveDeLosLotes) === INDICE_FILA_SELECCIONADA
    );

    if (ROW_INDEX === -1) {
      return;
    }

    this.ediciondeindicedefila = ROW_INDEX;

    const SELECTED_ROW = this.listaClaveTabla[ROW_INDEX];

    this.dataDeLaSolicitudForm.patchValue({
      claveDeLosLotes: SELECTED_ROW.claveDeLosLotes || '',
      fechaDeFabricacion: SELECTED_ROW.fechaDeFabricacion || '',
      fechaDeCaducidad: SELECTED_ROW.fechaDeCaducidad || '',
    });
  }
  /** Obtiene el formulario de datos del trámite a realizar */

  get datosDelTramiteRealizar(): FormGroup {
    return this.dataDeLaSolicitudForm.get(
      'datosDelTramiteRealizar'
    ) as FormGroup;
  }

  get datosDelManifiestos(): FormGroup {
    return this.dataDeLaSolicitudForm.get(
      'datosDelManifiestos'
    ) as FormGroup;
  }
  /**
   * Obtiene el grupo de formulario para la clave SCIAN.
   * @return El grupo de formulario `claveScianG`.
   */
  get claveScianG(): FormGroup {
    return this.clavaScianForm.get('claveScianG') as FormGroup;
  }

  /** Establece valores en el store */
  onSave(): void {
    if(this.dataDeLaSolicitudForm.invalid) {
      this.dataDeLaSolicitudForm.markAllAsTouched();
      return;
    }
    const FORM_DATA = { ...this.dataDeLaSolicitudForm.value };

    FORM_DATA.tipoProducto = this.tipoProductoData.catalogos.find(
      (item: Catalogo) => String(item.id) === String(FORM_DATA.tipoProducto)
    )?.descripcion || FORM_DATA.tipoProducto;

    FORM_DATA.clasificaionProductos = this.delProducto.catalogos.find(
      (item: Catalogo) => String(item.id) === String(FORM_DATA.clasificaionProductos)
    )?.descripcion || FORM_DATA.clasificaionProductos;

    FORM_DATA.especificarProducto = this.especificarData.catalogos.find(
      (item: Catalogo) => String(item.id) === String(FORM_DATA.especificarProducto)
    )?.descripcion || FORM_DATA.especificarProducto;


    if (this.indiceFilaSeleccionada !== null) {
      this.mercanciasConfiguracionTabla = [
        ...this.mercanciasConfiguracionTabla.slice(0, this.indiceFilaSeleccionada),
        {
          ...this.mercanciasConfiguracionTabla[this.indiceFilaSeleccionada],
          ...FORM_DATA
        },
        ...this.mercanciasConfiguracionTabla.slice(this.indiceFilaSeleccionada + 1)
      ];

    } else {
      const NEW_ID = this.mercanciasConfiguracionTabla.length > 0
        ? Math.max(...this.mercanciasConfiguracionTabla.map(item => item.id || 0)) + 1
        : 1;
      this.mercanciasConfiguracionTabla = [
        ...this.mercanciasConfiguracionTabla,
        { ...FORM_DATA, id: NEW_ID }
      ];


    }

    this.dataDeLaSolicitudForm.reset();
    this.filasSeleccionadas.clear();
    this.indiceFilaSeleccionada = null;

    this.cdr.detectChanges();
    this.closeModal();
  }

  /*
    * Maneja el evento de cambio en la selección de filas.
    * Si se selecciona una fila, actualiza el índice de la fila seleccionada y los valores del formulario.
    * Muestra el modal para agregar o modificar mercancías.
    */
  onChange(): void {

    if (!this.filasSeleccionadas || this.filasSeleccionadas.size !== 1) {

      return;
    }

    const SELECTED_ID = Array.from(this.filasSeleccionadas)[0];
    const SELECTED_ROW_INDEX = this.mercanciasConfiguracionTabla.findIndex((row) => row.id === SELECTED_ID);

    if (SELECTED_ROW_INDEX === -1) {
      return;
    }

    this.indiceFilaSeleccionada = SELECTED_ROW_INDEX;
    const SELECTED_ROW = this.mercanciasConfiguracionTabla[SELECTED_ROW_INDEX];

    // Parche los valores del formulario con la asignación correcta para los campos del catálogo
    this.dataDeLaSolicitudForm.patchValue({

      clasificaionProductos: this.delProducto.catalogos.find(
        (item) => item.descripcion === SELECTED_ROW.clasificaionProductos
      )?.id || SELECTED_ROW.clasificaionProductos,
      especificarProducto: this.especificarData.catalogos.find(
        (item) => item.descripcion === SELECTED_ROW.especificarProducto
      )?.id || SELECTED_ROW.especificarProducto,
      nombreProductoEspecifico: SELECTED_ROW.nombreProductoEspecifico,
      marca: SELECTED_ROW.marca,
      fraccionArancelaria: SELECTED_ROW.fraccionArancelaria,
      descripcionFraccionArancelaria: SELECTED_ROW.descripcionFraccionArancelaria,
      cantidadUMT: SELECTED_ROW.cantidadUMT,
      umt: SELECTED_ROW.umt,
      cantidadUMC: SELECTED_ROW.cantidadUMC,
      umc: SELECTED_ROW.umc,
      paisDeOrigen: SELECTED_ROW.paisDeOrigen,
      paisDeProcedencia: SELECTED_ROW.paisDeProcedencia,
      usoEspecifico: SELECTED_ROW.usoEspecifico,
    });

    this.filasSeleccionadas.clear();
    // mostrar el modal
    const MODAL_ELEMENT = document.getElementById('modalAgregarMercancia');
    if (MODAL_ELEMENT) {
      const MODAL_INSTANCE = new Modal(MODAL_ELEMENT);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Establece los valores en el store a partir del formulario.
   * @param form El formulario que contiene los valores.
   * @param campo El campo del formulario que se va a establecer en el store.
   * @param metodoNombre El nombre del método en el store que se va a utilizar para establecer el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud260702Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud260702Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

/**
 * Obtiene o busca los datos relacionados al RFC proporcionado en el formulario.
 * 
 * Este método toma el valor del campo 'rfc' del formulario `datosDelTramiteRealizar`,
 * realiza una solicitud al servicio `registrarsolicitudmcp` para obtener los datos
 * asociados al RFC y al procedimiento actual. Si la respuesta contiene datos,
 * actualiza los campos del formulario con la información recibida.
 * 
 * @remarks
 * Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
 */
obtainorBuscarDatos():void{
const RFC={
  rfcRepresentanteLegal: this.datosDelTramiteRealizar.controls['rfc'].value
};
 this.registrarsolicitudmcp.obtenerBuscarDatos(this.idProcedimiento.toString(),RFC).pipe(takeUntil(this.destroyed$)).subscribe((res)=>{
const DATOAS = res?.datos;
let DATOS: ParticipanteInfo | undefined;

if (Array.isArray(DATOAS)) {
  DATOS = DATOAS[0];
} else if (DATOAS) {
  DATOS = DATOAS as ParticipanteInfo;
}

if (DATOS) {
  this.datosDelTramiteRealizar.patchValue({
    legalRazonSocial: DATOS.nombre || '',
    apellidoPaterno: DATOS.apellidoPaterno || '',
    apellidoMaterno: DATOS.apellidoMaterno || '',
  });
}
this.setValoresStore(this.datosDelTramiteRealizar,'legalRazonSocial', 'setLegalRazonSocial');
this.setValoresStore(this.datosDelTramiteRealizar,'apellidoPaterno', 'setApellidoPaterno');
this.setValoresStore(this.datosDelTramiteRealizar,'apellidoMaterno', 'setApellidoMaterno');
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
  public esValido(campo: string, form: FormGroup): boolean | null {
    return this.validacionesService.isValid(form, campo);
  }

  /** Destrucción del componente */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * Método para verificar si el botón "Buscar" debe ser visible.
   * El botón no será visible para el procedimiento 260701.
   */
  public isBuscarButtonVisible(): boolean {
    return this.idProcedimiento !== 260701;
  }
}
