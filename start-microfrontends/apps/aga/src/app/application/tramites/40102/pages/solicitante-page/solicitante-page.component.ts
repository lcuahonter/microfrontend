
/**
 * Componente Angular para la gestión de la página de solicitante del trámite 40102.
 *
 * Este archivo contiene la implementación del componente principal que maneja
 * la navegación del wizard, la gestión de estado y las interacciones del usuario
 * para el proceso de solicitud de choferes nacionales. El componente coordina
 * la comunicación entre los servicios de store, query y los componentes hijo
 * del wizard.
 *
 * @file solicitante-page.component.ts
 * @author Sistema de Gestión de Trámites - Angular Team
 * @version 1.0.0
 * @since 1.0.0
 */

import {
  Chofer40102Store,
  Choferesnacionales40102State,
} from '../../estados/chofer40102.store';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chofer40102Query } from '../../estados/chofer40102.query';

import { ConsultaioState, DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';
import { SECCIONES_TRAMITE_40102 } from '../../constants/solicitud.enums';
import { Subject } from 'rxjs';
import { WizardComponent } from '@ng-mf/data-access-user';

import { takeUntil } from 'rxjs/operators';

import { DocumentoDetalle, IniciarResponse } from '../../../40101/pages/solicitante-page/solicitante-page.component';

import { modificarTerrestreService } from '../../components/services/modificacar-terrestre.service';

import { BodyTablaResolucion } from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';

import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
/**
 * Interfaz que define la estructura de un objeto de acción de botón para la navegación del wizard.
 *
 * Esta interfaz especifica los datos necesarios para manejar las acciones de navegación
 * en el wizard del trámite 40102, incluyendo el tipo de acción a realizar y el valor
 * del índice del paso de destino.
 *
 * @interface AccionBoton
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // Ejemplo de uso para continuar al siguiente paso
 * const accionContinuar: AccionBoton = {
 *   accion: 'cont',
 *   valor: 2
 * };
 *
 * // Ejemplo de uso para retroceder al paso anterior
 * const accionRetroceder: AccionBoton = {
 *   accion: 'prev',
 *   valor: 1
 * };
 * ```
 */
interface AccionBoton {
  /**
   * @property {string} accion
   * Tipo de acción a realizar en el wizard.
   * Define el comportamiento de navegación que se ejecutará:
   * - 'cont': Continuar al siguiente paso
   * - Cualquier otro valor: Retroceder al paso anterior
   */
  accion: string;

  /**
   * @property {number} valor
   * Valor numérico del índice del paso de destino.
   * Representa el número del paso al cual se desea navegar en el wizard.
   * El valor debe estar dentro del rango válido (1-5) para que la navegación
   * sea ejecutada correctamente.
   */
  valor: number;
}

/**
 * Componente principal para la página de solicitante del trámite 40102.
 *
 * Este componente maneja la interfaz de usuario y la lógica de negocio
 * para el proceso de solicitud de choferes nacionales. Implementa un
 * wizard de múltiples pasos que guía al usuario a través del proceso
 * de captura de datos y firma de solicitud.
 *
 * El componente coordina la comunicación entre:
 * - Store y Query services para gestión de estado
 * - Componente hijo WizardComponent para navegación
 * - Estado de secciones y formularios del trámite
 *
 * @class SolicitantePageComponent
 * @implements {OnInit} - Para inicialización del componente
 * @implements {OnDestroy} - Para limpieza de recursos
 *
 * @example
 * ```typescript
 * // Uso en template HTML
 * <app-solicitante-page></app-solicitante-page>
 *
 * // Acceso a métodos públicos
 * const component = new SolicitantePageComponent(query, store);
 * component.seleccionadosTodos(2);
 * component.getValorIndice({ accion: 'cont', valor: 3 });
 * ```
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@Component({
  selector: 'app-solicitante-page',
  templateUrl: './solicitante-page.component.html',
  styleUrl: './solicitante-page.component.scss',
})
export class SolicitantePageComponent implements OnInit, OnDestroy {
  /**
   * Lista de pasos del wizard que se mostrarán en la página.
   *
   * Esta propiedad contiene los pasos específicos del trámite 40102,
   * limitados a los primeros 2 pasos del wizard completo. Los pasos
   * incluyen 'Capturar solicitud' y 'Firmar solicitud'.
   *
   * @type {Array<ListaPasosWizard>}
   * @memberof SolicitantePageComponent
   * @public
   *
   * @example
   * ```typescript
   * // Estructura de cada paso
   * {
   *   indice: 1,
   *   titulo: 'Capturar solicitud',
   *   activo: true,
   *   completado: false
   * }
   * ```
   */
  pasos: Array<ListaPasosWizard> = PASOS.slice(0, 2);

  isExtrajero: boolean = false
  isBtnShow: string = "yes"
  catErrorMessage: string = ""
  isCaat: boolean = false
  documentDetails: DocumentoDetalle = {};
  acuseDocumentos: BodyTablaResolucion[] = [];

  guardarDatos: ConsultaioState = {
    folioTramite: '',
    procedureId: '',
    parameter: '',
    department: '',
    tipoDeTramite: '',
    estadoDeTramite: '',
    readonly: false,
    create: true,
    update: false,
    consultaioSolicitante: null,
    action_id: '',
    current_user: '',
    id_solicitud: '',
    nombre_pagina: '',
    idSolicitudSeleccionada: ''
  };

  /**
  * Clase CSS para mostrar una alerta de información.
  */
  public info = 'alert-info';
  /**
   * Índice actual del paso en el wizard.
   *
   * Representa el paso activo en el proceso del wizard. Se utiliza
   * para controlar la navegación y mostrar el contenido apropiado
   * en cada etapa del proceso.
   *
   * @type {number}
   * @memberof SolicitantePageComponent
   * @public
   * @default 1
   *
   * @example
   * ```typescript
   * // Cambiar al paso 2
   * this.indice = 2;
   *
   * // Verificar paso actual
   * if (this.indice === 1) {
   *   // Lógica para el primer paso
   * }
   * ```
   */
  indice: number = 1;

  /**
   * Estado de la sección actual del trámite.
   *
   * Contiene la información del estado de las secciones del trámite
   * obtenida del store. Incluye datos sobre pasos completados,
   * formularios válidos y estado general del proceso.
   *
   * @type {Choferesnacionales40102State}
   * @memberof SolicitantePageComponent
   * @public
   *
   * @example
   * ```typescript
   * // Acceder al estado de la sección
   * if (this.seccion.currentStep > 1) {
   *   // El usuario ha avanzado en el proceso
   * }
   * ```
   */
  public seccion!: Choferesnacionales40102State;
  isLoading: boolean = false;

  /**
   * Observable utilizado para manejar la limpieza de recursos al destruir el componente.
   *
   * Este Subject se utiliza con el operador takeUntil para completar
   * automáticamente las suscripciones cuando el componente se destruye,
   * evitando memory leaks.
   *
   * @type {Subject<void>}
   * @memberof SolicitantePageComponent
   * @private
   *
   * @example
   * ```typescript
   * // Uso con takeUntil para limpieza automática
   * this.chofer40102Query.selectSeccionState$
   *   .pipe(takeUntil(this.destroyNotifier$))
   *   .subscribe();
   * ```
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al componente hijo WizardComponent dentro de la plantilla.
   *
   * Permite acceder a las propiedades y métodos públicos del componente
   * hijo WizardComponent para controlar la navegación del wizard desde
   * el componente padre.
   *
   * @type {WizardComponent}
   * @memberof SolicitantePageComponent
   * @decorator @ViewChild
   * @public
   *
   * @example
   * ```typescript
   * // Navegar al siguiente paso
   * this.wizardComponent.siguiente();
   *
   * // Retroceder al paso anterior
   * this.wizardComponent.atras();
   * ```
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Datos relacionados con los pasos del wizard.
   *
   * Contiene la configuración y textos del wizard incluyendo el número
   * total de pasos, el índice actual y los textos de los botones de
   * navegación.
   *
   * @type {DatosPasos}
   * @memberof SolicitantePageComponent
   * @public
   *
   * @example
   * ```typescript
   * // Estructura del objeto DatosPasos
   * {
   *   nroPasos: 2,
   *   indice: 1,
   *   txtBtnAnt: 'Anterior',
   *   txtBtnSig: 'Continuar'
   * }
   * ```
   */
  datosPasos: DatosPasos = {
    /**
     * @property {number} nroPasos
     * Número total de pasos en el wizard.
     */
    nroPasos: this.pasos.length,

    /**
     * @property {number} indice
     * Índice actual del paso.
     */
    indice: this.indice,

    /**
     * @property {string} txtBtnAnt
     * Texto del botón para retroceder.
     */
    txtBtnAnt: 'Anterior',

    /**
     * @property {string} txtBtnSig
     * Texto del botón para continuar.
     */
    txtBtnSig: 'Continuar',
  };

  /**
   * Constructor del componente SolicitantePageComponent.
   *
   * Inicializa las dependencias necesarias mediante inyección de dependencias
   * de Angular. Los servicios inyectados permiten al componente interactuar
   * con el estado de la aplicación y realizar consultas de datos.
   *
   * @constructor
   * @param {Chofer40102Query} chofer40102Query - Servicio para consultar el estado del store
   * @param {Chofer40102Store} chofer40102Store - Servicio para manejar el estado del store
   *
   * @example
   * ```typescript
   * // Angular se encarga de la inyección automáticamente
   * // No es necesario llamar al constructor manualmente
   * ```
   *
   * @since 1.0.0
   */
  constructor(
    private chofer40102Query: Chofer40102Query,
    private chofer40102Store: Chofer40102Store,
    private modificarTerrestreService: modificarTerrestreService,
    private NOTIF: NotificacionesService
  ) { }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * Realiza las siguientes operaciones de inicialización:
   * 1. Configura los pasos del wizard específicos para el trámite
   * 2. Establece la suscripción al estado de la sección
   * 3. Asigna las secciones iniciales al store
   *
   * @method ngOnInit
   * @memberof SolicitantePageComponent
   * @implements {OnInit}
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Este método se ejecuta automáticamente por Angular
   * // No es necesario llamarlo manualmente
   *
   * // La inicialización incluye:
   * // - Configuración de pasos personalizados
   * // - Suscripción a cambios de estado
   * // - Configuración inicial del store
   * ```
   *
   * @since 1.0.0
   */
  ngOnInit(): void {
    this.pasos = PASOS.slice(0, 2).map((paso) => {
      if (paso.indice === 2 && paso.titulo === 'Anexar necesarios') {
        return { ...paso, titulo: 'Firmar solicitud' };
      }
      return paso;
    });

    

    this.chofer40102Query.selectSeccionState$.pipe(takeUntil(this.destroyNotifier$)).subscribe((data: Choferesnacionales40102State) => {
      this.isCaat = data.codigo !== '00' ? true : false;
      this.catErrorMessage = data.catErrorMessage;
    });

    this.asignarSecciones();

  }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   *
   * Realiza la limpieza necesaria de recursos para evitar memory leaks:
   * 1. Emite una señal a través del destroyNotifier$
   * 2. Completa el Subject para finalizar todas las suscripciones
   *
   * @method ngOnDestroy
   * @memberof SolicitantePageComponent
   * @implements {OnDestroy}
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Este método se ejecuta automáticamente por Angular
   * // cuando el componente se destruye
   *
   * // Asegura que todas las suscripciones se completen
   * // y se liberen los recursos
   * ```
   *
   * @since 1.0.0
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Cambia el índice actual del wizard al valor proporcionado.
   *
   * Este método permite saltar directamente a un paso específico
   * del wizard sin seguir la navegación secuencial. Útil para
   * navegación directa desde elementos de la interfaz como
   * breadcrumbs o menús de pasos.
   *
   * @method seleccionadosTodos
   * @memberof SolicitantePageComponent
   * @public
   * @param {number} i - Índice del paso seleccionado (1-based)
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Saltar al paso 2
   * this.seleccionadosTodos(2);
   *
   * // Volver al paso 1
   * this.seleccionadosTodos(1);
   *
   * // Uso desde template
   * <button (click)="seleccionadosTodos(2)">Ir al paso 2</button>
   * ```
   *
   * @since 1.0.0
   */
  seleccionadosTodos(i: number): void {
    this.indice = i;
  }

  /**
   * Cambia el índice actual del wizard basado en la acción del botón.
   *
   * Este método procesa las acciones de navegación del wizard,
   * validando el rango del valor y ejecutando la navegación
   * apropiada (adelante o atrás) según la acción especificada.
   *
   * Validaciones realizadas:
   * - El valor debe estar entre 1 y 5 (inclusive)
   * - Si la acción es 'cont', navega hacia adelante
   * - Para cualquier otra acción, navega hacia atrás
   *
   * @method getValorIndice
   * @memberof SolicitantePageComponent
   * @public
   * @param {AccionBoton} e - Objeto que contiene la acción y el valor del índice
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Continuar al paso 2
   * this.getValorIndice({ accion: 'cont', valor: 2 });
   *
   * // Retroceder al paso 1
   * this.getValorIndice({ accion: 'prev', valor: 1 });
   *
   * // Uso desde template con evento
   * <button (click)="getValorIndice({accion: 'cont', valor: 3})">
   *   Continuar
   * </button>
   * ```
   *
   * @since 1.0.0
   */
  getValorIndice(e: AccionBoton): void {
    if (e.accion === 'cont' && e.valor === 2) {
      this.isLoading = true
      const IDPERSONASOLICITUD = this.chofer40102Store?.getValue().IdPersonaSolicitud
      const SOLICITUDEID = 123
      const PAYLOAD = {
        id_solicitud: SOLICITUDEID,
        representacion_federa: {
          cve_entidad_federativa: "DGO",
          cve_unidad_administrativa: "1016"
        },
        representante_legal: {
          id_persona_solicitud: IDPERSONASOLICITUD,
          nombre: this.chofer40102Query?.getValue().nombre ? this.chofer40102Query?.getValue().nombre : '',
          ap_paterno: this.chofer40102Query?.getValue().primerApellido ? this.chofer40102Query?.getValue().primerApellido : '',
          ap_materno: this.chofer40102Query?.getValue().segundoApellido ? this.chofer40102Query?.getValue().segundoApellido : '',
        }
      }
      this.modificarTerrestreService.guardarDatosTramite(PAYLOAD).subscribe((res: IniciarResponse) => {
        this.isLoading = false;
        this.manejarRespuestaGuardarTramite(res, e);
      });

    } else {
      if (e.valor > 0 && e.valor < 6) {
        this.indice = e.valor;
        if (e.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
        }
      }
    }
  }

  /**
   * Maneja la respuesta del servicio `guardarDatosTramite`.
   *
   * Este método procesa la respuesta del backend después de intentar guardar
   * los datos del trámite. Se encarga de mostrar notificaciones de error,
   * actualizar el estado del store con la información de la respuesta (cadena original,
   * ID de solicitud), y gestionar la navegación del wizard según el resultado
   * y si el solicitante es extranjero.
   *
   * @method manejarRespuestaGuardarTramite
   * @private
   * @param {IniciarResponse} res - La respuesta recibida del servicio de guardar datos.
   * @param {AccionBoton} e - El objeto de acción del botón que desencadenó la llamada.
   * @returns {void}
   *
   * @since 1.0.0
   */
  private manejarRespuestaGuardarTramite(res: IniciarResponse, e: AccionBoton): void {
    if (res.codigo !== '00') {
      this.NOTIF.showNotification({
        tipoNotificacion: 'toastr',
        categoria: 'danger',
        mensaje: res.mensaje ? res.mensaje : '',
        titulo: 'Error',
        modo: '',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      });
    }

    (this.chofer40102Store['setCadenaOriginal'] as (valor: unknown) => void)(res?.datos?.cadena_original ?? '');
    (this.chofer40102Store['setSolicitudeId'] as (valor: unknown) => void)(res?.datos?.id_solicitud);
    this.isExtrajero = res?.datos?.is_extranjero ?? false
    this.documentDetails = res?.datos?.documento_detalle ?? {}
    this.acuseDocumentos = [
      {
        id: 1,
        idDocumento: res?.datos?.cve_folio_caat ?? '',
        documento: res?.datos?.documento_detalle?.nombre_archivo ?? '',
        urlPdf: res?.datos?.documento_detalle?.nombre_archivo ?? '', // para mostrar o descargar nombre
        fullBase64: res?.datos?.documento_detalle?.contenido ?? '' // <--- Base64 del backend aquí
      }
    ];

    this.guardarDatos = {
      ...this.guardarDatos,
      folioTramite: res?.datos?.mensaje ?? '',
      procedureId: (res?.datos?.id_solicitud ?? 0).toString()
    };

    if (this.isExtrajero) {
      this.isBtnShow = 'no'
      this.pasos = PASOS.slice(0, 1)
    }
    if (!this.isExtrajero) {
      if (res.codigo === '00') {
        if (e.valor > 0 && e.valor < 6) {
          this.indice = e.valor;
          this.wizardComponent.siguiente();
        }
      }
    }
  }

  /**
   * Método privado para asignar las secciones existentes al store.
   *
   * Inicializa el estado de las secciones del trámite en el store,
   * configurando arrays de secciones y validez de formularios
   * basados en las constantes definidas para el trámite 40102.
   *
   * Operaciones realizadas:
   * 1. Crea arrays para secciones y validez de formularios
   * 2. Itera sobre las llaves de sección del paso 1
   * 3. Asigna los valores al store mediante los métodos correspondientes
   *
   * @method asignarSecciones
   * @memberof SolicitantePageComponent
   * @private
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Este método se llama internamente durante ngOnInit
   * // No debe ser llamado directamente desde fuera del componente
   *
   * // Inicializa el estado del store con:
   * // - Array de secciones basado en SECCIONES_TRAMITE_40102.PASO_1
   * // - Array de validez de formularios (inicialmente false)
   * ```
   *
   * @since 1.0.0
   */
  private asignarSecciones(): void {
    /**
     * @constant {boolean[]} SECCIONES
     * Array que contiene el estado de las secciones del trámite.
     */
    const SECCIONES: boolean[] = [];

    /**
     * @constant {boolean[]} FORMA_VALIDA
     * Array que contiene el estado de validez de los formularios.
     */
    const FORMA_VALIDA: boolean[] = [];

    for (const LLAVE_SECCION of Object.keys(
      SECCIONES_TRAMITE_40102.PASO_1
    ) as Array<keyof typeof SECCIONES_TRAMITE_40102.PASO_1>) {
      SECCIONES.push(SECCIONES_TRAMITE_40102.PASO_1[LLAVE_SECCION]);
      FORMA_VALIDA.push(false);
    }

    this.chofer40102Store.establecerSeccion(SECCIONES);
    this.chofer40102Store.establecerFormaValida(FORMA_VALIDA);
  }
}
