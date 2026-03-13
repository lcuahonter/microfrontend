/**
 * @fileoverview Componente para el primer paso del trámite de elegibilidad de textiles (120301)
 * @description Este archivo contiene la implementación del componente PasoUnoComponent que maneja
 * la interfaz de usuario y la lógica del primer paso del proceso de elegibilidad de textiles.
 * @version 1.0.0
 * @author Sistema VUCEM 3.0
 * @since 2025
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CapturarFacturasComponent } from '../../components/capturar-facturas/capturar-facturas.component';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { ConstanciaDelRegistroComponent } from '../../components/constancia-del-registro/constancia-del-registro.component';
import { DetalleEvaluaconSolicitudService } from '../../services/detalleEvaluaconSolicitud.service';
import { ElegibilidadDeTextilesStore } from '../../estados/elegibilidad-de-textiles.store';
import { ElegibilidadTextilesService } from '../../services/elegibilidad-textiles/elegibilidad-textiles.service';
import { FabricanteResponse } from '../../models/response/fabricantes-response.model';
import { FacturasTplAsociadaResponse } from '../../models/response/datos-factura-response.model';
import { FormularioAsociacionFacturaComponent } from '../../components/facturas-asociadas/facturas-asociadas.component';
import { HistoricoFabricantesComponent } from '../../components/historico-fabricantes/historico-fabricantes.component';
import { ImportadorDestinoResponse } from '../../models/response/importador-destino-response.model';
import { ImportadorEnDestinoComponent } from '../../components/importador-en-destino/importador-en-destino.component';
import { PersonaTerceros } from '@ng-mf/data-access-user';
import { TplDetalleResponse } from '../../models/response/tpl-detalle-response.model';

/**
 * @class PasoUnoComponent
 * @description
 * Componente Angular responsable de manejar el primer paso del trámite de elegibilidad de textiles (120301).
 * Este componente gestiona la interfaz de usuario de pestañas, controla el estado del formulario,
 * y maneja la carga de datos previos cuando el trámite está en modo de actualización.
 * 
 * Implementa los interfaces OnInit y OnDestroy para manejar adecuadamente el ciclo de vida
 * del componente y evitar fugas de memoria mediante la gestión de suscripciones RxJS.
 *
 * @implements {OnInit} - Para inicialización del componente
 * @implements {OnDestroy} - Para limpieza al destruir el componente
 * 
 * @example
 * ```html
 * <!-- Uso básico del componente -->
 * <app-paso-uno></app-paso-uno>
 * ```
 * 
 * @example
 * ```typescript
 * // Inyección en otro componente
 * constructor(private pasoUnoRef: PasoUnoComponent) {}
 * ```
 *
 * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado para edición
 * @property {number} indice - El índice de la pestaña actualmente seleccionada
 * @property {boolean} mostrarOtraPestana - Controla la visibilidad de pestañas adicionales
 * @property {Subject<void>} destroyNotifier$ - Subject privado para manejar la destrucción del componente
 * @property {ConsultaioState} consultaState - Estado actual de la consulta del trámite
 *
 * @method constructor Inicializa las dependencias del componente
 * @method seleccionaTab Cambia la pestaña activa del componente
 * @method ngOnInit Inicializa el componente y configura suscripciones
 * @method onMostrarTabs Maneja la visibilidad de pestañas adicionales
 * @method cargarDatosPrevios Carga datos existentes del trámite
 * @method ngOnDestroy Limpia recursos y cancela suscripciones
 *
 * @since 1.0.0
 * @version 1.0.0
 * @author Sistema VUCEM 3.0
 * 
 * @see {@link ConsultaioQuery} - Servicio de consulta de estado
 * @see {@link ConsultaioStore} - Store de estado de consulta
 * @see {@link ElegibilidadDeTextilesStore} - Store específico de elegibilidad de textiles
 * @see {@link ElegibilidadTextilesService} - Servicio de lógica de negocio de textiles
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * @property {EventEmitter<boolean>} mostrarOtraPestanaChange
   * @description
   * Evento de salida que notifica al componente padre cuando cambia el estado de visibilidad de pestañas adicionales.
   * Se emite un valor booleano (`true` para mostrar, `false` para ocultar) cada vez que el usuario realiza una acción
   * que afecta la visualización de pestañas extra en el flujo del trámite.
   * Permite la comunicación entre el componente hijo y el padre para coordinar la interfaz de usuario.
   * @public
   * @memberof PasoUnoComponent
   * @example
   * ```typescript
   * // En el componente padre
   * <app-paso-uno (mostrarOtraPestanaChange)="onCambioPestana($event)"></app-paso-uno>
   * // En el hijo
   * this.mostrarOtraPestanaChange.emit(true);
   * ```
   */
  @Output() mostrarOtraPestanaChange = new EventEmitter<boolean>();
  /**
   * @property {number} indice
   * @description Índice de la pestaña actualmente seleccionada en el paso uno.
   * @default 1
   */
  indice: number = 1;

  /**
   * RFC del usuario.
   */
  @Input() rfc!: string;

  /**
   * @property {boolean} formularioDeshabilitado
   * @description Indica si el formulario está deshabilitado para edición.
   * @default false
   */
  formularioDeshabilitado: boolean = false;

  /**
   * @property {EventEmitter<number>} tabChanged
   * @description Evento emitido cuando la pestaña activa cambia, enviando el índice de la nueva pestaña.
   */
  @Output() tabChanged = new EventEmitter<number>();

  /**
   * @property {EventEmitter<boolean>} errorValidacion
   * @description Evento emitido cuando hay errores de validación en el formulario de año.
   */
  @Output() errorValidacion = new EventEmitter<boolean>();

  /**
   * @property {ConstanciaDelRegistroComponent} constanciaDelRegistroComp
   * @description Referencia al componente de constancia del registro de origen.
   */
  @ViewChild('constanciaDelRegistroRef') constanciaDelRegistroComp!: ConstanciaDelRegistroComponent;

  /**
   * @property {FormularioAsociacionFacturaComponent} formularioAsociacionFacturaComp
   * @description Referencia al componente de asociación de facturas.
   */
  @ViewChild('formularioAsociacionFacturaRef') formularioAsociacionFacturaComp!: FormularioAsociacionFacturaComponent;

  /**
   * @property {CapturarFacturasComponent} capturarFacturasComp
   * @description Referencia al componente de captura de facturas.
   */
  @ViewChild('capturarFacturasRef') capturarFacturasComp!: CapturarFacturasComponent;

  /**
   * @property {HistoricoFabricantesComponent} historicoFabricantesComp
   * @description Referencia al componente de histórico de fabricantes.
   */
  @ViewChild('historicoFabricantesRef') historicoFabricantesComp!: HistoricoFabricantesComponent;

  /**
   * @property {ImportadorEnDestinoComponent} importadorEnDestinoComp
   * @description Referencia al componente de importador en destino.
   */
  @ViewChild('importadorEnDestinoRef') importadorEnDestinoComp!: ImportadorEnDestinoComponent;

  /**
   * @property {boolean} mostrarOtraPestana
   * @description
   * Controla la visibilidad de pestañas adicionales en la interfaz del componente.
   * Se establece como `true` cuando el componente hijo emite un evento indicando
   * que las pestañas adicionales deben ser mostradas al usuario.
   * 
   * @type {boolean}
   * @default false
   * @public
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Las pestañas adicionales se muestran cuando el hijo emite el evento
   * onMostrarTabs(true); // this.mostrarOtraPestana se convierte en true
   * ```
   */
  mostrarOtraPestana: boolean = false;

  /**
   * @property {boolean} mostrarEvaluar
   */
  mostrarEvaluar: boolean = false;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Subject privado utilizado para notificar la destrucción del componente.
   * Se utiliza con el operador `takeUntil` para cancelar automáticamente
   * todas las suscripciones activas cuando el componente es destruido,
   * evitando así fugas de memoria en la aplicación.
   * 
   * @type {Subject<void>}
   * @private
   * @readonly
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Uso típico para evitar fugas de memoria
   * this.someObservable$
   *   .pipe(takeUntil(this.destroyNotifier$))
   *   .subscribe(data => {
   *     // lógica de manejo de datos
   *   });
   * ```
   */
  private destroyNotifier$: Subject<void> = new Subject();


  /**
   * Indica si existen datos de respuesta para mostrar en el formulario.
   * @type {boolean}
   */
  public esDatosRespuesta: boolean = false;

  /**
   * @property {ConsultaioState} consultaState
   * @description
   * Estado actual relacionado con la consulta del trámite de elegibilidad de textiles.
   * Contiene información sobre el modo de operación (readonly, update), datos del trámite,
   * y otros metadatos necesarios para el funcionamiento del componente.
   * Se actualiza automáticamente a través de la suscripción al ConsultaioQuery.
   * 
   * @type {ConsultaioState}
   * @public
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Verificar el estado para determinar el comportamiento
   * if (this.consultaState.update) {
   *   this.cargarDatosPrevios();
   * } else if (this.consultaState.readonly) {
   *   this.formularioDeshabilitado = true;
   * }
   * ```
   */
  public consultaState!: ConsultaioState;
  /**
   * @property {boolean} esFormularioSoloLectura
   * @description
   * Indica si el formulario está en modo solo lectura (readonly).
   * Cuando es `true`, los campos del formulario no se pueden editar y se muestran
   * únicamente para visualización. Este estado se sincroniza automáticamente
   * con el estado de consulta global del trámite y determina la interactividad
   * de todos los elementos del formulario.
   * 
   * @type {boolean}
   * @default false
   * @public
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se actualiza automáticamente basado en el estado de consulta
   * this.esFormularioSoloLectura = seccionState.readonly;
   * 
   * // Uso en el template para condicionar la edición
   * if (!this.esFormularioSoloLectura) {
   *   // Permitir edición de campos
   * }
   * ```
   * 
   * @see {@link ConsultaioState#readonly} - Propiedad del estado que controla este valor
   */
  esFormularioSoloLectura: boolean = false;

  /**
 * Lista de personas relacionadas con el trámite.
 * @type {PersonaTerceros[]}
 */
  public personas: PersonaTerceros[] = [];

  /**
   * @property {Set<number>} tabsCompletadas
   * @description
   * Tracking de tabs completadas que almacena qué pestañas han sido visitadas y completadas 
   * por el usuario durante el proceso del trámite. Se utiliza un Set para garantizar
   * unicidad de los índices y optimizar las operaciones de búsqueda.
   * 
   * Este conjunto se actualiza automáticamente cuando:
   * - El usuario cambia de pestaña y el formulario actual es válido
   * - Se ejecuta la validación completa del paso uno
   * - Se detectan errores en formularios previamente válidos
   * 
   * @type {Set<number>}
   * @default new Set()
   * @public
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Verificar si una tab específica está completada
   * const isTabCompleted = this.tabsCompletadas.has(2);
   * 
   * // Agregar una tab como completada
   * this.tabsCompletadas.add(3);
   * 
   * // Verificar si todas las tabs requeridas están completadas
   * const REQUIRED_TABS = [2, 4, 5];
   * const allCompleted = REQUIRED_TABS.every(tab => this.tabsCompletadas.has(tab));
   * ```
   * 
   * @see {@link marcarTabComoCompletada} - Método que actualiza este conjunto
   * @see {@link validarTodosLosFormularios} - Método que utiliza este conjunto para validación
   */
  tabsCompletadas: Set<number> = new Set();

  /**
   * @property {FacturasTplAsociadaResponse[]} facturas
   */
  informacionFacturasAsociadas!: FacturasTplAsociadaResponse;

  /**
   * @property {FabricanteResponse} InformacionHistorico
   */
  informacionHistorico!: FabricanteResponse;

  informacionImportador!: ImportadorDestinoResponse;

  @Output() mensajeError: EventEmitter<string> = new EventEmitter<string>();

  /**
   * @method seleccionaTab
   * @description
   * Selecciona una pestaña específica y actualiza el índice correspondiente.
   * Este método es utilizado para cambiar la pestaña activa en la interfaz de usuario,
   * permitiendo al usuario navegar entre diferentes secciones del primer paso del trámite.
   * 
   * @param {number} i - El índice de la pestaña que se desea seleccionar.
   *                    Debe ser un número entero positivo que represente
   *                    una pestaña válida en la interfaz.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @public
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Seleccionar la primera pestaña
   * this.seleccionaTab(1);
   * 
   * // Seleccionar la tercera pestaña
   * this.seleccionaTab(3);
   * 
   * // Uso desde el template
   * // <button (click)="seleccionaTab(2)">Ir a pestaña 2</button>
   * ```
   */
  seleccionaTab(i: number): void {
    // Marcar la tab actual como completada si tiene form válido
    this.marcarTabComoCompletada(this.indice);

    this.indice = i;

    this.ElegibilidadDeTextilesStore.setPestanaActiva(this.indice);
    this.tabChanged.emit(this.indice); // Emite evento con el índice de la pestaña seleccionada
  }

  /**
 * @method onMensajeError
 * @description Maneja los mensajes de error emitidos por el componente hijo.
 * @param {string} mensaje - Mensaje de error a mostrar.
 * @returns {void} No retorna ningún valor.
 */
  onMensajeError(mensaje: string): void {
    this.mensajeError.emit(mensaje);
    // Cualquier lógica adicional para manejar el error
  }

  /**
   * @method marcarTabComoCompletada
   * @description
   * Marca una pestaña como completada si su formulario asociado es válido.
   * Este método verifica la validez del formulario correspondiente al índice de pestaña
   * proporcionado y actualiza el conjunto `tabsCompletadas` en consecuencia.
   * 
   * Evalúa los siguientes formularios según el índice:
   * - Tab 2: Constancia del Registro de origen (fitosanitarioForm)
   * - Tab 3: Asociación de Facturas (formularioAsociacionFactura)
   * - Tab 4: Capturar Facturas (facturaForm)
   * - Tab 5: Histórico de Fabricantes (historicoFabricantesForm)
   * - Tab 6: Importador en Destino (importadorForm)
   * 
   * @param {number} tabIndex - Índice de la pestaña a verificar y marcar como completada.
   *                           Debe corresponder a una de las pestañas con formulario válido.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @private
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se llama automáticamente al cambiar de pestaña
   * seleccionaTab(newTabIndex: number): void {
   *   this.marcarTabComoCompletada(this.indice); // Marca la tab actual
   *   this.indice = newTabIndex;
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // Comportamiento interno del método
   * if (tabIndex === 2 && this.constanciaDelRegistroComp?.fitosanitarioForm) {
   *   const isValid = this.constanciaDelRegistroComp.fitosanitarioForm.valid;
   *   if (isValid) {
   *     this.tabsCompletadas.add(tabIndex); // Marca como completada
   *   } else {
   *     this.tabsCompletadas.delete(tabIndex); // Remueve si es inválida
   *   }
   * }
   * ```
   * 
   * @see {@link tabsCompletadas} - Conjunto que almacena las pestañas completadas
   * @see {@link seleccionaTab} - Método que utiliza esta función
   * @see {@link validarTodosLosFormularios} - Método que también utiliza esta función
   */
  private marcarTabComoCompletada(tabIndex: number): void {
    let isValid = false;

    // Tab 2: Constancia Del Registro de origen
    if (tabIndex === 2 && this.constanciaDelRegistroComp?.fitosanitarioForm) {
      isValid = this.constanciaDelRegistroComp.fitosanitarioForm.valid;
    }

    // Tab 3: Asociacion Factura
    if (tabIndex === 3 && this.formularioAsociacionFacturaComp?.formularioAsociacionFactura) {
      isValid = this.formularioAsociacionFacturaComp.formularioAsociacionFactura.valid;
    }

    // Tab 4: capturar Facturas  
    if (tabIndex === 4 && this.capturarFacturasComp?.facturaForm) {
      isValid = this.capturarFacturasComp.facturaForm.valid;
    }

    // Tab 5: Datos certificado
    if (tabIndex === 5 && this.historicoFabricantesComp?.historicoFabricantesForm) {
      isValid = this.historicoFabricantesComp.historicoFabricantesForm.valid;
    }

    // Tab 6: Datos certificado
    if (tabIndex === 6 && this.importadorEnDestinoComp?.importadorForm) {
      isValid = this.importadorEnDestinoComp.importadorForm.valid;
    }


    // Si es válida, marcarla como completada
    if (isValid) {
      this.tabsCompletadas.add(tabIndex);
    } else if ([2, 3, 4, 5, 6].includes(tabIndex)) {
      // Si es una tab requerida pero inválida, removerla de completadas
      this.tabsCompletadas.delete(tabIndex);
    }
  }

  /**
   * Valida todos los formularios del paso uno.
   * 
   * Requiere que TODAS las tabs necesarias estén completadas:
   * - Tab 2: Certificado de origen
   * - Tab 4: Destinatario  
   * - Tab 5: Datos certificado
   * 
   * @returns {boolean} `true` si TODAS las tabs requeridas están completadas
   */
  public validarTodosLosFormularios(): boolean {
    // Marcar la tab actual como completada antes de validar
    this.marcarTabComoCompletada(this.indice);

    // Tabs requeridas que deben estar completadas
    const REQUIRED_TABS = [2, 4, 5];

    // Verificar si todas las tabs requeridas están completadas
    const ALL_TABS_COMPLETED = REQUIRED_TABS.every(tab => this.tabsCompletadas.has(tab));

    // Si no todas están completadas, mostrar errores en la tab actual
    if (!ALL_TABS_COMPLETED) {
      // Validar y mostrar errores en la tab actual
      if (this.indice === 2 && this.constanciaDelRegistroComp?.fitosanitarioForm) {
        this.constanciaDelRegistroComp.fitosanitarioForm.markAllAsTouched();
      }

      if (this.indice === 3 && this.formularioAsociacionFacturaComp?.formularioAsociacionFactura) {
        this.formularioAsociacionFacturaComp.formularioAsociacionFactura.markAllAsTouched();
      }

      if (this.indice === 4 && this.capturarFacturasComp?.facturaForm) {
        this.capturarFacturasComp.facturaForm.markAllAsTouched();
      }

      if (this.indice === 5 && this.historicoFabricantesComp?.historicoFabricantesForm) {
        this.historicoFabricantesComp.historicoFabricantesForm.markAllAsTouched();
      }

      if (this.indice === 6 && this.importadorEnDestinoComp?.importadorForm) {
        this.importadorEnDestinoComp.importadorForm.markAllAsTouched();
      }
    }

    // Verificar que todas las tabs requeridas estén completadas
    return ALL_TABS_COMPLETED;
  }
  /**
   * @property {string} numeroFolio
   */
  numeroFolio: string = '';

  /**
   * @constructor
   * @description
   * Constructor del componente PasoUnoComponent que inicializa todas las dependencias
   * necesarias para el funcionamiento del primer paso del trámite de elegibilidad de textiles.
   * Se inyectan los servicios y stores requeridos para la gestión de estado y lógica de negocio.
   * 
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado de la consulta del trámite
   * @param {ConsultaioStore} consultaStore - Store para gestionar el estado global de la consulta
   * @param {ElegibilidadDeTextilesStore} ElegibilidadDeTextilesStore - Store específico para el estado de elegibilidad de textiles
   * @param {ElegibilidadTextilesService} elegibilidadTextilesService - Servicio con la lógica de negocio para textiles
   * 
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por Angular DI
   * // No es necesario instanciarlo manualmente
   * const component = TestBed.createComponent(PasoUnoComponent);
   * ```
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private ElegibilidadDeTextilesStore: ElegibilidadDeTextilesStore,
    private elegibilidadTextilesService: ElegibilidadTextilesService,
    private evaluacionSolicitud: DetalleEvaluaconSolicitudService,
  ) { }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta después de la inicialización del componente.
   * Configura la suscripción al estado de consulta para reaccionar automáticamente a cambios
   * en el modo de operación (readonly/update) y ejecutar las acciones correspondientes.
   * 
   * Establece el comportamiento del formulario basado en el estado:
   * - Si está en modo 'update': habilita el formulario y carga datos previos
   * - Si está en modo 'readonly': deshabilita el formulario para solo lectura
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @implements {OnInit}
   * @public
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // ngOnInit es llamado automáticamente por Angular
   * // después de la construcción del componente
   * ngOnInit() {
   *   // lógica de inicialización
   * }
   * ```
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;
          // Normal logic: readonly true = disable fields, readonly false = enable fields
          this.formularioDeshabilitado = seccionState.readonly;
          if (this.consultaState.folioTramite) {
            this.numeroFolio = this.consultaState.folioTramite;
            this.mostrarOtraPestana = true;
            this.mostrarEvaluar = false;
          }
          if (this.consultaState.update) {
            this.guardarDatosFormulario();
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
  }

  /**
   * Obtener los datos de las facturas asociadas 
   *  * @param idFolio Identificador del folio del trámite
   */
  obtenerDatosFacturasAsociadas(idFolio: string): void {
    this.evaluacionSolicitud.getFacturasAsociadasPorFolio(idFolio)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.informacionFacturasAsociadas = response.datos ?? {} as FacturasTplAsociadaResponse;
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
   * @method guardarDatosFormulario
   * @description
   * Guarda los datos del formulario obtenidos del servicio de elegibilidad de textiles.
   * Este método se suscribe al servicio para obtener los datos de prefill de la solicitud
   * y actualiza el estado del formulario con la información recibida del backend.
   * 
   * La suscripción se maneja de forma segura utilizando el patrón `takeUntil` para
   * evitar fugas de memoria. Los datos obtenidos incluyen información de personas
   * y otros datos relevantes para el trámite que deben ser pre-cargados en el formulario.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @private
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * 
   * @throws {Error} Puede lanzar errores si el servicio de elegibilidad falla
   *                 o si hay problemas de conectividad con el backend.
   * 
   * @example
   * ```typescript
   * // Se ejecuta automáticamente cuando el estado cambia a 'update'
   * if (this.consultaState.update) {
   *   this.guardarDatosFormulario(); // Carga datos existentes
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // Flujo interno del método
   * this.elegibilidadTextilesService.getPrefillDatos()
   *   .pipe(takeUntil(this.destroyNotifier$))
   *   .subscribe((resp) => {
   *     if (resp) {
   *       this.esDatosRespuesta = true;
   *       this.personas = resp.personas || [];
   *       this.elegibilidadTextilesService.actualizarEstadoFormulario(resp);
   *     }
   *   });
   * ```
   * 
   * @see {@link ElegibilidadTextilesService#getPrefillDatos} - Servicio que provee los datos
   * @see {@link ElegibilidadTextilesService#actualizarEstadoFormulario} - Método para actualizar estado
   * @see {@link esDatosRespuesta} - Propiedad que se actualiza con el resultado
   * @see {@link personas} - Array que se actualiza con los datos de personas
   */
  guardarDatosFormulario(): void {
    this.elegibilidadTextilesService
      .getPrefillDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.personas =
            (resp as { personas?: PersonaTerceros[] }).personas || [];
          this.elegibilidadTextilesService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * @method cargarDatosPrevios
   * @description
   * Carga datos previos del trámite desde el servicio de elegibilidad de textiles y actualiza
   * el estado en el store correspondiente. Este método se utiliza cuando el trámite está en
   * modo de actualización ('update') para cargar la información existente y permitir su edición.
   * 
   * La carga de datos se realiza de forma asíncrona a través de un observable que se suscribe
   * automáticamente y utiliza el patrón `takeUntil` para evitar fugas de memoria al destruir
   * el componente. Una vez obtenidos los datos, se actualizan en el store local del componente.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @private
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * 
   * @throws {Error} Podría lanzar errores si el servicio de elegibilidad de textiles falla
   *                 o si hay problemas de conectividad con el backend.
   * 
   * @example
   * ```typescript
   * // Se llama automáticamente cuando el estado cambia a 'update'
   * if (this.consultaState.update) {
   *   this.formularioDeshabilitado = false;
   *   this.cargarDatosPrevios(); // Carga los datos existentes
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // El flujo interno del método
   * cargarDatosPrevios(): void {
   *   // 1. Obtiene observable de datos prefill
   *   const PREFILL_DATOS = this.elegibilidadTextilesService.getPrefillDatos();
   *   
   *   // 2. Se suscribe con protección contra fugas de memoria
   *   PREFILL_DATOS.pipe(takeUntil(this.destroyNotifier$))
   *     .subscribe((datos) => {
   *       // 3. Actualiza el store con los datos cargados
   *       this.ElegibilidadDeTextilesStore.setTextilesState(datos);
   *     });
   * }
   * ```
   * 
   * @see {@link ElegibilidadTextilesService#getPrefillDatos} - Método que obtiene los datos del servicio
   * @see {@link ElegibilidadDeTextilesStore#setTextilesState} - Método que actualiza el estado del store
   */
  cargarDatosPrevios(): void {
    const PREFILL_DATOS = this.elegibilidadTextilesService.getPrefillDatos();
    PREFILL_DATOS.pipe(takeUntil(this.destroyNotifier$)).subscribe((datos) => {
      this.ElegibilidadDeTextilesStore.setTextilesState(datos);
    });
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta automáticamente cuando el componente
   * está a punto de ser destruido. Este método es crucial para la gestión de memoria y
   * la prevención de fugas (memory leaks) en la aplicación.
   * 
   * Realiza las siguientes acciones de limpieza:
   * 1. Emite una señal a través del `destroyNotifier$` para notificar a todas las suscripciones activas
   * 2. Completa el Subject `destroyNotifier$` para liberar todos sus recursos internos
   * 
   * Todas las suscripciones que utilizan `takeUntil(this.destroyNotifier$)` se cancelarán
   * automáticamente cuando este método se ejecute, garantizando una limpieza adecuada.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @implements {OnDestroy}
   * @public
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // ngOnDestroy es llamado automáticamente por Angular
   * // cuando el componente va a ser destruido (ej: navegación, etc.)
   * 
   * // Esto cancela automáticamente todas las suscripciones como:
   * this.consultaQuery.selectConsultaioState$
   *   .pipe(takeUntil(this.destroyNotifier$)) // Se cancela aquí
   *   .subscribe();
   * ```
   * 
   * @example
   * ```typescript
   * // Patrón típico de uso en otros observables del componente
   * this.someService.getData()
   *   .pipe(takeUntil(this.destroyNotifier$))
   *   .subscribe(data => {
   *     // Esta suscripción se cancela automáticamente
   *     // cuando ngOnDestroy() se ejecuta
   *   });
   * ```
   * 
   * @see {@link OnDestroy} - Interface de Angular para el ciclo de vida
   * @see {@link Subject#next} - Método para emitir valores en el Subject
   * @see {@link Subject#complete} - Método para completar el Subject
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }


  /**
   * Maneja el evento emitido por el componente hijo para mostrar pestañas adicionales.
   * @param event Valor booleano emitido por el hijo.
   */
  /**
   * @method onMostrarTabs
   * @description
   * Maneja el evento emitido por el componente hijo para mostrar u ocultar pestañas adicionales.
   * Si el evento es verdadero, habilita la visualización de la pestaña extra y avanza el índice a la pestaña de facturas asociadas.
   * Si el evento es falso, oculta la pestaña adicional. En ambos casos, emite el cambio al componente padre mediante mostrarOtraPestanaChange.
   * @param {boolean} event - Valor booleano que indica si se deben mostrar las pestañas adicionales.
   * @returns {void} No retorna ningún valor.
   * @example
   * // Desde el hijo: this.mostrarTabs.emit(true);
   * // Desde el padre: <app-paso-uno (mostrarOtraPestanaChange)="onCambioPestana($event)"></app-paso-uno>
   */
  public onMostrarTabs(event: boolean): void {
    if (event) {
      this.mostrarOtraPestana = true;
      this.mostrarEvaluar = true;
      this.indice = 3; // Avanza a la siguiente tab (Facturas asociadas)
      this.mostrarOtraPestanaChange.emit(this.mostrarOtraPestana);
    } else {
      this.mostrarOtraPestana = false;
      this.mostrarOtraPestanaChange.emit(this.mostrarOtraPestana);
    }
  }

  /**
   * @method alErrorDeValidacion
   * @description
   * Maneja el evento de error de validación emitido por el componente hijo ConstanciaDelRegistroComponent
   * cuando ocurren errores en la validación del formulario de año. Este método actúa como un puente
   * de comunicación entre el componente hijo y el componente padre, propagando el estado de error
   * hacia arriba en la jerarquía de componentes para que pueda ser manejado adecuadamente.
   * 
   * @param {boolean} event - Valor booleano que indica si hay errores de validación.
   *                         - `true`: Existen errores de validación en el formulario
   *                         - `false`: El formulario es válido, no hay errores
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @public
   * @memberof PasoUnoComponent
   * @since 1.0.0
   * 
   * @example
   * ```html
   * <!-- Uso en el template del componente padre -->
   * <app-constancia-del-registro 
   *   (errorValidacion)="alErrorDeValidacion($event)"
   *   [formularioDeshabilitado]="formularioDeshabilitado">
   * </app-constancia-del-registro>
   * ```
   * 
   * @example
   * ```typescript
   * // El flujo de eventos es:
   * // 1. ConstanciaDelRegistroComponent detecta error → emite errorValidacion(true)
   * // 2. PasoUnoComponent recibe evento → ejecuta alErrorDeValidacion(true)
   * // 3. PasoUnoComponent propaga evento → emite errorValidacion(true) al padre
   * ```
   * 
   * @see {@link ConstanciaDelRegistroComponent} - Componente que emite el evento original
   * @see {@link EventEmitter#emit} - Método utilizado para propagar el evento
   */
  public alErrorDeValidacion(event: boolean): void {
    this.errorValidacion.emit(event);
  }
}