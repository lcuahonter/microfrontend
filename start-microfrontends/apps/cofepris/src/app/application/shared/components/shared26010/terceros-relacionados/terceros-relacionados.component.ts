import { ActivatedRoute, Router } from "@angular/router";
import { AlertComponent, ConfiguracionColumna, ConsultaioQuery, MENSAJEDEALERTA, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TituloComponent } from "@libs/shared/data-access-user/src";
import { CONFIRMA_ELIMINACION, DATOS_ELIMINADOS_CORRECTAMENTE, MENSAJE_SIN_FILA_SELECCIONADA, OCULTAR_FACTURADOR, OCULTAR_PROVEEDOR, PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR, PROCEDIMIENTOS_PARA_TEXTO_ADJUNTAR } from "../constents/datos-solicitud.enum";
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import {DESTINATARIO_ENCABEZADO_DE_TABLA, Destinatario,FABRICANTE_ENCABEZADO_DE_TABLA,FACTURADOR_ENCABEZADO_DE_TABLA, Fabricante, Facturador, MENSAJE_TABLA_OBLIGATORIA,PROVEEDOR_ENCABEZADO_DE_TABLA, Proveedor} from "../models/terceros-relacionados.model";
import { Subject, map, takeUntil } from "rxjs";
import { AgregarDestinatarioFinalComponent } from "../agregar-destinatario-final/agregar-destinatario-final.component";
import { AgregarFabricanteComponent } from "../agregar-fabricante/agregar-fabricante.component";
import { AgregarFacturadorComponent } from "../agregar-facturador/agregar-facturador.component";
import { AgregarProveedorComponent } from "../agregar-proveedor/agregar-proveedor.component";
import { CommonModule } from "@angular/common";
import { TablaSeleccion } from "../models/datos-solicitud.model";
import { TercerosRelacionadosFebService } from "../services/tereceros-relacionados-feb.service";
import { ToastrService } from "ngx-toastr";



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
    AgregarDestinatarioFinalComponent,
    AgregarProveedorComponent,
    AgregarFacturadorComponent
  ],
  providers: [TercerosRelacionadosFebService, ToastrService],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.css',
})
export class TercerosRelacionadosComponent implements OnInit, OnDestroy {
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
   * @property {ConfiguracionColumna<Destinatario>[]} configuracionTablaDestinatarioFinal
   * Configuración de columnas para la tabla de destinatarios finales.
   */
  configuracionTablaDestinatarioFinal: ConfiguracionColumna<Destinatario>[] =
    DESTINATARIO_ENCABEZADO_DE_TABLA;

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
   * @property {EventEmitter<Destinatario[]>} destinatarioEventoModificar
   * Evento que emite la lista de destinatarios seleccionados en la tabla de destinatarios finales.
   * Se utiliza para notificar al componente padre cuando cambia la selección de destinatarios.
   *
   * @decorator @Output
   */
  @Output() destinatarioEventoModificar: EventEmitter<Destinatario[]> =
    new EventEmitter<Destinatario[]>();

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

    public proveedorSeleccionadoParaModificar: Proveedor[] = [];
    /**
 * Identificador del trámite asociado.
 * Se recibe como propiedad de entrada desde el componente padre.
 */
@Input() tramiteID: string = '';

/**
 * Referencia al componente modal de Fabricante.
 * @viewChild('fabricanteModalComponent')
 */
@ViewChild('destinatarioModalComponent') public destinatarioModalComponent!: AgregarDestinatarioFinalComponent;
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
   * @property {EventEmitter<Destinatario[]>} updateDestinatarioFinalTablaDatos
   * Evento que emite la lista actualizada de destinatarios finales.
   * Se utiliza para notificar al componente padre que la tabla de destinatarios ha cambiado.
   */
  @Output() updateDestinatarioFinalTablaDatos: EventEmitter<Destinatario[]> = new EventEmitter<Destinatario[]>();

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
   * @property {Destinatario[]} destinatarioFinalTablaDatos
   * Datos de la tabla de destinatarios finales.
   */
  @Input() destinatarioFinalTablaDatos: Destinatario[] = [];

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
   * @property {Destinatario[]} destinatarioSeleccionadoDatos
   * Almacena los destinatarios seleccionados en la tabla de destinatarios finales.
   * Se utiliza para gestionar la selección y posterior procesamiento de los destinatarios.
   */
  public destinatarioSeleccionadoDatos: Destinatario[] = [];

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
   * @property {boolean} eliminarDestinatarioAlerta
   */
  public eliminarDestinatarioAlerta: boolean = false;

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

  public isContinuarButtonClicked: boolean = false;

  /**
   * property TEXTOS
   * description Textos de alerta utilizados en el componente.
   */
  public TEXTOS = MENSAJEDEALERTA;   
    /**
   * Indicates if the Fabricante modal is currently open
   */
  public fabricanteModalAbierto: boolean = false;

  public destinatarioModalAbierto: boolean = false;

  public proveedorModalAbierto: boolean = false;
  public facturadorModalAbierto: boolean = false;
  /**
   * Destinatario data selected for modification
   */
  public destinatarioSeleccionadoParaModificar: Destinatario[] = [];

  public facturadorSeleccionadoParaModificar: Facturador[] = [];
  /**
   * Reference to the Fabricante modal element
   */
  @ViewChild('fabricanteModal') fabricanteModal!: ElementRef;

  /**
   * Reference to the Destinatario modal element
   */
  @ViewChild('destinatarioModal') destinatarioModal!: ElementRef;

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
    this.habilitarFacturador = OCULTAR_FACTURADOR.includes(this.idProcedimiento)
      ? false
      : true;
    this.habilitarProveedor = OCULTAR_PROVEEDOR.includes(this.idProcedimiento)
      ? false
      : true;

    this.esVisible =
      PROCEDIMIENTOS_PARA_OCULTAR_EL_BOTON_AGREGAR.includes(
        this.idProcedimiento
      );
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
   * Opens the Destinatario selection modal
   */
  abrirDestinatarioModal(): void {
    this.destinatarioModalAbierto = true;
    const MODALELEMENT = document.getElementById('destinatarioModal');
    if (MODALELEMENT) {
      const MODAL = new (window as unknown as { bootstrap: { Modal: new (element: HTMLElement) => { show(): void } } }).bootstrap.Modal(MODALELEMENT);
      MODAL.show();
    }
  }

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
   * Closes the Fabricante selection modal
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
 * Handles the fabricante table data update
  */
onFabricanteUpdated(fabricantes: Fabricante[]): void {
  this.fabricanteTablaDatos = [...fabricantes];
  this.updateFabricanteTablaDatos.emit([...this.fabricanteTablaDatos]);
  this.fabricanteSeleccionadoDatos = [];
  this.fabricanteSeleccionadoParaModificar = [];
  
}
/**
 * Handles the destinatario table data update
 */
onDestinatarioUpdated(destinatarios: Destinatario[]): void {
  this.destinatarioFinalTablaDatos = [...destinatarios];
  this.updateDestinatarioFinalTablaDatos.emit([...this.destinatarioFinalTablaDatos]);
  this.destinatarioSeleccionadoDatos = [];
  this.destinatarioSeleccionadoParaModificar = [];
}
onProveedorUpdated(proveedores: Proveedor[]): void {
  this.proveedorTablaDatos = [...proveedores];
  this.updateProveedorTablaDatos.emit([...this.proveedorTablaDatos]);
  this.proveedorSeleccionadoDatos = [];
  this.proveedorSeleccionadoParaModificar = [];
}

onFacturadorUpdated(facturadores: Facturador[]): void {
  this.facturadorTablaDatos = [...facturadores];
  this.updateFacturadorTablaDatos.emit([...this.facturadorTablaDatos]);
  this.facturadorSeleccionadoDatos = [];
  this.facturadorSeleccionadoParaModificar = [];
}
/**
 * Closes the Destinatario selection modal
 */
cerrarDestinatarioModal(): void {
  this.destinatarioModalAbierto = false;
  this.destinatarioSeleccionadoParaModificar = []; 
  
  const MODAL_ELEMENT = document.getElementById('destinatarioModal');
  if (MODAL_ELEMENT) {
    const MODAL_INSTANCE = (window as unknown as { bootstrap: { Modal: { getInstance(element: HTMLElement): { hide(): void } | null } } }).bootstrap.Modal.getInstance(MODAL_ELEMENT);
    if (MODAL_INSTANCE) {
      MODAL_INSTANCE.hide();
    }
  }
}
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
   * @method onAgregarDestinatarioFinal
   * @description
   * Emite el evento para abrir el modal de destinatario final.
   * Este método se llama cuando el usuario desea agregar un destinatario final relacionado.
   * @memberof TercerosRelacionadosComponent
   * @fires agregarDestinatarioFinal
   */
  onAgregarDestinatarioFinal(): void {
    this.destinatarioSeleccionadoParaModificar = [];
    this.abrirDestinatarioModal();
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
   * @method modificarDestinatario
   * @description Emite el evento with la lista de destinatarios seleccionados y navega a la pantalla de edición/agregado de destinatario.
   * Si no hay destinatarios seleccionados, no realiza ninguna acción.
   *
   * @returns {void}
   */
  modificarDestinatario(): void {
  if (!this.destinatarioSeleccionadoDatos.length) {
    this.mostrarAlerta = true;
    return;
  }
  
  this.destinatarioSeleccionadoParaModificar = this.destinatarioSeleccionadoDatos.map(d => ({ ...d }));
  this.destinatarioModalAbierto = true;

  const MODALELEMENT = document.getElementById('destinatarioModal');
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
   
    this.facturadorSeleccionadoParaModificar=this.facturadorSeleccionadoDatos.map(f => ({ ...f }));
    this.facturadorModalAbierto=true;
    
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

  eliminarAlertaConfirmation(evento: boolean): void {
    this.eliminarAlerta = false;
    if (evento) {
      this.seleccionarFilaNotificacion.mensaje = DATOS_ELIMINADOS_CORRECTAMENTE;
      this.seleccionarFilaNotificacion.txtBtnCancelar = '';
      this.eliminarAlertaConfirm = true;
    }
  }

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
      } else if (this.eliminarDestinatarioAlerta) {
        this.destinatarioFinalTablaDatos =
          this.destinatarioFinalTablaDatos.filter(
            (destinatario: Destinatario) => {
              return !this.destinatarioSeleccionadoDatos.some(
                (idx2: Destinatario) => idx2.rfc === destinatario.rfc
              );
            }
          );
        this.destinatarioEliminar.emit(this.destinatarioFinalTablaDatos);
        this.eliminarDestinatarioAlerta = false;
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
   * @method eliminarDestinatario
   * @description Elimina los destinatarios seleccionados de la tabla de destinatarios finales y emite el evento con la nueva lista.
   * Si no hay destinatarios seleccionados, no realiza ninguna acción.
   *
   * @returns {void}
   */
  public eliminarDestinatario(): void {
    if (!this.destinatarioSeleccionadoDatos.length) {
      this.mostrarAlerta = true;
      return;
    }
    this.seleccionarFilaNotificacion.mensaje = CONFIRMA_ELIMINACION;
    this.seleccionarFilaNotificacion.txtBtnCancelar = 'Cancelar';
    this.eliminarDestinatarioAlerta = true;
    this.eliminarAlerta = true;
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

  formularioSolicitudValidacion(): boolean {
    const IS_DESTINATARIO_REQUERIDO = !this.esCampoRequerido('DestinatarioFinal');
    
    let IS_DESTINATARIO_DATOS = true;
    
    if(IS_DESTINATARIO_REQUERIDO && this.destinatarioFinalTablaDatos.length === 0){

      IS_DESTINATARIO_DATOS = false;
    }
    
    if(IS_DESTINATARIO_DATOS === true){

return true;
    }
  this.isContinuarButtonClicked = true;
  return false;
   
  }
  get tramiteIDNumber(): number {
  return Number(this.tramiteID);
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
