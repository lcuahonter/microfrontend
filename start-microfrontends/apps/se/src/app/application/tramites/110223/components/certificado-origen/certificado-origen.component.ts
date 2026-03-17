import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Catalogo, CatalogoServices, ConfiguracionColumna, ConsultaioQuery, InputFecha, SeccionLibQuery, SeccionLibState, SeccionLibStore, TablaSeleccion } from "@libs/shared/data-access-user/src";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import {Observable,Subject,map, of, takeUntil } from "rxjs";
import { Tramite110223Store, TramiteState } from "../../estados/Tramite110223.store";
import { CARGA_MERCANCIA_EXPORT } from "../../../../shared/constantes/modificacion.enum";
import { CargaPorArchivoComponent } from "../../../../shared/components/carga-por-archivo/carga-por-archivo.component";
import { CertificadoDeOrigenComponent } from "../../../../shared/components/certificado-de-origen/certificado-de-origen.component";
import { CertificadosOrigenService } from "../../services/certificado-origen.service";
import { CommonModule } from "@angular/common";
import { IDPROCEDIMIENTO } from "../../enums/constantes-alertas.enum";
import { Mercancia } from "../../../../shared/models/modificacion.enum";
import { MercanciaComponent } from "../../../../shared/components/mercancia/mercancia.component";
import { Modal } from "bootstrap";
import { OPTIONS_TRATADO } from "../../models/registro.model";
import { ToastrService } from "ngx-toastr";
import { Tramite110223Query } from "../../query/tramite110223.query";

/**
 * Constante que representa la configuración de la fecha de inicio en el componente.
 * 
 * @constant
 * @type {Object}
 * @property {string} labelNombre - Etiqueta que se muestra para el campo de fecha inicial.
 * @property {boolean} required - Indica si es obligatorio completar este campo.
 * @property {boolean} habilitado - Determina si el campo está activo para su edición.
 */
export const FECHA_INICIO = {
  labelNombre: 'Fecha inicio',
  required: true,
  habilitado: true,
};

/**
 * Constante que representa la configuración de la fecha final en el componente de certificado de origen.
 * 
 * @constant
 * @type {Object}
 * @property {string} labelNombre - El nombre de la etiqueta para la fecha final.
 * @property {boolean} required - Indica si el campo de fecha final es obligatorio.
 * @property {boolean} habilitado - Indica si el campo de fecha final está habilitado.
 */
export const FECHA_FINAL = {
  labelNombre: 'Fecha fin',
  required: true,
  habilitado: true,
};

/**
 * @componente CertificadoOrigen
 * @descripcion
 * Componente que gestiona los certificados de origen en el sistema.
 * 
 * @responsabilidades
 * - Gestión de formularios para datos del certificado
 * - Carga y manejo de catálogos
 * - Validación de información ingresada
 * - Interacción con el almacén de datos
 * - Control de mercancías asociadas
 * 
 * @modulo Trámites
 * @submodulo 110223
 */
@Component({
  selector: 'app-certificado-origen',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CertificadoDeOrigenComponent,
    CargaPorArchivoComponent,
    MercanciaComponent,
],
  providers: [ToastrService],
  templateUrl: './certificado-origen.component.html',
  styleUrl: './certificado-origen.component.scss',
})
export class CertificadoOrigenComponent implements OnInit, OnDestroy,AfterViewInit {

  /**
   * @descripcion
   * Indica si el operador está activo.
   */
  operador: boolean = true;

  /**
   * @entrada
   * @descripcion
   * Bandera que indica si el formulario debe estar deshabilitado. Cuando es `true`, todos los controles 
   * del formulario estarán inactivos e impedirán la edición por parte del usuario.
   * @tipo {boolean}
   */
   @Input() formularioDeshabilitado: boolean = false;

  /**
   * Formulario reactivo que gestiona los datos del certificado.
   * @tipo {FormGroup}
   */
  formCertificado!: { [key: string]: undefined | boolean | string | number | object };

  /**
   * Configuración de las fechas de inicio y fin.
   * @type {InputFecha}
   */
  public fechaInicioInput: InputFecha = FECHA_INICIO;
  /**
   * Configuración de la fecha final en el formulario de certificado de origen.
   * @type {InputFecha}
   */
  public fechaFinalInput: InputFecha = FECHA_FINAL;
  /**
   * Observable que emite la lista de estados disponibles del catálogo.
   * @tipo {Observable<Catalogo[]>}
   */
  estados$!: Observable<Catalogo[]>;
  
  /**
   * @descripcion
   * Lista de países disponibles.
   */
  pais: Catalogo[] = [];

  /**
   * Estado seleccionado del catálogo.
   * @type {Catalogo}
   */
  estado!: Catalogo;

  /**
   * Subject para gestionar el ciclo de vida del componente.
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();
  /**
   * Datos de la bitácora obtenidos desde el servicio.
   * @type {MercanciaShared[]}
   */
  datos: Mercancia[] = [];

  /**
   * Observable que emite los datos de las mercancías recuperadas.
   * @tipo {Observable<Mercancia[]>}
   */
  datos1: Observable<Mercancia[]>;

  /**
   * Estado de la selección de la tabla.
   * @type {TablaSeleccion}
   */
  seleccionTabla = TablaSeleccion.UNDEFINED;

  /**
   * Estado de la sección, gestionado mediante el store.
   * @type {SeccionLibState}
   */
  private seccion!: SeccionLibState;

  /**
   * @descripcion
   * Valores actuales del formulario de certificado.
   */
  formCertificadoValues!: { [key: string]: unknown };

    /**
   * Datos de la bitácora obtenidos desde el servicio.
   * @type {Mercancia[]}
   */
    datosSeleccionados!: Mercancia;
    /**
   * Instancia del modal de modificación.
   */
    modalInstance!: Modal;

  /**
   * @property {Modal} buscarModel
   * @description
   * Instancia del modal de búsqueda de mercancía.
   * Se utiliza para mostrar y controlar el modal de búsqueda de mercancías en el componente.
   */
    buscarModel!: Modal

    /**
     * @descripcion
     * Indica si el campo de mercancías está activo.
     */
    cargoDeMercancias: boolean = true;
    
    /**
     * @descripcion
     * Indica si hay mercancías disponibles.
     */
    mercanciasDisponibles: boolean = true;

    /**
   * Indica si la tabla de mercancías disponibles está visible.
   */
  mercanciasDisponiblesTabla: boolean = false;

    /**
     * @descripcion
     * Indica si se ha realizado una búsqueda de mercancías.
     */
    busquedaRealizada: boolean = false;

    /**
   * @property modifyModal
   * @tipo {ElementRef}
   * @descripcion
   * Referencia al elemento HTML del modal de modificación.
   * Permite inicializar y controlar el modal desde el componente.
   */
    @ViewChild('modifyModal', { static: false }) modifyModal!: ElementRef;

        /**
   * @property buscarMercanciaModal
   * @tipo {ElementRef}
   * @decorador ViewChild
   * @descripcion
   * Referencia al elemento HTML del modal de búsqueda de mercancías.
   * Permite controlar la apertura y cierre del modal desde el componente.
   */
  @ViewChild('buscarMercanciaModal', { static: false }) buscarMercanciaModal!: ElementRef;

  /**
   * @property certificadoDeOrigen
   * @tipo {CertificadoDeOrigenComponent}
   * @decorador ViewChild
   * @descripcion
   * Referencia al componente hijo que maneja el certificado de origen.
   * Permite acceder a los métodos y propertyes del componente hijo desde este componente padre.
   */
  @ViewChild('certificadoDeOrigen') certificadoDeOrigen!: CertificadoDeOrigenComponent;
  
  /**
   * @descripcion
   * Indica si el formulario se encuentra en modo solo lectura.
   * Cuando es verdadero, los controles del formulario estarán deshabilitados.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado de selección de la tabla.
   * @type {boolean}
   */
  tablaSeleccionEvent: boolean = false;

  /**
   * @descripcion
   * Observable para los datos de la tabla.
   */
  datosTabla$: Mercancia[] = [];

  /**
 * Indica si el domicilio del tercer operador está presente.
 * @type {boolean}
 */
  domicilio: boolean = false;

  /**
   * @property {number} idProcedimiento
   * @description
   * Identificador numérico del procedimiento actual para el trámite 110204.
   * Se utiliza para configurar y asociar el proceso en los componentes y servicios relacionados.
   */
  idProcedimiento: number = IDPROCEDIMIENTO

  /**
   * Configuración de las columnas de la tabla de carga de mercancías.
   * Contiene la definición de cada columna utilizada para mostrar los datos de las mercancías.
   *
   * @type {ConfiguracionColumna<Mercancia>[]}
   */
  cargaMercanciaConfiguracionTabla: ConfiguracionColumna<Mercancia>[] = CARGA_MERCANCIA_EXPORT;
  
  /**
   * @property {boolean} fromMercanciasDisponibles
   * @description
   * Indica si la información proviene de mercancías disponibles.
   */
    fromMercanciasDisponibles: boolean = false;

  /** ID del trámite actual */
  TramitesID: string = '110223';

   /** Tratado asociado al certificado de origen */
  tratadoAsociado: string = 'TITRAC.TA';

  /**
   * @property optionsTratado - Opciones del catálogo de tratados comerciales
   * Contiene una lista de objetos del catálogo de tratados obtenidos desde el servicio
   */
  public optionsTratado = OPTIONS_TRATADO;

  /**
   * @descripcion
   * Estado actual del certificado.
   */
  private certificadoState!: TramiteState;

  /**
   * @descripcion
   * Observable para los datos de la tabla.
   */
  datosTablaUno$: Observable<Mercancia[]> = of([]);

  /**
   * @descripcion
   * Abre el modal de modificación con los datos proporcionados.
   * @param datos1 - Los datos de la mercancía a modificar.
   * @param fromMercanciasDisponibles - Indica si los datos provienen de las mercancías disponibles.
   */
  isEnableMercancia: boolean = false;

  /**
   * Constructor del componente CertificadoOrigenComponent.
   * Inicializa las dependencias necesarias para la gestión de certificados de origen.
   * 
   * @param fb FormBuilder para la creación y gestión de formularios reactivos.
   * @param store Store para manejar el estado del trámite 110204.
   * @param tramiteQuery Query para consultar el estado del trámite 110204.
   * @param certificadoService Servicio para la gestión de certificados de origen.
   * @param toastr Servicio para mostrar notificaciones al usuario.
   * @param seccionQuery Query para consultar el estado de la sección.
   * @param seccionStore Store para manejar el estado de la sección.
   * @param consultaQuery Query para consultar el estado de consulta.
   */
  constructor(
    private fb: FormBuilder,
    private store: Tramite110223Store,
    public tramiteQuery: Tramite110223Query,
    public certificadoService: CertificadosOrigenService,
    private toastr: ToastrService,
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    public consultaQuery: ConsultaioQuery,
    private catalogoServices: CatalogoServices,
    private cdr: ChangeDetectorRef
  ) {
  
 this.tramiteQuery.select(state => state.selectedMercancia)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((selected) => {
      this.datosSeleccionados = selected as Mercancia;
      });

    /**
     * Suscripción al estado de la sección para obtener y actualizar el estado.
     */
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();    
        this.estados$ = this.tramiteQuery.selectAltaPlanta$;
    this.datos1 = (this.tramiteQuery.selectBuscarMercancia$ as Observable<Mercancia[]>).pipe(
      map((mercancias: Mercancia[]) => mercancias as unknown as Mercancia[])
    );

    this.tramiteQuery.select()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state) => {
        this.certificadoState = state;
        this.datosTabla$ = state.mercanciaTabla;
        this.formCertificadoValues = state.formCertificado;
      });
    
  }

  /**
   * @metodo ngOnInit
   * @descripcion
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Realiza las siguientes tareas:
   * - Carga los estados iniciales
   * - Carga información de bloques
   * - Configura las suscripciones necesarias
   * - Inicializa la tabla de datos
   */
  ngOnInit(): void {

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {          
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();

  this.datosTablaUno$ = this.tramiteQuery.selectmercanciaTablaUno$;
  }

  /**
   * @descripcion
   * Método que actualiza el observable `datosTabla$` con un nuevo arreglo de objetos de tipo `Mercancia`.
   * @param {Mercancia[]} event - Arreglo de objetos de tipo `Mercancia` que han sido seleccionados o procesados.
   */
  guardarClicado(evento: Mercancia[]): void {
    this.datosTabla$ = evento;
    this.store.setMercanciaTabla(evento);
  }

  /**
   * Establece el estado seleccionado en el store.
   * @param {Catalogo} estado El estado seleccionado.
   */
  tipoEstadoSeleccion(estado: Catalogo): void {
    this.store.setEstado(estado);
  }

  /**
   * Establece el bloque seleccionado en el store.
   * @param {Catalogo} estado El bloque seleccionado.
   */
  tipoSeleccion(estado: Catalogo): void {
    this.store.setBloque([estado]);
  }

  /**
   * @metodo ngOnDestroy
   * @descripcion
   * Se ejecuta cuando el componente va a ser destruido.
   * 
   * @tareas
   * - Cancela todas las suscripciones activas
   * - Libera recursos para evitar fugas de memoria
   * 
   * @implementa OnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicia el proceso para buscar mercancías disponibles después de un breve retraso.
   *
   * Utiliza `setTimeout` para ejecutar el método `processBuscarMercancias` después de 100 milisegundos.
   * Esto puede ser útil para asegurar que ciertas operaciones previas hayan finalizado antes de realizar la búsqueda.
   */
  conseguirDisponiblesDatos(): void {
    setTimeout(() => {
      this.processBuscarMercancias();
    }, 100);
  }
  /**
   * @descripcion
   * Procesa la búsqueda de mercancías después de asegurar que los componentes estén inicializados.
   */
  private processBuscarMercancias(): void {
    if (!this.certificadoState) {
      return;
    }

    const SELECTED_ESTADO = this.certificadoState?.estado;
    const SELECTED_BLOQUE = this.certificadoState?.paisBloques;
    
    if (!SELECTED_ESTADO || !SELECTED_BLOQUE) {
      return;
    }

    const PAYLOAD = {
      rfcExportador: 'AAL0409235E6',
      tratadoAcuerdo: { idTratadoAcuerdo: this.certificadoState.formCertificado['entidadFederativa'] },
      pais: { cvePais: this.certificadoState.formCertificado['bloque'] },
    };

    this.certificadoService
      .buscarMercanciasCert(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response: any) => {
          
          const DATOS_MAPEADOS: Mercancia[] = (response?.datos ?? []).map(
            (item: any) => ({
              id: item.idMercancia,
              fraccionArancelaria: item.fraccionArancelaria || '',
              numeroDeRegistrodeProductos: item.numeroRegistroProducto || '',
              numeroRegistroProducto: item.numeroRegistroProducto || '',
              fechaExpedicion: item.fechaExpedicion || '',
              fechaVencimiento: item.fechaVencimiento || '',
              nombreTecnico: item.nombreTecnico || '',
              nombreComercial: item.nombreComercial || '',
              nombreIngles: item.nombreIngles || '',
              fraccionNaladi: item.fraccionNaladi || '',
              fraccionNaladiSa93: item.fraccionNaladiSa93 || '',
              fraccionNaladiSa96: item.fraccionNaladiSa96 || '',
              fraccionNaladiSa02: item.fraccionNaladiSa02 || '',
              criterioParaConferirOrigen: item.criterioOrigen || '',
              valorDeContenidoRegional: item.valorDeContenidoRegional || '',
              normaOrigen: item.normaOrigen || '',
              otrasInstancias: item.otrasInstancias || '',
              criterioParaTratoPreferencial: item.criterioParaTratoPreferencial || '',
              cantidad: '',
              umc: '',
              tipoFactura: '',
              valorMercancia: '',
              fechaFinalInput: '',
              numeroFactura: '',
              unidadMedidaMasaBruta: '',
              complementoClasificacion: '',
              complementoDescripcion: '',
              nalad: '',
              fechaFactura: '',
              marca: '',
              numeroDeSerie: '',
            })
          );

          this.store.setbuscarMercancia(DATOS_MAPEADOS);
          this.busquedaRealizada = true;
          this.datosTablaUno$ = of(DATOS_MAPEADOS || []);
          this.mercanciasDisponibles = true;
        }
      });
  }

  /**
   * @method abrirModalCargaPorArchivo
   * @description
   * Abre el modal de carga por archivo utilizando la instancia de `buscarModel`.
   * Si la instancia del modal existe, muestra el modal en la interfaz de usuario.
   * 
   * @returns {void}
   */
  abrirModalCargaPorArchivo(): void {
    if(this.buscarModel) {
      this.buscarModel.show();
    }
  }
    /**
   * Método para abrir el modal de modificación.
   */
     abrirModificarModal(
    disponiblesDatos: Mercancia,
    fromMercanciasDisponibles: boolean
  ): void {
    this.isEnableMercancia = true;
    this.datosSeleccionados = disponiblesDatos;
    this.fromMercanciasDisponibles = fromMercanciasDisponibles;
    this.store.setFormMercancia({ ...disponiblesDatos });
    this.cdr.detectChanges();
    this.modalInstance = new Modal(this.modifyModal.nativeElement);
    this.modalInstance.show();
  }

  /**
   *  @descripcion  
   * Actualiza el modal de modificación con los datos proporcionados.
   * @param datos1 
   * @param fromMercanciasDisponibles 
   */
  updatedModificarModal(
    datos1: Mercancia,
    fromMercanciasDisponibles: boolean
  ): void {
    this.datosSeleccionados = datos1;
    this.fromMercanciasDisponibles = fromMercanciasDisponibles;

    this.isEnableMercancia = true;
  }


      /**
 * @descripcion
 * Establece en el store la mercancía seleccionada en el evento.
 *
 * @param {Mercancia} evento  
 * Objeto de tipo `Mercancia` que representa la mercancía seleccionada.
 *
 * @returns {void}  
 * No retorna ningún valor.
 *
 * @ejemplo
 * ```ts
 * this.onMercanciaSeleccionada(mercanciaSeleccionada);
 * ```
 */
        
      onMercanciaSeleccionada(evento: Mercancia): void {
         this.store.setSelectedMercancia(evento);
      }
      /**
   * @metodo validarFormulario
   * @descripcion
   * Realiza la validación del formulario de certificado de origen a través del componente hijo `CertificadoDeOrigenComponent`.
   * Devuelve `true` cuando el formulario es válido, `false` en caso contrario.
   * Si no se encuentra disponible el componente hijo, devuelve `false`.
   *
   * @devuelve {boolean} Verdadero si el formulario es válido, falso en caso contrario.
   */
  validarFormulario(): boolean {
    let ESVALIDO = true;
    if (this.certificadoDeOrigen) {
      if (!this.certificadoDeOrigen.validarFormularios()) {
        ESVALIDO = false;
      }
    } else {
      ESVALIDO = false;
    }
    return ESVALIDO;
  }
  
    /**
     * Cierra el modal de modificación si está abierto.
     * 
     * @remarks
     * Este método verifica si hay una instancia de modal activa y, 
     * en caso afirmativo, la oculta.
     */
    cerrarModificarModal():void {
      this.datosSeleccionados = {} as Mercancia;
      if (this.modalInstance) {
        this.tablaSeleccionEvent = true;
        this.modalInstance.hide();
      }
      this.isEnableMercancia = false;
    }

    /**
   * Establece el estado de validez del formulario en el store.
   * @param valida Indica si el formulario es válido o no.
   */
  setFormValida(valida: boolean): void {
    this.store.setFormValida({ certificado: valida });
  }

  /**
   * @descripcion
   * Actualiza el almacén con los datos del formulario de certificado.
   * @param event - Objeto que contiene el nombre del grupo de formulario, el campo, el valor y el nombre del estado del almacén.
   */
  setValoresStore(event: { formGroupName: string, campo: string, valor: undefined, storeStateName: string }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormCertificado({ [CAMPO]: VALOR });
  }

  /**
   * Emite los datos de la mercancía al store.
   * @param evento Objeto de tipo Mercancia que contiene los datos a emitir.
   */
emitmercaniasDatos(evento: Mercancia): void {
    this.store.setMercanciaTabla([evento]);
  }
  
  /**
   * @metodo ngAfterViewInit
   * @descripcion
   * Se ejecuta después de que la vista del componente ha sido inicializada.
   * 
   * @tareas
   * - Inicializa el modal de modificación si existe en el DOM
   * - Configura el modal de búsqueda de mercancías
   * 
   * @implementa AfterViewInit
   */
  ngAfterViewInit():void {
    // Inicializa el modal de modificación
    if (this.modifyModal) {
      this.modalInstance = new Modal(this.modifyModal.nativeElement);
    }
    if(this.buscarMercanciaModal) {
      this.buscarModel = new Modal(this.buscarMercanciaModal.nativeElement);
    }
  }  
    
}
