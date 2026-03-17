import { CommonModule } from '@angular/common';

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { Subject, Subscription, map, takeUntil } from 'rxjs';

import {
  
  CatalogoSelectComponent,
  CategoriaMensaje,
  ConfiguracionColumna,
  CrossListLable,
  CrosslistComponent,
  InputRadioComponent,
  MercanciasDatos,
  Notificacion,
  NotificacionesComponent,
  REGEX_12_ENTEROS_10_DECIMALES,
  REGEX_PATRON_ALFANUMERICO,
  REGEX_POSTAL,
  REGEX_RFC,
  REGEX_SOLO_NUMEROS,
  REG_X,
  SOLO_REGEX_NUMEROS,
  ScianDatos,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  ValidacionesFormularioService,
  doDeepCopy,
  esValidArray,
  TipoNotificacionEnum,
} from '@libs/shared/data-access-user/src';

import {
  NicoInfo,
  ProductoTerminado,ProductoTerminadoDos
} from '@libs/shared/data-access-user/src/core/models/shared2603/certificados-licencias-permisos.model';

import { CatalogoServices, ConsultaioState } from '@ng-mf/data-access-user';

import {
  CONFIGURACION_MERCANCIAS_DATOS,
  CONFIGURACION_MERCANCIAS_DATOS_260304,
  CONFIGURACION_TABLA_PRODUCTO_TERMINADO,
  CONFIGURACION_TABLA_PRODUCTO_TERMINADO_260304,
  CONFIGURACION_TABLA_SCIAN,
  FraccionArancelaria,
  RADIO_OPCIONES,
} from '../../../constantes/shared2603/certificados-licencias-permisos.enum';
import { TEXTO_MANIFESTO_Y_DECLARACIONES } from '../../../constantes/shared2603/datos-solicitud.enum';

import {
  Solicitud2603State,
  Tramite2603Store,
} from '../../../estados/stores/2603/tramite2603.store';
import { Tramite2603Query } from '../../../estados/queries/2603/tramite2603.query';

import { CertificadosLicenciasPermisosService } from '../../../services/shared2603/certificados-licencias-permisos.service';
import { DatosSolicitudService } from '../../../services/shared2603/datos-solicitud.service';

import { Catalogo, DatosSolicitudFormState } from '../../../models/2603/datos-solicitud.model';

import CROSLISTA_DE_PAISES from '@libs/shared/theme/assets/json/2603/croslista_de_paises.json';
import PAISES_DE_ORIGEN from '@libs/shared/theme/assets/json/2603/paises_de_origen.json';
import USO_ESPECIFICO from '@libs/shared/theme/assets/json/2603/uso_especifico.json';
import { Shared2605Service } from '../../../services/shared2605/shared2605.service';
import { DomicilioFormState } from '../../../models/2603/terceros-relacionados.model';

/**
 * Interfaz que representa un tipo de producto.
 * @interface TipoDeProducto
 * @property {string} nombre - Nombre del producto.
 * @property {string} descripcion - Descripción del producto.
 * @property {number} codigo - Código identificador del producto.
 */
export interface TipoDeProducto {
  /** Identificador único del tipo de producto. */
  id: number;
  /** Nombre del producto. */
  nombre: string;
  /** Descripción del producto. */
  descripcion: string;
  /** Código identificador del producto. */
  codigo: number;
}
/**
 * Representa el tipo de producto en el proceso de solicitud.
 * @interface TipoDeProducto
 * @property {number} id - Identificador único del tipo de producto.
 * @property {string} descripcion - Descripción del tipo de producto.
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    CatalogoSelectComponent,
    CommonModule,
    CrosslistComponent,
    InputRadioComponent,
    NotificacionesComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    TituloComponent,
    TooltipModule
  ],
  providers: [BsModalService],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss',
})
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy, OnChanges {

  @Input() domicilioFormState!: DomicilioFormState;

  @Output() public updateDatosSolicitud : EventEmitter<any> = new EventEmitter<any>();

  @Output() formSectionValid = new EventEmitter<boolean>();
    /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

  isModifyClicked: boolean = false;

  /**
   * Notificador para destruir los observables al finalizar.
   */
  private destroy$ = new Subject<void>();
  /**
   * Controla la visibilidad del modal de notificación de confirmación.
   */
  public mostrarNotificacion: boolean = false;

  // Dedicated notification for fraccion arancelaria errors
  public mostrarNotificacionFraccion: boolean = false;
  public alertaNotificacionFraccion: Notificacion | null = null;

    /**
   * @property {Catalogo[]} estadoFisicoDatos
   * @description Catalog of physical states used to populate the form.
   */
    public estadoFisicoDatos!: Catalogo[];

    /**
   * Indica si se han recibido datos de respuesta.
   * @property {boolean} esDatosRespuesta
   * */
   /**
   * Indica si no hay fila seleccionada en la tabla C.
   * @type {boolean}
   */
   noRowSelectedTabla: boolean = false;

   esEliminarDetalle: boolean = false;

  /**
   * @event datasolicitudActualizar
   * Emite el estado actualizado del formulario cada vez que cambia su valor.
   */
  @Output() datasolicitudActualizar: EventEmitter<DatosSolicitudFormState> =
    new EventEmitter<DatosSolicitudFormState>();

  /**
   * @method actualizarStore
   * @description Emite el estado actual de todos los formularios al componente padre.
   */
  actualizarStore(): void {
    const VALORES_COMPLETOS: DatosSolicitudFormState = {
      ...this.denominacionForm?.getRawValue(),
      ...this.domicilioDeElstablecimientoForm?.getRawValue(),
      ...this.representanteLegalForm?.getRawValue(),
      ...this.scianForm?.getRawValue(),
      ...this.mercanciasForm?.getRawValue(),
      ...this.productoTerminadoForm?.getRawValue(),
      scianTablaDatos: this.scianTablaDatos,
      mercanciasTablaDatos: this.mercanciasTablaDatos,
      nicoTablaDatos: this.nicoTablaDatos
    };
    if (VALORES_COMPLETOS) {
      this.datasolicitudActualizar.emit(VALORES_COMPLETOS);
    }
  }  
  
  get descripcionFormControl(): FormControl {
    return this.scianForm.get('descripcion') as FormControl;
  }
  
  /**
   * Maneja el evento cuando se selecciona una clave SCIAN
   * @param selectedValue Valor seleccionado del catalogo-select
   */
  public claveSelecionada(selectedValue: Catalogo): void {
    this.scianForm.patchValue({
      descripcion: selectedValue.scianDescription
    });
  }
  
  /**
   * Indica si el usuario ha aceptado el modal de establecimiento.
   */
  public establecimientoSeleccionado: boolean = false;
  /**
   * Habilita los campos que deben ser editables tras aceptar en el modal de establecimiento.
   */
  public habilitarCamposEstablecimiento(): void {
  this.establecimientoSeleccionado = true;
    const CAMPOS_A_HABILITAR = [
      'denominacionRazon',
      'codigoPostal',
      'municipio',
      'localidad',
      'colonia',
      'calleYNumero',
      'correoElecronico',
      'rfc',
      'lada',
      'telefono',
      'nombreORazon',
      'apellidoPaterno',
      'apellidoMaterno'
    ];
    CAMPOS_A_HABILITAR.forEach(field => {
      const CONTROL = this.domicilioDeElstablecimientoForm.get(field);
      if (CONTROL) {
        CONTROL.enable();
        CONTROL.updateValueAndValidity();
      }
      const DENOMINACION_CONTROL = this.denominacionForm.get(field);
      if (DENOMINACION_CONTROL) {
        DENOMINACION_CONTROL.enable();
        DENOMINACION_CONTROL.updateValueAndValidity();
      }
    });
    // Siempre mantener estos campos deshabilitados en el formulario de representante legal
    ['nombreORazon', 'apellidoPaterno', 'apellidoMaterno'].forEach(campo => {
      const CONTROL_REPRESENTANTE = this.representanteLegalForm?.get(campo);
      if (CONTROL_REPRESENTANTE) {
        CONTROL_REPRESENTANTE.disable();
        CONTROL_REPRESENTANTE.updateValueAndValidity();
      }
    });
  }

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
    * Datos cargados para la tabla NICO.
    */
  nicoTablaDatos: NicoInfo[] = [];

  /**
    * @property {string} textoManifestoContenido
    * Texto que se muestra en el manifiesto y declaraciones.
    */
  public textoManifestoContenido = TEXTO_MANIFESTO_Y_DECLARACIONES;

  /**
* @property consultaState
* @description
* Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
*/
  /**
   * Indica si el formulario debe estar en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   * Valor por defecto: `false`.
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * Identificador del procedimiento actual.
   * Este valor se utiliza para mostrar o configurar secciones específicas del formulario según el trámite.
   */
  @Input() idProcedimiento!: number;

  /**
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
   */
  @Input() consultaState!: ConsultaioState;

/**
 * Evento de salida que emite el valor seleccionado del catálogo de tipo de producto.
 * 
 * @event selectionChange
 * @type {EventEmitter<TipoDeProducto>}
 * @description 
 * Se emite cada vez que el usuario selecciona un valor en el componente 
 * de selección de tipo de producto (`app-catalogo-select`).
 */  
  @Output() selectionChange = new EventEmitter<TipoDeProducto>();
  /**
   * Una referencia a la instancia del modal de Bootstrap.
   * Esto se utiliza para controlar e interactuar con el cuadro de diálogo modal.
   * @type {BsModalRef | undefined}
   */
  modalRef?: BsModalRef;
  /**
   * Indica si el modal está cerrado.
   * 
   * @type {boolean}
   * @default false
   */
  public esModalCerrado: boolean = false;
  /**
   * Una instancia de FormGroup utilizada para gestionar los controles del formulario
   * y la lógica de validación para la sección "Denominación" de la aplicación.
   */
  public denominacionForm!: FormGroup;
  /**
   * Representa el catálogo de estados utilizados en la aplicación.
   * Esta propiedad es un arreglo de objetos `Catalogo`, que probablemente
   * contienen información sobre diferentes estados u opciones disponibles
   * para la selección.
   */
  public estadoCatalogo!: Catalogo[];

  /**
   * Catálogo de regímenes disponibles para la selección.
   * Similar al patrón implementado en shared2606.
   */
  public regimenDatos: Catalogo[] = [];

  /**
   * Catálogo de aduanas de entrada disponibles para la selección.
   * Similar al patrón implementado in shared2606.
   */
  public adunasDeEntradasDatos: Catalogo[] = [];

  /**
   * Catálogo de clasificaciones de producto disponibles para la selección.
   * Similar al patrón implementado en shared2606.
   */
  public claveScianCatalogo: Catalogo[] = [];

  /**
   * Propiedades que deben ser deshabilitadas para el régimen según el procedimiento.
   */
  public disableRegimen: string[] = [];

  /**
   * Suscripción para gestionar múltiples observables y evitar fugas de memoria.
   */
  private subscription = new Subscription();

  /**
   * Un arreglo de objetos `ScianDatos` que representa los datos para la tabla SCIAN.
   * Esta propiedad se utiliza para almacenar y gestionar la información relacionada con la clasificación SCIAN.
   */
  public scianTablaDatos: ScianDatos[] = [];


    /**
     * Almacena los datos de la tabla de Producto Terminado.
     * Cada elemento representa un producto terminado agregado por el usuario.
     * Se utiliza para mostrar y gestionar los registros en la tabla correspondiente.
     * @type {ProductoTerminado[]}
     */
    public productoTerminadoTablaDatos: ProductoTerminado[] = [];

    /**
     * Almacena las filas seleccionadas actualmente en la tabla de Producto Terminado.
     * Se actualiza cada vez que el usuario selecciona o deselecciona productos en la tabla.
     * @type {ProductoTerminado[]}
     */
    selectedRowsProductoTerminado: ProductoTerminado[] = [];

    /**
     * Maneja el evento de cambio de selección en la tabla de Producto Terminado.
     * Actualiza la propiedad `selectedRowsProductoTerminado` con las filas seleccionadas.
     * @param {ProductoTerminado[]} selected - Las filas seleccionadas en la tabla.
     */
    onSeleccionChangeProductoTerminado(selected: ProductoTerminado[]): void {
      this.selectedRowsProductoTerminado = selected;
    }

/**
 * Maneja el evento de agregado o selección de registros en la tabla de producto terminado.
 * 
 * @param {ProductoTerminado[]} datos - Lista actualizada de registros seleccionados o agregados en la tabla.
 * @returns {void}
 * @description
 * Actualiza el control del formulario asociado (`productoTerminadoTablaDatos`),
 * marcándolo como tocado y validando su estado para reflejar cambios en la interfaz.
 */

  onProductoTerminadoRecordAdded(datos: ProductoTerminado[]): void {
    const CLAVE_PRODUCTO = Array.isArray(datos) && datos.length > 0 ? (datos[0] as { clave?: string })['clave'] : null;
    if (CLAVE_PRODUCTO && this.productoTerminadoForm.get('nombre')) {
      this.productoTerminadoForm.get('nombre')?.setValue(CLAVE_PRODUCTO);
    }
    this.productoTerminadoForm.get('productoTerminadoTablaDatos')?.setValue(datos);
    this.productoTerminadoForm.get('productoTerminadoTablaDatos')?.markAsTouched();
    this.productoTerminadoForm.get('productoTerminadoTablaDatos')?.updateValueAndValidity();
  }
  
    public productoTerminadoForm!: FormGroup;
  /**
   * Representa el tipo de selección de checkbox utilizado en the componente.
   * Esto se asigna desde la enumeración `TablaSeleccion.CHECKBOX`.
   */
  public checkbox = TablaSeleccion.CHECKBOX;
  /**
   * Representa una lista de entradas de catálogo del tipo `Catalogo`.
   * Esta propiedad se utiliza para almacenar y gestionar datos de catálogo
   * relevantes para la aplicación.
   */
  public claveCatalogo!: Catalogo[];
  /**
   * Representa el catálogo de regímenes disponibles para la selección.
   * Se espera que esta propiedad sea un arreglo de objetos `Catalogo`,
   * que contienen los detalles de cada régimen.
   */
  public regimenCatalogo!: Catalogo[];

  /**
   * @property {Catalogo[]} cantidadUmcDatos
   * @description Catalog of commercial unit quantities used to populate the form.
   */
  public cantidadUmcDatos!: Catalogo[];

  /**
   * Un arreglo que contiene datos relacionados con "mercancías".
   * Cada elemento en el arreglo es de tipo `MercanciasDatos`.
   * Esta propiedad se utiliza para gestionar y mostrar información sobre las mercancías
   * en el contexto de la aplicación.
   */
  public mercanciasTablaDatos: MercanciasDatos[] = [];
  /**
   * Representa el catálogo de tipos de productos disponibles para la selección.
   * Se espera que esta propiedad sea un arreglo de objetos `Catalogo`,
   * donde cada objeto contiene detalles sobre un tipo de producto específico.
   */
  public tipoDeProductoCatalogo!: Catalogo[];
  
  /**
   * Representa el catálogo de países de origen.
   * Esta propiedad contiene un arreglo de objetos `Catalogo`, que proporcionan
   * información sobre los países de los cuales provienen los elementos o entidades.
   */
  public paisDeProcedenciaCatalogo!: Catalogo[];

  /**
   * Catálogo de datos de países de destino.
   * Similar al patrón implementado en shared2606.
   */
  public paisDestinoDatos: Catalogo[] = [];

  /**
   * Un grupo de formularios que representa los detalles de la dirección del establecimiento.
   * Este formulario se utiliza para capturar y validar la información necesaria
   * relacionada con el domicilio del establecimiento.
   */
  public domicilioDeElstablecimientoForm!: FormGroup;
  /**
   * Una instancia de FormGroup que representa el formulario para el representante legal.
   * Este formulario se utiliza para capturar y gestionar los datos relacionados con el representante legal
   * en el proceso de la aplicación.
   */
  public representanteLegalForm!: FormGroup;
  /**
   * Representa el grupo de formulario reactivo para los datos del SCIAN (Sistema de Clasificación Industrial de América del Norte).
   * Este grupo de formulario se utiliza para gestionar y validar la entrada del usuario relacionada con la información del SCIAN en la aplicación.
   */
  public scianForm!: FormGroup;
  /**
   * Un grupo de formulario reactivo que gestiona los datos y la lógica de validación
   * para la sección de "mercancías" de la aplicación.
   */
  public mercanciasForm!: FormGroup;
  /**
   * Representa el estado de la Solicitud 2603.
   * Esta propiedad contiene los datos y la gestión del estado para la solicitud actual.
   * Se espera que se inicialice con una instancia de `Solicitud2603State`.
   */
  public solicitudState!: Solicitud2603State;
  /**
 * Lista de componentes Crosslist disponibles en la vista.
 */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
 * Lista de países para la selección de origen.
 */
  public crosListaDePaises = DatosDeLaSolicitudComponent.deepCopy(CROSLISTA_DE_PAISES);
  /**
   * Una propiedad pública que contiene la lista de países de origen.
   * Se inicializa con la constante `PAISES_DE_ORIGEN`.
   */
  // public seleccionarPais = DatosDeLaSolicitudComponent.deepCopy(PAISES_DE_ORIGEN);
  public seleccionarPais: string[] = [];

  seleccionadasPaisDeOrigenDatos: string[] = [];

  
  /**
   * Una propiedad pública que contiene las opciones de uso específico para la aplicación.
   * Se inicializa con la constante `USO_ESPECIFICO`.
   */
  public seleccionarUsoEspecifico = DatosDeLaSolicitudComponent.deepCopy(USO_ESPECIFICO);

  /**
   * @property {string[]} usoEspesificoDatos
   * Datos de uso específico obtenidos del catálogo de servicios.
   */
  public usoEspesificoDatos: string[] = [];
  /**
   * @property {string[]} seleccionadasUsoEspesificoDatos
   * Uso específico seleccionado en el crosslist.
   */
  public seleccionadasUsoEspesificoDatos: string[] = [];

  /**
   * @property {string[]} formaFarmaceuticaDatos
   * Datos de forma farmacéutica obtenidos del catálogo de servicios.
   */
  public formaFarmaceuticaDatos: string[] = [];

   /**
   * Datos de la tabla mercancías.
   */
   public seleccionados: MercanciasDatos[] = [];

  /**
   * @property {string[]} seleccionadasFormaFarmaceuticaDatos
   * Forma farmacéutica seleccionada en el crosslist.
   */
  public seleccionadasFormaFarmaceuticaDatos: string[] = [];

  /**
   * Lista de países para seleccionar el origen de la primera sección.
   */
  seleccionarOrigenDelPais = this.crosListaDePaises;
    /**
   * Configuración de la tabla de mercancías.
   * Especifica la estructura y opciones de la tabla para datos de mercancías.
   * Utiliza configuración específica para 260304 que excluye campos de piezas.
   */
  get configuracionMercancias(): ConfiguracionColumna<MercanciasDatos>[] {
    return this.idProcedimiento === 260304 ? CONFIGURACION_MERCANCIAS_DATOS_260304 : CONFIGURACION_MERCANCIAS_DATOS;
  }

  /**
   * Configuración de la tabla SCIAN.
   * Especifica la estructura y opciones de la tabla para datos SCIAN.
   */
  public configuracionTablaScian = CONFIGURACION_TABLA_SCIAN;

  /**
   * Configuración de la tabla de Producto Terminado.
   * Define las columnas y opciones para la tabla de productos terminados.
   */
  get configuracionTablaProductoTerminado(): ConfiguracionColumna<any>[] {
    return this.idProcedimiento === 260304 ? CONFIGURACION_TABLA_PRODUCTO_TERMINADO_260304 : CONFIGURACION_TABLA_PRODUCTO_TERMINADO;
  }
  
  /**
   * Etiqueta para el crosslist de Forma farmacéutica.
   */
  public formaFarmaceuticaLabel: CrossListLable = {
    tituluDeLaIzquierda: 'Forma farmacéutica',
    derecha: 'Forma(s) seleccionada(s)',
  };

  /**
   * Etiqueta para el crosslist de País de procedencia.
   */
    public paisDeProcedenciaLabel: CrossListLable = {
      tituluDeLaIzquierda: 'País de procedencia',
      derecha: 'País(es) seleccionados',
    };

  /**
   * Representa las etiquetas utilizadas para mostrar información sobre el país de origen.
   * 
   * @property tituluDeLaIzquierda - La etiqueta que se muestra en el lado izquierdo, indicando el país de origen.
   * @property derecha - La etiqueta que se muestra en el lado derecho, mostrando el país o países seleccionados.
   */
  public paisDeOrigenLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de origen',
    derecha: 'País(es) seleccionado(s)*:',
  };

  /**
   * Representa las etiquetas utilizadas para la sección "Uso específico" en la interfaz de usuario.
   * 
   * @property {string} tituluDeLaIzquierda - La etiqueta que se muestra en el lado izquierdo, indicando el uso específico.
   * @property {string} derecha - La etiqueta que se muestra en el lado derecho, mostrando los usos seleccionados con un asterisco para denotar un campo obligatorio.
   */
  public usoEspecificoLabel: CrossListLable = {
    tituluDeLaIzquierda: 'Uso específico',
    derecha: 'Uso específico seleccionado*:',
  }

  /**
  * Botones de acción para gestionar listas de países en la primera sección.
  */
  get paisDeProcedenciaBotons(): { btnNombre: string; class: string; funcion: () => void }[] {
    return this.getCrossListBtn(1);
  }

  /**
   * Botones de acción para gestionar listas de forma farmacéutica.
   */
  get formaFarmaceuticaBotons(): { btnNombre: string; class: string; funcion: () => void }[] {
    return this.getCrossListBtn(0);
  }

  /**
   * Una propiedad que inicializa una lista de botones para la sección "País de Origen"
   * invocando el método `getCrossListBtn`. Esto probablemente se utiliza para gestionar o
   * mostrar elementos interactivos relacionados con el país de origen en la aplicación.
   */
  get paisDeOrigenBotons(): { btnNombre: string; class: string; funcion: () => void }[] {
    return this.getCrossListBtn(1);
  }

  /**
   * Una propiedad que inicializa y almacena el resultado del método `getCrossListBtn`.
   * Esto probablemente se utiliza para gestionar o configurar botones específicos relacionados 
   * con la funcionalidad de "uso específico" dentro del componente.
   * 
   * Para procedimiento 260304, el crosslist "País de origen" está oculto, por lo que
   * "Uso específico" pasa del índice 2 al índice 1.
   */
  get usoEspecificoBotons(): { btnNombre: string; class: string; funcion: () => void }[] {
    return this.idProcedimiento === 260304 ? this.getCrossListBtn(1) : this.getCrossListBtn(2);
  }

  /**
   * Un objeto que representa el estado colapsable de varias secciones en el componente.
   * Cada propiedad corresponde a una sección específica e indica si está colapsada.
   * 
   * Propiedades:
   * - `formaFarmaceuticaColapsable`: Indica si la sección "Forma Farmacéutica" está colapsada.
   * - `paisDeOrigenColapsable`: Indica si la sección "País de Origen" está colapsada.
   * - `usoEspecificoColapsable`: Indica si la sección "Uso Específico" está colapsada.
   */
  public colapsableObj = {
    formaFarmaceuticaColapsable: false,
    paisDeOrigenColapsable: false,
    usoEspecificoColapsable: false,
  };

  /**
   * Notificador para destruir los observables al finalizar.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Modelo para la opción de tipo sí/no representado como radio button */
  public sinoOpciones = RADIO_OPCIONES;

  /**
   * Bandera que indica si se debe mostrar el campo "Especifique".
   * 
   * @type {boolean}
   * @default false
   * @description 
   * Se activa únicamente cuando el usuario selecciona un tipo de producto 
   * con identificador igual a `2`. En caso contrario, el campo se oculta.
   */
  mostrarEspecifique = false;

  /**
   * Devuelve todos los valores del formulario de representante legal, incluyendo los campos deshabilitados.
   */
  public getRepresentanteLegalFormData(): Record<string, unknown> {
    return this.representanteLegalForm.getRawValue() as Record<string, unknown>;
  }

  public mostrarErroresRepresentante = {
    rfc:false,
    nombre: false,
    apellidoPaterno: false,
  };

  public nuevaNotificacion!: Notificacion;

  /**
   * Constructor para el componente DatosDeLaSolicitudComponent.
   */
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private certificadosLicenciasSvc: CertificadosLicenciasPermisosService,
    public tramite2603Store: Tramite2603Store,
    public tramite2603Query: Tramite2603Query,
    private validacionesService: ValidacionesFormularioService,
    private catalogoService: CatalogoServices,
    private datosSolicitudService: DatosSolicitudService,
    private sharedSvc: Shared2605Service,
    
  ) {
    this.esFormularioSoloLectura = this.consultaState?.readonly || false;
  }

  /**
   * Método del ciclo de vida Angular que se ejecuta tras la inicialización de las propiedades enlazadas del componente.
   *
   * Realiza la configuración inicial del componente, incluyendo:
   * - Suscripción a los catálogos clave y estado mediante los servicios correspondientes, asegurando la limpieza de suscripciones con `takeUntil` y `destroyNotifier$`.
   * - Inicialización de variables y banderas de estado.
   * - Llamada a métodos para inicializar formularios y catálogos: `inicializarFormulario`, `inicializarTablaYCatalogoDatos`, `crearElstablecimientoForm`, `crearRepresentanteLegalForm`, `cerrarSCIANForm`, `cerrarMercanciasForm`, `deshabilitarFormularios`, y `crearProductoTerminadoForm`.
   * - Refuerzo del estado deshabilitado de los campos `nombreORazon`, `apellidoPaterno` y `apellidoMaterno` en el formulario de representante legal.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.inicializarCatalogo(String(this.idProcedimiento));
    this.scianTablaDatos = [];
    this.mercanciasTablaDatos = [];
      this.subscription.add(
      this.tramite2603Query.scianTabla$.pipe(takeUntil(this.destroyNotifier$)).subscribe((scianData) => {
        if (scianData && scianData.length > 0) {
          this.scianTablaDatos = scianData;
          this.actualizarStore();
        }
      })
    );    
    
    this.subscription.add(
      this.tramite2603Query.mercanciasTabla$.pipe(takeUntil(this.destroyNotifier$)).subscribe((mercanciasData) => {
        if (mercanciasData && mercanciasData.length > 0) {
          this.mercanciasTablaDatos = mercanciasData;
          this.actualizarStore();
        }
      })
    );
      this.esFormularioSoloLectura = this.consultaState?.readonly || false;

    this.inicializarFormulario();
    this.getDenominacionForm();
    this.crearElstablecimientoForm();
    this.crearRepresentanteLegalForm();
    this.cerrarSCIANForm();
    this.cerrarMercanciasForm();
    this.deshabilitarFormularios();
    this.crearProductoTerminadoForm();// Refuerza el estado deshabilitado de los campos de representante legal después de la creación del formulario
    this.inicializarCrosslist();
    if (this.representanteLegalForm) {
      ['nombreORazon', 'apellidoPaterno', 'apellidoMaterno'].forEach(campo => {
        const CONTROL_REPRESENTANTE = this.representanteLegalForm.get(campo);
        if (CONTROL_REPRESENTANTE) {
          CONTROL_REPRESENTANTE.disable();
          CONTROL_REPRESENTANTE.updateValueAndValidity();
        }
      });
    }

    if (this.domicilioDeElstablecimientoForm) {
      this.domicilioDeElstablecimientoForm.valueChanges
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe(value => {
          this.updateDatosSolicitud.emit(value);
        });
    }

  }
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje:
        'La fracción ingresada no se encuentra en el acuerdo de fracciones reguladas, favor de verificar.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }


  /**
   * Inicializa los catálogos necesarios usando CatalogoServices.
   * Implementación exacta del patrón shared2606.
   * 
   * @param tramite - Identificador del trámite
   */
  inicializarCatalogo(tramite: string): void {
    this.subscription.add(
      this.catalogoService
        .estadosCatalogo(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.estadoCatalogo = DATOS;
          }
        })
    );
    
    this.subscription.add(
      this.catalogoService
        .regimenesCatalogo(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.regimenDatos = DATOS;
            const REGIMENLIST = DATOS.filter(item => item.clave === '01');
           if (REGIMENLIST.length > 0 && this.disableRegimen.includes(String(this.idProcedimiento))) {
              this.domicilioDeElstablecimientoForm.patchValue({
                regimenDestinara: REGIMENLIST[0].clave
              });
            }
          }
        })
    );

    this.subscription.add(
      this.catalogoService
        .aduanasCatalogo(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.adunasDeEntradasDatos = DATOS;
          }
        })
    );

    this.subscription.add(
      this.catalogoService
        .clasificacionProductoCatalogo(tramite, String(this.idProcedimiento))
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.claveCatalogo = DATOS;
          }
        })
    );

    this.subscription.add(
      this.catalogoService
        .tiposProductoCatalogo(tramite, String(this.idProcedimiento))
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) {
            this.tipoDeProductoCatalogo = DATOS;
          }
        })
    );

    this.subscription.add(
      this.catalogoService
        .scianCatalogo(tramite)
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((datos) => {
            const TRANSFORMED_DATOS = {
              ...datos,
              datos: (datos.datos ?? []).map((item: Catalogo) => ({
                ...item,
                scianDescription: item.descripcion,
                descripcion: item.clave
              }))
            };
            return TRANSFORMED_DATOS;
          })
        )
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) {
            this.claveScianCatalogo = DATOS;
          }
        })
    );
    
    this.subscription.add(
      this.catalogoService
        .unidadesMedidaComercialCatalogo(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.cantidadUmcDatos = DATOS;
          }
        })
    );    
    
    // País de destino
    this.subscription.add(
      this.catalogoService
        .paisesCatalogo(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.paisDestinoDatos = DATOS;
          }
        })
    );

    this.subscription.add(
      this.catalogoService
        .estadoFisicoMercanciaCatalogo(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.estadoFisicoDatos = DATOS;
          }
        })
    );

  }
  /**
   * Inicializa los datos de los crosslists de países y uso específico.
   * Realiza llamadas básicas a la API para obtener los catálogos y asignarlos a las propiedades correspondientes.
   */
  inicializarCrosslist(): void {
    // País de procedencia para crosslist
    this.subscription.add(
      this.catalogoService
        .paisesCatalogo(String(this.idProcedimiento))
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) {
            this.paisDeProcedenciaCatalogo = DATOS;
            this.seleccionarPais = DATOS.map((item: Catalogo) => item.descripcion);
          }
        })
    );
    
    // Uso específico
    this.subscription.add(
      this.catalogoService
        .usosEspecificoMercanciaCatalogo(String(this.idProcedimiento), String(this.idProcedimiento))
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          if (response && Array.isArray(response.datos)) {
            this.usoEspesificoDatos = response.datos.map((item: Catalogo) => item.descripcion);
            const SELECTED = this.mercanciasForm.getRawValue();
            this.seleccionadasUsoEspesificoDatos = Array.isArray(SELECTED.usoEspecifico)
              ? SELECTED.usoEspecifico
              : SELECTED.usoEspecifico
                ? [SELECTED.usoEspecifico]
                : [];
            this.seleccionadasUsoEspesificoDatos = JSON.parse(JSON.stringify(this.seleccionadasUsoEspesificoDatos));
          }
        })
    );

    // Forma farmacéutica
    this.subscription.add(
      this.catalogoService
        .formaFarmaceuticaCatalogo(String(this.idProcedimiento))
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          if (response && Array.isArray(response.datos)) {
            this.formaFarmaceuticaDatos = response.datos.map((item: Catalogo) => item.descripcion);
            const SELECTED = this.mercanciasForm.getRawValue();
            this.seleccionadasFormaFarmaceuticaDatos = Array.isArray(SELECTED.formaFarmaceutica)
              ? SELECTED.formaFarmaceutica
              : SELECTED.formaFarmaceutica
                ? [SELECTED.formaFarmaceutica]
                : [];
            this.seleccionadasFormaFarmaceuticaDatos = JSON.parse(JSON.stringify(this.seleccionadasFormaFarmaceuticaDatos));
          }
        })
    );
  }

paisDeOrigenSeleccionadasChange(events: string[]): void {
  this.seleccionadasPaisDeOrigenDatos = events;
  this.mercanciasForm.get('paisDeOrigen')?.setValue(events);
  this.mercanciasForm.patchValue({
    paisDeOriginDatos: events,
  });
  this.mercanciasForm.patchValue({ paisDeOrigen: events });
}

 /**
   * Valida si el campo de un formulario no contiene errores
   * @param {AbstractControl} control  : Control del formulario
   * @param {string} campo  : Nombre del campo a validar, si el control es un FormGroup
   * @returns {boolean | null} : Retorna true si el campo contiene errores y ha sido tocado, de lo contrario retorna false
   */
 isValid(form: FormGroup, field: string): boolean {
  return this.validacionesService.isValid(form, field) || false;
}

  /**
   * Maneja el evento de cambio del campo "Tipo de producto".
 * 
 * @param {Event} event - Evento de cambio del elemento `<select>`.
 * @returns {void}
 * @description 
 * Obtiene el valor seleccionado desde el elemento HTML `<select>` y determina 
 * si el campo "Especifique" debe mostrarse. Si el valor seleccionado no es `2`, 
 * el campo asociado en el formulario (`especifique`) se reinicia.
 */
  onTipoDeProductoChange(event: Event): void {
    const SELECT_ELEMENT = event.target as HTMLSelectElement;
    const SELECTED_CLAVE = SELECT_ELEMENT.value;


    const SELECTED_OPTION = this.tipoDeProductoCatalogo.find(
      (item) => item.clave === SELECTED_CLAVE
    );
  
    this.mostrarEspecifique = SELECTED_OPTION?.descripcion === 'Otro';
  
  
    if (!this.mostrarEspecifique) {
      this.mercanciasForm.get('especifique')?.reset();
    }
  }
  /**
   * Maneja la selección de un país de destino.
   * Actualiza el valor en el formulario basado en la selección del usuario.
   *
   * @param event - Objeto con el valor seleccionado de país de destino.
   */
  onSeleccionarPaisDeDestino(event: Catalogo): void {
    const SELECCIONADOS = event.clave;
    this.mercanciasForm
      .get('pais')
      ?.setValue(SELECCIONADOS);
  }

  /**
   * Maneja el evento de cambio para las selecciones de uso específico.
   *
   * @param events - Un arreglo de cadenas que representa las selecciones actuales de uso específico.
   *
   * Este método actualiza la propiedad `seleccionadasUsoEspesificoDatos` con las selecciones proporcionadas
   * y actualiza el formulario `mercanciasForm` para reflejar los valores seleccionados en el campo `usoEspecifico`.
   */
  usoEspesificoSeleccionadasChange(events: string[]): void {
    this.seleccionadasUsoEspesificoDatos = events;
    this.mercanciasForm.get('usoEspecifico')?.setValue(events);
    this.mercanciasForm.get('detallarUso')?.setValue(events);
  }

  /**
   * Maneja el evento de cambio para las selecciones de forma farmacéutica.
   *
   * @param events - Un arreglo de cadenas que representa las selecciones actuales de forma farmacéutica.
   *
   * Este método actualiza la propiedad `seleccionadasFormaFarmaceuticaDatos` con las selecciones proporcionadas.
   */
  formaFarmaceuticaSeleccionadasChange(events: string[]): void {
    this.seleccionadasFormaFarmaceuticaDatos = events;
    this.mercanciasForm.get('formaFarmaceutica')?.setValue(events);
    this.mercanciasForm.patchValue({
      formaFarmaceuticaDatos: events,
    });

  }

   /**
   * Genera un arreglo de objetos de catálogo que coinciden con el identificador proporcionado.
   *
   * @param {Catalogo[]} catalogo - Arreglo de objetos de catálogo.
   * @param {string} id - Identificador para filtrar los objetos del catálogo.
   * @returns {Catalogo[] | undefined} - Arreglo de objetos de catálogo que coinciden con el identificador, o undefined si no hay coincidencias.
   */
    generarCatalogoObjet(catalogo: Catalogo[] | undefined | null, id: string): string[] | undefined {
    if (!catalogo || catalogo.length === 0) {
      return undefined;
    }
    return catalogo
      .filter(item => item.clave === id)
      .map(item => item.descripcion); // Extract descriptions
  }


  /**
   * Inicializa el formulario para Producto Terminado
   */
  crearProductoTerminadoForm(): void {
    this.productoTerminadoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)]],
    });
  }

  /**
   * Limpia completamente el formulario de mercancías, reseteando todos los campos a valores vacíos.
   */
  limpiarMercanciasForm(): void {
    const PAIS_VALUE = this.mercanciasForm.get('pais')?.value || '134';
    
    this.mercanciasForm.reset();
    this.mercanciasForm.patchValue({
      clave: '',
      especificarClasificacion: '',
      dci: '',
      marcaComercialODenominacionDistintiva: '',
      tipoDeProducto: '',
      especifique: '',
      fraccionArancelaria: '',
      descripcionDeLaFraccion: '',
      cantidadUmt: '',
      umt: '',
      umc: '',
      numeroCas: '',
      cantidadDeLotes: '',
      kgOrPorLote: '',
      pais: PAIS_VALUE,
      paisDeProcedencia: '',
      detallarUso: '',
      cantidadUmc: '',
      numeroDePiezas: '',
      descripcionDelNumeroDePiezas: '',
      numeroDeRegistro: '',
      presentacion: '',
      productoTerminadoTablaDatos: []
    });
    this.productoTerminadoTablaDatos = [];
    this.mostrarErrorProductoTerminado = false;
    // Restablecer secciones plegables
    this.colapsableObj = {
      formaFarmaceuticaColapsable: false,
      paisDeOrigenColapsable: false,
      usoEspecificoColapsable: false
    };
    this.mostrarEspecifique = false;
  }

  /**
   * Limpia el formulario Producto Terminado y también reinicia todos los campos de mercanciasForm.
   */
  limpiarFormularioProductoTerminado(): void {
    this.productoTerminadoForm.reset();
    this.productoTerminadoForm.get('productoTerminadoTablaDatos')?.reset([]);
    this.productoTerminadoTablaDatos = [];
    this.mostrarErrorProductoTerminado = false;
    this.limpiarMercanciasForm();
  }

  mostrarErrorProductoTerminado = false;

/**
 * Agrega una nueva fila Producto Terminado a la tabla.
 * Si el formulario es inválido, se mostrará el mensaje de error (span rojo).
 */
  productoTerminadoAgregar(): void {
    this.mostrarErrorProductoTerminado = true;
    this.productoTerminadoForm.markAllAsTouched();
    if (this.productoTerminadoForm.valid) {
      const NUEVO_PRODUCTO = this.productoTerminadoForm.value;
      this.productoTerminadoTablaDatos = [
        ...this.productoTerminadoTablaDatos,
        NUEVO_PRODUCTO,
      ];
      this.mostrarErrorProductoTerminado = false;
      this.limpiarFormularioProductoTerminado();
    }
  }

  /**
   * Cierra el modal y limpia el formulario Producto Terminado
   */
  cerrarModalProductoTerminado(): void {
    this.modalRef?.hide();
    this.limpiarFormularioProductoTerminado();
  }

  /**
   * Inicializa el formulario suscribiéndose al observable selectSolicitud$ del store.
   * Actualiza la propiedad solicitudState con el estado más reciente de la sección.
   * 
   * Este método se asegura de que la información del formulario esté sincronizada con el estado global.
   */
  inicializarFormulario(): void {
    this.tramite2603Query
      .selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          // Actualiza el estado local de la solicitud con los datos recibidos del store
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Crea una copia profunda del objeto proporcionado.
   * 
   * Este método serializa el objeto a una cadena JSON y luego lo analiza de nuevo a un nuevo objeto,
   * creando efectivamente una copia profunda. Tenga en cuenta que este enfoque puede no manejar funciones,
   * valores indefinidos o referencias circulares correctamente.
   * 
   * @param obj - El objeto que se va a copiar profundamente. Por defecto es un objeto vacío.
   * @returns Una copia profunda del objeto proporcionado.
   */

  /**
   * Realiza una copia profunda de un objeto dado utilizando serialización y deserialización JSON.
   * 
   * @template T El tipo del objeto a copiar.
   * @param obj El objeto que se desea copiar profundamente.
   * @returns Una nueva instancia del objeto, completamente independiente del original.
   * @remarks
   * - Si el objeto es `undefined` o `null`, se retorna tal cual.
   * - Esta función no copia correctamente objetos que contienen funciones, fechas, mapas, conjuntos, o propiedades no serializables por JSON.
   */
  public static deepCopy<T>(obj: T): T {
    if (obj === undefined || obj === null) {
      return obj;
    }
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Valida el campo "numeroDePiezas" asegurando que solo contenga números y cumpla con el patrón alfanumérico.
   *
   * @param control - Control de formulario a validar.
   * @returns {ValidationErrors | null} Un objeto con los errores de validación si existen, o null si es válido.
   */
  private static validateNumeroDePiezas(control: AbstractControl): ValidationErrors | null {
    const VALUE = control.value;
    if (!VALUE) {
      return null;
    }

    const VALIDACION_ERRORES: ValidationErrors = {};
    if (!SOLO_REGEX_NUMEROS.test(VALUE)) {
      VALIDACION_ERRORES['soloNumeros'] = true;
    }
    
    if (!REGEX_PATRON_ALFANUMERICO.test(VALUE)) {
      VALIDACION_ERRORES['formatoInvalido'] = true;
    }
    
    return Object.keys(VALIDACION_ERRORES).length > 0 ? VALIDACION_ERRORES : null;
  }


  /**
   * Inicializa y crea un grupo de formularios reactivo para "domicilioDeElstablecimientoForm".
   * Este formulario se utiliza para capturar y validar los detalles de la dirección de un establecimiento y la información relacionada.
   *
   * El formulario incluye los siguientes controles:
   * - `avisoCheckbox`: Indica si se ha marcado el aviso de funcionamiento (opcional). Por defecto, este campo es `false` (no marcado), a menos que `solicitudState.avisoCheckbox` esté definido como booleano, en cuyo caso se usa ese valor.
   * - `licenciaSanitaria`: Licencia sanitaria del establecimiento (opcional).
   * - `codigoPostal`: Código postal del establecimiento (requerido).
   * - `estado`: Estado donde se encuentra el establecimiento (requerido).
   * - `municipio`: Municipio del establecimiento (requerido).
   * - `localidad`: Localidad del establecimiento (requerido).
   * - `colonia`: Colonia o barrio del establecimiento (requerido).
   * - `calleYNumero`: Calle y número del establecimiento (requerido).
   * - `correoElecronico`: Dirección de correo electrónico del establecimiento (requerido).
   * - `rfc`: Registro Federal de Contribuyentes del establecimiento (requerido).
   * - `lada`: Clave lada para el número telefónico del establecimiento (opcional).
   * - `telefono`: Número telefónico del establecimiento (requerido).
   * - `avisoDeFuncionamiento`: Aviso de funcionamiento del establecimiento (opcional).
   * - `licenciaSanitaria`: Licencia sanitaria del establecimiento (deshabilitado por defecto).
   * - `regimenDestinara`: Régimen al que el establecimiento destinará recursos (opcional).
   * - `aduana`: Información aduanera relacionada con el establecimiento (opcional).
   * Se aplican validadores para asegurar que los campos requeridos se completen adecuadamente.
   */
public crearElstablecimientoForm(): void {
  const AVISO_VALOR =
    typeof this.solicitudState.avisoCheckbox === 'boolean'
      ? this.solicitudState.avisoCheckbox
      : false;

  this.domicilioDeElstablecimientoForm = this.fb.group({
    avisoCheckbox: [AVISO_VALOR],
    licenciaSanitaria: [{value: this.solicitudState.licenciaSanitaria,disabled: AVISO_VALOR,}],
    codigoPostal: [{ value: this.solicitudState.codigoPostal, disabled: true }, [Validators.required, DatosDeLaSolicitudComponent.noWhitespaceValidator, Validators.pattern(REGEX_POSTAL), Validators.maxLength(12)]],
    estado: [{ value: this.solicitudState.estado, disabled: false }, [Validators.required]],
    municipio: [{ value: this.solicitudState.municipio, disabled: true }, [Validators.required]],
    localidad: [{ value: this.solicitudState.localidad, disabled: true }, [Validators.required, Validators.maxLength(120)]],
    colonia: [{ value: this.solicitudState.colonia, disabled: true }, [Validators.required, Validators.maxLength(120)]],
    calleYNumero: [{ value: this.solicitudState.calleYNumero, disabled: true }, [Validators.required, Validators.maxLength(100)]],
    correoElecronico: [{ value: this.solicitudState.correoElecronico, disabled: true }, [Validators.required, Validators.email, Validators.maxLength(320)]],
    rfc: [{ value: this.solicitudState.rfc, disabled: true }, [Validators.required, Validators.pattern(REGEX_RFC)]],
    lada: [{ value: this.solicitudState.lada, disabled: true }, [Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(5)]],
    telefono: [{ value: this.solicitudState.telefono, disabled: true }, [Validators.required, Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(30)]],
    regimenDestinara: [this.solicitudState.regimenDestinara],
    aduana: [this.solicitudState.aduana],
  });

  // Mantenga siempre estos campos deshabilitados
  const CAMPOS_SIEMPRE_DESHABILITADOS = [
    'denominacionRazon',
    'codigoPostal',
    'municipio',
    'localidad',
    'colonia',
    'calleYNumero',
    'correoElecronico',
    'rfc',
    'lada',
    'telefono',
    'regimenDestinara',
  ];

  /**
   * Deshabilita permanentemente un conjunto de campos dentro del formulario
   * `domicilioDeElstablecimientoForm`.
   * 
   * Estos campos corresponden a información que no debe ser modificada por el usuario,
   * ya que son gestionados por el sistema o dependen de datos externos. 
   * 
   * Se realiza un recorrido por el arreglo `CAMPOS_SIEMPRE_DESHABILITADOS`, 
   * aplicando el método `disable()` a cada control encontrado.
   */
  CAMPOS_SIEMPRE_DESHABILITADOS.forEach((field) => {
    this.domicilioDeElstablecimientoForm.get(field)?.disable();
  });

  /**
   * Asigna el valor `1` al campo `regimenDestinara` del formulario.
   * 
   * Este valor se establece de forma programática para garantizar 
   * que el campo tenga un valor por defecto válido y no dependa 
   * de la interacción del usuario.
   */
  this.domicilioDeElstablecimientoForm
    .get('regimenDestinara')
    ?.setValue(1);

  if (this.establecimientoSeleccionado) {
    this.habilitarCamposEstablecimiento();
  }

  /**
 * Si existe un establecimiento previamente seleccionado,
 * habilita los campos correspondientes en el formulario.
 * 
 * Esto permite la edición controlada de los datos 
 * únicamente cuando hay un contexto de establecimiento activo.
 */
  this.domicilioDeElstablecimientoForm
    .get('avisoCheckbox')
    ?.valueChanges.subscribe((checked: boolean) => {
      const LICENCIA_CONTROL =
        this.domicilioDeElstablecimientoForm.get('licenciaSanitaria');

      if (checked) {
        LICENCIA_CONTROL?.disable({ emitEvent: false });
      } else {
        LICENCIA_CONTROL?.enable({ emitEvent: false });
      }
    });

    /**
   * Observa los cambios en el control `avisoCheckbox`.
   * 
   * Si el checkbox se marca (`true`), se deshabilita el campo `licenciaSanitaria`.
   * Si se desmarca (`false`), el campo `licenciaSanitaria` vuelve a habilitarse.
   * 
   * Esto asegura que solo una de las opciones (aviso o licencia) 
   * pueda ser proporcionada por el usuario a la vez.
   */
    this.domicilioDeElstablecimientoForm
      .get('licenciaSanitaria')
      ?.valueChanges.subscribe((value: string) => {
        const AVISO_CONTROL =
          this.domicilioDeElstablecimientoForm.get('avisoCheckbox');

        if (value && value.trim().length > 0) {
          AVISO_CONTROL?.disable({ emitEvent: false });
        } else {
          AVISO_CONTROL?.enable({ emitEvent: false });
        }
      });
  }


  /**
   * Inicializa el FormGroup `representanteLegalForm` con controles y sus valores predeterminados
   * basados en el estado actual de `solicitudState`.
   * 
   * El formulario incluye los siguientes controles:
   * - `losDatosNo`: Representa un valor booleano o similar que indica una opción "No".
   * - `losDatosYes`: Representa un valor booleano o similar que indica una opción "Sí".
   * - `rfc`: Representa el RFC (Registro Federal de Contribuyentes).
   * - `nombreORazon`: Representa el nombre o razón social.
   * - `apellidoPaterno`: Representa el apellido paterno.
   * - `apellidoMaterno`: Representa el apellido materno.
   * 
   * Este método utiliza el `FormBuilder` de Angular para crear el grupo de formularios y
   * llenarlo con valores del objeto `solicitudState`.
   */
  public crearRepresentanteLegalForm(): void {
    this.representanteLegalForm = this.fb.group({
      manifiestos: [{ value: this.solicitudState.manifiestos, disabled: false }, [Validators.required]],
      losDatosNo: [{ value: this.solicitudState.losDatosNo, disabled: false }, [Validators.required]],
      rfc: [this.solicitudState.rfc, [Validators.required, Validators.maxLength(13), Validators.pattern(REGEX_RFC), DatosDeLaSolicitudComponent.validadorRFC]],
      nombreORazon: [{ value: this.solicitudState.nombreORazon, disabled: true }, Validators.required],
      apellidoPaterno: [{ value: this.solicitudState.apellidoPaterno, disabled: true }, Validators.required],
      apellidoMaterno: [{ value: this.solicitudState.apellidoMaterno, disabled: true }],
    });
    // Refuerza el estado deshabilitado por defecto
    ['nombreORazon', 'apellidoPaterno', 'apellidoMaterno'].forEach(campo => {
      const CONTROL_REPRESENTANTE = this.representanteLegalForm.get(campo);
      if (CONTROL_REPRESENTANTE) {
        CONTROL_REPRESENTANTE.disable();
        CONTROL_REPRESENTANTE.updateValueAndValidity();
      }
    });
  }
/**
   * Validador personalizado que verifica que el valor del campo no sea solo espacios en blanco.
   * 
   * @method noWhitespaceValidator
   * @param control Control de formulario a validar.
   * @returns {ValidationErrors | null} Un objeto de error si el valor contiene solo espacios en blanco, o null si es válido.
   */
  static noWhitespaceValidator(control: FormControl): ValidationErrors | null {
    if (control.value && control.value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }

  /**
   * Valida el RFC ingresado en el formulario.
   * Utiliza expresiones regulares para verificar si es un RFC válido.
   * 
   * @returns Un objeto de error si el RFC es inválido, o null si es válido.
   */
  static validadorRFC(control: AbstractControl): ValidationErrors | null {
    const VALUE = control.value;
    if (!VALUE) {
      return null;
    }
    const ES_VALIDO = REGEX_RFC.test(VALUE);
    return ES_VALIDO ? null : { rfcInvalido: true };
  }

  /**
   * Restablece e inicializa el formulario SCIAN con valores predeterminados del estado actual de la solicitud.
   * El formulario se vuelve a crear utilizando el FormBuilder con los campos `clave` y `descripcion`
   * poblados a partir del objeto `solicitudState`.
   */
  public cerrarSCIANForm(): void {
    this.scianForm = this.fb.group({
      clave: [this.solicitudState.claveScian ?? null, Validators.required],
      descripcion: [this.solicitudState.descripcion, Validators.required]
    });
  }

  /**
   * Inicializa y configura el FormGroup `mercanciasForm` con valores predeterminados
   * derivados del objeto `solicitudState`. Este formulario se utiliza para gestionar
   * y validar los datos relacionados con las "mercancías" en la aplicación.
   *
   * El formulario incluye los siguientes controles:
   * - `clave`: La clave o identificador de las mercancías.
   * - `especificarClasificacion`: Especifica la clasificación del producto.
   * - `dci`: La DCI (Denominación Común Internacional) del producto.
   * - `marcaComercialODenominacionDistintiva`: La marca comercial o denominación distintiva.
   * - `tipoDeProducto`: El tipo de producto.
   * - `fraccionArancelaria`: La fracción arancelaria.
   * - `descripcionDeLaFraccion`: Descripción de la fracción arancelaria.
   * - `cantidadUmt`: Cantidad en UMT (Unidad de Medida de Transporte).
   * - `umt`: La UMT (Unidad de Medida de Transporte).
   * - `umc`: La UMC (Unidad de Medida Comercial).
   * - `numeroCas`: El número CAS (Chemical Abstracts Service).
   * - `cantidadDeLotes`: La cantidad de lotes.
   * - `kgOrPorLote`: Kilogramos o cantidad por lote.
   * - `pais`: El país de origen.
   * - `paisDeProcedencia`: El país de procedencia.
   * - `detallarUso`: Detalles sobre el uso previsto de las mercancías.
   * - `cantidadUmc`: Cantidad en UMC (Unidad de Medida Comercial).
   * - `numeroDePiezas`: El número de piezas.
   * - `descripcionDelNumeroDePiezas`: Descripción del número de piezas.
   * - `numeroDeRegistro`: El número de registro.
   * - `presentacion`: La presentación o empaque de las mercancías.
   * - `productoTerminadoTablaDatos`: Datos relacionados con el producto terminado.
   * - `numeroDePiezas`: El número de piezas.
   * - `descripcionDelNumeroDePiezas`: Descripción del número de piezas.
   * - `numeroDeRegistro`: El número de registro.
   *
   * Este método asegura que el formulario se inicialice correctamente con el
   * estado actual del objeto `solicitudState`.
   */
  public cerrarMercanciasForm(): void {
    this.mercanciasForm = this.fb.group({
      clave: [{ value: this.solicitudState.clave, disabled: false }, [Validators.required]],
      especificarClasificacion: [{ value: this.solicitudState.especificarClasificacionProducto, disabled: false }, [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(200)]],
      dci: [{ value: this.solicitudState.dci, disabled: false }, [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(256)]],
      marcaComercialODenominacionDistintiva: [{ value: this.solicitudState.marcaComercialODenominacionDistintiva, disabled: false }, [Validators.required, Validators.maxLength(250)]],
      tipoDeProducto: [{ value: this.solicitudState.tipoDeProducto, disabled: false }, [Validators.required]],
      especifique: [{ value: this.solicitudState.especifique, disabled: false }],
      fraccionArancelaria: [{ value: this.solicitudState.fraccionArancelaria, disabled: false }, [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.pattern(SOLO_REGEX_NUMEROS), Validators.maxLength(8)]],
      descripcionDeLaFraccion: [{ value: this.solicitudState.descripcionDeLaFraccion, disabled: true }, [Validators.required]],
      cantidadUmt: [{ value: this.solicitudState.cantidadUMT, disabled: false }, [Validators.required, Validators.pattern(REG_X.REGEX_FRACCION_ARANCELARIA), Validators.maxLength(20)]],
      umt: [{ value: this.solicitudState.UMT, disabled: true }, [Validators.required]],
      umc: [{ value: this.solicitudState.UMC, disabled: false }, [Validators.required]],
      numeroCas: [{ value: this.solicitudState.numeroCas, disabled: false }, [Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(20)]],
      cantidadDeLotes: [{ value: this.solicitudState.cantidadDeLotes, disabled: false }, [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(150)]],
      kgOrPorLote: [
        { value: this.solicitudState.kgOrPorLote, disabled: false }, 
        this.idProcedimiento === 260304 ? [] : [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(150)]
      ],
      pais: [{ value: this.solicitudState.pais, disabled: false }, [Validators.required]],
      paisDeProcedencia: [
        { value: this.solicitudState.paisDeProcedencia, disabled: false }, 
        this.idProcedimiento === 260304 ? [] : [Validators.required]
      ],
      detallarUso: [{ value: this.solicitudState.detallarUso, disabled: false }, [Validators.maxLength(256)]],
      cantidadUmc: [{ value: this.solicitudState.cantidadUMC, disabled: false }, [Validators.required, Validators.pattern(REGEX_12_ENTEROS_10_DECIMALES), Validators.maxLength(23)]],
      numeroDePiezas: [
        { value: this.solicitudState.numeroDePiezas, disabled: false }, 
        this.idProcedimiento === 260304 ? [] : [Validators.required, DatosDeLaSolicitudComponent.validateNumeroDePiezas, Validators.maxLength(15)]
      ],
      descripcionDelNumeroDePiezas: [
        { value: this.solicitudState.descripcionDelNumeroDePiezas, disabled: false }, 
        this.idProcedimiento === 260304 ? [] : [Validators.required, Validators.maxLength(250)]
      ],
      numeroDeRegistro: [{ value: this.solicitudState.numeroDeRegistro, disabled: false }, [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(50)]],
      presentacion: [{ value: this.solicitudState.presentacion, disabled: false }, [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(256)]],
      productoTerminadoTablaDatos: [[]],
      formaFarmaceuticaDatos:[this.seleccionadasFormaFarmaceuticaDatos],
       paisDeOriginDatos: [
            this.seleccionadasPaisDeOrigenDatos,
            [Validators.required],
          ],
        usoEspecificoDatos: [  this.seleccionadasUsoEspesificoDatos, [Validators.required],],

        estadoFisico: [{ value: this.solicitudState.estadoFisico, disabled: false  }, [Validators.required]],
        especifiqueEstado: [{ value: '', disabled: false  }],
    });
    this.mercanciasForm.get('pais')?.setValue('134');
  }


  /**
   * Abre un cuadro de diálogo modal utilizando la plantilla proporcionada y establece el estado del modal.
   *
   * @param template - Una referencia a la plantilla que se mostrará en el modal.
   */
  public seleccionar(template: TemplateRef<void>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm establecimiento' });
    this.esModalCerrado = true;
  }

  /**
   * Cierra el cuadro de diálogo modal y vuelve a habilitar el control de formulario 'denominacionRazon'.
   * 
   * Este método realiza las siguientes acciones:
   * - Oculta el cuadro de diálogo modal si está actualmente visible.
   * - Habilita el campo 'denominacionRazon' en el grupo de formularios `denominacionForm`,
   *   permitiendo nuevamente la interacción del usuario con el campo.
   */
  public cerrar(): void {
    this.modalRef?.hide();
    this.habilitarCamposEstablecimiento();
  }

  /**
   * Inicializa el FormGroup `denominacionForm` con un único control `denominacionRazon`.
   * El control se rellena previamente con el valor de `solicitudState.denominacionRazon` y se establece como deshabilitado.
   * Este método se utiliza para configurar el formulario y mostrar la denominación o razón en un estado de solo lectura.
   */
  public getDenominacionForm(): void {
    this.denominacionForm = this.fb.group({
      denominacionRazon: [{ value: this.solicitudState.denominacionRazon, disabled: true }, [Validators.required]]
    });
    this.denominacionForm.get('denominacionRazon')?.disable();
  }

  /**
   * Abre el modal para agregar una nueva mercancía y reinicia el formulario de mercancías.
   * 
   * @param template - La plantilla del modal que se va a mostrar.
   */
  public seleccionarAgregar(template: TemplateRef<void>): void {
    this.cerrarMercanciasForm(); // Reinicia el formulario
    this.isModifyClicked = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-xl datos-mercancia-modal' });
  }



  /**
   * Agrega un registro a la tabla de mercancías al enviar el formulario
   */
  public agregarMercancia(): void {
    if (this.mercanciasForm.invalid) {
      this.mercanciasForm.markAllAsTouched();
      return;
    }

    const NUEVA_MERCANCIA = this.mercanciasForm.getRawValue();
    
    const ID = Math.floor(100000 + Math.random() * 900000);
    NUEVA_MERCANCIA.id = ID;
    
    if (this.productoTerminadoTablaDatos.length > 0) {
      NUEVA_MERCANCIA.productoTerminadoTablaDatos = this.productoTerminadoTablaDatos;
    }
    
    if (this.idProcedimiento === 260304) {
      delete NUEVA_MERCANCIA.numeroDePiezas;
      delete NUEVA_MERCANCIA.descripcionDelNumeroDePiezas;
    }
    
    this.mercanciasTablaDatos = [...this.mercanciasTablaDatos, NUEVA_MERCANCIA];
    
    (this.tramite2603Store['setMercanciasTabla'] as (value: unknown) => void)(this.mercanciasTablaDatos);
    
    this.mercanciasForm.reset();
    this.limpiarFormularioProductoTerminado();
    this.mostrarErrorProductoTerminado = false;
    
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
  
  /**
   * Agrega detalle de mercancía - Solo valida campos específicos: cantidadUmc, numeroDePiezas, descripcionDelNumeroDePiezas, numeroDeRegistro, presentacion
   */
  public agregarDetalleMercancia(): void {
    let FIELDS_TO_VALIDATE: string[] = [];

  // Define fields to validate based on idProcedimiento
  if (this.idProcedimiento === 260301) {
    FIELDS_TO_VALIDATE = ['numeroDeRegistro', 'presentacion', 'numeroDePiezas', 'descripcionDelNumeroDePiezas'];
  } else if (this.idProcedimiento !== 260304 && this.idProcedimiento !== 260301) {
    FIELDS_TO_VALIDATE = ['cantidadUmc', 'numeroDeRegistro', 'presentacion', 'numeroDePiezas', 'descripcionDelNumeroDePiezas'];
  } else {
    FIELDS_TO_VALIDATE = ['cantidadUmc', 'numeroDeRegistro', 'presentacion'];
  }
    
    FIELDS_TO_VALIDATE.forEach(fieldName => {
      const CONTROL = this.mercanciasForm.get(fieldName);
      if (CONTROL) {
        CONTROL.markAsTouched();
      }
    });

    const ARE_SPECIFIC_FIELDS_VALID = FIELDS_TO_VALIDATE.every(fieldName => {
      const CONTROL = this.mercanciasForm.get(fieldName);
      return CONTROL ? CONTROL.valid : true;
    });

    if (ARE_SPECIFIC_FIELDS_VALID) {
      const FORM_VALUES = this.mercanciasForm.value;
      
      const NUEVO_PRODUCTO_TERMINADO: any = {
        clave: FORM_VALUES.cantidadUmc || '',
        descripcion: FORM_VALUES.presentacion || '',
       
        presentacion: FORM_VALUES.presentacion || '',
        numeroFabricar: FORM_VALUES.numeroDePiezas || '',
        descripcionDePiezas: FORM_VALUES.descripcionDelNumeroDePiezas || '',
        registroSanitario: FORM_VALUES.numeroDeRegistro || '',

      };

      this.productoTerminadoTablaDatos = [
        ...this.productoTerminadoTablaDatos,
        NUEVO_PRODUCTO_TERMINADO,
      ];
      
      FIELDS_TO_VALIDATE.forEach(fieldName => {
        const CONTROL = this.mercanciasForm.get(fieldName);
        if (CONTROL) {
          CONTROL.reset();
          CONTROL.markAsUntouched();
        }
      });
    }
  }
   /**
 * Detecta cambios en las propiedades de entrada del componente y ejecuta validaciones cuando se activa el botón continuar.
 * Utiliza Promise.resolve() para asegurar que la validación se ejecute en el próximo ciclo del event loop.
 */
  ngOnChanges(): void {
    if (this.isContinuarTriggered) {
      Promise.resolve().then(() => {
        this.validarClickDeBoton();
      });
    }
  }

 
  /**
 * Valida el clic del botón verificando que todos los formularios requeridos
 * (producto terminado, domicilio del establecimiento, representante legal,
 * denominación y SCIAN) estén correctamente definidos para su evaluación.
 */

public validarClickDeBoton(): boolean {
  const forms = [
    
    this.domicilioDeElstablecimientoForm,
    this.representanteLegalForm,
    this.denominacionForm,
   
  ];

  // Mark all controls as touched so validation errors are shown
  forms.forEach(form => this.markFormGroupTouched(form));

 // Check if all forms are valid
 const allFormsValid = forms.every(form => form.disabled || form.valid);

 // Return the result
 return allFormsValid;
}
/**
 * Marca como “touched” todos los controles de un FormGroup,
 * incluyendo los grupos anidados de forma recursiva,
 * para forzar la visualización de mensajes de validación.
 */

private markFormGroupTouched(form: FormGroup): void {
  Object.values(form.controls).forEach(control => {
    if (control instanceof FormGroup) {
      this.markFormGroupTouched(control); // recursive for nested groups
    } else {
      control.markAsTouched();
    }
  });
}

/**
 * Encuentra el identificador (clave) en el catálogo que coincide con la descripción proporcionada.
 *
 * @param {Catalogo[]} catalogo - Arreglo de objetos de catálogo.
 * @param {string} descripcion - Descripción para filtrar los objetos del catálogo.
 * @returns {string | undefined} - Clave que coincide con la descripción, o undefined si no hay coincidencias.
 */
generarClaveDesdeDescripcion(catalogo: Catalogo[] | undefined | null, descripcion: any): string | undefined {
  if (!catalogo || catalogo.length === 0) {
    return undefined;
  }
  const item = catalogo.find(item => item.descripcion === descripcion); // Find the first match
  return item?.clave; // Return the clave if found, otherwise undefined
}



modificarMercancia(template: TemplateRef<void>): void {
  this.mercanciasForm.reset();
  this.isModifyClicked = true;
  this.modalRef = this.modalService.show(template, { class: 'modal-xl datos-mercancia-modal' });

 

  if (this.seleccionados.length === 0) {
    return;
  }

  // Get the selected row
  const selectedMercancia = this.seleccionados[0];
  // Reverse the comma-separated values into an array of objects
  const numeroFabricarArray = selectedMercancia.numeroFabricar?.split(', ') || [];
  const descripcionFabricarArray = selectedMercancia.descripcionFabricar?.split(', ') || [];
  const descripcionDePiezasArray = selectedMercancia.descripcionDePiezas?.split(', ') || [];
  const registroSanitarioArray = selectedMercancia.registroSanitario?.split(', ') || [];

  // Create an array of objects for productoTerminadoTablaDatos
  this.productoTerminadoTablaDatos = numeroFabricarArray.map((numeroFabricar: string, index: number) => ({
    numeroFabricar: numeroFabricar,
    descripcion: descripcionFabricarArray[index] || '',
    descripcionDePiezas: descripcionDePiezasArray[index] || '',
    registroSanitario: registroSanitarioArray[index] || '',
    clave: '',
  
  }));
  // Populate the mercanciasForm with the selected row's data
  this.mercanciasForm.patchValue({
    id: selectedMercancia.idMercancia,
    formaFarmaceuticaDatos: selectedMercancia.formaFarmaceutica,
    paisDeOriginDatos: selectedMercancia.paisDeOrigen,
    clave: this.generarClaveDesdeDescripcion(this.claveCatalogo,selectedMercancia.clasificacion?.[0]),
    especificarClasificacion: selectedMercancia.especificar,
    dci: selectedMercancia.dci,
    marcaComercialODenominacionDistintiva: selectedMercancia.denominacion,
    fraccionArancelaria: selectedMercancia.fraccion,
    descripcionDeLaFraccion: selectedMercancia.descripcionDeLa,
    tipoDeProducto: this.generarClaveDesdeDescripcion(this.tipoDeProductoCatalogo,selectedMercancia.tipoDeProducto?.[0]),
    umt: selectedMercancia.umt,
    umc: this.generarClaveDesdeDescripcion(this.cantidadUmcDatos,selectedMercancia.umc),
    cantidadUmt: selectedMercancia.cantidadUmt,
    cantidadUmc: selectedMercancia.cantidadUmc,
    numeroCas: selectedMercancia.numeroCas,
    cantidadDeLotes: selectedMercancia.cantidad,
    kgOrPorLote: selectedMercancia.kg,
    detallarUso: selectedMercancia.uso,
    especifique: selectedMercancia.detalle,
    numeroDeRegistro: selectedMercancia.numeroDeReg,
    presentacion: selectedMercancia.presentacion,
    pais: this.generarClaveDesdeDescripcion(this.paisDestinoDatos,selectedMercancia.paisDeDestino?.[0]),
    paisDeProcedencia: this.generarClaveDesdeDescripcion(this.paisDeProcedenciaCatalogo,selectedMercancia.paisDeProcedencia?.[0]),
  });

 
}

eliminarMercancia(): void {
  if (!this.seleccionados || this.seleccionados.length === 0) {
    return;
  }

  // Filter out the selected rows from the data
  this.mercanciasTablaDatos = this.mercanciasTablaDatos.filter(
    (row) => !this.seleccionados.includes(row)
  );

  // Clear the selected rows
  this.seleccionados = [];
}

 /**
   * @method loadScian
   * @description
   * Método que carga los datos SCIAN desde el servicio `EstablecimientoService`
   * y los asigna al formulario `scianForm`.
   */

 onSeleccionChange(event:any): void {
  this.seleccionados = event;
}

/**
 * Marks all fields as touched and validates all fields except the excluded ones.
 * @returns {boolean} - Returns `true` if all fields (excluding the excluded ones) are valid, otherwise `false`.
 */
public validateAndMarkFields(): boolean {
  // Fields to exclude
  const EXCLUDED_FIELDS = ['numeroDeRegistro', 'presentacion', 'numeroDePiezas', 'descripcionDelNumeroDePiezas','usoEspecificoDatos','paisDeOriginDatos'];

  // Get all fields in the form
  const ALL_FIELDS = Object.keys(this.mercanciasForm.controls);

  // Filter out the excluded fields
  const FIELDS_TO_VALIDATE = ALL_FIELDS.filter(field => !EXCLUDED_FIELDS.includes(field));

  // Mark all remaining fields as touched
  FIELDS_TO_VALIDATE.forEach(fieldName => {
    const CONTROL = this.mercanciasForm.get(fieldName);
    if (CONTROL) {
      CONTROL.markAsTouched();
    }
  });

  // Check if all remaining fields are valid
  const ARE_FIELDS_VALID = FIELDS_TO_VALIDATE.every(fieldName => {
    const CONTROL = this.mercanciasForm.get(fieldName);
    return CONTROL ? (CONTROL.disabled || CONTROL.valid) : true;
  });

  // If any field is invalid, return false
  if (!ARE_FIELDS_VALID) {
    return false;
  }

  // If all fields are valid, return true
  return true;
}

  /**
   * Agrega mercancía completa - Valida todos los campos incluyendo la tabla de producto terminado
   */
  public agregarMercanciaCompleta(): void {
 
    const CAMPOS_OCULTOS = ['kgOrPorLote', 'numeroDePiezas', 'descripcionDelNumeroDePiezas', 'paisDeProcedencia'];
    const CAMPOS_VALIDOS = Object.keys(this.mercanciasForm.controls).every(key => {
      const CONTROL = this.mercanciasForm.get(key);
      if (!CONTROL || CONTROL.disabled) {
        return true;
      }
      
      if (this.idProcedimiento === 260304 && CAMPOS_OCULTOS.includes(key)) {
        return true;
      }
      
      return CONTROL.valid;
    });
    if (this.idProcedimiento===260301){
      const SON_VALIDOS = this.validateAndMarkFields();
      if (!SON_VALIDOS || this.productoTerminadoTablaDatos.length === 0) {
        return;
      }

    }

   /*if (!CAMPOS_VALIDOS) {
      this.mercanciasForm.markAllAsTouched();
      return;
    }*/
      if (this.productoTerminadoTablaDatos.length === 0) {
        return;
      }

    const NUEVA_MERCANCIA = this.mercanciasForm.getRawValue();
    
    const ID = Math.floor(100000 + Math.random() * 900000);
    NUEVA_MERCANCIA.id = ID;
    
    if (this.productoTerminadoTablaDatos.length > 0) {
      NUEVA_MERCANCIA.productoTerminadoTablaDatos = this.productoTerminadoTablaDatos;
    }
    
    if (this.idProcedimiento === 260304) {
      delete NUEVA_MERCANCIA.kgOrPorLote;
      delete NUEVA_MERCANCIA.numeroDePiezas;
      delete NUEVA_MERCANCIA.descripcionDelNumeroDePiezas;
      delete NUEVA_MERCANCIA.paisDeProcedencia;
    }
    

    const MERCANCIA: any = {
      /** Identificador */
      idMercancia: NUEVA_MERCANCIA .id,

      formaFarmaceutica:NUEVA_MERCANCIA.formaFarmaceuticaDatos,
      paisDeOrigen:NUEVA_MERCANCIA.paisDeOriginDatos,
    
      /** Clasificación */
      clasificacion: this.generarCatalogoObjet(this.claveCatalogo, NUEVA_MERCANCIA.clave),
     
      especificar: NUEVA_MERCANCIA.especificarClasificacion,
    
      /** Denominaciones */
      dci: NUEVA_MERCANCIA .dci,
      denominacion: NUEVA_MERCANCIA.marcaComercialODenominacionDistintiva,
    
      /** Fracción arancelaria */
      fraccion: NUEVA_MERCANCIA.fraccionArancelaria,
      descripcionDeLa: NUEVA_MERCANCIA.descripcionDeLaFraccion,
    
      /** Tipo */
      tipoDeProducto: this.generarCatalogoObjet(this.tipoDeProductoCatalogo, NUEVA_MERCANCIA.tipoDeProducto),
    
      /** Unidades de medida */
      umt: NUEVA_MERCANCIA.umt,
      umc: this.generarCatalogoObjet(this.cantidadUmcDatos, NUEVA_MERCANCIA.umc),
    
      /** Cantidades */
      cantidadUmt: NUEVA_MERCANCIA.cantidadUmt,
      cantidadUmc: NUEVA_MERCANCIA.cantidadUmc,
    
      /** CAS y lotes */
      numeroCas: NUEVA_MERCANCIA.numeroCas,
      cantidad: NUEVA_MERCANCIA.cantidadDeLotes,
      kg: NUEVA_MERCANCIA.kgOrPorLote,
    
      /** Uso */
      uso: NUEVA_MERCANCIA.detallarUso,
      detalle: NUEVA_MERCANCIA.detallarUso[0],
    
      /** Registro / presentación */
      numeroDeReg: NUEVA_MERCANCIA.numeroDeRegistro ?? '',
      presentacion: NUEVA_MERCANCIA.productoTerminadoTablaDatos?.map((row:any) => row.presentacion)
      .filter((value:any) => value) // Filter out undefined or null values
      .join(', ') ?? '',
    
      /** Países */
      paisDeDestino: this.generarCatalogoObjet(this.paisDestinoDatos, NUEVA_MERCANCIA.pais),
      paisDeProcedencia: this.generarCatalogoObjet(this.paisDeProcedenciaCatalogo, NUEVA_MERCANCIA.paisDeProcedencia),
    
      numeroFabricar: NUEVA_MERCANCIA.productoTerminadoTablaDatos
      ?.map((row:any) => row.numeroFabricar)
      .filter((value:any) => value) // Filter out undefined or null values
      .join(', ') ?? '',
    
    descripcionFabricar: NUEVA_MERCANCIA.productoTerminadoTablaDatos
      ?.map((row:any) => row.descripcion)
      .filter((value:any) => value)
      .join(', ') ?? '',
    
    descripcionDePiezas: NUEVA_MERCANCIA.productoTerminadoTablaDatos
      ?.map((row:any) => row.descripcionDePiezas)
      .filter((value:any) => value)
      .join(', ') ?? '',
    
    registroSanitario: NUEVA_MERCANCIA.productoTerminadoTablaDatos
      ?.map((row:any) => row.registroSanitario)
      .filter((value:any) => value)
      .join(', ') ?? '', 
    };
          
    
    if (this.isModifyClicked) {
      
      const index = this.mercanciasTablaDatos.findIndex((item) => item.especificar === MERCANCIA.especificar);
      if (index !== -1) {
        this.mercanciasTablaDatos[index] = MERCANCIA;
        this.mercanciasTablaDatos = [...this.mercanciasTablaDatos];
      }
    } else {
     
      this.mercanciasTablaDatos = [...this.mercanciasTablaDatos, MERCANCIA];
    }
    (this.tramite2603Store['setMercanciasTabla'] as (value: unknown) => void)(this.mercanciasTablaDatos);
    
    this.mercanciasForm.reset();
    this.limpiarFormularioProductoTerminado();
    this.mostrarErrorProductoTerminado = false;
    
    if (this.modalRef) {
      this.modalRef.hide();
    }
    this.isModifyClicked = false;
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
   * Recupera los datos de "mercancías" y actualiza los datos de la tabla.
   * Este método llama al servicio `getMercanciasDatos` para obtener los datos,
   * crea una copia profunda de la respuesta y la asigna a `mercanciasTablaDatos`.
   *
   * @returns {void} Este método no retorna un valor.
   */
  public getMercanciasTabla(): void {
    this.certificadosLicenciasSvc.getMercanciasDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const DATOS = DatosDeLaSolicitudComponent.deepCopy(response);
      this.mercanciasTablaDatos = DATOS;
    });
  }

  /**
   * Alterna el estado colapsable de la primera sección.
   */
  public mostrarColapsable(valores: string): void {
    if (valores === 'forma') {
      this.colapsableObj.formaFarmaceuticaColapsable = !this.colapsableObj.formaFarmaceuticaColapsable;
    } else if (valores === 'PaisDeOrigen') {
      this.colapsableObj.paisDeOrigenColapsable = !this.colapsableObj.paisDeOrigenColapsable;
    } else if (valores === 'usoEspecifico') {
      this.colapsableObj.usoEspecificoColapsable = !this.colapsableObj.usoEspecificoColapsable;
    } else {
      this.colapsableObj.formaFarmaceuticaColapsable = false;
      this.colapsableObj.paisDeOrigenColapsable = false;
      this.colapsableObj.usoEspecificoColapsable = false;
    }
  }
  /**
   * Genera una lista de configuraciones de botones para operaciones de listas cruzadas.
   * Cada configuración de botón incluye un nombre, una clase CSS y una función
   * para realizar una acción específica en la lista cruzada.
   *
   * @param index Índice del crosslist component (0: forma farmacéutica, 1: país origen, 2: uso específico)
   * @returns Un arreglo de objetos de configuración de botones, donde cada objeto contiene:
   * - `btnNombre`: El nombre que se mostrará en el botón.
   * - `class`: La clase CSS para estilizar el botón.
   * - `funcion`: Una función de callback para ejecutar la acción correspondiente.
   *
   * Las acciones disponibles son:
   * - "Agregar todos": Agrega todos los elementos a la lista cruzada.
   * - "Agregar selección": Agrega los elementos seleccionados a la lista cruzada.
   * - "Restar selección": Elimina los elementos seleccionados de la lista cruzada.
   * - "Restar todos": Elimina todos los elementos de la lista cruzada.
   */
  public getCrossListBtn(index: number = 0): { btnNombre: string; class: string; funcion: () => void }[] {
    return [
      { 
        btnNombre: 'Agregar todos', 
        class: 'btn-default', 
        funcion: (): void => {
          if (this.crossList && this.crossList.toArray()[index]) {
            this.crossList.toArray()[index].agregar('t');
          }
        }
      },
      { 
        btnNombre: 'Agregar selección', 
        class: 'btn-primary', 
        funcion: (): void => {
          if (this.crossList && this.crossList.toArray()[index]) {
            this.crossList.toArray()[index].agregar('');
          }
        }
      },
      { 
        btnNombre: 'Restar selección', 
        class: 'btn-primary', 
        funcion: (): void => {
          if (this.crossList && this.crossList.toArray()[index]) {
            this.crossList.toArray()[index].quitar('');
          }
        }
      },
      { 
        btnNombre: 'Restar todos', 
        class: 'btn-default', 
        funcion: (): void => {
          if (this.crossList && this.crossList.toArray()[index]) {
            this.crossList.toArray()[index].quitar('t');
          }
        }
      },
    ];
  }

  /**
   * Maneja el evento de cambio para el checkbox "Funcionamiento".
   * Deshabilita o habilita el control de formulario 'licenciaSanitaria' según el estado del checkbox.
   *
   * @param event - El evento activado por el cambio del checkbox.
   *                Se espera que sea de tipo `Event` y su objetivo debe ser un `HTMLInputElement`.
   */
  public onFuncionamientoCheckboxCambiar(event: Event): void {
    const VALOR = (event.target as HTMLInputElement).checked;

    const LICENCIA_CONTROL =
      this.domicilioDeElstablecimientoForm.get('licenciaSanitaria');

    if (VALOR) {
      LICENCIA_CONTROL?.disable();
    } else {
      LICENCIA_CONTROL?.enable();
    }

    (this.tramite2603Store['setAvisoCheckbox'] as (value: boolean) => void)(
      VALOR
    );
  }

  /**
   * Maneja el evento de input para el campo "No. de licencia sanitaria".
   * Deshabilita o habilita el control de formulario 'avisoCheckbox' según el contenido del input.
   *
   * @param event - El evento activado por el input del campo.
   *                Se espera que sea de tipo `Event` y su objetivo debe ser un `HTMLInputElement`.
   */
  public onLicenciaSanitariaInput(event: Event): void {
    const VALOR = (event.target as HTMLInputElement).value;

    const AVISO_CONTROL =
      this.domicilioDeElstablecimientoForm.get('avisoCheckbox');

    if (VALOR && VALOR.trim().length > 0) {
      AVISO_CONTROL?.disable();
    } else {
      AVISO_CONTROL?.enable();
    }
  }

  /**
   * Establece el valor de un campo en el store de Tramite2603.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite2603Store): void {
    if (campo === 'claveScian' && form === this.scianForm) {
      const VALOR = form.get(campo)?.value;
      (this.tramite2603Store[metodoNombre] as (value: unknown) => void)(VALOR);
      (this.tramite2603Store[metodoNombre] as (value: unknown) => void)(VALOR);
      return;
    }

    if (campo === 'licenciaSanitaria' && form.get('licenciaSanitaria')?.value) {
      form.get('avisoCheckbox')?.disable();
    }

    const VALOR = form.get(campo)?.value;
    (this.tramite2603Store[metodoNombre] as (value: unknown) => void)(VALOR);
     this.formSectionValid.emit(form.valid);
  }

  /**
   * Habilita o deshabilita todos los formularios del componente según el estado de solo lectura.
   * Si la propiedad `readonly` de `consultaState` es verdadera, todos los formularios se deshabilitan para evitar la edición.
   * Si no, se habilitan para permitir la edición.
   */
  deshabilitarFormularios(): void {
    this.esFormularioSoloLectura = this.consultaState?.readonly || false;

    if (this.esFormularioSoloLectura) {
      this.denominacionForm?.disable();
      this.domicilioDeElstablecimientoForm?.disable();
      this.representanteLegalForm?.disable();
      this.scianForm?.disable();
      this.mercanciasForm?.disable();
    } else {
      if (this.establecimientoSeleccionado) {
        const CAMPOS_A_HABILITAR = [
          'denominacionRazon',
          'codigoPostal',
          'estado',
          'municipio',
          'localidad',
          'colonia',
          'calleYNumero',
          'correoElecronico',
          'rfc',
          'lada',
          'telefono'
        ];
        CAMPOS_A_HABILITAR.forEach(field => {
          if (this.domicilioDeElstablecimientoForm.get(field)) {
            this.domicilioDeElstablecimientoForm.get(field)?.enable();
          }
        });
      } else {
        this.denominacionForm?.disable();
        const CAMPOS_SIEMPRE_DESHABILITADOS = [
          'denominacionRazon',
          'codigoPostal',
          'municipio',
          'localidad',
          'colonia',
          'calleYNumero',
          'correoElecronico',
          'rfc',
          'lada',
          'telefono'
        ];
        CAMPOS_SIEMPRE_DESHABILITADOS.forEach(field => {
          if (this.domicilioDeElstablecimientoForm.get(field)) {
            this.domicilioDeElstablecimientoForm.get(field)?.disable();
          }
        });
      }
      this.representanteLegalForm?.enable();
      this.scianForm?.enable();
      this.mercanciasForm?.enable();
    }
  }

  /**
   * Busca y asigna los datos del representante legal en el formulario si los campos clave son válidos.
   * No valida el campo 'losDatosNo'.
   */
  buscarRepresentanteLegal(): void {
  const RFC_CONTROL = this.representanteLegalForm.get('rfc');
  const RFC_VALUE = RFC_CONTROL?.value?.trim();

  if (!RFC_VALUE) {
    this.alertaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe ingresar el RFC.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    RFC_CONTROL?.markAsTouched();
    this.mostrarNotificacion = true;
    return;
  }

  if (RFC_CONTROL?.valid) {
    const PROCIDIMIENTO = String(this.idProcedimiento);
    const PAYLOAD = { "rfcRepresentanteLegal": RFC_VALUE };

    this.sharedSvc.getRepresentanteLegala(PAYLOAD, PROCIDIMIENTO)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (response) => {
          const DATOS = doDeepCopy(response);
          if (esValidArray(DATOS.datos)) {
            this.mostrarErroresRepresentante.nombre = false;
            this.mostrarErroresRepresentante.apellidoPaterno = false;
            this.representanteLegalForm.patchValue({
              nombreORazon: DATOS.datos[0].nombre,
              apellidoPaterno: DATOS.datos[0].apellidoPaterno,
              apellidoMaterno: DATOS.datos[0].apellidoMaterno
            });
            this.setValoresStore(this.representanteLegalForm,'nombreORazon', 'setNombreORazon')
            this.setValoresStore(this.representanteLegalForm,'apellidoPaterno', 'setApellidoPaterno')
            this.setValoresStore(this.representanteLegalForm,'apellidoMaterno', 'setApellidoMaterno')
          } else {
            this.mostrarErroresRepresentante.nombre = true;
            this.mostrarErroresRepresentante.apellidoPaterno = true;
          }
        },
        (error) => {
          this.alertaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: '',
            mensaje: 'Error al obtener los representantes legales.',
            cerrar: true,
            tiempoDeEspera: 2000,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
          };
          this.mostrarNotificacion = true;
          console.error('Error al obtener los representantes legala:', error);
        }
      );
  } else {
    RFC_CONTROL?.markAsTouched();
    this.alertaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe ingresar el RFC válido.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.mostrarNotificacion = true;
  }
}

  /**
* compo doc
* @method isValid
* @description 
* Verifica si un campo específico del formulario es válido.
* @param field El nombre del campo que se desea validar.
* @returns {boolean | null} Un valor booleano que indica si el campo es válido.
*/
  public esValido(form: FormGroup, campo: string): boolean | null {
    if (!this.validacionesService || typeof this.validacionesService.isValid !== 'function') {
      return null;
    }
    return this.validacionesService.isValid(form, campo);
  }
  /*
   * Lista de filas seleccionadas del componente tabla de SCIAN.
   * Se utiliza para manejar la selección de filas en la tabla de SCIAN.
   */
  selectedRowsScian: ScianDatos[] = [];

  /*
    * Lista de filas seleccionadas del componente tabla de mercancías.
    * Se utiliza para manejar la selección de filas en la tabla de mercancías.
    */
  selectedRows: NicoInfo[] = [];

  /**
   * Maneja el evento de cambio en la tabla de SCIAN.
   * Actualiza la lista de filas seleccionadas.
   * @param selected Filas seleccionadas en la tabla.
   */
  onSeleccionChangeScian(selected: ScianDatos[]): void {
    this.selectedRowsScian = selected;
  }
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
   * Elimina las filas seleccionadas de la tabla SCIAN
   */
  eliminarSeleccionadosScian(): void {
    // Mostrar modal de confirmación usando
    this.alertaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
      cerrar: false,
      txtBtnAceptar: 'Eliminar',
      txtBtnCancelar: 'Cancelar',
    };
    this.mostrarNotificacion = true;
  }

  // Manejador de confirmación de lib-notificaciones
  onConfirmarEliminarSeleccionadosScian(confirmado: boolean): void {
    this.mostrarNotificacion = false;
    this.alertaNotificacion = {} as Notificacion;
    if (confirmado) {
      this.scianTablaDatos = this.scianTablaDatos.filter(
        (row) => !this.selectedRowsScian.some(sel => sel.clave === row.clave && sel.descripcion === row.descripcion)
      );
      this.selectedRowsScian = [];
      (this.tramite2603Store['setScianTabla'] as (value: unknown) => void)(this.scianTablaDatos);
    }
  }
  
  /**
   * Limpia el formulario SCIAN y resetea los datos seleccionados
   */
  limpiarFormularioScian(): void {
    this.scianForm.get('clave')?.setValue(null);
    this.scianForm.get('descripcion')?.setValue(null);
    this.scianForm.markAsPristine();
    this.scianForm.markAsUntouched();
    this.selectedRowsScian = [];
  }

  /**
   * Limpia el formulario SCIAN
   */
  public limpiarScianForm(): void {
    this.scianForm?.reset();
  }
  
  /**
   * Agrega un nuevo elemento SCIAN a la tabla - Siguiendo patrón 2606
   */
  public scianAgregar(): void {
    if (this.scianForm?.invalid) {
      this.scianForm?.markAllAsTouched();
      return;
    }

    const SCIAN_NUEVO = {
      clave: this.scianForm?.get('clave')?.value || '',
      descripcion: this.scianForm?.get('descripcion')?.value || ''
    };

    this.onScianSeleccionado(SCIAN_NUEVO);
  }

  /**
   * Maneja la selección de SCIAN desde el modal (siguiendo patrón 2606)
   */
  public onScianSeleccionado(scianData: ScianDatos): void {
    if (this.scianTablaDatos && this.scianTablaDatos.length > 0) {
      const EXISTE = this.scianTablaDatos.find(item => item.clave === scianData.clave);
      if (!EXISTE) {
        this.scianTablaDatos = [...this.scianTablaDatos, scianData];
        
        (this.tramite2603Store['setScianTabla'] as (value: unknown) => void)(this.scianTablaDatos);
        
        this.limpiarScianForm();
        this.cerrarModalScian();
      } else {
        this.alertaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'warning',
          modo: 'action',
          titulo: '',
          mensaje: 'El elemento SCIAN seleccionado ya existe en la tabla.',
          cerrar: true,
          tiempoDeEspera: 2000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        this.mostrarNotificacion = true;
      }
    } else {
      this.scianTablaDatos = [scianData];
      
      (this.tramite2603Store['setScianTabla'] as (value: unknown) => void)(this.scianTablaDatos);
      
      this.limpiarScianForm();
      this.cerrarModalScian();
    }
  }

  /**
   * Maneja la confirmación/cancelación de notificaciones de SCIAN
   * Siguiendo patrón 2606 para notificaciones de duplicados
   */
  public onConfirmarNotificacionScian(_confirmado: boolean): void {
    this.mostrarNotificacion = false;
    this.alertaNotificacion = {} as Notificacion;
    // En el caso de duplicados SCIAN, no hay acción específica al confirmar
    // solo se cierra la notificación
  }

  /**
   * Cierra el modal SCIAN
   */
  public cerrarModalScian(): void {
    this.modalRef?.hide();
  }

  /**
   * Elimina las filas seleccionadas del NICO
   */
  eliminarSeleccionados(): void {
    this.nicoTablaDatos = this.nicoTablaDatos.filter(
      (row) => !this.selectedRows.includes(row)
    );
    this.selectedRows = [];
  }

  /**
   * Maneja el evento cuando se agrega un registro SCIAN desde un componente externo.
   * Actualiza el valor de "licenciaSanitaria" y selecciona la opción de régimen si está disponible.
   *
   * @param event - El evento recibido, que puede contener la clave SCIAN.
   */
  onScianRecordAdded(event: unknown): void {
    const CLAVE_SCIAN = Array.isArray(event) && event.length > 0 ? (event[0] as { claveScian?: string; clave?: string })['claveScian'] || (event[0] as { clave?: string })['clave'] : null;
    const LICENCIA_SANITARIA_CONTROL = this.domicilioDeElstablecimientoForm.get('licenciaSanitaria');
    if (CLAVE_SCIAN) {
      LICENCIA_SANITARIA_CONTROL?.setValue(CLAVE_SCIAN);
    } 
    if (this.regimenCatalogo && this.regimenCatalogo.length > 0) {
      const OPTION_UNO = this.regimenCatalogo.find((item: Catalogo) => item.id === 1);
      if (OPTION_UNO) {
        this.domicilioDeElstablecimientoForm.get('regimenDestinara')?.setValue(OPTION_UNO.id);
      } 
    } 
  }


  /**
 * Muestra una notificación de confirmación al intentar eliminar un detalle de la tabla.
 * @method doEliminarDetalle
 * @return {void} Este método no retorna ningún valor.
 */
doEliminarDetalle(): void {
  if (this.selectedRowsProductoTerminado.length === 0) {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'Selecciona un registro.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.noRowSelectedTabla = true;
  } else {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
      cerrar: false,
      
      txtBtnCancelar: 'Cancelar',
      txtBtnAceptar: 'Aceptar',
    };
    this.esEliminarDetalle = true;
  }
}

  /**
   * Cierra la notificación de "no hay fila seleccionada" para la tabla C.
   * Establece la propiedad `noRowSelectedTablaC` en `false` para ocultar la notificación
   * específica de la tabla de empresas nacionales.
   * 
   * @method cerrarNoRowTablaC
   * @returns {void} Este método no retorna ningún valor.
   */
  cerrarNoRowTabla(): void {
    this.noRowSelectedTabla=false;
  }

/**
 * Confirma la eliminación de los detalles seleccionados de la tabla.
 * @method confirmarEliminarDetalle
 * @return {void} Este método no retorna ningún valor.
 */
confirmarEliminarDetalle(confirmado: boolean): void {
  if (confirmado && this.esEliminarDetalle) {
    this.productoTerminadoTablaDatos = this.productoTerminadoTablaDatos.filter(
      (row) => !this.selectedRowsProductoTerminado.includes(row)
    );
    this.selectedRowsProductoTerminado = [];
    this.esEliminarDetalle = false;
  }
  this.nuevaNotificacion = {} as Notificacion;
}

  /**
   * Maneja el cambio en el campo `fraccionArancelaria` del formulario de mercancías.
   *
   * - Si la fracción arancelaria tiene menos de 8 caracteres, limpia los campos relacionados y termina.
   * - Si tiene 8 caracteres, consulta el catálogo de fracciones arancelarias usando el servicio correspondiente.
   * - Si encuentra coincidencia (fracción y procedimiento), actualiza el campo `descripcionDeLaFraccion` y sincroniza con el store.
   * - Si no encuentra coincidencia o hay error en la consulta, limpia el campo y muestra una notificación de error.
   *
   * @param {Event} event Evento de input que contiene el valor de la fracción arancelaria ingresada.
   * @returns {void} No retorna valor; actualiza el formulario y puede mostrar notificaciones.
   *
   * @effect Actualiza los campos del formulario y muestra notificaciones según el resultado de la consulta.
   * @remarks
   *   - El método implementa la lógica de validación y consulta de fracción arancelaria siguiendo el patrón de COFEPRIS.
   *   - Maneja tanto el flujo exitoso como los errores de servicio, notificando al usuario si la fracción no es válida.
   */
  // manejarCambioFraccionArancelaria(event: Event): void {
  //   const INPUT_ELEMENT = event.target as HTMLInputElement;
  //   const FRACCION = INPUT_ELEMENT.value?.trim();

  //   if (!FRACCION || FRACCION.length < 8) {
  //     this.mercanciasForm.get('descripcionDeLaFraccion')?.setValue('');
  //     this.mercanciasForm.get('umt')?.setValue('');
  //     this.alertaNotificacionFraccion = {
  //       tipoNotificacion: 'alert',
  //       categoria: 'danger',
  //       modo: 'action',
  //       titulo: 'Dato incorrecto',
  //       mensaje: 'La fracción ingresada no se encuentra en el acuerdo de fracciones reguladas, favor de verificar.',
  //       cerrar: true,
  //       txtBtnAceptar: 'Aceptar',
  //       txtBtnCancelar: '',
  //     };
  //     this.mostrarNotificacionFraccion = true;
  //     return;
  //   }

  //   /**
  //    * Consulta el catálogo de fracción arancelaria usando el servicio certificadosLicenciasSvc.
  //    *
  //    * - Busca la fracción arancelaria en el catálogo.
  //    * - Primero intenta buscar con el procedimiento actual (si existe).
  //    * - Si no encuentra coincidencia, busca en todos los procedimientos disponibles para la fracción.
  //    * - Si encuentra coincidencia, actualiza el campo 'descripcionDeLaFraccion' en el formulario y sincroniza con el store.
  //    * - Si no encuentra coincidencia, limpia el campo y muestra una notificación de error.
  //    *
  //    * @observable
  //    * @param response Lista de objetos Catalogo recibidos del servicio.
  //    * @effect Actualiza el formulario y muestra notificaciones según el resultado.
  //    */
  //   // Usar el servicio para obtener el catálogo de fracción arancelaria
  //   this.certificadosLicenciasSvc.getArancelariaDatos().subscribe(
  //     (response: Catalogo[]) => {
  //       const FRACCIONES = response as unknown as FraccionArancelaria[];
  //       let MATCH: FraccionArancelaria | undefined;
        
  //       if (this.idProcedimiento) {
  //         MATCH = FRACCIONES.find(item =>
  //           Number(item.arancelaria) === Number(FRACCION) && Number(item.procedure) === Number(this.idProcedimiento)
  //         );
  //       }
        
  //       if (!MATCH) {
  //         MATCH = FRACCIONES.find(item => Number(item.arancelaria) === Number(FRACCION));
  //       }
        
  //       if (MATCH) {
  //         this.mercanciasForm.get('descripcionDeLaFraccion')?.setValue(MATCH.descripcion);
  //         this.setValoresStore(this.mercanciasForm, 'descripcionDeLaFraccion', 'setDescripcionDeLaFraccion');
  //       } else {
  //         this.mercanciasForm.get('descripcionDeLaFraccion')?.setValue('');
  //         this.alertaNotificacionFraccion = {
  //           tipoNotificacion: 'alert',
  //           categoria: 'danger',
  //           modo: 'action',
  //           titulo: 'Dato incorrecto',
  //           mensaje: 'La fracción ingresada no se encuentra en el acuerdo de fracciones reguladas, favor de verificar.',
  //           cerrar: true,
  //           txtBtnAceptar: 'Aceptar',
  //           txtBtnCancelar: '',
  //         };
  //         this.mostrarNotificacionFraccion = true;
  //       }
  //     },
  //     () => {
  //       this.mercanciasForm.get('descripcionDeLaFraccion')?.setValue('');
  //       this.alertaNotificacionFraccion = {
  //         tipoNotificacion: 'alert',
  //         categoria: 'danger',
  //         modo: 'action',
  //         titulo: 'Dato incorrecto',
  //         mensaje: 'La fracción ingresada no se encuentra en el acuerdo de fracciones reguladas, favor de verificar.',
  //         cerrar: true,
  //         txtBtnAceptar: 'Aceptar',
  //         txtBtnCancelar: '',
  //       };
  //       this.mostrarNotificacionFraccion = true;
  //     }
  //   );
  // }
  manejarCambioFraccionArancelaria(): void {
  const FRACCION = this.mercanciasForm.get('fraccionArancelaria')?.value;
  if (!FRACCION || FRACCION.length < 8) {
    this.mercanciasForm.get('descripcionDeLaFraccion')?.setValue('');
    this.mercanciasForm.get('umt')?.setValue('');
  } else if (FRACCION.length === 8) {
    if (isNaN(Number(FRACCION))) {
      this.abrirModal();
    } else {
      this.datosSolicitudService.obtenerFraccionesArancelarias(this.idProcedimiento, FRACCION)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe(
          (response) => {
            if (response.codigo === "00") {
              const DATOS_FRACCION = response.datos as { descripcionAlternativa: string };
              this.mercanciasForm.get('descripcionDeLaFraccion')?.setValue(DATOS_FRACCION.descripcionAlternativa);
            } else {
              this.abrirModal();
            }
          }
        );
      this.datosSolicitudService.obtenerUMT(this.idProcedimiento, FRACCION)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe(
          (response) => {
            if (response.codigo === "00") {
              const DATOS_UMT = response.datos as { descripcion: string };
              this.mercanciasForm.get('umt')?.setValue(DATOS_UMT.descripcion);
            } else {
              this.abrirModal();
            }
          }
        );
    }
  }
}

  /**
   * Cierra el modal de notificación de fracción arancelaria
   */
  public onConfirmarNotificacionFraccion(_confirmado: boolean): void {
    this.mostrarNotificacionFraccion = false;
    this.alertaNotificacionFraccion = null;
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.subscription.unsubscribe();
  }
}