/**
 * Componente de datos comunes utilizado en el trámite 32604 para la gestión de información empresarial.
 *
 * Este archivo contiene el componente principal que maneja los datos comunes de la solicitud 32604,
 * incluyendo la configuración de formularios, gestión de estados, manejo de catálogos,
 * y la interacción con modales para agregar información de empresa, subcontratados e instalaciones.
 */

import { CommonModule } from '@angular/common';

import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';

import { ToastrModule, ToastrService } from 'ngx-toastr';

import { Subject, map, takeUntil } from 'rxjs';

import { ConsultaioQuery } from '@ng-mf/data-access-user';

import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  ConfiguracionAporteColumna,
  ConfiguracionColumna,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  REGEX_PATRON_ALFANUMERICO,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent
} from '@libs/shared/data-access-user/src';

import {
  DOMICILIOS_CONFIGURACION_COLUMNAS,
  INVENTARIOS_CONFIGURACION,
  LibroTrabajoExcel,
  NUMERO_DE_EMPLEADOS_CONFIGURACION,
  RegistroExcel,
  SECCION_SOCIOSIC_CONFIGURACION_COLUMNAS
} from '../../constants/empresas-comercializadoras.enum';

import { Instalaciones } from '../../constants/agregar.model';

import {
  Domicilios,
  InputRadio,
  Inventarios,
  NumeroDeEmpleados,
  SeccionSociosIC,
  SolicitudCatologoSelectLista,
  SolicitudRadioLista
} from '../../models/empresas-comercializadoras.model';

import { Solicitud32604Query } from '../../estados/solicitud32604.query';

import { Solicitud32604State, Solicitud32604Store } from '../../estados/solicitud32604.store';

import { CatalogoInicializacionService } from '../../services/catalogo-inicializacion.servicio';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';

import { AgregarComponent } from '../agregar/agregar.component';
import { EmpresaComponent } from '../empresa/empresa.component';
import { ModificarComponent } from '../modificar/modificar.component';

/**
 * Componente principal para la gestión de datos comunes de la solicitud 32604.
 * 
 * Este componente se encarga de mostrar y gestionar las secciones relacionadas
 * con miembros de la empresa, subcontratados, instalaciones principales y otros
 * datos necesarios en el flujo de la solicitud. Proporciona funcionalidades para
 * capturar, validar y almacenar información empresarial mediante formularios
 * reactivos y modales interactivos.
 * 
 * @component
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-datos-comunes',
  standalone: true,
  imports: [
    AgregarComponent,
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    InputRadioComponent,
    TituloComponent,
    TablaDinamicaComponent,
    ToastrModule,
    ModificarComponent,
    EmpresaComponent,
    NotificacionesComponent
  ],
  providers: [EmpresasComercializadorasService, ToastrService],
  templateUrl: './datos-comunes.component.html',
  styleUrl: './datos-comunes.component.scss',
})
/**
 * Componente principal para la gestión de datos comunes de la solicitud.
 * Este componente se encarga de mostrar y gestionar las secciones relacionadas
 * con miembros de la empresa, subcontratados, instalaciones principales y otros
 * datos necesarios en el flujo de la solicitud.
 */
export class DatosComunesComponent implements OnInit, OnDestroy {
  /**
   * Formulario principal que contiene los datos comunes del componente.
   * 
   * Este formulario reactivo gestiona todos los campos de entrada del usuario
   * y mantiene sincronización con el estado global de la aplicación.
   * 
   * @property {FormGroup} datosComunesForm
   */
  datosComunesForm!: FormGroup;

  /**
   * Subject para manejar la destrucción del componente y evitar fugas de memoria.
   * 
   * Se utiliza con el operador `takeUntil` para cancelar automáticamente
   * todas las suscripciones activas cuando el componente se destruye.
   * 
   * @private
   * @property {Subject<void>} destroy$
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Modelo para la opción de tipo sí/no representado como radio button.
   * 
   * Contiene las opciones disponibles para campos de selección binaria
   * utilizados en diferentes secciones del formulario.
   * 
   * @property {InputRadio} sinoOpcion
   */
  sinoOpcion: InputRadio = {} as InputRadio;

  /**
   * Catálogo para el sector productivo.
   * 
   * Contiene la lista de opciones disponibles para seleccionar
   * el sector productivo de la empresa en el formulario.
   * 
   * @property {CatalogosSelect} sectorProductivo
   */
  sectorProductivo: CatalogosSelect = {} as CatalogosSelect;

  /**
   * Catálogo para el tipo de servicio.
   * 
   * Lista de servicios disponibles que puede seleccionar la empresa
   * como parte de sus actividades comerciales.
   * 
   * @property {CatalogosSelect} servicio
   */
  servicio: CatalogosSelect = {} as CatalogosSelect;

  /**
   * Indicador para rastrear si se ha interactuado con los desplegables.
   * 
   * Se establece como true cuando el usuario hace clic en cualquiera
   * de los desplegables (catseleccionados o servicio) para mostrar
   * validaciones apropiadas.
   * 
   * @property {boolean} desplegablesInteractuados
   */
  desplegablesInteractuados = false;

  /**
   * Catálogo para seleccionar el bimestre.
   * 
   * Opciones de períodos bimestrales utilizados para reportes
   * y declaraciones específicas del trámite.
   * 
   * @property {CatalogosSelect} bimestre
   */
  bimestre: CatalogosSelect = {} as CatalogosSelect;

  /**
   * Catálogo con opción para indicar "todos".
   * 
   * Proporciona una opción especial para seleccionar todos los elementos
   * disponibles en lugar de elementos individuales.
   * 
   * @property {CatalogosSelect} indiqueTodos
   */
  indiqueTodos: CatalogosSelect = {} as CatalogosSelect;

  /**
   * Estado actual del formulario 32604.
   * 
   * Contiene toda la información del estado actual de la solicitud,
   * incluyendo datos del formulario, listas y configuraciones.
   * 
   * @property {Solicitud32604State} solicitud32604State
   */
  solicitud32604State: Solicitud32604State = {} as Solicitud32604State;

  /**
   * Tipo de tabla utilizada para mostrar número de empleados (checkbox).
   * 
   * Define el comportamiento de selección de la tabla como tipo checkbox
   * para permitir selecciones múltiples.
   * 
   * @property {TablaSeleccion} numeroDeEmpleadosTabla
   */
  numeroDeEmpleadosTabla = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de columnas para la tabla de número de empleados.
   * 
   * Define la estructura, formato y comportamiento de las columnas
   * que se mostrarán en la tabla de número de empleados.
   * 
   * @property {ConfiguracionColumna<NumeroDeEmpleados>[]} numeroDeEmpleadosConfiguracionColumnas
   */
  numeroDeEmpleadosConfiguracionColumnas: ConfiguracionColumna<NumeroDeEmpleados>[] =
    NUMERO_DE_EMPLEADOS_CONFIGURACION;

  /**
   * Lista completa de número de empleados.
   * 
   * Contiene todos los registros de empleados disponibles
   * para mostrar en la tabla correspondiente.
   * 
   * @property {NumeroDeEmpleados[]} numeroDeEmpleadosLista
   */
  numeroDeEmpleadosLista: NumeroDeEmpleados[] = [] as NumeroDeEmpleados[];

  /**
   * Lista de empleados seleccionados en la tabla.
   * 
   * Almacena los registros de empleados que el usuario ha seleccionado
   * mediante los checkboxes de la tabla.
   * 
   * @property {NumeroDeEmpleados[]} seleccionarNumeroDeEmpleadosLista
   */
  seleccionarNumeroDeEmpleadosLista: NumeroDeEmpleados[] =
    [] as NumeroDeEmpleados[];

  /**
   * Configuración de columnas para la tabla de domicilios.
   * 
   * Define la estructura y comportamiento de las columnas
   * para la visualización de datos de domicilios empresariales.
   * 
   * @property {ConfiguracionColumna<Domicilios>[]} domiciliosConfiguracionColumnas
   */
  domiciliosConfiguracionColumnas: ConfiguracionColumna<Domicilios>[] =
    DOMICILIOS_CONFIGURACION_COLUMNAS;

  /**
   * Datos de los domicilios disponibles.
   * 
   * Lista de domicilios registrados de la empresa,
   * incluyendo instalaciones y direcciones comerciales.
   * 
   * @property {Domicilios[]} domiciliosDatos
   */
  domiciliosDatos: Domicilios[] = [] as Domicilios[];

  /**
   * Domicilios seleccionados por el usuario.
   * 
   * Almacena los domicilios que el usuario ha marcado
   * como seleccionados en la interfaz.
   * 
   * @property {Domicilios[]} seleccionarDomiciliosDatos
   */
  seleccionarDomiciliosDatos: Domicilios[] = [] as Domicilios[];

  /**
   * Configuración de columnas para la tabla de inventarios.
   * 
   * Define la estructura de las columnas con aportes específicos
   * para la visualización de datos de inventarios.
   * 
   * @property {ConfiguracionAporteColumna<Inventarios>[]} inventariosConfiguracionColumnas
   */
  inventariosConfiguracionColumnas: ConfiguracionAporteColumna<Inventarios>[] =
    INVENTARIOS_CONFIGURACION;

  /**
   * Datos de inventarios registrados.
   * 
   * Lista de inventarios disponibles de la empresa,
   * incluyendo productos, materiales y existencias.
   * 
   * @property {Inventarios[]} inventariosDatos
   */
  inventariosDatos: Inventarios[] = [] as Inventarios[];

  /**
   * Inventarios seleccionados por el usuario.
   * 
   * Almacena los inventarios que el usuario ha marcado
   * como seleccionados para procesamiento o eliminación.
   * 
   * @property {Inventarios[]} seleccionarInventarios
   */
  seleccionarInventarios: Inventarios[] = [] as Inventarios[];

  /**
   * Indica si se está en modo de modificación de inventario.
   * 
   * Controla si el formulario de inventarios está en modo
   * de edición (true) o en modo de agregar nuevo (false).
   * 
   * @property {boolean} modoModificacionInventario
   */
  modoModificacionInventario: boolean = false;

  /**
   * Inventario seleccionado para modificación.
   * 
   * Almacena el inventario que se está editando cuando
   * se encuentra en modo de modificación.
   * 
   * @property {Inventarios | null} inventarioSeleccionadoParaModificar
   */
  inventarioSeleccionadoParaModificar: Inventarios | null = null;

  /**
   * Configuración de columnas para la sección de socios IC.
   * 
   * Define la estructura de las columnas para mostrar
   * información de socios y miembros de la empresa.
   * 
   * @property {ConfiguracionColumna<SeccionSociosIC>[]} seccionSociosICConfiguracionColumnas
   */
  seccionSociosICConfiguracionColumnas: ConfiguracionColumna<SeccionSociosIC>[] =
    SECCION_SOCIOSIC_CONFIGURACION_COLUMNAS;

  /**
   * Lista de socios IC registrados.
   * 
   * Contiene la información de todos los socios
   * y miembros registrados de la empresa.
   * 
   * @property {SeccionSociosIC[]} listaSeccionSociosIC
   */
  listaSeccionSociosIC: SeccionSociosIC[] = [] as SeccionSociosIC[];

  /**
   * Lista de socios IC seleccionados por el usuario.
   * 
   * Almacena los socios que han sido seleccionados
   * para operaciones específicas como modificación o eliminación.
   * 
   * @property {SeccionSociosIC[]} seleccionarListaSeccionSociosIC
   */
  seleccionarListaSeccionSociosIC: SeccionSociosIC[] = [] as SeccionSociosIC[];

  /**
   * Referencia al modal para agregar miembros de la empresa.
   * 
   * ViewChild que permite acceder al elemento DOM del modal
   * utilizado para agregar nuevos miembros a la empresa.
   * 
   * @property {ElementRef} elementoModalAgregarMiembros
   */
  @ViewChild('modalAgregarMiembrosEmpresa', { static: false })
  elementoModalAgregarMiembros!: ElementRef;

  /**
   * Referencia al modal de la sección de subcontratados.
   * 
   * ViewChild que proporciona acceso al modal utilizado
   * para gestionar la información de subcontratados.
   * 
   * @property {ElementRef} elementoModalSeccionSubcontratados
   */
  @ViewChild('modalSeccionSubcontratados', { static: false })
  elementoModalSeccionSubcontratados!: ElementRef;

  /**
   * Referencia al modal de instalaciones principales.
   * 
   * ViewChild que permite controlar el modal destinado
   * a la gestión de instalaciones principales de la empresa.
   * 
   * @property {ElementRef} elementoModalInstalacionesPrincipales
   */
  @ViewChild('modalInstalacionesPrincipalesElement', { static: false })
  elementoModalInstalacionesPrincipales!: ElementRef;

  /**
   * Referencia al modal de modificación.
   * 
   * ViewChild que proporciona acceso al modal utilizado
   * para modificar información existente.
   * 
   * @property {ElementRef} elementoModalModificar
   */
  @ViewChild('modalModificarElement', { static: false })
  elementoModalModificar!: ElementRef;

  /**
   * Referencia al modal de la sección de empresa.
   * 
   * ViewChild que permite acceder al modal utilizado
   * para gestionar información general de la empresa.
   * 
   * @property {ElementRef} elementoModalEmpresa
   */
  @ViewChild('modalEmpresaElement', { static: false })
  elementoModalEmpresa!: ElementRef;

  /**
   * Referencia al componente agregar dentro del modal.
   * 
   * ViewChild que proporciona acceso directo al componente
   * AgregarComponent para controlar su estado y comportamiento.
   * 
   * @property {AgregarComponent} componenteAgregar
   */
  @ViewChild('agregarComponent', { static: false })
  componenteAgregar!: AgregarComponent;

  /**
   * Referencia al componente modificar dentro del modal.
   * 
   * ViewChild que proporciona acceso directo al componente
   * ModificarComponent para controlar su estado y comportamiento.
   * 
   * @property {ModificarComponent} componenteModificar
   */
  @ViewChild('modificarComponent', { static: false })
  componenteModificar!: ModificarComponent;

  /**
   * Referencia al modal para modificar miembros de la empresa.
   * 
   * ViewChild que permite acceder al elemento DOM del modal
   * utilizado para modificar miembros existentes de la empresa.
   * 
   * @property {ElementRef} modalModificarMiembro
   */
  @ViewChild('modalModificarMiembro', { static: false })
  modalModificarMiembro!: ElementRef;

  /**
   * Referencia al modal para modificar inventarios.
   * 
   * ViewChild que permite acceder al elemento DOM del modal
   * utilizado para modificar inventarios existentes.
   * 
   * @property {ElementRef} modalModificarInventario
   */
  @ViewChild('modalModificarInventario', { static: false })
  modalModificarInventario!: ElementRef;

  /**
   * Formulario reactivo para el modal de modificación de inventarios.
   * 
   * FormGroup que gestiona los campos del modal de modificación,
   * incluyendo identificación y lugar de radicación.
   * 
   * @property {FormGroup} inventarioModalForm
   */
  inventarioModalForm!: FormGroup;

  /**
   * Referencia al componente empresa dentro del modal.
   * 
   * ViewChild que proporciona acceso directo al componente
   * EmpresaComponent para controlar su estado y comportamiento.
   * 
   * @property {EmpresaComponent} modificarMiembroComponent
   */
  @ViewChild('modificarMiembroComponent', { static: false })
  modificarMiembroComponent!: EmpresaComponent;

  /**
   * Domicilio seleccionado para modificar
   */
  domicilioSeleccionadoParaModificar: Domicilios | null = null;

  /**
   * Miembro seleccionado para modificar
   */
  miembroSeleccionadoParaModificar: SeccionSociosIC | null = null;

  /**
   * Notificación utilizada para mostrar mensajes al usuario.
   * 
   * Objeto que contiene la configuración y contenido
   * de las notificaciones que se muestran en la interfaz.
   * 
   * @public
   * @property {Notificacion} nuevaNotificacion
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Notificación de éxito para mostrar cuando se guardan datos correctamente.
   * 
   * Siguiendo el patrón del 40402, esta notificación se muestra cuando
   * las operaciones de Add/Modify se completan exitosamente.
   * 
   * @public
   * @property {Notificacion} alertaNotificacion
   */
  public alertaNotificacion!: Notificacion;

  /**
   * Indica si se debe mostrar la notificación de éxito.
   * 
   * @public
   * @property {boolean} mostrarNotificacion
   */
  public mostrarNotificacion: boolean = false;

  /**
   * Índice o identificador del elemento que se desea eliminar de la tabla de pedimentos.
   * 
   * Almacena la referencia del elemento seleccionado
   * para operaciones de eliminación.
   * 
   * @property {number} elementoParaEliminar
   */
  elementoParaEliminar!: number;

  /**
   * Lista de pedimentos ingresados por el usuario.
   * 
   * Array que contiene todos los pedimentos registrados
   * en el sistema durante el proceso de captura.
   * 
   * @property {Array<Pedimento>} pedimentos
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * Indica si el formulario está en modo solo lectura.
   * 
   * Cuando es `true`, los campos del formulario no se pueden editar
   * y se muestran únicamente para consulta.
   * 
   * @property {boolean} esFormularioSoloLectura
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Almacena los valores anteriores de los campos críticos para detectar cambios.
   * 
   * @property {Record<string, string | number | null | undefined>} valoresAnteriores
   */
  valoresAnteriores: Record<string, string | number | null | undefined> = {};

  /**
   * Constructor del componente donde se inicializan servicios y se cargan catálogos necesarios.
   * 
   * Inicializa todas las dependencias del componente y configura los catálogos iniciales
   * utilizando el servicio de inicialización. También establece la suscripción al estado
   * de consulta para manejar el modo de solo lectura del formulario.
   * 
   * @param {FormBuilder} fb - Constructor de formularios reactivos de Angular
   * @param {EmpresasComercializadorasService} empresasComercializadorasService - Servicio para gestión de empresas comercializadoras
   * @param {Solicitud32604Store} solicitud32604Store - Store para manejo del estado de la solicitud 32604
   * @param {Solicitud32604Query} solicitud32604Query - Query para consultas del estado de la solicitud 32604
   * @param {ConsultaioQuery} consultaioQuery - Query para el estado de consulta de la aplicación
   */
  constructor(
    public fb: FormBuilder,
    public empresasComercializadorasService: EmpresasComercializadorasService,
    public solicitud32604Store: Solicitud32604Store,
    public solicitud32604Query: Solicitud32604Query,
    public consultaioQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    
    /**
     * Inicializar objetos de catálogo utilizando el CatalogoInicializacionService.
     * 
     * Se obtienen los catálogos iniciales necesarios para el funcionamiento del componente,
     * incluyendo sector productivo, servicio, bimestre e indicador de "todos".
     */
    const CATALOGOS_INICIALES = CatalogoInicializacionService.inicializarTodosCatalogos();
    this.sectorProductivo = CATALOGOS_INICIALES.sectorProductivo;
    this.servicio = CATALOGOS_INICIALES.servicio;
    this.bimestre = CATALOGOS_INICIALES.bimestre;
    this.indiqueTodos = CATALOGOS_INICIALES.indiqueTodos;
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * 
   * Inicializa el formulario `datosComunesForm` con valores del estado actual
   * y suscribe a los cambios del store para mantener los datos sincronizados.
   * También configura las suscripciones necesarias para el manejo de estados
   * y carga los catálogos e inventarios requeridos.
   * 
   * @memberof DatosComunesComponent
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.solicitud32604Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitud32604State = {
            ...this.solicitud32604State,
            ...seccionState,
          };
        })
      )
      .subscribe();
    this.consultaioQuery.selectConsultaioState$
    .pipe(
    takeUntil(this.destroy$),
    map((seccionState) => {
      this.esFormularioSoloLectura = seccionState.readonly;
      this.inicializarEstadoFormulario();
    })
  )
  .subscribe();
    this.inicializarEstadoFormulario();
    this.conseguirOpcionDeRadio();
    this.conseguirOpcionDeRadio();
    this.conseguirSolicitudCatologoSelectLista();
    
    // Inicializar los campos de registros con contadores iniciales
    this.actualizarCampoRegistrosExistentes();
    this.actualizarCampoProveedoresExistentes();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * 
   * Determina el modo de operación del formulario basado en el estado
   * de solo lectura y ejecuta la acción correspondiente para inicializar
   * o cargar datos según sea necesario.
   * 
   * @memberof DatosComunesComponent
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde el estado y actualiza el formulario con la información obtenida.
   * 
   * Inicializa el formulario y luego aplica el estado de solo lectura según corresponda.
   * Si el formulario está en modo de solo lectura, deshabilita todos los controles,
   * de lo contrario, los mantiene habilitados para edición.
   * 
   * @memberof DatosComunesComponent
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.datosComunesForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.datosComunesForm.enable();
    }
  }

  /**
   * Inicializa el formulario `datosComunesForm` con los valores actuales del estado `solicitud32604State`.
   *
   * Este formulario contiene una amplia variedad de campos que representan diferentes datos
   * requeridos por la solicitud 32604. Los valores iniciales de cada control se obtienen
   * directamente del estado actual gestionado por el store. También establece la suscripción
   * para mantener el formulario sincronizado con los cambios del estado global.
   * 
   * @memberof DatosComunesComponent
   */
  inicializarFormulario(): void {
    this.datosComunesForm = this.fb.group({
      catseleccionados: [this.solicitud32604State.catseleccionados],
      servicio: [this.solicitud32604State.servicio],
      '190': [this.solicitud32604State['190'], Validators.required],
      '191': [this.solicitud32604State['191'], Validators.required],
      '199': [this.solicitud32604State['199'], Validators.required],
      '200': [this.solicitud32604State['200'], Validators.required],
      '201': [this.solicitud32604State['201'], Validators.required],
      empleados: [this.solicitud32604State.empleados],
      bimestre: [this.solicitud32604State.bimestre],
      '2034': [this.solicitud32604State['2034']],
      '236': [this.solicitud32604State['236']],
      '237': [this.solicitud32604State['237']],
      '238': [this.solicitud32604State['238']],
      '239': [this.solicitud32604State['239']],
      '240': [this.solicitud32604State['240']],
      '243': [this.solicitud32604State['243']],
      '244': [this.solicitud32604State['244'], Validators.required],
      '245': [this.solicitud32604State['245']],
      indiqueTodos: [this.solicitud32604State.indiqueTodos],
      '246': [this.solicitud32604State['246'], Validators.required],
      file1: [this.solicitud32604State.file1],
      file2: [this.solicitud32604State.file2],
      '247': [this.solicitud32604State['247'], Validators.required],
      '248': [this.solicitud32604State['248']],
      identificacion: [{ value: this.solicitud32604State.identificacion, disabled: true }, [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]],
      lugarDeRadicacion: [{ value: this.solicitud32604State.lugarDeRadicacion, disabled: true }, [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]],
      '249': [this.solicitud32604State['249']],
      '250': [this.solicitud32604State['250'], Validators.required],
      '251': [this.solicitud32604State['251'], Validators.required],
      checkbox1: [this.solicitud32604State.checkbox1],
      checkbox2: [this.solicitud32604State.checkbox2, Validators.required],
      checkbox3: [this.solicitud32604State.checkbox3],
      actualmente2: [{ value: this.solicitud32604State.actualmente2, disabled: true }],
      actualmente1: [{ value: this.solicitud32604State.actualmente1, disabled: true }],
    });

    // Inicializar formulario del modal de modificar inventario
    this.inventarioModalForm = this.fb.group({
      identificacion: ['', Validators.required],
      lugarDeRadicacion: ['', Validators.required]
    });

    /**
     * Suscripción al estado de solicitud en el store para mantener
     * sincronizados los datos del formulario con el estado global.
     */
    this.solicitud32604Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud32604State) => {
          this.solicitud32604State = respuesta;
          this.datosComunesForm.patchValue({
            catseleccionados: this.solicitud32604State.catseleccionados,
            servicio: this.solicitud32604State.servicio,
            '190': this.solicitud32604State['190'],
            '191': this.solicitud32604State['191'],
            '199': this.solicitud32604State['199'],
            empleados: this.solicitud32604State.empleados,
            bimestre: this.solicitud32604State.bimestre,
            '2034': this.solicitud32604State['2034'],
            '236': this.solicitud32604State['236'],
            '237': this.solicitud32604State['237'],
            '238': this.solicitud32604State['238'],
            '239': this.solicitud32604State['239'],
            '240': this.solicitud32604State['240'],
            '243': this.solicitud32604State['243'],
            '244': this.solicitud32604State['244'],
            '245': this.solicitud32604State['245'],
            indiqueTodos: this.solicitud32604State.indiqueTodos,
            '246': this.solicitud32604State['246'],
            file1: this.solicitud32604State.file1,
            file2: this.solicitud32604State.file2,
            '247': this.solicitud32604State['247'],
            '248': this.solicitud32604State['248'],
            identificacion: this.solicitud32604State.identificacion,
            lugarDeRadicacion: this.solicitud32604State.lugarDeRadicacion,
            '249': this.solicitud32604State['249'],
            '250': this.solicitud32604State['250'],
            '251': this.solicitud32604State['251'],
            checkbox1: this.solicitud32604State.checkbox1,
            checkbox2: this.solicitud32604State.checkbox2,
            checkbox3: this.solicitud32604State.checkbox3,
            actualmente2: this.solicitud32604State.actualmente2,
            actualmente1: this.solicitud32604State.actualmente1,
          });
          this.numeroDeEmpleadosLista =
            this.solicitud32604State.numeroDeEmpleadosLista;
          this.domiciliosDatos = this.solicitud32604State.domiciliosDatos;
          this.listaSeccionSociosIC =
            this.solicitud32604State.listaSeccionSociosIC;
          
          // Configurar estado inicial de campos identificacion y lugarDeRadicacion basado en el valor de '249'
          this.configurarEstadoInicialCampos();
        })
      )
      .subscribe();
  }

  /**
   * Configura el estado inicial de los campos 'identificacion' y 'lugarDeRadicacion'
   * basado en el valor actual del campo '249'.
   * 
   * Si el campo '249' tiene valor 1 ('Si'), habilita los campos.
   * Si tiene cualquier otro valor, los mantiene deshabilitados.
   * 
   * @memberof DatosComunesComponent
   */
  private configurarEstadoInicialCampos(): void {
    const VALOR_249 = this.solicitud32604State['249'];
    const IDENTIFICACION_CONTROL = this.datosComunesForm.get('identificacion');
    const LUGAR_DE_RADICACION_CONTROL = this.datosComunesForm.get('lugarDeRadicacion');
    
    if (VALOR_249 === 1 || VALOR_249 === '1' || VALOR_249 === 2 || VALOR_249 === '2') {
      // Si hay cualquier selección ("Si" o "No"), habilitar los campos
      IDENTIFICACION_CONTROL?.enable();
      LUGAR_DE_RADICACION_CONTROL?.enable();
    } else {
      // Si no hay selección, deshabilitar los campos
      IDENTIFICACION_CONTROL?.disable();
      LUGAR_DE_RADICACION_CONTROL?.disable();
    }
  }

  /**
   * Método para obtener la opción de radio (sí/no) desde el servicio.
   * 
   * Se suscribe al observable del servicio empresas comercializadoras
   * y asigna el resultado a la propiedad `sinoOpcion` para su uso
   * en los componentes de radio button del formulario.
   * 
   * @memberof DatosComunesComponent
   */
  conseguirOpcionDeRadio(): void {
    this.empresasComercializadorasService
      .conseguirOpcionDeRadio()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudRadioLista) => {
          this.sinoOpcion = respuesta.requisitos;
        },
      });
  }

  /**
   * Método para obtener los catálogos del formulario desde el servicio.
   * 
   * Se suscribe al servicio para obtener las listas de catálogos necesarios
   * y los asigna a sus propiedades correspondientes (sector productivo, servicio,
   * bimestre e indique todos). Incluye manejo de errores para casos fallidos.
   * 
   * @memberof DatosComunesComponent
   */
  conseguirSolicitudCatologoSelectLista(): void {
    this.empresasComercializadorasService
      .conseguirSolicitudCatologoSelectLista()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudCatologoSelectLista) => {
          this.sectorProductivo = { ...this.sectorProductivo, ...respuesta.sectorProductivo };
          this.servicio = { ...this.servicio, ...respuesta.servicio };
          this.bimestre = { ...this.bimestre, ...respuesta.bimestre };
          this.indiqueTodos = { ...this.indiqueTodos, ...respuesta.indiqueTodos };
        }
      });
  }

  /**
   * Muestra el modal para agregar miembros de la empresa.
   * 
   * Utiliza el elemento del DOM referenciado como modalModificarMiembro
   * para mostrar el formulario en modo "agregar" (sin datos precargados).
   * Verifica que el elemento exista antes de proceder.
   * 
   * @memberof DatosComunesComponent
   */
  agregarMiembrosEmpresa(): void {
    // Limpiar cualquier dato de modificación previo
    this.miembroSeleccionadoParaModificar = null;
    
    if (this.modalModificarMiembro) {
      const INSTANCIA_MODAL = new Modal(this.modalModificarMiembro.nativeElement);
      INSTANCIA_MODAL.show();
      
      // Asegurar que el formulario se resetee cuando se abra para agregar
      setTimeout(() => {
        if (this.modificarMiembroComponent) {
          this.modificarMiembroComponent.resetearFormulario();
        }
      }, 100);
    }
  }

  /**
   * Muestra el modal para agregar subcontratados a la empresa.
   * 
   * Crea una instancia de modal de Bootstrap utilizando el elemento
   * referenciado como elementoModalSeccionSubcontratados y lo muestra.
   * Incluye validación de existencia del elemento modal.
   * 
   * @memberof DatosComunesComponent
   */
  agregarSubcontratados(): void {
    if (this.elementoModalSeccionSubcontratados) {
      const INSTANCIA_MODAL = new Modal(
        this.elementoModalSeccionSubcontratados.nativeElement
      );
      INSTANCIA_MODAL.show();
    }
  }

  /**
   * Muestra el modal para agregar instalaciones principales de la empresa.
   * 
   * Reinicia el estado del componente agregar antes de mostrar el modal
   * y luego crea una instancia de modal de Bootstrap para mostrarlo.
   * Utiliza el elemento referenciado como elementoModalInstalacionesPrincipales.
   * 
   * @memberof DatosComunesComponent
   */
  agregarInstalacionesPrincipales(): void {
    if (this.elementoModalInstalacionesPrincipales) {
      // Restablecer el estado del componente Agregar al abrir modal
      if (this.componenteAgregar) {
        this.componenteAgregar.resetModalState();
      }
      
      const INSTANCIA_MODAL = new Modal(
        this.elementoModalInstalacionesPrincipales.nativeElement
      );
      INSTANCIA_MODAL.show();
    }
  }

  /**
   * Cierra el modal de instalaciones principales.
   * 
   * Utiliza Bootstrap para obtener la instancia del modal y cerrarlo.
   * 
   * @memberof DatosComunesComponent
   */
  cerrarModalInstalaciones(): void {
    if (this.elementoModalInstalacionesPrincipales) {
      const ELEMENTO_MODAL = this.elementoModalInstalacionesPrincipales.nativeElement;
      const INSTANCIA_MODAL = Modal.getInstance(ELEMENTO_MODAL);
      
      if (INSTANCIA_MODAL) {
        INSTANCIA_MODAL.hide();
      }
    }
  }

  /**
   * Cierra el modal de modificar domicilio.
   * 
   * Utiliza Bootstrap para obtener la instancia del modal y cerrarlo.
   * 
   * @memberof DatosComunesComponent
   */
  cerrarModalModificar(): void {
    if (this.elementoModalModificar) {
      const ELEMENTO_MODAL = this.elementoModalModificar.nativeElement;
      const INSTANCIA_MODAL = Modal.getInstance(ELEMENTO_MODAL);
      
      if (INSTANCIA_MODAL) {
        INSTANCIA_MODAL.hide();
      }
    }
  }

  /**
   * Maneja la modificación de un domicilio
   * @param domicilioModificado - Domicilio con las modificaciones aplicadas
   */
  onDomicilioModificado(domicilioModificado: Domicilios): void {
    if (this.seleccionarDomiciliosDatos.length === 1) {
      const DOMICILIO_SELECCIONADO = this.seleccionarDomiciliosDatos[0];
      
      // Encontrar el índice del domicilio seleccionado en la lista principal
      const INDICE_SELECCIONADO = this.domiciliosDatos.findIndex(domicilio => 
        domicilio === DOMICILIO_SELECCIONADO ||
        (domicilio.entidadFederativa === DOMICILIO_SELECCIONADO.entidadFederativa &&
         domicilio.municipioDelegacion === DOMICILIO_SELECCIONADO.municipioDelegacion &&
         domicilio.direccion === DOMICILIO_SELECCIONADO.direccion &&
         domicilio.codigoPostal === DOMICILIO_SELECCIONADO.codigoPostal)
      );
      
      if (INDICE_SELECCIONADO !== -1) {
        // Actualizar el domicilio en la lista
        this.domiciliosDatos[INDICE_SELECCIONADO] = domicilioModificado;
        
        // Actualizar el store con los datos modificados
        this.solicitud32604Store.actualizarDomiciliosDatos(this.domiciliosDatos);
        
        // Limpiar la selección y resetear el domicilio seleccionado para modificar
        this.seleccionarDomiciliosDatos = [];
        this.domicilioSeleccionadoParaModificar = null;
        
        // Forzar la actualización de la vista creando una nueva referencia del array
        this.domiciliosDatos = [...this.domiciliosDatos];
        
        // Forzar la detección de cambios para actualizar la tabla
        this.cdr.detectChanges();
        
        // Mostrar mensaje de confirmación
        this.abrirModal('Datos guardados correctamente');
      }
    }
  }

  /**
   * Muestra el modal para modificar información existente.
   * 
   * Reinicia el estado del componente agregar antes de abrir el modal
   * y luego crea una instancia de modal de Bootstrap para mostrarlo.
   * Utiliza el elemento referenciado como modalModificarElement.
   * 
   * @memberof DatosComunesComponent
   */
  agregarModificarPrincipales(): void {
    // Validar que haya domicilios seleccionados
    if (this.seleccionarDomiciliosDatos.length === 0) {
      this.abrirModal('Debe seleccionar un domicilio para modificar.');
      return;
    }
    
    // Validar que solo haya un domicilio seleccionado
    if (this.seleccionarDomiciliosDatos.length > 1) {
      this.abrirModal('Solo puede modificar un domicilio a la vez. Seleccione únicamente el domicilio que desea modificar.');
      return;
    }

    // Obtener el domicilio seleccionado
    const DOMICILIO_SELECCIONADO = this.seleccionarDomiciliosDatos[0];
    this.domicilioSeleccionadoParaModificar = DOMICILIO_SELECCIONADO;

    if (this.elementoModalModificar) {
      const INSTANCIA_MODAL = new Modal(
        this.elementoModalModificar.nativeElement
      );
      INSTANCIA_MODAL.show();
    }
  }

  /**
   * Muestra el modal para gestionar información general de la empresa.
   * 
   * Reinicia el estado del componente agregar antes de mostrar el modal
   * y luego crea una instancia de modal de Bootstrap para mostrarlo.
   * Utiliza el elemento referenciado como elementoModalEmpresa.
   * 
   * @memberof DatosComunesComponent
   */
  agregarEmpresaPrincipales(): void {
    if (this.elementoModalEmpresa) {
      // Restablecer el estado del componente Agregar al abrir modal
      if (this.componenteAgregar) {
        this.componenteAgregar.resetModalState();
      }
      
      const INSTANCIA_MODAL = new Modal(
        this.elementoModalEmpresa.nativeElement
      );
      INSTANCIA_MODAL.show();
    }
  }

  /**
   * Muestra el modal para modificar un miembro de la empresa.
   * 
   * Valida que haya un miembro seleccionado antes de abrir el modal
   * y luego crea una instancia de modal de Bootstrap para mostrarlo.
   * 
   * @memberof DatosComunesComponent
   */
  agregarModificarMiembro(): void {
    // Validar que haya miembros seleccionados
    if (this.seleccionarListaSeccionSociosIC.length === 0) {
      this.abrirModal('Debe seleccionar un miembro para modificar.');
      return;
    }
    
    // Validar que solo haya un miembro seleccionado
    if (this.seleccionarListaSeccionSociosIC.length > 1) {
      this.abrirModal('Seleccione sólo un registro a modificar.');
      return;
    }

    // Obtener el miembro seleccionado
    const MIEMBRO_SELECCIONADO = this.seleccionarListaSeccionSociosIC[0];
    this.miembroSeleccionadoParaModificar = MIEMBRO_SELECCIONADO;

    if (this.modalModificarMiembro) {
      const INSTANCIA_MODAL = new Modal(
        this.modalModificarMiembro.nativeElement
      );
      INSTANCIA_MODAL.show();
    }
  }

  /**
   * Cierra el modal de modificar miembro.
   * 
   * Utiliza Bootstrap para obtener la instancia del modal y cerrarlo.
   * También maneja la limpieza del backdrop para evitar que quede visible.
   * 
   * @memberof DatosComunesComponent
   */
  cerrarModalModificarMiembro(): void {
    if (this.modalModificarMiembro) {
      const ELEMENTO_MODAL = this.modalModificarMiembro.nativeElement;
      let instanciaModal = Modal.getInstance(ELEMENTO_MODAL);
      
      // Si no hay instancia, crear una nueva
      if (!instanciaModal) {
        instanciaModal = new Modal(ELEMENTO_MODAL);
      }
      
      // Agregar listener para limpiar backdrop cuando se cierre completamente
      ELEMENTO_MODAL.addEventListener('hidden.bs.modal', () => {
        // Limpiar cualquier backdrop residual
        const BACKDROPS = document.querySelectorAll('.modal-backdrop');
        BACKDROPS.forEach(backdrop => backdrop.remove());
        
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
      }, { once: true });
      
      // Cerrar el modal
      instanciaModal.hide();
    }
  }

  /**
   * Maneja tanto la modificación como la adición de miembros de la empresa.
   * 
   * Si hay un miembro seleccionado (miembroSeleccionadoParaModificar), actualiza ese miembro.
   * Si no hay selección, agrega un nuevo miembro a la lista.
   * 
   * @param {SeccionSociosIC} miembroModificado - Datos del miembro modificado o nuevo
   * @memberof DatosComunesComponent
   */
  onMiembroModificado(miembroModificado: SeccionSociosIC): void {
    if (this.miembroSeleccionadoParaModificar) {
      // Modo modificación - hay un miembro seleccionado
      const INDICE_SELECCIONADO = this.listaSeccionSociosIC.findIndex(miembro => 
        miembro === this.miembroSeleccionadoParaModificar ||
        (miembro.nombre === this.miembroSeleccionadoParaModificar?.nombre &&
         miembro.rfc === this.miembroSeleccionadoParaModificar?.rfc)
      );
      
      if (INDICE_SELECCIONADO !== -1) {
        // Actualizar el miembro en la lista
        this.listaSeccionSociosIC[INDICE_SELECCIONADO] = miembroModificado;
        
        // Mantener el miembro modificado seleccionado para permitir acciones adicionales
        this.seleccionarListaSeccionSociosIC = [miembroModificado];
        this.miembroSeleccionadoParaModificar = null;
        
        // Mostrar mensaje de confirmación
        this.abrirModal('Miembro modificado exitosamente');
      }
    } else {
      // Modo agregar - no hay miembro seleccionado
      this.listaSeccionSociosIC = [...this.listaSeccionSociosIC, miembroModificado];
      
      // No seleccionar automáticamente - el usuario debe seleccionar manualmente para habilitar botones
      this.seleccionarListaSeccionSociosIC = [];
      
      // Resetear el formulario para la próxima adición
      this.miembroSeleccionadoParaModificar = null;
      
      // Mostrar mensaje de confirmación
      this.abrirModal('Datos guardados correctamente.');
    }
    
    // Actualizar el store con los datos modificados
    this.solicitud32604Store.actualizarListaSeccionSociosIC(this.listaSeccionSociosIC);
    
    // Forzar la actualización de la vista creando una nueva referencia del array
    this.listaSeccionSociosIC = [...this.listaSeccionSociosIC];
    
    // Forzar la detección de cambios para actualizar la tabla
    this.cdr.detectChanges();
  }

  /**
   * Actualiza la lista de miembros de la empresa con un nuevo registro recibido como evento.
   * 
   * Agrega el nuevo miembro a la lista existente, actualiza el estado global
   * en el store, crea un pedimento por defecto y muestra un mensaje de éxito
   * al usuario mediante un modal.
   * 
   * @param {SeccionSociosIC} evento - Datos del nuevo miembro de la empresa a agregar
   * @memberof DatosComunesComponent
   */
  eventoActualizarMiembro(evento: SeccionSociosIC): void {
    this.listaSeccionSociosIC = [...this.listaSeccionSociosIC, evento];
    this.solicitud32604Store.actualizarListaSeccionSociosIC(
      this.listaSeccionSociosIC
    );
    const PEDIMENTO_INICIAL = {
      patente: 0,
      pedimento: 0,
      aduana: 0,
      idTipoPedimento: 0,
      descTipoPedimento: 'Por evaluar',
      numero: '',
      comprobanteValor: '',
      pedimentoValidado: false,
    };
    
    // Mostrar notificación de éxito siguiendo el patrón 40402
    setTimeout(() => {
      this.alertaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'INFORMACION',
        modo: 'action',
        titulo: '',
        mensaje: 'Datos guardados correctamente',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.mostrarNotificacion = true;
    }, 100);
    
    this.pedimentos.push(PEDIMENTO_INICIAL);
  }

  /**
   * Muestra una notificación en forma de modal con el mensaje proporcionado.
   * 
   * Configura y muestra un modal de notificación con características específicas
   * como tipo de alerta, categoría de peligro y tiempo de espera. También
   * almacena el índice del elemento que se desea eliminar para uso posterior.
   * 
   * @param {string} mensaje - El mensaje a mostrar en el modal de notificación
   * @param {number} [i=0] - El índice del elemento a eliminar (opcional, por defecto 0)
   * @memberof DatosComunesComponent
   */
  abrirModal(mensaje: string, i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.elementoParaEliminar = i;
  }

  /**
   * Muestra una notificación en forma de modal con el mensaje proporcionado.
   * 
   * Configura y muestra un modal de notificación con características específicas
   * como tipo de alerta, categoría de peligro y tiempo de espera. Utiliza el
   * mensaje dinámico proporcionado como parámetro e incluye un icono de cierre.
   * 
   * @param {string} mensaje - El mensaje a mostrar en el modal de notificación
   * @param {number} [i=0] - El índice del elemento a eliminar (opcional, por defecto 0)
   * @memberof DatosComunesComponent
   */
  opcionModal(mensaje: string, i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.elementoParaEliminar = i;
  }

  /**
   * Cierra el modal de notificación.
   * 
   * Resetea la notificación actual para cerrar el modal y limpia cualquier
   * backdrop residual que pueda haber quedado visible.
   * 
   * @memberof DatosComunesComponent
   */
  cerrarModal(): void {
    this.nuevaNotificacion = {} as Notificacion;
    
    // Limpiar cualquier backdrop residual después de un pequeño delay
    setTimeout(() => {
      const BACKDROPS = document.querySelectorAll('.modal-backdrop');
      BACKDROPS.forEach(backdrop => backdrop.remove());
      
      // Restaurar el estado del body si fue modificado
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    }, 100);
  }

  /**
   * Cierra la notificación de éxito y limpia la alerta.
   * 
   * @memberof DatosComunesComponent
   */
  cerrarNotificacionExito(): void {
    this.mostrarNotificacion = false;
    this.alertaNotificacion = {} as Notificacion;
  }

  /**
   * Agrega un nuevo subcontratado a la lista y actualiza el estado global en el store.
   * 
   * Recibe los datos del subcontratado desde un evento, los agrega a la lista
   * existente de número de empleados y actualiza el estado en el store para
   * mantener la persistencia de los datos.
   * 
   * @param {NumeroDeEmpleados} evento - Datos del subcontratado a agregar
   * @memberof DatosComunesComponent
   */
  seccionSubcontratados(evento: NumeroDeEmpleados): void {
    this.numeroDeEmpleadosLista = [...this.numeroDeEmpleadosLista, evento];
    
    // Seleccionar automáticamente el subcontratado recién agregado para permitir acciones inmediatas
    this.seleccionarNumeroDeEmpleadosLista = [evento];
    
    this.solicitud32604Store.actualizarNumeroDeEmpleadosLista(
      this.numeroDeEmpleadosLista
    );
    
    // Mostrar notificación de éxito
    setTimeout(() => {
      this.alertaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'INFORMACION',
        modo: 'action',
        titulo: '',
        mensaje: 'Datos guardados correctamente',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.mostrarNotificacion = true;
    }, 100);
  }

  /**
   * Agrega una nueva instalación principal a la lista y actualiza el store.
   * 
   * Recibe los datos de la instalación desde un evento, los agrega a la lista
   * de domicilios, actualiza el estado en el store, crea un pedimento por defecto
   * y muestra un mensaje de confirmación al usuario.
   * 
   * @param {Domicilios} evento - Datos de la instalación principal a agregar
   * @memberof DatosComunesComponent
   */
  instalacionesPrincipales(evento: Domicilios): void {
    this.domiciliosDatos = [...this.domiciliosDatos, evento];
    
    // Seleccionar automáticamente el domicilio recién agregado para permitir acciones inmediatas
    this.seleccionarDomiciliosDatos = [evento];
    
    this.solicitud32604Store.actualizarDomiciliosDatos(this.domiciliosDatos);
    const PEDIMENTO_INICIAL = {
      patente: 0,
      pedimento: 0,
      aduana: 0,
      idTipoPedimento: 0,
      descTipoPedimento: 'Por evaluar',
      numero: '',
      comprobanteValor: '',
      pedimentoValidado: false,
    };
    
    // Mostrar notificación de éxito siguiendo el patrón 40402
    setTimeout(() => {
      this.alertaNotificacion = {
        tipoNotificacion: 'INFORMACION',
        categoria: 'INFORMACION',
        modo: 'action',
        titulo: '',
        mensaje: 'Datos guardados correctamente.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.mostrarNotificacion = true;
    }, 100);
    
    this.pedimentos.push(PEDIMENTO_INICIAL);
  }
  /**
   * Actualiza el valor del catálogo seleccionado en el estado global.
   * 
   * Recibe un elemento del catálogo y actualiza el campo `catseleccionados`
   * en el store con el ID del elemento seleccionado.
   * 
   * @param {Catalogo} valor - Elemento del catálogo seleccionado
   * @memberof DatosComunesComponent
   */
  actualizarCatseleccionados(valor: Catalogo): void {
    this.desplegablesInteractuados = true;
    this.solicitud32604Store.actualizarCatseleccionados(valor.id);
  }

  /**
   * Actualiza el servicio seleccionado en el estado global.
   * 
   * Recibe un elemento del catálogo correspondiente al servicio
   * y actualiza el campo `servicio` en el store con el ID del elemento.
   * 
   * @param {Catalogo} valor - Elemento del catálogo correspondiente al servicio
   * @memberof DatosComunesComponent
   */
  actualizarServicio(valor: Catalogo): void {
    this.desplegablesInteractuados = true;
    this.solicitud32604Store.actualizarServicio(valor.id);
  }

  /**
   * Marca los desplegables como interactuados.
   * 
   * Se ejecuta cuando el usuario hace clic en cualquiera de los desplegables
   * para habilitar la validación de selección requerida.
   * 
   * @memberof DatosComunesComponent
   */
  marcarDesplegablesComoInteractuados(): void {
    this.desplegablesInteractuados = true;
  }

  /**
   * Actualiza el campo '190' en el estado global.
   * 
   * Verifica las selecciones de radio buttons antes de actualizar
   * y luego almacena el valor en el store. Parte del sistema de
   * validación de campos de selección múltiple.
   * 
   * @param {string | number} valor - Valor numérico o de texto para el campo 190
   * @memberof DatosComunesComponent
   */
  actualizar190(valor: string | number): void {
    this.verificarSeleccionesRadio('190', valor);
    this.solicitud32604Store.actualizar190(valor);
  }

  /**
   * Actualiza el campo '191' en el estado global.
   * 
   * Realiza verificación de selecciones de radio buttons
   * y actualiza el estado en el store. Forma parte del
   * sistema de validación de campos interdependientes.
   * 
   * @param {string | number} valor - Valor numérico o de texto para el campo 191
   * @memberof DatosComunesComponent
   */
  actualizar191(valor: string | number): void {
    this.verificarSeleccionesRadio('191', valor);
    this.solicitud32604Store.actualizar191(valor);
  }

  /**
   * Actualiza el campo '199' en el estado global.
   * 
   * Almacena directamente el valor recibido en el store
   * sin verificaciones adicionales de radio buttons.
   * 
   * @param {string | number} valor - Valor numérico o de texto para el campo 199
   * @memberof DatosComunesComponent
   */
  actualizar199(valor: string | number): void {
    this.verificarSeleccionesRadio('199', valor);
    this.solicitud32604Store.actualizar199(valor);
  }

  /**
   * Actualiza el campo '200' en el estado global.
   * 
   * Almacena el valor recibido directamente en el store
   * para el campo identificado como '200'.
   * 
   * @param {string | number} valor - Valor numérico o de texto para el campo 200
   * @memberof DatosComunesComponent
   */
  actualizar200(valor: string | number): void {
    this.verificarSeleccionesRadio('200', valor);
    this.solicitud32604Store.actualizar200(valor);
  }

  /**
   * Actualiza el campo '201' en el estado global.
   * 
   * Almacena el valor recibido directamente en el store
   * para el campo identificado como '201'.
   * 
   * @param {string | number} valor - Valor numérico o de texto para el campo 201
   * @memberof DatosComunesComponent
   */
  actualizar201(valor: string | number): void {
    this.verificarSeleccionesRadio('201', valor);
    this.solicitud32604Store.actualizar201(valor);
  }

  /**
   * Actualiza el número de empleados ingresado.
   * 
   * Extrae el valor desde el evento de entrada del usuario
   * y lo almacena en el store para el campo de empleados.
   * 
   * @param {Event} valor - Evento de entrada del usuario con el valor del input
   * @memberof DatosComunesComponent
   */
  actualizarEmpleados(valor: Event): void {
    const VALOR_EMPLEADOS = (valor.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarEmpleados(VALOR_EMPLEADOS);
  }

  /**
   * Actualiza el valor del bimestre seleccionado en el estado global.
   * 
   * Recibe un elemento del catálogo de bimestres y actualiza
   * el campo correspondiente en el store con el ID seleccionado.
   * 
   * @param {Catalogo} valor - Elemento del catálogo correspondiente al bimestre
   * @memberof DatosComunesComponent
   */
  actualizarBimestre(valor: Catalogo): void {
    this.solicitud32604Store.actualizarBimestre(valor.id);
  }

  /**
   * Actualiza el campo '2034' en el estado global.
   * 
   * Almacena el valor recibido directamente en el store
   * para el campo identificado como '2034'.
   * 
   * @param {string | number} valor - Valor para el campo 2034
   * @memberof DatosComunesComponent
   */
  actualizar2034(valor: string | number): void {
    this.solicitud32604Store.actualizar2034(valor);
  }

  /**
   * Actualiza el campo '236' en el estado global.
   * 
   * Almacena el valor recibido directamente en el store
   * para el campo identificado como '236'.
   * 
   * @param {string | number} valor - Valor para el campo 236
   * @memberof DatosComunesComponent
   */
  actualizar236(valor: string | number): void {
    this.solicitud32604Store.actualizar236(valor);
  }

  /**
   * Actualiza el campo '237' en el estado global.
   * 
   * Almacena el valor recibido directamente en el store
   * para el campo identificado como '237'.
   * 
   * @param {string | number} valor - Valor para el campo 237
   * @memberof DatosComunesComponent
   */
  actualizar237(valor: string | number): void {
    this.solicitud32604Store.actualizar237(valor);
  }

  /**
   * Actualiza el campo '239' y, si el valor es 1, agrega un pedimento y muestra una advertencia.
   * 
   * Almacena el valor en el store y ejecuta lógica especial cuando el valor es 1.
   * En este caso, agrega un pedimento por defecto y muestra un modal con información
   * sobre los requisitos obligatorios para el Registro en el Esquema de Certificación de Empresas.
   * 
   * @param {string | number} valor - Valor para el campo 239
   * @memberof DatosComunesComponent
   */
  actualizar239(valor: string | number): void {
    this.solicitud32604Store.actualizar239(valor);
    if (valor === 1) {
      const PEDIMENTO_INICIAL = {
        patente: 0,
        pedimento: 0,
        aduana: 0,
        idTipoPedimento: 0,
        descTipoPedimento: 'Por evaluar',
        numero: '',
        comprobanteValor: '',
        pedimentoValidado: false,
      };
      this.abrirModal(
        'Es un requisito obligatorio para acceder a Registro en el Esquema de Certificacion de Empresas, de conformidad con la regla 7.1.1. de las RGCE.'
      );
      this.pedimentos.push(PEDIMENTO_INICIAL);
    }
  }

  /**
   * Actualiza el campo '240' en el estado global.
   * 
   * Almacena el valor recibido directamente en el store
   * para el campo identificado como '240'.
   * 
   * @param {string | number} valor - Valor para el campo 240
   * @memberof DatosComunesComponent
   */
  actualizar240(valor: string | number): void {
    this.solicitud32604Store.actualizar240(valor);
  }

  /**
   * Actualiza el campo '243' en el estado global.
   * 
   * Almacena el valor recibido directamente en el store
   * para el campo identificado como '243'.
   * 
   * @param {string | number} valor - Valor para el campo 243
   * @memberof DatosComunesComponent
   */
  actualizar243(valor: string | number): void {
    this.solicitud32604Store.actualizar243(valor);
  }

  /**
   * Actualiza el campo '244' en el estado global.
   * 
   * Almacena el valor recibido directamente en el store
   * para el campo identificado como '244'.
   * 
   * @param {string | number} valor - Valor para el campo 244
   * @memberof DatosComunesComponent
   */
  actualizar244(valor: string | number): void {
    this.verificarSeleccionesRadio('244', valor);
    this.solicitud32604Store.actualizar244(valor);
  }

  /**
   * Actualiza el campo '245' en el estado global.
   * 
   * Almacena el valor recibido directamente en el store
   * para el campo identificado como '245'.
   * 
   * @param {string | number} valor - Valor para el campo 245
   * @memberof DatosComunesComponent
   */
  actualizar245(valor: string | number): void {
    this.solicitud32604Store.actualizar245(valor);
  }

  /**
   * Actualiza el valor seleccionado en el campo "indique todos" en el estado global.
   * 
   * Recibe un elemento del catálogo correspondiente al campo "indique todos"
   * y actualiza el estado en el store con el ID del elemento seleccionado.
   * 
   * @param {Catalogo} valor - Elemento del catálogo correspondiente al campo "indique todos"
   * @memberof DatosComunesComponent
   */
  actualizarIndiqueTodos(valor: Catalogo): void {
    this.solicitud32604Store.actualizarIndiqueTodos(valor.id);
  }

  /**
   * Actualiza el campo '246' en el estado global.
   * 
   * Almacena el valor recibido directamente en el store
   * para el campo identificado como '246'.
   * 
   * @param {string | number} valor - Valor para el campo 246
   * @memberof DatosComunesComponent
   */
  actualizar246(valor: string | number): void {
    this.verificarSeleccionesRadio('246', valor);
    this.solicitud32604Store.actualizar246(valor);
  }

  /**
   * Actualiza el valor del archivo 1 desde un input file.
   * 
   * Extrae el valor del input de archivo desde el evento de cambio
   * y lo almacena en el store para el campo file1.
   * 
   * @param {Event} valor - Evento de cambio del input de archivo
   * @memberof DatosComunesComponent
   */
  actualizarFile1(valor: Event): void {
    const VALOR_ARCHIVO = (valor.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarFile1(VALOR_ARCHIVO);
  }

  /**
   * Actualiza el valor del archivo 2 desde un input file.
   * 
   * Extrae el valor del input de archivo desde el evento de cambio
   * y lo almacena en el store para el campo file2.
   * 
   * @param {Event} valor - Evento de cambio del input de archivo
   * @memberof DatosComunesComponent
   */
  actualizarFile2(valor: Event): void {
    const VALOR_ARCHIVO = (valor.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarFile2(VALOR_ARCHIVO);
  }

  /**
   * Lista de registros leídos del archivo Excel subido.
   * Limitado a máximo 6 registros por sección.
   */
  registrosExcelSubidos: RegistroExcel[] = [];

  /**
   * Texto formateado que muestra los registros del Excel para el campo de solo lectura.
   */
  textoRegistrosExcel: string = '';

  /**
   * Array para rastrear nombres de archivos subidos de extranjeros para evitar duplicados.
   */
  archivosExtranjerosSubidos: string[] = [];

  /**
   * Lista de registros de proveedores leídos del segundo archivo Excel.
   * Limitado a máximo 6 registros por sección.
   */
  registrosProveedoresExcel: RegistroExcel[] = [];

  /**
   * Texto formateado que muestra los registros de proveedores del Excel.
   */
  textoProveedoresExcel: string = '';

  /**
   * Array para rastrear nombres de archivos subidos de proveedores para evitar duplicados.
   */
  archivosProveedoresSubidos: string[] = [];

  /**
   * Límite máximo de registros permitidos por sección
   */
  readonly LIMITE_MAXIMO_REGISTROS = 6;

  /**
   * Contador de registros restantes permitidos para clientes/proveedores extranjeros
   */
  registrosRestantes: number = this.LIMITE_MAXIMO_REGISTROS;

  /**
   * Contador de registros restantes permitidos para proveedores nacionales
   */
  proveedoresRestantes: number = this.LIMITE_MAXIMO_REGISTROS;

  /**
   * Valida el formato del archivo Excel para Clientes y Proveedores en el Extranjero.
   * 
   * Verifica que el archivo seleccionado tenga el formato correcto (.xlsx o .xls)
   * antes de proceder con la anexión. Si el formato es incorrecto, muestra
   * un modal con mensaje de error.
   * 
   * @memberof DatosComunesComponent
   */
  validarYAnexarArchivoExtranjeros(): void {
    const ELEMENTO_INPUT_ARCHIVO = document.getElementById('archivoExtranjero') as HTMLInputElement;
    
    // Validar que se haya seleccionado un archivo
    if (!ELEMENTO_INPUT_ARCHIVO || !ELEMENTO_INPUT_ARCHIVO.files || ELEMENTO_INPUT_ARCHIVO.files.length === 0) {
      this.abrirModal('Error, No se ha seleccionado un archivo');
      return;
    }

    const ARCHIVO_SELECCIONADO = ELEMENTO_INPUT_ARCHIVO.files[0];
    const NOMBRE_ARCHIVO_MINUSCULA = ARCHIVO_SELECCIONADO.name.toLowerCase();

    // Verificar si el archivo ya fue subido (duplicado)
    if (this.archivosExtranjerosSubidos.includes(NOMBRE_ARCHIVO_MINUSCULA)) {
      this.abrirModal('Este archivo ya existe.');
      return;
    }

    // Verificar límite antes de procesar
    if (this.registrosExcelSubidos.length >= this.LIMITE_MAXIMO_REGISTROS) {
      this.abrirModal(`Ha alcanzado el límite máximo de ${this.LIMITE_MAXIMO_REGISTROS} archivos para Clientes y Proveedores en el Extranjero.`);
      return;
    }

    const ES_FORMATO_EXCEL_VALIDO = NOMBRE_ARCHIVO_MINUSCULA.endsWith('.xlsx') || NOMBRE_ARCHIVO_MINUSCULA.endsWith('.xls');

    // Validar formato del archivo
    if (!ES_FORMATO_EXCEL_VALIDO) {
      this.abrirModal('El formato del archivo es incorrecto.');
      return;
    }

    // Si el formato es válido, proceder con la lectura y anexión
    this.procesarAnexionArchivoExtranjeros(ARCHIVO_SELECCIONADO);
  }

  /**
   * Valida el formato del archivo Excel para Proveedores Nacionales.
   * 
   * Verifica que el archivo seleccionado tenga el formato correcto (.xlsx o .xls)
   * antes de proceder con la anexión. Si el formato es incorrecto, muestra
   * un modal con mensaje de error.
   * 
   * @memberof DatosComunesComponent
   */
  validarYAnexarArchivoProveedores(): void {
    const ELEMENTO_INPUT_ARCHIVO_PROVEEDORES = document.getElementById('archivoProveedores') as HTMLInputElement;
    
    // Validar que se haya seleccionado un archivo
    if (!ELEMENTO_INPUT_ARCHIVO_PROVEEDORES || !ELEMENTO_INPUT_ARCHIVO_PROVEEDORES.files || ELEMENTO_INPUT_ARCHIVO_PROVEEDORES.files.length === 0) {
      this.abrirModal('Error, No se ha seleccionado un archivo');
      return;
    }

    const ARCHIVO_PROVEEDORES_SELECCIONADO = ELEMENTO_INPUT_ARCHIVO_PROVEEDORES.files[0];
    const NOMBRE_ARCHIVO_PROVEEDORES_MINUSCULA = ARCHIVO_PROVEEDORES_SELECCIONADO.name.toLowerCase();

    // Verificar si el archivo ya fue subido (duplicado)
    if (this.archivosProveedoresSubidos.includes(NOMBRE_ARCHIVO_PROVEEDORES_MINUSCULA)) {
      this.abrirModal('Este archivo ya existe.');
      return;
    }

    // Verificar límite antes de procesar
    if (this.registrosProveedoresExcel.length >= this.LIMITE_MAXIMO_REGISTROS) {
      this.abrirModal(`Ha alcanzado el límite máximo de ${this.LIMITE_MAXIMO_REGISTROS} archivos para Proveedores.`);
      return;
    }

    const ES_FORMATO_EXCEL_PROVEEDORES_VALIDO = NOMBRE_ARCHIVO_PROVEEDORES_MINUSCULA.endsWith('.xlsx') || NOMBRE_ARCHIVO_PROVEEDORES_MINUSCULA.endsWith('.xls');

    // Validar formato del archivo
    if (!ES_FORMATO_EXCEL_PROVEEDORES_VALIDO) {
      this.abrirModal('El formato del archivo es incorrecto.');
      return;
    }

    // Si el formato es válido, proceder con la lectura y anexión
    this.procesarAnexionArchivoProveedores(ARCHIVO_PROVEEDORES_SELECCIONADO);
  }

  /**
   * Procesa la anexión del archivo Excel de Clientes y Proveedores en el Extranjero.
   * Lee el contenido del archivo Excel y extrae los registros.
   * 
   * @param {File} archivoExcelExtranjeros - El archivo Excel validado a procesar
   * @memberof DatosComunesComponent
   */
  private procesarAnexionArchivoExtranjeros(archivoExcelExtranjeros: File): void {
    const LECTOR_ARCHIVO = new FileReader();
    
    LECTOR_ARCHIVO.onload = (evento: ProgressEvent<FileReader>): void => {
      try {
        const DATOS_BINARIOS_ARCHIVO = evento.target?.result as ArrayBuffer;
        const LIBRO_TRABAJO_EXCEL = DatosComunesComponent.leerArchivoExcel(DATOS_BINARIOS_ARCHIVO);
        
        if (LIBRO_TRABAJO_EXCEL) {
          this.extraerRegistrosExcelExtranjeros(LIBRO_TRABAJO_EXCEL, archivoExcelExtranjeros.name);
          this.actualizarContadorRegistrosRestantes();
          this.actualizarCampoRegistrosExistentes();
          this.abrirModal(`El archivo se ha subido correctamente.`);
        }
      } catch (error) {
        this.abrirModal('Error al procesar el archivo Excel. Verifique el formato del archivo.');
      }
    };
    
    LECTOR_ARCHIVO.onerror = (): void => {
      this.abrirModal('Error al leer el archivo Excel de Clientes y Proveedores en el Extranjero.');
    };
    LECTOR_ARCHIVO.readAsArrayBuffer(archivoExcelExtranjeros);
  }

  /**
   * Procesa la anexión del archivo Excel de Proveedores.
   * Lee el contenido del archivo Excel y extrae los registros de proveedores.
   * 
   * @param {File} archivoExcelProveedores - El archivo Excel de proveedores validado a procesar
   * @memberof DatosComunesComponent
   */
  private procesarAnexionArchivoProveedores(archivoExcelProveedores: File): void {
    const LECTOR_ARCHIVO_PROVEEDORES = new FileReader();
    
    LECTOR_ARCHIVO_PROVEEDORES.onload = (evento: ProgressEvent<FileReader>): void => {
      try {
        const DATOS_BINARIOS_PROVEEDORES = evento.target?.result as ArrayBuffer;
        const LIBRO_TRABAJO_PROVEEDORES = DatosComunesComponent.leerArchivoExcel(DATOS_BINARIOS_PROVEEDORES);
        
        if (LIBRO_TRABAJO_PROVEEDORES) {
          this.extraerRegistrosProveedoresExcel(LIBRO_TRABAJO_PROVEEDORES, archivoExcelProveedores.name);
          this.actualizarContadorProveedoresRestantes();
          this.actualizarCampoProveedoresExistentes();
          this.abrirModal(`El archivo se ha subido correctamente.`);
        }
      } catch (error) {
        this.abrirModal('Error al procesar el archivo Excel de Proveedores. Verifique el formato del archivo.');
      }
    };
    
    LECTOR_ARCHIVO_PROVEEDORES.onerror = (): void => {
      this.abrirModal('Error al leer el archivo Excel de Proveedores.');
    };
    
    LECTOR_ARCHIVO_PROVEEDORES.readAsArrayBuffer(archivoExcelProveedores);
  }

  /**
   * Lee el archivo Excel usando una biblioteca de lectura de hojas de cálculo.
   * Esta es una implementación simplificada - en producción se recomendaría usar
   * una biblioteca como SheetJS (xlsx) para manejo completo de archivos Excel.
   * 
   * @param {ArrayBuffer} _datosBinariosArchivo - Datos binarios del archivo Excel
   * @returns {LibroTrabajoExcel | null} Objeto del libro de trabajo Excel o null si hay error
   */
  private static leerArchivoExcel(_datosBinariosArchivo: ArrayBuffer): LibroTrabajoExcel | null {
    // Implementación simplificada para demostración
    // En producción, usar biblioteca SheetJS (xlsx):
    // const workbook = XLSX.read(datosBinarios, { type: 'array' });
    // return workbook;
    
    // Para esta implementación, simularemos la lectura exitosa con nombres en español
    return {
      NombresHojas: ['HojaDatos'],
      Hojas: {
        'HojaDatos': {
          // Datos simulados para demostración
          '!range': { s: { c: 0, r: 0 }, e: { c: 2, r: 10 } }
        }
      }
    };
  }

  /**
   * Extrae los registros del archivo Excel de Clientes y Proveedores en el Extranjero.
   * Limita a máximo 6 registros por sección según requerimientos.
   * 
   * @param {LibroTrabajoExcel} _libroTrabajoExcelExtranjeros - Objeto del libro de trabajo Excel
   * @memberof DatosComunesComponent
   */
  private extraerRegistrosExcelExtranjeros(_libroTrabajoExcelExtranjeros: LibroTrabajoExcel, nombreArchivo: string): void {
    // Implementación simplificada para demostración
    // En producción, usar biblioteca SheetJS (xlsx):
    // const hojaDatos = libroTrabajo.Hojas[libroTrabajo.NombresHojas[0]];
    // const datosJson = XLSX.utils.sheet_to_json(hojaDatos);
    
    // Agregar el nombre del archivo a la lista de archivos subidos
    this.archivosExtranjerosSubidos.push(nombreArchivo.toLowerCase());
    
    // Simular extracción de un nuevo registro por archivo subido
    const SIGUIENTE_ID = this.registrosExcelSubidos.length + 1;
    const NUEVO_REGISTRO: RegistroExcel = {
      id: SIGUIENTE_ID,
      nombre: `Cliente/Proveedor Extranjero ${SIGUIENTE_ID}`,
      descripcion: `Registro extraído del archivo Excel - Archivo ${SIGUIENTE_ID}`
    };
    
    // Añadir el nuevo registro al array existente
    this.registrosExcelSubidos.push(NUEVO_REGISTRO);
  }

  /**
   * Extrae los registros del archivo Excel de Proveedores.
   * Limita a máximo 6 registros por sección según requerimientos.
   * 
   * @param {LibroTrabajoExcel} _libroTrabajoProveedores - Objeto del libro de trabajo Excel de proveedores
   * @memberof DatosComunesComponent
   */
  private extraerRegistrosProveedoresExcel(_libroTrabajoProveedores: LibroTrabajoExcel, nombreArchivo: string): void {
    // Implementación simplificada para demostración
    // En producción, usar biblioteca SheetJS (xlsx):
    // const hojaDatos = libroTrabajo.Hojas[libroTrabajo.NombresHojas[0]];
    // const datosJson = XLSX.utils.sheet_to_json(hojaDatos);
    
    // Agregar el nombre del archivo a la lista de archivos subidos
    this.archivosProveedoresSubidos.push(nombreArchivo.toLowerCase());
    
    // Simular extracción de un nuevo registro por archivo subido
    const SIGUIENTE_ID = this.registrosProveedoresExcel.length + 1;
    const NUEVO_REGISTRO: RegistroExcel = {
      id: SIGUIENTE_ID,
      nombre: `Proveedor Nacional ${SIGUIENTE_ID}`,
      descripcion: `RFC: ABC${SIGUIENTE_ID.toString().padStart(9, '0')} - Registro del archivo ${SIGUIENTE_ID}`
    };
    
    // Añadir el nuevo registro al array existente
    this.registrosProveedoresExcel.push(NUEVO_REGISTRO);
  }

  /**
   * Actualiza el contador de registros restantes permitidos.
   * 
   * @memberof DatosComunesComponent
   */
  private actualizarContadorRegistrosRestantes(): void {
    this.registrosRestantes = this.LIMITE_MAXIMO_REGISTROS - this.registrosExcelSubidos.length;
  }

  /**
   * Actualiza el contador de proveedores restantes permitidos.
   * 
   * @memberof DatosComunesComponent
   */
  private actualizarContadorProveedoresRestantes(): void {
    this.proveedoresRestantes = this.LIMITE_MAXIMO_REGISTROS - this.registrosProveedoresExcel.length;
  }

  /**
   * Actualiza el campo "Registros que existen actualmente" con los datos del Excel.
   * Este campo se mantiene como solo lectura según requerimientos.
   * 
   * @memberof DatosComunesComponent
   */
  private actualizarCampoRegistrosExistentes(): void {
    // Calcular el conteo restante para Clientes y Proveedores en el Extranjero
    const ARCHIVOS_SUBIDOS_EXTRANJEROS = this.registrosExcelSubidos.length;
    const RESTANTES_EXTRANJEROS = this.LIMITE_MAXIMO_REGISTROS - ARCHIVOS_SUBIDOS_EXTRANJEROS;
    
    // Mostrar vacío por defecto, solo mostrar conteo restante después de subir archivo
    const CONTEO_RESTANTE = ARCHIVOS_SUBIDOS_EXTRANJEROS > 0 ? RESTANTES_EXTRANJEROS.toString() : '';
    
    // Actualizar la propiedad local
    this.textoRegistrosExcel = CONTEO_RESTANTE;
    
    // Actualizar el campo actualmente1 que representa "Registros que existen actualmente" para extranjeros
    this.datosComunesForm.patchValue({
      actualmente1: CONTEO_RESTANTE
    });
    
    // Asegurar que el campo permanezca deshabilitado para que sea solo lectura
    this.datosComunesForm.get('actualmente1')?.disable();
    
    // Actualizar también el store para persistencia
    this.solicitud32604Store.actualizarActualmente1(CONTEO_RESTANTE);
  }

  /**
   * Actualiza el campo de registros de proveedores con los datos del Excel.
   * Este campo se mantiene como solo lectura según requerimientos.
   * 
   * @memberof DatosComunesComponent
   */
  private actualizarCampoProveedoresExistentes(): void {
    // Calcular el conteo restante para Proveedores Nacionales
    const ARCHIVOS_SUBIDOS_PROVEEDORES = this.registrosProveedoresExcel.length;
    const RESTANTES_PROVEEDORES = this.LIMITE_MAXIMO_REGISTROS - ARCHIVOS_SUBIDOS_PROVEEDORES;
    
    // Mostrar vacío por defecto, solo mostrar conteo restante después de subir archivo
    const CONTEO_PROVEEDORES_RESTANTE = ARCHIVOS_SUBIDOS_PROVEEDORES > 0 ? RESTANTES_PROVEEDORES.toString() : '';
    
    // Actualizar la propiedad local
    this.textoProveedoresExcel = CONTEO_PROVEEDORES_RESTANTE;
    
    // Actualizar el campo actualmente2 que representa "Registros que existen actualmente" para proveedores
    this.datosComunesForm.patchValue({
      actualmente2: CONTEO_PROVEEDORES_RESTANTE
    });
    
    // Asegurar que el campo permanezca deshabilitado para que sea solo lectura
    this.datosComunesForm.get('actualmente2')?.disable();
    
    // Actualizar también el store para persistencia
    this.solicitud32604Store.actualizarActualmente2(CONTEO_PROVEEDORES_RESTANTE);
  }

  /**
   * Limpia los registros del Excel de Clientes y Proveedores en el Extranjero.
   * Útil para cuando se necesita cargar un nuevo archivo.
   * 
   * @memberof DatosComunesComponent
   */
  limpiarRegistrosExcelExtranjeros(): void {
    // Limpiar arrays de registros extranjeros
    this.registrosExcelSubidos = [];
    this.textoRegistrosExcel = '';
    
    // Limpiar lista de archivos subidos para permitir subir los mismos archivos nuevamente
    this.archivosExtranjerosSubidos = [];
    
    // Resetear contador de registros restantes
    this.registrosRestantes = this.LIMITE_MAXIMO_REGISTROS;
    
    // Actualizar campo en el formulario
    this.actualizarCampoRegistrosExistentes();
    
    // Limpiar también el input de archivo
    const ELEMENTO_INPUT_ARCHIVO = document.getElementById('archivoExtranjero') as HTMLInputElement;
    if (ELEMENTO_INPUT_ARCHIVO) {
      ELEMENTO_INPUT_ARCHIVO.value = '';
    }
  }

  /**
   * Limpia los registros del Excel de Proveedores.
   * Útil para cuando se necesita cargar un nuevo archivo de proveedores.
   * 
   * @memberof DatosComunesComponent
   */
  limpiarRegistrosProveedores(): void {
    // Limpiar arrays de registros de proveedores
    this.registrosProveedoresExcel = [];
    this.textoProveedoresExcel = '';
    
    // Limpiar lista de archivos subidos para permitir subir los mismos archivos nuevamente
    this.archivosProveedoresSubidos = [];
    
    // Resetear contador de proveedores restantes
    this.proveedoresRestantes = this.LIMITE_MAXIMO_REGISTROS;
    
    // Actualizar campo en el formulario
    this.actualizarCampoProveedoresExistentes();
    
    // Limpiar también el input de archivo de proveedores
    const ELEMENTO_INPUT_ARCHIVO_PROVEEDORES = document.getElementById('archivoProveedores') as HTMLInputElement;
    if (ELEMENTO_INPUT_ARCHIVO_PROVEEDORES) {
      ELEMENTO_INPUT_ARCHIVO_PROVEEDORES.value = '';
    }
  }

  /**
   * Actualiza el campo '247' en el estado global.
   * 
   * Almacena el valor recibido directamente en el store
   * para el campo identificado como '247'.
   * 
   * @param {string | number} valor - Valor para el campo 247
   * @memberof DatosComunesComponent
   */
  actualizar247(valor: string | number): void {
    this.verificarSeleccionesRadio('247', valor);
    this.solicitud32604Store.actualizar247(valor);
  }

  /**
   * Actualiza el campo '248' en el estado global.
   * 
   * Almacena el valor recibido directamente en el store
   * para el campo identificado como '248'.
   * 
   * @param {string | number} valor - Valor para el campo 248
   * @memberof DatosComunesComponent
   */
  actualizar248(valor: string | number): void {
    this.verificarSeleccionesRadio('248', valor);
    this.solicitud32604Store.actualizar248(valor);
  }

  /**
   * Actualiza el valor del campo de identificación.
   * 
   * Extrae el valor del input desde el evento de cambio
   * y lo almacena en el store para el campo de identificación.
   * 
   * @param {Event} valor - Evento de cambio del input de identificación
   * @memberof DatosComunesComponent
   */
  actualizarIdentificacion(valor: Event): void {
    const VALOR_IDENTIFICACION = (valor.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarIdentificacion(VALOR_IDENTIFICACION);
  }

  /**
   * Actualiza el valor del lugar de radicación.
   * 
   * Extrae el valor del input desde el evento de cambio
   * y lo almacena en el store para el campo de lugar de radicación.
   * 
   * @param {Event} valor - Evento de cambio del input de lugar de radicación
   * @memberof DatosComunesComponent
   */
  actualizarLugarDeRadicacion(valor: Event): void {
    const VALOR_RADICACION = (valor.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarLugarDeRadicacion(VALOR_RADICACION);
  }

  /**
   * Valida y procesa el control de inventarios.
   * 
   * Verifica que el campo '249' esté seleccionado como 'Si' y que los campos obligatorios 
   * (identificacion y lugarDeRadicacion) tengan valores válidos antes de procesar los datos.
   * Si la validación falla, muestra un mensaje de error apropiado.
   * Si la validación es exitosa, agrega los datos a la tabla de inventarios y muestra un mensaje de éxito.
   * 
   * @memberof DatosComunesComponent
   */
  validarYProcesarControlInventarios(): void {
    const VALOR_249 = this.datosComunesForm.get('249')?.value;
    // Primero verificar si se ha seleccionado "Si" en el campo 249
    if (VALOR_249 !== 1 && VALOR_249 !== '1') {
      this.abrirModal('Debe seleccionar "Si" en la pregunta de control de inventarios antes de poder agregar datos.');
      return;
    }

    const IDENTIFICACION_CONTROL = this.datosComunesForm.get('identificacion');
    const LUGAR_RADICACION_CONTROL = this.datosComunesForm.get('lugarDeRadicacion');
    const IDENTIFICACION_VALUE = IDENTIFICACION_CONTROL?.value;
    const LUGAR_RADICACION_VALUE = LUGAR_RADICACION_CONTROL?.value;

    // Verificar que los campos tengan valores válidos (no vacíos o solo espacios)
    const CAMPOS_VACIOS = !IDENTIFICACION_VALUE?.trim() || !LUGAR_RADICACION_VALUE?.trim();

    // Verificar errores de patrón
    const IDENTIFICACION_INVALIDO = IDENTIFICACION_CONTROL?.invalid && (IDENTIFICACION_CONTROL?.errors?.['pattern'] || IDENTIFICACION_CONTROL?.errors?.['required']);
    const LUGAR_RADICACION_INVALIDO = LUGAR_RADICACION_CONTROL?.invalid && (LUGAR_RADICACION_CONTROL?.errors?.['pattern'] || LUGAR_RADICACION_CONTROL?.errors?.['required']);

    if (CAMPOS_VACIOS || IDENTIFICACION_INVALIDO || LUGAR_RADICACION_INVALIDO) {
      this.marcarCamposInventariosComoTocados();
      let mensaje = 'Debe capturar todos los datos marcados como obligatorios.';
      if (IDENTIFICACION_INVALIDO || LUGAR_RADICACION_INVALIDO) {
        mensaje = 'Debe capturar datos válidos en los campos requeridos.';
      }
      this.abrirModal(mensaje);
      return;
    }

    this.procesarDatosControlInventarios();
  }

  /**
   * Procesa los datos del control de inventarios.
   * 
   * Dependiendo del modo (agregar o modificar), crea un nuevo registro
   * o actualiza uno existente en la lista de inventarios.
   * 
   * @memberof DatosComunesComponent
   */
  private procesarDatosControlInventarios(): void {
    const DATOS_INVENTARIO = {
      nombre: this.datosComunesForm.get('identificacion')?.value || '',
      lugarRadicacion: this.datosComunesForm.get('lugarDeRadicacion')?.value || '',
      anexo24: 'Por determinar'
    };

    if (this.modoModificacionInventario && this.inventarioSeleccionadoParaModificar) {
      // Modo modificación: actualizar inventario existente
      const INDICE = this.inventariosDatos.findIndex(
        inventario => inventario.nombre === this.inventarioSeleccionadoParaModificar?.nombre &&
                     inventario.lugarRadicacion === this.inventarioSeleccionadoParaModificar?.lugarRadicacion
      );

      if (INDICE !== -1) {
        this.inventariosDatos[INDICE] = DATOS_INVENTARIO;
        this.inventariosDatos = [...this.inventariosDatos]; // Trigger change detection
      }

      this.abrirModal('Inventario modificado correctamente.');
      
      // Resetear modo de modificación
      this.modoModificacionInventario = false;
      this.inventarioSeleccionadoParaModificar = null;
      this.seleccionarInventarios = [];
    } else {
      // Modo agregar: añadir nuevo inventario
      this.inventariosDatos = [...this.inventariosDatos, DATOS_INVENTARIO];
      
      // Seleccionar automáticamente el inventario recién agregado
      this.seleccionarInventarios = [DATOS_INVENTARIO];
      
      this.abrirModal('Datos guardados correctamente.');
    }
    
    // Limpiar los campos después de procesar
    this.datosComunesForm.patchValue({
      identificacion: '',
      lugarDeRadicacion: ''
    });
    
    // Resetear el estado de validación de los campos
    this.datosComunesForm.get('identificacion')?.markAsUntouched();
    this.datosComunesForm.get('identificacion')?.markAsPristine();
    this.datosComunesForm.get('lugarDeRadicacion')?.markAsUntouched();
    this.datosComunesForm.get('lugarDeRadicacion')?.markAsPristine();
    
    // Deshabilitar campos si el radio button '249' no está en "Si"
    const VALOR_249 = this.datosComunesForm.get('249')?.value;
    if (VALOR_249 !== 1 && VALOR_249 !== '1') {
      this.datosComunesForm.get('identificacion')?.disable();
      this.datosComunesForm.get('lugarDeRadicacion')?.disable();
    }
  }

  /**
   * Marca los campos del control de inventarios como tocados.
   * 
   * Marca específicamente los campos de identificación y lugar de radicación
   * como tocados para que se muestren los mensajes de error de validación.
   * 
   * @memberof DatosComunesComponent
   */
  private marcarCamposInventariosComoTocados(): void {
    this.datosComunesForm.get('identificacion')?.markAsTouched();
    this.datosComunesForm.get('lugarDeRadicacion')?.markAsTouched();
  }

  /**
   * Inicia el proceso de modificación de un inventario seleccionado.
   * 
   * Valida que haya exactamente un inventario seleccionado, luego
   * abre el modal de modificación y popula los campos del formulario
   * con los datos del inventario seleccionado.
   * 
   * @memberof DatosComunesComponent
   */
  modificarInventario(): void {
    // Validar que haya inventarios seleccionados
    if (this.seleccionarInventarios.length === 0) {
      this.abrirModal('Debe seleccionar un inventario para modificar.');
      return;
    }
    
    // Validar que solo haya un inventario seleccionado
    if (this.seleccionarInventarios.length > 1) {
      this.abrirModal('Seleccione sólo un registro a modificar.');
      return;
    }

    // Verificar que el radio button '249' esté seleccionado como "Si"
    const VALOR_249 = this.datosComunesForm.get('249')?.value;
    if (VALOR_249 !== 1 && VALOR_249 !== '1') {
      this.abrirModal('Debe seleccionar "Si" en la pregunta de control de inventarios para poder modificar datos.');
      return;
    }

    // Obtener el inventario seleccionado
    const INVENTARIO_SELECCIONADO = this.seleccionarInventarios[0];
    this.inventarioSeleccionadoParaModificar = INVENTARIO_SELECCIONADO;

    // Poblar los campos del modal con los datos del inventario seleccionado
    this.inventarioModalForm.patchValue({
      identificacion: INVENTARIO_SELECCIONADO.nombre,
      lugarDeRadicacion: INVENTARIO_SELECCIONADO.lugarRadicacion
    });

    // Abrir el modal
    const MODAL = new Modal(this.modalModificarInventario.nativeElement);
    MODAL.show();
  }

  /**
   * Maneja la acción de aceptar en el modal de modificación de inventario.
   * 
   * Actualiza el inventario en la lista principal. El botón está deshabilitado
   * cuando el formulario no es válido, por lo que este método solo se ejecuta
   * cuando la validación es exitosa.
   * 
   * @memberof DatosComunesComponent
   */
  aceptarModalInventario(): void {
    // El botón está deshabilitado si el form no es válido, así que aquí solo procesamos datos válidos
    if (this.inventarioSeleccionadoParaModificar) {
      const VALORES_FORMULARIO = this.inventarioModalForm.value;
      
      // Buscar el inventario en la lista usando nombre y lugar de radicación
      const INDICE = this.inventariosDatos.findIndex(
        inventario => 
          inventario.nombre === this.inventarioSeleccionadoParaModificar?.nombre &&
          inventario.lugarRadicacion === this.inventarioSeleccionadoParaModificar?.lugarRadicacion
      );
      
      if (INDICE !== -1) {
        // Actualizar el inventario con los nuevos valores
        this.inventariosDatos[INDICE] = {
          ...this.inventariosDatos[INDICE],
          nombre: VALORES_FORMULARIO.identificacion,
          lugarRadicacion: VALORES_FORMULARIO.lugarDeRadicacion
        };
        
        // Trigger change detection
        this.inventariosDatos = [...this.inventariosDatos];
        this.cdr.detectChanges();
        
        // Cerrar el modal y resetear la selección
        const MODAL = Modal.getInstance(this.modalModificarInventario.nativeElement);
        if (MODAL) {
          MODAL.hide();
        }
        
        // Resetear el formulario del modal
        this.inventarioModalForm.reset();
        
        // Resetear las variables de estado después del éxito
        this.inventarioSeleccionadoParaModificar = null;
        this.seleccionarInventarios = [];
        
        // Mostrar notificación de éxito siguiendo el patrón 40402
        setTimeout(() => {
          this.alertaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'INFORMACION',
            modo: 'action',
            titulo: '',
            mensaje: 'Datos guardados correctamente',
            cerrar: true,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
          };
          this.mostrarNotificacion = true;
        }, 300);
      }
    }
  }

  /**
   * Maneja la acción de cancelar en el modal de modificación de inventario.
   * 
   * Cierra el modal y resetea solo el formulario, manteniendo la selección.
   * 
   * @memberof DatosComunesComponent
   */
  cancelarModalInventario(): void {
    // Cerrar el modal
    const MODAL = Modal.getInstance(this.modalModificarInventario.nativeElement);
    if (MODAL) {
      MODAL.hide();
    }
    
    // Resetear el formulario del modal
    this.inventarioModalForm.reset();
    
    // Limpiar solo las variables relacionadas con el modal
    // Mantener la selección de la tabla para permitir reintentos
    this.inventarioSeleccionadoParaModificar = null;
  }

  /**
   * Cancela el proceso de modificación de inventario.
   * 
   * Resetea el modo de modificación, limpia los campos del formulario
   * y vuelve al estado normal de agregar nuevos inventarios.
   * 
   * @memberof DatosComunesComponent
   */
  cancelarModificacionInventario(): void {
    // Resetear modo de modificación
    this.modoModificacionInventario = false;
    this.inventarioSeleccionadoParaModificar = null;
    this.seleccionarInventarios = [];

    // Limpiar los campos del formulario
    this.datosComunesForm.patchValue({
      identificacion: '',
      lugarDeRadicacion: ''
    });

    // Resetear el estado de validación de los campos
    this.datosComunesForm.get('identificacion')?.markAsUntouched();
    this.datosComunesForm.get('identificacion')?.markAsPristine();
    this.datosComunesForm.get('lugarDeRadicacion')?.markAsUntouched();
    this.datosComunesForm.get('lugarDeRadicacion')?.markAsPristine();

    // Configurar estado inicial de campos basado en el valor de '249'
    const VALOR_249 = this.datosComunesForm.get('249')?.value;
    if (VALOR_249 === 1 || VALOR_249 === '1' || VALOR_249 === 2 || VALOR_249 === '2') {
      // Si hay cualquier selección, habilitar los campos
      this.datosComunesForm.get('identificacion')?.enable();
      this.datosComunesForm.get('lugarDeRadicacion')?.enable();
    } else {
      // Si no hay selección, deshabilitar los campos
      this.datosComunesForm.get('identificacion')?.disable();
      this.datosComunesForm.get('lugarDeRadicacion')?.disable();
    }
  }

  /**
   * Actualiza el campo '249' en el estado global.
   * 
   * Almacena el valor recibido directamente en el store
   * para el campo identificado como '249'.
   * También habilita o deshabilita los campos 'identificacion' y 'lugarDeRadicacion'
   * basado en la selección (Si=1 habilita, No=2 deshabilita).
   * 
   * @param {string | number} valor - Valor para el campo 249
   * @memberof DatosComunesComponent
   */
  actualizar249(valor: string | number): void {
    this.verificarSeleccionesRadio('249', valor);
    this.solicitud32604Store.actualizar249(valor);
    
    // Habilitar o deshabilitar campos basado en la selección
    const IDENTIFICACION_CONTROL = this.datosComunesForm.get('identificacion');
    const LUGAR_DE_RADICACION_CONTROL = this.datosComunesForm.get('lugarDeRadicacion');
    
    if (valor === 1 || valor === '1' || valor === 2 || valor === '2') {
      // Si selecciona cualquier opción ("Si" o "No"), habilitar los campos
      IDENTIFICACION_CONTROL?.enable();
      LUGAR_DE_RADICACION_CONTROL?.enable();
    } else {
      // Si no ha seleccionado nada, deshabilitar los campos
      IDENTIFICACION_CONTROL?.disable();
      LUGAR_DE_RADICACION_CONTROL?.disable();
    }
  }

  /**
   * Actualiza el campo '250' en el estado global.
   * 
   * Verifica las selecciones de radio buttons antes de actualizar
   * y luego almacena el valor en el store para el campo '250'.
   * 
   * @param {string | number} valor - Valor para el campo 250
   * @memberof DatosComunesComponent
   */
  actualizar250(valor: string | number): void {
    this.verificarSeleccionesRadio('250', valor);
    this.solicitud32604Store.actualizar250(valor);
  }

  /**
   * Actualiza el campo '251' en el estado global.
   * 
   * Verifica las selecciones de radio buttons antes de actualizar
   * y luego almacena el valor en el store para el campo '251'.
   * 
   * @param {string | number} valor - Valor para el campo 251
   * @memberof DatosComunesComponent
   */
  actualizar251(valor: string | number): void {
    this.verificarSeleccionesRadio('251', valor);
    this.solicitud32604Store.actualizar251(valor);
  }

  /**
   * Verifica y segrega las selecciones de radio buttons sin modificar el componente hijo.
   * 
   * Analiza todos los campos de radio button del formulario, los categoriza
   * en afirmativos, negativos y pendientes, y luego procesa cada categoría
   * para validaciones adicionales y manejo de estado.
   * 
   * @private
   * @param {string} campo - Nombre del campo que se está actualizando
   * @param {string | number} valor - Nuevo valor para el campo especificado
   * @memberof DatosComunesComponent
   */
  private verificarSeleccionesRadio(campo: string, valor: string | number): void {
    const SELECCIONES = {
      '190': campo === '190' ? valor : this.datosComunesForm.get('190')?.value,
      '191': campo === '191' ? valor : this.datosComunesForm.get('191')?.value,
      '199': campo === '199' ? valor : this.datosComunesForm.get('199')?.value,
      '200': campo === '200' ? valor : this.datosComunesForm.get('200')?.value,
      '201': campo === '201' ? valor : this.datosComunesForm.get('201')?.value,
      '244': campo === '244' ? valor : this.datosComunesForm.get('244')?.value,
      '246': campo === '246' ? valor : this.datosComunesForm.get('246')?.value,
      '247': campo === '247' ? valor : this.datosComunesForm.get('247')?.value,
      '248': campo === '248' ? valor : this.datosComunesForm.get('248')?.value,
      '249': campo === '249' ? valor : this.datosComunesForm.get('249')?.value,
      '250': campo === '250' ? valor : this.datosComunesForm.get('250')?.value,
      '251': campo === '251' ? valor : this.datosComunesForm.get('251')?.value,
    };
    
    // Verificar condiciones específicas para mostrar el modal
    this.verificarCondicionesModal(SELECCIONES, campo);
    
    const SELECCIONES_AFIRMATIVAS = Object.entries(SELECCIONES)
      .filter(([, value]) => value === 1 || value === '1' || value === 'Si' || value === 'Sí')
      .map(([key]) => key);
    
    const SELECCIONES_NEGATIVAS = Object.entries(SELECCIONES)
      .filter(([, value]) => value === 2 || value === '2' || value === 'No')
      .map(([key]) => key);

    const SELECCIONES_PENDIENTES = Object.entries(SELECCIONES)
      .filter(([, value]) => value === null || value === undefined || value === '')
      .map(([key]) => key);

    this.procesarSelecciones(SELECCIONES_AFIRMATIVAS, SELECCIONES_NEGATIVAS, SELECCIONES_PENDIENTES);

    this.validarCamposRequeridos(SELECCIONES);
  }

  /**
   * Verifica las condiciones específicas para mostrar el modal.
   * 
   * Evalúa individualmente cada campo para mostrar modales específicos:
   * - Para campos 190, 191, 244: muestra modal cuando value = 2 ("No")
   * - Para campos 199, 200, 201: muestra modal cuando value = 1 ("Sí")
   * 
   * @private
   * @param {Record<string, string | number | null | undefined>} selecciones - Objeto con los valores actuales de todos los campos
   * @param {string} campoModificado - El campo específico que fue modificado
   * @memberof DatosComunesComponent
   */
  private verificarCondicionesModal(selecciones: Record<string, string | number | null | undefined>, campoModificado: string): void {
    // Solo verificar el campo que fue modificado
    this.verificarCondicionIndividual(campoModificado, selecciones[campoModificado]);
  }

  /**
   * Verifica la condición específica de un campo individual.
   * 
   * @private
   * @param {string} campo - El campo a verificar
   * @param {string | number | null | undefined} valor - El valor del campo
   * @memberof DatosComunesComponent
   */
  private verificarCondicionIndividual(campo: string, valor: string | number | null | undefined): void {
    // Campos que requieren "No" (value = 2)
    const CAMPOS_NO = ['190', '191', '246', '250'];

    // Campos que requieren "Sí" (value = 1)
    const CAMPOS_SI = ['199', '200', '201', '244', '247', '248', '249', '251'];

    const ES_NO = valor === 2 || valor === '2' || valor === 'No';
    const ES_SI = valor === 1 || valor === '1' || valor === 'Si' || valor === 'Sí';

    // Mostrar modal individual para cada campo que cumple su condición
    if (CAMPOS_NO.includes(campo) && ES_NO) {
      this.mostrarModalParaCampo(campo, 'No');
    } else if (CAMPOS_SI.includes(campo) && ES_SI) {
      this.mostrarModalParaCampo(campo, 'Sí');
    }
  }

  /**
   * Muestra el modal específico para un campo.
   * 
   * @private
   * @param {string} campo - El campo que activó el modal
   * @param {string} _valor - El valor seleccionado (no utilizado en el mensaje)
   * @memberof DatosComunesComponent
   */
  private mostrarModalParaCampo(campo: string, _valor: string): void {
    // Campos que usan el mensaje estándar de RGCE
    const CAMPOS_RGCE = ['190', '191', '199', '200', '201', '244', '246', '247', '248', '250', '251'];
    
    // Mensajes especiales para campos específicos
    const MENSAJES_ESPECIALES: Record<string, string> = {
      '249': 'Debe agregar por lo menos un control de inventarios.'
    };

    let mensaje: string;
    
    if (MENSAJES_ESPECIALES[campo]) {
      // Usar mensaje especial para campos específicos
      mensaje = MENSAJES_ESPECIALES[campo];
    } else if (CAMPOS_RGCE.includes(campo)) {
      // Usar mensaje estándar de RGCE para la mayoría de campos
      mensaje = 'Es un requisito obligatorio para acceder al Registro en el Esquema de Certificación de Empresas, de conformidad con la regla 7.1.1. de las RGCE.';
    } else {
      // Mensaje por defecto para campos no configurados
      mensaje = `Campo ${campo} cumple con los requisitos obligatorios.`;
    }

    this.opcionModal(mensaje);
  }

  /**
   * Detecta cambios en los campos críticos y actualiza valores anteriores.
   * 
   * @private
   * @param {Record<string, string | number | null | undefined>} selecciones - Valores actuales de los campos
   * @returns {boolean} True si ha habido cambios en los campos críticos
   */
  private detectarCambiosEnCamposCriticos(selecciones: Record<string, string | number | null | undefined>): boolean {
    const CAMPOS_CRITICOS = ['190', '191', '244', '199', '200', '201', '201', '246', '247', '248', '249', '250', '251'];
    const HA_HABIDO_CAMBIOS = CAMPOS_CRITICOS.some(campo => 
      this.valoresAnteriores[campo] !== selecciones[campo]
    );

    // Actualizar valores anteriores
    CAMPOS_CRITICOS.forEach(campo => {
      this.valoresAnteriores[campo] = selecciones[campo];
    });

    return HA_HABIDO_CAMBIOS;
  }

  /**
   * Procesa las selecciones segregadas para análisis adicional.
   * 
   * Maneja las diferentes categorías de selecciones (afirmativas, negativas, pendientes)
   * y ejecuta la lógica correspondiente para cada tipo. Incluye manejo especial
   * para campos pendientes que requieren validación.
   * 
   * @private
   * @param {string[]} afirmativas - Lista de campos con selecciones afirmativas
   * @param {string[]} negativas - Lista de campos con selecciones negativas  
   * @param {string[]} pendientes - Lista de campos pendientes de completar
   * @memberof DatosComunesComponent
   */
  private procesarSelecciones(afirmativas: string[], negativas: string[], pendientes: string[]): void {
    if (afirmativas.length > 0) {
      // Manejar selecciones afirmativas: podría actualizar el estado del componente si fuera necesario
      // Nota: Los métodos de almacenamiento aún no existen, por lo que manejamos los datos localmente.
    }
    if (negativas.length > 0) {
      // Manejar selecciones negativas: podría actualizar el estado del componente si fuera necesario
    }
    if (pendientes.length > 0) {
      // Manejar selecciones pendientes: podría mostrar mensajes de validación
      this.mostrarCamposPendientes(pendientes);
    }
  }

  /**
   * Muestra o maneja campos pendientes de completar.
   * 
   * Gestiona la visualización de campos que aún no han sido completados
   * por el usuario. Considera el estado de solo lectura del formulario
   * para determinar si mostrar validaciones o no.
   * 
   * @private
   * @param {string[]} _campos - Lista de nombres de campos pendientes
   * @memberof DatosComunesComponent
   */
  private mostrarCamposPendientes(_campos: string[]): void {
    if (this.esFormularioSoloLectura) {
      // No mostrar validación en modo de solo lectura
    } 
  }

  /**
   * Valida que todos los campos requeridos estén completados.
   * 
   * Verifica si todos los campos obligatorios del formulario han sido
   * completados por el usuario. Si todos están completos, ejecuta
   * la lógica de formulario completo.
   * 
   * @private
   * @param {Record<string, string | number | null | undefined>} selecciones - Objeto con los valores actuales de todos los campos
   * @memberof DatosComunesComponent
   */
  private validarCamposRequeridos(selecciones: Record<string, string | number | null | undefined>): void {
    const CAMPOS_REQUERIDOS = ['190', '191', '199', '200', '201', '244', '246', '247', '248', '249', '250', '251'];
    const CAMPOS_PENDIENTES = CAMPOS_REQUERIDOS.filter(campo => 
      selecciones[campo] === null || 
      selecciones[campo] === undefined || 
      selecciones[campo] === ''
    );

    if (CAMPOS_PENDIENTES.length === 0) {
      this.onFormularioCompleto();
    }
  }

  /**
   * Método llamado cuando todos los campos requeridos están completados.
   * 
   * Se ejecuta cuando la validación confirma que todos los campos
   * obligatorios han sido completados. Verifica la validez del formulario
   * y puede habilitar funcionalidades adicionales como el botón de envío.
   * 
   * @private
   * @memberof DatosComunesComponent
   */
  private onFormularioCompleto(): void {
    if (this.datosComunesForm.valid) {
      // El formulario está completo y válido.
    }
  }

  /**
   * Actualiza el valor del checkbox 1.
   * 
   * Extrae el estado checked del checkbox desde el evento
   * y lo almacena en el store para el campo checkbox1.
   * 
   * @param {Event} valor - Evento de cambio del checkbox
   * @memberof DatosComunesComponent
   */
  actualizarCheckbox1(valor: Event): void {
    const VALOR_CHECKBOX = (valor.target as HTMLInputElement).checked;
    this.solicitud32604Store.actualizarCheckbox1(VALOR_CHECKBOX);
  }

  /**
   * Actualiza el valor del checkbox 2.
   * 
   * Extrae el estado checked del checkbox desde el evento
   * y lo almacena en el store para el campo checkbox2.
   * 
   * @param {Event} valor - Evento de cambio del checkbox
   * @memberof DatosComunesComponent
   */
  actualizarCheckbox2(valor: Event): void {
    const VALOR_CHECKBOX = (valor.target as HTMLInputElement).checked;
    this.solicitud32604Store.actualizarCheckbox2(VALOR_CHECKBOX);
  }

  /**
   * Actualiza el valor del checkbox 3.
   * 
   * Extrae el estado checked del checkbox desde el evento
   * y lo almacena en el store para el campo checkbox3.
   * 
   * @param {Event} valor - Evento de cambio del checkbox
   * @memberof DatosComunesComponent
   */
  actualizarCheckbox3(valor: Event): void {
    const VALOR_CHECKBOX = (valor.target as HTMLInputElement).checked;
    this.solicitud32604Store.actualizarCheckbox3(VALOR_CHECKBOX);
  }

  /**
   * Actualiza el campo 'Actualmente2' en el estado global.
   * 
   * Extrae el valor del input desde el evento de cambio
   * y lo almacena en el store para el campo actualmente2.
   * 
   * @param {Event} valor - Evento de cambio del input
   * @memberof DatosComunesComponent
   */
  actualizarActualmente2(valor: Event): void {
    const VALOR_ACTUAL = (valor.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarActualmente2(VALOR_ACTUAL);
  }

  /**
   * Actualiza el campo 'Actualmente1' en el estado global.
   * 
   * Extrae el valor del input desde el evento de cambio
   * y lo almacena en el store para el campo actualmente1.
   * 
   * @param {Event} valor - Evento de cambio del input
   * @memberof DatosComunesComponent
   */
  actualizarActualmente1(valor: Event): void {
    const VALOR_ACTUAL = (valor.target as HTMLInputElement).value;
    this.solicitud32604Store.actualizarActualmente1(VALOR_ACTUAL);
  }

  /**
   * Guarda la selección de inventarios hecha por el usuario.
   * 
   * Recibe un array de inventarios seleccionados desde la tabla
   * y los almacena en la propiedad correspondiente para su
   * posterior procesamiento o eliminación.
   * 
   * @param {Inventarios[]} evento - Array de inventarios seleccionados por el usuario
   * @memberof DatosComunesComponent
   */
  seleccionarInventariosDatos(evento: Inventarios[]): void {
    this.seleccionarInventarios = evento;
  }

  /**
   * Elimina los inventarios seleccionados de la lista principal.
   * 
   * Itera sobre los inventarios seleccionados, busca cada uno en la lista
   * principal por nombre y los elimina. Utiliza el método filter para
   * crear un nuevo array sin los elementos seleccionados.
   * 
   * @memberof DatosComunesComponent
   */
  eliminarInventariosDatos(): void {
    if (this.seleccionarInventarios.length > 0) {
      const INVENTARIOS_ACTUALIZADOS = this.inventariosDatos.filter(inventario => 
        !this.seleccionarInventarios.some(seleccionado => seleccionado.nombre === inventario.nombre)
      );
      this.inventariosDatos = [...INVENTARIOS_ACTUALIZADOS];
      this.seleccionarInventarios = [];
      setTimeout(() => {
        this.alertaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'INFORMACION',
          modo: 'action',
          titulo: '',
          mensaje: 'Datos eliminados correctamente',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        this.mostrarNotificacion = true;
        setTimeout(() => {
          const BACKDROPS = document.querySelectorAll('.modal-backdrop');
          BACKDROPS.forEach(backdrop => backdrop.remove());
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('overflow');
          document.body.style.removeProperty('padding-right');
        }, 300);
      }, 100);
    }
  }

  /**
   * Guarda la selección de socios hecha por el usuario.
   * 
   * Almacena el array de socios IC seleccionados desde la tabla
   * en la propiedad correspondiente para operaciones posteriores
   * como modificación o eliminación.
   * 
   * @param {SeccionSociosIC[]} evento - Array de socios IC seleccionados
   * @memberof DatosComunesComponent
   */
  seleccionarlistaSeccionSociosIC(evento: SeccionSociosIC[]): void {
    this.seleccionarListaSeccionSociosIC = evento;
  }

  /**
   * Elimina los socios seleccionados de la lista principal.
   * 
   * Busca cada socio seleccionado en la lista principal por nombre
   * y los elimina utilizando splice. Esto permite remover múltiples
   * socios de forma segura del array principal.
   * 
   * @memberof DatosComunesComponent
   */
  eliminarlistaSeccionSociosIC(): void {
    if (this.seleccionarListaSeccionSociosIC.length > 0) {
      this.seleccionarListaSeccionSociosIC.forEach((elemento) => {
        const INDICE_SOCIO = this.listaSeccionSociosIC.findIndex(
          (inv) => inv.nombre === elemento.nombre
        );
        if (INDICE_SOCIO !== -1) {
          this.listaSeccionSociosIC.splice(INDICE_SOCIO, 1);
        }
      });
      this.seleccionarListaSeccionSociosIC = [];
      this.solicitud32604Store.actualizarListaSeccionSociosIC(this.listaSeccionSociosIC);
      this.listaSeccionSociosIC = [...this.listaSeccionSociosIC];
      this.cdr.detectChanges();
      setTimeout(() => {
        this.alertaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'INFORMACION',
          modo: 'action',
          titulo: '',
          mensaje: 'Datos eliminados correctamente',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        this.mostrarNotificacion = true;
        setTimeout(() => {
          const BACKDROPS = document.querySelectorAll('.modal-backdrop');
          BACKDROPS.forEach(backdrop => backdrop.remove());
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('overflow');
          document.body.style.removeProperty('padding-right');
        }, 300);
      }, 100);
    }
  }

  /**
   * Guarda la selección de domicilios hecha por el usuario.
   * 
   * Almacena el array de domicilios seleccionados desde la tabla
   * en la propiedad correspondiente para operaciones posteriores
   * como modificación o eliminación.
   * 
   * @param {Domicilios[]} evento - Array de domicilios seleccionados
   * @memberof DatosComunesComponent
   */
  seleccionarDomiciliosDato(evento: Domicilios[]): void {
    this.seleccionarDomiciliosDatos = evento;
  }

  /**
   * Elimina los domicilios seleccionados de la lista principal.
   * 
   * Busca cada domicilio seleccionado en la lista principal por tipo de instalación
   * y los elimina utilizando el método filter para crear un nuevo array.
   * Permite remover múltiples domicilios de forma segura del array principal.
   * 
   * @memberof DatosComunesComponent
   */
  eliminarDomiciliosDatos(): void {
    if (this.seleccionarDomiciliosDatos.length > 0) {
      const DOMICILIOS_ACTUALIZADOS = this.domiciliosDatos.filter(domicilio => 
        !this.seleccionarDomiciliosDatos.some(seleccionado => 
          seleccionado.tipoInstalacion === domicilio.tipoInstalacion
        )
      );
      this.domiciliosDatos = [...DOMICILIOS_ACTUALIZADOS];
      this.seleccionarDomiciliosDatos = [];
      setTimeout(() => {
        this.alertaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'INFORMACION',
          modo: 'action',
          titulo: '',
          mensaje: 'Datos Eliminados correctamente',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        this.mostrarNotificacion = true;
        setTimeout(() => {
          const BACKDROPS = document.querySelectorAll('.modal-backdrop');
          BACKDROPS.forEach(backdrop => backdrop.remove());
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('overflow');
          document.body.style.removeProperty('padding-right');
        }, 300);
      }, 100);
    }
  }

  /**
   * Guarda la selección de número de empleados hecha por el usuario.
   * 
   * Almacena el array de registros de número de empleados seleccionados
   * desde la tabla en la propiedad correspondiente para operaciones
   * posteriores como modificación o eliminación.
   * 
   * @param {NumeroDeEmpleados[]} evento - Array de registros de número de empleados seleccionados
   * @memberof DatosComunesComponent
   */
  seleccionarNumeroDeEmpleadosDato(evento: NumeroDeEmpleados[]): void {
    this.seleccionarNumeroDeEmpleadosLista = evento;
  }

  /**
   * Elimina los registros de número de empleados seleccionados.
   * 
   * Busca cada registro seleccionado en la lista principal por número de empleados
   * y los elimina utilizando splice. Permite remover múltiples registros
   * de forma segura del array principal.
   * 
   * @memberof DatosComunesComponent
   */
  eliminarNumeroDeEmpleadosDato(): void {
    if (this.seleccionarNumeroDeEmpleadosLista.length > 0) {
      this.seleccionarNumeroDeEmpleadosLista.forEach((elemento) => {
        const INDICE_EMPLEADO = this.numeroDeEmpleadosLista.findIndex(
          (inv) => inv.numeroDeEmpleados === elemento.numeroDeEmpleados
        );
        if (INDICE_EMPLEADO !== -1) {
          this.numeroDeEmpleadosLista.splice(INDICE_EMPLEADO, 1);
        }
      });
      this.seleccionarNumeroDeEmpleadosLista = [];
      this.solicitud32604Store.actualizarNumeroDeEmpleadosLista(this.numeroDeEmpleadosLista);
      this.numeroDeEmpleadosLista = [...this.numeroDeEmpleadosLista];
      this.cdr.detectChanges();
      setTimeout(() => {
        this.alertaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'INFORMACION',
          modo: 'action',
          titulo: '',
          mensaje: 'Registros de número de empleados eliminados correctamente.',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        this.mostrarNotificacion = true;
        setTimeout(() => {
          const BACKDROPS = document.querySelectorAll('.modal-backdrop');
          BACKDROPS.forEach(backdrop => backdrop.remove());
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('overflow');
          document.body.style.removeProperty('padding-right');
        }, 300);
      }, 100);
    }
  }
  /**
   * Maneja la confirmación de eliminación, mostrando una alerta de éxito y limpiando el modal/backdrop.
   * @param mensaje Mensaje de éxito a mostrar
   */


  /**
   * Maneja los datos seleccionados desde el componente agregar.
   * 
   * Recibe un array de instalaciones seleccionadas desde el componente
   * agregar, las agrega a la lista de domicilios, actualiza el store
   * y muestra un mensaje de confirmación al usuario.
   * 
   * @param {Instalaciones[]} datosSeleccionados - Array de datos seleccionados desde el componente agregar
   * @memberof DatosComunesComponent
   */
  onDatosSeleccionados(datosSeleccionados: Instalaciones[]): void {
    if (datosSeleccionados && datosSeleccionados.length > 0) {
      const DOMICILIOS_TRANSFORMADOS = datosSeleccionados.map(instalacion => ({
        instalacionPrincipal: 'No',
        cveTipoInstalacion: '',
        tipoInstalacion: 'Instalación comercial',
        cveEntidadFederativa: '',
        entidadFederativa: instalacion.entidadFederativa || '',
        cveDelegacionMunicipio: '',
        municipioDelegacion: instalacion.municipio || '',
        direccion: instalacion.coloniaCalleNumero || '',
        codigoPostal: instalacion.codigoPostal || '',
        registroSESAT: instalacion.registroAduana || '',
        procesoProductivo: 'Sí',
        acreditaInmueble: 'Sí',
        operacionesCExt: 'Sí',
        instalacionCtpat: 'No',
        instalacionPerfil: instalacion.instalacionPerfil || 'Comercial',
        instalacionPerfilRFE: instalacion.instalacionPerfilRFE || 'No aplica',
        instalacionPerfilAuto: instalacion.instalacionPerfilAuto || 'No aplica',
        instalacionPerfilFerro: instalacion.instalacionPerfilFerro || 'No aplica',
        instalacionPerfilRf: instalacion.instalacionPerfilRf || 'No aplica',
        instalacionPerfilMensajeria: instalacion.instalacionPerfilMensajeria || 'No aplica',
        instalacionPerfilAlmacen: instalacion.instalacionPerfilAlmacen || 'No aplica',
        noExterior: '',
        noInterior: '',
        cveColonia: '',
        calle: '',
        descCol: '',
        idRecinto: ''
      }));
      
      this.domiciliosDatos = [...this.domiciliosDatos, ...DOMICILIOS_TRANSFORMADOS];
      this.solicitud32604Store.actualizarDomiciliosDatos(this.domiciliosDatos);
      this.abrirModal('Domicilios agregados exitosamente');
    }
  }

  // Propiedades para manejar confirmaciones de eliminación
  accionConfirmarEliminar: string = '';

  /**
   * Muestra un modal de confirmación para eliminar domicilios usando lib-notificaciones.
   * 
   * @memberof DatosComunesComponent
   */
  confirmarEliminarDomicilios(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: '¿Desea eliminar el registro seleccionado?',
      cerrar: false,
      tiempoDeEspera: 0,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar'
    };
    this.accionConfirmarEliminar = 'domicilios';
  }

  /**
   * Muestra un modal de confirmación para eliminar inventarios usando lib-notificaciones.
   * 
   * @memberof DatosComunesComponent
   */
  confirmarEliminarInventarios(): void {
    // Se revocará para eliminar los registros múltiples.
    if (this.seleccionarInventarios && this.seleccionarInventarios.length !== 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'simple',
        titulo: '',
        mensaje: 'Seleccione un registro.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: ''
      };
      return;
    }
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Seguro que desea eliminar el registro seleccionado?',
      cerrar: false,
      tiempoDeEspera: 0,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar'
    };
    this.accionConfirmarEliminar = 'inventarios';
  }

  /**
   * Muestra un modal de confirmación para eliminar socios usando lib-notificaciones.
   * 
   * @memberof DatosComunesComponent
   */
  confirmarEliminarSocios(): void {
    // Se revocará para eliminar los registros múltiples.
    if (this.seleccionarListaSeccionSociosIC.length !== 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'simple',
        titulo: '',
        mensaje: 'Seleccione un registro.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: ''
      };
      return;
    }
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Confirma la eliminación.',
      cerrar: false,
      tiempoDeEspera: 0,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar'
    };
    this.accionConfirmarEliminar = 'socios';
  }

  /**
   * Maneja la respuesta de confirmación para las eliminaciones.
   * 
   * @param confirmar - True si el usuario confirma, false si cancela
   * @memberof DatosComunesComponent
   */
  manejarConfirmacionEliminacion(confirmar: boolean): void {
    if (confirmar) {
      const MOSTRAR_MENSAJE_ELIMINADO = ['domicilios', 'inventarios', 'socios'].includes(this.accionConfirmarEliminar);
      switch (this.accionConfirmarEliminar) {
        case 'domicilios':
          this.eliminarDomiciliosDatos();
          break;
        case 'inventarios':
          this.eliminarInventariosDatos();
          break;
        case 'socios':
          this.eliminarlistaSeccionSociosIC();
          break;
        default:
          break;
      }
      if (MOSTRAR_MENSAJE_ELIMINADO) {
        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'success',
          modo: 'simple',
          titulo: '',
          mensaje: 'Se han eliminado los datos correctamente.',
          cerrar: true,
          tiempoDeEspera: 3000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: ''
        };
        this.mostrarNotificacion = true;
      }
    }
    this.accionConfirmarEliminar = '';
    this.cerrarModal();
  }

  /**
   * Limpia y completa la señal de destrucción para evitar fugas de memoria.
   * 
   * Método del ciclo de vida que se ejecuta cuando el componente se destruye.
   * Emite un valor en el Subject destroy$ y lo completa para cancelar
   * automáticamente todas las suscripciones activas y prevenir memory leaks.
   * 
   * @memberof DatosComunesComponent
   * @implements {OnDestroy}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
