import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, } from '@angular/core';
import { AvisocalidadStore, SolicitudState } from '../../estados/stores/aviso-calidad.store';
import { CROSLISTA_DE_PAISES, FUNCIONAMIENTO_LIST, INPUT_FECHA_CADUCIDAD_CONFIG, } from '../../constantes/datos-domicilio-legal.enum';
import { Catalogo, CatalogoSelectComponent, ConfiguracionColumna, CrossListLable, CrosslistComponent, REGEX_TEXTO_ALFANUMERICO_EXTENDIDO, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { DATOS_MERCANCIAS, MercanciasInfo, NICO_TABLA, NicoInfo, } from '../../models/datos-domicilio-legal.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { AvisocalidadQuery } from '../../estados/queries/aviso-calidad.query';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDomicilioLegalService } from '../../services/datos-domicilio-legal.service';
import { DatosDomicilioService } from '../../../tramites/260514/services/permiso-importacion.service';
import { InputCheckComponent } from '@libs/shared/data-access-user/src';
import { Modal } from 'bootstrap';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/**
 * Representa la estructura de la respuesta de una tabla.
 */
export interface RespuestaTabla {
  /**
   * Código de estado de la respuesta.
   * @type {number}
   */
  code: number;

  /**
   * Datos de tipo NicoInfo que contiene la respuesta.
   * @type {NicoInfo[]}
   */
  data: NicoInfo[];

  /**
   * Mensaje descriptivo de la respuesta.
   * @type {string}
   */
  message: string;
}

/**
 * Interfaz que representa la estructura de datos para la tabla de mercancías.
 */
export interface MercanciasTabla {
  /**
   * Código de estado que indica el resultado de la operación.
   * @type {number}
   */
  code: number;

  /**
   * Lista de información detallada sobre las mercancías.
   * @type {MercanciasInfo[]}
   */
  data: MercanciasInfo[];

  /**
   * Mensaje descriptivo relacionado con el resultado de la operación.
   * @type {string}
   */
  message: string;
}

/**
 * Componente para el domicilio del establecimiento.
 */
@Component({
  selector: 'app-domicillo-establecimiento-aduanas',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    CrosslistComponent,
    InputCheckComponent,
    TooltipModule
  ],
  templateUrl: './domicilio-establecimiento-aduanas.component.html',
  styleUrls: ['./domicilio-establecimiento-aduanas.component.css'],
})
export class DomicilioEstablecimientoAduanasComponent implements OnInit, OnDestroy, AfterViewInit {
  funcionamientoList:number[] = [];

  @Input() public idProcedimiento!: number;

  /**
   * Referencia a los componentes de la lista de fechas.
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: SolicitudState;

  /**
   * Lista de datos de partidas.
   */
  public seleccionados: MercanciasInfo[] = [];
  /**
   * Notificador para destruir observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constante para el mensaje de alerta.
   */
  INPUT_FECHA_CADUCIDAD_CONFIG = INPUT_FECHA_CADUCIDAD_CONFIG;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente.
   * @param fb
   * @param DatosDomicilioLegalStore
   * @param DatosDomicilioLegalQuery
   * @param service
   */
  constructor(
    public readonly fb: FormBuilder,
    private avisocalidadStore: AvisocalidadStore,
    private avisocalidadQuery: AvisocalidadQuery,
    private service: DatosDomicilioLegalService,
    private consultaioQuery: ConsultaioQuery,
    private datosDomicilioService: DatosDomicilioService,
    private servicioDeFormularioService: ServicioDeFormularioService,
  ) {
    // Reservado para futuras inyecciones de dependencias o inicializaciones.
  }

  /**
   * Referencia al modal para agregar agentes de mercancías.
   */
  @ViewChild('modalAddAgentMercancias', { static: false }) 
  /**
   * Referencia al elemento del DOM que representa el modal para agregar agentes de mercancías.
   */
  modalAddAgentMercancias!: ElementRef;

  /**
   * Referencia al modal para agregar agentes de mercancías.
   */
  @ViewChild('modalAddAgentScian', { static: false }) modalAddAgentScian!: ElementRef;
  /**
   * Grupo de formularios principal.
   * @property {FormGroup} domicilio
   */
  domicilio!: FormGroup;

  /**
   * Instancia del Modal de Bootstrap utilizada para controlar la visualización y el comportamiento del cuadro de diálogo modal
   * dentro del componente DomicilioEstablecimientoComponent.
   *
   * */
  modalInstance!: Modal; /**

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
  aduanasDeEntradaFecha: FormControl = new FormControl('');

  /**
   * Control de formulario para la fecha aduanasDeEntradaFechaSeleccionada.
   */
  aduanasDeEntradaFechaSeleccionada: FormControl = new FormControl('');

  /**
   * Control de formulario para la aduanasDeEntradaFechaSeleccionada.
   */
  estado: Catalogo[] = [];

  /**
   * Control de formulario para la aduanasDeEntradaFechaSeleccionada.
   */
  public estadoDescripcion: Catalogo[] = [];

  /**
   * Lista de paises.
   */
  public crosListaDePaises = CROSLISTA_DE_PAISES;

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

  /** Lista de elementos seleccionados en la tabla SCIAN.
   * @type {NicoInfo[]}
   */
  public seleccionaScian: NicoInfo[] = [];

  /**
   * Tabla de selección de checkbox.
   */
  mercanciasTabla: ConfiguracionColumna<MercanciasInfo>[] = DATOS_MERCANCIAS;

  /**
   * Datos de la tabla de selección de checkbox.
   */
  mercanciasTablaDatos: MercanciasInfo[] = [];

  /**
   * Lista de aduanas de entrada seleccionadas.
   */
  aduanasDeEntradaSeleccionadas: string[] = [];

  /**
   * Lista de aduanas de entrada seleccionadas.
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
   * Indica si la sección es colapsableTres.
   * @property {boolean} colapsableTres
   */
  colapsableTres: boolean = false;

  /**
   * Lista de rangos de días seleccionarOrigenDelPais.
   */
  seleccionarOrigenDelPais: string[] = this.crosListaDePaises;

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
   * Indica si se ha hecho clic en el botón "Seleccionado".
   * Se utiliza para rastrear el estado de selección del botón dentro del componente.
   */
  tieneSeleccionadoBtnClicked: boolean = false;

  /** Etiqueta que se muestra para el campo de número de licencia sanitaria en el formulario. */
  public licenseLabel: string = "No. de licencia sanitaria*:"

  /**
   * Etiqueta de la lista de fechas.
   * */
  public aduanasDeLabel: CrossListLable = {
    tituluDeLaIzquierda: 'Aduanas de entrada disponibles:',
    derecha: 'Aduanas de entrada seleccionadas*:',
  };

  /**
  * Etiqueta de la lista de fechas.
  * */
  public paisDeOrigenLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de origen:',
    derecha: 'País(es) seleccionado(s)*:',
  };

  /**
    * Etiqueta de la lista de fechas.
    * */
  public paisDeProcedenciaLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de procedencia:',
    derecha: 'País(es) seleccionado(s)*:',
  };

  /**
    * Catálogo de fracciones arancelarias y sus descripciones.
    * @property {Array<{ fraccion: string, descripcion: string }>} fraccionesCatalogo
    */
  fraccionesCatalogo = [
    { fraccion: '0101.21.01', descripcion: 'Caballos de carrera' },
    { fraccion: '0201.30.00', descripcion: 'Carne de bovino congelada' },
    { fraccion: '0402.10.01', descripcion: 'Leche en polvo, sin azúcar' },
    { fraccion: '1006.30.99', descripcion: 'Arroz semiblanqueado' }
  ];
  /**
  * Ciclo de vida `AfterViewInit`.
  * Inicializa la instancia del modal de Bootstrap.
  */
  ngAfterViewInit(): void {
    this.funcionamientoList = FUNCIONAMIENTO_LIST;
    if(!this.funcionamientoList.includes(this.idProcedimiento)){
      this.domicilio.get('avisoCheckbox')?.setValidators([]);
      this.domicilio.get('avisoCheckbox')?.updateValueAndValidity();
      this.domicilio.get('licenciaSanitaria')?.setValidators([]);
      this.domicilio.get('licenciaSanitaria')?.updateValueAndValidity();
    }
    if (this.modalAddAgentMercancias) {
      this.modalInstance = new Modal(this.modalAddAgentMercancias.nativeElement);
    }
  }

  /**
   * Etiqueta de la lista de fechas.
   * */
  ngOnInit(): void {

    /**
   * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
   *
   * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
   * - Llama a `configurarGrupoForm()` para aplicar configuraciones basadas en el estado recibido.
   * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
   */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if(seccionState.readonly || seccionState.update) {
             this.obtenerTablaDatos();
            this.obtenerMercanciasDatos();
          }
        })
      )
      .subscribe()

    this.obtenerEstadoList();
    this.obtenerEstadoDescripcionList();
    this.configurarGrupoForm(); // Configura el grupo de formularios con los valores iniciales.

    this.datosDomicilioService.event$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((valor) => {
          this.tieneSeleccionadoBtnClicked = (valor as boolean);
          if (this.tieneSeleccionadoBtnClicked) {
            this.domicilio.enable();
            this.formAgente.enable();
            this.formMercancias.enable();
          }
        })
      )
      .subscribe()

    this.servicioDeFormularioService.formTouched$.subscribe((formName) => {
      if (formName === 'domicilioForm') {
        this.domicilio.markAllAsTouched();
      }
    });

  }

  /**
   * @method configurarGrupoForm
   * @description Configures the reactive form group for the "Datos del Establecimiento RFC" component.
   * This method initializes the form group with default values and validation rules for the fields:
   * - `rfcDel`: Optional field with a maximum length of 254 characters.
   * - `denominacionRazonSocial`: Required field with a maximum length of 254 characters.
   * - `correoElectronico`: Required field with a valid email format and a maximum length of 320 characters.
   * 
   * @memberof DatosDelEstablecimientoRfcComponent
   */
  configurarGrupoForm(): void {
    this.avisocalidadQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    /* 
    * Inicializa el grupo de formularios con los valores del estado de la solicitud.
    */
    this.domicilio = this.fb.group({
      codigoPostal: [this.solicitudState?.codigoPostal, [Validators.required, Validators.maxLength(12),Validators.pattern('^[0-9]+$')]],
      estado: [this.solicitudState?.estado, Validators.required],
      muncipio: [this.solicitudState?.muncipio, [Validators.required, Validators.maxLength(120)]],
      localidad: [this.solicitudState?.localidad,[Validators.pattern(REGEX_TEXTO_ALFANUMERICO_EXTENDIDO)]],
      colonia: [this.solicitudState?.colonia,[Validators.pattern(REGEX_TEXTO_ALFANUMERICO_EXTENDIDO)]],
      calle: [this.solicitudState?.calle, [Validators.required, Validators.maxLength(100)]],
      lada: [this.solicitudState?.lada],
      telefono: [this.solicitudState?.telefono, [Validators.required, Validators.maxLength(this.idProcedimiento === 260513 ? 24 :30),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      avisoCheckbox: [this.solicitudState?.avisoCheckbox],
      licenciaSanitaria: [this.solicitudState?.licenciaSanitaria, [Validators.required, Validators.maxLength(50)]],
    });

    /** 
     *Inicializa el grupo de formularios para el agente aduanal y las mercancías.
     */
    this.formAgente = this.fb.group({
      claveScianModal: [this.solicitudState?.claveScianModal, Validators.required],
      claveDescripcionModal: [{value: this.solicitudState?.claveDescripcionModal, disabled: true}],
    });

    /** 
     * Inicializa el grupo de formularios para las mercancías con los valores del estado de la solicitud.
     */
    this.formMercancias = this.fb.group({
      nombreComercial: [this.solicitudState?.nombreComercial, [Validators.required, Validators.maxLength(1000)]],
      nombreComun: [this.solicitudState?.nombreComun, [Validators.required, Validators.maxLength(256)]],
      nombreCientifico: [this.solicitudState?.nombreCientifico, [Validators.required, Validators.maxLength(256)]],
      usoEspecifico: [this.solicitudState?.usoEspecifico, [Validators.required, Validators.maxLength(5000)]],
      estadofisico: [this.solicitudState?.estadoFisico, Validators.required],
      fraccionArancelaria: [this.solicitudState?.fraccionArancelaria, [Validators.required, Validators.minLength(8), Validators.maxLength(8),Validators.pattern(/^[0-9]+$/)]],
      descripcionFraccion: [{ value: this.solicitudState?.descripcionFraccion, disabled: true }, Validators.required],
      cantidadUMT: [this.solicitudState?.cantidadUMT, [Validators.required, Validators.maxLength(20)]],
      UMT: [{ value: this.solicitudState?.UMT, disabled: true }, Validators.required],
      cantidadUMC: [this.solicitudState?.cantidadUMC, [Validators.required, Validators.maxLength(20),Validators.pattern(/^\d{1,15}(\.\d{1,3})?$/)]],
      UMC: [this.solicitudState?.UMC, Validators.required],
      numerocas: [this.solicitudState?.numeroCas, [Validators.required, Validators.maxLength(20)]],
      porcentajeConcentracion: [this.solicitudState?.porcentajeConcentracion, [Validators.required, Validators.maxLength(100)]],
      clasificacionToxicologica: [this.solicitudState?.clasificacionToxicologica, Validators.required],
      objetoImportacion: [this.solicitudState?.objetoImportacion, Validators.required],
    });

    /*
    * Si el formulario está en modo solo lectura, deshabilita todos los campos.
    * En caso contrario, habilita los campos para permitir la edición.
    * Esto asegura que el formulario refleje correctamente el estado de solo lectura.
    */
    if ((this.esFormularioSoloLectura && this.domicilio && this.formAgente && this.formMercancias)) {
      this.domicilio.disable();
    }

    if (!this.esFormularioSoloLectura && !this.tieneSeleccionadoBtnClicked) {
      this.domicilio.disable();
      this.domicilio.get('licenciaSanitaria')?.enable();
    }

    this.servicioDeFormularioService.registerForm('domicilioForm', this.domicilio);
  }
  /**
   * Botones de acción disponibles para gestionar las listas de fechas.
   */
  readonly paisDeProcedenciaBotones = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-primary',
      funcion: (): void => this.crossList.forEach(cmp => cmp.agregar('t')),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-default',
      funcion: (): void => this.crossList.forEach(cmp => cmp.agregar('')),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-danger',
      funcion: (): void => this.crossList.forEach(cmp => cmp.quitar('')),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.forEach(cmp => cmp.quitar('t')),
    },
  ];

  /**
   * Método para obtener el valor de la fecha seleccionada.
   * @param event
   */
  obtenerEstadoList(): void {
    this.service
      .getObtenerEstadoList()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.estado = data;
      });
  }

  /**
   * Método para obtener el valor de la fecha seleccionada.
   * @param event
   */
  obtenerEstadoDescripcionList(): void {
    this.service
      .getObtenerEstadoDescripcionList()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.estadoDescripcion = data;
      });
  }

  /**
   * Método para obtener el valor de la fecha seleccionada.
   */
  obtenerTablaDatos(): void {
    this.datosDomicilioService
      .getObtenerTablaDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        const DATOS = Array.isArray(data?.data) ? data.data : [data.data];
        this.nicoTablaDatos = [...this.nicoTablaDatos, ...DATOS];
      });
  }

  /**
   * Método para obtener el valor de la fecha seleccionada.
   */
  obtenerMercanciasDatos(): void {
    this.datosDomicilioService
      .getObtenerMercanciasDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.mercanciasTablaDatos = data?.data;
      });
  }

  /**
   * Alterna el estado colapsable de la sección del formulario.
   * @method mostrar_colapsableDuos
   */
  mostrar_colapsableDuos(): void {
    this.colapsableDuos = !this.colapsableDuos;
  }

  /**
   * Alterna el estado colapsable de la sección del formulario.
   * @method mostrar_colapsableTres
   */
  mostrar_colapsableTres(): void {
    this.colapsableTres = !this.colapsableTres;
  }

  /**
   * @method onClaveScianChange
   * @description Maneja el evento de cambio del dropdown y actualiza el campo de descripción.
   * @param {Event} event - Evento de cambio del dropdown.
   */
  onClaveScianChange(event: Event): void {
    if (event) {
      this.formAgente.get('claveDescripcionModal')?.setValue(this.estadoDescripcion?.[0].id);
    }
  }
  
  /**
   * Abre el modal SCIAN.
   */
  abrirModalMercancia(): void {
    if (this.modalAddAgentMercancias) {
      this.modalInstance = new Modal(this.modalAddAgentMercancias.nativeElement);
      this.modalInstance.show();
    }
  }

  /**
   * Abre el modal SCIAN.
   */
  abrirModalScian(): void {
    if (this.modalAddAgentScian) {
      this.modalInstance = new Modal(this.modalAddAgentScian.nativeElement);
      this.modalInstance.show();
    }
  }

  /**
  * @method limpiarScianForm
  * @description Limpia y reinicia el formulario asociado al agente SCian.
  * @returns {void}
  * 
  * @memberof DomicilioEstablecimientoComponent
  */
  limpiarScianForm(): void {
    this.formAgente.reset();
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
        clave_Scian: DomicilioEstablecimientoAduanasComponent.obtenerDescripcion(this.estado, this.formAgente.get('claveScianModal')?.value),
        descripcion_Scian: DomicilioEstablecimientoAduanasComponent.obtenerDescripcion(this.estadoDescripcion, this.formAgente.get('claveDescripcionModal')?.value),
      };
      this.nicoTablaDatos = [...this.nicoTablaDatos, NUEVO_DATO];
      this.formAgente.reset();
      this.cerrarModalScian();
    } else {
      this.formAgente.markAllAsTouched();
    }
  }

  /**
 * Agrega una nueva mercancía a la tabla si el formulario es válido.
 * Si el formulario no es válido, marca todos los campos como tocados para mostrar los errores.
 */
  agregarMercancia(): void {
    if (this.formMercancias.valid) {
      const DATOS = {
        nombreComercial: this.formMercancias.get('nombreComercial')?.value,
        nombreComun: this.formMercancias.get('nombreComun')?.value,
        nombreCientifico: this.formMercancias.get('nombreCientifico')?.value,
        porcentajeConcentracion: this.formMercancias.get('porcentajeConcentracion')?.value,
        clasificacionToxicologica: this.formMercancias.get('clasificacionToxicologica')?.value,
        objetoImportacion: this.formMercancias.get('objetoImportacion')?.value,
        fraccionArancelaria: this.formMercancias.get('fraccionArancelaria')?.value,
        descripcionFraccion: this.formMercancias.get('descripcionFraccion')?.value,
        unidadMedidaTarifa: 'VALOR FICITIO',
        cantidadUmt: this.formMercancias.get('cantidadUMT')?.value,
        cantidadUmc: this.formMercancias.get('cantidadUMC')?.value,
        paisProduccionIngredienteActivo: this.formMercancias.get('')?.value,
        paisElaboracionProducto: this.formMercancias.get('')?.value,
        paisProcedenciaUltimoPuerto: this.formMercancias.get('')?.value,
        paisOrigen: 'VALOR FICITIO',
        numeroRegistroSanitario: 'VALOR FICITIO',
        numeroCas: this.formMercancias.get('numerocas')?.value,
        estadoFisico: this.formMercancias.get('estadofisico')?.value,
        usoEspecifico: this.formMercancias.get('usoEspecifico')?.value,
        umc: this.formMercancias.get('UMC')?.value,
      };
      this.mercanciasTablaDatos = [...this.mercanciasTablaDatos, DATOS];
      this.formMercancias.reset();
      this.modalInstance.hide();
    } else {
      this.formMercancias.markAllAsTouched();
    }
  }

  /**
 * @method obtenerDescripcion
 * @description
 * Obtiene la descripción de la fracción arancelaria seleccionada en el formulario dinámico.
 * @returns {string} Descripción de la fracción arancelaria seleccionada o una cadena vacía si no existe.
 */
  public static obtenerDescripcion(array: Catalogo[], id: string): string {
    const DESCRIPCION = array.find((ele: Catalogo) => Number(ele.id) === Number(id))?.descripcion;
    return DESCRIPCION ?? '';
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
 * @description
 * Método que actualiza el estado del store con los valores del formulario.
 * @param form Formulario reactivo.
 * @param campo Campo del formulario que se desea actualizar.
 * @param metodoNombre Nombre del método del store que se invocará.
 */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof AvisocalidadStore): void {
    if (campo === 'avisoCheckbox' && form.get(campo)?.value) {
      this.licenseLabel = "No. de licencia sanitaria:"
    } else if (campo === 'avisoCheckbox' && !form.get(campo)?.value) {
      this.licenseLabel = "No. de licencia sanitaria*:"
    }
    const VALOR = form.get(campo)?.value;
    (this.avisocalidadStore[metodoNombre] as (value: string | number) => void)(VALOR);
    this.servicioDeFormularioService.setFormValue('domicilioForm', {
        [campo]: VALOR,
      });
  }

  /** * Método que se ejecuta al enviar el formulario de domicilio.
   * Actualiza el estado del store
   */
  onSeleccionChange(event: MercanciasInfo[]): void {
    this.seleccionados = event;
  }

  /** 
   * Método que se ejecuta al enviar el formulario de domicilio.
   * Actualiza el estado del store
   */
  onScianSeleccionChange(event: NicoInfo[]): void {
    this.seleccionaScian = event;
  }

  /*
   * Método que se ejecuta al enviar el formulario de domicilio.
   * Actualiza el estado del store con los valores del formulario de domicilio.
   */
  eliminarScian(): void {
    this.nicoTablaDatos = this.nicoTablaDatos.filter(
      item => !this.seleccionaScian.map(sel => sel.clave_Scian).includes(item.clave_Scian) &&
        !this.seleccionaScian.map(sel => sel.descripcion_Scian).includes(item.descripcion_Scian)
    );
    this.seleccionaScian = [];
  }
  /**
   * Método que se ejecuta al enviar el formulario de domicilio.
   * Actualiza el estado del store con los valores del formulario de domicilio.
   */
  eliminarMercancia(): void {
    const ID = this.seleccionados.map(item => item.nombreComercial);
    this.mercanciasTablaDatos = this.mercanciasTablaDatos.filter(
      item => !ID.includes(item.nombreComercial)
    );
    this.seleccionados = [];
  }
  /**
   * Método que se ejecuta al enviar el formulario de domicilio.
   * Actualiza el estado del store con los valores del formulario de domicilio.
   */

  limpiarMercanciaForm(): void {
    this.formMercancias.reset();
    this.modalInstance.show();
  }
  /**
   * Método que se ejecuta al enviar el formulario de domicilio.
   * Agrega un nuevo producto a la tabla de mercancías si el formulario es válido.
   * Si el formulario no es válido, marca todos los campos como tocados para mostrar errores.
   */

  agregarProducto(): void {
    if (this.formMercancias.valid) {
      const PRODUCTO = {
        nombreComercial: this.formMercancias.get('nombreComercial')?.value,
        nombreComun: this.formMercancias.get('nombreComun')?.value,
        nombreCientifico: this.formMercancias.get('nombreCientifico')?.value,
        porcentajeConcentracion: this.formMercancias.get('porcentajeConcentracion')?.value,
        clasificacionToxicologica: '',
        objetoImportacion: '',
        fraccionArancelaria: this.formMercancias.get('fraccionArancelaria')?.value,
        descripcionFraccion: this.formMercancias.get('descripcionFraccion')?.value,
        unidadMedidaTarifa: '',
        cantidadUmt: '',
        cantidadUmc: this.formMercancias.get('cantidadUmc')?.value,
        paisProduccionIngredienteActivo: '',
        paisElaboracionProducto: '',
        paisProcedenciaUltimoPuerto: '',
        paisOrigen: '',
        numeroRegistroSanitario: '',
        numeroCas: this.formMercancias.get('numeroCas')?.value,
        estadoFisico: '',
        usoEspecifico: this.formMercancias.get('usoEspecifico')?.value,
        umc: '',
      };

      this.mercanciasTablaDatos.push(PRODUCTO);

      this.formMercancias.reset();
    } else {
      this.formMercancias.markAllAsTouched();
    }
  }

  /**   
   * Método para obtener el valor de un control de formulario específico y actualizar otros campos relacionados.
   * @param formcontrol - El nombre del control de formulario cuyo valor se desea obtener.
   */
  public obtenerFormaControlDatos(formcontrol: string): void {
    const VALOR = this.formMercancias.get(formcontrol)?.value;
    if(VALOR !== '') {
      if(formcontrol === 'fraccionArancelaria') {
        this.formMercancias.get('descripcionFraccion')?.setValue('Etanal (acetaldehído). Nota: El número CAS de este producto es 75-07-0.');
      } else if(formcontrol === 'cantidadUMT') {
        this.formMercancias.get('UMT')?.setValue('Kilogramos');
      }
    }
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
