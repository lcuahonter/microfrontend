/**
 * @component DatosDelSolicitudModificacionComponent
 * @description
 * Este componente gestiona la modificación de datos relacionados con una solicitud.
 * Proporciona formularios reactivos para capturar información del establecimiento,
 * datos SCIAN, y otros detalles relacionados con la solicitud.
 * También incluye funcionalidades para manejar modales, tablas dinámicas y listas cruzadas.
 */
import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  CrossListLable,
  CrosslistComponent,
  InputCheckComponent,
  InputFecha,
  InputFechaComponent,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  REGEX_RFC_FISICA,
  REGEX_SOLO_DIGITOS,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  doDeepCopy,
} from '@libs/shared/data-access-user/src';

import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';

import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Modal } from 'bootstrap';

import { MercanciasInfo,PropietarioTipoPersona,ScianModel} from '../../models/datos-de-la-solicitud.model';
import { Subject ,map,takeUntil } from 'rxjs';

import { EstablecimientoService } from '../../service/establecimiento.service';

import { ManifiestosComponent } from '../../../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { RepresentanteLegalComponent } from '../../../../shared/components/representante-legal/representante-legal.component';

import { CROSLISTA_DE_PAISES, FECHA_DE_PAGO, MERCANCIAS_DATA, SCIAN_TABLE_CONFIG } from '../../constantes/medicamentos-donacion.enum';
import { DatosDelSeccionQuery } from '../../estados/datos-del-solicitud-seccion.query';
import { ManifiestosRepresentanteSeccionComponent } from '../../../../shared/components/manifiestos-representante-seccion/manifiestos-representante-seccion.component';

import { DatosDelSolicituteSeccionStateStoreI } from '../../estados/datos-del-solicitud-seccion.store';
import { TooltipDirective } from "ngx-bootstrap/tooltip";


/**
 * @class DatosDelSolicitudModificacionComponent
 * @description
 * Este componente es responsable de gestionar los datos relacionados con la solicitud de modificación.
 * Proporciona formularios reactivos para capturar información del establecimiento, mercancías, y otros
 * datos relevantes. Además, incluye funcionalidades para manejar modales, listas cruzadas, y tablas dinámicas.
 * 
 * @comdoc
 * - **Propiedades**:
 *   - `nuevaNotificacion`: Almacena los datos de la notificación que se mostrará al usuario.
 *   - `elementoParaEliminar`: Índice del elemento seleccionado para su eliminación.
 *   - `pedimentos`: Lista de objetos `Pedimento` gestionados en el componente.
 *   - `establecimientoModal`: Referencia al modal del establecimiento.
 *   - `establecimientoModalButton`: Referencia al botón para abrir el modal del establecimiento.
 *   - `modalAddAgentMercancias`: Referencia al modal para agregar agentes de mercancías.
 *   - `fechaCaducidadInput`: Fecha de caducidad para el formulario.
 *   - `formMercancias`: Formulario para gestionar mercancías.
 *   - `scianJson`: Datos del catálogo SCIAN.
 *   - `scianForm`: Formulario para datos SCIAN.
 *   - `solicitudEstablecimientoForm`: Formulario para datos del establecimiento.
 *   - `crossList`: Referencias a los componentes de listas cruzadas.
 *   - `genericOptions`: Opciones genéricas para el formulario.
 *   - `paisDeProcedenciaBotons`: Botones de acción para gestionar listas de países en la primera sección.
 *   - `paisDeProcedenciaBotonsDos`: Botones de acción para gestionar listas de países en la segunda sección.
 *   - `paisDeProcedenciaBotonsTres`: Botones de acción para gestionar listas de países en la tercera sección.
 *   - `paisDeProcedenciaLabel`: Etiqueta para el crosslist de país de procedencia.
 *   - `crosListaDePaises`: Lista de países para la selección de origen.
 *   - `colapsable`: Indica si la sección es colapsable.
 *   - `colapsableDos`: Indica si la sección "Duo" es colapsable.
 *   - `colapsableTres`: Indica si la sección "Tres" es colapsable.
 *   - `estado`: Lista de estados.
 *   - `tablaSeleccionCheckbox`: Configuración de selección de tabla.
 *   - `tipoSeleccionTabla`: Enum para la selección de tablas.
 *   - `domicilioEstablecimiento`: Formulario de establecimiento.
 *   - `mercanciasTabla`: Configuración de columnas de la tabla de mercancías.
 *   - `mercanciasTablaDatos`: Datos de la tabla de mercancías.
 * 
 * - **Métodos**:
 *   - `ngOnInit`: Inicializa el componente cargando datos y configurando formularios.
 *   - `estadoDelServicio`: Configura el estado del servicio y actualiza los formularios.
 *   - `crearAgregarFormulario`: Crea y configura los formularios reactivos.
 *   - `establecerDeshabilitado`: Deshabilita el campo "observaciones" según el valor de otro campo.
 *   - `loadScian`: Carga los datos del catálogo SCIAN.
 *   - `loadEstadoData`: Carga los datos del catálogo de estados.
 *   - `cerrarModal`: Cierra el modal activo.
 *   - `onContriloChange`: Actualiza el estado del formulario según los cambios en los controles.
 *   - `enCambioDeControl`: Actualiza el estado del formulario de domicilio.
 *   - `enControlCambioFormulario`: Actualiza el estado del formulario de solicitud.
 *   - `toggleNoLicenciaSanitaria`: Habilita o deshabilita el campo "No Licencia Sanitaria".
 *   - `limpiarScianForm`: Limpia el formulario SCIAN.
 *   - `abrirModalMercancia`: Abre el modal para agregar mercancías.
 *   - `ngAfterViewInit`: Inicializa las instancias de los modales de Bootstrap.
 *   - `ngOnDestroy`: Limpia las suscripciones al destruir el componente.
 * 
 * @example
 * ```typescript
 * <app-datos-del-solicitud-modificacion></app-datos-del-solicitud-modificacion>
 * ```
 */
@Component({
  selector: 'app-datos-del-solicitud-modificacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CrosslistComponent,
    ManifiestosComponent,
    RepresentanteLegalComponent,
    InputFechaComponent,
    TituloComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    AlertComponent,
    InputCheckComponent,
    NotificacionesComponent,
    ManifiestosRepresentanteSeccionComponent,
    TooltipDirective
],

  templateUrl: './datos-del-solicitud-modificacion.component.html',
  styleUrl: './datos-del-solicitud-modificacion.component.scss',
})

export class DatosDelSolicitudModificacionComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
 * Notificación actual que se muestra en el componente.
 * 
 * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
 * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
 */
  public nuevaNotificacion!: Notificacion;

  /**
   * Índice del elemento que se desea eliminar.
   * 
   * Esta propiedad almacena el índice del elemento seleccionado para su eliminación
   * en la lista de pedimentos.
   */
  elementoParaEliminar!: number;

  /**
   * Lista de pedimentos.
   * 
   * Esta propiedad almacena un arreglo de objetos de tipo `Pedimento`, que representan
   * los pedimentos gestionados en el componente.
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * Abre el modal de confirmación para eliminar un pedimento.
   * 
   * Este método configura los datos de la notificación que se mostrará en el modal
   * de confirmación. También almacena el índice del elemento que se desea eliminar.
   * 
   * @param i - Índice del pedimento que se desea eliminar. Por defecto, es 0.
   */
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Por el momento no hay comunicación con el Sistema de COFEPRIS, favor de capturar su establecimiento.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };

    this.elementoParaEliminar = i;
  }

  /**
   * Elimina un pedimento de la lista.
   * 
   * Este método elimina el pedimento seleccionado de la lista de pedimentos si
   * el usuario confirma la acción en el modal de confirmación.
   * 
   * @param borrar - Indica si se debe proceder con la eliminación. Si es `true`,
   * se elimina el pedimento correspondiente.
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }
  /**
   * Referencia al elemento modal del establecimiento.
   * 
   * Esta propiedad almacena una referencia al elemento del DOM que representa el modal
   * del establecimiento. Se utiliza para inicializar la instancia del modal de Bootstrap
   * y controlar su comportamiento.
   */
  @ViewChild('establecimientoModal', { static: false }) establecimientoModal!: ElementRef;
  /**
    * Referencia al botón del modal del establecimiento.
    */
  /**
   * Referencia al botón del modal del establecimiento.
   * 
   * Esta propiedad almacena una referencia al elemento del DOM que representa el botón
   * para abrir el modal del establecimiento. Se utiliza para inicializar la instancia
   * del modal de Bootstrap y controlar su comportamiento.
   */
  @ViewChild('establecimientoModalButton', { static: false }) establecimientoModalButton!: ElementRef;
  /**
   * Referencia al elemento modal para agregar agentes de mercancías.
   * Este elemento se utiliza para interactuar con el modal en la plantilla.
   * 
   * @type {ElementRef}
   * @decorator ViewChild
   */
  @ViewChild('modalAddAgentMercancias', { static: false }) modalAddAgentMercancias!: ElementRef;

  /**
    * Fecha de caducidad para el formulario.
    */
  public fechaCaducidadInput: InputFecha = FECHA_DE_PAGO;
  /**
  * Instancia del modal de Bootstrap.
  */
  modalInstance!: Modal;

  /**
   * Formulario para gestionar mercancías.
   */
  formMercancias!: FormGroup;

  /**
   * Instancia del modal del establecimiento.
   */
  establecimientoModalInstance!: Modal;

  /**
   * Instancia del modal para agregar agentes de mercancías.
   */
  modalAddAgentMercanciasInstance!: Modal;

  /**
   * Datos del catálogo SCIAN.
   */
  scianJson: Catalogo[] = [];

  /**
   * Formulario para datos SCIAN.
   */
  scianForm!: FormGroup;
  /**
  * Formulario para datos del establecimiento.
  */
  solicitudEstablecimientoForm!: FormGroup;

  /**
   * Referencias a los componentes de listas cruzadas.
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
   * Opciones genéricas para el formulario.
   */
  genericOptions: PropietarioTipoPersona[] = [];

  /**
   * Botones de acción para gestionar listas de países en la primera sección.
   */
  paisDeProcedenciaBotons = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[0].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-danger',
      funcion: (): void => this.crossList.toArray()[0].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].quitar('t'),
    },
  ];

  /**
   * Botones de acción para gestionar listas de países en la segunda sección.
   */
  paisDeProcedenciaBotonsDos = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[1].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[1].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-danger',
      funcion: (): void => this.crossList.toArray()[1].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[1].quitar('t'),
    },
  ];

  /**
   * Botones de acción para gestionar listas de países en la tercera sección.
   */
  paisDeProcedenciaBotonsTres = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[2].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[2].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-danger',
      funcion: (): void => this.crossList.toArray()[2].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[2].quitar('t'),
    },
  ];

  /**
   * Etiqueta para el crosslist de país de origen.
   */
  public paisDeOrigenLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de origen:',
    derecha: 'País(es) seleccionados*:',
  };
  /**
   * Etiqueta para el crosslist de país de procedencia.
   */
  public paisDeProcedenciaLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de procedencia:',
    derecha: 'País(es) seleccionados*:',
  };

  /**
   * Etiqueta para el crosslist de uso específico.
   */
  public usoEspecificoLabel: CrossListLable = {
    tituluDeLaIzquierda: 'Uso específico:',
    derecha: 'Uso específico seleccionado*:',
  };

  /**
   * Indica si el establecimiento tiene una licencia sanitaria.
   */
  public tieneNoLicenciaSanitaria: boolean = false;
  /**
   * Lista de países para la selección de origen.
   */
  public crosListaDePaises = CROSLISTA_DE_PAISES;
  /**
   * Indica si la sección es colapsable.
   */
  colapsable: boolean = false;

  /**
   * Indica si la sección "Duo" es colapsable.
   */
  colapsableDos: boolean = false;

  /**
   * Indica si la sección "Tres" es colapsable.
   */
  colapsableTres: boolean = false;
  /**
   * Indica si la sección "Uno" es colapsable.
   */
  public cambioFechaFinal(nuevo_valor: string): void {
    this.formMercancias.get('fechaCaducidad')?.setValue(nuevo_valor);
    this.formMercancias.get('fechaCaducidad')?.markAsUntouched();
  }
  /**
   * Alterna el estado colapsable de la primera sección.
   */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Alterna el estado colapsable de la segunda sección.
   */
  mostrar_colapsableDos(): void {
    this.colapsableDos = !this.colapsableDos;
  }

  /**
   * Alterna el estado colapsable de la tercera sección.
   */
  mostrar_colapsableTres(): void {
    this.colapsableTres = !this.colapsableTres;
  }
  /**
   * Lista de países para seleccionar el origen de la primera sección.
   */
  seleccionarOrigenDelPais: string[] = this.crosListaDePaises;

  /**
   * Lista de países para seleccionar el origen de la segunda sección.
   */
  seleccionarOrigenDelPaisDos: string[] = this.crosListaDePaises;

  /**
   * Lista de países para seleccionar el origen de la tercera sección.
   */
  seleccionarOrigenDelPaisTres: string[] = this.crosListaDePaises;

  /**
   * Lista de estados.
   */
  estado: Catalogo[] = [];

  /**
   * Configuración de selección de tabla.
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Enum para la selección de tablas.
   */
  tipoSeleccionTabla = TablaSeleccion;

  /**
   * Formulario de establecimiento.
   */
  domicilioEstablecimiento!: FormGroup;

  /**
   * Muestra el modal para la clave SCIAN.
   */
  public mostrarModeloClave(): void {
    this.modalInstance.show();
  }

  /**
   * Ciclo de vida `AfterViewInit`.
   * Inicializa la instancia del modal de Bootstrap.
   */
  ngAfterViewInit(): void {
    if (this.establecimientoModalButton) {
      this.establecimientoModalInstance = new Modal(
        this.establecimientoModalButton.nativeElement
      );
    }
    if (this.establecimientoModal) {
      this.modalInstance = new Modal(this.establecimientoModal.nativeElement);
    }
    if (this.modalAddAgentMercancias) {
      this.modalAddAgentMercanciasInstance = new Modal(this.modalAddAgentMercancias.nativeElement);
    }
  }

  /**
   * Texto de los manifiestos.
   */
  private destroy$ = new Subject<void>();

  /**
   * Configuración de columnas de la tabla de mercancías.
   */
  mercanciasTabla: ConfiguracionColumna<MercanciasInfo>[] = MERCANCIAS_DATA;

  /**
   * Datos de la tabla de mercancías.
   */
  mercanciasTablaDatos: MercanciasInfo[] = [];

  /** 
   * Selección actual de elementos en la tabla de mercancías.
   */
  public seleccionaMercancias: MercanciasInfo[] = [];
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los formularios estarán deshabilitados y no se podrán editar.
   * Cuando es `false`, los formularios estarán habilitados para edición.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente.
   *
   * @param fb FormBuilder para crear formularios.
   * @param tramite260904Query Consulta de datos del trámite.
   * @param tramite260904Store Almacenamiento de datos del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private establecimientoService: EstablecimientoService,
    private domicilioEstablecimientoStore: DatosDelSolicituteSeccionStateStoreI,
    private domicilioEstablecimientoQuery: DatosDelSeccionQuery,
    private consultaioQuery: ConsultaioQuery
  ) {
      this.consultaioQuery.selectConsultaioState$
          .pipe(
            takeUntil(this.destroy$),
            map((seccionState) => {
              this.esFormularioSoloLectura = seccionState.readonly;
              if(seccionState.readonly || seccionState.update) {
                this.getScianTablaDatosInfo();
                this.getDatosMercanciasTablaDatosInfo();
              }
            })
          )
          .subscribe()
  }

  
  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Este método realiza las siguientes acciones:
   * 
   * - Carga los datos del catálogo SCIAN mediante el método `loadScian`.
   * - Carga los datos del catálogo de estados mediante el método `loadEstadoData`.
   * - Crea y configura los formularios reactivos necesarios para el componente
   *   utilizando el método `crearAgregarFormulario`.
   * - Establece las reglas de habilitación/deshabilitación de campos en el formulario
   *   de domicilio del establecimiento mediante el método `establecerDeshabilitado`.
   * - Inicializa la suscripción a los servicios y almacenes de datos relacionados
   *   con el estado del servicio mediante el método `estadoDelServicio`.
   * 
   * @returns {void} No retorna ningún valor.
   */
  ngOnInit(): void {
    this.loadScian();
    this.loadEstadoData();
    this.crearAgregarFormulario();
    this.estadoDelServicio();
      if (this.esFormularioSoloLectura) {
      this.formMercancias.disable();
      this.domicilioEstablecimiento.disable();
      this.solicitudEstablecimientoForm.disable();
      this.scianForm.disable();
    }
  }

  /**
   * @description Método que realiza la configuración inicial del estado del servicio.
   * Obtiene datos de justificación y actualiza los formularios relacionados con el estado
   * del establecimiento y la solicitud del establecimiento.
   *
   * @remarks
   * Este método utiliza servicios y consultas para obtener datos y actualizarlos en los
   * formularios reactivos correspondientes. Se asegura de limpiar las suscripciones al
   * destruir el componente utilizando `takeUntil`.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  estadoDelServicio(): void {
    this.establecimientoService
      .getJustificationData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: PropietarioTipoPersona[]) => {
        this.genericOptions = data;
      });
    this.domicilioEstablecimientoQuery
      .select()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.domicilioEstablecimiento.patchValue(state, { emitEvent: false });
      });
    this.domicilioEstablecimientoQuery
      .select()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.solicitudEstablecimientoForm.patchValue(state, { emitEvent: false });
      });
  }
  

  /**
   * @method crearAgregarFormulario
   * @description Crea y configura los formularios reactivos utilizados en el componente para gestionar
   *              los datos relacionados con el domicilio del establecimiento, la solicitud del establecimiento,
   *              y las mercancías. Cada formulario incluye validaciones específicas para garantizar la integridad
   *              de los datos ingresados por el usuario.
   * 
   * @comdoc
   * - **domicilioEstablecimiento**: Formulario para capturar información del domicilio del establecimiento,
   *   como RFC, razón social, correo electrónico, dirección, y otros datos relevantes.
   * - **scianForm**: Formulario para capturar información relacionada con el SCIAN (Sistema de Clasificación
   *   Industrial de América del Norte), incluyendo su descripción.
   * - **solicitudEstablecimientoForm**: Formulario para gestionar datos de la solicitud del establecimiento,
   *   como el número de licencia sanitaria, régimen, y aduanas de entrada.
   * - **formMercancias**: Formulario para capturar información sobre las mercancías, incluyendo clasificación,
   *   denominaciones, tipo de producto, estado físico, fracción arancelaria, y otros detalles.
   * 
   * @returns {void} No retorna ningún valor.
   */
  crearAgregarFormulario(): void {

    this.domicilioEstablecimiento = this.fb.group({
      ideGenerica1: ['', Validators.required],
      observaciones: [{ value: '', disabled: true }, [Validators.maxLength(2000)]],
      establecimientoRFCResponsableSanitario: ['', Validators.pattern(REGEX_RFC_FISICA)],
      establecimientoRazonSocial: ['', Validators.required],
      establecimientoCorreoElectronico: ['', [Validators.required, Validators.email]],
      establecimientoEstados: ['', Validators.required],
      descripcionMunicipio: ['', Validators.required],
      localidad: [''],
      establishomentoColonias: [''],
      calle: ['', Validators.required],
      lada: ['', [Validators.maxLength(5), Validators.pattern(REGEX_SOLO_DIGITOS)]],
      telefono: ['', [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS)]],
      establecimientoDomicilioCodigoPostal: ['', Validators.required],
      scian: ['', Validators.required]
    });
    this.scianForm = this.fb.group({
      scian: ['', Validators.required],
      descripcionScian: ['', Validators.required],
    });

    this.solicitudEstablecimientoForm = this.fb.group({
      noLicenciaSanitaria: ['', Validators.required],
      avisoCheckbox: [false],
      licenciaSanitaria: [{ value: '', disabled: true }],
      regimen: [''],
      aduanasEntradas: [''],
      aifaCheckbox: [false],
    });
    this.formMercancias = this.fb.group({
      clasificacion: ['', Validators.required],
      especificarClasificacionProducto: ['', Validators.required],
      denominacionEspecifica: ['', Validators.required],
      denominacionDistintiva: ['', Validators.required],
      denominacionComun: ['', Validators.required],
      tipoDeProducto: ['', Validators.required],
      estadoFisico: ['', Validators.required],
      fraccionArancelaria: ['', Validators.required],
      descripcionFraccion: [{ value: '', disabled: true }, Validators.required],
      cantidadUMT: ['', Validators.required],
      UMT: [{ value: '', disabled: true }, Validators.required],
      cantidadUMC: ['', Validators.required],
      UMC: ['', Validators.required],
      presentacion: ['', Validators.required],
      numeroRegistro: ['', Validators.required],
      fechaCaducidad: [''],

    });
  }

  /**
   * Carga los datos del catálogo SCIAN.
   */
  loadScian(): void {
    this.establecimientoService
      .getSciandata()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: Catalogo[]) => {
        this.scianJson = resp;
      });
  }

  /**
  * @method loadEstadoData
  * @description
  * Este método carga los datos del catálogo de estados desde el servicio `EstablecimientoService`.
  * Utiliza un observable para suscribirse a los datos y los almacena en la propiedad `estado`.
  * La suscripción se gestiona con `takeUntil` para evitar fugas de memoria al destruir el componente.
  * 
  * @returns void
  */
  loadEstadoData(): void {
    this.establecimientoService
      .getEstadodata()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: Catalogo[]) => {
        this.estado = resp;
      });
  }

  /**
   * @method cerrarModal
   * @description
   * Este método cierra el modal activo utilizando la instancia del modal de Bootstrap.
   * Verifica si la instancia del modal (`modalInstance`) está definida antes de intentar cerrarlo.
   * 
   * @returns void
   */
  cerrarModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  /**
   * Actualiza el estado del formulario según los cambios en los controles.
   * @param controlName Nombre del control que cambió.
   */
  onContriloChange(controlName: string): void {
    const UPDATED_VALUE = {
      [controlName]: this.scianForm.get(controlName)?.value,
    };

    this.domicilioEstablecimientoStore.update(UPDATED_VALUE);
  }

  /**
   * Carga los datos del catálogo de justificación.
   */
  enCambioDeControl(controlName: string): void {
    const VALOR_SELECCIONADO = this.domicilioEstablecimiento.get(controlName)?.value;
    this.domicilioEstablecimientoStore.update({
    [controlName]: VALOR_SELECCIONADO
  });
  if (controlName === 'ideGenerica1' && VALOR_SELECCIONADO === 'modificacion') {
    this.domicilioEstablecimiento.get('observaciones')?.enable();
  } else {
    this.domicilioEstablecimiento.get('observaciones')?.disable();
  }
  }

  /**
   * Actualiza el estado del formulario según los cambios en los controles.
   * @param controlName Nombre del control que cambió.
   */
  enControlCambioFormulario(controlName: string): void {

    const UPDATED_VALUE = {
      [controlName]: this.solicitudEstablecimientoForm.get(controlName)?.value,
    };

    this.domicilioEstablecimientoStore.update(UPDATED_VALUE);
    if (controlName === 'noLicenciaSanitaria' && UPDATED_VALUE['noLicenciaSanitaria'] !== '') {
      this.tieneNoLicenciaSanitaria = true;
    } else if (controlName === 'noLicenciaSanitaria' && UPDATED_VALUE['noLicenciaSanitaria'] === '') {
      this.tieneNoLicenciaSanitaria = false;
    }
  }
 
  /**
   * Habilita o deshabilita el campo "No Licencia Sanitaria" según el estado del checkbox.
   * @param event Evento del checkbox.
   */
  toggleNoLicenciaSanitaria(event: Event): void {
    const NO_LICENCIA_SANITARIA = this.solicitudEstablecimientoForm.get(
      'noLicenciaSanitaria'
    );

    if ((event.target as HTMLInputElement).checked) {
      NO_LICENCIA_SANITARIA?.disable();
    } else {
      NO_LICENCIA_SANITARIA?.enable();
    }
  }

  /**
   * Limpia el formulario SCIAN.
   */
  limpiarScianForm(): void {
    this.scianForm.reset();
  }

  /**
   * Datos SCIAN agregados por el usuario.
   */
  personaparas: ScianModel[] = [];

  /**
   * Selección actual de elementos en la tabla SCIAN.
   */
  public scianSelecciona: ScianModel[] = [];

  /**
  * Abre el modal SCIAN.
  */
  abrirModalMercancia(): void {
    this.modalAddAgentMercanciasInstance.show();
  }

  /**
   * Establece los valores por defecto en el formulario de mercancías.
   */
  public setFormaControl():void {
   this.formMercancias.get('descripcionFraccion')?.setValue('vgvxdsy xvytfew');
   this.formMercancias.get('UMT')?.setValue('34654HGTROJOI6777');
  }

  public agregarMercancia(): void {
    if (this.formMercancias.valid) {
      const FORMA_DATOS = {
          clasificacion: this.formMercancias.get('clasificacion')?.value,
          especificar: this.formMercancias.get('especificarClasificacionProducto')?.value,
          denominacionEspecifica: this.formMercancias.get('denominacionEspecifica')?.value,
          denominacionDistintiva: this.formMercancias.get('denominacionDistintiva')?.value,
          denominacionComun: this.formMercancias.get('denominacionComun')?.value,
          formaFarmaceutica: this.formMercancias.get('formaFarmaceutica')?.value,
          estadoFisico: this.formMercancias.get('estadoFisico')?.value,
          fraccionArancelaria: this.formMercancias.get('fraccionArancelaria')?.value,
          descripcionFraccion: this.formMercancias.get('descripcionFraccion')?.value,
          unidad: this.formMercancias.get('unidad')?.value,
          cantidadUMC: this.formMercancias.get('cantidadUMC')?.value,
          unidadUMT: this.formMercancias.get('UMT')?.value,
          cantidadUMT: this.formMercancias.get('cantidadUMT')?.value,
          presentacion: this.formMercancias.get('presentacion')?.value,
          numeroRegistro: this.formMercancias.get('numeroRegistro')?.value,
          paisDeOrigen: this.formMercancias.get('paisDeOrigen')?.value,
          paisDeProcedencia: this.formMercancias.get('paisDeProcedencia')?.value,
          tipoProducto: this.formMercancias.get('tipoDeProducto')?.value,
          usoEspecifico: this.formMercancias.get('usoEspecifico')?.value,
      }
      this.mercanciasTablaDatos = [...this.mercanciasTablaDatos, FORMA_DATOS];
      this.formMercancias.reset();
    }
  }

  /** 
   * Limpia el formulario de mercancías.
   */
  public limpiarFormulario(): void {
    this.formMercancias.reset();
  }

  /**
   * Obtiene los datos de la tabla SCIAN.
   */
  public getScianTablaDatosInfo(): void {
    this.establecimientoService.getScianTablaDatos().pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.personaparas = doDeepCopy(response);
      });
  }

  /** 
   * Obtiene los datos de la tabla de mercancías.
   */
  public getDatosMercanciasTablaDatosInfo(): void {
    this.establecimientoService.getMercanciasTablaDatos().pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.mercanciasTablaDatos = doDeepCopy(response);
      });
  }

  /**
   * Maneja la selección de elementos SCIAN.
   * @param event Evento que contiene los elementos seleccionados.
   */
  public onScianSeleccionados(event: ScianModel[]): void {
    this.scianSelecciona = event;
  }

  /**
   * Maneja la selección de mercancías.
   * @param event Evento que contiene las mercancías seleccionadas.
   */
  public onMercanciasSeleccionados(event: MercanciasInfo[]): void {
    this.seleccionaMercancias = event;
  }

  /**
   * Configuración de columnas para la tabla de datos SCIAN.
   */
  configuracionTabla: ConfiguracionColumna<ScianModel>[] = SCIAN_TABLE_CONFIG;

  /**
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
