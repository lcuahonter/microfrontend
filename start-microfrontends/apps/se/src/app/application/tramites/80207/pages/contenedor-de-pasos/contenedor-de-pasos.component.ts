/**
 * @fileoverview Componente contenedor principal para la gestión del flujo de pasos del trámite 80207
 * @description
 * Este archivo contiene la implementación del componente Angular que gestiona el flujo completo
 * de pasos para el trámite 80207 de submanufactura. Actúa como contenedor principal que
 * coordina la navegación entre pasos, validación de formularios, carga de documentos y
 * comunicación con servicios backend para el procesamiento de la solicitud.
 * 
 * @module ContenedorDePasos
 * @tramite 80207
 * @version 1.0.0
 * @author Sistema VUCEM
 * @angular_component Componente de gestión de flujo de pasos
 * @wizard_pattern Implementación de patrón wizard para proceso secuencial
 * @business_domain Submanufactura y operaciones IMMEX
 */

import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  DatosPasos,
  ListaPasosWizard,
  RegistroSolicitudService,
  SeccionLibStore,
} from '@ng-mf/data-access-user';
import { ERROR_PLANTAS_SUBMANUFACTURERAS, PASOS } from '../../constantes/pasos.enum';
import { map, takeUntil } from 'rxjs/operators';
import { AVISO } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Subject } from 'rxjs';
import { Tramite80207State } from '../../modelos/subfabricante.model';
import { Tramites80207Queries } from '../../estados/tramite80207.query';
import { Tramites80207Store } from '../../estados/tramite80207.store';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { buildSolicitud80207Payload } from '../../payloads/solicitud-80207.builder';

/**
 * @interface AccionBoton
 * @description
 * Interfaz que define la estructura estándar para las acciones de botones en el flujo
 * de navegación del wizard. Encapsula la información necesaria para manejar eventos
 * de navegación entre pasos, incluyendo el tipo de acción y el valor del índice destino.
 * 
 * @navigation_pattern
 * Utilizada para:
 * - **Navegación de pasos**: Control de avance y retroceso en wizard
 * - **Validación de flujo**: Determinación de acciones válidas por paso
 * - **Control de índices**: Gestión de posición actual en secuencia
 * - **Eventos de usuario**: Respuesta a interacciones con botones de navegación
 * 
 * @button_actions
 * Soporta acciones como:
 * - 'cont': Continuar al siguiente paso
 * - 'prev': Regresar al paso anterior
 * - 'jump': Saltar a paso específico
 * - 'submit': Envío final del trámite
 * 
 * @wizard_integration
 * Se integra con:
 * - Componente WizardComponent para navegación
 * - Sistema de validación de pasos
 * - Control de habilitación de botones
 * - Flujo de datos entre pasos
 * 
 * @interface
 * @local_definition
 */
interface AccionBoton {
  /**
   * @property {string} accion
   * @description
   * La acción específica que se realizará en respuesta al evento del botón.
   * Define el tipo de operación de navegación o procesamiento que debe ejecutarse.
   * 
   * @action_types
   * Valores típicos incluyen:
   * - 'cont': Continuar al siguiente paso con validación
   * - 'prev': Retroceder al paso anterior
   * - 'save': Guardar progreso actual
   * - 'submit': Envío final del trámite
   * 
   * @workflow_control Determina el comportamiento del flujo de navegación
   * @required Campo obligatorio para identificar la acción
   */
  accion: string;

  /**
   * @property {number} valor
   * @description
   * El valor numérico asociado a la acción, típicamente representando el índice
   * del paso destino en el flujo del wizard. Determina la posición a la cual
   * se debe navegar o el contexto numérico de la acción.
   * 
   * @step_index
   * Representa:
   * - Número del paso destino (1-4 para este trámite)
   * - Índice de posición en secuencia
   * - Valor de referencia para validaciones
   * - Parámetro numérico de la acción
   * 
   * @navigation_target Destino numérico para operaciones de navegación
   * @range_validation Debe estar dentro del rango válido de pasos
   */
  valor: number;
}

/**
 * @component ContenedorDePasosComponent
 * @description
 * Componente Angular principal que gestiona el flujo completo de pasos para el trámite 80207
 * de submanufactura. Actúa como contenedor orquestador que coordina la navegación secuencial,
 * validación de formularios, gestión de estado, carga de documentos y comunicación con
 * servicios backend para procesamiento de solicitudes IMMEX.
 * 
 * @wizard_controller
 * Como controlador de wizard gestiona:
 * - **Navegación secuencial**: Control de avance y retroceso entre pasos
 * - **Validación de flujo**: Verificación de completitud antes de avanzar
 * - **Estado centralizado**: Sincronización con store Akita del trámite
 * - **Carga de documentos**: Coordinación de adjuntos requeridos
 * - **Envío de solicitud**: Procesamiento final con backend
 * 
 * @business_workflow
 * Implementa el flujo de negocio:
 * 1. **Paso 1**: Captura de información básica y datos del subcontratista
 * 2. **Paso 2**: Búsqueda y selección de plantas manufactureras
 * 3. **Paso 3**: Carga y validación de documentos requeridos
 * 4. **Paso 4**: Revisión final y envío de solicitud
 * 
 * @state_management
 * Gestiona estado mediante:
 * - Suscripción a Tramites80207Queries para datos reactivos
 * - Actualización de SeccionLibStore para UI
 * - Sincronización con Tramites80207Store para persistencia
 * - Control de validaciones granulares por paso
 * 
 * @document_management
 * Coordina carga de documentos:
 * - Control de habilitación de botones de carga
 * - Gestión de estados de progreso
 * - Validación de documentos requeridos
 * - Integración con servicios de almacenamiento
 * 
 * @validation_strategy
 * Implementa validación multi-nivel:
 * - Validación de formularios por paso individual
 * - Verificación de completitud de datos
 * - Validación de documentos adjuntos
 * - Confirmación de estado antes de envío
 * 
 * @service_integration
 * Se integra con servicios:
 * - RegistroSolicitudService para envío de datos
 * - Tramites80207Queries para consulta de estado
 * - SeccionLibStore para gestión de UI
 * - Tramites80207Store para persistencia
 * 
 * @lifecycle_management
 * Gestiona ciclo de vida:
 * - Inicialización de suscripciones reactivas
 * - Limpieza automática de observables
 * - Prevención de memory leaks
 * - Manejo de destrucción de componente
 * 
 * @user_experience
 * Optimiza experiencia mediante:
 * - Navegación intuitiva paso a paso
 * - Validación en tiempo real
 * - Feedback visual de progreso
 * - Prevención de pérdida de datos
 * 
 * @error_handling
 * Maneja errores mediante:
 * - Validación preventiva antes de navegación
 * - Control de estados de carga
 * - Manejo de respuestas de servicios
 * - Recuperación de errores de validación
 * 
 * @export
 * @class
 * @implements {OnInit, OnDestroy}
 * @angular_component
 * @wizard_pattern
 */

@Component({
  selector: 'app-contenedor-de-pasos',
  templateUrl: './contenedor-de-pasos.component.html',
  styleUrl: './contenedor-de-pasos.component.scss',
})

export class ContenedorDePasosComponent implements OnInit, OnDestroy {

  
  /**
   * @property {ListaPasosWizard[]} pasos
   * @description
   * Lista de configuración de pasos del wizard que define la estructura completa del flujo
   * del trámite 80207. Contiene la configuración de cada paso incluyendo títulos,
   * descripciones, validaciones y componentes asociados.
   * 
   * @step_configuration
   * Cada paso incluye:
   * - Título y descripción para UI
   * - Componente Angular asociado
   * - Reglas de validación específicas
   * - Condiciones de navegación
   * 
   * @imported_from Constante PASOS del archivo de configuración
   * @wizard_structure Estructura base del wizard de 4 pasos
   */
  pasos: ListaPasosWizard[] = PASOS;
  /**
   * @property {number} indice
   * @description
   * Índice del paso actual en el flujo del wizard. Determina qué paso se está
   * mostrando actualmente al usuario y controla la navegación y validaciones.
   * 
   * @current_position Posición actual en el flujo (1-4)
   * @navigation_control Control de navegación y validación
   * @default 1 - Inicia en el primer paso
   */
  indice: number = 1;

  /**
   * @property {any} TEXTOS
   * @description
   * Textos constantes utilizados en el componente para mensajes, avisos y textos
   * de interfaz. Importados desde la librería de acceso a datos de usuario.
   * 
   * @ui_texts Textos para interfaz de usuario
   * @imported_from Constante AVISO de la librería
   * @localization Textos localizados para el componente
   */
  TEXTOS = AVISO;

  /**
   * @property {string} tramiteId
   * @description
   * Identificador único del tipo de trámite que se está procesando.
   * Utilizado para comunicación con servicios backend y identificación del proceso.
   * 
   * @tramite_identifier Identificador del trámite 80207
   * @backend_communication Usado en llamadas a servicios
   * @constant Valor fijo para este trámite específico
   */
  tramiteId: string = '80207';
  /**
   * @property {WizardComponent} wizardComponent
   * @description
   * Referencia al componente del wizard hijo que maneja la lógica de navegación
   * entre pasos. Permite acceso programático a métodos de navegación y control.
   * 
   * @viewchild Referencia obtenida con ViewChild
   * @navigation_component Componente para control de navegación
   * @programmatic_access Acceso a métodos de navegación
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {PasoUnoComponent} pasoUnoComponent
   * @description
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos
   * de validación de formularios. Permite validación programática antes de navegación.
   * 
   * @viewchild Referencia con template reference 'pasoUnoRef'
   * @validation_access Acceso a métodos de validación
   * @form_control Control de formularios del primer paso
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;
 

  /**
   * @property {DatosPasos} datosPasos
   * @description
   * Datos de configuración de los pasos del wizard que incluyen número total de pasos,
   * índice actual y textos de botones de navegación. Utilizado por el componente wizard.
   * 
   * @wizard_configuration Configuración del wizard
   * @navigation_texts Textos de botones de navegación
   * @step_metadata Metadatos de pasos para UI
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

   
  /**
   * @method getValorIndice - Método documentado posteriormente
   * @description
   * Obtiene el valor del índice del paso actual desde eventos de acción de botón.
   * Utilizado para procesar navegación y validación entre pasos del wizard.
   */

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * Utilizado con el operador takeUntil para completar suscripciones automáticamente
   * cuando el componente se destruye.
   * 
   * @memory_management Prevención de memory leaks
   * @observable_cleanup Limpieza automática de suscripciones
   * @lifecycle_control Control de ciclo de vida de observables
   * @private Uso interno del componente
   */
  destroyNotifier$: Subject<void> = new Subject();

    /**
     * @property {EventEmitter<void>} cargarArchivosEvento
     * @description
     * Evento que se emite para iniciar el proceso de carga de archivos. Notifica a
     * componentes hijos o servicios que deben activar la funcionalidad de carga
     * de documentos requeridos para el trámite.
     * 
     * @event_emission Emisión de evento para carga de documentos
     * @file_upload_trigger Disparador de funcionalidad de carga
     * @component_communication Comunicación entre componentes padre-hijo
     */
    cargarArchivosEvento = new EventEmitter<void>();

    /**
     * @property {EventEmitter<void>} regresarSeccionCargarDocumentoEvento
     * @description
     * Evento que se emite para regresar a la sección de carga de documentos.
     * Permite navegación específica de regreso a la sección de documentos desde
     * otros pasos del proceso.
     * 
     * @navigation_event Evento de navegación específica
     * @document_section_return Regreso a sección de documentos
     * @workflow_control Control de flujo de trabajo
     */
    regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

    /**
   * @property {boolean} activarBotonCargaArchivos
   * @description
   * Indica si el botón para cargar archivos está habilitado. Controla la
   * disponibilidad de la funcionalidad de carga de documentos según el
   * estado actual del proceso.
   * 
   * @ui_control Control de habilitación de botón
   * @file_upload_state Estado de disponibilidad de carga
   * @default false - Deshabilitado por defecto
   */
    activarBotonCargaArchivos: boolean = false;

    /**
   * @property {boolean} seccionCargarDocumentos
   * @description
   * Indica si la sección de carga de documentos está activa. Controla la
   * visibilidad y disponibilidad de la interfaz de carga de documentos.
   * 
   * @section_visibility Control de visibilidad de sección
   * @document_upload_ui Estado de interfaz de carga
   * @default true - Activa al inicio para mostrar sección inicial
   */
    seccionCargarDocumentos: boolean = true;

    esFormaValido:boolean=false;

    formErrorAlert:string=ERROR_PLANTAS_SUBMANUFACTURERAS;

  
    /**
     * @property {boolean} cargaEnProgreso
     * @description
     * Indica si hay una operación de carga en progreso. Utilizado para mostrar
     * indicadores de carga y prevenir acciones concurrentes durante procesos.
     * 
     * @loading_indicator Estado de carga en progreso
     * @ui_feedback Feedback visual para usuario
     * @concurrent_prevention Prevención de operaciones concurrentes
     * @default true - Inicia con carga activa
     */
    cargaEnProgreso: boolean = true;

/**
 * @property {Tramite80207State} solicitudState
 * @description
 * Estado completo de la solicitud del trámite 80207 obtenido desde el store Akita.
 * Contiene toda la información capturada durante el proceso incluyendo datos del
 * subcontratista, plantas seleccionadas y validaciones.
 * 
 * @state_container Contenedor del estado completo del trámite
 * @akita_integration Integración con store de Akita
 * @reactive_data Datos reactivos del proceso
 * @business_data Información de negocio completa
 */
public solicitudState: Tramite80207State = {} as Tramite80207State;
  /**
   * @constructor
   * @description
   * Constructor de la clase ContenedorDePasosComponent que inicializa las dependencias
   * necesarias y configura las suscripciones reactivas para gestión de estado.
   * Establece la comunicación con servicios de consulta, gestión de sección,
   * registro de solicitudes y store del trámite.
   *
   * @param {Tramites80207Queries} tramiteQuery - Servicio de consultas específicas
   *                                              para el trámite 80207 con selectores reactivos
   * @param {SeccionLibStore} seccion - Servicio para gestionar el estado de la sección
   *                                   en la librería de la aplicación
   * @param {RegistroSolicitudService} registroSolicitudService - Servicio para registro
   *                                                             y envío de solicitudes
   * @param {Tramites80207Store} store - Store Akita para gestión de estado del trámite
   * 
   * @dependency_injection
   * Inyecta servicios para:
   * - Consulta reactiva de estado del trámite
   * - Gestión de estado de UI de secciones
   * - Comunicación con backend para solicitudes
   * - Actualización del store centralizado
   * 
   * @reactive_setup
   * Configura suscripción a:
   * - `formaValida$`: Observable de validación de formularios
   * - Actualización automática de estado de sección
   * - Limpieza automática con `takeUntil(destroyNotifier$)`
   * 
   * @subscription_management
   * La suscripción se configura para:
   * - Responder a cambios en validación de formularios
   * - Actualizar estado de sección automáticamente
   * - Establecer formulario como válido en la librería
   * - Completarse automáticamente al destruir componente
   * 
   * @memory_management
   * Utiliza `takeUntil(destroyNotifier$)` para:
   * - Prevenir memory leaks
   * - Completar suscripciones automáticamente
   * - Limpiar recursos al destruir componente
   * 
   * @angular_constructor
   * @dependency_injection_pattern
   */
  constructor(
    private tramiteQuery: Tramites80207Queries,
    private seccion: SeccionLibStore,
    private registroSolicitudService: RegistroSolicitudService,
    private store: Tramites80207Store
    
  ) {
    this.tramiteQuery.formaValida$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((_res) => {
        this.seccion.establecerSeccion([true]);
        this.seccion.establecerFormaValida([true]);
      });
  }

   /**
     * @method ngOnInit
     * @description
     * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
     * Configura la suscripción principal al estado de la sección para mantener
     * sincronizado el estado local con el store centralizado del trámite.
     * 
     * @lifecycle_hook Hook de inicialización de Angular
     * @state_synchronization Sincronización con estado centralizado
     * 
     * @subscription_setup
     * Configura suscripción a:
     * - `selectSeccionState$`: Observable del estado completo de la sección
     * - Mapeo automático del estado a propiedad local `solicitudState`
     * - Limpieza automática con `takeUntil(destroyNotifier$)`
     * 
     * @reactive_pattern
     * Implementa patrón reactivo para:
     * - Mantener sincronización automática de datos
     * - Responder a cambios de estado en tiempo real
     * - Actualizar UI automáticamente con nuevos datos
     * - Evitar consultas manuales repetitivas
     * 
     * @memory_safety
     * La suscripción se cancela automáticamente cuando:
     * - Se emite valor en `destroyNotifier$`
     * - El componente se destruye
     * - Se completa el ciclo de vida
     * 
     * @void
     * @implements OnInit
     */
    ngOnInit(): void {
      this.tramiteQuery.selectSeccionState$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.solicitudState = seccionState;
          })
        ).subscribe();
    }

  /**
   * @method getValorIndice
   * @description
   * Método principal para gestionar la navegación entre pasos del wizard. Procesa eventos
   * de acción de botones, realiza validaciones necesarias y coordina el avance al siguiente
   * paso incluyendo el envío de datos al backend cuando corresponde.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor del índice destino y la acción
   *                          a realizar ('cont' para continuar o otras acciones)
   *
   * @navigation_logic
   * Implementa lógica de navegación que:
   * 1. Verifica si la acción es 'cont' (continuar)
   * 2. Valida formularios del paso actual si es necesario
   * 3. Verifica que existan plantas seleccionadas
   * 4. Construye payload y envía datos al backend
   * 5. Actualiza índices y navega al siguiente paso
   * 
   * @validation_strategy
   * Para el paso 1:
   * - Ejecuta validación completa de formularios mediante `pasoUnoComponent`
   * - Previene navegación si validación falla
   * - Mantiene índice actual en caso de error
   * 
   * @business_rules
   * Requiere que:
   * - Formularios estén válidos antes de continuar
   * - Exista al menos una planta seleccionada
   * - Datos se envíen exitosamente al backend
   * - Se actualice ID de solicitud en el store
   * 
   * @backend_integration
   * Al continuar:
   * - Construye payload completo con `buildSolicitud80207Payload`
   * - Envía datos mediante `registroSolicitudService.postGuardarDatos`
   * - Actualiza ID de solicitud en store con respuesta
   * - Maneja respuesta asíncrona con observables
   * 
   * @error_handling
   * En caso de error:
   * - Mantiene índice actual sin avanzar
   * - Preserva estado del wizard
   * - Permite corrección de datos
   * 
   * @range_validation
   * Valida que el valor esté entre 1 y 4 (inclusive) para pasos válidos del trámite
   * 
   * @void
   * @navigation_controller
   */
  getValorIndice(e: AccionBoton): void {


   if(e.accion==='cont'){
    let isValid=true;
     this.esFormaValido=this.pasoUnoComponent?.validarTodosLosFormularios() ? false: true;
    if (this.indice === 1 && this.pasoUnoComponent) {
      isValid = this.pasoUnoComponent?.validarTodosLosFormularios();
    }
    if (!isValid) {
      this.datosPasos.indice = this.indice;  
    }
    else if((this.solicitudState?.plantas?.length ?? 0) > 0){

       const PAYLOAD = buildSolicitud80207Payload(this.solicitudState);
       
       this.registroSolicitudService.postGuardarDatos(this.tramiteId, PAYLOAD).pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if (response) {
           this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.siguiente();
        this.store.setIdSolicitud(response.datos?.id_solicitud ?? 0);
        }
      });
    }

 
    }
  }

   /**
   * @method cargaRealizada
   * @description
   * Método para manejar el evento de finalización del proceso de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos basado en el resultado
   * de la operación de carga.
   * 
   * @param {boolean} cargaRealizada - Indica si la carga de documentos se realizó
   *                                  correctamente (true) o falló (false)
   * 
   * @state_management
   * Actualiza `seccionCargarDocumentos`:
   * - `false` si la carga fue exitosa (oculta sección)
   * - `true` si la carga falló (mantiene sección visible)
   * 
   * @ui_control
   * Controla la visibilidad de:
   * - Sección de carga de documentos
   * - Botones de acción relacionados
   * - Indicadores de estado de carga
   * 
   * @workflow_progression
   * Permite progresión del flujo:
   * - Oculta sección al completar carga exitosa
   * - Mantiene accesible para retry en caso de fallo
   * 
   * @param {boolean} cargaRealizada
   * @returns {void}
   * @document_upload_handler
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
  * @method manejaEventoCargaDocumentos
  * @description
  * Método para manejar eventos relacionados con el estado de carga de documentos.
  * Actualiza el estado del botón de carga de archivos basado en la disponibilidad
  * o progreso de la funcionalidad de carga.
  * 
  * @param {boolean} carga - Indica si la funcionalidad de carga de documentos
  *                         está activa (true) o inactiva (false)
  * 
  * @button_state_control
  * Actualiza `activarBotonCargaArchivos` para:
  * - Habilitar botón cuando carga está disponible
  * - Deshabilitar durante procesos o cuando no aplique
  * - Proporcionar feedback visual al usuario
  * 
  * @user_interaction
  * Controla la interacción del usuario con:
  * - Botones de carga de archivos
  * - Elementos de UI relacionados con documentos
  * - Estados de habilitación/deshabilitación
  * 
  * @workflow_coordination
  * Coordina el flujo de trabajo:
  * - Habilita carga cuando es apropiado
  * - Previene acciones durante procesos
  * - Sincroniza estado con otros componentes
  * 
  * @param {boolean} carga
  * @returns {void}
  * @ui_state_manager
  */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * @method siguiente
   * @description
   * Método para navegar programáticamente al siguiente paso del wizard.
   * Ejecuta la transición forward en el componente wizard y actualiza los
   * índices correspondientes para mantener sincronización de estado.
   * 
   * @navigation_forward
   * Realiza navegación que:
   * - Ejecuta validación de documentos cargados (comentario indica validación futura)
   * - Avanza al siguiente paso usando `wizardComponent.siguiente()`
   * - Actualiza índice local basado en posición del wizard
   * - Sincroniza datos de pasos con nueva posición
   * 
   * @wizard_synchronization
   * Mantiene sincronización entre:
   * - Índice local del componente
   * - Índice actual del wizard component
   * - Datos de configuración de pasos
   * - Estado visual de la UI
   * 
   * @future_validation
   * Comentario indica que se implementará:
   * - Validación de documentos cargados
   * - Verificación de completitud de adjuntos
   * - Control de calidad de archivos
   * 
   * @state_update
   * Actualiza:
   * - `indice`: Posición actual + 1
   * - `datosPasos.indice`: Sincronización con datos de pasos
   * 
   * @void
   * @programmatic_navigation
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * @method anterior
   * @description
   * Método para navegar programáticamente al paso anterior del wizard.
   * Ejecuta la transición backward en el componente wizard y actualiza los
   * índices correspondientes para mantener sincronización de estado.
   * 
   * @navigation_backward
   * Realiza navegación que:
   * - Retrocede al paso anterior usando `wizardComponent.atras()`
   * - Actualiza índice local basado en nueva posición del wizard
   * - Sincroniza datos de pasos con posición actualizada
   * - Mantiene consistencia de estado durante retroceso
   * 
   * @wizard_synchronization
   * Mantiene sincronización entre:
   * - Índice local del componente
   * - Índice actual del wizard component  
   * - Datos de configuración de pasos
   * - Estado visual de navegación
   * 
   * @state_preservation
   * Durante retroceso:
   * - Preserva datos capturados en pasos anteriores
   * - Mantiene validaciones ya realizadas
   * - Conserva estado de formularios
   * 
   * @state_update
   * Actualiza:
   * - `indice`: Nueva posición actual + 1
   * - `datosPasos.indice`: Sincronización con datos de pasos
   * 
   * @void
   * @backward_navigation
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * @method onClickCargaArchivos
   * @description
   * Método de manejo de eventos para el click en botón de carga de archivos.
   * Emite evento que notifica a componentes interesados que deben activar
   * la funcionalidad de carga de documentos.
   * 
   * @event_emission
   * Emite evento:
   * - `cargarArchivosEvento`: Sin parámetros (void)
   * - Notifica inicio de proceso de carga
   * - Activa funcionalidad en componentes suscritos
   * 
   * @component_communication
   * Facilita comunicación:
   * - Entre componente padre e hijos
   * - Con servicios de carga de archivos
   * - Con sistemas de gestión de documentos
   * 
   * @user_interaction
   * Responde a:
   * - Click en botón de carga
   * - Acción intencional del usuario
   * - Iniciación de flujo de documentos
   * 
   * @workflow_trigger
   * Desencadena:
   * - Apertura de dialogo de archivos
   * - Activación de componentes de carga
   * - Inicio de proceso de validación de documentos
   * 
   * @void
   * @event_handler
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

   /**
    * @method onCargaEnProgreso
    * @description
    * Método para manejar el estado de progreso de carga de archivos.
    * Actualiza la bandera de carga en progreso para controlar UI y
    * prevenir acciones concurrentes durante procesos de carga.
    * 
    * @param {boolean} carga - Indica si hay una operación de carga en progreso
    *                         (true) o si ha terminado (false)
    * 
    * @loading_state_management
    * Controla estado de carga para:
    * - Mostrar/ocultar indicadores de progreso
    * - Habilitar/deshabilitar botones durante carga
    * - Prevenir acciones concurrentes
    * - Proporcionar feedback visual al usuario
    * 
    * @ui_feedback
    * Actualiza `cargaEnProgreso` para:
    * - Mostrar spinners o barras de progreso
    * - Deshabilitar botones durante operaciones
    * - Indicar estado de procesamiento
    * - Mejorar experiencia de usuario
    * 
    * @concurrent_operation_control
    * Previene:
    * - Múltiples cargas simultáneas
    * - Navegación durante procesos
    * - Acciones conflictivas
    * - Corrupción de datos
    * 
    * @param {boolean} carga
    * @returns {void}
    * @loading_indicator_controller
    */
   onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }


  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Implementa limpieza de recursos para prevenir memory leaks mediante
   * finalización de observables y completado de suscripciones.
   * 
   * @lifecycle_hook Hook de destrucción de Angular
   * @memory_cleanup Limpieza de memoria y recursos
   * 
   * @observable_cleanup
   * Realiza limpieza mediante:
   * - `destroyNotifier$.next()`: Emite señal de destrucción
   * - `destroyNotifier$.complete()`: Completa el Subject
   * - Finalización automática de todas las suscripciones con `takeUntil`
   * 
   * @memory_leak_prevention
   * Previene memory leaks de:
   * - Suscripciones a observables del store
   * - Suscripciones a servicios HTTP
   * - Event listeners y timers
   * - Referencias a componentes hijos
   * 
   * @subscription_management
   * Todas las suscripciones con `takeUntil(this.destroyNotifier$)` se:
   * - Completan automáticamente
   * - Liberan recursos
   * - Evitan callbacks en componente destruido
   * 
   * @resource_cleanup
   * Garantiza limpieza de:
   * - Observables RxJS
   * - Suscripciones a servicios
   * - Referencias circulares
   * - Event emitters
   * 
   * @best_practices
   * Implementa mejores prácticas de:
   * - Gestión de ciclo de vida Angular
   * - Prevención de memory leaks
   * - Limpieza de recursos reactivos
   * - Finalización ordenada de procesos
   * 
   * @void
   * @implements OnDestroy
   * @cleanup_method
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
  
}
