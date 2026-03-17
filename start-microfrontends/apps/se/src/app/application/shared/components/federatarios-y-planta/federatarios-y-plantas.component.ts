import { AlertComponent, ConsultaioState, ModeloDeFormaDinamica, Notificacion, NotificacionesComponent } from '@ng-mf/data-access-user';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { ComplementarPlantaState, ComplementoDePlanta, MontoDeInversion } from '../../../shared/constantes/complementar-planta.enum';
import { DATOS_FEDERATARIOS, EXPRESAS, FECHA_DE_PAGO } from '../../constantes/federatarios-y-plantas.enum';
import { EXPRESAS_EXTRANJERAS, EmpresasEXtranjeras, ExpresasConfiguration, FederatariosEncabezado } from '../../models/federatarios-y-plantas.model';
import { FEDERATARIOS_DATOS, PLANTAS_DATOS, PLANTAS_IMMEX } from '../../../tramites/80103/constantes/nuevo-programa.enum';
import { FederatoriosState, FederatoriosStore } from '../../../estados/tramites/federatarios.store';
import { Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AnexarDocumentosComponent } from '@libs/shared/data-access-user/src';
import { CapacidadInstalada } from '../../constantes/capacidad-instalada.enum';
import { CapacidadInstaladaComponent } from '../capacidad-instalada/capacidad-instalada.component';
import { CargaPorArchivoComponent } from '../carga-por-archivo/carga-por-archivo.component';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { ComplementarPlantaComponent } from '../complementar-planta/complementar-planta.component';
import { ComplimentosService } from '../../services/complimentos.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Directos } from '../../constantes/empleados.enum';
import { EmpleadosComponent } from '../empleados/empleados.component';
import { FederatariosYPlantasConfiguration } from '../../models/federatarios-y-plantas.model';
import { FederatoriosQuery } from '../../../estados/queries/federatarios.query';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { FormsModule } from '@angular/forms';
import { INMEX_PLANTAS } from '../../constantes/federatarios-y-plantas.enum';
import { InputFecha } from '@libs/shared/data-access-user/src';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';
import { MontosDeInversionComponent } from '../montos-de-inversion/montos-de-inversion.component';
import { PlantasDisponibles } from '../../models/federatarios-y-plantas.model';
import { PlantasImmex } from '../../models/federatarios-y-plantas.model';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { TEXTO_ALERTA } from '../../models/federatarios-y-plantas.model';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';
/**
 * Componente para los federatarios y plantas
 * @export FederatariosYPlantasComponent
 */
@Component({
  selector: 'app-federatarios-y-planta',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    AlertComponent,
    InputFechaComponent,
    CatalogoSelectComponent,
    FormsModule,
    FormasDinamicasComponent,
    ComplementarPlantaComponent,
    MontosDeInversionComponent,
    EmpleadosComponent,
    CapacidadInstaladaComponent,
    AnexarDocumentosComponent,
    CargaPorArchivoComponent,
    NotificacionesComponent
  ],
  templateUrl: './federatarios-y-plantas.component.html',
  styleUrl: './federatarios-y-plantas.component.scss',
})
/**
 * Componente para gestionar federatarios y sus plantas asociadas.
 * Inicializa los datos necesarios al iniciar el componente.
 */
export class FederatariosYPlantasComponent implements OnInit, OnDestroy {


  /**
   * Datos de federatarios que se mostrarán en la tabla
   * @property {FederatariosEncabezado} datosFederatarios
   */
  @Input()
  datosFederatarios!: FederatariosEncabezado;
  /**
   * Contiene los datos de los federatarios utilizados en el formulario de representante legal.
   * Esta propiedad se inicializa con la constante `DATOS_FEDERATARIOS`.
   */
  public representanteLegalFormData = DATOS_FEDERATARIOS;

  /**
   * Datos del formulario relacionados con las expresas.
   * Esta propiedad utiliza la constante `EXPRESAS` para inicializar
   * los datos necesarios en el componente.
   */
  public expresasFormData = EXPRESAS;

  /**
   * Referencia al elemento del DOM asociado al modal "complementarPlanta".
   * Utilizado para interactuar directamente con el elemento HTML desde el componente.
   */
  @ViewChild('complementarPlanta') modalElement!: ElementRef;

  /**
   * Referencia al elemento DOM identificado con el nombre 'montos'.
   * Utiliza el decorador `@ViewChild` para acceder al elemento en la plantilla
   * asociado a esta propiedad. Este elemento puede ser utilizado para manipular
   * directamente el DOM o acceder a sus propiedades y métodos.
   */
  @ViewChild('montos') montos!: ElementRef;

  /**
   * Referencia al elemento del DOM asociado con 'empleadosAcciones'.
   * Este elemento se utiliza para interactuar directamente con el DOM
   * dentro del componente, permitiendo realizar operaciones específicas
   * sobre el elemento HTML correspondiente.
   */
  @ViewChild('empleadosAcciones') empleadosAcciones!: ElementRef;

  /**
   * Referencia al elemento del DOM identificado como 'capacidadInstalada'.
   * Utiliza el decorador `@ViewChild` para acceder al elemento directamente
   * desde el componente después de que la vista haya sido inicializada.
   * 
   * @type {ElementRef}
   */
  @ViewChild('capacidadInstalada') capacidadInstalada!: ElementRef;

  /**
   * Referencia al elemento del DOM identificado como 'cargaPorPrchivo'.
   * Este elemento se utiliza para interactuar directamente con el DOM,
   * permitiendo realizar operaciones relacionadas con la carga de archivos.
   */
  @ViewChild('cargaPorPrchivo') cargaPorPrchivo!: ElementRef;


  /**
   * Configuración para la tabla de federatarios
   * @property {FederatariosYPlantasConfiguration<FederatariosEncabezado>} federatariosConfig
   */
  @Input()
  federatariosConfig!: FederatariosYPlantasConfiguration<FederatariosEncabezado>;

  /**
   * Configuración para la gestión de empresas extranjeras en el componente.
   * 
   * @property {TablaSeleccion} TablaSeleccion - Define el tipo de selección que se utilizará en la tabla (por ejemplo, CHECKBOX).
   * @property {typeof EXPRESAS_EXTRANJERAS} TablaEncabezado - Encabezado de la tabla que contiene la configuración de las columnas para las empresas extranjeras.
   */
  ExpresasConfig: ExpresasConfiguration<EmpresasEXtranjeras> = {
    TablaSeleccion: TablaSeleccion.CHECKBOX,
    TablaEncabezado: EXPRESAS_EXTRANJERAS
    ,
  };

  /**
     * Evento que emite la lista de objetos de tipo `CapacidadInstalada` para la tabla de capacidad instalada.
     * 
     * @event
     * @type {EventEmitter<CapacidadInstalada[]>}
     * @remarks
     * Este evento se dispara cuando hay cambios en la lista de capacidad instalada, permitiendo que componentes padres reciban la información actualizada.
     */
  @Output() obtainorCapacidadInstaladaTablaList: EventEmitter<
    CapacidadInstalada[]
  > = new EventEmitter<CapacidadInstalada[]>(false);

/**
 * Evento que emite la lista de complementos de planta.
 * 
 * La emisión es síncrona para garantizar que los datos se procesen inmediatamente.
 */
  @Output() obtenerComplementarPlantaListChange = new EventEmitter<ComplementoDePlanta[]>(false);

/**
 * Evento que emite la lista de firmantes relacionados con los complementos de planta.
 * 
 * La emisión es síncrona para garantizar el procesamiento inmediato de los datos.
 */
  @Output() obtenerFirmantesListChange = new EventEmitter<ComplementarPlantaState[]>(false);

/**
 * Evento que emite la lista de montos de inversión.
 * 
 * La emisión es síncrona para asegurar que los datos se procesen de inmediato.
 */
  @Output() obtenerMontosInversionListChange = new EventEmitter<MontoDeInversion[]>(false);

/**
 * Evento que emite la lista de empleados directos.
 * 
 * La emisión es síncrona para garantizar el procesamiento inmediato de los datos.
 */
  @Output() obtenerEmpleadosListChange = new EventEmitter<Directos[]>(false);
  
  /**
   * Configuración para la tabla de plantas disponibles
   * @property {FederatariosYPlantasConfiguration<PlantasDisponibles>} plantasDisponiblesConfig
   */
  @Input()
  plantasDisponiblesConfig!: FederatariosYPlantasConfiguration<PlantasDisponibles>;

  /**
   * Configuración para la tabla de plantas IMMEX
   * @property {FederatariosYPlantasConfiguration<PlantasImmex>} plantasImmexConfig
   */
  @Input() plantasImmexConfig!: FederatariosYPlantasConfiguration<PlantasImmex>;

  /**
   * Datos de federatarios para mostrar en la tabla
   * @property {FederatariosEncabezado[]} federatariosDatos
   */
  @Input() federatariosDatos!: FederatariosEncabezado[];

  /**
   * Datos de empresas extranjeras para mostrar en la tabla
   * @property {EmpresasEXtranjeras[]} expresasDatos
   */
  expresasDatos: EmpresasEXtranjeras[] = [];

  /**
   * Datos de plantas disponibles para mostrar en la tabla
   * @property {PlantasDisponibles[]} plantasDisponiblesDatos
   */
  @Input() plantasDisponiblesDatos!: PlantasDisponibles[];

  /**
   * Datos de plantas IMMEX para mostrar en la tabla
   * @property {PlantasImmex[]} plantasImmexDatos
   */
  @Input() plantasImmexDatos!: PlantasImmex[];


  /**
   * Indica si la sección de "Expresas" debe ser visible o no.
   * @type {boolean}
   * @default false
   */
  @Input() esExpresasVisible: boolean = false;

    /**
   * Emite eventos relacionados con acciones en la sección.
   * @event datosFederatariosEvent
   */
  @Output() datosFederatariosEvent: EventEmitter<FederatariosEncabezado> = new EventEmitter<FederatariosEncabezado>();


  /**
   * Configuración del input de fecha de inicio
   * @property {InputFecha} fechaInicioInput
   */
  fechaInicioInput: InputFecha = FECHA_DE_PAGO;

  /**
   * Opciones de estados disponibles
   * @property {[]} estadoOptions
   */
  @Input() estadoOptions!: Catalogo[];

  /**
 * Opciones de representacionFederalOptions
 * @type {Catalogo[]} representacionFederalOptions
 */
  public representacionFederalOptions: Catalogo[] = [];

  /**
 * Opciones de actividadProductivaOptions
 * @type {Catalogo[]} actividadProductivaOptions
 */
  public actividadProductivaOptions: Catalogo[] = [];

  /**
   * Texto para mostrar en la alerta
   * @property {string} textodAlerta
   */
  public textodAlerta = TEXTO_ALERTA;
  /**
     * Estado de la solicitud 250101, que contiene los valores actuales de la solicitud.
     */
  public solicitudState!: FederatoriosState;

  /**
   * Formulario para los datos de federatarios
   * @property {FormGroup} federatariosFormGroup
   */
  public federatariosFormGroup!: FormGroup;
  /**
     * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
     */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Indica si el formulario debe mostrarse en modo solo lectura.  
 *  Controla la habilitación o deshabilitación de los campos. */
  esFormularioSoloLectura: boolean = false;
  /** 
   * Formularios reactivos para capturar información de empresas y plantas. 
   * Se inicializan en el ciclo de vida del componente. 
   */
  public expresasFormGroup!: FormGroup;
  /** 
 * Formularios reactivos para capturar información de empresas y plantas. 
 * Se inicializan en el ciclo de vida del componente. 
 */
  plantasForm!: FormGroup;
  /**
   * Emisor de eventos para los datos del formulario de federatarios.
   * @type {EventEmitter<FederatariosEncabezado>}
   */
  @Output() datosFormaFedratario: EventEmitter<FederatariosEncabezado> =
    new EventEmitter<FederatariosEncabezado>(true);

  /**
   * Emisor de eventos para los datos de plantas disponibles.
   */
  @Output() datosPlantaDisponibles: EventEmitter<PlantasDisponibles[]> = new EventEmitter<PlantasDisponibles[]>(true);

  /** 
   * Emisor de eventos para los datos de plantas IMMEX. 
   */
  @Output() datosPlantasImmex: EventEmitter<PlantasImmex[]> = new EventEmitter<PlantasImmex[]>(true);

 /**
   * Controla la visibilidad del popup "Complementar Planta".
   * @property {boolean} mostrarComplementarPlantaPopup
   */
  public mostrarComplementarPlantaPopup:boolean = false;
  

  /**
 * Controla la visibilidad del popup "Montos de Inversión".
 * @property {boolean} mostrarMontosDeInversionPopup
 */
  public mostrarMontosDeInversionPopup: boolean = false;

  /**
   * Controla la visibilidad del popup "Empleados".
   * @property {boolean} mostrarEmpleadosPopup
   */
  public mostrarEmpleadosPopup: boolean = false;

  /**
   * Controla la visibilidad del popup "Capacidad Instalada".
   * @property {boolean} mostrarCapacidadInstaladaPopup
   */
  public mostrarCapacidadInstaladaPopup: boolean = false;

  /**
   * Controla la visibilidad del popup "Proveedor por Archivo".
   * @property {boolean} mostrarProveedorPorArchivoPopup
   */
  public mostrarProveedorPorArchivoPopup: boolean = false;

  /**
   * Controla la visibilidad del popup "Eliminar Planta".
   * @property {boolean} mostrarEliminarPlantaPopup
   */
  public mostrarEliminarPlantaPopup: boolean = false;

  /**
   * Objeto de notificación utilizado para mostrar mensajes relacionados con el proceso del federatario.
   * @property {Notificacion} federatarioNotificacion
   */
  public federatarioNotificacion?: Notificacion;

  /** Objeto de notificación utilizado para mostrar mensajes relacionados con el proceso de eliminación de plantas. */  
  public eliminarPlantaNotificacion?: Notificacion;

  /**
   * Contiene la planta IMMEX seleccionada por el usuario o `null` si no hay selección.
   * @property {PlantasImmex | null} selectedPlantaImmex
   */
  public selectedPlantaImmex: PlantasImmex | null = null;

  /**
   * Indica si una planta IMMEX ha sido seleccionada.
   * @property {boolean} isPlantaImmexSelected
   */
  public isPlantaImmexSelected = false;

  /**
    * Arreglo que contiene los elementos del catálogo de estado IMMEX.
    * Cada elemento representa una opción disponible en el catálogo.
    */
  estadoImmex: Catalogo[] = [];

  /**
   * Evento que emite un arreglo de objetos de tipo `CapacidadInstalada` cuando se obtienen los datos de la tabla de capacidad instalada.
   * 
   * @event
   * @type {EventEmitter<CapacidadInstalada[]>}
   */
  @Output() obtenerCapacidadInstaladaTablaDatos: EventEmitter<
    CapacidadInstalada[]
  > = new EventEmitter<CapacidadInstalada[]>(true);
/** Almacena el estado actual de la consulta relacionada con el trámite.  
 *  Contiene información necesaria para mostrar o procesar datos en el componente. */
   public consultaState!:ConsultaioState;

  
/**
 * Contiene la lista de plantas disponibles seleccionadas por el usuario.
 */
public seleccionados: PlantasDisponibles[] = [];
  /**
   * Constructor de la clase FederatariosYPlantasComponent.
   * @param {Router} router - Servicio de Angular para la navegación.
   * @param {ActivatedRoute} activatedRoute - Servicio de Angular para obtener información sobre la ruta actual.
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private federatoriosQuery: FederatoriosQuery,
    private federatoriosStore: FederatoriosStore,
    private consultaioQuery: ConsultaioQuery,
    private complimentosService: ComplimentosService,
    private changeDetectorRef: ChangeDetectorRef,
    private servicioDeFormularioService: ServicioDeFormularioService
  ) {}
/**
   * Método que se ejecuta cuando el componente es inicializado.
   * 
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   */
  ngOnInit(): void {
    this.obtenerImex();
    this.federatoriosQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as FederatoriosState;
        })
      )
      .subscribe();

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
           this.consultaState = seccionState;
           if (this.consultaState.update) {
           this.federatariosDatos = FEDERATARIOS_DATOS;
           this.plantasDisponiblesDatos=PLANTAS_DATOS;
           this.plantasImmexDatos=PLANTAS_IMMEX;
           }
          this.inicializarCertificadoFormulario();
        })
      )
      .subscribe();  
    if (!(this.solicitudState['federatariosEstadoOptions'] as Catalogo[])?.length) {
      this.obtenerFederatariosEstados();
    } else {
      this.estadoOptions = [...this.solicitudState['federatariosEstadoOptions'] as Catalogo[]];
    }

    if (!(this.solicitudState['municipioOptions'] as Catalogo[])?.length) {
      this.obtenerMunicipio("BCN");
    }

   if (!(this.solicitudState['actividadOptions'] as Catalogo[])?.length) {
    this.obtenerActividad();
   } else {
    this.actividadProductivaOptions = [...this.solicitudState['actividadOptions'] as Catalogo[]];
   }

    if (this.federatariosDatos) {
      this.servicioDeFormularioService.registerArray('federatariosDatos', this.federatariosDatos);
    }

    if (this.plantasImmexDatos) {
      this.servicioDeFormularioService.registerArray('plantasImmexDatos', this.plantasImmexDatos);
    }

    if (!(this.solicitudState['representacionOptions'] as Catalogo[])?.length) {
      this.obtenerRepresentacionFederal('MEX');
    } else {
      this.representacionFederalOptions = [...this.solicitudState['representacionOptions'] as Catalogo[]];
    }

    if (!(this.solicitudState['actividadOptions'] as Catalogo[])?.length) {
      this.obtenerActividad();
    } else {
      this.actividadProductivaOptions = [...this.solicitudState['actividadOptions'] as Catalogo[]];
    }
  }

  /**
 * Obtiene las opciones de estados para federatarios desde el servicio y actualiza el formulario dinámico.
 * Asigna las opciones recibidas tanto a la propiedad local como al campo correspondiente en el formulario de representante legal.
 * Además, actualiza el store con los nuevos valores y refresca la vista.
 */
  obtenerFederatariosEstados(): void {
    this.complimentosService.getEstado()
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((response) => {
          this.estadoOptions = response.datos;
          this.establecerCambioDeValor({ campo: 'federatariosEstadoOptions', valor: response.datos });
          const ESTADO_FIELD = this.representanteLegalFormData.find(
            (datos: ModeloDeFormaDinamica) => datos.campo === 'estado'
          ) as ModeloDeFormaDinamica;
          if (ESTADO_FIELD) {
            ESTADO_FIELD.opciones = response.datos.map(
              (item: unknown) => ({
                descripcion: (item as { descripcion: string }).descripcion,
                id: (item as { clave: string }).clave,
              })
            );
          }
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  /**
 * Obtiene las opciones de estados para federatarios desde el servicio y actualiza el formulario dinámico.
 * Asigna las opciones recibidas tanto a la propiedad local como al campo correspondiente en el formulario de representante legal.
 * Además, actualiza el store con los nuevos valores y refresca la vista.
 */
  obtenerMunicipio(cveEntidad: string): void {
    this.complimentosService.getmunicipio(cveEntidad)
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((response) => {
          this.establecerCambioDeValor({ campo: 'municipioOptions', valor: response.datos });
          const MUNICIPIO_FIELD = this.representanteLegalFormData.find(
            (datos: ModeloDeFormaDinamica) => datos.campo === 'estadoOptions'
          ) as ModeloDeFormaDinamica;
          if (MUNICIPIO_FIELD) {
            MUNICIPIO_FIELD.opciones = response.datos.map(
              (item: unknown) => ({
                descripcion: (item as { descripcion: string }).descripcion,
                id: (item as { clave: string }).clave,
              })
            );
          }
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  /**
 * Obtiene las opciones de estados para federatarios desde el servicio y actualiza el formulario dinámico.
 * Asigna las opciones recibidas tanto a la propiedad local como al campo correspondiente en el formulario de representante legal.
 * Además, actualiza el store con los nuevos valores y refresca la vista.
 */
  obtenerRepresentacionFederal(id: string): void {
    this.complimentosService.getRepresentacion(id)
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((response) => {
          const DATOS = { campo: 'representacionOptions', valor: response.datos };
          this.establecerCambioDeValor(DATOS);
          this.representacionFederalOptions = response.datos;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  /**
   * Obtiene la actividad productiva desde el servicio `complimentosService` y actualiza la propiedad
   * `estadosFederatarios` en la configuración de opciones de estado.
   * La suscripción se gestiona para finalizar automáticamente cuando se emite el notifier `destroyNotifier$`.
   * @remarks
   * Utiliza el método `getActividadProductiva` del servicio y espera que la respuesta contenga la propiedad `datos`.
   */
  obtenerActividad(): void {
    this.complimentosService.getActividadProductiva()
      .pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((res) => {
        const DATOS = { campo: 'actividadOptions', valor: res.datos };
        this.establecerCambioDeValor(DATOS);
        this.actividadProductivaOptions = res.datos;
        this.changeDetectorRef.markForCheck();
      });
  }

  /**
    * Método para inicializar el formulario reactivo con los datos de la solicitud.
    * 
    * Este método configura los campos del formulario con los valores actuales del estado de la solicitud
    * y aplica las validaciones necesarias. También deshabilita ciertos campos y establece valores predeterminados.
    */
  inicializarCertificadoFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.federatariosFormGroup.disable();
      this.expresasFormGroup.disable();
      this.plantasForm.disable();
    }
  }

  /** Inicializa los datos del formulario suscribiéndose al estado del trámite.  
*  Asigna el estado actual al modelo local del componente. */
  inicializarFormulario(): void {
    this.initFederatariosFormGroup();
    this.initExpresasFormGroup();
  }
  /**
   * Inicializa el formulario de federatarios con sus campos y validaciones
   * @method initFederatariosFormGroup
   * @returns {void}
   */
  initFederatariosFormGroup(): void {
    this.federatariosFormGroup = new FormGroup({
      nombre: new FormControl(this.solicitudState['nombre'], Validators.required),
      fechaDelActa: new FormControl(this.solicitudState['fechaDelActa'], Validators.required),
      primerApellido: new FormControl(this.solicitudState['primerApellido'], Validators.required),
      segundoApellido: new FormControl(this.solicitudState['segundoApellido']),
      numeroDeActa: new FormControl(this.solicitudState['numeroDeActa'], Validators.required),
      numeroDeNotaria: new FormControl(this.solicitudState['numeroDeNotaria'], Validators.required),
      estado: new FormControl(this.solicitudState['estado'], Validators.required),
      estadoOptions: new FormControl(this.solicitudState['estadoOptions'], Validators.required),
    });
  }

  /**
   * Inicializa el formulario reactivo `expresasFormGroup` con los controles necesarios
   * para capturar información de una empresa. Cada control incluye validaciones requeridas.
   * 
   * Controles del formulario:
   * - `taxId`: Identificación fiscal de la empresa (obligatorio).
   * - `nombreDelEmpresa`: Nombre de la empresa (obligatorio).
   * - `pais`: País de la empresa (obligatorio).
   * - `direccion`: Dirección de la empresa (obligatorio).
   */
  initExpresasFormGroup(): void {
    this.expresasFormGroup = new FormGroup({
      taxId: new FormControl(this.solicitudState['taxId'], Validators.required),
      nombreDelEmpresa: new FormControl(this.solicitudState['nombreDelEmpresa'], Validators.required),
      pais: new FormControl(this.solicitudState['pais'], Validators.required),
      direccion: new FormControl(this.solicitudState['direccion'], Validators.required),
    });

    this.plantasForm = new FormGroup({
      estadoDos: new FormControl(this.solicitudState['estadoDos'], Validators.required),
      representacionFederal: new FormControl(this.solicitudState['representacionFederal'], Validators.required),
      actividadProductiva: new FormControl(this.solicitudState['actividadProductiva'], Validators.required),
    });

    this.servicioDeFormularioService.registerForm('federatariosCatalogoForm', this.plantasForm);
    this.servicioDeFormularioService.formTouched$.subscribe((formName) => {
      if (formName === 'federatariosCatalogoForm') {
        this.plantasForm.markAllAsTouched();
      }
    })
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
   * Método que actualiza el store con los valores del formulario.
   * 
   * @param form - Formulario reactivo con los datos actuales.
   * @param campo - El campo que debe actualizarse en el store.
   * @param metodoNombre - El nombre del método en el store que se debe invocar.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof FederatoriosStore): void {
    const VALOR = form.get(campo)?.value;
    (this.federatoriosStore[metodoNombre] as (value: unknown) => void)(VALOR);
  }
  /**
   * Agrega los datos del formulario de federatarios y los emite.
   * @returns {void}
   */
  aggregarDatos(): void {
    if (this.federatariosFormGroup.invalid) {
      this.federatariosFormGroup.markAllAsTouched();

    this.federatarioNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Introduzca el Nombre completo y correcto del Notario.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    return;
  }
  this.datosFormaFedratario.emit(this.federatariosFormGroup.value);
  this.servicioDeFormularioService.pushToArray('federatariosDatos', this.plantasForm.value);
  this.federatariosFormGroup.reset();
  }

/**
 * Asigna a `plantasDisponiblesDatos` los datos disponibles de plantas IMMEX.
 * Método utilizado para cargar o actualizar la lista de plantas disponibles.
 */
buscarPlantasImmex(): void {
  this.datosPlantaDisponibles.emit();
}

/**
 * Maneja el cambio de selección de plantas disponibles.
 * Actualiza la propiedad `seleccionados` con los datos seleccionados.
 * @param event 
 */
onSeleccionChange(event: PlantasDisponibles[]): void { 
  this.seleccionados = event;
}
/**
 * Adds IMMEX plant data to the `plantasImmexDatos` array.
 * This method assigns the value of `INMEX_PLANTAS` to the `plantasImmexDatos` property.
 *
 * @remarks
 * Ensure that `INMEX_PLANTAS` is properly defined and contains the expected plant data.
 */
agregarPlantas(): void { 
  if(this.seleccionados && this.seleccionados.length >=1){
  this.plantasImmexDatos = [INMEX_PLANTAS];
  this.servicioDeFormularioService.pushToArray('plantasImmexDatos', INMEX_PLANTAS);
  this.datosPlantasImmex.emit(this.plantasImmexDatos);
  }
}


setPlantaImmexSeleccionada(row: PlantasImmex | null): void {
  if (row) {
    this.selectedPlantaImmex = row;
  } else {
    this.selectedPlantaImmex = null;
  }
}

  /**
   * Abre un diálogo modal para complementar información de la planta.
   * 
   * Este método verifica si el elemento modal (`modalElement`) está definido
   * y, en caso afirmativo, crea una instancia de la clase `Modal` utilizando
   * el elemento nativo asociado. Luego, muestra el modal llamando al método `show`.
   * 
   * @returns {void} Este método no retorna ningún valor.
   */
  abrirDialogoComplementarPlanta(): void {
    if (this.selectedPlantaImmex) {
      this.mostrarComplementarPlantaPopup = true;
    } else {
      this.federatarioNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'No se seleccionaron datos de las plantas Immex.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Abre un cuadro de diálogo modal para mostrar los montos asociados.
   * 
   * @remarks
   * Este método verifica si la propiedad `montos` está definida. 
   * Si es así, crea una instancia de `Modal` utilizando el elemento nativo 
   * referenciado por `montos` y muestra el cuadro de diálogo.
   * 
   * @returns {void} Este método no retorna ningún valor.
   */
  abrirDialogoMontos(): void {
    if (this.selectedPlantaImmex) {
      this.mostrarMontosDeInversionPopup = true;
    } else {
      this.federatarioNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'No se seleccionaron datos de las plantas Immex.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Abre un cuadro de diálogo modal para realizar acciones relacionadas con empleados.
   * 
   * Este método verifica si el elemento `empleadosAcciones` está definido y, en caso afirmativo,
   * crea una instancia de un modal utilizando el elemento nativo asociado. Luego, muestra el modal.
   * 
   * @returns {void} No retorna ningún valor.
   */
  abrirDialogoempleadosAcciones(): void {
    if (this.selectedPlantaImmex) {
      this.mostrarEmpleadosPopup = true;
    } else {
      this.federatarioNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'No se seleccionaron datos de las plantas Immex.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Abre un cuadro de diálogo modal para mostrar la capacidad instalada.
   * 
   * Este método verifica si el elemento `capacidadInstalada` está definido.
   * Si está disponible, crea una instancia de un modal utilizando el elemento
   * nativo asociado y lo muestra en pantalla.
   * 
   * @remarks
   * Asegúrese de que `capacidadInstalada` esté correctamente inicializado antes
   * de llamar a este método para evitar errores.
   */
  abrirDialogocapacidadInstalada(): void {
    if (this.selectedPlantaImmex) {
      this.mostrarCapacidadInstaladaPopup = true;
    } else {
      this.federatarioNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'No se seleccionaron datos de las plantas Immex.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Abre un cuadro de diálogo modal utilizando un archivo de carga.
   * 
   * Este método verifica si la referencia `cargaPorPrchivo` está definida
   * y, en caso afirmativo, crea una instancia de un modal utilizando el 
   * elemento nativo asociado. Luego, muestra el modal.
   * 
   * @returns {void} No retorna ningún valor.
   */
  abrirDialogocargaPorPrchivo(): void {
    if (this.selectedPlantaImmex) {
      this.mostrarProveedorPorArchivoPopup = true;
    } else {
      this.federatarioNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'No se seleccionaron datos de las plantas Immex.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }
  /** Abre un cuadro de diálogo para confirmar la eliminación de plantas.
   *  Si no hay plantas seleccionadas, muestra una notificación de error.
   */
  abrirDialogoEliminarPlantas(): void {
    if (this.selectedPlantaImmex) {
      this.eliminarPlantaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Al eliminar el registro de plantas, se eliminará toda la información asociada al monto de inversión, empleados y capacidad instalada de la misma. ¿Estás seguro de eliminar la(s) planta(s)?',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
      

    } else {
      this.federatarioNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona la planta que desea eliminar.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Elimina la planta seleccionada de la lista de plantas.
   * 
   * Este método filtra la lista de plantas para eliminar la planta
   * que coincide con la planta seleccionada.
   */
  eliminarPlanta(evento:boolean): void {
      if (evento) {
        this.plantasImmexDatos = this.plantasImmexDatos.filter(row => this.selectedPlantaImmex?.codigoPostal !== row.codigoPostal);
        this.selectedPlantaImmex = null;
        this.servicioDeFormularioService.setArray('plantasImmexDatos', this.plantasImmexDatos);
        this.datosPlantasImmex.emit(this.plantasImmexDatos);
      }
  }

  /**
  * Cierra el popup de complementar planta.
  * 
  * Cambia la bandera `mostrarComplementarPlantaPopup` a `false`
  * para ocultar el popup correspondiente.
  */
  cerrarComplementarPlanta(): void {
    this.mostrarComplementarPlantaPopup = false;
  }

  /**
   * Cierra el popup de montos de inversión.
   * 
   * Establece la variable `mostrarMontosDeInversionPopup` en `false`
   * para ocultar el popup correspondiente en la interfaz.
   */
  cerrarMontosDeInversion(): void {
    this.mostrarMontosDeInversionPopup = false;
  }

  /**
   * Cierra el popup de empleados.
   * 
   * Cambia la variable `mostrarEmpleadosPopup` a `false` para ocultar
   * el popup relacionado con la información de empleados.
   */
  cerrarEmpleados(): void {
    this.mostrarEmpleadosPopup = false;
  }

  /**
   * Cierra el popup de capacidad instalada.
   * 
   * Establece la variable `mostrarCapacidadInstaladaPopup` en `false`
   * para ocultar el popup correspondiente en la interfaz.
   */
  cerrarCapacidadInstalada(): void {
    this.mostrarCapacidadInstaladaPopup = false;
  }

  /**
   * Cierra el popup de proveedor por archivo.
   * 
   * Cambia la variable `mostrarProveedorPorArchivoPopup` a `false`
   * para ocultar el popup correspondiente en la interfaz.
   */
  cerrarProveedorPorArchivo(): void {
    this.mostrarProveedorPorArchivoPopup = false;
  }

  /**
   * Cierra el popup de eliminar planta.
   * 
   * Cambia la variable `mostrarEliminarPlantaPopup` a `false`
   * para ocultar el popup correspondiente en la interfaz.
   */
  cerrarEliminarPlanta(): void {
    this.mostrarEliminarPlantaPopup = false;
  }

  /**
   * Agrega los datos del formulario actual al arreglo `expresasDatos`.
   * 
   * Este método toma los valores del formulario `expresasFormGroup` y los 
   * añade al arreglo `expresasDatos`. Es útil para acumular información 
   * ingresada por el usuario en el formulario.
   */
  aggregarExpresasDatos(): void {
    this.expresasDatos.push(this.expresasFormGroup.value);
  }
  /**
* compo doc
* @method establecerCambioDeValor
* @description
* Este método se utiliza para manejar los cambios en los valores de un formulario dinámico.
* Recibe un evento que contiene el nombre del campo y su nuevo valor, y actualiza el estado
* dinámico del formulario en el store correspondiente.
* 
* @param event - Un objeto que contiene el campo que ha cambiado y su nuevo valor.
* El objeto tiene la estructura: `{ campo: string; valor: any }`.
* 
* @example
* establecerCambioDeValor({ campo: 'nombre', valor: 'Juan' });
* // Actualiza el campo 'nombre' con el valor 'Juan' en el store dinámico.
*/
  establecerCambioDeValor(event: { campo: string; valor: object | string | [] }): void {
    if (event) {
      this.federatoriosStore.setDynamicFieldValue(event.campo, event.valor);

    }
  }

  /**
 * Obtiene el estado IMEX de una entidad específica y actualiza la propiedad `estadoImmex` con los datos recibidos.
 * 
 * @param entidad - El identificador de la entidad para la cual se desea obtener el estado IMEX.
 */
  obtenerImex(): void {
    this.complimentosService.getEstado().pipe(takeUntil(this.destroyNotifier$)).subscribe((res) => {
      this.estadoImmex = res.datos;
    });

  }

  /**
   * Emite el evento `obtainorCapacidadInstaladaTablaList` con la lista de capacidades instaladas recibida.
   *
   * @param event - Arreglo de objetos de tipo `CapacidadInstalada` que representa la lista de capacidades instaladas seleccionadas.
   */
  obtenerCapacidadInstaladaTablaList(event: CapacidadInstalada[]): void {
    this.obtenerCapacidadInstaladaTablaDatos.emit(event);
  }

  
/**
 * Emite el evento `obtenerComplementarPlantaListChange` con la lista de complementos de planta recibida.
 * 
 * @param event - Arreglo de objetos de tipo `ComplementoDePlanta` que representa la lista de complementos de planta.
 */
  obtenerComplementarPlantaList(event: ComplementoDePlanta[]): void {
      this.obtenerComplementarPlantaListChange.emit(event);
  }

/**
 * Emite el evento `obtenerFirmantesListChange` con la lista de firmantes recibida.
 * 
 * @param event - Arreglo de objetos de tipo `ComplementarPlantaState` que representa la lista de firmantes.
 */
  obtenerFirmantesList(event:ComplementarPlantaState[]): void {
    this.obtenerFirmantesListChange.emit(event);
  }

/**
 * Emite el evento `obtenerMontosInversionListChange` con la lista de montos de inversión recibida.
 * 
 * @param event - Arreglo de objetos de tipo `MontoDeInversion` que representa la lista de montos de inversión.
 */
  obtenerMontosInversionList(event:MontoDeInversion[]): void {
    this.obtenerMontosInversionListChange.emit(event);
  }

/**
 * Emite el evento `obtenerEmpleadosListChange` con la lista de empleados directos recibida.
 * 
 * @param event - Arreglo de objetos de tipo `Directos` que representa la lista de empleados directos.
 */
  obtenerEmpleadosList(event:Directos[]): void {
    this.obtenerEmpleadosListChange.emit(event);
  }

/**
 * Maneja el cambio de valor en un campo del formulario de federatarios.
 * Actualiza el objeto de datos, emite el evento correspondiente y sincroniza el valor en el formulario reactivo.
 * @param event Objeto del catálogo seleccionado.
 * @param campo Nombre del campo que se actualiza.
 */
  eventoDeCambioDeValor(event: Catalogo, campo: string): void {
    this.solicitudState = {
      ...this.solicitudState,
      [campo]: event.clave
    };
    const FEDERATARIOS_ENCABEZADO: FederatariosEncabezado = {
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      numeroDeActa: '',
      fechaDelActa: '',
      numeroDeNotaria: '',
      entidadFederativa: '',
      municipioODelegacion: '',
      estado: '',
      estadoOptions: '',
      estadoUno: this.solicitudState['representacionFederal'] ?? '',
      estadoDos: this.solicitudState['estadoDos'] ?? '',
      estadoTres: this.solicitudState['actividadProductiva'] ?? '',
    };
    this.datosFederatariosEvent.emit(FEDERATARIOS_ENCABEZADO);
    this.servicioDeFormularioService.setFormValue('federatariosCatalogoForm', { [campo]: event.clave ?? '' });

  }

  /**
  * @method ngOnDestroy
  * @description
  * Este método es parte del ciclo de vida del componente y se ejecuta automáticamente 
  * cuando el componente está a punto de ser destruido. Se utiliza para limpiar las suscripciones 
  * activas y evitar fugas de memoria en la aplicación.
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}

