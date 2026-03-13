import { AVISO, RegistroSolicitudService, esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { MENSAJE_DE_VALIDACION,MENSAJE_DE_VALIDACION_PAGO_DERECHOS,TITULOMENSAJE } from '../../constants/medicos-uso.enum';
import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ViewChild } from '@angular/core';

import { AccionBoton } from '@ng-mf/data-access-user';
import { AlertComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { Notificacion } from '@ng-mf/data-access-user';
import { NotificacionesComponent } from '@ng-mf/data-access-user';
import {PasoCargaDocumentoComponent} from '@ng-mf/data-access-user';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { WizardComponent } from '@ng-mf/data-access-user';

import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

import {Tramite260210State, Tramite260210Store} from '../../estados/tramite260210Store.store';
import { GuardarMappingAdapter } from '../../adapters/guardar-mapping.adapter';
import { PASOS } from '../../constants/medicos-uso.enum';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Tramite260210Query } from '../../estados/tramite260210Query.query';
/**
 * @component ContenedorDePasosComponent
 * @description Componente contenedor principal del flujo tipo "wizard".
 * Administra la navegación entre los pasos del formulario y la lógica para cambiar de vista,
 * así como el título dinámico mostrado en el encabezado.
 */
@Component({
  selector: 'app-contenedor-de-pasos',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    BtnContinuarComponent,
    AlertComponent,
    NotificacionesComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,

  ],
  templateUrl: './contenedor-de-pasos.component.html',
  styleUrl: './contenedor-de-paso.component.scss',
})
export class ContenedorDePasosComponent implements OnInit {
  /**
   * @property tituloMensaje
   * @description Título dinámico que se muestra en la parte superior del componente wizard.
   * Cambia según el paso activo.
   * @type {string | null}
   */
  public tituloMensaje: string | null = TITULOMENSAJE;

  /**
   * @property pasos
   * @description Lista de pasos definidos para el wizard.
   * @type {ListaPasosWizard[]}
   */
  public pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property indice
   * @description Índice actual del paso seleccionado en el wizard.
   * @type {number}
   */
  public indice: number = 1;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

  /**
   * @property {boolean} requiresPaymentData
   * @description
   * Indica si se requieren datos de pago para continuar con el trámite.
   */
  public requiresPaymentData: boolean = false;

    /**
   * @property {number} confirmarSinPagoDeDerechos
   * @description
   * Indica si se ha confirmado la continuación sin pago de derechos.
   */
  public confirmarSinPagoDeDerechos: number = 0;

  
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
 * @property {string} MENSAJE_DE_ERROR
 * @description
 * Propiedad usada para almacenar el mensaje de error actual.
 * Se inicializa como cadena vacía y se actualiza en función
 * de las validaciones o errores capturados en el flujo.
 */
   MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;

   /**
    * @property {string} infoAlert
    * Clase CSS usada para mostrar alertas informativas.
    */
   public infoAlert = 'alert-danger text-center';

    /**
     * ID del estado de la solicitud.
     * @type {number | null}
     */
    idSolicitudState!: number | null;

  
    /** Nueva notificación relacionada con el RFC. */
    public seleccionarFilaNotificacion!: Notificacion;

  /**
   * @property wizardComponent
   * @description Referencia al componente `WizardComponent`, permite manipular métodos como `siguiente()` o `atras()`.
   * @type {WizardComponent}
   */
  @ViewChild('WizardComponent')
  public wizardComponent!: WizardComponent;

  /**
 * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
 * }
 */
esFormaValido: boolean = false;

    /**
     * Valor del aviso de privacidad.
     * @type {string}
     */
        AVISO_PRIVACIDAD_ADJUNTAR = AVISO.Aviso;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
esMostrarAlerta: boolean = false;

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
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;

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
 * @property {Tramite260210State} solicitudState
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
public solicitudState: Tramite260210State = {} as Tramite260210State;

    /**
    * @property {PasoUnoComponent} pasoUnoComponent
    * @description
    * Referencia al componente hijo `PasoUnoComponent` mediante
    * `@ViewChild`. Permite acceder a sus métodos y propiedades
    * desde este componente padre.
    */
    @ViewChild(PasoUnoComponent)
    pasoUnoComponent!: PasoUnoComponent;

  /**
   * @property datosPasos
   * @description Datos requeridos por el componente wizard para configurar botones y número de pasos.
   * @type {DatosPasos}
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @method seleccionaTab
   * @description Cambia el índice del paso actual manualmente.
   * @param {number} i - Índice del paso seleccionado.
   * @returns {void}
   */
  public seleccionaTab(i: number): void {
    this.indice = i;
  }

  
  /**
   * Subject utilizado para notificar la destrucción del componente.
   * Se utiliza con el operador `takeUntil` para cancelar automáticamente
   * las suscripciones activas cuando el componente es destruido, 
   * evitando así posibles fugas de memoria.
   * 
   * @type {Subject<void>}
   * @example
   * ```typescript
   * // Uso típico con takeUntil
   * this.someObservable$.pipe(
   *   takeUntil(this.destroyNotifier$)
   * ).subscribe();
   * ```
   */
  destroyNotifier$: Subject<void> = new Subject();

    /**
   * Identificador del tipo de trámite.
   * @type {string}
   */
  idTipoTramite: string = '260210';

  /**
   * @property {Tramite260201State} storeData
   * @description Estado de la tienda para el trámite 260210.
   */
  storeData!: Tramite260210State;

  /**
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
   public formErrorAlert!:string;

   /**
   * Clase CSS para mostrar una alerta de error.
   */
  infoError = 'alert-danger text-center';
  
  constructor(
    private toastrService: ToastrService,
    private registroSolicitudService: RegistroSolicitudService,
    public tramiteQuery: Tramite260210Query,
    public tramite260210Store: Tramite260210Store
  ) {}

ngOnInit(): void {
    this.tramiteQuery.selectTramiteState$.pipe().subscribe((data) => {
      this.storeData = data;
    });
}


/**
   * @method getValorIndice
   * @description Actualiza el índice y el título del mensaje según la acción del botón.
   * Navega hacia adelante o hacia atrás en el wizard.
   * @param {AccionBoton} e - Objeto que contiene el valor del índice y la acción ('cont' o 'atras').
   */
  getValorIndice(e: AccionBoton): void {

      if (e.accion === 'cont') {
        let isValid = true;

      if (this.indice === 1 && this.pasoUnoComponent) {
      isValid = this.pasoUnoComponent.validarPasoUno();
      }
        if(!this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validarContenedor() && this.requiresPaymentData) {
          this.confirmarSinPagoDeDerechos = 2;
        }else {
          this.confirmarSinPagoDeDerechos = 3;
        }

        if(!this.requiresPaymentData) {
          if(!this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor()){
            this.mostrarAlerta=true; 
            this.seleccionarFilaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: '',
              mensaje: MENSAJE_DE_VALIDACION_PAGO_DERECHOS,
              cerrar: true,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'SI',
              txtBtnCancelar: 'NO',
              alineacionBtonoCerrar:'flex-row-reverse'
            }
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          } else if(this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() && !this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validarContenedor()) {
            this.confirmarSinPagoDeDerechos = 2;
          } else if(this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() && this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validarContenedor() && !this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
            this.confirmarSinPagoDeDerechos = 3;
          }
      }
      if (!isValid) {
        this.formErrorAlert = this.MENSAJE_DE_ERROR;
        this.esFormaValido = true;
        this.datosPasos.indice = this.indice;
        return;
      }

      const PAYLOAD = GuardarMappingAdapter.toFormPayload(this.storeData);
      let shouldNavigate = false;
      this.registroSolicitudService.postGuardarDatos(this.idTipoTramite, PAYLOAD).subscribe(response => {
        shouldNavigate = response.codigo === '00';
        if (!shouldNavigate) {
          const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
          this.formErrorAlert = ContenedorDePasosComponent.generarAlertaDeError(ERROR_MESSAGE);
          this.esFormaValido = true;
          this.indice = 1;
          this.datosPasos.indice = 1;
          this.wizardComponent.indiceActual = 1;
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          return;
        }
        if(shouldNavigate) {
          if(esValidObject(response) && esValidObject(response.datos)) {
            this.esFormaValido = false;
            const DATOS = response.datos as { id_solicitud?: number };
            const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
            this.idSolicitudState = ID_SOLICITUD;
            this.tramite260210Store.setIdSolicitud(ID_SOLICITUD);
          }
          // Calcular el nuevo índice basado en la acción
          let indiceActualizado = e.valor;
          if (e.accion === 'cont') {
            indiceActualizado = e.valor;
          }
          this.toastrService.success(response.mensaje);
          if (indiceActualizado > 0 && indiceActualizado < 5) {
            this.indice = indiceActualizado;
            this.datosPasos.indice = indiceActualizado;
            if (e.accion === 'cont') {
              this.wizardComponent.siguiente();
            } else {
              this.wizardComponent.atras();
            }
          }
        } else {
          this.toastrService.error(response.mensaje);
          this.indice = 1;
          this.datosPasos.indice = 1;
          this.wizardComponent.atras();
        }
      });
    }else{
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.atras();
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
 * @method saltar
 * @description
 * Método para saltar directamente al paso de firma en el wizard.
 * Actualiza los índices correspondientes y ejecuta la transición
 * forward en el componente wizard.
 */
saltar(): void {
  this.indice = 3;
  this.datosPasos.indice = 3;
  this.wizardComponent.siguiente();
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
   * @method blancoObligatoria
   * @description Método para manejar el evento de documentos obligatorios en blanco.
   * Actualiza la bandera `isSaltar` basada en el estado recibido.
   * @param {boolean} enBlanco - Indica si hay documentos obligatorios en blanco.
   * @return {void}
   */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

  /**
   * @method obtenerNombreDelTítulo
   * @description Método auxiliar estático que devuelve el título correspondiente a cada paso.
   * @param {number} valor - Índice del paso.
   * @returns {string} Título a mostrar en el encabezado del wizard.
   */
  public static obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return TITULOMENSAJE;
      case 2:
        return 'Cargar archivos';
      case 3:
        return 'Firmar';
      default:
        return TITULOMENSAJE;
    }
  }


 /**   * @method cerrarModal
   * @description
   * Maneja el cierre del modal de alerta y actualiza el estado según la respuesta del usuario.
   * @param {boolean} value - Indica si se confirmó la acción (true) o se canceló (false).
   */
  cerrarModal(value:boolean): void {
    if(value){
    this.mostrarAlerta = false;
    this.requiresPaymentData = true;
    if(!this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validarContenedor() && this.requiresPaymentData) {
          this.confirmarSinPagoDeDerechos = 2;
        }else {
          this.confirmarSinPagoDeDerechos = 3;
        }
    } else {
      this.mostrarAlerta = false;
      this.confirmarSinPagoDeDerechos = 4;
    }
  }

  /**
   * Genera una alerta de error con los mensajes proporcionados.
   * @param mensajes Mensajes de error a mostrar en la alerta.
   * @returns HTML de la alerta de error.
   */
static generarAlertaDeError(mensajes:string): string {
    const ALERTA = `
      <div class="row">
<div class="col-md-12 justify-content-center text-center">
  <div class="row">
    <div class="col-md-12">
    <p>Corrija los siguientes errores:</p>
    <ol>
    <li>${mensajes}</li>
    </ol>
    </div>
  </div>
</div>
</div>
`;
return ALERTA;
  }
}
