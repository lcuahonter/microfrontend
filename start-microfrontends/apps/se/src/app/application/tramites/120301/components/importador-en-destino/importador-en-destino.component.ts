/**
 * @component ImportadorEnDestinoComponent
 * @description Este componente es responsable de manejar el formulario del importador en destino.
 * Incluye un formulario para capturar los datos del importador y funcionalidades adicionales.
 * Gestiona la validación, sincronización con el store global y el estado de la sección.
 */
import {
  Catalogo,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
} from '@ng-mf/data-access-user';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  ElegibilidadDeTextilesStore,
  TextilesState,
} from '../../estados/elegibilidad-de-textiles.store';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { REGEX_CAPTURA_CBP, REGEX_CAPTURA_IRS, REGEX_CAPTURA_USDA } from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';
import { Subject, delay, map, takeUntil, tap } from 'rxjs';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { DetalleEvaluaconSolicitudService } from '../../services/detalleEvaluaconSolicitud.service';
import { ERROR_FORMA_ALERT } from '../../constantes/elegibilidad-de-textiles.enums';
import { ElegibilidadDeTextilesQuery } from '../../queries/elegibilidad-de-textiles.query';
import { ImportadorDestinoResponse } from '../../models/response/importador-destino-response.model'
import { ImporteRecordService } from '../../services/catalogos/importe-record.service';
import { Tramite120301Store } from '../../estados/tramites/tramite120301.store';

/**
 * @component ImportadorEnDestinoComponent
 * @description 
 * Componente responsable de manejar el formulario del importador en destino en el trámite de elegibilidad de textiles.
 * Permite capturar, validar y gestionar la información del importador mediante formularios reactivos.
 * Gestiona el estado de validez del formulario y la sincronización con el store global de la aplicación.
 * Incluye validaciones específicas para campos numéricos y manejo de catálogos desplegables.
 *
 * @example
 * <app-importador-en-destino [formularioDeshabilitado]="true"></app-importador-en-destino>
 *
 * @property {boolean} formularioDeshabilitado - Indica si el formulario debe estar deshabilitado
 * @property {FormGroup} importadorForm - Formulario reactivo principal para datos del importador
 * @property {FormGroup} importadorEnDestino - Formulario auxiliar para datos específicos
 * @property {Catalogo[]} tipoData - Datos del catálogo de tipos de importador
 * @property {Subject<void>} destroyNotifier$ - Subject para manejo de suscripciones
 * @property {TextilesState} importadorState - Estado actual del importador
 * @property {SeccionLibState} seccionState - Estado actual de la sección
 *
 * @method ngOnInit Inicializa el componente y configura suscripciones
 * @method ngOnDestroy Limpia suscripciones al destruir el componente
 * @method initActionFormBuild Inicializa el formulario reactivo
 * @method obtenerListasDesplegables Obtiene catálogos para controles de selección
 * @method obtenerIngresoSelectList Obtiene lista de tipos de importador
 * @method setValoresStore Sincroniza valores del formulario con el store
 *
 * @see ElegibilidadDeTextilesStore
 * @see ElegibilidadDeTextilesQuery
 * @see SeccionLibStore
 * @see SeccionLibQuery
 * @see ElegibilidadTextilesService
 */
@Component({
  selector: 'app-importador-en-destino',
  templateUrl: './importador-en-destino.component.html',
  styleUrl: './importador-en-destino.component.scss',
})
export class ImportadorEnDestinoComponent implements OnInit, OnDestroy {
  /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario debe estar deshabilitado.
   * Propiedad de entrada que controla el estado de habilitación de todos los controles del formulario.
   * Cuando es true, todos los campos del formulario se deshabilitan para crear una vista de solo lectura.
   * Se utiliza en escenarios donde la información debe mostrarse pero no editarse.
   * @input
   * @default false
   */
  @Input()
  formularioDeshabilitado: boolean = false;

  /**
   * @property {string} numFolio - Número de folio del trámite.
   * Propiedad de entrada que recibe el número de folio asociado al trámite actual.
   * Se utiliza para cargar y mostrar la información específica del importador en destino
   */
  @Input()
  numeroFolio: string = '';

  /**
    * @property {ImportadorDestinoResponse} obtenerInformacionImportador - Información del importador en destino.
   */
  obtenerInformacionImportador!: ImportadorDestinoResponse;

  /**
   * @property {FormGroup} importadorForm - El grupo de formularios para capturar los datos del importador.
   * Formulario reactivo principal que contiene todos los controles necesarios para la captura
   * de información del importador en destino. Incluye validaciones para campos requeridos,
   * patrones numéricos y sincronización con el estado global. Maneja datos como tipo de importador,
   * cantidad total, razón social, domicilio, ciudad, código postal y país.
   */
  importadorForm!: FormGroup;

  /**
   * @property {string} formularioAlertaError
   * @description
   * Mensaje HTML que se muestra cuando el formulario no es válido y faltan campos requeridos por capturar.
   * Se utiliza para mostrar una alerta visual al usuario en la interfaz.
   * Vacío cuando el formulario es válido.
   */
  public formularioAlertaError: string = '';

  /**
   * @property {boolean} esFormaValido
   * @description
   * Bandera booleana que indica si el formulario tiene errores de validación.
   * Si es `true`, se muestra el mensaje de error; si es `false`, el formulario es válido y no se muestra la alerta.
   */
  public esFormaValido: boolean = false;

  /**
   * @property {EventEmitter<boolean>} mostrarTabs - Emite un valor booleano para mostrar las pestañas adicionales.
   * EventEmitter que comunica al componente padre cuándo debe mostrar las pestañas de navegación.
   * Se activa cuando el usuario completa exitosamente el proceso de guardado o validación.
   * Permite la coordinación entre componentes para la navegación de la interfaz.
   */
  @Output() mostrarTabs: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @property {FormGroup} importadorEnDestino - El grupo de formularios para los datos del certificado de registro.
   * Formulario auxiliar que maneja información complementaria específica del importador en destino.
   * Se utiliza para datos adicionales que pueden requerirse según el contexto del trámite.
   * Proporciona flexibilidad para capturar información especializada del proceso.
   */
  importadorEnDestino!: FormGroup;

  /**
   * @property {Catalogo[]} tipoData - Datos para el select de tipo de importador.
   * Array que contiene las opciones disponibles para el control de selección de tipo de importador.
   * Se carga dinámicamente desde el servicio al inicializar el componente mediante una petición
   * al archivo 'tipo.json'. Cada elemento del catálogo contiene la información necesaria
   * para poblar el dropdown de tipos de importador disponibles en el sistema.
   */
  tipoData!: Catalogo[];

  /**
   * @property {Subject<void>} destroyNotifier$ - Sujeto para manejar la destrucción de suscripciones.
   * Subject privado utilizado con el operador takeUntil para cancelar automáticamente
   * todas las suscripciones activas cuando el componente es destruido.
   * Implementa el patrón estándar de Angular para prevenir fugas de memoria
   * asegurando que todas las suscripciones sean correctamente finalizadas.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();
  validarFormulario: boolean = false;

  /**
   * @property {TextilesState} importadorState - Estado actual del importador.
   * Almacena el estado completo relacionado con la información del importador en el contexto
   * de elegibilidad de textiles. Se actualiza mediante suscripciones al query correspondiente
   * y contiene toda la información necesaria para inicializar y mantener el formulario.
   * Incluye datos como tipo, cantidades, información de contacto y ubicación.
   * @private
   */
  public importadorState!: TextilesState;

  /**
   * @property {SeccionLibState} seccionState - Estado actual de la sección.
   * Mantiene el estado específico de la sección dentro del módulo de librerías.
   * Controla aspectos como la validez de la sección, su estado de activación
   * y la coordinación con otras secciones del trámite. Se utiliza para
   * gestionar el flujo de navegación y validación entre diferentes partes del proceso.
   * @private
   */
  private seccionState!: SeccionLibState;

  /**
   * @property {boolean} visualizarTipoIOR - Bandera para visualizar el campo de tipo IOR.
   */
  visualizarTipoIOR: boolean = true;

  /**
   * @constructor
   * @description Constructor del componente. Inicializa los servicios necesarios para el funcionamiento del componente.
   * Inyecta todas las dependencias requeridas para el manejo de formularios reactivos,
   * peticiones HTTP, gestión de estado global y local, consultas de datos y servicios específicos del dominio.
   * Establece la base para la comunicación entre el componente y los servicios del sistema
   * relacionados con la gestión del importador en destino en el contexto de elegibilidad de textiles.
   * @param {ElegibilidadTextilesService} ElegibilidadTextilesService - Servicio de dominio para manejar la lógica de negocio de elegibilidad de textiles
   * @param {FormBuilder} fb - Servicio de Angular para la creación y gestión de formularios reactivos
   * @param {HttpClient} httpServicios - Cliente HTTP de Angular para realizar peticiones HTTP al servidor
   * @param {ElegibilidadDeTextilesStore} ElegibilidadDeTextilesStore - Store para manejar el estado global de elegibilidad de textiles
   * @param {ElegibilidadDeTextilesQuery} ElegibilidadDeTextilesQuery - Query para consultar y suscribirse al estado de elegibilidad de textiles
   * @param {SeccionLibStore} seccionStore - Store para manejar el estado específico de las secciones del módulo
   * @param {SeccionLibQuery} seccionQuery - Query para consultar y suscribirse al estado de las secciones
   * @param {ChangeDetectorRef} cdr - Referencia al ChangeDetectorRef para manejar cambios en la vista
   */
  constructor(
    private readonly fb: FormBuilder,
    private ElegibilidadDeTextilesStore: ElegibilidadDeTextilesStore,
    private ElegibilidadDeTextilesQuery: ElegibilidadDeTextilesQuery,
    private seccionStore: SeccionLibStore,
    private seccionQuery: SeccionLibQuery,
    private importeRecordService: ImporteRecordService,
    private cdr: ChangeDetectorRef,
    private evaluacionSolicitud: DetalleEvaluaconSolicitudService,
    private tramite120301: Tramite120301Store,
  ) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * @method ngOnInit
   * @description Método que se ejecuta al inicializar el componente.
   * Configura todas las suscripciones necesarias para el manejo del estado del componente,
   * inicializa el formulario reactivo, carga los catálogos de datos desplegables,
   * establece la validación del formulario y configura el monitoreo de cambios.
   * También maneja el estado de habilitación del formulario basado en las propiedades de entrada
   * y sincroniza el estado de validez con el store global de la aplicación.
   * Implementa la lógica de validación automática que actualiza el estado cuando el formulario es válido.
   * @returns {void} No retorna ningún valor
   * @implements {OnInit}
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
          this.importadorState = state as TextilesState;
        })
      )
      .subscribe();

    this.initActionFormBuild();
    this.obtenerListasDesplegables();

    this.seccionStore.establecerFormaValida([false]);

    this.importadorForm.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(10),
        tap((_value) => {
          if (this.importadorForm.valid) {
            this.ElegibilidadDeTextilesStore.setFormaValida([
              ...this.importadorState.formaValida,
              { id: 4, descripcion: 'TodoValido' },
            ]);
          }
          this.seccionStore.establecerSeccion([true]);
          this.seccionStore.establecerFormaValida([true]);
          this.validarFormulario = this.importadorForm.valid;
          this.tramite120301.setValidarFormularioImportadorDestino(this.validarFormulario);
        })
      )
      .subscribe();

    this.importadorForm.get('tipo')?.valueChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((valorSeleccionado: string) => {
        const CANTIDADCTRL = this.importadorForm.get('cantidadTotalImportador');
        if (!CANTIDADCTRL) {
          return;
        }

        switch (valorSeleccionado) {
          case 'IOR.IRS':
            CANTIDADCTRL.setValidators([
              Validators.required,
              Validators.pattern(REGEX_CAPTURA_IRS),
            ]);
            break;
          case 'IOR.CBP':
            CANTIDADCTRL.setValidators([
              Validators.required,
              Validators.pattern(REGEX_CAPTURA_CBP),
            ]);
            break;
          case 'IOR.SSS':
            CANTIDADCTRL.setValidators([
              Validators.required,
              Validators.pattern(REGEX_CAPTURA_USDA),
            ]);
            break;
          default:
            // Si no coincide, dejamos solo requerido
            CANTIDADCTRL.setValidators([Validators.required]);
            break;
        }

        CANTIDADCTRL.updateValueAndValidity();
      });
    if (this.formularioDeshabilitado) {
      this.importadorForm.disable();
      this.visualizarTipoIOR = false;
    }
    if (this.numeroFolio && this.numeroFolio !== '') {
      this.llenarInformacionFormulario(this.numeroFolio);
    }
  }

  /**
   * Llena el formulario con la información del importador.
   * @param data ImportadorDestinoResponse
   */
  llenarInformacionFormulario(idFolio: string): void {
    if (!idFolio) {
      return;
    }
    this.evaluacionSolicitud.getDatosImportadorDestino(idFolio)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.obtenerInformacionImportador = response.datos ?? {} as ImportadorDestinoResponse;
            this.importadorForm.patchValue({
              tipoIOR: this.obtenerInformacionImportador.tipo_ior ?? '',
              cantidadTotalImportador: this.obtenerInformacionImportador.valor ?? '',
              razonSocialImportador: this.obtenerInformacionImportador.razon_social ?? '',
              domicilio: this.obtenerInformacionImportador.domicilio ?? '',
              ciudadImportador: this.obtenerInformacionImportador.ciudad ?? '',
              cpImportador: this.obtenerInformacionImportador.cp ?? '',
              PaisImportador: this.obtenerInformacionImportador.pais ?? 'ESTADOS UNIDOS DE AMERICA'
            });
          }
          else {
            console.error('Error en la respuesta del servicio:', response.mensaje);
          }
        },
        error: (error) => {
          console.error('Error al obtener los datos:', error);
        }
      });
  }
  /**
   * @method initActionFormBuild
   * @description Inicializa el formulario reactivo para capturar los datos del importador.
   * Crea todos los controles del formulario con sus valores iniciales obtenidos del estado actual,
   * aplicando las validaciones necesarias para cada campo. Configura campos para tipo de importador,
   * cantidad total con validación numérica, razón social, domicilio, ciudad, código postal
   * con validación de solo números, y país (deshabilitado por defecto).
   * Utiliza constantes de expresiones regulares para validaciones específicas.
   * @returns {void} No retorna ningún valor
   */
  initActionFormBuild(): void {
    this.importadorForm = this.fb.group({
      tipoIOR: [{ value: "", disabled: true }],
      tipo: [this.importadorState.tipo, Validators.required],
      cantidadTotalImportador: [
        this.importadorState.cantidadTotalImportador,
        Validators.required, // Se ajustará dinámicamente
      ],
      razonSocialImportador: [
        this.importadorState.razonSocialImportador,
        [
          Validators.required,
          Validators.maxLength(70)
        ],
      ],
      domicilio: [
        this.importadorState.domicilio,
        [
          Validators.required,
          Validators.maxLength(70)
        ],
      ],
      ciudadImportador: [
        this.importadorState.ciudadImportador,
        [
          Validators.required,
          Validators.maxLength(35)
        ],
      ],
      cpImportador: [
        this.importadorState.cpImportador,
        [
          Validators.required,
          Validators.maxLength(9),
          Validators.pattern(/^[0-9]{5,9}$/)
        ],
      ],
      PaisImportador: [
        { value: this.importadorState.PaisImportador || 'ESTADOS UNIDOS DE AMERICA', disabled: true },
        Validators.required,
      ],
    });
  }

  /**
   * @method obtenerListasDesplegables
   * @description Obtiene las listas desplegables necesarias para el formulario.
   * Método coordinador que ejecuta la carga de todos los catálogos y listas
   * requeridas para poblar los campos de selección del formulario.
   * Actualmente coordina la obtención de la lista de tipos de importador.
   * Facilita la extensión futura para incluir otros catálogos si es necesario.
   * @returns {void} No retorna ningún valor
   */
  obtenerListasDesplegables(): void {
    this.obtenerIngresoSelectList();
  }

  /**
   * @method obtenerIngresoSelectList
   * @description Obtiene la lista para el select de tipo de importador.
   * Realiza una petición HTTP al servicio para cargar las opciones disponibles
   * del catálogo de tipos de importador desde el archivo 'tipo.json'.
   * Los datos obtenidos se asignan a la propiedad tipoData para poblar
   * el control de selección correspondiente. La suscripción se maneja con takeUntil
   * para evitar fugas de memoria cuando el componente es destruido.
   * @returns {void} No retorna ningún valor
   */
  obtenerIngresoSelectList(): void {
    this.importeRecordService.getImporteRecord()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (data) => {
          if (data.codigo === '00') {
            this.tipoData = data.datos || [];
          }
        },
        error: (error) => {
          console.error('Error al obtener los datos:', error);
          this.tipoData = [];
        }
      });
  }

  /**
   * @method setValoresStore
   * @description Establece los valores en el store de textiles.
   * Método utilitario que extrae el valor de un campo específico del formulario
   * y lo almacena en el store global utilizando el método especificado.
   * Facilita la sincronización entre el estado del formulario del importador en destino
   * y el estado global de la aplicación, asegurando consistencia de datos
   * entre diferentes componentes del sistema. Utiliza casting de tipos para
   * garantizar la compatibilidad con los métodos del store.
   * @param {FormGroup} form - El formulario reactivo del cual extraer el valor
   * @param {string} campo - El nombre del campo del formulario a extraer
   * @param {keyof ElegibilidadDeTextilesStore} metodoNombre - El nombre del método del store a invocar para guardar el valor
   * @returns {void} No retorna ningún valor
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
   * Método para continuar al siguiente paso, validando el campo cantidadFacturas.
   * Si el formulario es inválido, muestra el mensaje de error y no permite continuar.
   * Si es válido, limpia el error y permite continuar.
   */
  continuar(): void {
    this.importadorForm.markAllAsTouched();
    this.importadorForm.updateValueAndValidity();
    this.cdr.detectChanges();

    if (!this.importadorForm.valid) {
      this.formularioAlertaError = ERROR_FORMA_ALERT;
      this.esFormaValido = true;
      window.scrollTo(0, 0);
      return;
    }
    this.esFormaValido = false;
    this.formularioAlertaError = '';
    window.scrollTo(0, 0);

    this.mostrarTabs.emit(true);
  }
  /**
  * Guarda los datos editados del chofer nacional si el formulario es válido, emite el evento y cierra el modal.
  * Si el formulario es inválido, muestra una notificación de alerta.
  * @returns {void}
  */
  enviada = false;
  guardarFilaEditada(): void {
    this.enviada = true;
  }

  /**
   * @method activarAlertasValidacion
   * @description Activa las alertas de validación del formulario cuando hay campos requeridos sin completar.
   * Este método marca todos los campos como touched, actualiza la validez del formulario y muestra
   * el mensaje de error si el formulario es inválido. Se utiliza principalmente cuando se necesita
   * mostrar las alertas de validación desde componentes padre.
   * @returns {void} No retorna ningún valor
   * @public
   */
  public activarAlertasValidacion(): void {
    this.importadorForm.markAllAsTouched();
    this.importadorForm.updateValueAndValidity();
    this.cdr.detectChanges();

    if (!this.importadorForm.valid) {
      this.formularioAlertaError = ERROR_FORMA_ALERT;
      this.esFormaValido = true;
    } else {
      this.esFormaValido = false;
      this.formularioAlertaError = '';
    }
  }

  /**
   * @method ngOnDestroy
   * @description Método que se ejecuta cuando el componente es destruido.
   * Implementa la limpieza necesaria para evitar fugas de memoria cancelando
   * todas las suscripciones activas mediante el subject destroyNotifier$.
   * Es una implementación estándar del patrón de limpieza en Angular que asegura
   * que todas las suscripciones del componente sean correctamente finalizadas
   * cuando el componente se destruye, liberando recursos del sistema.
   * Llama tanto a next() como a complete() para finalizar apropiadamente el Subject.
   * @returns {void} No retorna ningún valor
   * @implements {OnDestroy}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
