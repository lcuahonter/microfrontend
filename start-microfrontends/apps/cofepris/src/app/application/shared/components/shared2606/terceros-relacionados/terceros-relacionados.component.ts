import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertComponent,
  ConfiguracionColumna,
  ConsultaioQuery,
  MENSAJEDEALERTA,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@ng-mf/data-access-user';
import {
  AGREGAR_FACTURADOR_MODAL_TITULO,
  CONFIRMA_ELIMINACION,
  DATOS_ELIMINADOS_CORRECTAMENTE,
  MENSAJE_SIN_FILA_SELECCIONADA,
  MODIFICAR_FACTURADOR_MODAL_TITULO,
  OCULTAR_FABRICANTA,
  OCULTAR_FACTURADOR,
  OCULTAR_PROVEEDOR,
  PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR,
  PROCEDIMIENTOS_PARA_TEXTO_ADJUNTAR,

} from '../../../constantes/shared2606/datos-solicitud.enum';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  Destinatario,
  FABRICANTE_ENCABEZADO_DE_TABLA,
  FACTURADOR_ENCABEZADO_DE_TABLA,
  Fabricante,
  Facturador,
  MENSAJE_TABLA_OBLIGATORIA,
  PROVEEDOR_ENCABEZADO_DE_TABLA,
  Proveedor,
} from '../../../models/shared2606/terceros-relacionados.model';
import { Subject, map, takeUntil } from 'rxjs';
import { AgregarFabricanteComponent } from '../agregar-fabricante/agregar-fabricante.component';
import { AgregarFacturadorComponent } from '../agregar-facturador/agregar-facturador.component';
import { AgregarProveedorComponent } from '../agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { TercerosRelacionadosFebService } from '../../../services/shared2606/tereceros-relacionados-feb.service';
import { ToastrService } from 'ngx-toastr';

/**
 * @component TercerosRelacionadosComponent
 * @description Componente que muestra las tablas dinámicas de terceros relacionados: fabricantes,
 * destinatarios finales, proveedores y facturadores. Permite visualizar los datos almacenados
 * en el store y navegar a las secciones correspondientes para su edición o creación.
 */
@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    TablaDinamicaComponent,
    AlertComponent,
    NotificacionesComponent,
    AgregarFabricanteComponent,
    AgregarProveedorComponent,
    AgregarFacturadorComponent
  ],
  providers: [TercerosRelacionadosFebService, ToastrService],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.css',
})
export class TercerosRelacionadosComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Evento para abrir el modal de edición de fabricante solo cuando esVisible === true
   */
  @Output() fabricanteEventoModificarModal: EventEmitter<Fabricante[]> = new EventEmitter<Fabricante[]>();

  /**
   * Evento para abrir el modal de edición de destinatario final solo cuando esVisible === true
   */
  @Output() destinatarioEventoModificarModal: EventEmitter<Destinatario[]> = new EventEmitter<Destinatario[]>();
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
   * @event agregarFabricante
   * @description
   * Evento emitido cuando se solicita agregar un nuevo fabricante.
   * 
   * Este evento no envía ningún valor (void) y puede ser escuchado por componentes padres
   * para ejecutar la lógica correspondiente al agregar un fabricante relacionado.
   */
  @Output() agregarFabricante = new EventEmitter<void>();
  /**
   * @event agregarDestinatarioFinal
   * @description
   * Evento emitido cuando se solicita agregar un nuevo destinatario final.
   * Este evento no envía ningún valor (void) y puede ser escuchado por componentes padres
   * para ejecutar la lógica correspondiente al agregar un destinatario final relacionado.
   */
  @Output() agregarDestinatarioFinal = new EventEmitter<void>();
  /**
   * @property {string} infoAlert
   * Tipo de alerta visual mostrada en la interfaz.
   */
  public infoAlert = 'alert-info text-center';

  /**
   * @property {string} MENSAJE_TABLA_OBLIGATORIA
   * Constante de mensaje para indicar que la tabla es obligatoria.
   */
  MENSAJE_TABLA_OBLIGATORIA = MENSAJE_TABLA_OBLIGATORIA;

  /**
   * @property {ConfiguracionColumna<Fabricante>[]} configuracionTablaFabricante
   * Configuración de columnas para la tabla de fabricantes.
   */
  configuracionTablaFabricante: ConfiguracionColumna<Fabricante>[] =
    FABRICANTE_ENCABEZADO_DE_TABLA;

  /**
   * @property {ConfiguracionColumna<Proveedor>[]} configuracionTablaProveedor
   * Configuración de columnas para la tabla de proveedores.
   */
  configuracionTablaProveedor: ConfiguracionColumna<Proveedor>[] =
    PROVEEDOR_ENCABEZADO_DE_TABLA;

  /**
   * @property {ConfiguracionColumna<Facturador>[]} configuracionTablaFacturador
   * Configuración de columnas para la tabla de facturadores.
   */
  configuracionTablaFacturador: ConfiguracionColumna<Facturador>[] =
    FACTURADOR_ENCABEZADO_DE_TABLA;

  /**
   * @property {TablaSeleccion} tipoSeleccionTabla
   * Tipo de selección que utiliza la tabla dinámica (por ejemplo, checkbox).
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * @property {Fabricante[]} selectedTable
   * Almacena la fila seleccionada en la tabla de fabricantes.
   */
  seleccionTable: Fabricante[] = [];

  /**
   * @property {boolean} isAdjuntar
   * @description Indica si el componente está en modo de adjuntar documentos o archivos.
   * Cuando es `true`, muestra un mensaje específico para adjuntar elementos.
   * Cuando es `false`, muestra el mensaje de tabla obligatoria.
   * 
   * Este flag controla qué tipo de alerta se muestra al usuario:
   * - `false`: Muestra MENSAJE_TABLA_OBLIGATORIA
   * - `true`: Muestra TEXTO.ADJUNTAR (mensaje específico para adjuntar)
   * 
   * @default false
   */
  isAdjuntar: boolean = false;


  /**
   * Indica si el componente es visible o no.
   * @remarks
   * Esta propiedad controla la visibilidad del componente en la interfaz de usuario.
   */
  esVisible: boolean = false;



  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  public esFormularioSoloLectura: boolean = false;


  /**
   * Indica si el componente debe estar oculto o visible.
   * @input estaOculto - Valor booleano que determina la visibilidad del componente.
   */
  @Input() estaOculto: boolean = false;

  /**
   * Indica si el formulario del proveedor debe estar habilitado.
   * @input habilitarProveedor - Valor booleano que habilita o deshabilita la sección del proveedor.
   */
  public habilitarProveedor = true;

  /**
   * Indica si el formulario del facturador debe estar habilitado.
   * @input habilitarFacturador - Valor booleano que habilita o deshabilita la sección del facturador.
   */
  public habilitarFacturador = true;

  /**
   * @property {string[]} elementosRequeridos
   * Lista de elementos que son obligatorios en el formulario.
   */
  @Input() public elementosRequeridos!: string[];


  /**
   * @property {EventEmitter<Fabricante[]>} fabricanteSeleccionado
   * Evento que emite la lista de fabricantes seleccionados en la tabla.
   */
  @Output() fabricanteEventoModificar: EventEmitter<Fabricante[]> =
    new EventEmitter<Fabricante[]>();


  /**
   * @property {EventEmitter<Proveedor[]>} proveedorEventoModificar
   * Evento que emite la lista de proveedores seleccionados en la tabla de proveedores.
   * Se utiliza para notificar al componente padre cuando cambia la selección de proveedores.
   *
   * @decorator @Output
   */
  @Output() proveedorEventoModificar: EventEmitter<Proveedor[]> =
    new EventEmitter<Proveedor[]>();

  /**
   * @property {EventEmitter<Facturador[]>} facturadorEventoModificar
   * Evento que emite la lista de facturadores seleccionados en la tabla de facturadores.
   * Se utiliza para notificar al componente padre cuando cambia la selección de facturadores.
   *
   * @decorator @Output
   */
  @Output() facturadorEventoModificar: EventEmitter<Facturador[]> =
    new EventEmitter<Facturador[]>();

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

  /**
   * @property {EventEmitter<Fabricante[]>} fabricanteEliminar
   * Evento que emite la lista actualizada de fabricantes después de realizar una eliminación.
   * Se utiliza para notificar al componente padre que la tabla de fabricantes ha cambiado tras eliminar uno o varios elementos.
   *
   * @decorator @Output
   */
  @Output() fabricanteEliminar: EventEmitter<Fabricante[]> = new EventEmitter<
    Fabricante[]
  >();

  /**
   * @property {EventEmitter<Destinatario[]>} destinatarioEliminar
   * Evento que emite la lista actualizada de destinatarios finales después de realizar una eliminación.
   * Se utiliza para notificar al componente padre que la tabla de destinatarios ha cambiado tras eliminar uno o varios elementos.
   *
   * @decorator @Output
   */
  @Output() destinatarioEliminar: EventEmitter<Destinatario[]> =
    new EventEmitter<Destinatario[]>();

  /**
   * @property {EventEmitter<Proveedor[]>} proveedorEliminar
   * Evento que emite la lista actualizada de proveedores después de realizar una eliminación.
   * Se utiliza para notificar al componente padre que la tabla de proveedores ha cambiado tras eliminar uno o varios elementos.
   *
   * @decorator @Output
   */
  @Output() proveedorEliminar: EventEmitter<Proveedor[]> = new EventEmitter<
    Proveedor[]
  >();

  /**
   * @property {EventEmitter<Facturador[]>} facturadorEliminar
   * Evento que emite la lista actualizada de facturadores después de realizar una eliminación.
   * Se utiliza para notificar al componente padre que la tabla de facturadores ha cambiado tras eliminar uno o varios elementos.
   *
   * @decorator @Output
   */
  @Output() facturadorEliminar: EventEmitter<Facturador[]> = new EventEmitter<
    Facturador[]
  >();
  /**
   * Fabricante data selected for modification
   */
  public fabricanteSeleccionadoParaModificar: Fabricante[] = [];

  /**
  * @property proveedorSeleccionadoParaModificar
  * @description Lista que contiene el/los proveedor(es) seleccionados para realizar una modificación.
  * Se utiliza generalmente cuando el usuario edita un registro existente en la tabla de proveedores.
  *
  * @type {Proveedor[]}
  */
  public proveedorSeleccionadoParaModificar: Proveedor[] = [];
  /**
* Identificador del trámite asociado.
* Se recibe como propiedad de entrada desde el componente padre.
*/
  @Input() tramiteID: string = '';

  /**
   * @property {string} agregarFacturadorModalTitulo
   * Título del modal para agregar un facturador.
   */
  agregarFacturadorModalTitulo: string = '';
  
  /**
   * @property {string} modificarFacturadorModalTitulo
   * Título del modal para modificar un facturador.
   */
  modificarFacturadorModalTitulo: string = '';

  /**
   * Referencia al componente modal de Fabricante.
   * @viewChild('fabricanteModalComponent')
   */
  /**
   * Constructor del componente.
   *
   * Inyecta los servicios necesarios para la navegación, el manejo de rutas activas,
   * la consulta de datos del trámite y la consulta de información adicional.
   *
   * @param router Servicio de enrutamiento de Angular.
   * @param activatedRoute Servicio para acceder a la ruta activa actual.
   * @param tercerosService Servicio para consultar y gestionar los datos del trámite de terceros relacionados.
   * @param consultaioQuery Servicio para obtener datos de consulta de información adicional.
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tercerosService: TercerosRelacionadosFebService,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.seleccionarFilaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: MENSAJE_SIN_FILA_SELECCIONADA,
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.formularioDeshabilitado = seccionState.readonly;
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * @property {Fabricante[]} fabricanteTablaDatos
   * Datos de la tabla de fabricantes.
   */
  @Input() fabricanteTablaDatos: Fabricante[] = [];

  /**
   * @property {EventEmitter<Fabricante[]>} updateFabricanteTablaDatos
   * Evento que emite la lista actualizada de fabricantes.
   * Se utiliza para notificar al componente padre que la tabla de fabricantes ha cambiado.
   */
  @Output() updateFabricanteTablaDatos: EventEmitter<Fabricante[]> = new EventEmitter<Fabricante[]>();

  /**
  * @property {EventEmitter<Proveedor[]>} updateProveedorTablaDatos
  * Evento que emite la lista actualizada de proveedores.
  * Se utiliza para notificar al componente padre que la tabla de proveedores ha cambiado.
  */
  @Output() updateProveedorTablaDatos: EventEmitter<Proveedor[]> = new EventEmitter<Proveedor[]>();

  /**
   * @property {EventEmitter<Facturador[]>} updateFacturadorTablaDatos
   * Evento que emite la lista actualizada de facturadores.
   * Se utiliza para notificar al componente padre que la tabla de facturadores ha cambiado.
   */
  @Output() updateFacturadorTablaDatos: EventEmitter<Facturador[]> = new EventEmitter<Facturador[]>();

  /**
   * @property {Proveedor[]} proveedorTablaDatos
   * Datos de la tabla de proveedores.
   */
  @Input() proveedorTablaDatos: Proveedor[] = [];

  /**
   * @property {Facturador[]} facturadorTablaDatos
   * Datos de la tabla de facturadores.
   */
  @Input() facturadorTablaDatos: Facturador[] = [];

  /**
   * @property {string} rutaAcciones
   * Ruta relativa hacia la sección de acciones.
   */
  public fabricanteSeleccionadoDatos: Fabricante[] = [];

  /**
   * @property {Proveedor[]} proveedorSeleccionadoDatos
   * Almacena los proveedores seleccionados en la tabla de proveedores.
   * Permite gestionar la selección y acciones relacionadas con los proveedores.
   */
  public proveedorSeleccionadoDatos: Proveedor[] = [];

  /**
   * @property {Facturador[]} facturadorSeleccionadoDatos
   * Almacena los facturadores seleccionados en la tabla de facturadores.
   * Facilita la gestión y el procesamiento de los facturadores seleccionados.
   */
  public facturadorSeleccionadoDatos: Facturador[] = [];

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} eliminarAlerta
   */
  public eliminarAlerta: boolean = false;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} eliminarAlertaConfirm
   */
  public eliminarAlertaConfirm: boolean = false;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} eliminarFabricanteAlerta
   */
  public eliminarFabricanteAlerta: boolean = false;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} eliminarProveedorAlerta
   */
  public eliminarProveedorAlerta: boolean = false;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} eliminarFacturadorAlerta
   */
  public eliminarFacturadorAlerta: boolean = false;

  /**
   * Subject utilizado para destruir las suscripciones y evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();

  /**
 * @property isContinuarButtonClicked
 * @description Indica si el botón "Continuar" ha sido presionado.
 * Se utiliza para controlar validaciones o comportamientos dependientes de la acción del usuario.
 *
 * @type {boolean}
 */
  public isContinuarButtonClicked: boolean = false;

  /**
 * @property habilitarFabricante
 * @description Controla si la sección o formulario de fabricante debe estar habilitada.
 * Permite activar/desactivar funcionalidades según el flujo del trámite.
 *
 * @type {boolean}
 */
  habilitarFabricante: boolean = true;


  /**
   * property TEXTOS
   * description Textos de alerta utilizados en el componente.
   */
  public TEXTOS = MENSAJEDEALERTA;
  /**
 * Indicates if the Fabricante modal is currently open
 */
  public fabricanteModalAbierto: boolean = false;

  /**
   * @property proveedorModalAbierto
   * @description Indica si el modal de proveedor está abierto.
   * Se utiliza para controlar la visualización del componente modal.
   *
   * @type {boolean}
   */
  public proveedorModalAbierto: boolean = false;

  /**
 * @property facturadorModalAbierto
 * @description Indica si el modal de facturador está abierto.
 * Permite controlar cuándo mostrar u ocultar el modal de gestión de facturadores.
 *
 * @type {boolean}
 */
  public facturadorModalAbierto: boolean = false;

  /**
 * @property facturadorSeleccionadoParaModificar
 * @description Contiene la lista del facturador seleccionado para modificar.
 * Si está vacío, significa que no hay un facturador en edición.
 *
 * @type {Facturador[]}
 */
  public facturadorSeleccionadoParaModificar: Facturador[] = [];
  /**
   * Reference to the Fabricante modal element
   */
  @ViewChild('fabricanteModal') fabricanteModal!: ElementRef;

  @ViewChild('facturadorModal') facturadorModal!: ElementRef;

  /**
   * @method irAAcciones
   * @description Navega a la ruta relativa proporcionada desde el contexto actual.
   *
   * @param {string} accionesPath - Ruta relativa hacia la que se desea navegar.
   */
  irAAcciones(accionesPath: string, valor: boolean): void {
    this.router.navigate([accionesPath], {
      relativeTo: this.activatedRoute,
      queryParams: { update: valor },
    });
  }
  /**
   * @method ngOnInit
   * @description Hook que se ejecuta al inicializar el componente.
   * Crea el formulario, activa la escucha de cambios y sincroniza el estado con el input.
   */
  ngOnInit(): void {
    this.isAdjuntar = PROCEDIMIENTOS_PARA_TEXTO_ADJUNTAR.includes(
      this.idProcedimiento
    );
    this.habilitarFacturador = OCULTAR_FACTURADOR?.includes(this.idProcedimiento)
      ? true
      : false;
    this.habilitarProveedor = OCULTAR_PROVEEDOR?.includes(this.idProcedimiento)
      ? true
      : false;
    this.habilitarFabricante = OCULTAR_FABRICANTA?.includes(this.idProcedimiento)
      ? true
      : false;
    this.esVisible = PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR.includes(this.idProcedimiento);
    this.setFacturadorModalTitulos();
  }

  /**
   * @method ngOnChanges
   * @description Hook que se ejecuta cuando cambian las propiedades de entrada del componente.
   * Permite reaccionar a cambios en los inputs y actualizar el estado interno en consecuencia.
   *
   * @param {SimpleChanges} changes - Objeto que contiene los cambios en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idProcedimiento'] && this.idProcedimiento != null) {
      this.setFacturadorModalTitulos();
    }
  }

  /**
   * @method setFacturadorModalTitulos
   * @description
   * Establece los títulos de los modales de facturador según el procedimiento actual.
   */
  setFacturadorModalTitulos(): void {
    this.agregarFacturadorModalTitulo = AGREGAR_FACTURADOR_MODAL_TITULO.includes(this.idProcedimiento)
        ? 'Agregar facturador/consignatario' 
        : 'Agregar facturador'
    this.modificarFacturadorModalTitulo = MODIFICAR_FACTURADOR_MODAL_TITULO.includes(this.idProcedimiento)
        ? 'Modificar facturador/consignatario'
        : 'Modificar facturador'
  }

  /**
   * @method
   * @description
   * Emite el evento para agregar un nuevo fabricante.
   * 
   * @remarks
   * Este método se llama cuando el usuario desea agregar un fabricante relacionado.
   * 
   * @memberof TercerosRelacionadosComponent
   * @fires agregarFabricante
   */
  onAgregarFabricante(): void {
    this.fabricanteSeleccionadoParaModificar = [];
    this.abrirFabricanteModal();
  }

  /**
   * Emite el evento para agregar un nuevo fabricante.
   */
  onAgregarProveedorFinal(): void {
    this.proveedorSeleccionadoParaModificar = [];
    this.abrirProveedorModal();
  }
  /**
* Opens the Proveedor selection modal
*/
  abrirProveedorModal(): void {
    this.proveedorModalAbierto = true;
    const MODALELEMENT = document.getElementById('proveedorModal');
    if (MODALELEMENT) {
      const MODAL = new (window as unknown as { bootstrap: { Modal: new (element: HTMLElement) => { show(): void } } }).bootstrap.Modal(MODALELEMENT);
      MODAL.show();
    }
  }

  /**
   * @method onFacturadorAgregar
   * @description Limpia la selección de facturador y abre el modal para agregar uno nuevo.
   * Se utiliza cuando el usuario desea registrar un nuevo facturador.
   *
   * @returns {void}
   */
  onFacturadorAgregar(): void {
    this.facturadorSeleccionadoParaModificar = [];
    this.abrirFacturadorModal();
  }

  /**
   * Opens the Fabricante selection modal
   */
  abrirFabricanteModal(): void {
    this.fabricanteModalAbierto = true;
    const MODALELEMENT = document.getElementById('fabricanteModal');
    if (MODALELEMENT) {
      const MODAL = new (window as unknown as { bootstrap: { Modal: new (element: HTMLElement) => { show(): void } } }).bootstrap.Modal(MODALELEMENT);
      MODAL.show();
    }
  }

  /**
   * @method abrirFacturadorModal
   * @description Abre el modal correspondiente al facturador.  
   * Establece el estado interno para indicar que el modal está abierto  
   * y utiliza la instancia de Bootstrap Modal para mostrarlo en pantalla.
   *
   * @returns {void}
   */
  abrirFacturadorModal(): void {
    this.facturadorModalAbierto = true;
    const MODALELEMENT = document.getElementById('facturadorModal');
    if (MODALELEMENT) {
      const MODAL = new (window as unknown as { bootstrap: { Modal: new (element: HTMLElement) => { show(): void } } }).bootstrap.Modal(MODALELEMENT);
      MODAL.show();
    }
  }

  /**
   * Closes the Fabricante selection modal
   */
  cerrarFabricanteModal(): void {
    this.fabricanteModalAbierto = false;
    this.fabricanteSeleccionadoParaModificar = [];
    const MODAL_ELEMENT = document.getElementById('fabricanteModal');
    if (MODAL_ELEMENT) {
      const MODAL_INSTANCE = (window as unknown as { bootstrap: { Modal: { getInstance(element: HTMLElement): { hide(): void } | null } } }).bootstrap.Modal.getInstance(MODAL_ELEMENT);
      if (MODAL_INSTANCE) {
        MODAL_INSTANCE.hide();
      }
    }

  }
  /**
   * Cierra el modal de selección de Fabricante.
   */
  cerrarProveedorModal(): void {
    this.proveedorModalAbierto = false;
    this.proveedorSeleccionadoParaModificar = [];
    const MODAL_ELEMENT = document.getElementById('proveedorModal');
    if (MODAL_ELEMENT) {
      const MODAL_INSTANCE = (window as unknown as { bootstrap: { Modal: { getInstance(element: HTMLElement): { hide(): void } | null } } }).bootstrap.Modal.getInstance(MODAL_ELEMENT);
      if (MODAL_INSTANCE) {
        MODAL_INSTANCE.hide();
      }
    }

  }
  /**
   * Cierra el modal de selección de Fabricante.
    */
  onFabricanteUpdated(fabricantes: Fabricante[]): void {
    this.fabricanteTablaDatos = [...fabricantes];
    this.updateFabricanteTablaDatos.emit([...this.fabricanteTablaDatos]);
    this.fabricanteSeleccionadoDatos = [];
    this.fabricanteSeleccionadoParaModificar = [];
  }

  /**
   * @method onProveedorUpdated
   * @description Maneja la actualización de la lista de proveedores.  
   * Se actualiza la tabla interna, se emite el nuevo arreglo de proveedores  
   * y se reinician las selecciones actuales.
   *
   * @param {Proveedor[]} proveedores - Lista actualizada de proveedores.
   * @returns {void}
   */
  onProveedorUpdated(proveedores: Proveedor[]): void {
    this.proveedorTablaDatos = [...proveedores];
    this.updateProveedorTablaDatos.emit([...this.proveedorTablaDatos]);
    this.proveedorSeleccionadoDatos = [];
    this.proveedorSeleccionadoParaModificar = [];
  }

  /**
   * @method onFacturadorUpdated
   * @description Maneja la actualización de la lista de facturadores.  
   * Actualiza la tabla interna, emite la información actualizada  
   * y reinicia las selecciones relacionadas.
   *
   * @param {Facturador[]} facturadores - Lista actualizada de facturadores.
   * @returns {void}
   */
  onFacturadorUpdated(facturadores: Facturador[]): void {
    this.facturadorTablaDatos = [...facturadores];
    this.updateFacturadorTablaDatos.emit([...this.facturadorTablaDatos]);
    this.facturadorSeleccionadoDatos = [];
    this.facturadorSeleccionadoParaModificar = [];
  }

  /**
   * @method cerrarFacturadorModal
   * @description Cierra el modal de facturador, limpia las selecciones  
   * y utiliza la instancia de Bootstrap para ocultar el modal si existe.
   *
   * @returns {void}
   */
  cerrarFacturadorModal(): void {
    this.facturadorModalAbierto = false;
    this.facturadorSeleccionadoParaModificar = [];
    const MODAL_ELEMENT = document.getElementById('facturadorModal');
    if (MODAL_ELEMENT) {
      const MODAL_INSTANCE = (window as unknown as { bootstrap: { Modal: { getInstance(element: HTMLElement): { hide(): void } | null } } }).bootstrap.Modal.getInstance(MODAL_ELEMENT);
      if (MODAL_INSTANCE) {
        MODAL_INSTANCE.hide();
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
   * @method modificarFabricante
   * @description Emite el evento con la lista de fabricantes seleccionados y navega a la pantalla de edición/agregado de fabricante.
   * Si no hay fabricantes seleccionados, no realiza ninguna acción.
   *
   * @returns {void}
   */
  public modificarFabricante(): void {

    if (!this.fabricanteSeleccionadoDatos.length) {
      this.mostrarAlerta = true;
      return;
    }

    this.fabricanteSeleccionadoParaModificar = this.fabricanteSeleccionadoDatos.map(f => ({ ...f }));

    this.fabricanteModalAbierto = true;

    const MODALELEMENT = document.getElementById('fabricanteModal');
    if (MODALELEMENT) {
      const MODAL = new (window as unknown as { bootstrap: { Modal: new (element: HTMLElement) => { show(): void } } }).bootstrap.Modal(MODALELEMENT);
      MODAL.show();
    }
  }


  /**
   * @method modificarProveedor
   * @description Emite el evento con la lista de proveedores seleccionados y navega a la pantalla de edición/agregado de proveedor.
   * Si no hay proveedores seleccionados, no realiza ninguna acción.
   *
   * @returns {void}
   */
  modificarProveedor(): void {
    if (!this.proveedorSeleccionadoDatos.length) {
      this.mostrarAlerta = true;
      return;
    }
    this.proveedorSeleccionadoParaModificar = this.proveedorSeleccionadoDatos.map(d => ({ ...d }));
    this.proveedorModalAbierto = true;

    const MODALELEMENT = document.getElementById('proveedorModal');
    if (MODALELEMENT) {
      const MODAL = new (window as unknown as { bootstrap: { Modal: new (element: HTMLElement) => { show(): void } } }).bootstrap.Modal(MODALELEMENT);
      MODAL.show();
    }
  }

  /**
   * @method modificarFacturador
   * @description Emite el evento con la lista de facturadores seleccionados y navega a la pantalla de edición/agregado de facturador.
   * Si no hay facturadores seleccionados, no realiza ninguna acción.
   *
   * @returns {void}
   */
  modificarFacturador(): void {
    if (!this.facturadorSeleccionadoDatos.length) {
      this.mostrarAlerta = true;
      return;
    }

    this.facturadorSeleccionadoParaModificar = this.facturadorSeleccionadoDatos.map(f => ({ ...f }));
    this.facturadorModalAbierto = true;

    const MODALELEMENT = document.getElementById('facturadorModal');
    if (MODALELEMENT) {
      const MODAL = new (window as unknown as { bootstrap: { Modal: new (element: HTMLElement) => { show(): void } } }).bootstrap.Modal(MODALELEMENT);
      MODAL.show();
    }
  }

  /**
   * @method eliminarFabricante
   * @description Elimina los fabricantes seleccionados de la tabla de fabricantes y emite el evento con la nueva lista.
   * Si no hay datos en la tabla de fabricantes, no realiza ninguna acción.
   *
   * @returns {void}
   */
  public eliminarFabricante(): void {
    if (!this.fabricanteSeleccionadoDatos.length) {
      this.mostrarAlerta = true;
      return;
    }
    this.seleccionarFilaNotificacion.mensaje = CONFIRMA_ELIMINACION;
    this.seleccionarFilaNotificacion.txtBtnCancelar = 'Cancelar';
    this.eliminarFabricanteAlerta = true;
    this.eliminarAlerta = true;
  }

  /**
 * @method eliminarAlertaConfirmation
 * @description Cierra la alerta de eliminación y muestra confirmación si el usuario acepta.
 * @param {boolean} evento - Indica si el usuario confirmó la acción.
 * @returns {void}
 */
  eliminarAlertaConfirmation(evento: boolean): void {
    this.eliminarAlerta = false;
    if (evento) {
      this.seleccionarFilaNotificacion.mensaje = DATOS_ELIMINADOS_CORRECTAMENTE;
      this.seleccionarFilaNotificacion.txtBtnCancelar = '';
      this.eliminarAlertaConfirm = true;
    }
  }

  /**
 * @method eliminarDotosAlerta
 * @description Elimina fabricante, proveedor o facturador según la alerta activa.
 * @param {boolean} evento - Indica si el usuario confirmó la eliminación.
 * @returns {void}
 */
  eliminarDotosAlerta(evento: boolean): void {
    if (evento) {
      if (this.eliminarFabricanteAlerta) {
        this.fabricanteTablaDatos = this.fabricanteTablaDatos.filter(
          (fabricante: Fabricante) => {
            return !this.fabricanteSeleccionadoDatos.some(
              (idx2: Fabricante) => idx2.rfc === fabricante.rfc
            );
          }
        );
        this.fabricanteEliminar.emit(this.fabricanteTablaDatos);
        this.eliminarFabricanteAlerta = false;
      } else if (this.eliminarProveedorAlerta) {
        this.proveedorTablaDatos = this.proveedorTablaDatos.filter(
          (proveedor: Proveedor) => {
            return !this.proveedorSeleccionadoDatos.some((idx2: Proveedor) => {
              if (idx2.nombreRazonSocial !== '') {
                return idx2.nombreRazonSocial === proveedor.nombreRazonSocial;
              }
              return idx2.razonSocial === proveedor.razonSocial;
            });
          }
        );

        this.proveedorEliminar.emit(this.proveedorTablaDatos);
        this.eliminarProveedorAlerta = false;
      } else if (this.eliminarFacturadorAlerta) {
        this.facturadorTablaDatos = this.facturadorTablaDatos.filter(
          (facturador: Facturador) => {
            return !this.facturadorSeleccionadoDatos.some(
              (idx2: Facturador) => {
                if (idx2.nombreRazonSocial !== '') {
                  return (
                    idx2.nombreRazonSocial === facturador.nombreRazonSocial
                  );
                }
                return idx2.razonSocial === facturador.razonSocial;
              }
            );
          }
        );

        this.facturadorEliminar.emit(this.facturadorTablaDatos);
        this.eliminarFacturadorAlerta = false;
      }
    }
    this.eliminarFabricanteAlerta = false;
    this.eliminarFabricanteAlerta = false;
    this.eliminarProveedorAlerta = false;
    this.eliminarFacturadorAlerta = false;
    this.eliminarAlertaConfirm = false;
  }

  /**
   * @method eliminarProveedor
   * @description Elimina los proveedores seleccionados de la tabla de proveedores y emite el evento con la nueva lista.
   * Si no hay proveedores seleccionados, no realiza ninguna acción.
   *
   * @returns {void}
   */
  public eliminarProveedor(): void {
    if (!this.proveedorSeleccionadoDatos.length) {
      this.mostrarAlerta = true;
      return;
    }
    this.seleccionarFilaNotificacion.mensaje = CONFIRMA_ELIMINACION;
    this.seleccionarFilaNotificacion.txtBtnCancelar = 'Cancelar';
    this.eliminarProveedorAlerta = true;
    this.eliminarAlerta = true;
  }

  /**
   * @method eliminarFacturador
   * @description Elimina los facturadores seleccionados de la tabla de facturadores y emite el evento con la nueva lista.
   * Si no hay facturadores seleccionados, no realiza ninguna acción.
   *
   * @returns {void}
   */
  public eliminarFacturador(): void {
    if (!this.facturadorSeleccionadoDatos.length) {
      this.mostrarAlerta = true;
      return;
    }
    this.seleccionarFilaNotificacion.mensaje = CONFIRMA_ELIMINACION;
    this.seleccionarFilaNotificacion.txtBtnCancelar = 'Cancelar';
    this.eliminarFacturadorAlerta = true;
    this.eliminarAlerta = true;
  }

  /**
 * @description Obtiene el identificador del trámite convertido a número.
 * Útil cuando `tramiteID` se recibe como cadena y se requiere operar con él
 * como un valor numérico.
 *
 * @returns {number} El valor numérico equivalente de `tramiteID`.
 */
  get tramiteIDNumber(): number {
    return Number(this.tramiteID);
  }

/**  * Mapa que define los requisitos de validación para cada procedimiento.
  * Cada clave es un identificador de procedimiento y su valor es un arreglo
  * de secciones que deben ser validadas.
  */  
private readonly VALIDATION_REQUIREMENTS: {
  [procedimiento: number]: string[];
} = {  
  260603: ["facturador"],
  260604: ["facturador"],
  260605: ["destinatario"],
}

/**
 * Obtiene la lista de datos correspondiente a la sección especificada.
 * @param {('facturador' | 'destinatario')} section - La sección para la cual se desea obtener la lista de datos.
 * @returns {unknown[]} La lista de datos correspondiente a la sección.
 */
private getSectionList(section: 'facturador' | 'destinatario'): unknown[] {
  return {
    facturador: this.facturadorTablaDatos,
    destinatario: [],
  }[section] || [];
}

  /**
   * Valida el formulario de solicitud asegurando que los campos requeridos estén completos.
   *
   * @returns {boolean} Retorna `true` si el formulario es válido, `false` en caso contrario.
   */
  formularioSolicitudValidacion(): boolean {
    this.isContinuarButtonClicked = true;
  const REQUIRED_SECTIONS =
    this.VALIDATION_REQUIREMENTS[this.idProcedimiento] || [];

  let isValid = true;

  for (const SECTION of REQUIRED_SECTIONS) {
    const DATA_LIST = this.getSectionList(SECTION as "facturador" | "destinatario");

    if (!DATA_LIST || DATA_LIST.length === 0) {
      isValid = false;
    }
  }

  if (isValid) {
    return true;
  }

  
  return false;
}


  /**
   * Ciclo de vida `OnDestroy`.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
