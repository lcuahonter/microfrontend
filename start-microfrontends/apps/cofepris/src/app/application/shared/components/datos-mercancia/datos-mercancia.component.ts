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
} from '@libs/shared/data-access-user/src';
import {
  CAMPOS_CLAVE,
  DATOS_MERCANCIA_CAMPO,
  DATOS_MERCANCIA_CLAVE_TABLA,
  DESCRIPCION_FRACCION_DESHABILITADO_VALOR,
  ES_VALIDO_REGISTRO_O_VENCIMIENTO,
  FEACCION_AFRACCION_ARANCELARIA_CATALOG,
  TIPO_PRODUCTO_ESPECIAL,
  UMT_DESHABILITADO_VALOR,
} from '../../constantes/datos-solicitud.enum';
import {
  Catalogo,
  CrossListLable,
  MercanciaForm,
  TablaMercanciaClaveConfig,
  TablaMercanciasDatos,
} from '../../models/datos-solicitud.model';
import { CommonModule, Location } from '@angular/common';
import {
  FECHA_DE_CADUCIDAD_MERCANICA,
  FECHA_DE_CADUCIDAD_PAGO,
  FECHA_DE_FABRICACIO_PAGO,
} from '../../models/terceros-relacionados.model';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { CatalogoServices } from '@ng-mf/data-access-user';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { DetalleMercancia } from '../../models/detalle-mercancia.model';
import { DetalleMercanciaComponent } from '../detalle-mercancia/detalle-mercancia.component';
import { NUMERO_REGISTRO_SANITARIO } from '../../constantes/terceros-relacionados-fabricante.enum';
import { Observable } from 'rxjs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
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
    DetalleMercanciaComponent,
    TablaDinamicaComponent,
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
   * Event emitter to notify parent component to close the modal
   */
  @Output() cerrarModal = new EventEmitter<void>();

  requiedField:boolean = false;


  fraccionArancelariaCatalog:boolean = true;
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

    private detalleMercanciaData: DetalleMercancia | null = null;

  /**
   * Referencias a los componentes de listas cruzadas.
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
   * @event eliminarMercanciaDatos
   * @description EventEmitter that emits an array of merchandise items to be deleted.
   * This is used to notify the parent component about the deletion of selected merchandise items.
   */
  @Output() eliminarMercanciaDatos: EventEmitter<DetalleMercancia[]> =
    new EventEmitter<DetalleMercancia[]>(true);

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

  /** Etiquetas personalizadas para los crosslists */
  public paisDeOriginLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de origen:',
    derecha: 'País(es) seleccionado(s)',
  };

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

  /**
   * @property {CrossListLable} paisDeProcedenciaLabel
   * Etiqueta personalizada para el componente de lista cruzada de país de procedencia.
   * Define los títulos mostrados en la parte izquierda y derecha del componente.
   */
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
  paisDeProcedenciaBotonsUno = [
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
   * Botones de acción para gestionar listas de países en la tercera sección.
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
   * @property {string[]} seleccionadasPaisDeOriginDatos
   * Lista de países seleccionados como origen.
   */
  public seleccionadasPaisDeOriginDatos: string[] = [];

  /**
   * @property {string[]} seleccionadasPaisDeProcedenciaDatos
   * Lista de países seleccionados como procedencia.
   */
  public seleccionadasPaisDeProcedenciaDatos: string[] = [];

  /**
   * @property {string[]} seleccionadasUsoEspesificoDatos
   * Lista de usos específicos seleccionados.
   */
  public seleccionadasUsoEspesificoDatos: string[] = [];

  /**
   * @property {Catalogo[]} paisDeProcedenciaDatos
   * Datos de países para la lista cruzada de procedencia.
   */
  public paisDeProcedenciaDatos: string[] = [];

  /**
   * @property {Catalogo[]} usoEspesificoDatos
   * Datos de usos específicos para lista cruzada.
   */
  public usoEspesificoDatos: string[] = [];

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

  tipoFOFA='FOFA.OTR';

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
  /** @property {Catalogo[]} crosslistPaisDeOriginDatos
   * Datos de países para la lista cruzada de país de origen.
   */
  crosslistPaisDeOriginDatos: Catalogo[] = [];
  /** @property {Catalogo[]} crosslistPaisDeProcedenciaDatos
   * Datos de países para la lista cruzada de país de procedencia.
   * */
  crosslistPaisDeProcedenciaDatos: Catalogo[] = [];
  /** @property {Catalogo[]} crosslistUsoEspecificoDatos
   * Datos de usos específicos para lista cruzada.
   * */
  crosslistUsoEspecificoDatos: Catalogo[] = [];

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
    //this.fraccionArancelariaCatalog = !FEACCION_AFRACCION_ARANCELARIA_CATALOG.includes(this.idProcedimiento);
    this.paisDeProcedenciaBotonsUno = [
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
    this.paisDeProcedenciaBotonsDos = [
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
    this.paisDeProcedenciaBotonsTres = [
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

    if( this.mercanciaForm.get('clasificacionProducto')?.value){
      this.onCambioClasificacionProducto(this.datoSeleccionado?.claveClasificacionProductoObj);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoProducto'] || changes['formaFarmaceutica']) {
      this.updateValidation();
    }
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
    this.validarElementos();
    this.crearMercanciaForm();
    this.crossListRequirdos();
    this.inicializarCrosslist();
  }

  /**
   * Inicializa los datos de los crosslists de países y uso específico.
   * Realiza llamadas básicas a la API para obtener los catálogos y asignarlos a las propiedades correspondientes.
   */
  inicializarCrosslist(): void {
    this.subscription.add(
      this.catalogoService
        .paisesCatalogo(String(this.idProcedimiento))
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          if (response && Array.isArray(response.datos)) {
            this.crosslistPaisDeOriginDatos = response.datos;
            this.seleccionarOrigenDelPais = response.datos.map((item: Catalogo) => item.descripcion);
            const SELECTED = this.mercanciaForm.getRawValue();
            this.seleccionadasPaisDeOriginDatos = Array.isArray(SELECTED.paisDeOriginDatos)
              ? SELECTED.paisDeOriginDatos
              : SELECTED.paisDeOriginDatos
              ? [SELECTED.paisDeOriginDatos]
              : [];
            const PAIS_DE_ORIGEN = this.obtenerValor('paisDeOriginDatos') || [];
            const PAIS_DE_ORIGEN_ARRAY = this.convertToStringArray(PAIS_DE_ORIGEN);
              // If any descripcion in crosslistPaisDeOriginDatos includes a value in PAIS_DE_ORIGEN_ARRAY, use descripcion; else use clave logic
              const DESCRIPCIONMATCHES = this.crosslistPaisDeOriginDatos
                .filter(pais => PAIS_DE_ORIGEN_ARRAY.some(val => pais.descripcion?.includes(val)))
                .map(pais => pais.descripcion);

              if (DESCRIPCIONMATCHES.length > 0) {
                this.seleccionadasPaisDeOriginDatos = DESCRIPCIONMATCHES;
              } else {
                this.seleccionadasPaisDeOriginDatos = this.crosslistPaisDeOriginDatos
                  ?.filter(pais => PAIS_DE_ORIGEN_ARRAY.includes(pais.clave as string))
                  .map(pais => pais.descripcion) ?? [];
              }
          this.mercanciaForm.patchValue({
            paisDeOriginDatos: this.seleccionadasPaisDeOriginDatos
          });
             
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
            this.crosslistPaisDeProcedenciaDatos = response.datos;
            this.paisDeProcedenciaDatos = response.datos.map((item: Catalogo) => item.descripcion);
            const SELECTED = this.mercanciaForm.getRawValue();
            this.seleccionadasPaisDeProcedenciaDatos = Array.isArray(SELECTED.paisDeProcedenciaDatos)
              ? SELECTED.paisDeProcedenciaDatos
              : SELECTED.paisDeProcedenciaDatos
              ? [SELECTED.paisDeProcedenciaDatos]
              : [];
               const PAIS_DE_ORIGEN = this.obtenerValor('paisDeProcedenciaDatos') || [];
            const PAIS_DE_ORIGEN_ARRAY = this.convertToStringArray(PAIS_DE_ORIGEN);
            const DESCRIPCIONMATCHES = this.crosslistPaisDeProcedenciaDatos
                .filter(pais => PAIS_DE_ORIGEN_ARRAY.some(val => pais.descripcion?.includes(val)))
                .map(pais => pais.descripcion);

              if (DESCRIPCIONMATCHES.length > 0) {
                this.seleccionadasPaisDeProcedenciaDatos = DESCRIPCIONMATCHES;
              } else {
                this.seleccionadasPaisDeProcedenciaDatos = this.crosslistPaisDeOriginDatos
                  ?.filter(pais => PAIS_DE_ORIGEN_ARRAY.includes(pais.clave as string))
                  .map(pais => pais.descripcion) ?? [];
              }
          this.mercanciaForm.patchValue({
            paisDeProcedenciaDatos: this.seleccionadasPaisDeProcedenciaDatos
          });
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
            this.crosslistUsoEspecificoDatos = response.datos;
            this.usoEspesificoDatos = response.datos.map((item: Catalogo) => item.descripcion);
            const SELECTED = this.mercanciaForm.getRawValue();
            this.seleccionadasUsoEspesificoDatos = Array.isArray(SELECTED.usoEspecifico)
              ? SELECTED.usoEspecifico
              : SELECTED.usoEspecifico
              ? [SELECTED.usoEspecifico]
              : [];
               const PAIS_DE_ORIGEN = this.obtenerValor('usoEspecifico') || [];
            const PAIS_DE_ORIGEN_ARRAY = this.convertToStringArray(PAIS_DE_ORIGEN);
            const DESCRIPCIONMATCHES = this.crosslistUsoEspecificoDatos
                .filter(pais => PAIS_DE_ORIGEN_ARRAY.some(val => pais.descripcion?.includes(val)))
                .map(pais => pais.descripcion);

              if (DESCRIPCIONMATCHES.length > 0) {
                this.seleccionadasUsoEspesificoDatos = DESCRIPCIONMATCHES;
              } else {
                this.seleccionadasUsoEspesificoDatos = this.crosslistUsoEspecificoDatos
                  ?.filter(pais => PAIS_DE_ORIGEN_ARRAY.includes(pais.clave as string))
                  .map(pais => pais.descripcion) ?? [];
              }
          this.mercanciaForm.patchValue({
            usoEspecifico: this.seleccionadasUsoEspesificoDatos
          });
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
  onCambioClasificacionProducto(event: any): void {
    const CLASIFICACION_SELECCIONADA = event.clave;
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

    this.subscription.add(
      this.catalogoService
        .formaFarmaceuticaCatalogo(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];

          if (response) {
            this.formaFarmaceuticaDatos = DATOS;
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
   * Indica si la acción actual es modificar una mercancía existente.
   * Se utiliza para ajustar el comportamiento del formulario y la interfaz de usuario
   * según si se está creando una nueva mercancía o modificando una ya existente.
   */
  @Input() isAccionModificar: boolean = false;
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

  fechaDeCaducidadInputMercanica: InputFecha = FECHA_DE_CADUCIDAD_MERCANICA;

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
    this.paisDeOriginLabel.derecha = this.elementosRequirdos.includes(
      'paisDeOrigen'
    )
      ? 'País(es) seleccionado(s)*:'
      : 'País(es) seleccionado(s)*:';
    this.paisDeProcedenciaLabel.derecha = this.elementosRequirdos.includes(
      'paisDeProcedencia'
    )
      ? 'País(es) seleccionado(s)*:'
      : 'País(es) seleccionado(s)*:';
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
      case 260102:
        this.elementosNoValidos = [
          'denominacionDistintiva',
          'denominacionComun',
          'formaFarmaceutica',
          'estadoFisico',
          'presentacion',
          'numeroRegistroSanitario',
          'fechaCaducidad',
        ];
        this.elementosAnadidos = [
          'marca',
          'especifique',
          'claveDeLos',
          'fechaDeFabricacio',
          'fechaDeCaducidad',
        ];
        break;
        case 260103:
        this.elementosNoValidos = [
          'denominacionDistintiva',
          'denominacionComun',
          'formaFarmaceutica',
          'estadoFisico',
          'presentacion',
          'numeroRegistroSanitario',
          'fechaCaducidad',
        ];
        this.elementosAnadidos = [
          'marca',
          'especifique',
          'claveDeLos',
          'fechaDeFabricacio',
          'fechaDeCaducidad',
        ];
        break;
      case 260202:
        this.elementosAnadidos = ['especifique','especifiqueForma'];
        this.elementosDeshabilitados = ['descripcionFraccion', 'cantidadUmt'];
        break;
      case 260203:
        this.detalleMercancia = true;
        this.elementosAnadidos = ['especifique','especifiqueEstado'];
        this.elementosDeshabilitados = ['descripcionFraccion', 'cantidadUmt'];
        this.elementosNoValidos = ['formaFarmaceutica','denominacionDistintiva'];
        break;
      case 260204:
        this.elementosAnadidos = ['especifique','especifiqueForma'];
        this.elementosDeshabilitados = ['descripcionFraccion', 'cantidadUmt'];
        break;
      case 260208:
        this.elementosAnadidos = ['especifique','especifiqueForma'];
        this.elementosDeshabilitados = ['descripcionFraccion', 'cantidadUmt'];
        break;
        case 260215:
          this.elementosAnadidos = ['especifique', 'especifiqueEstado'];
          this.elementosDeshabilitados = ['descripcionFraccion', 'cantidadUmt'];
          break;
      case 260209:
       // this.elementosNoValidos = ['numeroRegistroSanitario', 'fechaCaducidad'];
        this.elementosAnadidos = ['especifique'];
        this.elementosDeshabilitados = ['descripcionFraccion', 'cantidadUmt'];
        break;
      case 260207:
        this.elementosAnadidos = ['especifique'];
        this.elementosDeshabilitados = ['descripcionFraccion', 'cantidadUmt'];
        break;
      case 260215:
        this.elementosAnadidos = ['especifique','especifiqueEstado'];
        this.elementosDeshabilitados = ['descripcionFraccion', 'cantidadUmt'];
        this.elementosNoValidos = ['formaFarmaceutica','denominacionDistintiva'];
        break;
      case 260216:
         this.elementosNoValidos = [
          'formaFarmaceutica',
          'numeroRegistroSanitario',
          'fechaCaducidad',
        ];
        break;
      case 260217:
        this.elementosAnadidos = ['especifique', 'especifiqueEstado'];
        this.elementosNoValidos = [
          'formaFarmaceutica',
          'numeroRegistroSanitario',
          'fechaCaducidad',
        ];
        break;
      case 260218:
        this.elementosAnadidos = ['especifique','especifiqueForma', 'especifiqueEstado'];
        this.elementosDeshabilitados = ['descripcionFraccion', 'cantidadUmt'];
        break;
      case 260219:
        this.elementosAnadidos = [
          'especifique',
          'especifiqueForma',
          'especifiqueEstado',
        ];
        this.elementosDeshabilitados = ['descripcionFraccion', 'cantidadUmt'];
        break;
      case 260201:
        this.elementosDeshabilitados = ['descripcionFraccion', 'cantidadUmt'];
        this.elementosRequirdos = [
          'paisDeOrigen',
          'paisDeProcedencia',
          'usoEspecífico',
        ];
        this.elementosAnadidos = [
          'especifique',
          'especifiqueForma',
          'especifiqueEstado',
        ];
        this.elementosMandatorios = ['especifiqueEstado'];
        this.elementosBelow = true;
        break;
      case 260213:
        this.elementosNoValidos = [
          'formaFarmaceutica',
          'numeroRegistroSanitario',
          'fechaCaducidad',
        ];
        this.elementosDeshabilitados = ['descripcionFraccion', 'cantidadUmt'];
        break;
      case 260214:
        this.elementosAnadidos = ['especifique', 'especifiqueEstado'];
        this.elementosNoValidos = [
          'formaFarmaceutica',
          'numeroRegistroSanitario',
          'fechaCaducidad',
        ];
        this.elementosDeshabilitados = ['descripcionFraccion', 'cantidadUmt'];
        break;
      case 260101:
        this.elementosNoValidos = [
          'denominacionDistintiva',
          'denominacionComun',
          'formaFarmaceutica',
          'estadoFisico',
          'presentacion',
          'numeroRegistroSanitario',
          'fechaCaducidad',
        ];
        this.elementosAnadidos = [
          'marca',
          'claveDeLos',
          'fechaDeFabricacio',
          'fechaDeCaducidad',
        ];
        break;
        case 260210:
        this.elementosDeshabilitados = ['descripcionFraccion','cantidadUmt'];
        break;
      default:
        if (this.detalleMercancia) {
          this.elementosNoValidos = [
            'denominacionDistintiva',
            'formaFarmaceutica',
          ];
        }
        break;
    }
  }

  /**
   * Restablece los valores de los campos clave en el formulario.
   */
  modificarClave(): void {
    
    if (!this.claveLista.length) {
      return;
    }
    const CLAVES_A_ELIMINAR = new Set(
      this.claveLista.map((item) => item.clave)
    );
    const CLAVE = this.mercanciaForm.get('claveDeLos')?.value;
    const FABRICACION = this.mercanciaForm.get('fechaDeFabricacio')?.value;
    const CADUCIDAD = this.mercanciaForm.get('fechaDeCaducidad')?.value;
    for (let i = 0; i < this.claveConfig.datos.length; i++) {
      const ITEM = this.claveConfig.datos[i];
      if (CLAVES_A_ELIMINAR.has(ITEM.clave)) {
        this.claveConfig.datos[i] = {
          clave: CLAVE,
          fabricacion: FABRICACION,
          caducidad: CADUCIDAD,
        };
        break;
      }
    }
  }

  /**
   * Actualiza la lista de claves y ajusta los valores del formulario de mercancía
   * según la fila seleccionada en la configuración de claves.
   *
   * @param event - Arreglo de configuraciones de claves de mercancía (`TablaMercanciaClaveConfig[]`).
   *                Contiene las claves que se utilizarán para actualizar la lista.
   *
   * - Si la lista de claves está vacía, la función no realiza ninguna acción.
   * - Busca en los datos de configuración de claves una fila que coincida con las claves proporcionadas.
   * - Si se encuentra una fila coincidente, actualiza los valores del formulario de mercancía
   *   con los datos de la fila seleccionada, incluyendo la clave, la fecha de fabricación
   *   y la fecha de caducidad.
   */
  claveListaFn(event: TablaMercanciaClaveConfig[]): void {
    this.claveLista = event;
    if (!this.claveLista.length) {
      return;
    }
    const CLAVES_A_ELIMINAR = new Set(
      this.claveLista.map((item) => item.clave)
    );
    const FILA_SELECCIONADA = this.claveConfig.datos.find((item) =>
      CLAVES_A_ELIMINAR.has(item.clave)
    );
    if (FILA_SELECCIONADA) {
      this.mercanciaForm.patchValue({
        claveDeLos: FILA_SELECCIONADA.clave,
        fechaDeFabricacio: FILA_SELECCIONADA.fabricacion,
        fechaDeCaducidad: FILA_SELECCIONADA.caducidad,
      });
    }
  }
  /**
   * Agrega una nueva clave a la lista `claveConfig.datos`
   * solo si los valores de los campos no están vacíos.
   */
  agregarClave(): void {
    const CLAVE = this.mercanciaForm.get('claveDeLos')?.value;
    const FABRICACION = this.mercanciaForm.get('fechaDeFabricacio')?.value;
    const CADUCIDAD = this.mercanciaForm.get('fechaDeCaducidad')?.value;
    if (CLAVE && FABRICACION && CADUCIDAD) {
      this.claveConfig.datos = [
        ...this.claveConfig.datos,
        {
          id: (this.claveConfig.datos.length || 0) + 1,
          clave: CLAVE,
          fabricacion: FABRICACION,
          caducidad: CADUCIDAD,
        },
      ];
      this.mercanciaForm.get('claveDeLos')?.reset();
      this.mercanciaForm.get('fechaDeFabricacio')?.reset();
      this.mercanciaForm.get('fechaDeCaducidad')?.reset();
    }
  }

  /**
   * Elimina las claves seleccionadas en `claveLista` de `claveConfig.datos`.
   * Si la lista de claves a eliminar está vacía, no hace nada.
   */
  eliminarClave(): void {
    if (!this.claveLista.length) {
      return;
    }
    const CLAVES_A_ELIMINAR = new Set(
      this.claveLista.map((item) => item.clave)
    );
    this.claveConfig.datos = this.claveConfig.datos.filter(
      (item) => !CLAVES_A_ELIMINAR.has(item.clave)
    );
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
   * - `fechaCaducidad`: Fecha de caducidad del producto (opcional).
   * - `paisDeOriginDatos`: País de origen del producto (requerido).
   * - `paisDeProcedenciaDatos`: País de procedencia del producto (requerido).
   *
   * @returns void
   */
  crearMercanciaForm(): void {
  const PAIS_DE_ORIGEN = this.obtenerValor('paisDeOriginDatos') || [];
  const USO_ESPECIFICOS = this.obtenerValor('usoEspecifico') || [];
  const PAIS_DE_PROCEDENCIA = this.obtenerValor('paisDeProcedenciaDatos') || [];

  // Convert arrays properly
  this.seleccionadasPaisDeOriginDatos = this.convertToStringArray(PAIS_DE_ORIGEN);
  this.paisDeOriginColapsable = this.seleccionadasPaisDeOriginDatos.length > 0;

  this.seleccionadasUsoEspesificoDatos = this.convertToStringArray(USO_ESPECIFICOS);
  this.usoEspesificoColapsable = this.seleccionadasUsoEspesificoDatos.length > 0;

  this.seleccionadasPaisDeProcedenciaDatos = this.convertToStringArray(PAIS_DE_PROCEDENCIA);
  this.paisDeProcedenciaColapsable = this.seleccionadasPaisDeProcedenciaDatos.length > 0;

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
    tipoProducto: [this.obtenerValor('tipoProducto'), [Validators.required]],
    formaFarmaceutica: [
      this.obtenerValor('formaFarmaceutica'),
      [Validators.required],
    ],
    estadoFisico: [this.obtenerValor('estadoFisico'), [Validators.required]],
    fraccionArancelaria: [
      this.obtenerValor('fraccionArancelaria'),
      [
        Validators.required,
        Validators.maxLength(8),
        Validators.pattern(SOLO_REGEX_NUMEROS),
        Validators.minLength(8),
      ],
    ],
    descripcionFraccion: [
      {
        value: this.obtenerValor('descripcionFraccion'),
        disabled: this.elementosDeshabilitados.includes('descripcionFraccion'),
      },
      [Validators.required],
    ],
    cantidadUmtValor: [
      this.obtenerValor('cantidadUmtValor'),
      [
        Validators.required,
        Validators.pattern(REGEX_DECIMAL),
        DatosMercanciaComponent.numeroConDecimalesValidator()
      ],
    ],
    cantidadUmt: [
      {
        value: this.obtenerValor('cantidadUmt'),
        disabled: this.elementosDeshabilitados.includes('cantidadUmt'),
      },
      [Validators.required],
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
    numeroRegistroSanitario: [
      this.obtenerValor('numeroRegistroSanitario')
    ],
    fechaCaducidad: [this.obtenerValor('fechaCaducidad')],
    paisDeOriginDatos: [
      this.seleccionadasPaisDeOriginDatos,
      [Validators.required, matrizRequerida],
    ],
    paisDeProcedenciaDatos: [
      this.seleccionadasPaisDeProcedenciaDatos,
      [Validators.required, matrizRequerida],
    ],
    usoEspecifico: [
      this.seleccionadasUsoEspesificoDatos,
      [Validators.required, matrizRequerida]
    ],
    especifique: [
      this.obtenerValor('especifique')
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

    const TIPO_PRODUCTO_VALUE = this.mercanciaForm.get('tipoProducto')?.value;
    if (TIPO_PRODUCTO_VALUE) {
      this.onCambioTipoProduct({ clave: TIPO_PRODUCTO_VALUE } as any);
    }
  }, 800);

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

  // Add dynamic controls
  for (const NOMBRE_DEL_CONTROL of this.elementosAnadidos) {
    if (!this.mercanciaForm.contains(NOMBRE_DEL_CONTROL)) {
      // Determine if this field is mandatory
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

  if (!this.elementosNoValidos.includes('presentacion') && !this.detalleMercancia) {
    this.mercanciaForm.addControl(
      'presentacion',
      new FormControl(this.obtenerValor('presentacion'), [Validators.required])
    );
  } else {
    if (this.mercanciaForm.contains('presentacion')) {
      this.mercanciaForm.removeControl('presentacion');
    }
  }
}
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


  static numeroConDecimalesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const VALUE = control.value;
      
      // Skip validation if empty
      if (!VALUE) {
        return null;
      }
      
      // Regex pattern: up to 12 digits before decimal, up to 10 after
      const PATTERN = /^\d{1,12}(\.\d{1,5})?$/;
      
      if (!PATTERN.test(VALUE)) {
        return { formatoInvalido: true };
      }
      
      return null;
    };
  }
public getIdFromDescripcion(
  array: Catalogo[] | undefined,
  descripcion: string | number
): number | string | undefined {
  if (!array || !Array.isArray(array)) {
    return descripcion;
  }
  if (typeof descripcion === 'string') {
    const ITEM = array.find(
      el => el.descripcion?.toLowerCase?.() === descripcion.toLowerCase()
    );
    return ITEM ? ITEM.clave : descripcion;
  }
  return descripcion;
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


public convertToStringArray(value: unknown): string[] {
  if (!value){
    return [];
  }
  if (Array.isArray(value)){
   return value;
  } 
  if (typeof value === 'string'){
     return [value];
  }
  if (typeof value === 'number'){
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
  // eslint-disable-next-line class-methods-use-this
  public isValid(control: AbstractControl, campo?: string): boolean | null {
    if (control instanceof FormGroup && campo) {
      const FORM_CONTROL = control.controls[campo];
      return FORM_CONTROL ? FORM_CONTROL.errors && FORM_CONTROL.touched : null;
    }
    return control.errors && control.touched;
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
  usoEspesificoSeleccionadasChange(events: string[]): void {
    this.seleccionadasUsoEspesificoDatos = events;
    this.mercanciaForm.get('usoEspecifico')?.setValue(events);
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

  /**
   * Agrega una nueva mercancía utilizando los datos del formulario actual
   * y emite un evento con la información de la mercancía seleccionada.
   * Luego, navega de regreso a la ubicación anterior.
   *
   * @returns {void} Este método no devuelve ningún valor.
   */
  // eslint-disable-next-line complexity
  agregarMercancia(): void {

    this.actualizarValidadoresClave()
   
    if (this.mercanciaForm.invalid) {
      this.mercanciaForm.markAllAsTouched();
      this.mensajeDeError = 'Faltan campos por capturar.';
      return;
    }
     this.mensajeDeError = '';  
     const VALORTABLAMERCANCIA: TablaMercanciasDatos = this.mercanciaForm.getRawValue();

     /**
     * @description
     * Genera un identificador aleatorio compuesto únicamente por números.
     * El resultado siempre será un número entero de 6 dígitos (entre 100000 y 999999).
     * @returns {number} Un número aleatorio de 6 dígitos.
     */
     const ID = Math.floor(100000 + Math.random() * 900000);
     VALORTABLAMERCANCIA.id = this.mercanciaForm.get('id')?.value ? this.mercanciaForm.get('id')?.value : ID
    
    VALORTABLAMERCANCIA.paisOrigen = this.mercanciaForm.get('paisDeOriginDatos')?.value;
    VALORTABLAMERCANCIA.paisOrigenDatosClave = this.crosslistPaisDeOriginDatos.filter((pais) => this.seleccionadasPaisDeOriginDatos.includes(pais.descripcion)).map((paise) => paise.clave).filter((clave): clave is string => typeof clave === 'string');
    VALORTABLAMERCANCIA.paisProcedencia = this.mercanciaForm.get('paisDeProcedenciaDatos')?.value;
    VALORTABLAMERCANCIA.paisProcedenciaDatosClave = this.crosslistPaisDeProcedenciaDatos.filter((pais) => this.seleccionadasPaisDeProcedenciaDatos.includes(pais.descripcion)).map((paise) => paise.clave).filter((clave): clave is string => typeof clave === 'string');
    VALORTABLAMERCANCIA.usoEspecifico = this.mercanciaForm.get('usoEspecifico')?.value;
    VALORTABLAMERCANCIA.usoEspecificoDatosClave = this.crosslistUsoEspecificoDatos.filter((uso) => this.seleccionadasUsoEspesificoDatos.includes(uso.descripcion)).map((uso) => uso.clave).filter((clave): clave is string => typeof clave === 'string');
    VALORTABLAMERCANCIA.unidadMedidaComercializacion = this.mercanciaForm.get('cantidadUmc')?.value;
    VALORTABLAMERCANCIA.cantidadUmcValor = this.mercanciaForm.get('cantidadUmcValor')?.value;
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

  if (this.detalleMercancia && this.detalleMercanciaData) {
    VALORTABLAMERCANCIA.formaFarmaceutica = this.detalleMercanciaData.formaFormaceutica;
    VALORTABLAMERCANCIA.numeroRegistroSanitario = this.detalleMercanciaData.numeroDeRegistro;
    VALORTABLAMERCANCIA.denominacionDistintiva = this.detalleMercanciaData.marcasDistintivas;
    VALORTABLAMERCANCIA.presentacion = this.detalleMercanciaData.tipoDeEnvase;
  }
    this.mercanciaSeleccionado.emit(VALORTABLAMERCANCIA);
    
    this.mercanciaForm.reset();
    
    this.cerrarModal.emit();
}

actualizarValidadoresClave(): void {
   if (
      this.elementosAnadidos.includes('claveDeLos') &&
      this.idProcedimiento === 260101 &&
      this.claveConfig.datos.length > 0
    ) {
      CAMPOS_CLAVE.forEach(
        (controlName) =>
          this.mercanciaForm.get(controlName)?.clearValidators() ||
          this.mercanciaForm.get(controlName)?.updateValueAndValidity()
      );
    } else if (
      this.elementosAnadidos.includes('claveDeLos') &&
      this.idProcedimiento === 260101 &&
      this.claveConfig.datos.length === 0
    ) {
      CAMPOS_CLAVE.forEach((controlName) => {
        this.mercanciaForm.get(controlName)?.setValidators(Validators.required);
        this.mercanciaForm.get(controlName)?.updateValueAndValidity();
      });
    }
}
  /**
   * Genera un arreglo de objetos de catálogo que coinciden con el identificador proporcionado.
   *
   * @param {Catalogo[]} catalogo - Arreglo de objetos de catálogo.
   * @param {string} id - Identificador para filtrar los objetos del catálogo.
   * @returns {Catalogo[] | undefined} - Arreglo de objetos de catálogo que coinciden con el identificador, o undefined si no hay coincidencias.
   */
  static generarCatalogoObjeto(catalogo: Catalogo[], id: string): Catalogo[] | undefined {
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
   * @method agregarMercancia
   * @description Emits an event to add a new merchandise item.
   * This method is used to notify the parent component about the addition of a new merchandise item.
   *
   * @param {DetalleMercancia} datos - The details of the merchandise to be added.
   * @returns {void} This method does not return any value.
   */

  onAgregarDetalleMercancia(detalle: DetalleMercancia): void {
    console.log('Received detalle from DetalleMercanciaComponent:', detalle);
    this.detalleMercanciaData = detalle;
  }

  /**
   * @method eliminarMercancia
   * @description Emits an event to delete one or more merchandise items.
   * This method is used to notify the parent component about the deletion of selected merchandise items.
   *
   * @param {DetalleMercancia[]} datos - An array of merchandise details to be deleted.
   * @returns {void} This method does not return any value.
   */
  eliminarMercancia(datos: DetalleMercancia[]): void {
    this.eliminarMercanciaDatos.emit(datos);
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
    const FRACCION_ARANCELARIA = this.mercanciaForm.get(
      'fraccionArancelaria'
    )?.value;
    if (FRACCION_ARANCELARIA?.length < 8) {
      this.showLimitError = true;
    } else {
      this.showLimitError = false;
    }
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
   * this.fechaDeCaducidadValor('01/01/2026');
   */
  fechaDeCaducidadValor(valor: string): void {
    this.mercanciaForm.patchValue({
      fechaCaducidad: valor,
    });
  }

  /**
   * Maneja el cambio de tipo de producto.
   * Actualiza el objeto `tipoProductoObj` en el componente con el catálogo correspondiente
   * al tipo de producto seleccionado en el formulario.
   *
   * @param clave - Objeto de catálogo seleccionado para el tipo de producto.
   */
  onCambioTipoProduct(clave: Catalogo): void {
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

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

export function matrizRequerida(
  control: AbstractControl
): ValidationErrors | null {
  const VALUE = control.value;
  return Array.isArray(VALUE) && VALUE.length === 0 ? { required: true } : null;
}
