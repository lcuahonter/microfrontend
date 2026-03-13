import { AVISO, AccionBoton, DatosPasos, ListaPasosWizard, Notificacion, PAGO_DE_DERECHOS, PASOS, RegistroSolicitudService, WizardComponent, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDomicilioLegalState, DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DomicilioState, DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import { MENSAJE_DE_VALIDACION, MENSAJE_DE_VALIDACION_PAGO_DERECHOS, MSG_REGISTRO_EXITOSO } from '../../constants/medicos-uso.enum';
import { Subject, takeUntil } from 'rxjs';
import { DatosDelSolicituteSeccionQuery } from '../../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { DatosDomicilioLegalQuery } from '../../../../shared/estados/queries/datos-domicilio-legal.query';
import { DomicilioQuery } from '../../../../shared/estados/queries/domicilio.query';
import { GuardarAdapter_261101 } from '../../adapters/guardar-payload.adapter';
import { PASOS_REGISTRO } from '@ng-mf/data-access-user';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite261101Query } from '../../estados/queries/tramite261101query';
import { Tramite261101Store } from '../../estados/tramites/tramite261101store';
import { Solicitud261101State } from '../../estados/tramites/tramite261101store';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';

/**
 * Interfaz que representa la acción de un botón.
 */


/**
 * Componente que representa los pasos de datos en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent implements OnInit {
  /**
     * @property {ListaPasosWizard[]} pasos
     * @description Lista de pasos del wizard.
     * Inicializado con el valor de `PASOS`.
     */
  pasos: ListaPasosWizard[] = PASOS_REGISTRO;

    /**
     * Evento que se emite para cargar archivos.
     * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
     */
    cargarArchivosEvento = new EventEmitter<void>();
   /**
      * Evento para regresar a la sección de carga de documentos.
      * @type {EventEmitter<void>}
      */
     regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();
  
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
   * Estado del tramite Folio
   */
   public folioTemporal: number = 0;

   /**
    * Folio temporal de la solicitud.
    * Se utiliza para mostrar el folio en la notificación de éxito.
    */
    public alertaNotificacion!: Notificacion;
 
    /**
     * Indica si la carga de archivos está en progreso.
     */
    cargaEnProgreso: boolean = true;
    
    /**
     * @property {AccionBoton} accionDelBoton
     * @description
     * Almacena la acción del botón presionado en el wizard (continuar o anterior).
     * Permite controlar la navegación y el flujo de validaciones según la interacción del usuario.
     */
    accionDelBoton!: AccionBoton;
    
    /**
      * ID del estado de la solicitud.
      * @type {number | null}
      */
     idSolicitudState: number | null = 0;
 
     /**
      * Identificador del tipo de trámite.
      * @type {string}
      */
     idTipoTramite: string = '261101';

    /**
     * @property {string} TEXTOS
     * @description
     * Texto de aviso utilizado en el componente.
     */
     TEXTOS: string = AVISO.Aviso;   
 
     /**
      * Clase CSS para mostrar una alerta de error.
      */
      infoError = 'alert-danger text-center';

    /**
    * @property {string} infoAlert
    * @description
    * Clase CSS para aplicar estilos a los mensajes de información.
    */
    public infoAlert = 'alert-info  text-center';   
      
  /**
   * @property {WizardComponent} wizardComponent
   * @description Referencia al componente del wizard.
   * Utilizado para manejar la navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
       * @ViewChild(PagoDeDerechosContenedoraComponent)
       * Referencia al componente hijo `PagoDeDerechosContenedoraComponent` obtenida
       * mediante el decorador `@ViewChild`.
       */
     @ViewChild(PagoDeDerechosContenedoraComponent)
     pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;
  

  @ViewChild('pasoUno') pasoUnoComponent!: PasoUnoComponent ;
  
  DatosDelSolicitudDatos!: DatosDelSolicituteSeccionState;
  
  manifestoDatos!: DatosDomicilioLegalState;
  
  representanteLegalDatos!: DomicilioState;
  
  /**
   * Variable utilizada para almacenar la lista de pasos.
   */
  pantallasPasos: ListaPasosWizard[] = PASOS_REGISTRO;

   /**
     * @property {number} indice
     * @description Índice actual del paso seleccionado en el wizard.
     * Inicializado con el valor `1`.
     */
    indice: number = 1;

  /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
   isSaltar: boolean = false;

  /**
   * @property {boolean} requiresPaymentData
   * @description
   * Indica si se requieren datos de pago para continuar con el trámite.
   */
  public requiresPaymentData: boolean = false;

  /**
   * Datos para los pasos en el asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };  

  terceros_derechosDatos!: Solicitud261101State;
  
  /**
   * @property {number} confirmarSinPagoDeDerechos
   * @description
   * Indica si se ha confirmado la continuación sin pago de derechos.
   */
   public confirmarSinPagoDeDerechos: number = 0;  
  
 
     /**
       * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
       */
     public formErrorAlert!:string;
  
  
    /**
     * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
     */
    esFormaValido: boolean = false;
    
   /**
     * Controla la visibilidad del modal de alerta.
     * @property {boolean} mostrarAlerta
     */
    public mostrarAlerta: boolean = false;
    
   /** Nueva notificación relacionada con el RFC. */
    public seleccionarFilaNotificacion!: Notificacion;
  
      /**
     * @property {string} MENSAJE_DE_ERROR
     * @description
     * Propiedad usada para almacenar el mensaje de error actual.
     * Se inicializa como cadena vacía y se actualiza en función
     * de las validaciones o errores capturados en el flujo.
     */
       MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;
       
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
    
  
     constructor(private toastrService: ToastrService,
               private registroSolicitudService: RegistroSolicitudService,
           private tramite261101Store: Tramite261101Store,
           private tramite261101Query: Tramite261101Query,
          private datosDelSolicituteSeccionQuery: DatosDelSolicituteSeccionQuery,
             private datosDelSolicituteSeccionStore: DatosDelSolicituteSeccionStateStore,
             private manifestoQuery: DatosDomicilioLegalQuery,
             private manifestoStore: DatosDomicilioLegalStore,
             private domicilioQuery: DomicilioQuery,
             private domicilioStore: DomicilioStore) {}
    
      ngOnInit(): void {
        this.datosDelSolicituteSeccionQuery.selectSolicitud$.pipe(
                takeUntil(this.destroyNotifier$))
              .subscribe((data) => {
                this.DatosDelSolicitudDatos = data;
              });
              
              this.manifestoQuery.selectSolicitud$.pipe(
                takeUntil(this.destroyNotifier$))
              .subscribe((state) => {
                this.manifestoDatos = state;
              });
              this.domicilioQuery.selectSolicitud$.pipe(
                takeUntil(this.destroyNotifier$))
              .subscribe((state) => {
                  this.representanteLegalDatos = state;
              });
        
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  this.registroSolicitudService.parcheOpcionesPrellenadas(261101,202951505).subscribe((res:any) => {
                    if(res && res.datos){
                      // debugger;
                      GuardarAdapter_261101.patchToStore(res.datos, this.tramite261101Store);
                      GuardarAdapter_261101.patchToStoreDatosSolicitud(res.datos, this.datosDelSolicituteSeccionStore);
                      GuardarAdapter_261101.patchToStoreManifestos(res.datos, this.manifestoStore);
                      GuardarAdapter_261101.patchToStoreDomicilio(res.datos, this.domicilioStore);
                    }
                  });
      }
  
       /**
         * Actualiza el valor del índice según el evento del botón de acción.
         * @param e El evento del botón de acción que contiene la acción y el valor.
         */
        getValorIndice(e: AccionBoton): void {
           this.accionDelBoton = e;
           if (e.accion === 'cont') {
              let isValid = true;
                if (this.indice === 1 && this.pasoUnoComponent) {
                      isValid = this.requiresPaymentData ? this.pasoUnoComponent.validarPasoUno() : this.pasoUnoComponent.validarTodosLosPasos();
                    }
                    // this.DatosDelSolicitudDatos= this.pasoUnoComponent.datosSolicitudComponent.getStoreState();
                    this.manifestoDatos= this.pasoUnoComponent.manifiestosComponent.getStoreState();
                    this.representanteLegalDatos= this.pasoUnoComponent.representanteLegalComponent.getStoreState();
                    this.tramite261101Query.selectSolicitud$.pipe().subscribe((data) => {
                      this.terceros_derechosDatos= data;
                    });
            
                    if(!this.pasoUnoComponent.validarContenedor() && this.requiresPaymentData) {
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
                     } else if(this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() && !this.pasoUnoComponent?.validarContenedor()) {
                                 this.confirmarSinPagoDeDerechos = 2;
                     }
                              //  } else if(this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() && this.pasoUnoComponent?.validarContenedor() && !this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
                              //    this.confirmarSinPagoDeDerechos = 3;
                              //  } else if(this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() && this.pasoUnoComponent?.validarContenedor() && this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
                              //     this.guardarDatosApi(e);
                              //   }
                           }
                     
                             if (!isValid) {
                               this.formErrorAlert = this.MENSAJE_DE_ERROR;
                               this.esFormaValido = true;
                               this.datosPasos.indice = this.indice;
                               setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
                             }
                             else if(isValid && this.requiresPaymentData){
                                this.guardarDatosApi(e);
                             }
                           }else{
                             this.indice = e.valor;
                             this.datosPasos.indice = this.indice;
                             this.wizardComponent.atras();
                           }
                     }  

/**
 * Genera una alerta de error con los mensajes proporcionados.
 * @param mensajes Mensajes de error a mostrar en la alerta.
 * @returns HTML de la alerta de error.
 */
static generarAlertaDeError(mensajes: string): string {
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
    * @method blancoObligatoria
    * @description Método para manejar el evento de documentos obligatorios en blanco.
    * Actualiza la bandera `isSaltar` basada en el estado recibido.
    * @param {boolean} enBlanco - Indica si hay documentos obligatorios en blanco.
    * @return {void}
    */
  onBlancoObligatoria(enBlanco: boolean): void {
   this.isSaltar = enBlanco;
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
   if(this.pasoUnoComponent.validarPasoUno()){
    this.guardarDatosApi(this.accionDelBoton);
   }
   else{
     this.formErrorAlert = this.MENSAJE_DE_ERROR;
       this.esFormaValido = true;
   }
   } else {
     this.mostrarAlerta = false;
     this.confirmarSinPagoDeDerechos = 4;
   }
 }
 
  /**
         * @method guardarDatosApi
         * @description
         * Guarda los datos del formulario en la API y maneja la navegación del wizard según la respuesta.
         * Actualiza el estado de error, muestra mensajes y sincroniza el identificador de la solicitud.
         *
         * @param {AccionBoton} e - Acción del botón presionado (continuar o anterior).
         * @api_call
         * Realiza llamada a la API para guardar datos usando el adaptador correspondiente.
         * Maneja la respuesta:
         * - Si hay error, muestra alerta y regresa al primer paso.
         * - Si es exitoso, actualiza el ID de la solicitud y navega al paso correspondiente.
         * - Muestra mensajes de éxito o error usando Toastr.
         * @state_update
         * Actualiza:
         * - `formErrorAlert`, `esFormaValido`, `indice`, `datosPasos.indice`, `wizardComponent.indiceActual`, `idSolicitudState`
         * @navigation_control
         * Controla navegación del wizard según la acción y respuesta.
         */
        guardarDatosApi(e: AccionBoton): void {
         const PAYLOAD = GuardarAdapter_261101.toFormPayload(this.DatosDelSolicitudDatos,this.manifestoDatos,this.representanteLegalDatos,this.terceros_derechosDatos);
       
         
          this.registroSolicitudService.postGuardarDatos('260915', PAYLOAD).subscribe({
           next: (response) => {
             const shouldNavigate = response.codigo === '00';
       
             if (!shouldNavigate) {
               const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
               this.handleApiError(ERROR_MESSAGE);
               return;
             }
       
             // Handle successful response
             if (esValidObject(response) && esValidObject(response.datos)) {
               this.esFormaValido = false;
               const DATOS = response.datos as { id_solicitud?: number };
               const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
               this.idSolicitudState = ID_SOLICITUD;
               this.folioTemporal = ID_SOLICITUD;
               this.tramite261101Store.setIdSolicitud(ID_SOLICITUD);
             }
       
             // Update the wizard index and navigate
             let indiceActualizado = e.valor;
             if (e.accion === 'cont') {
               indiceActualizado = e.valor;
             }
             this.toastrService.success(response.mensaje);
             if (indiceActualizado > 0 && indiceActualizado < 5) {
              this.alertaNotificacion = {
                               tipoNotificacion: 'banner',
                               categoria: 'success',
                               modo: 'action',
                               titulo: '',
                               mensaje: MSG_REGISTRO_EXITOSO(String(this.folioTemporal)),
                               cerrar: true,
                               txtBtnAceptar: '',
                               txtBtnCancelar: '',
                             };
               this.indice = indiceActualizado;
               this.datosPasos.indice = indiceActualizado;
               if (e.accion === 'cont') {
                 this.wizardComponent.siguiente();
               } else {
                 this.wizardComponent.atras();
               }
             }
           },
           error: (err) => {
             // Handle network or unexpected errors
             const ERROR_MESSAGE = err?.message || 'Error de red o problema inesperado';
             this.handleApiError(ERROR_MESSAGE);
           },
         });
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
    * Handles API errors by setting the error message, updating the form state, and scrolling to the top.
    * @param errorMessage The error message to display.
    */
  private handleApiError(errorMessage: string): void {
   this.formErrorAlert = DatosComponent.generarAlertaDeError(errorMessage);
   this.esFormaValido = true; 
   this.indice = 1;
   this.datosPasos.indice = 1;
   this.wizardComponent.indiceActual = 1;
   
   setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
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
     * @method seleccionaTab
     * @description Cambia el índice actual al valor proporcionado.
     * @param {number} i - Índice del paso seleccionado.
     *
     * @example
     * ```typescript
     * this.seleccionaTab(2);
     * console.log(this.indice); // 2
     * ```
     */
    seleccionaTab(i: number): void {
      this.indice = i;
    }

  }
  
