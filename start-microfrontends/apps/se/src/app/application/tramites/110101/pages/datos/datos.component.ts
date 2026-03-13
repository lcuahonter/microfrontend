import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { CategoriaMensaje, ConsultaioQuery, ConsultaioState, Notificacion, TabEvaluarTratadosResponse } from '@ng-mf/data-access-user';
import { Subject, takeUntil, tap } from 'rxjs';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { DatosAdicionalesComponent } from '../../components/datos-adicionales/datos-adicionales.component';
import { DatosMercanciaComponent } from '../../components/datos-mercancia/datos-mercancia.component';
import { EvaluacionTratadosService } from '../../services/evaluacion-tratados.service';
import { ExportadorAutorizadoService } from '../../services/exportador-autorizado.service';
import { PantallasSvcService } from '../../services/pantallas-svc.service';
import { Solicitante110101Query } from '../../estados/queries/solicitante110101.query';
import { Solicitante110101State } from '../../estados/tramites/solicitante110101.store';
import { SolicitanteComponent } from '../../components/solicitante/solicitante.component';
import { TratadosComponent } from '../../components/tratados/tratados.component';

import { Mercancia, ValidarSolicitudResponse } from '../../models/response/validar-solicitud-response.model';

/**
 * Este componente se utiliza para mostrar el subtítulo del asistente - 110101
 * Establecer el índice del subtítulo
 */

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent implements OnInit, OnDestroy {

  /**
   * Evento emitido al cambiar de pestaña.
   * @event tabChanged
   * @type {EventEmitter<number>}
   */
  @Output() tabChanged = new EventEmitter<number>();

  /**
   * **Subject para manejar la destrucción del componente**
   * 
   * Este `Subject` se utiliza para cancelar suscripciones y evitar 
   * fugas de memoria cuando el componente es destruido.
   * Se usa comúnmente en el operador `takeUntil` dentro de los observables.
  */
  private destroy$ = new Subject<void>();

/**
 * @property solicitante - Referencia al componente `SolicitanteComponent` que gestiona
 *                         la información y validación del solicitante en el trámite.
 * @command El decorador `@ViewChild` permite acceder al componente hijo para usar sus métodos y propiedades.
 */
  @ViewChild('Solicitante', { static: false }) solicitante!: SolicitanteComponent;

  /**
   * Datos de la evaluacionde la solicitud
  */
  public evaluarSolicitudResponse!: ValidarSolicitudResponse;

/**
 * @property tratados - Referencia al componente `TratadosComponent` encargado de manejar
 *                      la lógica y validación relacionada con los tratados del trámite.
 * @command El decorador `@ViewChild` permite acceder al componente hijo para interactuar con sus métodos y propiedades.
 */
  @ViewChild('tratadosRef', { static: false }) tratados!: TratadosComponent;

/**
 * @property mercancia - Referencia al componente `DatosMercanciaComponent` que controla
 *                       la captura y validación de los datos de mercancía en el trámite.
 * @command El decorador `@ViewChild` permite acceder al componente hijo para interactuar con sus métodos y propiedades.
 */
  @ViewChild('mercanciaRef', { static: false }) mercancia!: DatosMercanciaComponent;

  /**
 * @property mercancia - Referencia al componente `DatosMercanciaComponent` que controla
 *                       la captura y validación de los datos de mercancía en el trámite.
 * @command El decorador `@ViewChild` permite acceder al componente hijo para interactuar con sus métodos y propiedades.
 */
  @ViewChild('datosAdicionalesRef', { static: false }) datosAdicionales!: DatosAdicionalesComponent;

  /**
 * @property {boolean} esDictaminadorBandera
 * @description Indica si se está mostrando boton de la calificación con bandera.
 * Por defecto es false.
 */
   @Input() esDictaminadorBandera: boolean = false;

  /**
   * Esta variable se utiliza para almacenar los tratados datos actualizados.
   * Es un array de objetos de tipo EvaluarTratadosResponse.
   */
  tratadosDatosActualizados: TabEvaluarTratadosResponse[] = [];

  /**
   * Este evento se emite cuando los tratados datos son actualizados.
   * Es un EventEmitter que emite un array de objetos de tipo EvaluarTratadosResponse.
   */
  @Output() tratadosEmitidos = new EventEmitter<TabEvaluarTratadosResponse[]>();

  /**
  * Esta variable se utiliza para almacenar el índice del subtítulo.
  */
  indice: number = 1;
  /**
   * Subject utilizado para emitir una señal que permite desuscribirse de los observables, típicamente en el ciclo de vida ngOnDestroy.
   * Cuando se emite un valor, todas las suscripciones que usan `takeUntil(this.destroyNotifier$)` serán desuscritas,
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Almacena el estado actual del proceso Consultaio para este componente.
   */
  public consultaState!: ConsultaioState;

   /**
   * Representa el estado actual de la solicitud para el trámite 110101.
   * Esta propiedad contiene toda la información relevante sobre la solicitud del solicitante,
   * encapsulada en la interfaz `Solicitante110101State`.
  */
  public solicitudeState!: Solicitante110101State;

  /**
  * Notificación actual que se muestra en el componente.
  *
  * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
  * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
  */
  public nuevaNotificacion!: Notificacion;

  /**
  * @property desactivado
  * @type {boolean}
  * @public
  * @description
  * Indica si la pestaña está desactivada (no interactiva).
  * Se utiliza para controlar la habilitación o deshabilitación de la pestaña en la interfaz.
  * Por defecto, la pestaña inicia desactivada (`true`).
  */
  public desactivado: boolean = true;

  /**
   * @property bandejaSolicitud
   * @type {boolean}
   * @public
   * @description
   * Controla la visualización de la bandeja de solicitudes.
   * Cuando es `true`, muestra la interfaz de bandeja de solicitudes.
   * Cuando es `false`, oculta la bandeja de solicitudes.
   */
  public bandejaSolicitud = false;

  /** 
   * @property mostrarExportadorUE
   * @description Indica si debe mostrarse la sección del exportador autorizado para la Unión Europea.
   * 
  */
  mostrarExportadorUE: boolean = false;

  /**
   * @property mostrarExportadorJPN
   * @description Indica si debe mostrarse la sección del exportador autorizado para Japón.
   */
  mostrarExportadorJPN: boolean = false;

  /**
   * @property tituloExportador
   * @description Almacena el título dinámico que se muestra en la interfaz según el tipo de exportador autorizado.
   */
  tituloExportador: string = '';

  /**
   * @property controlPeticiones
   * @type {boolean}
   * @public
   * @description
   * Gestiona el estado del control de peticiones.
   * Activa o desactiva la funcionalidad de control de peticiones en el componente.
   * Por defecto, el control de peticiones está desactivado (`false`).
   */
  public controlPeticiones = false;

  /* Valor del RFC obtenido del estado de login.*/
  @Input() rfcValor!: string;

  /**
   * Inicializa una nueva instancia del componente.
   */
  constructor(
    private pantallasSvc: PantallasSvcService,
    private consultaQuery: ConsultaioQuery,
    private solicitanteQuery: Solicitante110101Query,
    private evaluacionTratadosService: EvaluacionTratadosService,
    private exportadorAutorizadoService: ExportadorAutorizadoService
  ) {

  }

  /**
   * Método del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de una directiva.
   * 
   * - Se suscribe al observable `selectConsultaioState$` de `consultaQuery` y actualiza la propiedad local `consultaState` con el valor emitido.
   * - Si la bandera `consultaState.update` es verdadera después de la inicialización, ejecuta el método `guardarDatosFormulario()` para guardar los datos del formulario.
   * - Asegura que la suscripción se limpie correctamente utilizando el observable `destroyNotifier$` para evitar fugas de memoria.
   */
  ngOnInit(): void {
    // Suscripción a consultaState
  this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      tap((seccionState) => {
        this.consultaState = seccionState;

        if (this.consultaState.update) {
          this.guardarDatosFormulario();
        }

        this.checkParameterAndEnableTabs();

      })
    )
    .subscribe();

  this.solicitanteQuery.selectSolicitante$
    .pipe(
      takeUntil(this.destroyNotifier$),
      tap((seccionState) => {
        this.solicitudeState = seccionState;
      })
    )
    .subscribe();
    if(this.consultaState.parameter === "EvaluarSolicitud"){
      this.evaluacionTablaTratados();
    }

    if(this.consultaState.create === false){
      this.consultarExportadorAutorizado();
    }
  }

  /**
   * @method consultarExportadorAutorizado
   * @description Realiza la consulta de información del exportador autorizado para 
   * la Unión Europea o Japón según el folio del trámite.
   * Actualiza las banderas que controlan la visualización de las secciones correspondientes 
   * y el título del componente.
   */
  consultarExportadorAutorizado(): void {
    this.exportadorAutorizadoService.getExportadoAutorizadoUEoJPN(this.consultaState.folioTramite)
      .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: (response) => {
            if (response.codigo === CodigoRespuesta.EXITO) {
              this.mostrarExportadorUE = Boolean(response.datos?.mostrar_exportador_ue);
              this.mostrarExportadorJPN = Boolean(response.datos?.mostrar_exportador_jpn);
              
              this.actualizarTituloExportador();
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: response.error || 'Error obtener tratados.',
                mensaje: response.causa || response.mensaje || 'Error obtener tratados.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
            }
          },
          error: (err) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const MENSAJE = err?.error?.error || 'Error obtener tratados.';
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: 'error',
              modo: 'action',
              titulo: '',
              mensaje: MENSAJE,
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            }
          }
        });
  }
  /**
   * @method actualizarTituloExportador
   * @description Actualizar el título dinámicamente según la respuesta del endpoit
   */
  actualizarTituloExportador(): void{
    if (this.mostrarExportadorUE) {
      this.tituloExportador = 'Exportador Autorizado UE';
    } else if (this.mostrarExportadorJPN) {
      this.tituloExportador = 'Exportador Autorizado JPN';
    } 
  }

  /**
     * Obtiene la evaluación de tratados para la solicitud actual y actualiza la tabla de evaluación.
     *
     * Este método llama al servicio `evaluacionTratadosService.getEvaluarTratados` pasando el ID de la solicitud.
     * - Si la respuesta es exitosa (`CodigoRespuesta.EXITO`), actualiza `tratadosEvaluacionTablaDatos`.
     * - Si ocurre un error o la respuesta es incorrecta, muestra una notificación de error.
     */
    evaluacionTablaTratados(): void {
      this.evaluacionTratadosService.getEvaluarTratados(this.consultaState.id_solicitud)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: (response) => {
            if (response.codigo === CodigoRespuesta.EXITO) {
              this.onTratadosActualizados(response.datos ?? []);
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: response.error || 'Error obtener tratados.',
                mensaje: response.causa || response.mensaje || 'Error obtener tratados.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
            }
          },
          error: (err) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const MENSAJE = err?.error?.error || 'Error obtener tratados.';
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: 'error',
              modo: 'action',
              titulo: '',
              mensaje: MENSAJE,
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            }
          }
        });
    }
  /**
   * Este método se utiliza para verificar si el parámetro existe y habilitar las pestañas
   * - Si el parámetro existe y no es undefined, habilita las pestañas 3 y 4.
   * - Si el parámetro no existe o es undefined, mantiene las pestañas 3 y
   * 4 desactivadas.
   */
  private checkParameterAndEnableTabs(): void {
    if (this.consultaState.parameter === undefined && this.consultaState.update === true && this.consultaState.tipoDeTramite === 'Consulta de Proceso'
    ) {
      this.bandejaSolicitud = true;
    }
  }
  /**
   * Este método se utiliza para establecer el índice del subtítulo.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.tabChanged.emit(i);
  }



  /**
   * Guarda los datos del formulario obteniendo el estado actual del formulario desde el servicio.
   *
   * Este método se suscribe al observable retornado por `pantallasSvc.getConsultaDatos()`,
   * y al recibir una respuesta, actualiza el estado del formulario usando `pantallasSvc.actualizarEstadoFormulario`.
   * La suscripción se cancela automáticamente cuando `destroyNotifier$` emite, evitando fugas de memoria.
   */
  public guardarDatosFormulario(): void {
    this.pantallasSvc.getConsultaDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      this.pantallasSvc.actualizarEstadoFormulario(response);
    })
  }

  /* Habilita la pestaña si actualmente está desactivada.
   * Cambia la variable `desactivado` a `false` para permitir la interacción con la pestaña.
   *
   * @example
   * this.habilitarPestana();
   * // La pestaña pasa de estar desactivada a habilitada.
   */
  habilitarPestana(): void {
    if (this.desactivado) {
      this.desactivado = false;
    }
  }

  /**
   * @method onTratadosActualizados
   * @description Maneja la actualización de los tratados.
   * @param tratados - Array de objetos de tipo EvaluarTratadosResponse que contiene los tratados actualizados.
   */
  onTratadosActualizados(tratados: TabEvaluarTratadosResponse[]): void {
    this.tratadosDatosActualizados = tratados;
    this.tratadosEmitidos.emit(tratados);
  }

  /**
   * Deshabilita (cierra) la pestaña actual.
   *
   * @example
   * this.cerrarPestana();
   * // La pestaña pasa de estar habilitada a deshabilitada.
   */
  cerrarPestana(): void {
    if (!this.desactivado) {
      this.desactivado = true;
    }
  }

/**
 * @description Valida los formularios de los componentes hijos según la pestaña (tab) actual del trámite.
 * Evalúa la validez de los formularios de `tratados` y `mercancia`, y realiza la navegación al siguiente paso
 * si las validaciones son correctas. Si algún formulario es inválido, marca los campos correspondientes
 * y mantiene la pestaña actual.
 * @method validarFormularios
 * @returns {boolean | undefined} Retorna `true` si el formulario actual es válido, `false` si es inválido,
 * y `undefined` si el componente aún no está cargado.
 */
public validarFormularios(): boolean | undefined{
  switch (this.indice) {
     case 1:
      return this.validarTabSolicitante();
    case 2:
      return this.validarTabTratados();
    case 3:
      return this.validarTabMercancia();
    case 4:
      return this.validarTabDatosAdicionales();
    case 5:
      return this.validarTabProcesos();
    default:
      return false;
  }

}

/**
 * @method validarTabSolicitante
 * @description
 * Valida el contenido del tab de **Solicitante** y, al ser siempre válido, avanza automáticamente al siguiente tab.
 * @returns {boolean} Retorna `true` indicando que el tab es válido.
 */
  private validarTabSolicitante(): boolean {
    this.seleccionaTab(2);
    return true;
  }

/**
 * @method validarTabTratados
 * @description
 * Valida el formulario del tab de **Tratados**.  
 * Si el formulario es inválido, se mantiene en el mismo tab; si es válido, avanza al siguiente.
 * @returns {boolean | undefined} `true` si es válido, `false` si es inválido, `undefined` si el componente no está disponible.
 */
  private validarTabTratados(): boolean | undefined {
    if (!this.tratados || !this.tratados.validarFormulario) {
      return undefined;
    }

    const ESVALIDO = this.tratados.validarFormulario();
    if (!ESVALIDO) {
      this.seleccionaTab(2);
      return false;
    }

    this.seleccionaTab(3);
    return true;
  }

  /**
   * @method validarTabMercancia
   * @description
   * Valida el formulario del tab de **Mercancía**.  
   * Si el formulario no es válido, se mantiene en el tab actual; si es válido, avanza al siguiente.
   * @returns {boolean | undefined} `true` si es válido, `false` si es inválido, `undefined` si el componente no está disponible.
   */
  private validarTabMercancia(): boolean | undefined {
    if (!this.mercancia || !this.mercancia.validarFormularioMercancia) {
      return undefined;
    }

    const ESVALIDO = this.mercancia.validarFormularioMercancia();
    if (!ESVALIDO) {
      this.seleccionaTab(3);
      return false;
    }

    this.seleccionaTab(4);
    return true;
  }

  /**
   * @method validarTabDatosAdicionales
   * @description
   * Valida el formulario del tab de **Datos Adicionales**.  
   * Si la validación falla, se mantiene en el mismo tab; en caso contrario, finaliza la validación del flujo.
   * @returns {boolean | undefined} `true` si es válido, `false` si es inválido, `undefined` si el componente no está disponible.
   */
  private validarTabDatosAdicionales(): boolean | undefined {
    if (!this.datosAdicionales || !this.datosAdicionales.validarFormularioAdicionales) {
      return undefined;
    }

    const ESVALIDO = this.datosAdicionales.validarFormularioAdicionales();
    if (!ESVALIDO) {
      this.seleccionaTab(4);
      return false;
    }

    const ULTIMO_TAB = this.getTotalTabs();
     if (ULTIMO_TAB === 5) {
      this.seleccionaTab(5);
      return true;
    }
    if (ULTIMO_TAB === 4) {
      const VALIDACION_TODOS_TABS = this.validacionFormularios(true);
     return VALIDACION_TODOS_TABS;
    }    
    return true;
  }

  /**
 * @method validarTabProcesos
 * @description
 * Valida el contenido del tab de **Procesos**.  
 * Actualmente no realiza validaciones adicionales, pero puede ampliarse en el futuro.
 * @returns {boolean} Retorna `true` indicando que el tab es válido.
 */
  private validarTabProcesos(): boolean {
   const ULTIMO_TAB = this.getTotalTabs();
    if (ULTIMO_TAB === 5) {
     return this.validacionFormularios();
    }
    return true;
  }


  /**
 * @method getTotalTabs
 * @description
 * Retorna el número total de tabs activos según el estado actual del trámite.
 * Si `tab_procesos` es `true`, se añade un tab adicional.
 * @returns {number} Número total de tabs habilitados.
 */
  private getTotalTabs(): number {
    return this.solicitudeState?.tab_procesos ? 5 : 4;
  }

  /**
   * @method validacionFormularios
   * @description
   * Realiza la validación completa de los formularios del trámite.
   * Verifica el estado de validación de múltiples tabs y ejecuta acciones según el resultado.
   * Si todas las validaciones son exitosas y el control de peticiones está activo, guarda la solicitud completa.
   * @returns {boolean} Retorna `true` si todas las validaciones son exitosas, `false` en caso contrario.
   */
  private validacionFormularios(ignorarProcesos: boolean = false): boolean {
    if(this.solicitudeState.validacion_formularios.validacion_tab_tratados_otras_inmstancias === false ||
       this.solicitudeState.validacion_formularios.validacion_tab_mercancia === false ||
        this.solicitudeState.validacion_formularios.validacion_tab_datos_adicionales === false ||
         (!ignorarProcesos && this.solicitudeState.proceso_seleccionado.length === 0)){
          return false;
    }
    
    return true;
  }

  /**
   * @method descripcionesAdicionales
   * @description
   * Activa las descripciones adicionales utilizando los datos de validación de solicitud.
   * @param {Mercancia} data - Datos de validación de la solicitud.
   * @returns {void}
   */
  public descripcionesAdicionales(data: Mercancia): void {
    this.datosAdicionales.activarDescripciones(data);
  }

 
  
  /**
   * Método del ciclo de vida que se llama cuando el componente es destruido.
   * Emite un valor y completa el subject `destroyNotifier$` para notificar a cualquier suscripción
   * que debe limpiar recursos y prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }


}
