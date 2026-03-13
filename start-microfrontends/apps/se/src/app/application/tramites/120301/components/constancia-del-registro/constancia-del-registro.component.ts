/**
 * @component ConstanciaDelRegistroComponent
 * @description Este componente es responsable de manejar el formulario del certificado de registro.
 * Incluye un formulario para capturar los datos del certificado de registro y funcionalidades adicionales.
 */
import {
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  ConsultaioQuery,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ERROR_FORMA_ALERT, ERROR_FORMA_ANO, REPRESENTACION_FEDERAL_NOTA } from '../../constantes/elegibilidad-de-textiles.enums';
import {
  ElegibilidadDeTextilesStore,
  TextilesState,
} from '../../estados/elegibilidad-de-textiles.store';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, catchError, forkJoin, map, of, takeUntil } from 'rxjs';
import { AnioConstanciaService } from '../../services/catalogos/anio-constancia.service';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { CommonModule } from '@angular/common';
import { ConstanciaTramiteConfiguracion } from '@libs/shared/data-access-user/src/core/models/shared/acuse-y-resoluciones-folio-tramite.model';
import { DetalleEvaluaconSolicitudService } from '../../services/detalleEvaluaconSolicitud.service';
import { ElegibilidadDeTextilesQuery } from '../../queries/elegibilidad-de-textiles.query';
import { ElegibilidadTextilesService } from '../../services/elegibilidad-textiles/elegibilidad-textiles.service';
import { GuardadoService } from '../../services/guardado.service';
import { InputRadioComponent } from "@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component";
import { ParcialRequest } from '../../models/request/parcialRequest.model';
import { TplDetalleRequest } from '../../models/request/tpl-detalle-request.model';
import { TplDetalleResponse } from '../../models/response/tpl-detalle-response.model';
import { TplRequest } from '../../models/request/tpl-request.model';
import { TplService } from '../../services/Tpl.service';
import { Tramite120301Store } from '../../estados/tramites/tramite120301.store';
import radioOptionsData from '@libs/shared/theme/assets/json/120301/mostrar.json';

/**
 * @component ConstanciaDelRegistroComponent
 * @description
 * Componente responsable de manejar el formulario del certificado de registro en el trámite de elegibilidad de textiles.
 * Permite capturar, mostrar y gestionar datos del certificado de registro mediante formularios y tablas dinámicas.
 * Gestiona el estado de validez del formulario y la sincronización con el store de la aplicación.
 *
 * @example
 * <app-constancia-del-registro [formularioDeshabilitado]="true"></app-constancia-del-registro>
 *
 * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.
 * @property {FormGroup} fitosanitarioForm - Formulario reactivo para capturar los datos del certificado de registro.
 * @property {string[]} selectRangoDias - Array de rangos de días seleccionables.
 * @property {boolean} colapsable - Controla el estado colapsable del panel.
 * @property {FormGroup} ConstanciaDelRegistro - Formulario para datos adicionales del certificado de registro.
 * @property {any} radioOptions - Opciones de radio cargadas desde un archivo JSON.
 * @property {string | number} selectedValue - Valor seleccionado en las opciones de radio.
 * @property {ConfiguracionColumna<ConstanciaTramiteConfiguracion>[]} configuracionTabla - Configuración de columnas de la tabla de datos.
 * @property {ConstanciaTramiteConfiguracion[]} configuracionTablaDatos - Datos de la tabla de constancias de trámite.
 * @property {Catalogo[]} paisesDatos - Datos del catálogo de países.
 * @property {boolean} guardarBandera - Bandera para indicar si se deben guardar los datos.
 * @property {EventEmitter<boolean>} mostrarTabs - Emite un valor booleano para mostrar las pestañas adicionales.
 *
 * @method ngOnInit Inicializa el componente y obtiene los datos necesarios.
 * @method initActionFormBuild Inicializa el formulario reactivo.
 * @method onValueChange Maneja el cambio de valor en las opciones de radio.
 * @method setValoresStore Establece valores en el store de textiles.
 * @method onFilaClic Maneja el evento de clic en una fila de la tabla.
 * @method buscarEvaluar Valida y busca datos asociados a la constancia.
 * @method guardarEvaluate Emite un evento para mostrar las pestañas y realiza scroll al inicio.
 * @method recuperarDatosAsociadas Recupera los datos asociados para la tabla de constancia del registro.
 * @method filtrarDatos Filtra los datos de la tabla según el año y número de constancia.
 *
 * @see ElegibilidadDeTextilesStore
 * @see ElegibilidadDeTextilesQuery
 * @see SeccionLibStore
 * @see SeccionLibQuery
 * @see ElegibilidadTextilesService
 */
@Component({
  selector: 'app-constancia-del-registro',
  templateUrl: './constancia-del-registro.component.html',
  styleUrl: './constancia-del-registro.component.scss',
  standalone: true,
  imports: [
    TituloComponent,
    ReactiveFormsModule,
    InputRadioComponent,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    CommonModule,
  ],
})
export class ConstanciaDelRegistroComponent implements OnInit, OnDestroy {
  /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.
   * Propiedad de entrada que controla si todos los controles del formulario deben estar deshabilitados.
   * Cuando es true, impide la edición de cualquier campo del formulario.
   */
  @Input()
  formularioDeshabilitado: boolean = false;

  /**
   * @property {TplDetalleResponse} descripcionCupo - Detalle del cupo fitosanitario.
   */
  descripcionCupo!: TplDetalleResponse;


  @Input()
  numeroFolio: string = '';
  /**
   * @property {boolean} enviada - Indica si el formulario ha sido enviado para mostrar errores.
   */
  enviada: boolean = false;

  /**
 * @property {EventEmitter<string>} mensajeError - Emite mensajes de error al componente padre.
 * EventEmitter que comunica al componente padre cuando ocurre un error en las operaciones.
 * Se activa cuando hay errores en el guardado o validación para mostrar mensajes específicos.
 */
  @Output() mensajeError: EventEmitter<string> = new EventEmitter<string>();


  /**
   * @property {FormGroup} fitosanitarioForm - El grupo de formularios para capturar los datos del certificado de registro.
   * Formulario reactivo principal que contiene todos los controles necesarios para la captura
   * de información relacionada con la constancia del registro fitosanitario.
   * Incluye validaciones y manejo de estado para cada campo del formulario.
   */
  fitosanitarioForm!: FormGroup;

  /**
   * @property {boolean} esFormaValido
   * @description
   * Bandera booleana que indica si el formulario tiene errores de validación.
   * Si es `true`, se muestra el mensaje de error; si es `false`, el formulario es válido y no se muestra la alerta.
   */
  public esFormaValido: boolean = false;

  /**
   * @property {boolean} anoFormValido
   * @description
   * Bandera booleana que indica si el año ingresado no es válido.
   * Si es `true`, se muestra el mensaje de error específico para el año; si es `false`, el año es válido.
   */
  public anoFormValido: boolean = false;

  /**
   * @property {string} formularioAlertaAno
   * @description
   * Mensaje HTML que se muestra cuando el año ingresado no es válido.
   * Contiene el mensaje de error específico para validación de año.
   */
  public formularioAlertaAno: string = ERROR_FORMA_ANO;

  /**
   * @property {string[]} selectRangoDias - Array de rangos de días seleccionables.
   * Contiene las opciones disponibles para seleccionar rangos de días en los controles de fecha.
   * Se utiliza para limitar las opciones de selección temporal en el formulario.
   */
  selectRangoDias: string[] = [];

  /**
   * @property {boolean} colapsable - Booleano para controlar el estado colapsable del panel.
   * Determina si las secciones de la interfaz pueden expandirse o contraerse.
   * Utilizado para mejorar la experiencia de usuario al organizar la información en paneles.
   */
  colapsable: boolean = false;

  /**
   * @property {FormGroup} ConstanciaDelRegistro - El grupo de formularios para los datos del certificado de registro.
   * Formulario secundario que maneja información adicional específica de la constancia del registro.
   * Complementa al formulario principal con campos especializados.
   */
  ConstanciaDelRegistro!: FormGroup;

  /**
   * @property {any} radioOptions - Opciones de radio cargadas desde un archivo JSON.
   * Contiene las configuraciones y opciones disponibles para los controles de radio button.
   * Se inicializa con datos estáticos importados desde un archivo JSON externo.
   */
  radioOptions = radioOptionsData;

  /**
   * @property {string | number} selectedValue - Valor seleccionado en las opciones de radio.
   * Almacena el valor actualmente seleccionado en los controles de radio button.
   * Puede ser de tipo string o number dependiendo del tipo de opción seleccionada.
   */
  selectedValue: string | number = '';

  /**
   * @property {Subject<void>} destroyNotifier$ - Sujeto para manejar la destrucción de suscripciones.
   * Subject privado utilizado con el operador takeUntil para cancelar automáticamente
   * todas las suscripciones activas cuando el componente es destruido.
   * Implementa el patrón estándar para prevenir fugas de memoria en Angular.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {TextilesState} constanciaState - Estado actual de los textiles.
   * Almacena el estado completo relacionado con la elegibilidad de textiles.
   * Se actualiza mediante suscripciones al query correspondiente y contiene
   * toda la información necesaria para el funcionamiento del componente.
   * @private
   */
  private constanciaState!: TextilesState;

  /**
   * @property {SeccionLibState} seccionState - Estado actual de la sección.
   * Mantiene el estado específico de la sección dentro del módulo de librerías.
   * Controla aspectos como la validez de la sección y su estado de activación.
   * @private
   */
  private seccionState!: SeccionLibState;

  /**
   * @property {ConstanciaTramiteConfiguracion[]} configuracionTablaDatos - Datos de la tabla de constancias de trámite.
   * Arreglo que almacena toda la información de las constancias de trámite que se muestran en la tabla.
   * Se actualiza dinámicamente mediante consultas al servicio y filtrado de datos.
   * Cada elemento contiene información completa sobre una constancia específica.
   */
  public configuracionTablaDatos: ConstanciaTramiteConfiguracion[] = [];

  /**
   * @property {Catalogo[]} paisesDatos - Datos del catálogo de países.
   * Arreglo que contiene la información completa del catálogo de países disponibles.
   * Se utiliza para poblar controles de selección y validar datos de país de destino/origen.
   * Se carga desde el servicio al inicializar el componente.
   */
  public paisesDatos: Catalogo[] = [];

  /**
   * @property {boolean} guardarBandera - Bandera para indicar si se deben guardar los datos.
   * Controla el estado de guardado y determina si los datos han sido procesados correctamente.
   * Se utiliza para habilitar/deshabilitar controles del formulario y mostrar opciones adicionales.
   * Su valor se sincroniza con el estado global del store.
   */
  public guardarBandera: boolean = false;

  /**
   * @property {Catalogo[]} anios - Lista de años obtenidos del catálogo.
   * Almacena los años disponibles para la constancia de registro, obtenidos desde el servicio.
   * Se utiliza para permitir al usuario seleccionar un año específico en el formulario.
   */
  anios!: Catalogo[];

  /**
  * @property {number | undefined} idAsignacion - Identificador único de la asignación.
  * Almacena el ID de la asignación actual registro de solicitud parcial.
  * Es undefined cuando se crea una nueva solicitud parcial.
  * Se utiliza para el guardado parcial de la solicitud.
  */
  public idAsignacion!: number | undefined;

  /**
   * @property {string} cveUnidadAdministrativa - Clave de la unidad administrativa.
   * Contiene el identificador único de la unidad administrativa asociada al catalogo de francion arancelaria.
   * Su valor se obtiene del catalogo de francion arancelaria.
   */
  public cveUnidadAdministrativa!: string;

  /**
   * @property {EventEmitter<boolean>} mostrarTabs - Emite un valor booleano para mostrar las pestañas adicionales.
   * EventEmitter que comunica al componente padre cuándo debe mostrar las pestañas de navegación.
   * Se activa cuando el usuario completa exitosamente el proceso de guardado o validación.
   * Permite la coordinación entre componentes para la navegación de la interfaz.
   */
  @Output() mostrarTabs: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @property {string} representacionFederalNota
   * Nota informativa sobre la representación federal.
   */
  public representacionFederalNota = REPRESENTACION_FEDERAL_NOTA;

  visualizarEvaluacion: boolean = true;

  /**
   * @property {EventEmitter<boolean>} errorValidacion - Emite un valor booleano para indicar errores de validación.
   * EventEmitter que comunica al componente padre cuándo hay errores de validación en el formulario.
   * Se activa cuando la validación del año falla en el método buscarEvaluar.
   */
  @Output() errorValidacion: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @constructor
   * @description Constructor del componente. Inicializa los servicios necesarios para el funcionamiento del componente.
   * Inyecta todas las dependencias requeridas para el manejo de formularios reactivos,
   * gestión de estado global y local, consultas de datos y servicios específicos del dominio.
   * Establece la base para la comunicación entre el componente y los servicios del sistema.
   * @param {FormBuilder} fb - Servicio de Angular para la creación y gestión de formularios reactivos.
   * @param {ElegibilidadDeTextilesStore} ElegibilidadDeTextilesStore - Store para manejar el estado global de elegibilidad de textiles.
   * @param {ElegibilidadDeTextilesQuery} ElegibilidadDeTextilesQuery - Query para consultar y suscribirse al estado de elegibilidad de textiles.
   * @param {SeccionLibStore} seccionStore - Store para manejar el estado específico de las secciones del módulo.
   * @param {SeccionLibQuery} seccionQuery - Query para consultar y suscribirse al estado de las secciones.
   * @param {ElegibilidadTextilesService} ElegibilidadTextilesService - Servicio de dominio para manejar la lógica de negocio de elegibilidad de textiles.
   * @param {ConsultaioQuery} consultaioQuery - Query para consultar el estado de solo lectura del trámite.
   * @param {ChangeDetectorRef} cdr - Referencia al ChangeDetectorRef para manejar la detección de cambios.
   */
  constructor(
    private fb: FormBuilder,
    private ElegibilidadDeTextilesStore: ElegibilidadDeTextilesStore,
    private ElegibilidadDeTextilesQuery: ElegibilidadDeTextilesQuery,
    private seccionStore: SeccionLibStore,
    private seccionQuery: SeccionLibQuery,
    private ElegibilidadTextilesService: ElegibilidadTextilesService,
    private consultaioQuery: ConsultaioQuery,
    private anioConstanciaService: AnioConstanciaService,
    private tplService: TplService,
    private guardadoService: GuardadoService,
    private tramite120301: Tramite120301Store,
    private cdr: ChangeDetectorRef,
    private evaluacionSolicitud: DetalleEvaluaconSolicitudService,
  ) {
    // Lógica del constructor si es necesario
  }

  /**
   * @property {ConfiguracionColumna<ConstanciaTramiteConfiguracion>[]} configuracionTabla - Configuración de las columnas de la tabla.
   * Define la estructura, comportamiento y apariencia de cada columna en la tabla de datos.
   * Cada elemento especifica el encabezado, la función de acceso a los datos (clave),
   * y el orden de visualización. Se utiliza por el componente TablaDinamicaComponent
   * para renderizar correctamente la información de las constancias de trámite.
   */
  configuracionTabla: ConfiguracionColumna<ConstanciaTramiteConfiguracion>[] = [
    {
      encabezado: 'Número de constancia de registro',
      clave: (artículo) => artículo.numeroDeConstancia,
      orden: 1,
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (artículo) => artículo.fraccionArancelaria,
      orden: 2,
    },
    {
      encabezado: 'Clasificación del régimen',
      clave: (artículo) => artículo.clasificacionDelRegimen,
      orden: 3,
    },
    {
      encabezado: 'País destino/origen',
      clave: (artículo) => artículo.paisDestino,
      orden: 4,
    },
    {
      encabezado: 'Descripción de la categoría textil',
      clave: (artículo) => artículo.categoriaTextil,
      orden: 5,
    },
    {
      encabezado: 'Fecha inicio vigencia',
      clave: (artículo) => artículo.fechaInicioVigencia,
      orden: 6,
    },
    {
      encabezado: 'Fecha fin vigencia',
      clave: (artículo) => artículo.fechaFinVigencia,
      orden: 7,
    },
  ];

  /**
   * @method ngOnInit
   * @description Método que se ejecuta al inicializar el componente.
   * Configura todas las suscripciones necesarias para el manejo del estado,
   * inicializa el formulario reactivo, carga los datos del catálogo de países,
   * establece la validación inicial del formulario y maneja el estado de habilitación
   * basado en las propiedades de entrada. También configura la lógica de validación
   * condicional según el estado previo del componente.
   * @returns {void} No retorna ningún valor.
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
        })
      )
      .subscribe();
    this.ElegibilidadDeTextilesQuery.selectTextile$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.constanciaState = state as TextilesState;
        })
      )
      .subscribe();
    this.initActionFormBuild();
    this.fitosanitarioForm.get('anoDeLaConstancia')?.valueChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((value) => {
        if (value && value !== '') {
          this.anoFormValido = false;
          this.errorValidacion.emit(false);
        }
      });
    // Suscríbase a los cambios del botón de opción para borrar errores de validación al cambiar a "Todos"
    this.fitosanitarioForm.get('flexRadioRegistro')?.valueChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((value) => {
        if (value === 'Todos') {
          // Borrar error de validación de año al cambiar al modo "Todos"
          this.anoFormValido = false;
          this.errorValidacion.emit(false);
        }
      });
    // Obtenga el estado actual de solo lectura inmediatamente
    // Se eliminó el filtrado por cambio de entrada; ahora solo filtra al hacer clic en el botón Buscar
    const CURRENT_STATE = this.consultaioQuery.getValue();
    this.formularioDeshabilitado = CURRENT_STATE.readonly;
    if (this.numeroFolio && this.numeroFolio !== '') {
      this.llenarFormularioConDatos(this.numeroFolio);
      this.guardarBandera = true;
      this.visualizarEvaluacion = false;
    }
    // Aplicar el estado del formulario inicial según el valor de solo lectura actual
    if (this.formularioDeshabilitado) {
      this.fitosanitarioForm.disable();
    } else {
      this.fitosanitarioForm.disable();
      this.fitosanitarioForm.get('flexRadioRegistro')?.enable();
      this.fitosanitarioForm.get('numeroDeLaConstancia')?.enable();
      this.fitosanitarioForm.get('anoDeLaConstancia')?.enable();
    }
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((consultaState) => {
          // Lógica normal: solo lectura verdadero = deshabilitar campos, solo lectura falso = habilitar campos
          this.formularioDeshabilitado = consultaState.readonly;
          if (this.fitosanitarioForm) {
            if (consultaState.readonly) {
              this.fitosanitarioForm.disable();
            } else {
              this.fitosanitarioForm.disable();
              this.fitosanitarioForm.get('flexRadioRegistro')?.enable();
              this.fitosanitarioForm.get('numeroDeLaConstancia')?.enable();
              this.fitosanitarioForm.get('anoDeLaConstancia')?.enable();
            }
          }
        })
      )
      .subscribe();

    this.catAnios();
    this.seccionStore.establecerFormaValida([false]);
    this.seccionStore.establecerSeccion([true]);
    this.seccionStore.establecerFormaValida([true]);
  }

  /**
   * @param datos - Datos del tipo TplDetalleResponse para llenar el formulario.
   * @description Llena el formulario con los datos proporcionados.
   */
  llenarFormularioConDatos(idFolio: string): void {
    this.evaluacionSolicitud.getDetallesCupo(idFolio)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.descripcionCupo = response.datos ?? {} as TplDetalleResponse;
            this.fitosanitarioForm.patchValue({
              fraccionArancelaria: this.descripcionCupo.fraccion_arancelaria,
              descripcionProducto: this.descripcionCupo.descripcion_producto,
              tratado: this.descripcionCupo.tratado_bloque,
              subproducto: this.descripcionCupo.clasificacion_subproducto,
              mecanismo: this.descripcionCupo.mecanismo_asignacion,
              typoCategoria: this.descripcionCupo.categoria_textil,
              typoRegimen: this.descripcionCupo.regimen,
              descripcionCategoriaTextil: this.descripcionCupo.descripcion_categoria_textil,
              PaisDestino: this.descripcionCupo.pais_origen_destino,
              unidadMedidaCategoriaTextil: this.descripcionCupo.unidad_medida,
              factorConversionCategoriaTextil: this.descripcionCupo.factor_conversion,
              fechaInicioVigencia: this.descripcionCupo.fecha_inicio_vigencia,
              fechaFinVigencia: this.descripcionCupo.fecha_fin_vigencia
            });
          } else {
            console.error('Error en la respuesta del servicio:', response.mensaje);
          }
        },
        error: (error) => {
          console.error('Error al obtener los datos:', error);
        }
      });
  }

  /**
   * @method catAnios
   * @description Obtiene el catálogo de años desde el servicio AnioConstanciaService.
   */
  catAnios(): void {
    this.anioConstanciaService.getAnios().subscribe({
      next: (response) => {
        if (response.codigo === '00') {
          this.anios = response.datos || [];
        }
      },
      error: (error) => {
        console.error('Error al obtener los años:', error);
        this.anios = [];
      }
    });
  }

  /**
   * @method cargaDatosTabla
   * @description Carga los datos en la tabla de constancias del registro.
   * Realiza una petición al servicio TplService con los parámetros del formulario,
   * y actualiza la configuración de la tabla con los datos recibidos.
   * Maneja errores y casos donde no se obtienen datos válidos.
   * @returns {void} No retorna ningún valor.
   */
  cargaDatosTabla(): void {
    const PAYLOAD: TplRequest = {
      //////Cambiar RFC estatico por el del usuario logeado
      /////ToDo: Obtener RFC del usuario logeado
      rfc: 'AAL0409235E6',
      tipo_busqueda: this.fitosanitarioForm.get('flexRadioRegistro')?.value,
      num_folio_asignacion_tpl: this.fitosanitarioForm.get('numeroDeLaConstancia')?.value,
      anio: this.fitosanitarioForm.get('anoDeLaConstancia')?.value,
    };

    this.tplService.posTpl(PAYLOAD).subscribe({
      next: (response) => {
        if (response?.codigo === '00' && response?.datos) {
          const TPL = response.datos;
          this.configuracionTablaDatos = TPL.map(item => ({
            numeroDeConstancia: item.num_constancia,
            fraccionArancelaria: item.fraccion_arancelaria,
            clasificacionDelRegimen: item.clasificacion_regimen,
            paisDestino: item.pais,
            categoriaTextil: item.desc_categoria_textil,
            fechaInicioVigencia: item.fecha_inicio,
            fechaFinVigencia: item.fecha_fin,

            estado: '',
            representacionFederal: '',
            descripcionProducto: '',
            tratado: '',
            subproducto: '',
            mecanismo: '',
            typoCategoria: '',
            typoRegimen: '',
            descripcionCategoriaTextil: '',
            PaisDestino: '',
            unidadMedidaCategoriaTextil: '',
            factorConversionCategoriaTextil: '',

            idAsignacion: item.id_asignacion,
            idMecanismoAsignacion: item.id_mecanismo_asignacion,
            idCategoriaTextil: item.id_categoria_textil,
            cvePais: item.cve_pais,
            idFraccionHtsUsa: item.id_fraccion_hts_usa
          }));
        } else {
          // Mostrar mensaje de error
          this.configuracionTablaDatos = [];
          console.error('Error al obtener datos:', response?.mensaje);
        }
      },
      error: (err) => {
        this.configuracionTablaDatos = [];
        console.error('Error en la petición postTpl:', err);
      }
    });

  }

  /**
   * @method initActionFormBuild
   * @description Inicializa el formulario reactivo para capturar los datos del certificado de registro.
   * Crea todos los controles del formulario con sus valores iniciales obtenidos del estado actual,
   * aplicando las validaciones necesarias para cada campo. Configura campos para información
   * del certificado, datos del producto, fechas de vigencia y ubicación geográfica.
   * También maneja el estado de la tabla de datos y la bandera de guardado.
   * @returns {void} No retorna ningún valor.
   */
  initActionFormBuild(): void {
    this.fitosanitarioForm = this.fb.group({
      flexRadioRegistro: [
        this.constanciaState.flexRadioRegistro
          ? this.constanciaState.flexRadioRegistro
          : 'Todos',
      ],
      anoDeLaConstancia: [
        this.constanciaState.anoDeLaConstancia ? this.constanciaState.anoDeLaConstancia.toString() : '',
        Validators.required,
      ],
      numeroDeLaConstancia: [
        this.constanciaState.numeroDeLaConstancia ? this.constanciaState.numeroDeLaConstancia.toString() : '',
        Validators.required,
      ],
      estado: [this.constanciaState.estado],
      representacionFederal: [this.constanciaState.representacionFederal],
      fraccionArancelaria: [this.constanciaState.fraccionArancelaria],
      descripcionProducto: [this.constanciaState.descripcionProducto],
      tratado: [this.constanciaState.tratado],
      subproducto: [this.constanciaState.subproducto],
      mecanismo: [this.constanciaState.mecanismo],
      typoCategoria: [this.constanciaState.typoCategoria],
      typoRegimen: [this.constanciaState.typoRegimen],
      descripcionCategoriaTextil: [
        this.constanciaState.descripcionCategoriaTextil,
      ],
      PaisDestino: [this.constanciaState.PaisDestino],
      unidadMedidaCategoriaTextil: [
        this.constanciaState.unidadMedidaCategoriaTextil,
      ],
      factorConversionCategoriaTextil: [
        this.constanciaState.factorConversionCategoriaTextil,
      ],
      fechaInicioVigencia: [this.constanciaState.fechaInicioVigencia],
      fechaFinVigencia: [this.constanciaState.fechaFinVigencia],
    });
    this.configuracionTablaDatos =
      this.constanciaState.datosTablaConstanciaDelRegistro;
    this.guardarBandera = this.constanciaState.guardarBandera;
    if (
      this.configuracionTablaDatos.length > 0 &&
      this.constanciaState.guardarBandera
    ) {
      Object.keys(this.fitosanitarioForm.controls).forEach((key) => {
        if (
          key !== 'anoDeLaConstancia' &&
          key !== 'numeroDeLaConstancia' &&
          key !== 'flexRadioRegistro'
        ) {
          // Deshabilitar solo si no está en modo de solo lectura
          if (!this.formularioDeshabilitado) {
            this.fitosanitarioForm.get(key)?.disable();
          }
        }
      });
    }
  }

  /**
   * @method onValueChange
   * @description Maneja el cambio de valor en las opciones de radio.
   * Se ejecuta cuando el usuario selecciona una nueva opción en los controles de radio button.
   * Actualiza la propiedad selectedValue con el nuevo valor seleccionado,
   * lo que puede desencadenar cambios en la interfaz o validaciones adicionales.
   * @param {string | number} newValue - Nuevo valor seleccionado en las opciones de radio.
   * @returns {void} No retorna ningún valor.
   */
  onValueChange(newValue: number | string): void {
    this.selectedValue = newValue;
  }

  /**
   * @method setValoresStore
   * @description Establece los valores en el store de textiles.
   * Método utilitario que extrae el valor de un campo específico del formulario
   * y lo almacena en el store global utilizando el método especificado.
   * Facilita la sincronización entre el estado del formulario y el estado global de la aplicación.
   * @param {FormGroup} form - El formulario reactivo del cual extraer el valor.
   * @param {string} campo - El nombre del campo del formulario a extraer.
   * @param {keyof ElegibilidadDeTextilesStore} metodoNombre - El nombre del método del store a invocar para guardar el valor.
   * @returns {void} No retorna ningún valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof ElegibilidadDeTextilesStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.ElegibilidadDeTextilesStore[metodoNombre] as (value: string) => void)(
      VALOR
    );
  }

  /**
   * @method onFilaClic
   * @description Maneja el evento de clic en una fila de la tabla. 
   * Actualiza los valores del formulario con los datos de la fila seleccionada,
   * almacena los valores en el store global, deshabilita los campos del formulario
   * (excepto año y número de constancia) y activa la bandera de guardado.
   * Este método permite la selección y carga automática de datos desde la tabla.
   * @param {ConstanciaTramiteConfiguracion} fila - Datos de la fila seleccionada en la tabla que contiene la información completa de la constancia.
   * @returns {void} No retorna ningún valor.
   */
  onFilaClic(fila: ConstanciaTramiteConfiguracion): void {
    if (!fila) {
      return;
    }

    const ANO_DE_LA_CONSTANCIA =
      this.fitosanitarioForm.get('anoDeLaConstancia')?.value;
    const NUMERO_DE_LA_CONSTANCIA = this.fitosanitarioForm.get(
      'numeroDeLaConstancia'
    )?.value;

    const PAYLOAD: TplDetalleRequest = {
      id_mecanismo_asignacion: fila.idMecanismoAsignacion ?? 0,
      cve_fraccion: fila.fraccionArancelaria,
      codigo_pais: fila.cvePais ?? '',
      id_categoria_textil: fila.idCategoriaTextil ?? 0,
      id_fraccion_hts_usa: fila.idFraccionHtsUsa ?? 0
    };
    this.idAsignacion = fila.idAsignacion;
    this.tramite120301.setIdAsignacion(this.idAsignacion ?? 0);
    forkJoin({
      representacion: this.tplService.getRepresentacionFederal(fila.idAsignacion ?? 0).pipe(
        catchError(err => {
          console.error('Error en representacion:', err);
          return of(null);
        })
      ),
      detalle: this.tplService.postTplDetalle(PAYLOAD).pipe(
        catchError(err => {
          console.error('Error en detalle:', err);
          return of(null);
        })
      )
    }).subscribe(({ representacion, detalle }) => {
      if (representacion?.codigo === '00' && representacion?.datos) {
        const REPRESENTACIONFEDERAL = representacion.datos;
        fila.estado = REPRESENTACIONFEDERAL.nombre_entidad;
        fila.representacionFederal = REPRESENTACIONFEDERAL.nombre;
        this.cveUnidadAdministrativa = REPRESENTACIONFEDERAL.clave;
        this.tramite120301.setClaveEntidad(REPRESENTACIONFEDERAL.cve_entidad);
        this.tramite120301.setClave(REPRESENTACIONFEDERAL.clave);
      }

      if (detalle?.codigo === '00' && detalle?.datos) {
        const DATOS = detalle.datos;
        fila.descripcionProducto = DATOS.descripcion_producto;
        fila.tratado = DATOS.tratado_bloque;
        fila.subproducto = DATOS.clasificacion_subproducto;
        fila.mecanismo = DATOS.mecanismo_asignacion;
        fila.typoCategoria = DATOS.categoria_textil;
        fila.typoRegimen = DATOS.regimen;
        fila.descripcionCategoriaTextil = DATOS.descripcion_categoria_textil;
        fila.PaisDestino = DATOS.pais_origen_destino;
        fila.unidadMedidaCategoriaTextil = DATOS.unidad_medida;
        fila.factorConversionCategoriaTextil = DATOS.factor_conversion.toString();
        fila.fechaInicioVigencia = DATOS.fecha_inicio_vigencia;
        fila.fechaFinVigencia = DATOS.fecha_fin_vigencia;
        this.tramite120301.setIdentificadorRegimen(DATOS.identificador_regimen);
        this.tramite120301.setPaisOrigenDestino(DATOS.pais_origen_destino);
        this.tramite120301.setUnidadMedida(DATOS.unidad_medida);
        this.tramite120301.setIdMecanismo(DATOS.id_mecanismo_asignacion);
        this.tramite120301.setClavePais(DATOS.codigo_pais);
      }
      const FORM_VALUES = {
        anoDeLaConstancia: ANO_DE_LA_CONSTANCIA ? ANO_DE_LA_CONSTANCIA : '',
        numeroDeLaConstancia: NUMERO_DE_LA_CONSTANCIA
          ? NUMERO_DE_LA_CONSTANCIA
          : '',
        estado: fila.estado,
        representacionFederal: fila.representacionFederal,
        fraccionArancelaria: fila.fraccionArancelaria || '',
        descripcionProducto: fila.descripcionProducto || '',
        tratado: fila.tratado || '',
        subproducto: fila.subproducto || '',
        mecanismo: fila.mecanismo || '',
        typoCategoria: fila.typoCategoria || '',
        typoRegimen: fila.typoRegimen || '',
        descripcionCategoriaTextil: fila.descripcionCategoriaTextil || '',
        PaisDestino: fila.PaisDestino || '',
        unidadMedidaCategoriaTextil: fila.unidadMedidaCategoriaTextil || '',
        factorConversionCategoriaTextil: fila.factorConversionCategoriaTextil || '',
        fechaInicioVigencia: fila.fechaInicioVigencia || '',
        fechaFinVigencia: fila.fechaFinVigencia || '',
      };
      this.fitosanitarioForm.patchValue(FORM_VALUES);
      Object.keys(FORM_VALUES).forEach((key) => {
        if (this.fitosanitarioForm.get(key)) {
          if (key !== 'anoDeLaConstancia' && key !== 'numeroDeLaConstancia') {
            // Deshabilitar solo si no está en modo de solo lectura
            if (!this.formularioDeshabilitado) {
              this.fitosanitarioForm.get(key)?.disable();
            }
          }
        }
      });
      this.ElegibilidadDeTextilesStore.update((state) => ({
        ...state,
        ...FORM_VALUES,
      }));
      this.guardarBandera = true;
      this.ElegibilidadDeTextilesStore.setguardarBandera(true);
    })
  }

  /**
   * @method buscarEvaluar
   * @description Valida los campos 'anoDeLaConstancia' y 'numeroDeLaConstancia' del formulario fitosanitario.
   * Realiza validación de campos requeridos, marca los controles como tocados para mostrar errores,
   * y si la validación es exitosa, procede a recuperar los datos asociados de la constancia.
   * También actualiza el estado global del store con los valores validados del formulario.
   * Este método es el punto de entrada para la búsqueda y validación de constancias.
   * @returns {void} No retorna ningún valor.
   */
  buscarEvaluar(): void {
    // Restablecer indicadores de validación
    this.anoFormValido = false;

    const ANO_DE_LA_CONSTANCIA =
      this.fitosanitarioForm.get('anoDeLaConstancia')?.value;
    const NUMERO_DE_LA_CONSTANCIA = this.fitosanitarioForm.get(
      'numeroDeLaConstancia'
    )?.value;
    const FORM_VALUES = {
      anoDeLaConstancia: ANO_DE_LA_CONSTANCIA ? ANO_DE_LA_CONSTANCIA : '',
      numeroDeLaConstancia: NUMERO_DE_LA_CONSTANCIA
        ? NUMERO_DE_LA_CONSTANCIA
        : '',
    };
    this.ElegibilidadDeTextilesStore.update((state) => ({
      ...state,
      ...FORM_VALUES,
    }));
    this.enviada = true;
    const RADIO_VALUE = this.fitosanitarioForm.get('flexRadioRegistro')?.value;
    if (RADIO_VALUE === 'Especifico') {
      // Validar únicamente el campo "anoDeLaConstancia"
      const ANO_CONTROL = this.fitosanitarioForm.get('anoDeLaConstancia');
      ANO_CONTROL?.markAsTouched();

      // Verificar específicamente si el campo de año es inválido
      if (ANO_CONTROL?.invalid) {
        // Mostrar alerta de error de validación solo para el campo de año
        this.anoFormValido = true;
        this.errorValidacion.emit(true);
        window.scrollTo(0, 0);
        return;
      }

      // Si el año es válido, borre cualquier error de validación anterior.
      this.errorValidacion.emit(false);

      // Si el año es válido, continúe con la validación del número de certificado
      const NUMEROCONTROL = this.fitosanitarioForm.get('numeroDeLaConstancia');
      NUMEROCONTROL?.markAsTouched();

      // Para modo Específico, valide que también se proporcione el número de certificado
      if (NUMEROCONTROL?.invalid) {
        // No emitir ERROR_FORMA_ANO aquí, solo marcar el campo para mostrar su error específico
        // El error específico del campo se mostrará en el template
        window.scrollTo(0, 0);
        return;
      }
      this.cargaDatosTabla();
    } else {
      // Para la opción 'Todos', use la llamada API
      this.cargaDatosTabla();
    }
  }

  /**
   * @method guardarEvaluate
   * @description Emite un evento para mostrar las pestañas (tabs) en la interfaz de usuario y realiza un scroll al inicio de la página.
   * Se ejecuta cuando el usuario ha completado exitosamente el proceso de captura y validación de la constancia.
   * Notifica al componente padre que debe mostrar las pestañas adicionales de navegación
   * y mejora la experiencia de usuario llevando la vista al inicio de la página.
   * @returns {void} No retorna ningún valor.
   * @fires mostrarTabs Evento que indica al componente padre que debe mostrar las pestañas de navegación.
   */
  guardarEvaluate(): void {
    const PAYLOAD: ParcialRequest = {
      id_solicitud: null,
      id_asignacion: this.idAsignacion ?? null,
      boolean_generico: null,
      ide_generica_1: null,
      descripcion_generica_2: null,
      ide_generica_2: null,
      solicitante: {
        /////ToDo: Obtener RFC del usuario logeado
        rfc: 'AAL0409235E6',
        certificado_serial_number: ''
      },
      cve_unidad_administrativa: this.cveUnidadAdministrativa,
      id_expedicion: null
    };
    this.guardadoService.postGuardadoParcial(PAYLOAD).subscribe({
      next: (response) => {
        if (response?.codigo === '00' && response?.datos) {
          const DATOS = response.datos;
          this.tramite120301.setIdExpedicion(DATOS.id_expedicion);
          this.tramite120301.setIdSolicitud(DATOS.id_solicitud);
          this.mostrarTabs.emit(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        else if (response?.codigo === 'SAT120301-018') {
          const MENSAJE_ERROR = response.error || response.mensaje || 'Error desconocido';
          this.mensajeError.emit(MENSAJE_ERROR);
          this.esFormaValido = true;
          window.scrollTo(0, 0);
        }
        else {
          const MENSAJE_ERROR = response?.mensaje || 'Error al obtener datos';
          this.mensajeError.emit(MENSAJE_ERROR);
          console.error('Error al obtener datos:', response?.mensaje);
        }
      },
      error: (err) => {
        const MENSAJE_ERROR = err.message || 'Error de conexión';
        this.mensajeError.emit(MENSAJE_ERROR);
        console.error('Error en la guardado parcial:', err);
        this.esFormaValido = true;
        window.scrollTo(0, 0);
      }
    });
  }

  /**
   * @method recuperarDatosAsociadas
   * @description Recupera los datos asociados para la tabla de constancia del registro.
   * Utiliza el servicio ElegibilidadTextilesService para obtener los datos desde un archivo JSON,
   * aplica filtros basados en los criterios del formulario utilizando el método filtrarDatos,
   * y actualiza tanto la propiedad local configuracionTablaDatos como el estado global en el store.
   * La operación se realiza de forma reactiva con manejo de suscripciones para evitar fugas de memoria.
   * @returns {void} No retorna ningún valor.
   */
  recuperarDatosAsociadas(): void {
    this.ElegibilidadTextilesService.obtenerTablaDatos<ConstanciaTramiteConfiguracion>(
      'constancia-del-registro-tabla-asociados.json'
    )
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((response) =>
          this.filtrarDatos(response as ConstanciaTramiteConfiguracion[])
        )
      )
      .subscribe({
        next: (filteredData) => {
          this.configuracionTablaDatos = filteredData;
          this.ElegibilidadDeTextilesStore.setdatosTablaConstanciaDelRegistro(
            filteredData
          );
        },
      });
  }

  /**
   * @method filtrarDatos
   * @description Filtra los datos de la tabla según el año de la constancia y el número de la constancia.
   * Obtiene los criterios de filtrado directamente de los valores del formulario fitosanitario
   * y aplica filtros de coincidencia tanto por año (extraído de la fecha de inicio de vigencia)
   * como por número de constancia. Permite filtrado parcial si algún criterio está vacío.
   * @param {ConstanciaTramiteConfiguracion[]} datos - Array de datos de constancias a filtrar.
   * @returns {ConstanciaTramiteConfiguracion[]} Array de datos filtrados que coinciden con los criterios especificados.
   */
  filtrarDatos(
    datos: ConstanciaTramiteConfiguracion[]
  ): ConstanciaTramiteConfiguracion[] {
    const RADIO_VALUE = this.fitosanitarioForm.get('flexRadioRegistro')?.value;
    const NUMERO_CONSTANCIA = this.fitosanitarioForm.get('numeroDeLaConstancia')?.value || '';
    if (RADIO_VALUE === 'Especifico') {
      // Solo filtrar por numeroDeLaConstancia para Especifico
      return datos.filter((ITEM) =>
        NUMERO_CONSTANCIA
          ? ITEM.numeroDeConstancia.toString() === NUMERO_CONSTANCIA.toString()
          : true
      );
    }
    // Lógica original para Todos y otros casos.
    const ANO_DE_LA_CONSTANCIA = this.fitosanitarioForm.get('anoDeLaConstancia')?.value || '';
    return datos.filter((ITEM) => {
      const ANO_ITEM = new Date(ITEM.fechaInicioVigencia).getFullYear();
      const FILTRO_ANO = ANO_DE_LA_CONSTANCIA
        ? ANO_ITEM === parseInt(ANO_DE_LA_CONSTANCIA, 10)
        : true;
      const FILTRO_NUMERO = NUMERO_CONSTANCIA
        ? ITEM.numeroDeConstancia.toString() === NUMERO_CONSTANCIA.toString()
        : true;

      return FILTRO_ANO && FILTRO_NUMERO;
    });
  }


  /**
   * @method alCambioDeModeloDeAño
   * @description Maneja el evento de cambio del modelo del año.
   * @param {string | number} value - El valor seleccionado.
   * @returns {void} No retorna ningún valor.
   */
  onAnoConstanciaChange(selectedOption: Catalogo): void {
    const CONTROL = this.fitosanitarioForm.get('anoDeLaConstancia');
    if (CONTROL && selectedOption) {
      const VALUE = selectedOption.clave?.toString() || '';
      CONTROL.setValue(VALUE);
      CONTROL.markAsTouched();
      CONTROL.updateValueAndValidity();

      this.ElegibilidadDeTextilesStore.setAnoDeLaConstancia(VALUE);
    }
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente va a ser destruido.
   * Se encarga de limpiar las suscripciones activas para evitar fugas de memoria,
   * completando el Subject destroyNotifier$ que es utilizado por todas las suscripciones
   * del componente con el operador takeUntil.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @implements {OnDestroy}
   * @public
   * @memberof ConstanciaDelRegistroComponent
   * @since 1.0.0
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
