/**
 * @component DatosDelSolicitudModificacionComponent
 * @description
 * Este componente gestiona la modificación de datos relacionados con una solicitud.
 * Proporciona formularios reactivos para capturar información del establecimiento,
 * datos SCIAN, y otros detalles relacionados con la solicitud.
 * También incluye funcionalidades para manejar modales, tablas dinámicas y listas cruzadas.
 */
import {
  ALERT,
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  CrosslistComponent,
  InputCheckComponent,
  InputFecha,
  InputFechaComponent,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  REGEX_IMPORTE_PAGO,
  REGEX_RFC,
  REGEX_SOLO_DIGITOS,
  SOLO_REGEX_NUMEROS,
  TablePaginationComponent,
  TablaSeleccion,
  TipoNotificacionEnum,
  TituloComponent,
  CatalogosSelect,
} from '@libs/shared/data-access-user/src';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CatalogoServices } from '@ng-mf/data-access-user';

import {
  CROSLISTA_DE_PAISES,
  FECHA_DE_PAGO,
  MERCANCIAS_DATA,
  MERCANCIAS_DATA1,
  SCIAN_TABLE_CONFIG,
  TEXTOS,
  PROCEDIMIENTOS_ESPECIALES,
  PROCEDIMIENTOS_MODIFICACION
} from '../../constantes/aviso-de-funcionamiento.enum';
import { CommonModule } from '@angular/common';
import { DatosDelSolicituteSeccionQuery } from '../../estados/queries/datos-del-solicitute-seccion.query';
import { DatosDelSolicituteSeccionStateStore } from '../../estados/stores/datos-del-solicitute-seccion.store';
import { MENSAJE_DE_ALERTA } from '@libs/shared/data-access-user/src/core/enums/260906/manifiestos.enum';
import radioButtonMexicana from '@libs/shared/theme/assets/json/260906/radioButtonMexicana.json';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { MENSAJE_DE_VALIDACI0N } from '../../../shared/constantes/aviso-de-funcionamiento.enum';

import { Modal } from 'bootstrap';

import {
  MercanciasInfo,
  PropietarioTipoPersona,
  ScianModel,
} from '../../models/datos-de-la-solicitud.model';
import { Subject ,distinctUntilChanged,map, skip, takeUntil } from 'rxjs';

import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { EstablecimientoService } from '../../services/establecimiento.service';
import { ManifiestosRepresentanteSeccionComponent } from '../manifiestos-representante-seccion/manifiestos-representante-seccion.component';

import { NUEVA_NOTIFICACION, PAIS_DE_ORIGEN_LABEL, PAIS_DE_PROCEDENCIA_LABEL, USO_ESPECIFICO_LABEL } from '../../constantes/datos-domicilio-legal.enum';

import {TablaDinamicaComponent} from '@ng-mf/data-access-user';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';

import { DetalleMercanciaComponent } from '../detalle-mercancia/detalle-mercancia.component';
import { ESTADO_DATA } from '../../constantes/catalogs.enum';

/*
 ** component
 */
@Component({
  selector: 'app-datos-del-solicitud-modificacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CrosslistComponent,
    DetalleMercanciaComponent,
    ManifiestosRepresentanteSeccionComponent,
    InputFechaComponent,
    TituloComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    AlertComponent,
    InputCheckComponent,
    NotificacionesComponent,
    TooltipModule,
    TablePaginationComponent,

  ],

  templateUrl: './datos-del-solicitud-modificacion.component.html',
  styleUrl: './datos-del-solicitud-modificacion.component.scss',
  providers: [DatosSolicitudService],
})
export class DatosDelSolicitudModificacionComponent
  implements OnInit, OnDestroy, AfterViewInit
{

  @Output() radioButtonSelectedChange = new EventEmitter<boolean>();
  @Output() tipoTramiteChange = new EventEmitter<string>();
  @Output() emitirSeleccionEstablecimiento = new EventEmitter<boolean>();

/**
 * @description
 * Componente que gestiona la modificación de datos relacionados con una solicitud.
 */
  public DatosDelSolicitudModificacionComponent = DatosDelSolicitudModificacionComponent;

  /**
 * @input mostrarScianBotones
 * @description
 * Indica si se deben mostrar los botones relacionados con la gestión de la tabla SCIAN en el componente.
 * @type {boolean}
 * @default true
 */
  @Input() mostrarScianBotones: boolean = true;

  public isContinuarButtonClicked: boolean = false;


  modifyMercanciaBotons: boolean = false;
  PROCEDIMIENTOS_ESPECIALES=PROCEDIMIENTOS_ESPECIALES;

  /**
   * @description
   * Lista de procedimientos de modificación.
   */
  PROCEDIMIENTOS_MODIFICACION = PROCEDIMIENTOS_MODIFICACION;


  isProcedimientoEspecial(): boolean {
    return  this.PROCEDIMIENTOS_ESPECIALES.includes(this.idProcedimiento);
  }

  /**
   * 
   * @returns {boolean}
   * Indica si el procedimiento actual es de modificación.
   */
  isProcedimientoModificacion(): boolean {
    return  this.PROCEDIMIENTOS_MODIFICACION.includes(this.idProcedimiento);
  }

  /**
   * @property {number} idProcedimiento
   * Identificador único del procedimiento asociado a la solicitud.
   * Este valor es recibido como un input desde el componente padre.
   *
   * @decorador @Input
   */
  @Input() public idProcedimiento!: number;

  /**
   * @property {number} idBaseProcedimiento
   * Identificador único del base procedimiento asociado a la solicitud.
   * Este valor es recibido como un input desde el componente padre.
   *
   * @decorador @Input
   */
  @Input() public idBaseProcedimiento!: number;

  


noOnlySpacesValidator(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === 'string' && control.value.trim() === '') {
    return { required: true };
  }
  return null;
}
  /**
 * @input mostrarNumeroYFecha
 * @description
 * Indica si se deben mostrar los campos de número de registro y fecha de caducidad en el formulario de mercancías.
 * @type {boolean}
 * @default true
 */
  @Input() mostrarNumeroYFecha: boolean = true;

  mensajeDeError: string = '';

  @Input() mostrarAlerta: boolean = true; // o false, según lo que necesites
  /**
   * Referencia al componente `ManifiestosRepresentanteSeccionComponent`.
   */
  @Input() hideRepresentanteLegal: boolean = true;
  /**
   * Referencia al componente `CatalogoSelectComponent`.
   * @tipo {boolean}
   * @descripción
   * Este decorador de entrada (`@Input`) permite controlar la visibilidad de los campos relacionados con
   * el código postal y el correo electrónico en el componente.
   *
   * */
  @Input() showCodigoPostalCorreoElectronico: boolean = false;
  /**
   * Notificación actual que se muestra en el componente.
   *
   * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
   * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
   */
  public nuevaNotificacion!: Notificacion ;

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
    txtBtnCancelar: '',
  };
    this.elementoParaEliminar = i;
  }

  cerrarModalMercancia(): void {
    this.modalAddAgentMercanciasInstance.hide();
    this.formMercancias.reset();
    this.seleccionadasPaisDeOriginDatos= [];
  this.seleccionadasPaisDeProcedenciaDatos= [];
  this.seleccionadasEspecificoDatos= [];
  this.showTipoProductoEspecifique = false;
  this.showEstadoFisicoEspecifique = false;
  this.mensajeDeError= '';
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
   * @input showPreFillingOptions
   * Indica si se deben mostrar las opciones de prellenado.
   */
  @Input() showPreFillingOptions: boolean = true;
  @Input() mostrarSeccionManifiestos: boolean = false;
  @Input() mostrarSeccionRepresentante: boolean = false;
  /**
   * Indica si se debe mostrar el checkbox de AIFA.
   */
  @Input() showAifaCheckbox: boolean = true; 

  seleccionadasPaisDeProcedenciaDatos: string[] = [];

  seleccionadasEspecificoDatos: string[] = [];

  // Properties to control crosslist validation
  markTouchedPaisOrigen: boolean = false;
  markTouchedPaisProcedencia: boolean = false;
  markTouchedUsoEspecifico: boolean = false;

  /**
 * Determina si se deben mostrar los campos relacionados con el programa IMMEX en el formulario.
 */
  @Input() showProgramaImmexFields: boolean = false;

   /**
   * Indica si se debe mostrar el permiso de importación de la CNSNS.
   */
  @Input() mostrarPermisoImportacionCNSNS: boolean = false;

/**
 * Indica si se debe mostrar el botón para copiar datos en la interfaz.
 * 
 * Cuando es `true`, el botón "Copiar Datos" será visible para el usuario.
 * Cuando es `false`, el botón no se mostrará.
 */
@Input() mostrarBotonCopiarDatos: boolean = true; 

  /**
   * Referencia al modal del establecimiento.
   */
  @ViewChild('establecimientoModal', { static: false })
  establecimientoModal!: ElementRef;
  /**
   * Referencia al botón del modal del establecimiento.
   */
  @ViewChild('establecimientoModalButton', { static: false })
  establecimientoModalButton!: ElementRef;
  @ViewChild('modalAddAgentMercancias', { static: false })
  modalAddAgentMercancias!: ElementRef;

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

  manifiestos!: FormGroup;

  representante!: FormGroup;

  /** Mensaje de alerta para el usuario */
  public mensaje: string = MENSAJE_DE_ALERTA;
  /** Opciones para los radio buttons */
  radioOptions = radioButtonMexicana;

  @Input() tramiteID!: string;

  @Input() procedureRfc!: string;
  /**
   * Instancia del modal del establecimiento.
   */
  establecimientoModalInstance!: Modal;
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
   * Nombre del modal.
   */
  public modal: string = 'modal';

  /**
   * Botones de acción para gestionar listas de países en la primera sección.
   */
  paisDeProcedenciaBotons = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[0].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-primary',
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
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[1].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[1].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-primary',
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
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[2].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[2].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[2].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[2].quitar('t'),
    },
  ];

  /**
   * Etiqueta para el crosslist de país de procedencia.
   */
  public paisDeProcedenciaLabel = PAIS_DE_PROCEDENCIA_LABEL;

  /**
   * Etiqueta para el campo de uso específico.
   * 
   * Esta propiedad almacena la etiqueta que se utiliza para mostrar el campo "Uso Específico"
   * en los formularios o tablas del componente.
   */
  public usoEspecificoLabel = USO_ESPECIFICO_LABEL;
  /**
   * Etiqueta para el país de origen.
   * @type {CrossListLable}
   */
  public paisDeOrigenLabel = PAIS_DE_ORIGEN_LABEL;
  
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
  seleccionarOrigenDelPais: string[] = [];

  /**
   * Lista de países para seleccionar el origen de la segunda sección.
   */
  seleccionarOrigenDelPaisDos: string[] = [];

  /**
   * Lista de países para seleccionar el origen de la tercera sección.
   */
    seleccionarOrigenDelPaisTres: string[] = [];


  /**
   * Lista de estados.
   */
  estado: CatalogosSelect = ESTADO_DATA;

  /**
   * Arreglo que contiene la información del catálogo de régimen.
   * Inicialmente se encuentra vacío.
   */
  regimenDatos: Catalogo[] = [];

  /**
   * Lista de catálogos correspondientes a las aduanas disponibles.
   * Inicialmente se encuentra vacía.
   */
  aduanasDatos: Catalogo[] = [];

  /**
   * Arreglo que contiene los datos del catálogo SCIAN.
   * Inicialmente se encuentra vacío.
  */
  scianDatos: Catalogo[] = [];

  /**
   * Arreglo que contiene las descripciones filtradas del catálogo SCIAN.
   * Se actualiza cuando se selecciona una clave en el primer dropdown.
   */
  scianDescripcionDatos: Catalogo[] = [];

  /**
   * Lista que contiene los datos del catálogo de clasificación de productos.
   * Inicialmente se encuentra vacía.
  */
  clasificacionProductoDatos: Catalogo[] = [];

  /**
   * Arreglo que contiene los datos del catálogo para especificar productos.
   * Inicialmente se encuentra vacío.
  */
  especificarProductoDatos: Catalogo[] = [];

  /**
   * Lista que contiene los datos del catálogo de tipos de producto.
   * Inicialmente se encuentra vacía.
  */
  tipoProductoDatos: Catalogo[] = [];

  /**
   * Arreglo que contiene los datos del catálogo de formas farmacéuticas.
   * Inicialmente se encuentra vacío.
  */
  formaFarmaceuticaDatos: Catalogo[] = [];

  /**
   * Lista que contiene los datos del catálogo de estados físicos.
   * Inicialmente se encuentra vacía.
  */
  estadoFisicoDatos: Catalogo[] = [];

  /**
   * Arreglo que contiene los datos del catálogo de unidades de medida y conteo (UMC).
   * Inicialmente se encuentra vacío.
  */
  umcDatos: Catalogo[] = [];

  /**
   * Clase de alerta.
   */
  class = 'alert-warning';

  /**
   * Configuración de selección de tabla.
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Datos cargados dinámicamente para la tabla SCIAN.
   */
  datosData: ScianModel[] = [];
     /**
   * @property {string[]} seleccionadasPaisDeProcedenciaDatos
   * Lista de países seleccionados como origen.
   */
     seleccionadasPaisDeOriginDatos: string[] = [];
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
    this.scianForm.reset();
    this.scianForm.markAsUntouched();
    this.mensajeDeError = '';
    this.modalInstance.show();
  }

  /**
   * Cierra el modal de clave SCIAN.
   */
  openEstablecimientoModal(): void {
    this.establecimientoModalInstance.show();
    this.abrirModal();
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
      this.modalAddAgentMercanciasInstance = new Modal(
        this.modalAddAgentMercancias.nativeElement
      );
    }
  }

  /**
   * Texto de los manifiestos.
   */
  TEXTOS1 = TEXTOS;
  /**
   * Texto de los manifiestos.
   */
  colapsable1: boolean = true;
  /**
   * Texto de los manifiestos.
   */
  private destroy$ = new Subject<void>();

  /**
   * Configuración de columnas de la tabla de mercancías.
   */
  mercanciasTabla: ConfiguracionColumna<MercanciasInfo>[] = [];

  /**
   * Datos de la tabla de mercancías.
   */
  mercanciasTablaDatos: MercanciasInfo[] = [];
  /**
   * Datos de la tabla mercancías.
   */
  public seleccionados: MercanciasInfo[] = [];

  public scianSeleccionados: ScianModel[] = [];
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los formularios estarán deshabilitados y no se podrán editar.
   * Cuando es `false`, los formularios estarán habilitados para edición.
   */
  esFormularioSoloLectura: boolean = false;

/**
 * Sujeto que se utiliza para notificar la destrucción del componente
 * y cancelar suscripciones de observables con `takeUntil`.
 */
  private destroyNotifier$ = new Subject<void>();

  crosslistPaisDeOriginDatos: Catalogo[] = [];
  /** @property {Catalogo[]} crosslistPaisDeProcedenciaDatos
   * Datos de países para la lista cruzada de país de procedencia.
   * */
  crosslistPaisDeProcedenciaDatos: Catalogo[] = [];
  /** @property {Catalogo[]} crosslistUsoEspecificoDatos
   * Datos de usos específicos para lista cruzada.
   * */
  crosslistUsoEspecificoDatos: Catalogo[] = [];

  
botonOcultar= false;

  /**
   * Indicates whether to show the "Especifique" field for "Tipo de producto"
   */
  showTipoProductoEspecifique: boolean = false;

  /**
   * Indicates whether to show the "Especifique" field for "Estado físico"
   */
  showEstadoFisicoEspecifique: boolean = false;

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
    private domicilioEstablecimientoStore: DatosDelSolicituteSeccionStateStore,
    private domicilioEstablecimientoQuery: DatosDelSolicituteSeccionQuery,
     private consultaioQuery: ConsultaioQuery,
     private catalogoService: CatalogoServices,
     private datosSolicitudService: DatosSolicitudService,
  ) {
   //
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    // this.loadScian();
    this.mercanciasTabla = (this.idProcedimiento === 260917|| this.idProcedimiento===260915 || this.idProcedimiento === 260918)? MERCANCIAS_DATA1 : MERCANCIAS_DATA;
    this.crearAgregarFormulario();
    this.establecerDeshabilitado();
    this.estadoDelServicio();
    this.validarElementos();
    if (this.mostrarNumeroYFecha) {
      this.agregarNumeroYFechaControls();
    } else {
      this.eliminarNumeroYFechaControls();
    }
    this.obtenerScianTablaDatos();


    // 1. Disable all sections by default after form creation
    this.disableSections();

    // 2. Subscribe to radio value changes after form creation (use 'ideGenerica')
    setTimeout(() => {
      if (this.domicilioEstablecimiento && this.domicilioEstablecimiento.get('ideGenerica')) {
        this.domicilioEstablecimiento.get('ideGenerica')?.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((RADIO_VALUE) => {
            if (RADIO_VALUE === undefined || RADIO_VALUE === null || RADIO_VALUE === '') {
              this.disableSections();
              this.botonOcultar=false;
            } else if (RADIO_VALUE === '0') {
              this.enableProrrogaOnly();
              this.botonOcultar=false
            } else if (RADIO_VALUE === '1' || RADIO_VALUE === '2') {
              this.enableSections();
              this.botonOcultar=true;
            } else {
              this.disableSections();
              this.botonOcultar=false;
            }
          });
      }
    }, 0);

    this.consultaioQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((seccionState) => {
        this.esFormularioSoloLectura = seccionState.readonly;
        if (this.esFormularioSoloLectura) {
          this.domicilioEstablecimiento.disable();
          this.solicitudEstablecimientoForm.disable();
        } else {
          const RADIO_VALUE = this.domicilioEstablecimiento.get('ideGenerica')?.value;
          if (RADIO_VALUE === undefined || RADIO_VALUE === null || RADIO_VALUE === '') {
            this.disableSections();
          } else if (RADIO_VALUE === '0' || RADIO_VALUE === '2') {
            this.enableProrrogaOnly();
          } else if (RADIO_VALUE === '1') {
            this.enableSections();
          } else {
            this.disableSections();
          }
        }
      });

  /**
 * Se suscribe a los cambios del campo 'scian' del formulario `scianForm`.
 * 
 * Cada vez que el valor del campo 'scian' cambia, se actualiza automáticamente
 * el campo 'descripcionScian' con el nuevo valor seleccionado, sin emitir 
 * un nuevo evento de cambio (gracias a `emitEvent: false`).
 * 
 * La suscripción se mantiene activa hasta que el observable `destroy$` emite un valor, 
 * lo cual suele hacerse en `ngOnDestroy` para evitar fugas de memoria.
 *
 */
  this.scianForm.get('scian')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((selectedId) => {
      this.scianForm.get('descripcionScian')?.setValue(selectedId, { emitEvent: false });
    });
 // test
  this.formMercancias.get('clasificacion')?.valueChanges
  .pipe(
    skip(1), 
    distinctUntilChanged(),
    takeUntil(this.destroy$)) 
  .subscribe((selectedId) => {
    if(selectedId){
      this.obtenerEspecificarProductoCatalogoDatos(selectedId);
    } else {
      this.especificarProductoDatos = [];
      this.formMercancias.get('especificarClasificacionProducto')?.setValue(null);
    }
  });

  this.formMercancias.get('tipoDeProducto')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((selectedValue) => {
      const selectedOption = this.tipoProductoDatos.find(item => item.clave === selectedValue);
      this.showTipoProductoEspecifique = selectedOption?.descripcion?.toLowerCase().includes('otro') || false;
      
      if (this.showTipoProductoEspecifique) {
        this.formMercancias.get('tipoDeProductoEspecifique')?.setValidators([
          Validators.required, 
          Validators.maxLength(100),
          this.noOnlySpacesValidator
        ]);
      } else {
        this.formMercancias.get('tipoDeProductoEspecifique')?.clearValidators();
        this.formMercancias.get('tipoDeProductoEspecifique')?.setValue('');
      }
      this.formMercancias.get('tipoDeProductoEspecifique')?.updateValueAndValidity();
    });

  this.formMercancias.get('estadoFisico')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((selectedValue) => {
      const selectedOption = this.estadoFisicoDatos.find(item => item.clave === selectedValue);
      this.showEstadoFisicoEspecifique = selectedOption?.descripcion?.toLowerCase().includes('otro') || false;
      
      if (this.showEstadoFisicoEspecifique) {
        this.formMercancias.get('estadoFisicoEspecifique')?.setValidators([
          Validators.required, 
          Validators.maxLength(200),
          this.noOnlySpacesValidator
        ]);
      } else {
        this.formMercancias.get('estadoFisicoEspecifique')?.clearValidators();
        this.formMercancias.get('estadoFisicoEspecifique')?.setValue('');
      }
      this.formMercancias.get('estadoFisicoEspecifique')?.updateValueAndValidity();
    });


    this.obtenerEstadoCatalogoDatos();
    this.obtenerRegimenCatalogoDatos();
    this.obtenerAduanasCatalogoDatos();
    this.obtenerScianCatalogoDatos();
    this.obtenerClasificacionProductoCatalogoDatos();
    this.obtenerTipoProductoCatalogoDatos();
    this.obtenerFormaFarmaceuticaCatalogoDatos();
    this.obtenerEstadoFisicoCatalogoDatos();
    this.obtenerUmcCatalogoDatos();
    this.obtenerPaisesOrigenCatalogoDatos();
    this.obtenerPaisesProcedenciaCatalogoDatos();
    this.obtenerUsoEspecificoCatalogoDatos();  
  }

  validarElementos(): void {
    const FORMAFARMACEUTICA = this.formMercancias.get('estadoFormaFarmaceutica');
    if (this.idProcedimiento === 260917 || this.idProcedimiento === 260918){
      FORMAFARMACEUTICA?.clearValidators();
    }
    FORMAFARMACEUTICA?.updateValueAndValidity();
  }

   disableSections(): void {
    Object.keys(this.domicilioEstablecimiento.controls).forEach(key => {
      if (key !== 'ideGenerica') {
        this.domicilioEstablecimiento.get(key)?.disable();
      } else {
        this.domicilioEstablecimiento.get(key)?.enable();
      }
    });
    // Radio option remains enabled
    this.solicitudEstablecimientoForm.disable();
  }

   enableSections(): void {
    if (!this.esFormularioSoloLectura) {
      Object.keys(this.domicilioEstablecimiento.controls).forEach(key => {
        if (key !== 'ideGenerica') {
          this.domicilioEstablecimiento.get(key)?.enable();
        }
      });
      // Explicitly enable Estado, Régimen, Aduanas de entradas
      this.domicilioEstablecimiento.get('establecimientoEstados')?.enable();
      this.solicitudEstablecimientoForm.get('regimen')?.enable();
      this.solicitudEstablecimientoForm.get('aduanasEntradas')?.enable();
      this.solicitudEstablecimientoForm.enable();
    }
  }

  enableProrrogaOnly(): void {
    if (!this.esFormularioSoloLectura) {
      Object.keys(this.domicilioEstablecimiento.controls).forEach(key => {
        if (key !== 'ideGenerica') {
          this.domicilioEstablecimiento.get(key)?.disable();
        } else {
          this.domicilioEstablecimiento.get(key)?.enable();
        }
      });
      this.domicilioEstablecimiento.get('observaciones')?.enable();
      this.solicitudEstablecimientoForm.disable();
    }
  }

  /**
   * @method cargarDatosDesdeApi
   * @description
   * Este método obtiene los datos de mercancías desde el servicio `EstablecimientoService`
   * y los agrega al arreglo `mercanciasTablaDatos`.
   */
  cargarDatosDesdeApi(): void {
    this.establecimientoService.getMercancias().pipe(takeUntil(this.destroy$))
      .subscribe((response: MercanciasInfo[]) => {
        response?.forEach((resp: MercanciasInfo) => {
          this.mercanciasTablaDatos = [...this.mercanciasTablaDatos, resp];
          this.domicilioEstablecimientoStore.setMercanciaDatos(this.mercanciasTablaDatos);
        })
      });
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

onScianSeleccionChange(event:any): void {
  this.scianSeleccionados = event;
}
/**
 * @method loadScian
 * @description 
 * Carga los datos SCIAN desde el servicio `EstablecimientoService`
 * y los asigna al formulario `scianForm`.
 */
eliminarSeleccionados(): void {
  this.seleccionados.forEach(row => {
    const INDEX = this.mercanciasTablaDatos.findIndex(
      item => item.cantidadUMC === row.cantidadUMC
    );
    if (INDEX > -1) {
      this.mercanciasTablaDatos.splice(INDEX, 1);
    }
  });
  this.mercanciasTablaDatos = [...this.mercanciasTablaDatos];
  this.seleccionados = [];
}

modificarMercancias(): void {
  if(this.seleccionados.length > 0){
    this.modifyMercanciaBotons = true;
    this.modalAddAgentMercanciasInstance.show();
    const DATOS = this.seleccionados[0];
    this.formMercancias.patchValue({
      clasificacion: DATOS.clasificacion,
      especificarClasificacionProducto: DATOS.especificar,
      denominacionEspecifica: DATOS.denominacionEspecifica,
      denominacionComun: DATOS.denominacionComun,
      tipoDeProducto: DATOS.tipoProducto,
      tipoDeProductoEspecifique: (DATOS as any).tipoProductoEspecifique || '',
      estadoFisico: DATOS.estadoFisico,
      estadoFisicoEspecifique: (DATOS as any).estadoFisicoEspecifique || '',
      estadoFormaFarmaceutica: DATOS.estadoFormaFarmaceutica,
      fraccionArancelaria: DATOS.fraccionArancelaria,
      descripcionFraccion: DATOS.descripcionFraccion,
      cantidadUMT: DATOS.cantidadUMT,
      UMT: DATOS.unidadUMT,
      cantidadUMC: DATOS.cantidadUMC,
      UMC: DATOS.unidad,
      presentacion: DATOS.presentacion,
      seleccionadasPaisDeOriginDatos: DATOS.paisDeOrigen,
      seleccionadasPaisDeProcedenciaDatos: DATOS.paisDeProcedencia,
      seleccionadasEspecificoDatos: DATOS.usoEspecifico,
      denominacionDistintiva: DATOS.denominacionDistintiva,
    });
    this.seleccionadasPaisDeOriginDatos = Array.isArray(DATOS.paisDeOrigen)
    ?DATOS.paisDeOrigen
    :DATOS.paisDeOrigen
      ? [DATOS.paisDeOrigen]
      : [];
    this.seleccionadasPaisDeProcedenciaDatos = Array.isArray(DATOS.paisDeProcedencia)
    ?DATOS.paisDeProcedencia:DATOS.paisDeProcedencia? [DATOS.paisDeProcedencia]: [];
    this.seleccionadasEspecificoDatos = Array.isArray(DATOS.usoEspecifico)?[DATOS.usoEspecifico]:DATOS.usoEspecifico? [DATOS.usoEspecifico]: [];
  }
}

  /**
  * @method obtenerScianTablaDatos
  * @description
  * Método que obtiene los datos de la tabla SCIAN desde el servicio `EstablecimientoService` y los agrega al arreglo `personaparas`.
  */
  obtenerScianTablaDatos(): void {
   
   this.domicilioEstablecimientoQuery.datosTabla$
   .pipe(takeUntil(this.destroy$))
   .subscribe(datosData => {
     this.datosData = datosData ?? [];
     this.datosData=[...this.datosData];
   });
  }

  eliminarScianSeleccionados(): void {
    this.scianSeleccionados.forEach(row => {
      const INDEX = this.datosData.findIndex(
        item => item.claveScian=== row.claveScian
      );
      if (INDEX > -1) {
        this.datosData.splice(INDEX, 1);
      }
    });
    this.datosData = [...this.datosData];
    this.scianSeleccionados = [];
  }

 

 

  /**
   * Método que agrega los controles 'numeroRegistro' y 'fechaCaducidad' al formulario
   * cuando la condición mostrarNumeroYFecha es verdadera.
   */
  agregarNumeroYFechaControls(): void {
    this.formMercancias.addControl(
      'numeroRegistro',
      this.fb.control('', Validators.required)
    );
    this.formMercancias.addControl('fechaCaducidad', this.fb.control(''));
  }

  /**
   * Método que elimina los controles 'numeroRegistro' y 'fechaCaducidad' del formulario
   * cuando la condición mostrarNumeroYFecha es falsa.
   */
  eliminarNumeroYFechaControls(): void {
    this.formMercancias.removeControl('numeroRegistro');
    this.formMercancias.removeControl('fechaCaducidad');
  }

  /*
   * Método para manejar el evento de cierre del modal.
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
        this.mercanciasTablaDatos = state.mercanciaDatos || [];
      });
    this.domicilioEstablecimientoQuery
      .select()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.solicitudEstablecimientoForm.patchValue(state, {
          emitEvent: false,
        });
      });
    this.domicilioEstablecimientoQuery
      .select()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.manifiestos.patchValue(state, {
          emitEvent: false,
        });
      });
    this.domicilioEstablecimientoQuery
      .select()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.representante.patchValue(state, {
          emitEvent: false,
        });
      });
  }

  static numeroUMCDecimalesValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const VALUE = control.value;
        
        // Skip validation if empty
        if (!VALUE) {
          return null;
        }
        
        // Regex pattern: up to 12 digits before decimal, up to 10 after
        const PATTERN = /^\d{1,12}(\.\d{1,10})?$/;
        
        if (!PATTERN.test(VALUE)) {
          return { formatoInvalido: true };
        }
        
        return null;
      };
    }

    public getStoreState(): any {
      return this.domicilioEstablecimientoQuery.getValue();
    }

  /**
   * Método de limpieza del componente.
   * Se utiliza para liberar recursos y evitar fugas de memoria.
   */
  crearAgregarFormulario(): void {
    this.domicilioEstablecimiento = this.fb.group({
      ideGenerica: ['', Validators.required],
      observaciones: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(2000)]],
      establecimientoRFCResponsableSanitario: ['', (this.idProcedimiento !== 260917 && this.idProcedimiento !== 260918)
        ? [Validators.required, Validators.pattern(REGEX_RFC), Validators.maxLength(13)]
        : [Validators.pattern(REGEX_RFC), Validators.maxLength(13)]
    ],
      establecimientoRazonSocial:['',[Validators.required,this.noOnlySpacesValidator]],
      establecimientoCorreoElectronico :['', [Validators.required, Validators.email,this.noOnlySpacesValidator]],
      establecimientoEstados :['', Validators.required],
      descripcionMunicipio: ['', [Validators.required, Validators.maxLength(120), this.noOnlySpacesValidator]],
      localidad: ['',[Validators.pattern(REGEX_IMPORTE_PAGO)]],
      establishomentoColonias: [''],
      calle: ['', [Validators.required,this.noOnlySpacesValidator]],
      lada: ['', [ Validators.pattern(REGEX_SOLO_DIGITOS)]],
      telefono: ['', [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS),Validators.maxLength(30), this.noOnlySpacesValidator]],
      establecimientoDomicilioCodigoPostal :['', [Validators.required,Validators.maxLength(12), Validators.pattern(REGEX_SOLO_DIGITOS), this.noOnlySpacesValidator]],
    });
    this.scianForm = this.fb.group({
      scian: ['', Validators.required],
      descripcionScian: [{ value: '', disabled: true }],
    });

    this.solicitudEstablecimientoForm = this.fb.group({
      noLicenciaSanitaria:[''],
      avisoCheckbox: [false],
      licenciaSanitaria: [{ value: '', disabled: true }],
      regimen: ['', Validators.required],
      aduanasEntradas: ['', Validators.required],
      aifaCheckbox: [false],
    });

  if(this.showProgramaImmexFields) {
    this.solicitudEstablecimientoForm.addControl('immexProgramNumber', this.fb.control('',Validators.required));
    this.solicitudEstablecimientoForm.addControl('ano', this.fb.control('',Validators.required));
  }

  if(this.mostrarPermisoImportacionCNSNS) {
    this.solicitudEstablecimientoForm.addControl('importPermitNumberCNSNS', this.fb.control(''));
  }

    this.formMercancias = this.fb.group({
      clasificacion: ['', Validators.required],
      especificarClasificacionProducto: ['', Validators.required],
      denominacionEspecifica: ['', [Validators.required,this.noOnlySpacesValidator]],
      denominacionComun: ['', Validators.required],
      tipoDeProducto: ['', Validators.required],
      tipoDeProductoEspecifique: [''],
      estadoFisico: ['', Validators.required],
      estadoFisicoEspecifique: [''],
      estadoFormaFarmaceutica: ['', Validators.required],
      fraccionArancelaria: ['', [Validators.required, Validators.minLength(8),Validators.pattern(SOLO_REGEX_NUMEROS),]],
      descripcionFraccion: [ { value: '', disabled: true }, Validators.required],
      cantidadUMT: ['', [Validators.required,Validators.pattern(SOLO_REGEX_NUMEROS)]],
      UMT: [{ value: '', disabled: true }, Validators.required],
      cantidadUMC: ['', [Validators.required,Validators.pattern(SOLO_REGEX_NUMEROS),DatosDelSolicitudModificacionComponent.numeroUMCDecimalesValidator()]],
      UMC: ['', Validators.required],
      presentacion: ['', [Validators.required, this.noOnlySpacesValidator, Validators.maxLength(250)]],
      seleccionadasPaisDeOriginDatos: ['', Validators.required],
      seleccionadasPaisDeProcedenciaDatos: ['', Validators.required],
      seleccionadasEspecificoDatos: ['', Validators.required],
      denominacionDistintiva:['', Validators.required],
    });
    this.manifiestos = this.fb.group({
      manifesto: [false, Validators.required],
      informacionConfidencial: [false, Validators.required],
    });
    this.representante = this.fb.group({
      rfc: [ '', 
              Validators.required
            ],
            nombre: [
              { value: '', disabled: true }, 
              Validators.required
            ],
            apellidoPaterno: [
              { value: '', disabled: true }, 
              Validators.required
            ],
            apellidoMaterno: [
              { value: '', disabled: true }
            ],
    });

  }

  /**
   * Simula la obtención de nuevos valores y actualiza el formulario
   * @remarks
   * Este método es de demostración y debería ser reemplazado con lógica real
   */
  obtenerValor(): void {
    const PAYLOAD = {
      rfcRepresentanteLegal: this.representante.get("rfc")?.value,
    }
    this.establecimientoService.buscar(PAYLOAD).subscribe(response => {
      if (response['datos'] && Array.isArray(response['datos']) && response['datos'].length > 0) {
        const DATA = response['datos'][0];
        this.representante.get('nombre')?.enable();
        this.representante.get('apellidoPaterno')?.enable();
        this.representante.get('apellidoMaterno')?.enable();
        
        this.representante.patchValue({
          nombre: DATA.nombre || '',
          apellidoPaterno: DATA.apellidoPaterno || '',
          apellidoMaterno: DATA.apellidoMaterno || '',
        });
        this.domicilioEstablecimientoStore.setRepresentanteApellidos(this.representante.get('apellidoPaterno')?.value, this.representante.get('apellidoMaterno')?.value);
        this.representante.get('nombre')?.disable();
        this.representante.get('apellidoPaterno')?.disable();
        this.representante.get('apellidoMaterno')?.disable();
      }
    });
  }
  
  /**
   * Deshabilita el campo "observaciones" del formulario de domicilio
   */
  establecerDeshabilitado(): void {
    this.domicilioEstablecimiento
      .get('ideGenerica')
      ?.valueChanges.subscribe((value) => {
        if (value === 'modificacion') {
          this.domicilioEstablecimiento.get('observaciones')?.enable();
        } else {
          this.domicilioEstablecimiento.get('observaciones')?.disable();
        }
      });
  }

   /**
   * Maneja el evento de cambio para las selecciones de país de procedencia.
   *
   * @param events - Un arreglo de cadenas que representa los países seleccionados.
   *
   * Actualiza la propiedad `seleccionadasPaisDeProcedenciaDatos` con los valores seleccionados
   * y sincroniza el formulario `mercanciaForm` con los datos actualizados.
   */
   paisDeProcedenciaSeleccionadasChange(events: string[]): void {
    this.seleccionadasPaisDeProcedenciaDatos = events;
    this.formMercancias.patchValue({
      seleccionadasPaisDeProcedenciaDatos: events,
    });
  }

  
  /**
   * Alterna el estado colapsable de la sección "Uno".
   *
   * Este método cambia el valor de la propiedad `colapsable1` entre `true` y `false`.
   * Se utiliza para mostrar u ocultar dinámicamente el contenido de una sección en la interfaz de usuario.
   *
   * Comportamiento:
   * - Si `colapsable1` es `true`, se establece en `false` y la sección se oculta.
   * - Si `colapsable1` es `false`, se establece en `true` y la sección se muestra.
   */
  mostrarColapsable(): void {
    this.colapsable1 = !this.colapsable1;
  }
  /**
   * Carga los datos del catálogo SCIAN.
   */
  loadScian(): void {
    this.establecimientoService
      .getSciandata(this.tramiteID).pipe(takeUntil(this.destroy$))
      .subscribe((resp: Catalogo[]) => {
        this.scianJson = resp;
      });
  }

  /**
   * Maneja el cambio de selección en el dropdown de clave SCIAN.
   * Filtra y actualiza las opciones del dropdown de descripción.
   *
   * @param event - El evento de cambio del dropdown
   */
  onScianClaveChange(event: Event): void {
    const TARGET = event.target as HTMLSelectElement;
    const SELECTED_CLAVE = TARGET?.value || '';    
    if (SELECTED_CLAVE) {
      this.scianDescripcionDatos = this.scianDatos.filter(item => item.clave === SELECTED_CLAVE);
      
      if (this.scianDescripcionDatos.length > 0) {
        this.scianForm.patchValue({
          descripcionScian: this.scianDescripcionDatos[0].clave
        });
      }
    } else {
      this.scianDescripcionDatos = [];
      this.scianForm.patchValue({
        descripcionScian: ''
      });
    }
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
      this.mensajeDeError = '';
    }
  }
  
  /**
   * @method abrirModal
   * @description
   * Este método abre el modal activo utilizando la instancia del modal de Bootstrap.
   * Verifica si la instancia del modal (`modalInstance`) está definida antes de intentar abrirlo.
   *
   * @returns void
   */
  enCambioDeControl(formName: string, controlName: string): void {
    let formGroup: FormGroup;

    switch (formName) {
      case 'scianForm':
        formGroup = this.scianForm;
        break;
      case 'domicilioEstablecimiento':
        formGroup = this.domicilioEstablecimiento;
        break;
      case 'solicitudEstablecimientoForm':
        formGroup = this.solicitudEstablecimientoForm;
        break;
      case 'manifiestos':
        formGroup = this.manifiestos;
        break;
      case 'representante':
        formGroup = this.representante;
        break;
      default:
        return;
    }

    // Handle representante form updates differently
    if (formName === 'representante') {
      const value = formGroup.get(controlName)?.value;
      // eslint-disable-next-line default-case
      switch (controlName) {
        case 'rfc':
          this.domicilioEstablecimientoStore.update({ representanteRfc: value });
          break;
        case 'nombre':
          this.domicilioEstablecimientoStore.update({ representanteNombre: value });
          break;
        case 'apellidoPaterno':
          this.domicilioEstablecimientoStore.update({ apellidoPaterno: value });
          break;
        case 'apellidoMaterno':
          this.domicilioEstablecimientoStore.update({ apellidoMaterno: value });
          break;
      }
    } else {
    // Obtener el valor actualizado del control
    const UPDATED_VALUE = {
      [controlName]: formGroup.get(controlName)?.value,
    };

    //Actualizar la tienda o el servicio con el valor actualizado
    this.domicilioEstablecimientoStore.update(UPDATED_VALUE);
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
   * Guarda un nuevo dato SCIAN y lo agrega a la tabla.
   */
  guardarScian(): void {
    this.mensajeDeError = '';
     if (this.scianForm.invalid) {
    this.scianForm.markAllAsTouched();
    this.mensajeDeError = 'Faltan campos por capturar.';
    return;
  }
    if (this.scianForm.valid) {
    const CLAVE_SELECCIONADA = this.scianForm.get('scian')?.value;
    const DESCRIPCIION_SELECCIONADA = this.scianDatos.find(item => item.clave === CLAVE_SELECCIONADA)?.descripcion || '';

    const SCIAN_DATA: ScianModel = {
      claveScian: CLAVE_SELECCIONADA,
      descripcionScian: DESCRIPCIION_SELECCIONADA,
    };
      this.datosData.push(SCIAN_DATA);
      this.datosData = [...this.datosData];
      this.domicilioEstablecimientoStore.setScianTabla(this.datosData);

      this.scianForm.reset();
      this.mensajeDeError = '';

      this.closeScianModal();
    }
  }
  /**
   * Maneja el evento de cambio para las selecciones de país de procedencia.
   *
   * @param events - Un arreglo de cadenas que representa los países seleccionados.
   *
   * Actualiza la propiedad `seleccionadasPaisDeProcedenciaDatos` con los valores seleccionados
   * y sincroniza el formulario `mercanciaForm` con los datos actualizados.
   */
  paisDeOriginSeleccionadasChange(events: string[]): void {
    this.seleccionadasPaisDeOriginDatos = events;
    this.formMercancias.patchValue({
      seleccionadasPaisDeOriginDatos: events,
    });
  }

  especificoSeleccionadasChange(events: string[]): void {
    this.seleccionadasEspecificoDatos = events;
    this.formMercancias.patchValue({
      seleccionadasEspecificoDatos: events,
    });
  }
  /**
   * compo docs
   * @description
   * Este método guarda los datos de una mercancía ingresados en el formulario `formMercancias`.
   * Si el formulario es válido, se crea un objeto `MERCANCIA` con los valores del formulario,
   * se agrega a la tabla de datos `mercanciasTablaDatos`, y luego se reinicia el formulario.
   */

  guardarMarcancia(): void {
    
    this.mensajeDeError = '';
    if (this.formMercancias.valid) {
      const MERCANCIA: MercanciasInfo = {
        clasificacion: this.formMercancias.get('clasificacion')?.value,
        especificar: this.formMercancias.get('especificarClasificacionProducto')
          ?.value,
        denominacionEspecifica: this.formMercancias.get(
          'denominacionEspecifica'
        )?.value,
        denominacionDistintiva: this.formMercancias?.get(
          'denominacionDistintiva'
        )?.value,
        denominacionComun: this.formMercancias.get('denominacionComun')?.value,
        formaFarmaceutica: this.formMercancias.get('tipoDeProducto')?.value,
        estadoFisico: this.formMercancias.get('estadoFisico')?.value,
        estadoFormaFarmaceutica: this.formMercancias.get(
          'estadoFormaFarmaceutica'
        )?.value,
        fraccionArancelaria: this.formMercancias.get('fraccionArancelaria')
          ?.value,
        descripcionFraccion: this.formMercancias.get('descripcionFraccion')
          ?.value,
        unidadUMT: this.formMercancias.get('UMT')?.value,
        cantidadUMT: this.formMercancias.get('cantidadUMT')?.value,
        unidad: this.formMercancias.get('UMC')?.value,
        cantidadUMC: this.formMercancias.get('cantidadUMC')?.value,
        presentacion: this.formMercancias.get('presentacion')?.value,
        numeroRegistro: this.formMercancias.get('numeroRegistro')?.value,
      
        tipoProducto: this.formMercancias.get('tipoDeProducto')?.value,
        tipoProductoEspecifique: this.formMercancias.get('tipoDeProductoEspecifique')?.value || '',
        estadoFisicoEspecifique: this.formMercancias.get('estadoFisicoEspecifique')?.value || '',
        //usoEspecifico: this.formMercancias.get('usoEspecifico')?.value,
        paisDeOrigen: this.formMercancias.get('seleccionadasPaisDeOriginDatos')?.value,

        paisDeProcedencia:this.formMercancias.get('seleccionadasPaisDeProcedenciaDatos')?.value,
       
        usoEspecifico:this.formMercancias.get('seleccionadasEspecificoDatos')?.value,
        paisOrigenDatosClave: this.crosslistPaisDeOriginDatos.filter((pais) => this.seleccionadasPaisDeOriginDatos.includes(pais.descripcion)).map((paise) => paise.clave).filter((clave): clave is string => typeof clave === 'string'),
        paisProcedenciaDatosClave: this.crosslistPaisDeProcedenciaDatos.filter((pais) => this.seleccionadasPaisDeProcedenciaDatos.includes(pais.descripcion)).map((paise) => paise.clave).filter((clave): clave is string => typeof clave === 'string'),
        usoEspecificoDatosClave: this.crosslistUsoEspecificoDatos.filter((uso) => this.seleccionadasEspecificoDatos.includes(uso.descripcion)).map((usoespeci) => usoespeci.clave).filter((clave): clave is string => typeof clave === 'string'),
        

      };
  
      const INDEX = this.mercanciasTablaDatos.findIndex(
        item => item.cantidadUMC === MERCANCIA.cantidadUMC
      );
  
      if (INDEX > -1) {
       
        this.mercanciasTablaDatos[INDEX] = MERCANCIA;
        this.mercanciasTablaDatos = [...this.mercanciasTablaDatos];
      } else {
       
        this.mercanciasTablaDatos = [...this.mercanciasTablaDatos, MERCANCIA];
      }
      this.domicilioEstablecimientoStore.setMercanciaDatos(this.mercanciasTablaDatos);
     // this.mercanciasTablaDatos = [...this.mercanciasTablaDatos, MERCANCIA];
      this.formMercancias.reset();
      this.seleccionadasPaisDeOriginDatos= [];
  this.seleccionadasPaisDeProcedenciaDatos= [];
  this.seleccionadasEspecificoDatos= [];
      
      this.markTouchedPaisOrigen = false;
      this.markTouchedPaisProcedencia = false;
      this.markTouchedUsoEspecifico = false;
      
      this.showTipoProductoEspecifique = false;
      this.showEstadoFisicoEspecifique = false;
      this.cerrarModalMercancía();
    
  }else{
      this.formMercancias.markAllAsTouched();
      
      this.markTouchedPaisOrigen = true;
      this.markTouchedPaisProcedencia = true;
      this.markTouchedUsoEspecifico = true;
      
      this.mensajeDeError = 'Faltan campos por capturar.';
      return;
    }
   
  }

  limpiarMercancia(): void { 
  this.abrirModalMercancia();
  this.formMercancias.reset();
  this.seleccionadasPaisDeOriginDatos= [];
  this.seleccionadasPaisDeProcedenciaDatos= [];
  this.seleccionadasEspecificoDatos= [];
  
  // Reset crosslist validation states
  this.markTouchedPaisOrigen = false;
  this.markTouchedPaisProcedencia = false;
  this.markTouchedUsoEspecifico = false;
  
  this.showTipoProductoEspecifique = false;
  this.showEstadoFisicoEspecifique = false;
}
  /* *
   * Método para eliminar un elemento de la tabla de mercancías.
   * @param index Índice del elemento a eliminar.
   **/
  validationMessages = MENSAJE_DE_VALIDACI0N;
  /**
   * * Método para obtener el mensaje de error de un control específico en el formulario.
   * @param controlName Nombre del control en el formulario.
   * @returns Mensaje de error o null si no hay error.
   *
   * */
  getErrorMessage(controlName: string): string | null {
    const CONTROL = this.formMercancias.get(controlName);
    if (
      CONTROL &&
      CONTROL.hasError('required') &&
      (CONTROL.touched || CONTROL.dirty)
    ) {
      return this.validationMessages[controlName];
    }
    return null;
  }

  /**
   * Get error message for especifique fields
   */
  getEspecifiqueErrorMessage(controlName: string, maxLength: number): string | null {
    const CONTROL = this.formMercancias.get(controlName);
    if (CONTROL && (CONTROL.touched || CONTROL.dirty)) {
      if (CONTROL.hasError('required')) {
        return 'Este campo es obligatorio';
      }
      if (CONTROL.hasError('maxlength')) {
        return `El campo no debe exceder los ${maxLength} caracteres`;
      }
    }
    return null;
  }

  /**
   * Abre el modal SCIAN.
   */
  openScianModal(): void {
    this.modalInstance.show();
  }

  /**
   * Cierra el modal SCIAN.
   */
  closeScianModal(): void {
    this.modalInstance.hide();
  }

  /**
   * Abre el modal SCIAN.
   */
  abrirModalMercancia(): void {
    this.markTouchedPaisOrigen = false;
    this.markTouchedPaisProcedencia = false;
    this.markTouchedUsoEspecifico = false;
    this.mensajeDeError = '';
    
    this.crossList.forEach(crosslist => {
      crosslist.markControlsAsTouched();
    });

    let hasValidationErrors = false;
    this.crossList.forEach(crosslist => {
      if (crosslist.required && crosslist.fechasSeleccionadas.length === 0) {
        hasValidationErrors = true;
      }
    });

    if (hasValidationErrors) {
      return;
    }
    
    this.modifyMercanciaBotons=false;
    this.modalAddAgentMercanciasInstance.show();
  }

  /**
   * Cierra el modal SCIAN.
   */
  cerrarModalMercancía(): void {
    this.markTouchedPaisOrigen = false;
    this.markTouchedPaisProcedencia = false;
    this.markTouchedUsoEspecifico = false;
    this.mensajeDeError = '';
    
    this.modalAddAgentMercanciasInstance.hide();
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
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Método para crear el formulario.
   */
  static hasError(form: FormGroup, controlName: string, error: string): boolean | undefined {
    return (
      form.get(controlName)?.touched && form.get(controlName)?.hasError(error)
    );
  }
cambiarFraccionArancelaria(): void {
    const FRACCION = this.formMercancias.get('fraccionArancelaria')?.value;
    if (!FRACCION || FRACCION.length < 8) {
      this.formMercancias.get('descripcionFraccion')?.setValue('');
      this.formMercancias.get('UMT')?.setValue('');
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
              this.formMercancias.get('descripcionFraccion')?.setValue(DATOS_FRACCION.descripcionAlternativa);
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
              this.formMercancias.get('UMT')?.setValue(DATOS_UMT.descripcion);
            } else {
              this.abrirModal();
            }
          }
        );
      }
    }
  }
/**
 * Obtiene los datos del catálogo de estados para el procedimiento actual
 * y los asigna a la propiedad `estado`. Maneja el observable con `takeUntil`.
 */
obtenerEstadoCatalogoDatos(): void {
    if (this.idProcedimiento){
  this.catalogoService.estadosCatalogo(this.idProcedimiento?.toString())
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.estado.catalogos = (response?.datos ?? []) as Catalogo[];
        this.estado.primerOpcion = 'Seleccione una opción';
    }
  });
}
}

/**
 * Obtiene los datos del catálogo de regímenes para el procedimiento actual
 * y los asigna a la propiedad `regimenDatos`. Maneja el observable con `takeUntil`.
 */
obtenerRegimenCatalogoDatos(): void {
  if (this.idProcedimiento){
  this.catalogoService.regimenesCatalogo(this.idProcedimiento?.toString())
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.regimenDatos = response?.datos ?? []
    }
  });
}
}

/**
 * Obtiene los datos del catálogo de aduanas para el procedimiento actual
 * y los asigna a la propiedad `aduanasDatos`. Maneja el observable con `takeUntil`.
 */
obtenerAduanasCatalogoDatos(): void {
  if (this.idProcedimiento){
  this.catalogoService.aduanasCatalogo(this.idProcedimiento?.toString())
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.aduanasDatos = response?.datos ?? []
    }
  });
}
}

/**
 * Obtiene los datos del catálogo SCIAN para el procedimiento actual
 * y los asigna a la propiedad `scianDatos`. Maneja el observable con `takeUntil`.
 */
obtenerScianCatalogoDatos(): void {
  if (this.idProcedimiento){
  this.catalogoService.scianCatalogo(this.idProcedimiento?.toString())
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.scianDatos = response?.datos ?? []
    }
  });
}
}

/**
 * Obtiene los datos del catálogo de clasificación de productos para el procedimiento actual
 * y los asigna a la propiedad `clasificacionProductoDatos`. Maneja el observable con `takeUntil`.
 */
obtenerClasificacionProductoCatalogoDatos(): void {
  if (this.idProcedimiento){
  this.catalogoService.clasificacionProductoCatalogo(this.idProcedimiento?.toString(),this.idBaseProcedimiento?.toString())
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.clasificacionProductoDatos = response?.datos ?? []
    }
  });
}
}

/**
 * Obtiene los datos del catálogo para especificar productos del procedimiento actual
 * y los asigna a la propiedad `especificarProductoDatos`. Maneja el observable con `takeUntil`.
 */
obtenerEspecificarProductoCatalogoDatos(parentClave: string): void {
  if (this.idProcedimiento && parentClave) {
    this.catalogoService.especificarClasificacionProductoCatalogo(
      this.idProcedimiento.toString(),
      parentClave
    )
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.especificarProductoDatos = response?.datos ?? [];
        this.formMercancias.get('especificarClasificacionProducto')?.setValue(null);
      }
    });
  }
}

/**
 * Obtiene los datos del catálogo de tipos de producto para el procedimiento actual
 * y los asigna a la propiedad `tipoProductoDatos`. Maneja el observable con `takeUntil`.
 */
obtenerTipoProductoCatalogoDatos(): void {
  if (this.idProcedimiento){
  this.catalogoService.tiposProductoCatalogo(this.idProcedimiento?.toString(), this.idBaseProcedimiento?.toString())
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.tipoProductoDatos = response?.datos ?? []
    }
  });
}
}

/**
 * Obtiene los datos del catálogo de formas farmacéuticas para el procedimiento actual
 * y los asigna a la propiedad `formaFarmaceuticaDatos`. Maneja el observable con `takeUntil`.
 */
obtenerFormaFarmaceuticaCatalogoDatos(): void {
  if (this.idProcedimiento){
  this.catalogoService.formaFarmaceuticaCatalogo(this.idProcedimiento?.toString())
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.formaFarmaceuticaDatos = response?.datos ?? []
    }
  });
}
}

/**
 * Obtiene los datos del catálogo de estados físicos de la mercancía para el procedimiento actual
 * y los asigna a la propiedad `estadoFisicoDatos`. Maneja el observable con `takeUntil`.
 */
obtenerEstadoFisicoCatalogoDatos(): void {
  if (this.idProcedimiento){
  this.catalogoService.estadoFisicoMercanciaCatalogo(this.idProcedimiento?.toString())
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.estadoFisicoDatos = response?.datos ?? []
    }
  });
  }
}

/**
 * Obtiene los datos del catálogo de unidades de medida comercial (UMC) para el procedimiento actual
 * y los asigna a la propiedad `umcDatos`. Maneja el observable con `takeUntil`.
 */
obtenerUmcCatalogoDatos(): void {
  if (this.idProcedimiento){
  this.catalogoService.unidadesMedidaComercialCatalogo(this.idProcedimiento?.toString())
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.umcDatos = response?.datos ?? []
    }
  });
}
}

/**
 * Obtiene el catálogo de países de origen para el procedimiento actual
 * y asigna sus descripciones a la propiedad `seleccionarOrigenDelPais`.
 * La llamada al servicio se gestiona utilizando `takeUntil` para evitar fugas de memoria.
 */
obtenerPaisesOrigenCatalogoDatos(): void {
  if (this.idProcedimiento){
  this.catalogoService.paisesCatalogo(this.idProcedimiento?.toString())
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.crosslistPaisDeOriginDatos = response?.datos ?? [];
         this.seleccionarOrigenDelPais = (response?.datos ?? []).map((item: Catalogo) => item.descripcion);
    }
  });
}
}

/**
 * Obtiene el catálogo de países de procedencia para el procedimiento actual
 * y asigna sus descripciones a la propiedad `seleccionarOrigenDelPaisDos`.
 * La suscripción al servicio se controla con `takeUntil` para evitar fugas de memoria.
 */
obtenerPaisesProcedenciaCatalogoDatos(): void {
  if (this.idProcedimiento){
  this.catalogoService.paisesCatalogo(this.idProcedimiento?.toString())
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.crosslistPaisDeProcedenciaDatos = response?.datos ?? [];
        this.seleccionarOrigenDelPaisDos = (response?.datos ?? []).map((item: Catalogo) => item.descripcion);
      }
  });
}
}

/**
 * Obtiene el catálogo de usos específicos de la mercancía para el procedimiento actual
 * y asigna sus descripciones a la propiedad `seleccionarOrigenDelPaisTres`.
 * Gestiona la suscripción con `takeUntil` para prevenir fugas de memoria.
 */
obtenerUsoEspecificoCatalogoDatos(): void {
  if (this.idProcedimiento){
  this.catalogoService.usosEspecificoMercanciaCatalogo(this.idProcedimiento?.toString(), this.idProcedimiento?.toString())
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.crosslistUsoEspecificoDatos = response?.datos ?? [];
        this.seleccionarOrigenDelPaisTres = (response?.datos ?? []).map((item: Catalogo) => item.descripcion)
    }
  });
}
}
formularioSolicitudValidacion(): boolean {
  this.isContinuarButtonClicked = true;
  const isValid = this.domicilioEstablecimiento.valid && this.solicitudEstablecimientoForm.valid;
  if (!isValid) {
    this.domicilioEstablecimiento.markAllAsTouched();
    this.solicitudEstablecimientoForm.markAllAsTouched();
  }
  return isValid? true : false;
}
}