/**
 * @fileoverview Componente para el manejo del flujo de elegibilidad de textiles
 * @description Este archivo contiene el componente principal que gestiona el proceso
 * de elegibilidad de textiles a través de un wizard de múltiples pasos.
 * 
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * 
 * @requires @angular/core - Funcionalidades principales de Angular
 * @requires @angular/forms - Manejo de formularios reactivos
 * @requires @ng-mf/data-access-user - Acceso a datos de usuario y componentes compartidos
 * @requires ./models/elegibilidad-de-textiles.model - Modelos específicos del trámite
 * @requires ./constantes/elegibilidad-de-textiles.enums - Constantes y enumeraciones
 */

import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CategoriaMensaje, LoginQuery, Notificacion, SolicitanteQuery, SolicitanteState, Usuario, } from '@ng-mf/data-access-user';
import { DatosPasos, SeccionLibStore } from '@ng-mf/data-access-user';
import { ERROR_FORMA_ALERT, ERROR_FORMA_ANO, ERROR_FORMA_FACTURA_ASOCIADA, ERROR_FORMA_FALTAN, PASOS } from '../../constantes/elegibilidad-de-textiles.enums';
import { ElegibilidadDeTextilesStore, TextilesState } from '../../estados/elegibilidad-de-textiles.store';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { ElegibilidadDeTextilesQuery } from '../../queries/elegibilidad-de-textiles.query';
import { GuardadoService } from '../../services/guardado.service';
import { GuardarSolicitudCompletaRequest } from '../../models/request/guardar-solicitud-request.model';
import { IniciarRequest } from '../../models/request/iniciar-request.model';
import { IniciarService } from '../../services/iniciar.service';
import { ListaPasosWizard } from '../../models/elegibilidad-de-textiles.model';
import { Location } from '@angular/common';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Solicitud120301State } from '../../estados/tramites/tramite120301.store';
import { Tramite120301Query } from '../../estados/queries/tramite120301.query';
import { WizardComponent } from '@libs/shared/data-access-user/src';

import { USUARIO_INFO } from '../../../../shared/enum/datos-usuario-documentos';




/**
 * @interface AccionBoton
 * @description Interfaz que define la estructura de datos para manejar las acciones 
 * de navegación en el wizard. Especifica la acción a realizar y el paso de destino.
 * 
 * @example
 * ```typescript
 * const accion: AccionBoton = {
 *   accion: 'cont',
 *   valor: 2
 * };
 * ```
 * 
 * @property {string} accion - Tipo de acción a realizar en la navegación del wizard
 *   - 'cont': Continuar al siguiente paso
 *   - Cualquier otro valor: Retroceder al paso anterior
 * @property {number} valor - Índice numérico del paso al que se desea navegar (base 1)
 */
interface AccionBoton {
  /**
   * @property {string} accion
   * @description Tipo de acción de navegación a ejecutar
   * @example 'cont' | 'prev' | 'back'
   */
  accion: string;

  /**
   * @property {number} valor
   * @description Índice del paso de destino en el wizard (comenzando desde 1)
   * @minimum 1
   * @maximum 5
   */
  valor: number;
}

/**
 * @class ElegibilidadTextilesComponent
 * @description Componente principal que gestiona el flujo de elegibilidad de textiles
 * a través de un wizard de múltiples pasos. Este componente maneja la navegación
 * entre pasos, la validación de formularios y la presentación de información
 * relacionada con el trámite 120301 de elegibilidad de textiles.
 * 
 * @implements OnInit - Ciclo de vida de inicialización del componente
 * 
 * @example
 * ```typescript
 * // Uso del componente en una plantilla
 * <app-elegibilidad-textiles></app-elegibilidad-textiles>
 * ```
 * 
 * @since 1.0.0
 * @author Equipo de desarrollo VUCEM 3.0
 */
@Component({
  selector: 'app-elegibilidad-textiles',
  templateUrl: './elegibilidad-textiles.component.html',
})
export class ElegibilidadTextilesComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * @property {boolean} mostrarOtraPestana
   * @description
   * Controla la visibilidad de pestañas adicionales y la alerta de validación en el wizard.
   * Se utiliza para mostrar u ocultar secciones extra según la lógica del proceso, igual que en paso-uno.component.html.
   * @default false
   */
  mostrarOtraPestana: boolean = false;

  /**
   * @property {string} formularioAlertaError
   * @description
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   * Se utiliza para informar al usuario sobre campos requeridos o errores en el formulario.
   * @default ERROR_FORMA_ALERT
   */
  public formularioAlertaError = ERROR_FORMA_ALERT;


  datosUsuario: Usuario = USUARIO_INFO;

  /**
  * Indica si el botón para cargar archivos está habilitado.
  */
  activarBotonCargaArchivos: boolean = false;

  /**
  * Indica si la sección de carga de documentos está activa.
  * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
  */
  seccionCargarDocumentos: boolean = true;

  /**
    * Evento que se emite para cargar archivos.
    * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
    */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Contiene el mensaje de error que se muestra cuando el año ingresado no es válido.
   */
  public formularioAlertaAno = ERROR_FORMA_ANO;

  /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   */
  esFormaValido: boolean = false;

  /**
   * Controla la visibilidad del mensaje de error cuando el año ingresado no es válido.
   */
  anoFormValido: boolean = false;

  /** Carga de progreso del archivo */
  cargaEnProgreso: boolean = true;

  /**
   * @property {FormGroup} formGroup
   * @description Grupo de formularios reactivos de Angular que maneja todos los datos 
   * ingresados por el usuario durante el proceso de elegibilidad de textiles.
   * Contiene los controles de formulario para la validación y manejo de datos.
   * 
   * @type {FormGroup}
   * @memberof ElegibilidadTextilesComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Acceder a un control específico
   * const campo1Value = this.formGroup.get('campo1')?.value;
   * 
   * // Validar el formulario
   * if (this.formGroup.valid) {
   *   // Procesar datos
   * }
   * ```
   */
  formGroup: FormGroup;

  /**
    * @property {TextilesState} historicoState - Estado actual del historial de fabricantes.
    * Almacena el estado completo relacionado con el historial de fabricantes en el contexto de elegibilidad de textiles.
    * Se actualiza mediante suscripciones al query correspondiente y contiene
    * toda la información necesaria para el funcionamiento del componente de histórico de fabricantes.
    * @private
    */
  private historicoState!: TextilesState;

  /**
    * Recuperado de datos del state
    */
  public solicitudState!: Solicitud120301State;

  /**
   * @property {Array<ListaPasosWizard>} pasos
   * @description Array que contiene la configuración de todos los pasos del wizard
   * de elegibilidad de textiles. Cada elemento define las características y
   * comportamiento de un paso específico en el proceso.
   * 
   * @type {Array<ListaPasosWizard>}
   * @memberof ElegibilidadTextilesComponent
   * @readonly
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Obtener el paso actual
   * const pasoActual = this.pasos[this.indice - 1];
   * 
   * // Verificar si es el último paso
   * const esUltimoPaso = this.indice === this.pasos.length;
   * ```
   */
  pasos: Array<ListaPasosWizard> = PASOS;

  /**
   * @property {Notificacion | null} nuevaNotificacion
   * @description Objeto que representa una notificación para el usuario.
   */
  nuevaNotificacion: Notificacion | null = null;

  /**
   * @property {string | null} tituloMensaje
   * @description Título principal que se muestra en la cabecera del wizard.
   * Proporciona contexto al usuario sobre el tipo de trámite que está realizando.
   * Puede ser null si no se ha establecido un título específico.
   * 
   * @type {string | null}
   * @memberof ElegibilidadTextilesComponent
   * @default 'Zoosanitario para importación'
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Cambiar el título dinámicamente
   * this.tituloMensaje = 'Nuevo título del proceso';
   * 
   */
  tituloMensaje: string | null = 'Zoosanitario para importación';

  /**
   * @property {WizardComponent} wizardComponent
   * @description Referencia al componente hijo WizardComponent obtenida a través de ViewChild.
   * Permite invocar métodos del wizard como siguiente(), atras(), y otros métodos
   * de navegación desde el componente padre.
   * 
   * @type {WizardComponent}
   * @memberof ElegibilidadTextilesComponent
   * @viewChild
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Navegar al siguiente paso programáticamente
   * this.wizardComponent.siguiente();
   * 
   * // Ir al paso anterior
   * this.wizardComponent.atras();
   * 
   * // Ir a un paso específico
   * this.wizardComponent.irAPaso(3);
   * ```
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
 * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
 */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

  /**
   * @property {number} indice
   * @description Índice del paso actual en el wizard (base 1). Controla qué paso
   * del proceso se está mostrando actualmente al usuario. Se utiliza para
   * la navegación y para determinar el estado del proceso.
   * 
   * @type {number}
   * @memberof ElegibilidadTextilesComponent
   * @default 1
   * @minimum 1
   * @maximum 5
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Verificar si estamos en el primer paso
   * const esPrimerPaso = this.indice === 1;
   * 
   * // Obtener el progreso como porcentaje
   * const progreso = (this.indice / this.pasos.length) * 100;
   * ```
   */
  indice: number = 1;

  /**
 * Estado del solicitante.
 */
  solicitante!: SolicitanteState

  /** Indica si el solicitante es una persona moral.
   * Se utiliza para determinar qué campos mostrar en el formulario.
   */
  esPersonaMoral: boolean = false;


  /**
   * @property {Subject<void>} destroyNotifier$ - Sujeto para manejar la destrucción de suscripciones.
   * Subject privado utilizado con el operador takeUntil para cancelar automáticamente
   * todas las suscripciones activas cuando el componente es destruido.
   * Implementa el patrón estándar para prevenir fugas de memoria en Angular.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /*
  * Valor del RFC obtenido del estado de login.
  */
  public rfcValor: string = '';

  /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   */
  @ViewChild(PasoUnoComponent) validacionPasos!: PasoUnoComponent;

  /**
   * @property {DatosPasos} datosPasos
   * @description Objeto que contiene la configuración y datos necesarios para
   * el funcionamiento del wizard. Incluye información sobre el número total
   * de pasos, el índice actual y los textos de los botones de navegación.
   * 
   * @type {DatosPasos}
   * @memberof ElegibilidadTextilesComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Actualizar el texto de los botones
   * this.datosPasos.txtBtnSig = 'Finalizar';
   * this.datosPasos.txtBtnAnt = 'Volver';
   * 
   * // Verificar el progreso
   * const progreso = this.datosPasos.indice / this.datosPasos.nroPasos;
   * ```
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @property {string} numeroSolicitud Número de la solicitud actual.
   */
  numeroSolicitud: string = '';

  /**
   * @property {boolean} facturasRequeridos Indica si las facturas son requeridas en el proceso.
   */
  facturasRequeridos: boolean = false;
  /**
   * @constructor
   * @description Constructor del componente ElegibilidadTextilesComponent.
   * Inicializa el grupo de formularios reactivos con los controles necesarios
   * para capturar la información del usuario durante el proceso de elegibilidad.
   * 
   * @param {SeccionLibStore} seccionStore - Store para manejar el estado de las secciones
   * @memberof ElegibilidadTextilesComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // El constructor se ejecuta automáticamente al crear una instancia
   * const component = new ElegibilidadTextilesComponent();
   * ```
   * 
   * @see {@link FormGroup} - Documentación de FormGroup de Angular
   * @see {@link FormControl} - Documentación de FormControl de Angular
   */
  constructor(
    private iniciarService: IniciarService,
    private location: Location,
    private seccionStore: SeccionLibStore,
    private guardadoService: GuardadoService,
    private ElegibilidadDeTextilesStore: ElegibilidadDeTextilesStore,
    private ElegibilidadDeTextilesQuery: ElegibilidadDeTextilesQuery,
    private tramiteQuery: Tramite120301Query,
    private solicitanteQuery: SolicitanteQuery,
    private loginQuery: LoginQuery,
  ) {
    this.formGroup = new FormGroup({
      campo1: new FormControl(''),
      campo2: new FormControl(''),
    });
    const CURRENT_STATE = this.tramiteQuery.getValue();
    if (CURRENT_STATE.idSolicitud) {
      this.numeroSolicitud = CURRENT_STATE.idSolicitud.toString();
    }
  }

  /**
   * @method getValorIndice
   * @description Método que maneja las acciones de navegación del wizard basándose
   * en la acción especificada por el usuario. Valida el rango del índice y ejecuta
   * la navegación correspondiente (avanzar o retroceder) a través del componente wizard.
   * 
   * @param {AccionBoton} e - Objeto que contiene la información de la acción a realizar
   * @param {string} e.accion - Tipo de acción ('cont' para continuar, otro valor para retroceder)
   * @param {number} e.valor - Índice del paso destino (debe estar entre 1 y 4)
   * 
   * @returns {void}
   * @memberof ElegibilidadTextilesComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Continuar al siguiente paso
   * this.getValorIndice({ accion: 'cont', valor: 2 });
   * 
   * // Ir al paso anterior
   * this.getValorIndice({ accion: 'prev', valor: 1 });
   * ```
   * 
   * @throws {Error} No lanza errores explícitamente, pero valida el rango de valores
   */
  getValorIndice(e: AccionBoton): void {
    this.facturasRequeridos = this.historicoState.requiereFactura;
    // Si la acción es continuar, validar formularios del paso actual
    if (e.accion === 'cont') {
      if (e.valor <= 2) {
        const ISVALID =
          this.historicoState.cantidadFacturasTotal > 0 &&
          this.solicitudState.validarFormularioImportadorDestino === true;

        if (ISVALID) {
          this.guardarSolicitudCompleta();
        }
        if (!ISVALID) {
          const PESTANA_ACTIVA = (this.pasoUnoComponent.indice);
          if (PESTANA_ACTIVA === 1 || PESTANA_ACTIVA === 2) {
            this.esFormaValido = true;
            this.indice = 1;
            this.datosPasos.indice = 1;
            window.scrollTo(0, 0);
          }
          else {
            const CAMPOS_TAB3_VALIDOS = this.historicoState.cantidadFacturasTotal > 0;
            const CAMPOS_TAB6_VALIDOS = this.solicitudState.validarFormularioImportadorDestino;
            if (!CAMPOS_TAB3_VALIDOS || !CAMPOS_TAB6_VALIDOS) {
              if (!CAMPOS_TAB6_VALIDOS) {
                this.formularioAlertaError = ERROR_FORMA_FALTAN;
                this.pasoUnoComponent.indice = 6;
              } else if (!CAMPOS_TAB3_VALIDOS) {
                this.mostrarOtraPestana = false;
                this.formularioAlertaError = ERROR_FORMA_FACTURA_ASOCIADA;
              }
              this.esFormaValido = true;
              this.indice = 1;
              this.datosPasos.indice = 1;
              // Si los campos de la pestaña 6 están incompletos, marcar en rojo después de un pequeño delay
              if (!CAMPOS_TAB6_VALIDOS) {
                // Usar setTimeout para asegurar que el cambio de pestaña se complete antes de marcar campos
                setTimeout(() => {
                  this.marcarCamposTab6EnRojo();
                }, 150);
              }
              window.scrollTo(0, 0);
            }
          }
          return;
        }
      }
      this.esFormaValido = false;
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      // Avanzar al siguiente paso
      this.wizardComponent.siguiente();
      this.ElegibilidadDeTextilesStore.setPestanaActiva(this.indice);
      return;
    }
    // Para botón "Anterior" - actualizar índice sin validación
    this.indice = e.valor;
    this.datosPasos.indice = this.indice;
    this.wizardComponent.atras();
    this.ElegibilidadDeTextilesStore.setPestanaActiva(this.indice);
  }

  onMensajeError(mensaje: string): void {
    this.formularioAlertaError = mensaje;
    this.esFormaValido = true;
  }

  guardarSolicitudCompleta(): void {
    const PAYLOAD = this.buildPayload();
    this.guardadoService
      .postGuardadoCompleto(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (resp) => {
          if (resp.codigo !== '00') {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: '',
              mensaje: resp.error || 'Error al guardar la solicitud.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          console.error('Error en la petición:', err);
        },
      });
  }

  /**
   * Método que se ejecuta cuando cambia de tab en paso-uno.
   * Oculta el mensaje de error de validación.
   * Al inicializar la pestaña 3, específicamente cambia esFormaValido a false.
   * @param _tabIndex Índice de la pestaña seleccionada
   */
  onTabChanged(_tabIndex: number): void {
    // Siempre cambiar esFormaValido a false cuando cambia de pestaña
    // Esto incluye específicamente cuando se inicializa la pestaña 3
    this.esFormaValido = false;
  }

  /**
   * @method marcarCamposTab6EnRojo
   * @description Marca todos los campos de la pestaña 6 como touched para mostrar errores en rojo
   * y activa las alertas de validación del formulario del importador en destino.
   * Primero asegura que los componentes estén disponibles antes de acceder a ellos.
   */
  private marcarCamposTab6EnRojo(): void {
    // Asegurar que esDatosRespuesta sea true para que el componente se renderice
    if (this.validacionPasos && !this.validacionPasos.esDatosRespuesta) {
      this.validacionPasos.esDatosRespuesta = true;
    }

    // Usar setTimeout para dar tiempo a que Angular renderice el componente
    setTimeout(() => {
      if (this.validacionPasos?.importadorEnDestinoComp) {
        this.validacionPasos.importadorEnDestinoComp.activarAlertasValidacion();
      } else {
        // Si aún no está disponible, intentar marcar los campos directamente
        if (this.validacionPasos?.importadorEnDestinoComp?.importadorForm) {
          this.validacionPasos.importadorEnDestinoComp.importadorForm.markAllAsTouched();
        }
      }
    }, 100);
  }

  /**
   * Maneja el evento de error de validación del año emitido por el componente paso-uno.
   * Muestra o oculta el mensaje de error de año según el estado de validación.
   * @param hasError Valor booleano que indica si hay errores de validación en el año.
   */
  alErrorDeValidacion(hasError: boolean): void {
    this.anoFormValido = hasError;
  }

  /**
   * Maneja el evento de cambio de visibilidad de pestañas emitido por el componente paso-uno.
   * @param show Valor booleano que indica si se deben mostrar las pestañas adicionales.
   */
  onMostrarOtraPestanaChange(show: boolean): void {
    this.mostrarOtraPestana = show;
    if (show) {
      this.esFormaValido = false;
    }
  }

  /**
   * @method asignarSecciones
   * @description Inicializa el estado de las secciones del formulario.
   * Establece las secciones como activas y las marca como válidas para permitir
   * la navegación entre pasos del wizard.
   * 
   * @private
   * @returns {void} No retorna ningún valor.
   * @memberof ElegibilidadTextilesComponent
   * @since 1.0.0
   */
  private asignarSecciones(): void {
    // Inicializar con tres secciones (una por cada paso)
    // Para debugging: establecer la primera sección como válida
    const SECCIONES: boolean[] = [true, false, false];
    const FORMA_VALIDA: boolean[] = [true, false, false];

    this.seccionStore.establecerSeccion(SECCIONES);
    this.seccionStore.establecerFormaValida(FORMA_VALIDA);
  }

  /**
   * @method obtenerNombreDelTítulo
   * @description Método estático que debería retornar el título correspondiente
   * a cada paso del wizard basándose en el índice proporcionado. Actualmente
   * está marcado como no implementado y retorna un mensaje de error.
   * 
   * @static
   * @param {number} _valor - Índice del paso para el cual se desea obtener el título
   * @returns {string} Título del paso correspondiente al índice proporcionado
   * 
   * @memberof ElegibilidadTextilesComponent
   * @since 1.0.0
   * @todo Implementar la lógica para retornar títulos reales según el paso
   * 
   * @example
   * ```typescript
   * // Uso previsto del método (una vez implementado)
   * const titulo = ElegibilidadTextilesComponent.obtenerNombreDelTítulo(1);
   * ```
   * 
   * @deprecated Este método necesita implementación completa
   * @throws {Error} Actualmente retorna un mensaje de error indicando que no está implementado
   */
  static obtenerNombreDelTítulo(_valor: number): string {
    return new Error('Método no implementado.').toString();
  }

  /**
   * @method ngOnInit
   * @description Método del ciclo de vida de Angular que se ejecuta una vez
   * que se ha inicializado el componente. Se utiliza para realizar la
   * configuración inicial, como la suscripción a servicios o la inicialización
   * de datos que dependen de la vista.
   * 
   * @memberof ElegibilidadTextilesComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Inicializar datos al cargar el componente
   * ngOnInit() {
   *   this.datosPasos.indice = 1;
   *   this.indice = 1;
   * }
   * ```
   */
  ngOnInit(): void {
    this.datosPasos.indice = 1;
    this.indice = 1;
    this.asignarSecciones();
    this.iniciar();
    this.tramiteQuery.selectSeccionState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state) => {
        this.solicitudState = state;
        if (state.idSolicitud) {
          this.numeroSolicitud = state.idSolicitud.toString() || '';
        }
      });

    this.ElegibilidadDeTextilesQuery.selectTextile$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.historicoState = state as TextilesState;
        })
      )
      .subscribe();
    this.solicitanteQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.solicitante = state as SolicitanteState;
          this.esPersonaMoral = this.solicitante.tipo_persona === 'M';
        })
      )
      .subscribe();

    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.rfcValor = seccionState.rfc;
        })
      )
      .subscribe();
  }

  /**
   * @method iniciar
   * @description Método que inicia el trámite 120301 enviando una solicitud
   * al servicio IniciarService. Maneja la respuesta del servidor
   */
  iniciar(): void {
    const PAYLOAD: IniciarRequest = {
      rfc_solicitante: 'LEQI810131GA8',
      rol_actual: 'SOLICITANTE'
    };

    // Realiza la solicitud de inicio del trámite
    this.iniciarService.postIniciar(PAYLOAD).subscribe({
      next: (response) => {
        if (response.codigo !== '00') {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response.error || 'Error al iniciar el trámite.',
            mensaje:
              response.causa ||
              response.mensaje ||
              'Ocurrió un error al guardar la solicitud.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
          this.location.back();
        }
      },
      error: (error) => {
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: CategoriaMensaje.ERROR,
          modo: 'action',
          titulo: '',
          mensaje: error?.error?.error || 'Error inesperado al iniciar el trámite.',
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        };
        this.location.back();
      }
    });
  }

  private buildPayload(): GuardarSolicitudCompletaRequest {
    const HISTORICO_STATE = this.historicoState;
    const STATE_SOLICITUD = this.solicitudState
    return {
      id_solicitud: STATE_SOLICITUD.idSolicitud,
      id_asignacion: STATE_SOLICITUD.id_asignacion,
      id_factura_expedicion: STATE_SOLICITUD.id_factura_expedicion,
      boolean_generico: Boolean(HISTORICO_STATE.exportadorFabricanteMismo),
      ide_generica_1: HISTORICO_STATE.exportadorFabricanteMismo,
      descripcion_generica_2: HISTORICO_STATE.tipo,
      ide_generica_2: HISTORICO_STATE.cantidadTotalImportador,
      requiere_descripcion_mercancia: true,

      solicitante: {
        rfc: this.solicitante.rfc_original,
        nombre: this.esPersonaMoral
          ? this.solicitante.razon_social
          : `${this.solicitante.nombre ?? ''} ${this.solicitante.ap_paterno ?? ''} ${this.solicitante.ap_materno ?? ''}`.trim(),
        es_persona_moral: this.esPersonaMoral,
        certificado_serial_number: '3082054030820428a00302010',
      },

      representacion_federal: {
        cve_entidad_federativa: STATE_SOLICITUD.cve_entidad,
        cve_unidad_administrativa: STATE_SOLICITUD.clave,
      },

      expedicion: {
        id_expedicion: STATE_SOLICITUD.idExpedicion,
        cantidad: Number(HISTORICO_STATE.cantidadFacturasTotal),///Enviar  cantidad total de facturas asociadas
        descripcion_mercancia: HISTORICO_STATE.descripcionCategoriaTextil,
      },

      fabricantes: HISTORICO_STATE.listaFabricantesCompleta?.map(fab => ({
        id_fabricante: Number(fab.id_persona_sol),
        rfc: fab.rfc,
        rfc_extranjero: '', // no viene en el response, lo dejas vacío
        razon_social: fab.razon_social,
        es_extranjero: fab.bln_extranjero === '1', // si en el backend es string
        nombre: fab.nombre,
        apellido_paterno: fab.apellido_paterno,
        apellido_materno: fab.apellido_materno,
        correo_electronico: fab.correo_electronico,
        telefono: fab.telefono,
        pagina_web: '', // no viene en response
        nss: '', // no viene en response
        area: fab.descripcion_giro ?? '', // puedes usar este campo
        numero_registro: '', // no viene en response
        domicilio: {
          calle: fab.domicilio?.calle ?? '',
          numero_exterior: fab.domicilio?.num_exterior ?? '',
          numero_interior: fab.domicilio?.num_interior ?? '',
          codigo_postal: fab.domicilio?.cp ?? '',
          nombre_entidad_federativa: fab.domicilio?.entidad_federativa.nombre ?? '',
          nombre_pais: fab.domicilio?.pais?.nombre ?? '',
        }
      })) ?? [],

      instrumento: {
        id_mecanismo: STATE_SOLICITUD.id_mecanismo,
        pais_origen_destino: STATE_SOLICITUD.pais_origen_destino,
        cve_pais: STATE_SOLICITUD.cve_pais,
      },

      importador: {
        razon_social: HISTORICO_STATE.razonSocialImportador,
        domicilio: {
          calle: HISTORICO_STATE.domicilio,
          ciudad: HISTORICO_STATE.ciudadImportador,
          codigo_postal: HISTORICO_STATE.cpImportador,
          cve_pais: 'USA',
        },
      },
    };
  }


  /**
   * @method ngAfterViewInit
   * @description Método del ciclo de vida de Angular que se ejecuta después de que
   * Angular haya inicializado completamente la vista del componente y las vistas de los hijos.
   * Este es el lugar adecuado para establecer el estado de validación después de que
   * todos los componentes hijos se hayan inicializado.
   * 
   * @memberof ElegibilidadTextilesComponent
   * @since 1.0.0
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.asignarSecciones();
    }, 200);
  }

  /**
* Método para manejar el evento de carga de documentos.
* Actualiza el estado del botón de carga de archivos.
*  carga - Indica si la carga de documentos está activa o no.
* {void} No retorna ningún valor.
*/
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos.
   *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
   * {void} No retorna ningún valor.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
 * Método para navegar a la sección anterior del wizard.
 * Actualiza el índice y el estado de los pasos.
 * {void} No retorna ningún valor.
 */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * Método para navegar a la siguiente sección del wizard.
   * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Maneja el evento de carga en progreso emitido por un componente hijo.
   * Actualiza el estado de cargaEnProgreso según el valor recibido.
   * @param cargando Valor booleano que indica si la carga está en progreso.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onCargaEnProgresoPadre(cargando: boolean) {
    this.cargaEnProgreso = cargando;
  }


  /**
 * @method ngOnDestroy
 * @description Método que se ejecuta cuando el componente es destruido.
 * Implementa la limpieza necesaria para evitar fugas de memoria cancelando
 * todas las suscripciones activas mediante el subject destroyNotifier$.
 * Es una implementación estándar del patrón de limpieza en Angular que asegura
 * que todas las suscripciones del componente sean correctamente finalizadas
 * cuando el componente se destruye, liberando recursos del sistema.
 * @returns {void} No retorna ningún valor.
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.ElegibilidadDeTextilesStore.reset();
  }

}