import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  AlertComponent,
  CatalogoSelectComponent,
  CrosslistComponent,
  InputFecha,
  InputFechaComponent,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  REGEX_DECIMAL,
  SOLO_REGEX_NUMEROS,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  ValidacionesFormularioService
} from '@libs/shared/data-access-user/src';
import {
  Catalogo,
  CrossListLable,
  MercanciaForm,
  TablaMercanciaClaveConfig,
  TablaMercanciasDatos,
} from '../../../models/shared2606/datos-solicitud.model';
import { CommonModule, Location } from '@angular/common';
import {
  DATOS_MERCANCIA_CAMPO,
  DATOS_MERCANCIA_CLAVE_TABLA,
  DENOMINACION_ESPECIFICA,
  ES_VALIDO_REGISTRO_O_VENCIMIENTO,
  FECHA_DE_MOVIMIENTO,
  PAIS_DE_DESTINO_DISABLED,
  PAIS_DE_PROCEDENCIA_DISABLED,
  TIPO_PRODUCTO_ESPECIAL,
} from '../../../constantes/shared2606/datos-solicitud.enum';
import {
  FECHA_DE_CADUCIDAD_MERCANICA,
  FECHA_DE_CADUCIDAD_PAGO,
  FECHA_DE_FABRICACIO_PAGO,
} from '../../../models/shared2606/terceros-relacionados.model';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { CatalogoServices } from '@ng-mf/data-access-user';
import { DatosSolicitudService } from '../../../services/shared2606/datos-solicitud.service';
import { DetalleMercancia } from '../../../models/shared2606/detalle-mercancia.model';
import { NUMERO_REGISTRO_SANITARIO } from '../../../constantes/shared2606/terceros-relacionados-fabricante.enum';
import { Observable } from 'rxjs';
import {REGEX_NUMERO_DECIMAL_5_DIGITOS} from '@libs/shared/data-access-user/src/';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

export function maxLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.length > maxLength) {
      return { maxlength: { requiredLength: maxLength, actualLength: control.value.length } };
    }
    return null;
  };
}
/**
 * @component DatosMercanciaComponent
 * @description Componente encargado de capturar y emitir los datos de una mercancía.
 * Utiliza formularios reactivos y listas cruzadas para países de origen, procedencia y uso específico.
 */
@Component({
  selector: 'app-datos-mercancia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    CrosslistComponent,
    TooltipModule,
    NotificacionesComponent,
    InputFechaComponent,
    AlertComponent
  ],
  templateUrl: './datos-mercancia.component.html',
  styleUrl: './datos-mercancia.component.scss',
  providers: [DatosSolicitudService],
})


export class DatosMercanciaComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  


  /**
   * Emisor de eventos para notificar al componente padre que debe cerrar el modal
   */
  @Output() cerrarModal = new EventEmitter<void>();

  /** Indica si los campos del formulario son obligatorios */
  requiedField: boolean = false;

/**  
 *  @property {string} tipoProducto - Tipo de producto seleccionado.
 *  @description
 * Indica el tipo de producto seleccionado en el formulario.
 * Se utiliza para mostrar u ocultar campos específicos según el tipo de producto.
 *  @decorador @Input
 **/
  fraccionArancelariaCatalog: boolean = true;
  /**
   * @property {number} idProcedimiento
   * Identificador único del procedimiento asociado a la solicitud.
   * Este valor es recibido como un input desde el componente padre.
   *
   * @decorador @Input
   */
  @Input() public idProcedimiento!: number;
  /**
   * @property {boolean} detalleMercancia
   * Indica si el componente debe mostrar detalles de mercancía.
   * Se utiliza para determinar la configuración del formulario y la tabla.
   */
  @Input() detalleMercancia = false;

  /**
   * @property {DetalleMercancia} datosDetalleMercancia
   * Datos de detalle de la mercancía recibidos como entrada.
   */
  @Input() datosTablaDetalleMercancia!: Observable<DetalleMercancia[]>;
  /**
   * @property {FormGroup} mercanciaForm
   * Formulario reactivo principal para capturar los datos de la mercancía.
   */
  public mercanciaForm!: FormGroup;

  /**
   * @property {MercanciaForm} mercanciaFormState
   * Input que recibe el estado inicial del formulario de mercancía.
   */
  @Input() public mercanciaFormState!: MercanciaForm;

  /**
   * @property {TablaMercanciasDatos} datoSeleccionado
   * Dato seleccionado de la tabla de mercancías recibido como entrada desde el componente padre.
   */
  @Input() public datoSeleccionado!: TablaMercanciasDatos | undefined;

  /**
   * @event mercanciaSeleccionado
   * Evento emitido cuando el usuario selecciona o guarda una mercancía.
   */
  @Output() mercanciaSeleccionado = new EventEmitter<TablaMercanciasDatos>();

  /**
   * @event agregarMercanciaDatos
   * @description EventEmitter that emits a single merchandise item to be added.
   * This is used to notify the parent component about the addition of a new merchandise item.
   */
  @Output() agregarMercanciaDatos: EventEmitter<DetalleMercancia> =
    new EventEmitter<DetalleMercancia>(true);


  /**
   * Referencia al componente Crosslist de país de origen.
   * Permite acceder y manipular la lista cruzada de países de origen desde el código TypeScript.
   */
  @ViewChild('originList') originList?: CrosslistComponent;

  /**
   * Referencia al componente Crosslist de país de procedencia.
   * Permite acceder y manipular la lista cruzada de países de procedencia desde el código TypeScript.
   */
  @ViewChild('procedenciaList') procedenciaList?: CrosslistComponent;

  /**
   * Referencia al componente Crosslist de uso específico.
   * Permite acceder y manipular la lista cruzada de usos específicos desde el código TypeScript.
   */
  @ViewChild('usoList') usoList?: CrosslistComponent;


  /**
   * @description
   * Variable que almacena el índice del elemento que se desea eliminar de la lista de pedimentos.
   * Utilizada para realizar operaciones de eliminación en el arreglo `pedimentos`.
   */
  elementoParaEliminar!: number;

  /**
   * @property {Catalogo[]} clasificacionProductoDatos
   * @description Catalog of product classifications used to populate the form.
   */
  public clasificacionProductoDatos!: Catalogo[];

  /**
   * @property {Catalogo[]} especificarClasificacionProductoDatos
   * @description Catalog of specific product classifications used to populate the form.
   */
  public especificarClasificacionProductoDatos!: Catalogo[];

  /**
   * @property {Catalogo[]} tipoProductoDatos
   * @description Catalog of product types used to populate the form.
   */
  public tipoProductoDatos!: Catalogo[];

  /**
   * @property {Catalogo[]} formaFarmaceuticaDatos
   * @description Catalog of pharmaceutical forms used to populate the form.
   */
  public formaFarmaceuticaDatos!: Catalogo[];

  /**
   * @property {Catalogo[]} estadoFisicoDatos
   * @description Catalog of physical states used to populate the form.
   */
  public estadoFisicoDatos!: Catalogo[];

  /**
   * @property {Catalogo[]} cantidadUmcDatos
   * @description Catalog of commercial unit quantities used to populate the form.
   */
  public cantidadUmcDatos!: Catalogo[];

  /**
   * @property {Catalogo[]} fraccionArancelariaDatos
   * @description Catalog of tariff fractions used to populate the form.
   */
  public fraccionArancelariaDatos!: Catalogo[];

  /**
   * @property {boolean} paisDeOriginColapsable
   * Controla la visibilidad del listado de país de origen.
   */
  public paisDeOriginColapsable = false;

  /**
   * @property {boolean} paisDeProcedenciaColapsable
   * Controla la visibilidad del listado de país de procedencia.
   */
  public paisDeProcedenciaColapsable = false;

  /**
   * @property {boolean} usoEspesificoColapsable
   * Controla la visibilidad del listado de uso específico.
   */
  public usoEspesificoColapsable = false;

  /**
   * @property {boolean} showLimitError
   * Controla la visibilidad del mensaje de error por límite de caracteres.
   */
  public showLimitError = false;

  /**
   * @property {string[]} elementosRequirdos
   * Lista de elementos requeridos para el formulario.
   */
  public elementosRequirdos: string[] = [];

  /**
   * @description
   * Objeto que representa una nueva notificación.
   * Se utiliza para mostrar mensajes de alerta o información al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @description
   * Arreglo que almacena los pedimentos asociados al establecimiento.
   * Cada pedimento contiene información relevante para el trámite.
   */
  pedimentos: Array<Pedimento> = [];

/** * @property {number[]} paisDeOriginDisabled
   * Lista de países deshabilitados en la selección de país de origen.
   */
  public paisDeOriginDisabled: number[] = PAIS_DE_PROCEDENCIA_DISABLED;
  paisDeProcedenciaDisabled: number[] = PAIS_DE_PROCEDENCIA_DISABLED;

 paisDeProcedenciaBotonsUno = [
  { btnNombre: 'Agregar todos', class: 'btn-default', funcion: () => this.agregarOrigen('t') },
  { btnNombre: 'Agregar selección', class: 'btn-primary', funcion: () => this.agregarOrigen('') },
  { btnNombre: 'Restar selección', class: 'btn-primary', funcion: () => this.quitarOrigen('') },
  { btnNombre: 'Restar todos', class: 'btn-default', funcion: () => this.quitarOrigen('t') },
];


paisDeProcedenciaBotonsDos = [
  { btnNombre: 'Agregar todos', class: 'btn-default', funcion: () => this.agregarProcedencia('t') },
  { btnNombre: 'Agregar selección', class: 'btn-primary', funcion: () => this.agregarProcedencia('') },
  { btnNombre: 'Restar selección', class: 'btn-primary', funcion: () => this.quitarProcedencia('') },
  { btnNombre: 'Restar todos', class: 'btn-default', funcion: () => this.quitarProcedencia('t') },
];


  public paisDeOriginLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de origen:',
    derecha: 'País(es) seleccionado(s)',
  };

  public paisDeProcedenciaLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de procedencia:',
    derecha: 'País(es) seleccionados',
  };

  /**
   * @property {CrossListLable} usoEspesificoLabel
   * Etiqueta personalizada para el componente de lista cruzada de uso específico.
   * Define los títulos para los elementos disponibles y seleccionados.
   */
  public usoEspesificoLabel: CrossListLable = {
    tituluDeLaIzquierda: 'Uso específico:',
    derecha: 'Uso específico',
  };

  /**
   * Botones de acción para gestionar listas de países en la tercera sección.
   */
paisDeProcedenciaBotonsTres = [
  { btnNombre: 'Agregar todos', class: 'btn-default', funcion: () => this.agregarUso('t') },
  { btnNombre: 'Agregar selección', class: 'btn-primary', funcion: () => this.agregarUso('') },
  { btnNombre: 'Restar selección', class: 'btn-primary', funcion: () => this.quitarUso('') },
  { btnNombre: 'Restar todos', class: 'btn-default', funcion: () => this.quitarUso('t') },
];



  /**
   * @property {string[]} seleccionadasPaisDeOriginDatos
   * Lista de países seleccionados como origen.
   */
  public seleccionadasPaisDeOriginDatos: string[] = [];

  public seleccionadasPaisDeProcedenciaDatos: string[] = [];

  public paisDeProcedencia: string[] = [];

  public usoEspesifico: string[] = [];

  /**
   * @property {string[]} seleccionadasUsoEspesificoDatos
   * Lista de usos específicos seleccionados.
   */
  public seleccionadasUsoEspesificoDatos: string[] = [];

  /**
   * @property {Catalogo[]} seleccionarOrigenDelPais
   * Datos de países para lista cruzada de país de origen.
   */
  public seleccionarOrigenDelPais: string[] = [];

  /**
   * Indica si se debe mostrar el campo de datos de mercancía en la interfaz.
   * @type {boolean}
   */
  public datosMercanciaCampo = false;

  /**
   * Lista de elementos deshabilitados en el formulario.
   * Esta propiedad almacena un arreglo de cadenas que representan
   * los elementos que deben estar deshabilitados en el formulario.
   */
  public elementosDeshabilitados: string[] = [];

  /**
   * @property {typeof TIPO_PRODUCTO_ESPECIAL} tipoProductoEspecial - Referencia a la constante que define los tipos especiales de producto.
   *
   * @remarks
   * Esta propiedad se utiliza para acceder y manejar los diferentes tipos de productos especiales dentro del componente.
   *
   * @comando
   * Utilice esta propiedad para mostrar o validar los tipos de productos especiales en la interfaz de usuario.
   */
  tipoProductoEspecial = TIPO_PRODUCTO_ESPECIAL;

  /** @property {string} tipoFOFA
   * @description Cadena que representa el tipo FOFA utilizado en el componente.
   * Se inicializa con el valor 'FOFA.OTR'.
   * */
  tipoFOFA = 'FOFA.OTR';

  /**
   * @property {Subscription} subscription
   * @description Suscripción utilizada para gestionar y limpiar las suscripciones a observables dentro del componente.
   * Se inicializa como una nueva instancia de Subscription y se utiliza para evitar fugas de memoria.
   */
  private subscription: Subscription = new Subscription();

  /**
   * @property {Subject<void>} destroyNotifier$
   * Subject utilizado para cancelar suscripciones activas al destruir el componente.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Catalogo[] | undefined} tipoProductoObj
   * @description Objeto(s) de catálogo que representan el tipo de producto seleccionado.
   * Se utiliza para almacenar la información detallada del tipo de producto en el formulario.
   */
  tipoProductoObj: Catalogo[] | undefined;

  /**
   * Indica si el registro o vencimiento es válido para el procedimiento actual.
   * Se utiliza para controlar la lógica de validación de los campos relacionados con registro sanitario y fechas de vencimiento.
   */
  esValidoRegistroOVencimiento: boolean = false;

  /**
   * @property {string} mensajeDeError
   * @description Mensaje de error mostrado cuando el formulario de mercancía no es válido o faltan campos por capturar.
   */
  mensajeDeError: string = '';

  showDenominacionEspecificaProducto: boolean = false;

  /**
   * @property {number[]} paisDeDestinoDisabled
   * Lista de países deshabilitados en la selección de país de destino.
   */
  paisDeDestinoDisabled: number[] = PAIS_DE_DESTINO_DISABLED;

  @Input() isAccionModificar: boolean = false;

  /**
   * @constructor
   * Inicializa el formulario de mercancía y carga catálogos desde archivos JSON.
   *
   * @param fb - FormBuilder para construir formularios reactivos.
   * @param datosSolicitudService - Servicio que carga catálogos desde assets.
   * @param ubicaccion - Servicio para manejar navegación (si es necesario).
   */
  constructor(
    private fb: FormBuilder,
    private datosSolicitudService: DatosSolicitudService,
    private ubicaccion: Location,
    private validacionesService: ValidacionesFormularioService,
    private catalogoService: CatalogoServices
  ) {
    this.datosMercanciaCampo = DATOS_MERCANCIA_CAMPO.includes(
      this.idProcedimiento
    )
      ? true
      : false;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta después de inicializar las vistas del componente.
   *
   * Aquí se configuran los **grupos de botones** (`paisDeProcedenciaBotonsUno`, `paisDeProcedenciaBotonsDos`,
   * `paisDeProcedenciaBotonsTres`) que permiten al usuario interactuar con las listas de países de procedencia.
   *
   * Cada grupo de botones ofrece las siguientes acciones:
   * - **Agregar todos** → Inserta todos los elementos en la lista.
   * - **Agregar selección** → Inserta únicamente los elementos seleccionados.
   * - **Restar selección** → Elimina únicamente los elementos seleccionados.
   * - **Restar todos** → Elimina todos los elementos de la lista.
   *
   * Estos botones están asociados a instancias de `crossList` y llaman a los métodos
   * `agregar()` o `quitar()` según corresponda.
   */
  ngAfterViewInit(): void {
    if (this.mercanciaForm.get('clasificacionProducto')?.value) {
      this.onCambioClasificacionProducto(this.datoSeleccionado?.claveClasificacionProductoObj);
    }
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando hay cambios en las propiedades de entrada del componente.
   * @param changes - Objeto que contiene los cambios en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoProducto'] || changes['formaFarmaceutica']) {
      this.updateValidation();
    }
  }

  /**  * Maneja la selección de un país de origen.
   * Actualiza el valor en el formulario basado en la selección del usuario.
   *
   * @param event - Objeto con el valor seleccionado de país de origen.
   */
  onSeleccionarPaisDeOrigen(event: Catalogo): void {
    const SELECCIONADOS = event.clave;

    this.mercanciaForm
      .get('paisDeOrigen')
      ?.setValue(SELECCIONADOS);
  }

  /**  * Maneja la selección de un país de procedencia. 
   * Actualiza el valor en el formulario basado en la selección del usuario.
   *
   * @param event - Objeto con el valor seleccionado de país de procedencia.
   */
  onSeleccionarPaisDeProcedencia(event: Catalogo): void {
    const SELECCIONADOS = event.clave;
    this.mercanciaForm
      .get('paisProcedencia')
      ?.setValue(SELECCIONADOS);
  }

  /**  * Maneja la selección de un país de destino.
   * Actualiza el valor en el formulario basado en la selección del usuario.
   *
   * @param event - Objeto con el valor seleccionado de país de destino.
   */
  onSeleccionarPaisDeDestino(event: Catalogo): void {
    const SELECCIONADOS = event.clave;
    this.mercanciaForm
      .get('paisDestino')
      ?.setValue(SELECCIONADOS);
  }

  /**
   * @method ngOnInit
   * @description Hook de ciclo de vida que se ejecuta al inicializar el componente.
   * Llama al método `crearMercanciaForm` para construir el formulario.
   */
  ngOnInit(): void {
    this.inicializarCatalogo(String(this.idProcedimiento));
    this.requiedField = NUMERO_REGISTRO_SANITARIO.includes(this.idProcedimiento);
    this.esValidoRegistroOVencimiento = ES_VALIDO_REGISTRO_O_VENCIMIENTO.includes(this.idProcedimiento);
    this.showDenominacionEspecificaProducto = DENOMINACION_ESPECIFICA.includes(this.idProcedimiento);
    this.validarElementos();
    this.crearMercanciaForm();
    if (this.idProcedimiento === 260604 || this.idProcedimiento === 260603) {
      this.showDenominacionEspecificaProducto = false;
    }
    this.crossListRequirdos();
    this.inicializarCrosslist();
  }

  
  /**
   * Elimina un registro de la tabla de mercancías y resetea el campo 'paisProcedencia'.
   * Llamar este método cuando se elimina un registro.
   */
  eliminarMercancia(index: number): void {
    this.resetPaisProcedencia();
  }

    /**
   * Resetea el campo 'paisProcedencia' del formulario de mercancía.
   * Llamar después de eliminar un registro para evitar errores de validación.
   */
  resetPaisProcedencia(): void {
    if (this.mercanciaForm && this.mercanciaForm.contains('paisProcedencia')) {
      this.mercanciaForm.get('paisProcedencia')?.reset(null);
    }
  }

  /**
   * Inicializa los datos de los crosslists de países y uso específico.
   * Realiza llamadas básicas a la API para obtener los catálogos y asignarlos a las propiedades correspondientes.
   */
  inicializarCrosslist(): void {

    //pais de procedencia
    this.subscription.add(
      this.catalogoService
        .paisesCatalogo(String(this.idProcedimiento))
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];


              const PAIS_DE_PROCEDENCIA = DATOS.filter(item => item.clave === 'MEX');
          if (response) {
            this.paisDeProcedenciaDatos = DATOS;
            if (PAIS_DE_PROCEDENCIA.length > 0 && this.paisDeProcedenciaDisabled.includes(this.idProcedimiento)) {
              this.mercanciaForm.patchValue({
              paisProcedencia: PAIS_DE_PROCEDENCIA[0].clave
              });
            }
          }
       
        })
    );

    // País de destino
    this.subscription.add(
      this.catalogoService
        .paisesCatalogo(String(this.idProcedimiento))
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.paisDestinoDatos = DATOS;

            const PAIS_DE_DESTINO = DATOS.filter(item => item.clave === 'MEX');
            if (PAIS_DE_DESTINO.length > 0 && 
              this.paisDeDestinoDisabled.includes(this.idProcedimiento)) {
              this.mercanciaForm.patchValue({
                paisDestino: PAIS_DE_DESTINO[0].clave
              });
            }
          }
        })
    );

    this.subscription.add(
      this.catalogoService
        .usosEspecificoMercanciaCatalogo(String(this.idProcedimiento), String(this.idProcedimiento))
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.usoEspesificoDatos = DATOS;
           
            const USO_ESPECIFICO = DATOS.filter(item => item.clave === 'USO.OTR');
            if (USO_ESPECIFICO.length > 0 && this.idProcedimiento === 260603) {
              this.mercanciaForm.patchValue({
                usoEspecifico: USO_ESPECIFICO[0].clave
              });
            }
          }
        })
    );

    // País de origen
    this.subscription.add(
      this.catalogoService
        .paisesCatalogo(String(this.idProcedimiento))
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.paisDeOrigenDatos = DATOS;
          }
        })
    );

    this.subscription.add(
      this.catalogoService
        .paisesCatalogo(String(this.idProcedimiento))
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          if (response && Array.isArray(response.datos)) {
            this.seleccionarOrigenDelPais = response.datos.map((item: Catalogo) => item.descripcion);
            const SELECTED = this.mercanciaForm.getRawValue();
            this.seleccionadasPaisDeOriginDatos = Array.isArray(SELECTED.paisDeOriginDatos)
              ? SELECTED.paisDeOriginDatos
              : SELECTED.paisDeOriginDatos
              ? [SELECTED.paisDeOriginDatos]
              : [];
              this.seleccionadasPaisDeOriginDatos = JSON.parse(JSON.stringify(this.seleccionadasPaisDeOriginDatos));
          }
        })
    );

    // País de procedencia
    this.subscription.add(
      this.catalogoService
        .paisesCatalogo(String(this.idProcedimiento))
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          if (response && Array.isArray(response.datos)) {
            this.paisDeProcedencia = response.datos.map((item: Catalogo) => item.descripcion);
            const SELECTED = this.mercanciaForm.getRawValue();
            this.seleccionadasPaisDeProcedenciaDatos = Array.isArray(SELECTED.paisDeProcedenciaDatos)
              ? SELECTED.paisDeProcedenciaDatos
              : SELECTED.paisDeProcedenciaDatos
              ? [SELECTED.paisDeProcedenciaDatos]
              : [];
              this.seleccionadasPaisDeProcedenciaDatos = JSON.parse(JSON.stringify(this.seleccionadasPaisDeProcedenciaDatos));
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
            this.usoEspesifico = response.datos.map((item: Catalogo) => item.descripcion);
            const SELECTED = this.mercanciaForm.getRawValue();
            this.seleccionadasUsoEspesificoDatos = Array.isArray(SELECTED.usoEspecifico)
              ? SELECTED.usoEspecifico
              : SELECTED.usoEspecifico
                ? [SELECTED.usoEspecifico]
                : [];
            this.seleccionadasUsoEspesificoDatos = JSON.parse(JSON.stringify(this.seleccionadasUsoEspesificoDatos));
          }
        })
    );
  }

  /**
   * Maneja el cambio de clasificación de producto.
   * Actualiza el valor en el formulario y carga el catálogo de especificar clasificación de producto.
   *
   * @param event - Objeto con el valor seleccionado de clasificación de producto.
   */
  onCambioClasificacionProducto(event: unknown): void {
    const CLASIFICACION_SELECCIONADA = (event as Catalogo)?.clave;
    this.mercanciaForm
      .get('clasificacionProducto')
      ?.setValue(CLASIFICACION_SELECCIONADA);
    this.subscription.add(
      this.catalogoService
        .especificarClasificacionProductoCatalogo(
          String(this.idProcedimiento),
          String(CLASIFICACION_SELECCIONADA)
        )
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.especificarClasificacionProductoDatos = DATOS;
          }
        })
    );
  }

  /**
   * Inicializa los catálogos requeridos para el formulario de mercancía.
   * Carga los catálogos de clasificación de producto, tipo de producto, forma farmacéutica,
   * estado físico y unidades de medida comercial.
   *
   * @param tramite - Identificador del trámite para cargar los catálogos correspondientes.
   */
  inicializarCatalogo(tramite: string): void {
    this.subscription.add(
      this.catalogoService
        .clasificacionProductoCatalogo(tramite, String(this.idProcedimiento))
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.clasificacionProductoDatos = DATOS;
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
            this.tipoProductoDatos = DATOS;
          }
        })
    );

    // this.subscription.add(
    //   this.catalogoService
    //     .formaFarmaceuticaCatalogo(tramite)
    //     .pipe(takeUntil(this.destroyNotifier$))
    //     .subscribe((response) => {
    //       const DATOS = response.datos as Catalogo[];

    //       if (response) {
    //         this.formaFarmaceuticaDatos = DATOS;
    //       }
    //     })
    // );

    if(this.idProcedimiento !== 260601){
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

    if(this.idProcedimiento !== 260601){
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
    }

  }
  /**
   * Lista de elementos que no son válidos.
   * Esta propiedad almacena un arreglo de cadenas que representan
   * los elementos que no cumplen con los criterios de validación.
   */
  public elementosNoValidos: string[] = [];
  /**
   * Arreglo que almacena los elementos añadidos.
   *
   * Este arreglo se utiliza para guardar una lista de cadenas que representan
   * los elementos que han sido agregados en el componente.
   */
  public elementosAnadidos: string[] = [];
  /**
   * Arreglo que almacena los elementos mandatorios.
   *
   * Este arreglo se utiliza para guardar una lista de cadenas que representan
   * los elementos que son obligatorios en el componente.
   */
  public elementosMandatorios: string[] = [];
  /**
   * @method crearMercanciaForm
   * @description Construye el formulario reactivo `mercanciaForm` con sus controles y validaciones.
   * Si `mercanciaFormState` tiene datos, los utiliza para inicializar los controles del formulario.
   */
  public elementosBelow: boolean = false;
  /**
   * Configuración para la clave de mercancía.
   *
   * Esta propiedad define la configuración utilizada para la tabla de selección
   * de claves de mercancía. Incluye el tipo de selección, la configuración de la tabla
   * y los datos asociados.
   *
   * Propiedades:
   * - `tipoSeleccionTabla`: Define el tipo de selección en la tabla (por ejemplo, CHECKBOX).
   * - `configuracionTabla`: Configuración específica de la tabla para mostrar las claves de mercancía.
   * - `datos`: Arreglo que contiene los datos de configuración de las claves de mercancía.
   */
  public claveConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: DATOS_MERCANCIA_CLAVE_TABLA,
    datos: [] as TablaMercanciaClaveConfig[],
  };
  /**
   * @property {TablaMercanciaClaveConfig[]} scianLista
   * Lista de registros Clave seleccionados.
   */
  public claveLista: TablaMercanciaClaveConfig[] = [];

  /**
   * @property {InputFecha} fechaDeFabricacioInput
   * Objeto con la configuración de la fecha inicial del componente.
   */
  fechaDeFabricacioInput: InputFecha = FECHA_DE_FABRICACIO_PAGO;

  /**
   * @property {InputFecha} fechaDeCaducidadInputMercanica
   * Objeto con la configuración de la fecha inicial del componente.
   */
  fechaDeCaducidadInputMercanica: InputFecha = FECHA_DE_CADUCIDAD_MERCANICA;

  /**
   * @property {InputFecha} fechaDeMovimientoInput
   * Objeto con la configuración de la fecha inicial del componente.
   */
  fechaDeMovimientoInput: InputFecha = FECHA_DE_MOVIMIENTO;

  /**
   * @property {Catalogo[]} paisDestinoDatos
   * Datos de países para lista cruzada de país de destino.
   */
  paisDestinoDatos: Catalogo[] = [];

  /**
   * @property {Catalogo[]} paisDeProcedenciaDatos
   * Datos de países para lista cruzada de país de procedencia.
   */
  paisDeProcedenciaDatos: Catalogo[] = [];

  
  usoEspesificoDatos: Catalogo[] = [];

  /**
   *  @property {Catalogo[]} paisDeOrigenDatos
   * Datos de países para lista cruzada de país de origen.
   */
  paisDeOrigenDatos: Catalogo[] = [];
  /**
   * @property {InputFecha} fechaDeCaducidadInput
   * Objeto con la configuración de la fecha inicial del componente.
   */
  fechaDeCaducidadInput: InputFecha = FECHA_DE_CADUCIDAD_PAGO;

  /**
   * @method crossListRequirdos
   * @description Actualiza las etiquetas de los crosslists según los elementos requeridos.
   * Esta función verifica si los elementos requeridos están presentes y actualiza las etiquetas
   */
  crossListRequirdos(): void {
    this.usoEspesificoLabel.derecha = this.elementosRequirdos.includes(
      'usoEspecífico'
    )
      ? 'Uso específico seleccionado*:'
      : 'Uso específico seleccionado*:';
  }

  /**
   * Valida elementos según el `idProcedimiento` y establece
   * las listas de elementos no válidos y añadidos.
   * @returns {void} Lista de elementos no válidos.
   */
  validarElementos(): void {
    this.elementosNoValidos = [];
    this.elementosAnadidos = [];
    this.elementosMandatorios = [];
    switch (this.idProcedimiento) {
      case 260601:
        this.elementosNoValidos = [
          'estadoFisico',
          'formaFarmaceutica',
          'UMC',
          'elementosNoValidos',
          'denominacionDistintiva',
          'denominacionComun',
          'denominacionComunInternacional',
          'PorcentajeDeConcentracion',
          'presentacion',
          'paisDeProcedencia'
        ];
        this.elementosAnadidos = ['especifique'];
        this.elementosDeshabilitados = ['descripcionFraccion'];
        break;
      case 260604:
        this.elementosNoValidos = [
          'denominacionDistintiva',
          'denominacionComun',
          'numeroRegistroSanitario',
          'formaFarmaceutica',
        ];
        this.elementosAnadidos = [
          'estadoFisico',
          'especifique',
          'fechaDeFabricacio',
          'presentacion',
        ];
        this.elementosDeshabilitados = ['descripcionFraccion'];
        const paisDeOriginDatosCtrl = this.mercanciaForm?.get('paisDeOriginDatos');
        const paisDeProcedenciaDatosCtrl = this.mercanciaForm?.get('paisDeProcedenciaDatos');
        paisDeOriginDatosCtrl?.clearValidators();
        paisDeOriginDatosCtrl?.updateValueAndValidity();
        paisDeProcedenciaDatosCtrl?.clearValidators();
        paisDeProcedenciaDatosCtrl?.updateValueAndValidity();
        break;
      case 260603:
        this.elementosNoValidos = [
          'denominacionDistintiva',
          'denominacionComun',
          'formaFarmaceutica',
          'numeroRegistroSanitario'
        ];
        this.elementosAnadidos = [
          'estadoFisico',
          'presentacion'
        ];
        this.elementosDeshabilitados = ['descripcionFraccion'];
        // Eliminar el validador requerido para paisDeOriginDatos y paisDeProcedenciaDatos para 260603
        const paisDeOriginDatosCtrl603 = this.mercanciaForm?.get('paisDeOriginDatos');
        const paisDeProcedenciaDatosCtrl603 = this.mercanciaForm?.get('paisDeProcedenciaDatos');
        paisDeOriginDatosCtrl603?.clearValidators();
        paisDeOriginDatosCtrl603?.updateValueAndValidity();
        paisDeProcedenciaDatosCtrl603?.clearValidators();
        paisDeProcedenciaDatosCtrl603?.updateValueAndValidity();
        break;
      default:
        if (this.detalleMercancia) {
          this.elementosNoValidos = [
            'denominacionDistintiva',
            'denominacionComun',
            'numeroRegistroSanitario',
            'formaFarmaceutica',
          ];
          this.elementosAnadidos = [
            'estadoFisico',
            'especifique',
            'fechaDeFabricacio',
            'presentacion',
          ];
        }
        break;
    }

    const DENOMINACION_ESPECIFICA_PRODUCTO = this.mercanciaForm?.get('denominacionEspecificaProducto');
    const DENOMINACION_COMUN_INTERNACIONAL = this.mercanciaForm?.get('denominacionComunInternacional');
    const DENOMINACION_DISTINTIVA = this.mercanciaForm?.get('denominacionDistintiva');
    const DENOMINACION_COMUN = this.mercanciaForm?.get('denominacionComun');
    const PORCENTAJE_DE_CONCENTRACION = this.mercanciaForm?.get('PorcentajeDeConcentracion');
    const VALOR_COMERCIAL = this.mercanciaForm?.get('valorComercial');
    const FORMA_FARMACEUTICA = this.mercanciaForm?.get('formaFarmaceutica');
    const ESTADO_FISICO = this.mercanciaForm?.get('estadoFisico');
    const FRACCION_ARANCELARIA = this.mercanciaForm?.get('fraccionArancelaria');
    const CANTIDAD_UMC_VALOR = this.mercanciaForm?.get('cantidadUmcValor');
    const CANTIDAD_UMC = this.mercanciaForm?.get('cantidadUmc');
    const PRESENTACION = this.mercanciaForm?.get('presentacion');
    const PAIS_PROCEDENCIA = this.mercanciaForm?.get('paisProcedencia');
    
    if(this.showDenominacionEspecificaProducto){
      DENOMINACION_ESPECIFICA_PRODUCTO?.setValidators([Validators.required]);
      DENOMINACION_COMUN_INTERNACIONAL?.clearValidators()
      DENOMINACION_DISTINTIVA?.clearValidators();
      DENOMINACION_COMUN?.clearValidators();
      PORCENTAJE_DE_CONCENTRACION?.clearValidators();
      VALOR_COMERCIAL?.clearValidators();
      FORMA_FARMACEUTICA?.clearValidators();
      ESTADO_FISICO?.clearValidators();
      FRACCION_ARANCELARIA?.clearValidators();
      CANTIDAD_UMC_VALOR?.clearValidators();
      CANTIDAD_UMC?.clearValidators();
      PRESENTACION?.clearValidators();

    }
    DENOMINACION_ESPECIFICA_PRODUCTO?.updateValueAndValidity();
    DENOMINACION_COMUN_INTERNACIONAL?.updateValueAndValidity();
    DENOMINACION_DISTINTIVA?.updateValueAndValidity();
    DENOMINACION_COMUN?.updateValueAndValidity();
    PORCENTAJE_DE_CONCENTRACION?.updateValueAndValidity();
    VALOR_COMERCIAL?.updateValueAndValidity();
    FORMA_FARMACEUTICA?.updateValueAndValidity();
    ESTADO_FISICO?.updateValueAndValidity();
    FRACCION_ARANCELARIA?.updateValueAndValidity();
    CANTIDAD_UMC_VALOR?.updateValueAndValidity();
    CANTIDAD_UMC?.updateValueAndValidity();
    PRESENTACION?.updateValueAndValidity();
    PAIS_PROCEDENCIA?.updateValueAndValidity();
  }


  /**
   * Crea y configura el formulario reactivo para la gestión de datos de mercancía.
   *
   * Este método inicializa un formulario con validaciones requeridas para cada campo,
   * utilizando los valores iniciales proporcionados por el estado `mercanciaFormState`.
   *
   * Campos incluidos en el formulario:
   * - `clasificacionProducto`: Clasificación del producto (requerido).
   * - `especificarClasificacionProducto`: Detalle de la clasificación del producto (requerido).
   * - `denominacionEspecificaProducto`: Denominación específica del producto (requerido).
   * - `denominacionDistintiva`: Denominación distintiva del producto (requerido).
   * - `denominacionComun`: Denominación común del producto (requerido).
   * - `tipoProducto`: Tipo de producto (requerido).
   * - `formaFarmaceutica`: Forma farmacéutica del producto (requerido).
   * - `estadoFisico`: Estado físico del producto (requerido).
   * - `fraccionArancelaria`: Fracción arancelaria del producto (requerido).
   * - `descripcionFraccion`: Descripción de la fracción arancelaria (requerido).
   * - `cantidadUmtValor`: Cantidad en unidad de medida de transporte (requerido).
   * - `cantidadUmt`: Unidad de medida de transporte (requerido).
   * - `cantidadUmcValor`: Cantidad en unidad de medida comercial (requerido).
   * - `cantidadUmc`: Unidad de medida comercial (requerido).
   * - `presentacion`: Presentación del producto (requerido).
   * - `numeroRegistroSanitario`: Número de registro sanitario (requerido).
   * - `fechaDeMovimiento`: Fecha de caducidad del producto (opcional).
   * - `paisDeOriginDatos`: País de origen del producto (requerido).
   * - `paisDeProcedenciaDatos`: País de procedencia del producto (requerido).
   *
   * @returns void
   */
  crearMercanciaForm(): void {
    const PAIS_DE_ORIGEN = this.obtenerValor('paisDeOriginDatos') || [];
    this.seleccionadasPaisDeOriginDatos = this.convertToStringArray(PAIS_DE_ORIGEN);
    this.paisDeOriginColapsable = this.seleccionadasPaisDeOriginDatos.length > 0;
    const PAIS_DE_PROCEDENCIA = this.obtenerValor('paisDeProcedenciaDatos') || [];
    this.seleccionadasPaisDeProcedenciaDatos = this.convertToStringArray(PAIS_DE_PROCEDENCIA);
    this.paisDeProcedenciaColapsable = this.seleccionadasPaisDeProcedenciaDatos.length > 0;
    const USO_ESPECIFICOS = this.obtenerValor('usoEspecifico') || [];
    this.seleccionadasUsoEspesificoDatos = this.convertToStringArray(USO_ESPECIFICOS);
    this.usoEspesificoColapsable = this.seleccionadasUsoEspesificoDatos.length > 0;


    this.mercanciaForm = this.fb.group({
      clasificacionProducto: [
        this.obtenerValor('clasificacionProducto'),
        [Validators.required],
      ],
      especificarClasificacionProducto: [
        this.obtenerValor('especificarClasificacionProducto'),
        [Validators.required],
      ],
      denominacionEspecificaProducto: [
        this.obtenerValor('denominacionEspecificaProducto'),
        [maxLengthValidator(120)]
      ],
      marcaComercialODenominacionDistintiva: [
        this.obtenerValor('marcaComercialODenominacionDistintiva'),
        [Validators.required],
      ],
      denominacionComunInternacional: [
        this.obtenerValor('denominacionComunInternacional'),
        [Validators.required],
      ],
      denominacionDistintiva: [
        this.obtenerValor('denominacionDistintiva'),
        [Validators.required],
      ],
      denominacionComun: [
        this.obtenerValor('denominacionComun'),
        [Validators.required],
      ],
      PorcentajeDeConcentracion: [
        this.obtenerValor('PorcentajeDeConcentracion'),
        [Validators.required],
      ],
      valorComercial: [
        this.obtenerValor('valorComercial'),
        [Validators.required],
      ],
      formaFarmaceutica: [this.obtenerValor('formaFarmaceutica'), [Validators.required]],
      tipoProducto: [this.obtenerValor('tipoProducto'), [Validators.required]],
      estadoFisico: [this.obtenerValor('estadoFisico'), [Validators.required]],
      fraccionArancelaria: [
        this.obtenerValor('fraccionArancelaria'),
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern(SOLO_REGEX_NUMEROS),
        ],
      ],
      descripcionFraccion: [
        {
          value: this.obtenerValor('descripcionFraccion'),
          disabled: this.elementosDeshabilitados.includes('descripcionFraccion'),
        },
        [Validators.required],
      ],
      modelo: [this.obtenerValor('modelo')],
      descripcionDelProducto: [
        this.obtenerValor('descripcionDelProducto'),
      ],
      cantidadUmcValor: [
        this.obtenerValor('cantidadUmcValor'),
        [
          Validators.required,
          Validators.pattern(REGEX_DECIMAL),
          DatosMercanciaComponent.numeroUMCDecimalesValidator(),

        ],
      ],
      cantidadUmc: [this.obtenerValor('cantidadUmc'), [Validators.required]],
      presentacion: [this.obtenerValor('presentacion'), [Validators.required]],
      numeroRegistroSanitario: [
        this.obtenerValor('numeroRegistroSanitario')
      ],
      fechaDeMovimiento: [this.obtenerValor('fechaDeMovimiento')],
      paisDestino: [
        {
          value: this.obtenerValor('paisDestino'), 
          disabled: this.paisDeDestinoDisabled.includes(this.idProcedimiento)
        },
        [Validators.required],
      ],
      paisProcedencia: [
        this.obtenerValor('paisProcedencia'),
        [Validators.required],
      ],
      paisDeOrigen: [
        this.obtenerValor('paisDeOrigen'),
        [Validators.required],
      ],
      paisDeOriginDatos: [
        this.seleccionadasPaisDeOriginDatos,
        (this.idProcedimiento === 260604 || this.idProcedimiento === 260603) ? [] : [Validators.required, matrizRequerida],
      ],
      paisDeProcedenciaDatos: [
        this.seleccionadasPaisDeProcedenciaDatos,
        (this.idProcedimiento === 260604 || this.idProcedimiento === 260603) ? [] : [Validators.required, matrizRequerida],
      ],
      usoEspecifico: [
        this.seleccionadasUsoEspesificoDatos,
        [Validators.required, matrizRequerida]
      ],
      especifique: [
        this.obtenerValor('especifique'),[Validators.required]
      ],
      especifiqueForma: [
        this.obtenerValor('especifiqueForma')
      ],
      especifiqueEstado: [this.obtenerValor('especifiqueEstado')],
      id: [this.obtenerValor('id')]
    });
    const MERCANCIA_FORM_DETALLE = this.mercanciaForm.getRawValue();
    setTimeout(() => {

      MERCANCIA_FORM_DETALLE.clasificacionProducto = this.getIdFromDescripcion(this.clasificacionProductoDatos, MERCANCIA_FORM_DETALLE.clasificacionProducto);
      MERCANCIA_FORM_DETALLE.especificarClasificacionProducto = this.getIdFromDescripcion(this.especificarClasificacionProductoDatos, MERCANCIA_FORM_DETALLE.especificarClasificacionProducto);
      MERCANCIA_FORM_DETALLE.tipoProducto = this.getIdFromDescripcion(this.tipoProductoDatos, MERCANCIA_FORM_DETALLE.tipoProducto);
      MERCANCIA_FORM_DETALLE.formaFarmaceutica = this.getIdFromDescripcion(this.formaFarmaceuticaDatos, MERCANCIA_FORM_DETALLE.formaFarmaceutica);
      MERCANCIA_FORM_DETALLE.estadoFisico = this.getIdFromDescripcion(this.estadoFisicoDatos, MERCANCIA_FORM_DETALLE.estadoFisico);
      MERCANCIA_FORM_DETALLE.fraccionArancelaria = this.getIdFromDescripcion(this.fraccionArancelariaDatos, MERCANCIA_FORM_DETALLE.fraccionArancelaria);
      MERCANCIA_FORM_DETALLE.cantidadUmc = this.getIdFromDescripcion(this.cantidadUmcDatos, MERCANCIA_FORM_DETALLE.cantidadUmc);
      this.mercanciaForm.patchValue(MERCANCIA_FORM_DETALLE);
    }, 500);

    const CONTROLS_A_ELIMINAR = [...this.elementosNoValidos];
    if (this.detalleMercancia) {
      CONTROLS_A_ELIMINAR.push('formaFarmaceutica', 'denominacionDistintiva');
    }

    for (const NOMBRE_DEL_CONTROL of CONTROLS_A_ELIMINAR) {
      if (this.mercanciaForm.contains(NOMBRE_DEL_CONTROL)) {
        this.mercanciaForm.removeControl(NOMBRE_DEL_CONTROL, {
          emitEvent: false,
        });
      }
    }

    // Añadir controles dinámicos
    for (const NOMBRE_DEL_CONTROL of this.elementosAnadidos) {
      if (!this.mercanciaForm.contains(NOMBRE_DEL_CONTROL)) {
        // Determina si este campo es obligatorio
        const IS_MANDATORY = this.elementosMandatorios.includes(NOMBRE_DEL_CONTROL);
        const VALIDATORS = IS_MANDATORY ? [Validators.required] : [];

        this.mercanciaForm.addControl(
          NOMBRE_DEL_CONTROL,
          new FormControl(
            this.obtenerValor(NOMBRE_DEL_CONTROL as keyof MercanciaForm),
            { validators: VALIDATORS }
          )
        );
      }
    }

    if(this.showDenominacionEspecificaProducto){
      this.mercanciaForm.get('denominacionEspecificaProducto')?.setValidators([Validators.required]);
      this.mercanciaForm.get('denominacionEspecificaProducto')?.updateValueAndValidity();
      this.mercanciaForm.get('valorComercial')?.disable();
      this.mercanciaForm.get('cantidadUmcValor')?.disable();
      this.mercanciaForm.get('cantidadUmc')?.disable();
      this.mercanciaForm.get('paisProcedencia')?.disable();
      this.mercanciaForm.get('paisDeOrigen')?.disable();
    }
    else {
      this.mercanciaForm.get('valorComercial')?.enable();
      this.mercanciaForm.get('cantidadUmcValor')?.enable();
      this.mercanciaForm.get('cantidadUmc')?.enable();
      this.mercanciaForm.get('paisProcedencia')?.enable();
      this.mercanciaForm.get('paisDeOrigen')?.enable();
    }

  }
  /**  * Actualiza las validaciones de los campos 'especifique' y 'especifiqueForma'
   * en función del valor seleccionado en 'tipoProducto' y 'formaFarmaceutica'.
   * Si el tipo de producto o forma farmacéutica coincide con el tipo especial,
   * se establece la validación como requerida.
   */
  updateValidation(): void {
    const TIPO_PRODUCTO = this.mercanciaForm.get('tipoProducto')?.value;
    if (this.elementosAnadidos.includes('especifique') && TIPO_PRODUCTO === this.tipoProductoEspecial) {
      this.mercanciaForm.get('especifique')?.setValidators([Validators.required]);
    }
    const FORMA_FARMACEUTICA = this.mercanciaForm.get('formaFarmaceutica')?.value;
    if (this.elementosAnadidos.includes('especifiqueForma') && FORMA_FARMACEUTICA === this.tipoProductoEspecial) {
      this.mercanciaForm.get('especifiqueForma')?.setValidators([Validators.required]);
    }
    this.mercanciaForm.get('especifique')?.updateValueAndValidity();
    this.mercanciaForm.get('especifiqueForma')?.updateValueAndValidity();
  }


  /**  
   * Validador personalizado para números con decimales.
   * Permite hasta 12 dígitos antes del punto decimal y hasta 10 dígitos después.
   *
   * @returns {ValidatorFn} Función de validador que verifica el formato del número.
   */
  static numeroConDecimalesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const VALUE = control.value;

      // Omitir la validación si está vacío
      if (!VALUE) {
        return null;
      }

      // Patrón de expresión regular: hasta 12 dígitos antes del punto decimal, hasta 10 después
      const PATTERN = REGEX_NUMERO_DECIMAL_5_DIGITOS;

      if (!PATTERN.test(VALUE)) {
        return { formatoInvalido: true };
      }

      return null;
    };
  }
  /**
   * Obtiene el ID correspondiente a una descripción dada en un arreglo de catálogos.
   * Si la descripción es una cadena, busca el objeto cuyo campo 'descripcion' coincida (ignorando mayúsculas/minúsculas)
   * y devuelve su ID. Si no se encuentra, devuelve la descripción original.
   * Si la descripción ya es un número (ID), simplemente lo devuelve.
   * @param {Catalogo[]} array - Arreglo de objetos de catálogo.
   * @param {string | number
   * } descripcion - Descripción o ID a buscar.
   * @return {number | string | undefined} - ID correspondiente o la descripción original.
   * */
  public getIdFromDescripcion(
    array: Catalogo[],
    descripcion: string | number
  ): number | string | undefined {
    // Si descripcion es una cadena, buscar por descripcion (ignorando mayúsculas/minúsculas)
    if (typeof descripcion === 'string') {
      const ITEM = array.find(el => el.descripcion.toLowerCase() === descripcion.toLowerCase());
      return ITEM ? ITEM.id : descripcion; // Return ID if found, else return original descripcion
    }

    // Si la descripción ya es un número (ID), simplemente lo devuelve
    return descripcion;
  }

  static numeroUMCDecimalesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const VALUE = control.value;

      // Omitir la validación si está vacío
      if (!VALUE) {
        return null;
      }

      // Patrón de expresión regular: hasta 12 dígitos antes del punto decimal, hasta 10 después
      const PATTERN = REGEX_NUMERO_DECIMAL_5_DIGITOS;

      if (!PATTERN.test(VALUE)) {
        return { formatoInvalido: true };
      }

      return null;
    };
  }

  /**
  * Obtiene el valor de un campo específico del formulario o de los datos seleccionados.
  * @param {keyof TablaMercanciasDatos | keyof MercanciaForm} field - Nombre del campo a obtener.
  * @returns {string | number | undefined | string[]} - Valor del campo especificado.
  */
  public obtenerValor(
    field: keyof TablaMercanciasDatos | keyof MercanciaForm
  ): string | number | undefined | string[] | Catalogo | undefined {
    return (
      (this.datoSeleccionado && this.datoSeleccionado[field as keyof TablaMercanciasDatos]) ??
      (this.mercanciaFormState && this.mercanciaFormState[field as keyof MercanciaForm])
    );
  }


  /**   * Convierte un valor desconocido en un arreglo de cadenas.
   * Si el valor es nulo o indefinido, retorna un arreglo vacío.
   * Si el valor es un arreglo, lo retorna tal cual.
   * Si el valor es una cadena, lo envuelve en un arreglo.
   * Si el valor es un número, lo convierte a cadena y lo envuelve en un arreglo.
   *  * @param {unknown} value - Valor desconocido a convertir.
   * @returns {string[]} - Arreglo de cadenas resultante.
   **/
  public convertToStringArray(value: unknown): string[] {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string') {
      return [value];
    }
    if (typeof value === 'number') {
      return [value.toString()];
    }
    return [];
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
   * Método que se ejecuta cuando cambia la selección de países de origen.
   * Actualiza la lista de países seleccionados y sincroniza el formulario de mercancía
   * con los datos seleccionados.
   *
   * @param events - Arreglo de cadenas que representa los países seleccionados.
   */
  paisDeOriginSeleccionadasChange(events: string[]): void {
    this.seleccionadasPaisDeOriginDatos = events;
    this.mercanciaForm.patchValue({
      paisDeOriginDatos: events,
    });
  }

  paisDeProcedenciaSeleccionadasChange(events: string[]): void {
    this.seleccionadasPaisDeProcedenciaDatos = events;
    this.mercanciaForm.patchValue({
      paisDeProcedenciaDatos: events,
    });
  }


  /**
   * Maneja el evento de cambio para las selecciones de uso específico.
   *
   * @param events - Un arreglo de cadenas que representa las selecciones actuales de uso específico.
   *
   * Este método actualiza la propiedad `seleccionadasUsoEspesificoDatos` con las selecciones proporcionadas
   * y actualiza el formulario `mercanciaForm` para reflejar los valores seleccionados en el campo `usoEspecifico`.
   */
 usoEspesificoSeleccionadasChange(event: string[]) {

  this.seleccionadasUsoEspesificoDatos = [...event];

  this.mercanciaForm
    .get('usoEspecifico')
    ?.setValue(event.length ? event : null);

  this.mercanciaForm.get('usoEspecifico')?.markAsTouched();
}

  /**
   * Alterna el estado colapsable de una sección específica basada en el orden proporcionado.
   *
   * @param orden - Número que indica la sección a modificar:
   *   - 1: Alterna el estado de `paisDeOriginColapsable`.
   *   - 2: Alterna el estado de `paisDeProcedenciaColapsable`.
   *   - 3: Alterna el estado de `usoEspesificoColapsable`.
   */
  mostrarColapsable(orden: number): void {
    if (orden === 1) {
      this.paisDeOriginColapsable = !this.paisDeOriginColapsable;
    } else if (orden === 2) {
      this.paisDeProcedenciaColapsable = !this.paisDeProcedenciaColapsable;
    } else if (orden === 3) {
      this.usoEspesificoColapsable = !this.usoEspesificoColapsable;
    }
  }

  validateMercanciaForm(): boolean {
    let isValid = true;
  
    Object.keys(this.mercanciaForm.controls).forEach(key => {
      const ctrl = this.mercanciaForm.get(key);
  
      if (key === 'especifique') {
        const tipoProductoDescripcion = this.tipoProductoObj?.[0]?.descripcion;
        if (tipoProductoDescripcion === 'Otro' && (!ctrl || ctrl.invalid)) {
          isValid = false;
        }
      } else if (ctrl && ctrl.invalid) {
        isValid = false;
      }
    });
  
    return isValid;
  }

  /**
   * Agrega una nueva mercancía utilizando los datos del formulario actual
   * y emite un evento con la información de la mercancía seleccionada.
   * Luego, navega de regreso a la ubicación anterior.
   *
   * @returns {void} Este método no devuelve ningún valor.
   */
  agregarMercancia(): void {
    if (this.mercanciaForm.invalid) {
      // Log all invalid controls and their errors for debugging
      const invalidControls = Object.keys(this.mercanciaForm.controls)
        .filter(key => this.mercanciaForm.get(key)?.invalid)
        .map(key => ({
          key,
          value: this.mercanciaForm.get(key)?.value,
          errors: this.mercanciaForm.get(key)?.errors
        }));
    }
    let isFormValid = this.validateMercanciaForm();
    if (!isFormValid) {
      this.mercanciaForm.markAllAsTouched();
      // Only show error if there are required fields that are empty
      let showError = false;
      Object.keys(this.mercanciaForm.controls).forEach(key => {
        const ctrl = this.mercanciaForm.get(key);
        if (ctrl && ctrl.validator) {
          const errors = ctrl.errors;
          if (errors && errors['required'] && (ctrl.value === null || ctrl.value === '' || (Array.isArray(ctrl.value) && ctrl.value.length === 0))) {
            showError = true;
          }
        }
      });
      this.mensajeDeError = showError ? 'Faltan campos por capturar.' : '';
      return;
    }
    this.mensajeDeError = '';
    let VALORTABLAMERCANCIA: TablaMercanciasDatos = this.mercanciaForm.getRawValue();
    let paisDestinoDescripcion = DatosMercanciaComponent.generarCatalogoObjeto(this.paisDestinoDatos, VALORTABLAMERCANCIA.paisDestino ?? '');
    
    VALORTABLAMERCANCIA.paisDestino = paisDestinoDescripcion?.[0]?.descripcion ?? '';

    /**
    * @description
    * Genera un identificador aleatorio compuesto únicamente por números.
    * El resultado siempre será un número entero de 6 dígitos (entre 100000 y 999999).
    * @returns {number} Un número aleatorio de 6 dígitos.
    */
    const ID = Math.floor(100000 + Math.random() * 900000);
    VALORTABLAMERCANCIA.id = this.mercanciaForm.get('id')?.value ? this.mercanciaForm.get('id')?.value : ID
    // Establecer valores adicionales
    // VALORTABLAMERCANCIA.paisProcedenciaDatosClave = this.paisDeProcedencia.filter((pais) => this.seleccionadasPaisDeProcedenciaDatos.includes(pais.descripcion)).map((paise) => paise.clave).filter((clave): clave is string => typeof clave === 'string');
    // VALORTABLAMERCANCIA.usoEspecificoDatosClave = this.usoEspesificoDatos.filter((uso) => this.seleccionadasUsoEspesificoDatos.includes(uso.descripcion)).map((uso) => uso.clave).filter((clave): clave is string => typeof clave === 'string');
    VALORTABLAMERCANCIA.usoEspecifico = this.mercanciaForm.get('usoEspecifico')?.value;
    VALORTABLAMERCANCIA.unidadMedidaComercializacion = this.mercanciaForm.get('cantidadUmcValor')?.value;
    VALORTABLAMERCANCIA.cantidadUMC = this.mercanciaForm.get('cantidadUmc')?.value;
    VALORTABLAMERCANCIA.unidadMedidaTarifa = this.mercanciaForm.get('cantidadUmtValor')?.value;
    VALORTABLAMERCANCIA.cantidadUMT = this.mercanciaForm.get('cantidadUmt')?.value;
    const CLASIFICACIONID = this.mercanciaForm.get('clasificacionProducto')?.value;
    const CLASIFICACIONOBJ = DatosMercanciaComponent.generarCatalogoObjeto(this.clasificacionProductoDatos, CLASIFICACIONID);
    VALORTABLAMERCANCIA.clasificacionProducto = CLASIFICACIONOBJ?.[0]?.descripcion ?? '';
    VALORTABLAMERCANCIA.claveClasificacionProductoObj = CLASIFICACIONOBJ?.[0] ?? undefined;

    /**
     * @description
     * Obtiene y asigna los valores correspondientes al campo **"Especificar Clasificación del Producto"**
     * desde el formulario reactivo, utilizando el catálogo `especificarClasificacionProductoDatos`.
     * * @constant {string | number} ESPECIFICARCLASIFICACIONID - Valor seleccionado en el campo del formulario.
     * @constant {any[]} ESPECIFICARCLASIFICACIONOBJ - Objeto obtenido del catálogo correspondiente.
     * @property {string} especificarClasificacionProducto - Descripción del valor seleccionado.
     * @property {object | undefined} especificarClasificacionObj - Objeto completo del catálogo.
     */
    const ESPECIFICARCLASIFICACIONID = this.mercanciaForm.get('especificarClasificacionProducto')?.value;
    const ESPECIFICARCLASIFICACIONOBJ = DatosMercanciaComponent.generarCatalogoObjeto(this.especificarClasificacionProductoDatos, ESPECIFICARCLASIFICACIONID);
    VALORTABLAMERCANCIA.especificarClasificacionProducto = ESPECIFICARCLASIFICACIONOBJ?.[0]?.descripcion ?? '';
    VALORTABLAMERCANCIA.especificarClasificacionObj = ESPECIFICARCLASIFICACIONOBJ?.[0] ?? undefined;


    /**
     * @description
     * Obtiene y asigna los valores correspondientes al campo **"Tipo de Producto"**
     * desde el formulario reactivo, utilizando el catálogo `tipoProductoDatos`.
     *
     * @constant {string | number} TIPOPRODUCTOID - Valor seleccionado en el formulario.
     * @constant {any[]} TIPOPRODUCTOOBJ - Objeto obtenido del catálogo correspondiente.
     * @property {string} tipoProducto - Descripción del tipo de producto seleccionado.
     * @property {object | undefined} tipoProductoObj - Objeto completo asociado al tipo de producto.
     */
    const TIPOPRODUCTOID = this.mercanciaForm.get('tipoProducto')?.value;
    const TIPOPRODUCTOOBJ = DatosMercanciaComponent.generarCatalogoObjeto(this.tipoProductoDatos, TIPOPRODUCTOID);
    VALORTABLAMERCANCIA.tipoProducto = TIPOPRODUCTOOBJ?.[0]?.descripcion ?? '';
    VALORTABLAMERCANCIA.tipoProductoObj = TIPOPRODUCTOOBJ?.[0] ?? undefined;

    /**
     * @description
     * Obtiene y asigna los valores correspondientes al campo **"Forma Farmacéutica"**
     * utilizando el catálogo `formaFarmaceuticaDatos`.
     *
     * @constant {string | number} FORMAFARMACEUTICAID - ID del valor seleccionado.
     * @constant {any[]} FORMAFARMACEUTICAOBJ - Objeto del catálogo con la descripción correspondiente.
     * @property {string} formaFarmaceutica - Descripción de la forma farmacéutica seleccionada.
     * @property {object | undefined} formaFarmaceuticaObj - Objeto completo de la forma farmacéutica.
     */
    const FORMAFARMACEUTICAID = this.mercanciaForm.get('formaFarmaceutica')?.value;
    const FORMAFARMACEUTICAOBJ = DatosMercanciaComponent.generarCatalogoObjeto(this.formaFarmaceuticaDatos, FORMAFARMACEUTICAID);
    VALORTABLAMERCANCIA.formaFarmaceutica = FORMAFARMACEUTICAOBJ?.[0]?.descripcion ?? '';
    VALORTABLAMERCANCIA.formaFarmaceuticaObj = FORMAFARMACEUTICAOBJ?.[0] ?? undefined;

    /**
     * @description
     * Obtiene y asigna los valores correspondientes al campo **"Estado Físico"**
     * utilizando el catálogo `estadoFisicoDatos`.
     *
     * @constant {string | number} ESTADOFISICOID - ID seleccionado del formulario.
     * @constant {any[]} ESTADOFISICOOBJ - Objeto del catálogo con su descripción.
     * @property {string} estadoFisico - Descripción del estado físico seleccionado.
     * @property {object | undefined} estadoFisicoObj - Objeto completo con la información del estado físico.
     */
    const ESTADOFISICOID = this.mercanciaForm.get('estadoFisico')?.value;
    const ESTADOFISICOOBJ = DatosMercanciaComponent.generarCatalogoObjeto(this.estadoFisicoDatos, ESTADOFISICOID);
    VALORTABLAMERCANCIA.estadoFisico = ESTADOFISICOOBJ?.[0]?.descripcion ?? '';
    VALORTABLAMERCANCIA.estadoFisicoObj = ESTADOFISICOOBJ?.[0] ?? undefined;

    /**
     * @description
     * Obtiene y asigna los valores correspondientes al campo **"Unidad de Medida Comercialización (UMC)"**
     * utilizando el catálogo `cantidadUmcDatos`.
     *
     * @constant {string | number} UMCID - ID del valor seleccionado.
     * @constant {any[]} UMCOBJ - Objeto obtenido del catálogo.
     * @property {string} cantidadUMC - Descripción de la unidad de medida comercialización.
     * @property {object | undefined} cantidadUMCObj - Objeto completo con los datos de la UMC.
     */
    const UMCID = this.mercanciaForm.get('cantidadUmc')?.value;
    const UMCOBJ = DatosMercanciaComponent.generarCatalogoObjeto(this.cantidadUmcDatos, UMCID);
    VALORTABLAMERCANCIA.cantidadUMC = UMCOBJ?.[0]?.descripcion ?? '';
    VALORTABLAMERCANCIA.cantidadUMCObj = UMCOBJ?.[0] ?? undefined;
    const paisDeOrigenIDs = this.mercanciaForm.get('paisDeOriginDatos')?.value || [];
    VALORTABLAMERCANCIA.paisOriginDatosClave = this.paisDeOrigenDatos.filter((pais) => paisDeOrigenIDs.includes(pais.descripcion)).map((paise) => paise.clave).filter((clave): clave is string => typeof clave === 'string');
    const paisDeProcedenciaIDs = this.mercanciaForm.get('paisDeProcedenciaDatos')?.value || [];
    VALORTABLAMERCANCIA.paisProcedenciaDatosClave = this.paisDeProcedenciaDatos.filter((pais) => paisDeProcedenciaIDs.includes(pais.descripcion)).map((paise) => paise.clave).filter((clave): clave is string => typeof clave === 'string');
    const usoEspecificoIDs = this.mercanciaForm.get('usoEspecifico')?.value || [];
    VALORTABLAMERCANCIA.usoEspecificoDatosClave = this.usoEspesificoDatos.filter((uso) => usoEspecificoIDs.includes(uso.descripcion)).map((uso) => uso.clave).filter((clave): clave is string => typeof clave === 'string');

    // Emitir los datos de la mercancía
    this.mercanciaSeleccionado.emit(VALORTABLAMERCANCIA);

    // Restablecer el formulario para el siguiente uso
    this.mercanciaForm.reset();

    // Cierra el modal
    this.cerrarModal.emit();
  }

  /**
   * Genera un arreglo de objetos de catálogo que coinciden con el identificador proporcionado.
   *
   * @param {Catalogo[]} catalogo - Arreglo de objetos de catálogo.
   * @param {string} id - Identificador para filtrar los objetos del catálogo.
   * @returns {Catalogo[] | undefined} - Arreglo de objetos de catálogo que coinciden con el identificador, o undefined si no hay coincidencias.
   */
  static generarCatalogoObjeto(catalogo: Catalogo[] | undefined | null, id: string): Catalogo[] | undefined {
    if (!catalogo || catalogo.length === 0) {
      return undefined;
    }
    return catalogo.filter(item => item.clave === id);
  }

  /**
   * Restablece el formulario de mercancía a su estado inicial.
   * Este método se utiliza para limpiar todos los campos del formulario,
   * eliminando cualquier dato ingresado previamente.
   */
  limpiarMercancia(): void {
    this.seleccionadasUsoEspesificoDatos = [];
    this.seleccionadasPaisDeOriginDatos = [];
    this.seleccionadasPaisDeProcedenciaDatos = [];
    this.mercanciaForm.reset();
  }

  /**
   * Navega a la ubicación anterior en el historial de navegación.
   * Utiliza el servicio de ubicación para retroceder una página.
   */
  cancelar(): void {
    this.cerrarModal.emit();
  }
  /**
   * @method cambiarFraccionArancelaria
   * @description Actualiza los valores de los campos `descripcionFraccion` y `cantidadUmt` en el formulario reactivo `mercanciaForm`
   * cuando el campo `fraccionArancelaria` está presente.
   *
   * @remarks
   * Este método verifica si el control `fraccionArancelaria` existe en el formulario. Si es así, establece valores predeterminados
   * para los campos `descripcionFraccion` y `cantidadUmt` utilizando las constantes `DESCRIPCION_FRACCION_DESHABILITADO_VALOR` y
   * `UMT_DESHABILITADO_VALOR`, respectivamente.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  cambiarFraccionArancelaria(): void {
    const FRACCION = this.mercanciaForm.get('fraccionArancelaria')?.value;
    if (!FRACCION || FRACCION.length < 8) {
      this.mercanciaForm.get('descripcionFraccion')?.setValue('');
      this.mercanciaForm.get('cantidadUmt')?.setValue('');
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
                this.mercanciaForm.get('descripcionFraccion')?.setValue(DATOS_FRACCION.descripcionAlternativa);
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
                this.mercanciaForm.get('cantidadUmt')?.setValue(DATOS_UMT.descripcion);
              } else {
                this.abrirModal();
              }
            }
          );
      }
    }
  }


  /**
   * Valida la longitud de la fracción arancelaria ingresada en el formulario.
   * Si la longitud es menor a 8 caracteres, establece `showLimitError` en true,
   * de lo contrario, lo establece en false.
   * */
  public validarFraccionArancelaria(): void {
    const VALUE = this.mercanciaForm.get('fraccionArancelaria')?.value;
  this.showLimitError = VALUE?.length !== 8;
  }

  /**
   * Método que se llama cuando se elimina un pedimento.
   * @param {boolean} borrar - Indica si se debe eliminar el pedimento.
   * Si es verdadero, se elimina el pedimento en la posición `elementoParaEliminar` del arreglo `pedimentos`.
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /**
   * Actualiza el valor del campo `fechaDeFabricacio` en el formulario `mercanciaForm`.
   *
   * @param valor - Cadena que representa la fecha de fabricación seleccionada.
   *
   * @example
   * this.fechaDeFabricacioValor('17/09/2025');
   */
  fechaDeFabricacioValor(valor: string): void {
    this.mercanciaForm.patchValue({
      fechaDeFabricacio: valor,
    });
  }

  /**
   * Actualiza el valor del campo `fechaDeCaducidad` en el formulario `mercanciaForm`.
   *
   * @param valor - Cadena que representa la fecha de caducidad seleccionada.
   *
   * @example
   * this.fechaDeMovimientoValor('01/01/2026');
   */
  fechaDeMovimientoValor(valor: string): void {
    this.mercanciaForm.patchValue({
      fechaDeMovimiento: valor,
    });
  }

  /**
   * Maneja el cambio de tipo de producto.
   * Actualiza el objeto `tipoProductoObj` en el componente con el catálogo correspondiente
   * al tipo de producto seleccionado en el formulario.
   *
   * @param _clave - Objeto de catálogo seleccionado para el tipo de producto.
   */
  onCambioTipoProduct(_clave: Catalogo): void {
    const TIPOPRODUCTOID = this.mercanciaForm.get('tipoProducto')?.value;
    this.tipoProductoObj = DatosMercanciaComponent.generarCatalogoObjeto(
      this.tipoProductoDatos,
      TIPOPRODUCTOID
    );
  }

  /**
   * Método que se llama cuando se envía el formulario.
   * Se utiliza para establecer los valores en el store de DatosDomicilioLegal.
   */
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

    this.elementoParaEliminar = i;
  }



agregarOrigen(tipo: '' | 't'): void {
  this.originList?.agregar(tipo);
}

quitarOrigen(tipo: '' | 't'): void {
  this.originList?.quitar(tipo);
}

agregarProcedencia(tipo: '' | 't'): void {
  this.procedenciaList?.agregar(tipo);
}

quitarProcedencia(tipo: '' | 't'): void {
  this.procedenciaList?.quitar(tipo);
}

agregarUso(tipo: '' | 't'): void {
  this.usoList?.agregar(tipo);
}

quitarUso(tipo: '' | 't'): void {
  this.usoList?.quitar(tipo);
}



  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Se utiliza para limpiar recursos y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

/** * Validador personalizado para verificar si una matriz está vacía.
 *
 * @param {AbstractControl} control - El control del formulario que contiene el valor a validar.
 * @returns {ValidationErrors | null} - Retorna un objeto de error si la matriz está vacía, o null si es válida.
 */
export function matrizRequerida(
  control: AbstractControl
): ValidationErrors | null {
  const VALUE = control.value;
  return Array.isArray(VALUE) && VALUE.length === 0 ? { required: true } : null;
}