import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CROSLISTA_DE_PAISES,
  DATOS_MERCANCIA_CAMPO,
  DATOS_MERCANCIA_CLAVE_TABLA,
  DESCRIPCION_FRACCION_DESHABILITADO_VALOR,
  TIPO_PRODUCTO_ESPECIAL,
  UMT_DESHABILITADO_VALOR,
} from '../../../../shared/constantes/datos-solicitud.enum';
import {
  Catalogo,
  CrossListLable,
  MercanciaForm,
  TablaMercanciaClaveConfig,
  TablaMercanciasDatos,
} from '../../../../shared/models/datos-solicitud.model';
import {
  CatalogoSelectComponent,
  CrosslistComponent,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  REGEX_NUMERO_12_ENTEROS_5_DECIMALES,
  REGEX_SOLO_NUMEROS,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule, Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { DetalleMercancia } from '../../../../shared/models/detalle-mercancia.model';
import { DetalleMercanciaComponent } from '../../../../shared/components/detalle-mercancia/detalle-mercancia.component';
import { Observable } from 'rxjs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { MercanciasInfo } from '@libs/shared/data-access-user/src/core/models/260211/domicilo.model';

@Component({
  selector: 'app-datos-mercancia-contenedora',
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
    NotificacionesComponent
  ],
  templateUrl: './datos-mercancia-contenedora.component.html',
  styleUrl: './datos-mercancia-contenedora.component.scss',
  providers: [DatosSolicitudService],
})
export class DatosMercanciaContenedoraComponent implements OnInit {
 public isEditBlocked: boolean = false;
  /**
   * Evento emitido cuando se hace clic en el botón Agregar en el modal de Mercancías
   */
  @Output() agregarMercancia = new EventEmitter<MercanciasInfo>();
    /**
     * Evento emitido cuando se hace clic en el botón Cancelar en el modal de Mercancías
     */
    @Output() cancelarMercanciaModal = new EventEmitter<void>();
   
  onAgregarMercancia(): void {
    if (this.mercanciaForm.valid) {
      // Helper to get description from catalog by ID
      const GET_CATALOG_DESC = (catalog: Catalogo[], id: number | string | null): string => {
        if (id === null || id === undefined) { return ''; }
        const FOUND = catalog.find(item => item.id === Number(id));
        if (FOUND) { return String(FOUND.descripcion); }
        return typeof id === 'string' ? id : String(id);
      };
      const MERCANCIA: MercanciasInfo = {
        clasificacion: GET_CATALOG_DESC(this.clasificacionProductoDatos, this.mercanciaForm.get('clasificacionProducto')?.value),
        especificar: GET_CATALOG_DESC(this.especificarClasificacionProductoDatos, this.mercanciaForm.get('especificarClasificacionProducto')?.value),
        denominacionEspecifica: this.mercanciaForm.get('denominacionEspecificaProducto')?.value,
        denominacionDistintiva: this.mercanciaForm.get('denominacionDistintiva')?.value,
        denominacionComun: this.mercanciaForm.get('denominacionComun')?.value,
        formaFarmaceutica: GET_CATALOG_DESC(this.formaFarmaceuticaDatos, this.mercanciaForm.get('formaFarmaceutica')?.value),
        estadoFisico: GET_CATALOG_DESC(this.estadoFisicoDatos, this.mercanciaForm.get('estadoFisico')?.value),
        fraccionArancelaria: this.mercanciaForm.get('fraccionArancelaria')?.value,
        descripcionFraccion: this.mercanciaForm.get('descripcionFraccion')?.value,
        unidad: this.mercanciaForm.get('cantidadUmcValor')?.value,
        cantidadUMC: this.mercanciaForm.get('cantidadUmc')?.value,
        unidadUMT: this.mercanciaForm.get('cantidadUmtValor')?.value,
        cantidadUMT: this.mercanciaForm.get('cantidadUmt')?.value,
        presentacion: this.mercanciaForm.get('presentacion')?.value,
        numeroRegistro: this.mercanciaForm.get('numeroRegistroSanitario')?.value,
        paisDeOrigen: this.mercanciaForm.get('paisDeOriginDatos')?.value?.[0],
        paisDeProcedencia: this.mercanciaForm.get('paisDeProcedenciaDatos')?.value?.[0],
        tipoProducto: GET_CATALOG_DESC(this.tipoProductoDatos, this.mercanciaForm.get('tipoProducto')?.value),
        usoEspecifico: this.mercanciaForm.get('usoEspecifico')?.value?.[0],
        fechaCaducidad: this.mercanciaForm.get('fechaCaducidad')?.value,
      };
      this.agregarMercancia.emit(MERCANCIA);
    } else {
      this.mercanciaForm.markAllAsTouched();
      // Debug: log invalid controls and errors
      const INVALID_CONTROLS = Object.keys(this.mercanciaForm.controls).filter(key => this.mercanciaForm.get(key)?.invalid);
      INVALID_CONTROLS.forEach(key => {
        const CONTROL = this.mercanciaForm.get(key);
        console.warn('Control inválido:', key, CONTROL?.errors);
      });
      console.warn('Formulario de mercancía no válido, revise los campos marcados.');
    }
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
  private _mercanciaFormState!: MercanciaForm;
  @Input()
  set mercanciaFormState(value: MercanciaForm) {
    this._mercanciaFormState = value;
    if (value) {
      // Re-create the form with the new state
      this.crearMercanciaForm();
    }
  }
  get mercanciaFormState(): MercanciaForm {
    return this._mercanciaFormState;
  }

  /**
   * @property {TablaMercanciasDatos} datoSeleccionado
   * Dato seleccionado de la tabla de mercancías recibido como entrada desde el componente padre.
   */
  @Input() public datoSeleccionado!: TablaMercanciasDatos;

  /**
   * @event mercanciaSeleccionado
   * Evento emitido cuando el usuario selecciona o guarda una mercancía.
   */
  @Output() mercanciaSeleccionado: EventEmitter<TablaMercanciasDatos> =
    new EventEmitter<TablaMercanciasDatos>();


  /**
   * Referencias a los componentes de listas cruzadas.
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
   * @event eliminarMercanciaDatos
   * @description EventEmitter que emite un arreglo de elementos de mercancía a eliminar.
   * Se utiliza para notificar al componente padre sobre la eliminación de los elementos de mercancía seleccionados.
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
   * @description Catálogo de clasificaciones de producto utilizado para llenar el formulario.
   */
  public clasificacionProductoDatos!: Catalogo[];

  /**
   * @property {Catalogo[]} especificarClasificacionProductoDatos
   * @description Catálogo de clasificaciones específicas de producto utilizado para llenar el formulario.
   */
  public especificarClasificacionProductoDatos!: Catalogo[];

  /**
   * @property {Catalogo[]} tipoProductoDatos
   * @description Catálogo de tipos de producto utilizado para llenar el formulario.
   */
  public tipoProductoDatos!: Catalogo[];

  /**
   * @property {Catalogo[]} formaFarmaceuticaDatos
   * @description Catálogo de formas farmacéuticas utilizado para llenar el formulario.
   */
  public formaFarmaceuticaDatos!: Catalogo[];

  /**
   * @property {Catalogo[]} estadoFisicoDatos
   * @description Catálogo de estados físicos utilizado para llenar el formulario.
   */
  public estadoFisicoDatos!: Catalogo[];

  /**
   * @property {Catalogo[]} cantidadUmcDatos
   * @description Catálogo de cantidades de unidad comercial utilizado para llenar el formulario.
   */
  public cantidadUmcDatos!: Catalogo[];

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
   * Botones de acción para gestionar listas de países de origen.
   */
  paisDeOriginBotons = [
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
   * Botones de acción para gestionar listas de países de procedencia.
   */
  paisDeProcedenciaBotons = [
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
   * Botones de acción para gestionar listas de uso específico.
   */
  usoEspecificoBotons = [
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
  public paisDeProcedenciaDatos = CROSLISTA_DE_PAISES;

  /**
   * @property {Catalogo[]} usoEspesificoDatos
   * Datos de usos específicos para lista cruzada.
   */
  public usoEspesificoDatos = CROSLISTA_DE_PAISES;

  /**
   * @property {Catalogo[]} seleccionarOrigenDelPais
   * Datos de países para lista cruzada de país de origen.
   */
  public seleccionarOrigenDelPais = CROSLISTA_DE_PAISES;

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
    private ubicaccion: Location
  ) {
    this.datosSolicitudService.obtenerRespuestaPorUrl(
      this,
      'clasificacionProductoDatos',
      '/cofepris/mercanciaClasificacionProducto.json'
    );
    this.datosSolicitudService.obtenerRespuestaPorUrl(
      this,
      'especificarClasificacionProductoDatos',
      '/cofepris/especificarClasificacionProducto.json'
    );
    this.datosSolicitudService.obtenerRespuestaPorUrl(
      this,
      'tipoProductoDatos',
      '/cofepris/tipoProductoDatos.json'
    );
    this.datosSolicitudService.obtenerRespuestaPorUrl(
      this,
      'formaFarmaceuticaDatos',
      '/cofepris/formaFarmaceutica.json'
    );
    this.datosSolicitudService.obtenerRespuestaPorUrl(
      this,
      'estadoFisicoDatos',
      '/cofepris/estadoFisicoDatos.json'
    );
    this.datosSolicitudService.obtenerRespuestaPorUrl(
      this,
      'cantidadUmcDatos',
      '/cofepris/cantidadUmcDatos.json'
    );

    this.datosMercanciaCampo = DATOS_MERCANCIA_CAMPO.includes(
      this.idProcedimiento
    )
      ? true
      : false;
  }

  /**
   * @method ngOnInit
   * @description Hook de ciclo de vida que se ejecuta al inicializar el componente.
   * Llama al método `crearMercanciaForm` para construir el formulario.
   */
  ngOnInit(): void {
    this.validarElementos();
    this.crearMercanciaForm();
    this.crossListRequirdos();
  }

  setEditBlocked(blocked: boolean): void {
    this.isEditBlocked = blocked;
    if (this.mercanciaForm) {
      if (blocked) {
        this.mercanciaForm.disable();
      } else {
        this.mercanciaForm.enable();
      }
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
      case 260208:
      case 260209:
        this.elementosNoValidos = ['numeroRegistroSanitario', 'fechaCaducidad'];
        this.elementosAnadidos = ['especifique'];
        this.elementosDeshabilitados = ['descripcionFraccion', 'cantidadUmt'];
        break;
      case 260207:
        this.elementosAnadidos = ['especifique'];
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
        break;
      case 260213:
        this.elementosNoValidos = [
          'formaFarmaceutica',
          'numeroRegistroSanitario',
          'fechaCaducidad',
        ];
        break;
      case 260214:
        this.elementosNoValidos = [
          'formaFarmaceutica',
          'numeroRegistroSanitario',
          'fechaCaducidad',
        ];
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
     * Cierra el modal de mercancía emitiendo el evento cancelarMercanciaModal.
     */

    cerrarMercanciaModal(): void {
      this.cancelarMercanciaModal.emit();
    }
    /**
     * Reinicia el formulario de mercancía.
     */
  public resetForm(): void {
    if (this.mercanciaForm) {
      this.mercanciaForm.reset();
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
      this.claveConfig.datos.push({
        clave: CLAVE,
        fabricacion: FABRICACION,
        caducidad: CADUCIDAD,
      });
      this.mercanciaForm.patchValue({
        claveDeLos: '',
        fechaDeFabricacio: '',
        fechaDeCaducidad: '',
      });
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
    if (!this.areCatalogsLoaded()) {
      return;
    }
  const { MAPPED_UMT_ID, FINAL_MAPPED_UMC_ID } = this.getUmtUmcIds();
  this.mercanciaForm = this.buildMercanciaForm(MAPPED_UMT_ID, FINAL_MAPPED_UMC_ID);
    this.removeInvalidControls();
    this.addExtraControls();
  }

  private areCatalogsLoaded(): boolean {
    const CATALOGS_LOADED = [
      this.clasificacionProductoDatos,
      this.especificarClasificacionProductoDatos,
      this.tipoProductoDatos,
      this.formaFarmaceuticaDatos,
      this.estadoFisicoDatos,
      this.cantidadUmcDatos
    ].every(arr => Array.isArray(arr) && arr.length);
    if (!CATALOGS_LOADED) {
      return false;
    }
    if (!this.clasificacionProductoDatos?.length ||
        !this.especificarClasificacionProductoDatos?.length ||
        !this.tipoProductoDatos?.length ||
        !this.formaFarmaceuticaDatos?.length ||
        !this.estadoFisicoDatos?.length ||
        !this.cantidadUmcDatos?.length) {
      console.warn('Catalogs not loaded yet, skipping form creation');
      return false;
    }
    return true;
  }

  private getUmtUmcIds(): { MAPPED_UMT_ID: number | null, FINAL_MAPPED_UMC_ID: number | null } {
    const INCOMING_UMT_VALOR = String(this.obtenerValor('cantidadUmtValor'));
    let MAPPED_UMT_ID = DatosMercanciaContenedoraComponent.matchCatalogId(this.cantidadUmcDatos, INCOMING_UMT_VALOR);
    let FINAL_MAPPED_UMC_ID = MAPPED_UMT_ID;
    if (MAPPED_UMT_ID === null && this.cantidadUmcDatos.length > 0) {
      MAPPED_UMT_ID = this.cantidadUmcDatos[0].id;
    }
    if (FINAL_MAPPED_UMC_ID === null && this.cantidadUmcDatos.length > 0) {
      FINAL_MAPPED_UMC_ID = this.cantidadUmcDatos[0].id;
    }
    return { MAPPED_UMT_ID, FINAL_MAPPED_UMC_ID };
  }

  private buildMercanciaForm(MAPPED_UMT_ID: number | null, FINAL_MAPPED_UMC_ID: number | null): FormGroup {
    return this.fb.group({
      presentacion: [
        this.obtenerValor('presentacion'),
        Validators.required,
      ],
      numeroRegistroSanitario: [
        this.obtenerValor('numeroRegistroSanitario'),
        Validators.required,
      ],
      clasificacionProducto: [
        DatosMercanciaContenedoraComponent.matchCatalogId(this.clasificacionProductoDatos, String(this.obtenerValor('clasificacionProducto'))) ?? null,
        Validators.required,
      ],
      especificarClasificacionProducto: [
        DatosMercanciaContenedoraComponent.matchCatalogId(this.especificarClasificacionProductoDatos, String(this.obtenerValor('especificarClasificacionProducto'))) ?? null,
        Validators.required,
      ],
      denominacionEspecificaProducto: [
        this.obtenerValor('denominacionEspecificaProducto') ?? null,
        Validators.required,
      ],
      denominacionDistintiva: [
        this.obtenerValor('denominacionDistintiva') ?? null,
        Validators.required,
      ],
      denominacionComun: [
        this.obtenerValor('denominacionComun') ?? null,
        Validators.required,
      ],
      tipoProducto: [
        DatosMercanciaContenedoraComponent.matchCatalogId(this.tipoProductoDatos, String(this.obtenerValor('tipoProducto'))) ?? null,
        Validators.required
      ],
      formaFarmaceutica: [
        DatosMercanciaContenedoraComponent.matchCatalogId(this.formaFarmaceuticaDatos, String(this.obtenerValor('formaFarmaceutica'))) ?? null,
        Validators.required,
      ],
      estadoFisico: [
        DatosMercanciaContenedoraComponent.matchCatalogId(this.estadoFisicoDatos, String(this.obtenerValor('estadoFisico'))) ?? null,
        Validators.required,
      ],
      fraccionArancelaria: [
        this.obtenerValor('fraccionArancelaria') ?? null,
        Validators.required,
      ],
      descripcionFraccion: [
        {
          value: this.obtenerValor('descripcionFraccion'),
          disabled: this.elementosDeshabilitados.includes(
            'descripcionFraccion'
          ),
        },
        Validators.required,
      ],
      cantidadUmtValor: [
        this.obtenerValor('cantidadUmtValor') ?? null,
        [
          Validators.required,
          Validators.pattern(REGEX_NUMERO_12_ENTEROS_5_DECIMALES),
        ],
      ],
      cantidadUmcValor: [
        this.obtenerValor('cantidadUmcValor') ?? null,
        [
          Validators.required,
          Validators.pattern(REGEX_NUMERO_12_ENTEROS_5_DECIMALES),
        ],
      ],
      cantidadUmt: [
        MAPPED_UMT_ID ?? null,
        Validators.required,
      ],
      cantidadUmc: [
        FINAL_MAPPED_UMC_ID ?? null,
        Validators.required,
      ],
      fechaCaducidad: [this.obtenerValor('fechaCaducidad') ?? null],
      paisDeOriginDatos: [
        this.obtenerValor('paisDeOriginDatos') || []
      ],
      paisDeProcedenciaDatos: [
        this.obtenerValor('paisDeProcedenciaDatos') || []
      ],
      usoEspecifico: [
        this.obtenerValor('usoEspecifico') || []
      ],
    });
  }

  private removeInvalidControls(): void {
    const ALWAYS_KEEP = [
      'clasificacionProducto',
      'especificarClasificacionProducto',
      'tipoProducto',
      'formaFarmaceutica',
      'estadoFisico'
    ];
    const CONTROLS_A_ELIMINAR = [...this.elementosNoValidos].filter(ctrl => !ALWAYS_KEEP.includes(ctrl));
    if (this.detalleMercancia) {
      ['formaFarmaceutica', 'denominacionDistintiva'].forEach(ctrl => {
        if (!ALWAYS_KEEP.includes(ctrl)) {
          CONTROLS_A_ELIMINAR.push(ctrl);
        }
      });
    }
    if (CONTROLS_A_ELIMINAR.length) {
      for (const NOMBRE_DEL_CONTROL of CONTROLS_A_ELIMINAR) {
        if (this.mercanciaForm.contains(NOMBRE_DEL_CONTROL)) {
          this.mercanciaForm.removeControl(NOMBRE_DEL_CONTROL, {
            emitEvent: false,
          });
        }
      }
    }
  }

  private addExtraControls(): void {
    if (this.elementosAnadidos.length) {
      for (const NOMBRE_DEL_CONTROL of this.elementosAnadidos) {
        if (!this.mercanciaForm.contains(NOMBRE_DEL_CONTROL)) {
          this.mercanciaForm.addControl(
            NOMBRE_DEL_CONTROL,
            new FormControl(
              this.obtenerValor(NOMBRE_DEL_CONTROL as keyof MercanciaForm),
              { validators: [Validators.required] }
            )
          );
        }
      }
    }
  }

  public static matchCatalogId(catalog: Catalogo[], value: string): number | null {
    if (!catalog || !value) { return null; }
    const NORMALIZED_VALUE = DatosMercanciaContenedoraComponent.normalize(value);
    const FOUND = catalog.find(item => DatosMercanciaContenedoraComponent.normalize(item.descripcion) === NORMALIZED_VALUE);
    return FOUND ? FOUND.id : null;
  }

  private static normalize(str: string): string {
    if (typeof str !== 'string') {
      return '';
    }
    return str
      .replace(/\//g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[.,#!$%&*;:{}=\-_`~()]/g, '')
      .toLowerCase()
      .trim();

  }

  /**
   * Obtiene el valor de un campo específico del formulario o de los datos seleccionados.
   * @param {keyof TablaMercanciasDatos | keyof MercanciaForm} field - Nombre del campo a obtener.
   * @returns {string | number | undefined | string[]} - Valor del campo especificado.
   */
  public obtenerValor(
    field: keyof TablaMercanciasDatos | keyof MercanciaForm
  ): string | number | undefined | string[] | Catalogo | undefined {
    if (this.mercanciaFormState && this.mercanciaFormState[field as keyof MercanciaForm] !== undefined) {
      return this.mercanciaFormState[field as keyof MercanciaForm];
    }
    if (this.datoSeleccionado && this.datoSeleccionado[field as keyof TablaMercanciasDatos] !== undefined) {
      return this.datoSeleccionado[field as keyof TablaMercanciasDatos];
    }
    return undefined;
  }

  /**
   * Valida si el campo de un formulario no contiene errores
   * @param {AbstractControl} control  : Control del formulario
   * @param {string} campo  : Nombre del campo a validar, si el control es un FormGroup
   * @returns {boolean | null} : Retorna true si el campo contiene errores y ha sido tocado, de lo contrario retorna false
   */
  // eslint-disable-next-line class-methods-use-this
  public isValid(control: AbstractControl, campo?: string): boolean | null {
    if (!control) {
      return null;
    }
    if (control instanceof FormGroup && campo) {
      const CHILD = control.controls[campo];
      if (!CHILD) {
        return null;
      }
      return CHILD.errors && CHILD.touched;
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
    this.mercanciaForm.patchValue({
      usoEspecifico: events,
    });
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

  /**
   * Restablece el formulario de mercancía a su estado inicial.
   * Este método se utiliza para limpiar todos los campos del formulario,
   * eliminando cualquier dato ingresado previamente.
   */
  limpiarMercancia(): void {
    this.seleccionadasUsoEspesificoDatos = [];
    this.usoEspesificoDatos = CROSLISTA_DE_PAISES;
    this.seleccionadasPaisDeOriginDatos = [];
    this.paisDeProcedenciaDatos = CROSLISTA_DE_PAISES;
    this.seleccionadasPaisDeProcedenciaDatos = [];
    this.seleccionarOrigenDelPais = CROSLISTA_DE_PAISES;
    this.mercanciaForm.reset();
  }

  cancelar(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'info',
      categoria: 'info',
      modo: 'action',
      titulo: '',
      mensaje: 'Cancelado',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Cambia la fracción arancelaria en el formulario de mercancía.
   *
   * Este método se utiliza para actualizar la fracción arancelaria y la cantidad de UMT
   * en el formulario de mercancía, deshabilitando los campos correspondientes si es necesario.
   */
  cambiarFraccionArancelaria(): void {
    if (
      this.mercanciaForm.get('fraccionArancelaria') &&
      this.mercanciaForm.get('cantidadUmt')?.disabled
    ) {
      this.mercanciaForm
        .get('descripcionFraccion')
        ?.setValue(DESCRIPCION_FRACCION_DESHABILITADO_VALOR);
      this.mercanciaForm.get('cantidadUmt')?.setValue(UMT_DESHABILITADO_VALOR);
      if (
        REGEX_SOLO_NUMEROS.test(
          this.mercanciaForm.get('fraccionArancelaria')?.value
        )
      ) {
        this.mercanciaForm
          .get('descripcionFraccion')
          ?.setValue(DESCRIPCION_FRACCION_DESHABILITADO_VALOR);
        this.mercanciaForm
          .get('cantidadUmt')
          ?.setValue(UMT_DESHABILITADO_VALOR);
      } else {
        this.abrirModal();
      }
    }
  }

  /**
   * Elimina un pedimento de la lista de pedimentos.
   *
   * @param borrar - Indica si se debe eliminar el pedimento.
   * @returns {void} Este método no devuelve ningún valor.
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /**
   * Abre un modal para mostrar un mensaje de alerta.
   *
   * @param i - El índice del elemento que se va a eliminar (opcional).
   * @returns {void} Este método no devuelve ningún valor.
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

}