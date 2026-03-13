import { Catalogo, CatalogoSelectComponent, ConfiguracionColumna, CrossListLable, CrosslistComponent, InputFecha, InputFechaComponent, Notificacion, NotificacionesComponent, Pedimento, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MERCANCIAS_DATA, MercanciasInfo, NICO_TABLA, NicoInfo } from '@libs/shared/data-access-user/src/core/models/260906/domicilo.model';
import { Solicitud260906State, Tramite260906Store } from '../../../../estados/tramites/tramite260906.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CROSLISTA_DE_PAISES } from '@libs/shared/data-access-user/src/core/enums/260906/domicilo.enum';
import { CommonModule } from '@angular/common';
import { FECHA_DE_PAGO } from '@libs/shared/data-access-user/src/core/enums/260906/manifiestos.enum';
import { Permiso260906Query } from '../../../../estados/queries/permiso260906.query';
import { Sanitario260906Store } from '../../../../estados/tramites/sanitario260906.store';
import { SanitarioService } from '../../services/sanitario.service';

/** Interfaz para la respuesta de la tabla de NICO */
export interface RespuestaTabla {
  /** Código de respuesta */
  codigo: number;
  /** Datos de la tabla NICO */
  datos: NicoInfo[];
  /** Mensaje de la respuesta */
  mensaje: string;
}

/** Interfaz para la respuesta de la tabla de mercancías */
export interface MercanciasTabla {
  /** Código de respuesta */
  codigo: number;
  /** Datos de la tabla de mercancías */
  datos: MercanciasInfo[];
  /** Mensaje de la respuesta */
  mensaje: string;
}

/**
 * Componente principal para gestionar el formulario de domicilio.
 * Incluye funcionalidades para manejar datos de domicilio, mercancías, agentes y tablas dinámicas.
 */
@Component({
  selector: 'app-domicillo',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    CrosslistComponent,
    InputFechaComponent,
    NotificacionesComponent
  ],
  templateUrl: './domicillo.component.html',
  styleUrl: './domicillo.component.css',
})
export class DomicilloComponent implements OnInit, OnDestroy {
  /** Indica si el componente está en modo solo lectura */
  @Input() soloLectura: boolean = false;
  
  /** Indica si un campo es requerido o no */
  noRequerido: boolean = false;
  
  /** Lista de componentes Crosslist disponibles */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /** Estado actual de la solicitud */
  public solicitudState!: Solicitud260906State;

  /** Notificador para gestionar la destrucción de suscripciones */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Grupo de formularios para domicilio */
  domicilio!: FormGroup;
  
  /** Grupo de formularios para agente */
  formAgente!: FormGroup;
  
  /** Grupo de formularios para mercancías */
  formMercancias!: FormGroup;
  
  /** Control para fecha de aduanas de entrada */
  aduanasDeEntradaFecha: FormControl = new FormControl('');
  
  /** Control para fecha seleccionada de aduanas de entrada */
  aduanasDeEntradaFechaSeleccionada: FormControl = new FormControl('');
  
  /** Lista de catálogos de formas farmacéuticas */
  formaFarmaceutica: Catalogo[] = [];
  
  /** Lista de catálogos de estados */
  estado: Catalogo[] = [];
  
  /** Lista de países para selección de origen */
  public crosListaDePaises = CROSLISTA_DE_PAISES;
  
  /** Configuración de tabla para selección tipo checkbox */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;
  
  /** Configuración de columnas para tabla NICO */
  nicoTabla: ConfiguracionColumna<NicoInfo>[] = NICO_TABLA;
  
  /** Datos cargados para tabla NICO */
  nicoTablaDatos: NicoInfo[] = [];
  
  /** Configuración de columnas para tabla de mercancías */
  mercanciasTabla: ConfiguracionColumna<MercanciasInfo>[] = MERCANCIAS_DATA;
  
  /** Datos cargados para tabla de mercancías */
  mercanciasTablaDatos: MercanciasInfo[] = [];
  
  /** Lista de aduanas seleccionadas */
  aduanasDeEntradaSeleccionadas: string[] = [];
  
  /** Lista de datos de aduanas de entrada */
  aduanasDeEntradaDatos: string[] = [];
  
  /** Indica si la sección es colapsable */
  colapsable: boolean = false;
  
  /** Indica si la sección "Duo" es colapsable */
  colapsableDos: boolean = false;
  
  /** Indica si la sección "Tres" es colapsable */
  colapsableTres: boolean = false;
  
  /** Lista de países para seleccionar origen (primera sección) */
  seleccionarOrigenDelPais: string[] = this.crosListaDePaises;
  
  /** Lista de países para seleccionar origen (segunda sección) */
  seleccionarOrigenDelPaisDos: string[] = this.crosListaDePaises;
  
  /** Lista de países para seleccionar origen (tercera sección) */
  seleccionarOrigenDelPaisTres: string[] = this.crosListaDePaises;
  
  /** Etiqueta para crosslist de país de procedencia */
  public paisDeProcedenciaLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de procedencia',
    derecha: 'País(es) seleccionados',
  };
  
  /** Configuración de fechas de inicio y fin */
  public fechaCaducidadInput: InputFecha = FECHA_DE_PAGO;

  /** Lista de pedimentos asociados */
  pedimentos: Array<Pedimento> = [];
  
  /** Índice del elemento a eliminar */
  elementoParaEliminar!: number;
  
  /** Configuración para nueva notificación */
  public nuevaNotificacion!: Notificacion;

  public tramiteId: string = '260906';

  /**
   * Constructor del componente
   * 
   * @param fb FormBuilder para crear formularios
   * @param tramite260906Store Store para gestionar estado del trámite
   * @param tramite260906Query Query para obtener estado de la solicitud
   * @param service Servicio para obtener datos sanitarios
   */
  constructor(
    private readonly fb: FormBuilder,
    private tramite260906Store: Sanitario260906Store,
    private tramite260906Query: Permiso260906Query,
    private service: SanitarioService,
  ) { }

  /**
   * Método de inicialización del componente
   * Configura formularios, suscripciones y carga datos iniciales
   */
  ngOnInit(): void {
    this.tramite260906Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    
    this.cargarDatosIniciales();
    this.inicializarFormularios();
    this.tramite260906Query.select(state => state.nicoTablaDatos)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((data) => {
          this.nicoTablaDatos = data || [];
        });
  }

  /**
   * Carga datos iniciales desde servicios
   * @private
   */
  private cargarDatosIniciales(): void {
    this.obtenerFormaFarmaceuticaList();
    this.obtenerEstadoList();
    this.obtenerTablaDatos();
    this.obtenerMercanciasDatos();
  }

  /**
   * Inicializa los grupos de formularios
   * @private
   */
  private inicializarFormularios(): void {
    this.inicializarFormularioDomicilio();
    this.inicializarFormularioAgente();
    this.inicializarFormularioMercancias();
    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa el formulario de domicilio
   * @private
   */
  private inicializarFormularioDomicilio(): void {
    this.domicilio = this.fb.group({
      codigoPostal: [this.solicitudState?.codigoPostal, Validators.required],
      formaFarmaceutica: [this.solicitudState?.formaFarmaceutica, Validators.required],
      estado: [this.solicitudState?.estado, Validators.required],
      muncipio: [this.solicitudState?.muncipio, Validators.required],
      localidad: [this.solicitudState?.localidad],
      colonia: [this.solicitudState?.colonia],
      calle: [this.solicitudState?.calle],
      lada: [this.solicitudState?.lada],
      telefono: [this.solicitudState?.telefono, Validators.required],
      avisoCheckbox: [this.solicitudState?.avisoCheckbox],
      licenciaSanitaria: [
        { value: this.solicitudState?.licenciaSanitaria, disabled: false }
      ],
      regimen: [this.solicitudState?.regimen],
      aduanasEntradas: [this.solicitudState?.aduanasEntradas],
      numeroPermiso: [this.solicitudState?.numeroPermiso],
      tiempoPrograma: [this.solicitudState?.tiempoPrograma]
    });
  }

  /**
   * Inicializa el formulario de agente
   * @private
   */
  private inicializarFormularioAgente(): void {
    this.formAgente = this.fb.group({
      claveScianModal: [this.solicitudState?.claveScianModal, Validators.required],
      claveDescripcionModal: [this.solicitudState?.claveDescripcionModal],
    });
  }

  /**
   * Inicializa el formulario de mercancías
   * @private
   */
  private inicializarFormularioMercancias(): void {
    this.formMercancias = this.fb.group({
      clasificacion: [this.solicitudState?.clasificacion, Validators.required],
      especificarClasificacionProducto: [
        this.solicitudState?.especificarClasificacionProducto, 
        Validators.required
      ],
      denominacionEspecifica: [
        this.solicitudState?.denominacionEspecifica, 
        Validators.required
      ],
      denominacionDistintiva: [
        this.solicitudState?.denominacionDistintiva, 
        Validators.required
      ],
      denominacionComun: [
        this.solicitudState?.denominacionComun, 
        Validators.required
      ],
      tipoDeProducto: [
        this.solicitudState?.tipoDeProducto, 
        Validators.required
      ],
      formaFarmaceutica: [
        this.solicitudState?.formaFarmaceutica, 
        Validators.required
      ],
      estadoFisico: [
        this.solicitudState?.estadoFisico, 
        Validators.required
      ],
      fraccionArancelaria: [
        this.solicitudState?.fraccionArancelaria, 
        Validators.required
      ],
      descripcionFraccion: [
        { value: this.solicitudState?.descripcionFraccion, disabled: true }, 
        Validators.required
      ],
      cantidadUMT: [
        this.solicitudState?.cantidadUMT, 
        Validators.required
      ],
      UMT: [
        { value: this.solicitudState?.UMT, disabled: true }, 
        Validators.required
      ],
      cantidadUMC: [
        this.solicitudState?.cantidadUMC, 
        Validators.required
      ],
      UMC: [
        this.solicitudState?.UMC, 
        Validators.required
      ],
      presentacion: [
        this.solicitudState?.presentacion, 
        Validators.required
      ],
      numeroRegistro: [
        this.solicitudState?.numeroRegistro, 
        Validators.required
      ],
      fechaCaducidad: [this.solicitudState?.fechaCaducidad],
    });
  }

  /** Botones de acción para gestionar listas de países (primera sección) */
  paisDeProcedenciaBotons = [
    { 
      btnNombre: 'Agregar todos', 
      class: 'btn-primary', 
      funcion: (): void => this.crossList.toArray()[0].agregar('t') 
    },
    { 
      btnNombre: 'Agregar selección', 
      class: 'btn-default', 
      funcion: (): void => this.crossList.toArray()[0].agregar('') 
    },
    { 
      btnNombre: 'Restar selección', 
      class: 'btn-danger', 
      funcion: (): void => this.crossList.toArray()[0].quitar('') 
    },
    { 
      btnNombre: 'Restar todos', 
      class: 'btn-default', 
      funcion: (): void => this.crossList.toArray()[0].quitar('t') 
    },
  ];

  /** Botones de acción para gestionar listas de países (segunda sección) */
  paisDeProcedenciaBotonsDos = [
    { 
      btnNombre: 'Agregar todos', 
      class: 'btn-primary', 
      funcion: (): void => this.crossList.toArray()[1].agregar('t') 
    },
    { 
      btnNombre: 'Agregar selección', 
      class: 'btn-default', 
      funcion: (): void => this.crossList.toArray()[1].agregar('') 
    },
    { 
      btnNombre: 'Restar selección', 
      class: 'btn-danger', 
      funcion: (): void => this.crossList.toArray()[1].quitar('') 
    },
    { 
      btnNombre: 'Restar todos', 
      class: 'btn-default', 
      funcion: (): void => this.crossList.toArray()[1].quitar('t') 
    },
  ];

  /** Botones de acción para gestionar listas de países (tercera sección) */
  paisDeProcedenciaBotonsTres = [
    { 
      btnNombre: 'Agregar todos', 
      class: 'btn-primary', 
      funcion: (): void => this.crossList.toArray()[2].agregar('t') 
    },
    { 
      btnNombre: 'Agregar selección', 
      class: 'btn-default', 
      funcion: (): void => this.crossList.toArray()[2].agregar('') 
    },
    { 
      btnNombre: 'Restar selección', 
      class: 'btn-danger', 
      funcion: (): void => this.crossList.toArray()[2].quitar('') 
    },
    { 
      btnNombre: 'Restar todos', 
      class: 'btn-default', 
      funcion: (): void => this.crossList.toArray()[2].quitar('t') 
    },
  ];

  /**
   * Obtiene lista de formas farmacéuticas desde servicio
   * @private
   */
  private obtenerFormaFarmaceuticaList(): void {
    this.service.obtenerFormaFarmaceuticaList()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        const DATOS = data?.data;
        this.formaFarmaceutica = DATOS;
      });
  }

  /**
   * Obtiene lista de estados desde servicio
   * @private
   */
  private obtenerEstadoList(): void {
    this.service.obtenerEstadoList(this.tramiteId)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        const DATOS = data;
        this.estado = DATOS;
      });
  }

  /**
   * Obtiene datos para tabla NICO desde servicio
   * @private
   */
  private obtenerTablaDatos(): void {
    this.service.obtenerTablaDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        const DATOS = data?.datos;
        this.nicoTablaDatos = DATOS;
      });
  }

  /**
   * Obtiene datos para tabla de mercancías desde servicio
   * @private
   */
  private obtenerMercanciasDatos(): void {
    this.service.obtenerMercanciasDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        const DATOS = data?.datos;
        this.mercanciasTablaDatos = DATOS;
      });
  }

  /**
   * Maneja cambio en checkbox y actualiza estado
   * 
   * @param event Evento del checkbox
   * @param form Formulario que contiene el campo
   * @param campo Nombre del campo afectado
   * @param metodoNombre Método del store para actualizar valor
   */
  onAvisoCheckboxChange(
    event: Event,
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite260906Store
  ): void {
    const CHECKBOX = event.target as HTMLInputElement;
    if (CHECKBOX.checked) {
      this.domicilio.get('licenciaSanitaria')?.disable();
    } else {
      this.domicilio.get('licenciaSanitaria')?.enable();
    }
    const VALOR = form.get(campo)?.value;
    (this.tramite260906Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /** Alterna estado colapsable de primera sección */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /** Alterna estado colapsable de segunda sección */
  mostrar_colapsableDos(): void {
    this.colapsableDos = !this.colapsableDos;
  }

  /** Alterna estado colapsable de tercera sección */
  mostrar_colapsableTres(): void {
    this.colapsableTres = !this.colapsableTres;
  }

  /**
   * Establece valores en el store desde el formulario
   * 
   * @param form Grupo de formulario que contiene el campo
   * @param campo Nombre del campo a actualizar
   * @param metodoNombre Nombre del método en el store que actualiza el valor
   */
  setValoresStore(
    form: FormGroup, 
    campo: string, 
    metodoNombre: keyof Tramite260906Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite260906Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método de limpieza al destruir el componente
   * Libera las suscripciones activas
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Actualiza valor de fecha en formulario de mercancías
   * @param nuevo_valor Nueva fecha seleccionada
   */
  public cambioFechaFinal(nuevo_valor: string): void {
    this.formMercancias.get('fechaCaducidad')?.setValue(nuevo_valor);
    this.formMercancias.get('fechaCaducidad')?.markAsUntouched();
  }

    /**
  * Habilita todos los controles del formulario si están deshabilitados.
  * @returns {void}
  */
  eliminarFormControls(): void {
    this.abrirModal('¿Estás seguro que deseas eliminar los registros marcados?', true);
  }

  /**
  * Habilita todos los controles del formulario si están deshabilitados.
  * @returns {void}
  */
  eliminarMercancias(): void {
    this.abrirModal('Selecciona un registro.', false);
  }

  /**
   * Muestra modal de confirmación para eliminar registros
   * @param mensaje Mensaje a mostrar en el modal
   * @param cancelar Indica si debe mostrar botón cancelar
   */
  abrirModal(mensaje: string, cancelar: boolean): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: cancelar ? 'Cancelar' : '',
    };
  }

  /**
   * Inicializa el estado del formulario según modo solo lectura
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.domicilio?.disable();
      this.formAgente?.disable();
      this.formMercancias?.disable();
    } else {
      this.domicilio?.enable();
      this.formAgente?.enable();
      this.formMercancias?.enable();
    }
  }
}