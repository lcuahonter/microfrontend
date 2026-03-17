/**
 * Componente principal para el registro CAAT Naviero en el trámite 40301.
 *
 * Este archivo contiene el componente Angular que gestiona el proceso de registro del
 * Certificado de Autorización de Agente de Transporte (CAAT) para operadores navieros.
 * Implementa un wizard de pasos múltiples que guía al usuario a través del proceso
 * de registro, validación y documentación requerida para obtener la autorización.
 *
 * El componente maneja:
 * - Navegación entre pasos del wizard de registro
 * - Gestión del estado de las secciones del formulario
 * - Validación de formularios por pasos
 * - Interacción con modales y componentes hijos
 * - Control del flujo de navegación y botones de acción
 *
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module RegistroCaatNavieroPageComponent
 */

import { AGENT_CATALOG, ApiErrorCode, CAAT_NAVIERO_PASOS, ERROR_MESSAGES, SECCIONES_TRAMITE_40301 } from '../../enum/caat-naviero.enum';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  DatosPasos,
  ListaPasosWizard,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
  SessionQuery,
  SolicitanteQuery,
  WizardComponent
} from '@ng-mf/data-access-user';
import { IniciarSolicitudRequest, IniciarSolicitudResponse } from '../../modelos/iniciar-solicitud.model';
import { LoginQuery, Notificacion } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CapturarService } from '../../services/capturar.service';
import { GuardarSolicitudRequest } from '../../modelos/guardar-solicitud.model';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Tramite40301Query } from '../../estados/tramite40301.query';
import { Tramite40301Store } from '../../estados/tramite40301.store';
/**
 * Interfaz que define la estructura de una acción de botón en el componente.
 *
 * Esta interfaz especifica el contrato para objetos que representan acciones
 * ejecutadas por botones en la interfaz del wizard. Define el tipo de acción
 * a realizar y el valor numérico asociado para la navegación entre pasos.
 *
 * @interface AccionBoton
 *
 * @example
 * ```typescript
 * const accion: AccionBoton = {
 *   accion: 'cont',  // o 'prev' para retroceder
 *   valor: 2         // índice del paso objetivo
 * };
 * ```
 *
 * @since 1.0.0
 */
interface AccionBoton {
  /**
   * @property {string} accion
   * Tipo de acción a ejecutar ('cont' para continuar, 'prev' para retroceder).
   */
  accion: string;

  /**
   * @property {number} valor
   * Valor numérico que indica el índice del paso objetivo.
   */
  valor: number;
}

/**
 * Componente Angular para el registro de CAAT Naviero en el trámite 40301.
 *
 * Este componente implementa un wizard multi-paso para el proceso de registro del
 * Certificado de Autorización de Agente de Transporte (CAAT) específico para
 * operadores navieros. Gestiona la navegación entre pasos, validación de formularios,
 * y el estado de las secciones del trámite utilizando el patrón de gestión de estado.
 *
 * Características principales:
 * - Wizard de navegación con pasos secuenciales
 * - Gestión de estado reactiva con RxJS
 * - Validación de formularios por secciones
 * - Integración con componentes de wizard y pasos específicos
 * - Control de visibilidad de modales según el paso actual
 * - Manejo del ciclo de vida del componente con cleanup automático
 *
 * @component
 * @implements {OnInit, OnDestroy}
 * 
 * @example
 * ```html
 * <app-registro-caat-naviero-page></app-registro-caat-naviero-page>
 * ```
 *
 * @since 1.0.0
 */
@Component({
  templateUrl: './registro-caat-naviero-page.component.html',
  styles: ``,
})

export class RegistroCaatNavieroPageComponent implements OnInit, OnDestroy {
  /**
   * Configuración de pasos del wizard para el proceso CAAT Naviero.
   *
   * Array que contiene la definición de todos los pasos necesarios para completar
   * el registro del Certificado de Autorización de Agente de Transporte para
   * operadores navieros. Cada paso incluye información sobre su estado, título,
   * y configuración de navegación.
   *
   * @property {ListaPasosWizard[]} pasos
   * @readonly
   * 
   * @example
   * ```typescript
   * // Los pasos se inicializan desde la configuración predefinida:
   * // [
   * //   { indice: 1, titulo: 'Datos Generales', activo: true, completado: false },
   * //   { indice: 2, titulo: 'Documentación', activo: false, completado: false },
   * //   ...
   * // ]
   * ```
   *
   * @since 1.0.0
   */
  pasos: ListaPasosWizard[] = CAAT_NAVIERO_PASOS;
  nuevaNotificacion!: Notificacion;
  tieneTramiteActivo = false;

  /**
   * Índice del paso actualmente activo en el wizard.
   *
   * Representa la posición actual del usuario dentro del flujo de pasos del
   * wizard de registro CAAT Naviero. Se utiliza para controlar la navegación,
   * mostrar el contenido apropiado y gestionar la visibilidad de elementos
   * específicos según el paso actual.
   *
   * @property {number} indice
   * @default 1
   * 
   * @example
   * ```typescript
   * // Navegar al paso 2
   * this.indice = 2;
   * 
   * // Verificar si estamos en el primer paso
   * if (this.indice === 1) {
   *   // Lógica específica del primer paso
   * }
   * ```
   *
   * @since 1.0.0
   */
  indice: number = 1;

  /**
   * Controla la visibilidad del botón para abrir modales específicos.
   *
   * Esta propiedad determina cuándo se debe mostrar el botón que permite al usuario
   * abrir modales adicionales durante el proceso de registro. La visibilidad está
   * condicionada al paso actual del wizard, mostrándose únicamente cuando es
   * relevante para la funcionalidad del paso específico.
   *
   * @property {boolean} mostrarBotonParaModal
   * @default false
   * 
   * @example
   * ```typescript
   * // Se activa automáticamente en el paso 2
   * if (this.indice === 2) {
   *   this.mostrarBotonParaModal = true;
   * }
   * ```
   *
   * @since 1.0.0
   */
  mostrarBotonParaModal: boolean = false;

  /**
   * Configuración de datos para la navegación del wizard.
   *
   * Objeto que contiene toda la información necesaria para configurar y controlar
   * la navegación del wizard, incluyendo el número total de pasos, el índice actual,
   * y los textos de los botones de navegación. Esta configuración se pasa al
   * componente wizard para su funcionamiento correcto.
   *
   * @property {DatosPasos} datosPasos
   * 
   * @example
   * ```typescript
   * // Configuración típica del wizard:
   * {
   *   nroPasos: 4,           // Total de pasos en el proceso
   *   indice: 1,             // Paso actual
   *   txtBtnAnt: 'Anterior', // Texto del botón retroceder
   *   txtBtnSig: 'Continuar' // Texto del botón avanzar
   * }
   * ```
   *
   * @since 1.0.0
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  
  /**
   * Objeto que almacena la acción actual ejecutada por botones del wizard.
   *
   * Esta propiedad mantiene la información sobre la última acción de botón
   * ejecutada en el wizard, incluyendo el tipo de acción (continuar o retroceder)
   * y el valor del índice objetivo. Se utiliza para coordinar la navegación
   * entre diferentes componentes del wizard.
   *
   * @property {AccionBoton} accionBoton
   * 
   * @example
   * ```typescript
   * // Ejemplo de acción para avanzar al paso 2:
   * this.accionBoton = {
   *   accion: 'cont',
   *   valor: 2
   * };
   * 
   * // Ejemplo de acción para retroceder al paso 1:
   * this.accionBoton = {
   *   accion: 'prev',
   *   valor: 1
   * };
   * ```
   *
   * @since 1.0.0
   */
  accionBoton!: AccionBoton;

  /**
   * Estado actual de las secciones del trámite 40301.
   *
   * Esta propiedad almacena el estado completo de todas las secciones del
   * trámite, incluyendo información sobre validación, completitud y progreso
   * de cada sección. Se actualiza reactivamente a través de suscripciones
   * al store de secciones y se utiliza para coordinar la navegación y
   * validación del wizard.
   *
   * @property {SeccionLibState} seccion
   * 
   * @example
   * ```typescript
   * // El estado incluye información como:
   * // {
   * //   secciones: [true, false, false],  // Estados de cada sección
   * //   formasValidas: [true, false, false], // Validez de formularios
   * //   paso: 1,                          // Paso actual
   * //   completado: false                 // Estado general
   * // }
   * ```
   *
   * @since 1.0.0
   */
  public seccion!: SeccionLibState;

  /**
   * Subject para gestionar la destrucción de suscripciones RxJS.
   *
   * Este Subject se utiliza como notificador para cancelar automáticamente todas
   * las suscripciones activas cuando el componente es destruido, implementando
   * el patrón takeUntil para prevenir fugas de memoria y efectos secundarios
   * después de la destrucción del componente.
   *
   * @private
   * @property {Subject<void>} destroyNotifier$
   * 
   * @example
   * ```typescript
   * // Uso típico en suscripciones:
   * this.seccionQuery.selectSeccionState$
   *   .pipe(takeUntil(this.destroyNotifier$))
   *   .subscribe(data => {
   *     // Lógica de suscripción
   *   });
   * ```
   *
   * @since 1.0.0
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al componente hijo WizardComponent.
   *
   * Esta referencia permite la interacción directa con el componente wizard
   * desde el componente padre, habilitando el control programático de la
   * navegación, el acceso a métodos específicos del wizard, y la coordinación
   * entre la lógica del componente padre y la funcionalidad del wizard.
   *
   * @viewChild
   * @property {WizardComponent} wizardComponent
   * 
   * @example
   * ```typescript
   * // Navegar programáticamente en el wizard:
   * this.wizardComponent.siguiente();  // Avanzar al siguiente paso
   * this.wizardComponent.atras();      // Retroceder al paso anterior
   * 
   * // Acceder a propiedades del wizard:
   * const pasoActual = this.wizardComponent.pasoActual;
   * ```
   *
   * @since 1.0.0
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente hijo PasoUnoComponent.
   *
   * Esta referencia proporciona acceso directo al primer paso del wizard,
   * permitiendo la interacción con sus métodos y propiedades específicas
   * desde el componente padre. Se utiliza para coordinar validaciones,
   * obtener datos del formulario del primer paso, y ejecutar acciones
   * específicas relacionadas con el paso inicial del proceso.
   *
   * @viewChild
   * @property {PasoUnoComponent} pasoUnoComponent
   * 
   * @example
   * ```typescript
   * // Validar el primer paso:
   * const esValido = this.pasoUnoComponent.validarFormulario();
   * 
   * // Obtener datos del primer paso:
   * const datosFormulario = this.pasoUnoComponent.obtenerDatos();
   * 
   * // Resetear el formulario del primer paso:
   * this.pasoUnoComponent.limpiarFormulario();
   * ```
   *
   * @since 1.0.0
   */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;


  public storeData$ = this.tramite40301Query.select();

  /**
   * Constructor del componente de registro CAAT Naviero.
   *
   * Inyecta las dependencias necesarias para la gestión del estado de las secciones
   * del trámite. Los servicios inyectados proporcionan funcionalidad para consultar
   * y actualizar el estado de las secciones, implementando el patrón de gestión
   * de estado reactivo para coordinar la navegación y validación del wizard.
   *
   * @constructor
   * @param {SeccionLibQuery} seccionQuery - Servicio para consultar el estado reactivo de las secciones
   * @param {SeccionLibStore} seccionStore - Servicio para actualizar y gestionar el estado de las secciones
   * 
   * @example
   * ```typescript
   * // Los servicios se inyectan automáticamente por Angular:
   * // - seccionQuery: Para obtener estado actual y suscribirse a cambios
   * // - seccionStore: Para actualizar estado de secciones y validaciones
   * ```
   *
   * @since 1.0.0
   */
  constructor(
    private tramiteService: CapturarService,
    private tramiteStore: Tramite40301Store,
    private tramite40301Query: Tramite40301Query,
    private solicitanteQuery: SolicitanteQuery,    
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    private route: ActivatedRoute,
    private sessionQuery: SessionQuery,
    private loginQuery: LoginQuery    
  ) {
    // El constructor está intencionalmente vacío para la inyección de dependencias 
  }

  /**
   * Método del ciclo de vida Angular que se ejecuta al inicializar el componente.
   *
   * Este método configura las suscripciones necesarias para el funcionamiento reactivo
   * del componente, incluyendo la suscripción al estado de las secciones del trámite
   * y la inicialización de la configuración de secciones. Utiliza el patrón takeUntil
   * para garantizar la limpieza automática de suscripciones al destruir el componente.
   *
   * Operaciones realizadas:
   * - Suscripción reactiva al estado de las secciones del trámite
   * - Mapeo del estado de secciones a la propiedad local del componente
   * - Inicialización de las secciones predeterminadas del trámite 40301
   * - Configuración de validaciones iniciales de formularios
   * - Habilitación del botón 'Continuar' por defecto estableciendo todas las secciones como válidas
   *
   * @method ngOnInit
   * @implements {OnInit}
   * 
   * @example
   * ```typescript
   * - Se ejecuta automáticamente por Angular después del constructor:
   * - 1. Se establece la suscripción al estado de secciones
   * - 2. Se asignan las secciones iniciales del trámite
   * - 3. Se configuran las validaciones por defecto
   * - 4. Se habilita el botón 'Continuar' por defecto:
   * this.asignarSecciones();
   * const secciones = Object.values(SECCIONES_TRAMITE_40301.PASO_1);
   * this.seccionStore.establecerFormaValida(secciones.map(() => true));
   * ```
   *
   * @since 1.0.0
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();

    this.asignarSecciones();
    const SECCIONES = Object.values(SECCIONES_TRAMITE_40301.PASO_1);
    this.seccionStore.establecerFormaValida(SECCIONES.map(() => true));
    this.validarTramitesPendientes();
  }

  /**
   * Método para asignar y configurar las secciones iniciales del trámite 40301.
   *
   * Este método inicializa la configuración de secciones del primer paso del trámite
   * CAAT Naviero, estableciendo tanto las secciones disponibles como su estado de
   * validación inicial. Todas las secciones se marcan como no válidas por defecto,
   * requiriendo que el usuario complete los formularios correspondientes.
   *
   * Proceso de configuración:
   * - Extrae las secciones predefinidas del enum SECCIONES_TRAMITE_40301.PASO_1
   * - Genera un array de estados de validación (todos false inicialmente)
   * - Actualiza el store con las secciones y sus estados de validación
   * - Prepara el componente para la gestión reactiva del estado
   *
   * @method asignarSecciones
   * @private
   * 
   * @example
   * ```typescript
   * // Configuración típica resultante:
   * // SECCIONES: [true, true, true]        // Secciones disponibles
   * // FORM_VALIDA: [false, false, false]   // Estados de validación inicial
   * 
   * // El store se actualiza con:
   * // - Lista de secciones habilitadas
   * // - Estados de validación de formularios por sección
   * ```
   *
   * @since 1.0.0
   */
  asignarSecciones(): void {
    const SECCIONES: boolean[] = Object.values(SECCIONES_TRAMITE_40301.PASO_1);
    const FORM_VALIDA: boolean[] = [];
    
    for (const LLAVE_SECCIONE in SECCIONES_TRAMITE_40301.PASO_1) {
      if (LLAVE_SECCIONE) {
        FORM_VALIDA.push(false);
      }
    }
    this.seccionStore.establecerSeccion(SECCIONES);
    this.seccionStore.establecerFormaValida(FORM_VALIDA);
  }

  /**
   * Cambia la pestaña activa al índice proporcionado.
   * 
   * @param {number} i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Actualiza el índice en base al valor y ejecuta acciones de navegación.
   * 
   * @param {AccionBoton} e - Objeto que contiene la acción y el valor del botón.
   */
  getValorIndice(e: AccionBoton): void {

    if(this.indice === 1 && e.accion === 'cont'){
      const ES_VALIDO = this.pasoUnoComponent.validarFormulario();
      if(!ES_VALIDO){
        return;
      }
      this.ejecutarPostGuardar(e);
      return;
    }    

    if (e.valor > 0 && e.valor < 2) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  
 /**
 * Ejecuta la lógica de negocio posterior al guardado de la solicitud.
 * Orquesta la recolección de datos del formulario, la búsqueda en el catálogo de agentes
 * y la extracción del estado actual del solicitante para construir el objeto de persistencia.
 * @private
 * @param {AccionBoton} e - Objeto que contiene la información del evento del botón presionado.
 * @returns {void}
 */
  private ejecutarPostGuardar(e: AccionBoton): void {
    const DATOS_FORM = this.pasoUnoComponent.obtenerDatos();        
    const SOL_QUERY = this.solicitanteQuery.getValue();
    const TIPO_AGENTE = AGENT_CATALOG.find(a => a.id === Number(DATOS_FORM.tipoAgente))?.clave ?? '';
    
    const PAYLOAD: GuardarSolicitudRequest = {
        tipo_agente: TIPO_AGENTE,
        director_general: {
          nombre: DATOS_FORM.directorGeneralNombre ?? '',
          apellido_paterno: DATOS_FORM.primerApellido?? '',
          apellido_materno: DATOS_FORM.segundoApellido
        },
        solicitante:{
          rfc: SOL_QUERY.rfc_original,
          nombre: SOL_QUERY.nombre,
          tipo_persona: SOL_QUERY.tipo_persona
        }
    }

  this.tramiteService.guardarTramite(PAYLOAD)
    .subscribe({
      next: (res) => {   
        const ID_SOLICITUD = res.datos?.id_solicitud as number;
        this.tramiteStore.setIdSolicitud(ID_SOLICITUD);     
        this.nuevaNotificacion = {
            tipoNotificacion: 'banner',
            categoria: 'success',
            modo: 'action',
            titulo: '',
            mensaje: ERROR_MESSAGES.REGISTRO_EXITOSO(String(ID_SOLICITUD)),
            cerrar: true,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
            };
        this.procesarNavegacionExitosa(e.valor);                
      },
      error: (err) => {
        console.error("Solicitud CAAT Naviero fallo", err)
      }
    });
  }

  private procesarNavegacionExitosa(nuevoIndice: number): void {
    this.indice = nuevoIndice;
    this.wizardComponent.siguiente();
    this.actualizarDatosPasos();
  }

  /**
   * Cambia la visibilidad del botón del modal dependiendo del paso actual.
   * 
   * @param {number} event - Índice del paso actual.
   */
  pestanaCambiado(event: number): void {
    this.mostrarBotonParaModal = event === 2 ? true : false;
  }

  
  /**
   * Gancho del ciclo de vida que se llama cuando el componente es destruido.
   * Este método emite un valor al subject `destroyNotifier$` y lo completa,
   * asegurando que cualquier suscripción vinculada a este notificador se limpie
   * adecuadamente para prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

    /**
   * Ejecuta la lógica para avanzar o retroceder en el wizard después de guardar los datos.
   * @param e Objeto que contiene la acción y el valor del botón.
   */
  actualizarDatosPasos(): void {
    this.datosPasos = {
      nroPasos: this.pasos.length,
      indice: this.indice,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    };
  }  

  
  /**
   * Metodo que procesa la respuesta del api para validar si el solicitante
   * ya tiene solicitudes existentes. Muestra los mensajes de error asociados.
   *
   * @private
   * @memberof RegistroCaatNavieroPageComponent
   */
  private validarTramitesPendientes(): void {   
    const RFC_LOGIN = this.loginQuery.getValue()?.rfc;
    const PAYLOAD: IniciarSolicitudRequest = {
        rfc_solicitante: RFC_LOGIN, // Usamos el RFC que viene del flujo seguro        
    };         
      //this.cargando = true; // Iniciamos estado de carga
    this.tramiteService.iniciarTramite(PAYLOAD)        
    .subscribe({
      next: (res) => {  
        if (res.codigo === ApiErrorCode.CAAT_EXISTENTE) {
        this.tieneTramiteActivo = true;
        const RESPONSE = res.datos as IniciarSolicitudResponse;        

        this.nuevaNotificacion = {
            tipoNotificacion: 'banner',
            categoria: 'success',
            modo: 'action',
            titulo: '',
            mensaje: ERROR_MESSAGES.CAAT_EXISTENTE(RESPONSE.clave_folio_caat,RESPONSE.fecha_fin_vigencia,RESPONSE.desc_tipo_agente),
            cerrar: true,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
            };
          }
        if (res.codigo === ApiErrorCode.CAAT_TAREAS_PENDIENTES) {
        this.tieneTramiteActivo = true;
        this.nuevaNotificacion = {
            tipoNotificacion: 'banner',
            categoria: 'success',
            modo: 'action',
            titulo: '',
            mensaje: ERROR_MESSAGES.CAAT_TAREAS_PENDIENTES(),
            cerrar: true,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
            };
          }        
      },
      error: (err) => {
        console.error("Solicitud CAAT Naviero fallo", err)
      }
    });
  }
}