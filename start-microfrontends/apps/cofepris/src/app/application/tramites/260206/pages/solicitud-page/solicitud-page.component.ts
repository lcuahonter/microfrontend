import { AVISO, AlertComponent, DatosPasos, PasoCargaDocumentoComponent, RegistroSolicitudService, esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnInit } from '@angular/core';
import {MENSAJE_DE_VALIDACION, MENSAJE_DE_VALIDACION_PAGO_DERECHOS, PASOS, TITULO_MENSAJE } from '../../constantes/maquila-materias-primas.enum';
import { Tramite260206State, Tramite260206Store } from '../../estados/stores/tramite260206Store.store';
import { AccionBoton } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { GuardarAdapter_260206 } from '../../adapters/guardar-payload.adapter';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { Notificacion } from'@ng-mf/data-access-user';
import { NotificacionesComponent } from '@ng-mf/data-access-user';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Tramite260206Query } from '../../estados/queries/tramite260206Query.query';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@ng-mf/data-access-user';
/**
 * @component SolicitudPageComponent
 * @description Componente principal de la página de solicitud. Controla la navegación
 * entre pasos de un wizard, muestra el título correspondiente y permite avanzar o retroceder
 * según la interacción del usuario. Utiliza un componente wizard para encapsular la lógica de pasos.
 */
@Component({
  selector: 'app-solicitud-page',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoFirmaComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    AlertComponent,
    PasoCargaDocumentoComponent,
    NotificacionesComponent

  ],
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss',
})
export class SolicitudPageComponent implements OnInit {

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
   * Clase CSS para mostrar una alerta de error.
   */
  infoError = 'alert-danger text-center';
    /**
   * @property {string} TEXTOS
   * @description
   * Texto de aviso utilizado en el componente.
   */
  TEXTOS: string = AVISO.Aviso;
    /**
   * @property {string} infoAlert
   * @description
   * Clase CSS para aplicar estilos a los mensajes de información.
   */
  public infoAlert = 'alert-info  text-center';

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
 * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
 * }
 */
esFormaValido: boolean = false;

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
   * @property {string | null} tituloMensaje
   * Título principal mostrado en la parte superior según el paso actual.
   */
  tituloMensaje: string | null =
    'Permiso sanitario de importación de medicamentos y materias primas destinados a maquila';

  /**
   * @property {ListaPasosWizard[]} pasos
   * Lista de pasos del wizard obtenidos desde una constante externa.
   */
  pasos: ListaPasosWizard[] = PASOS;

    /**
     * @property {string} MENSAJE_DE_ERROR
     * @description
     * Propiedad usada para almacenar el mensaje de error actual.
     * Se inicializa como cadena vacía y se actualiza en función
     * de las validaciones o errores capturados en el flujo.
     */
       MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;
    

  /**
   * @property {number} indice
   * Índice actual del paso seleccionado (empieza en 1).
   */
  indice: number = 1;

  /** Nueva notificación relacionada con el RFC. */
    public seleccionarFilaNotificacion!: Notificacion;


/**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
public mostrarAlerta: boolean = false;

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
   * URL de la página actual.
   */
  public solicitudState!: Tramite260206State;
  
  /**
     * Identificador numérico de la solicitud actual.
     * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
     */
    idSolicitudState: number | null = 0;

  /**
   * @property {WizardComponent} wizardComponent
   * Referencia al componente Wizard para controlar navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {DatosPasos} datosPasos
   * Objeto de configuración utilizado por el componente wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

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
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
   public formErrorAlert!:string;
   
  /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;

  /**
   * @property {AccionBoton} accionDelBoton
   * @description
   * Almacena la acción del botón presionado en el wizard (continuar o anterior).
   * Permite controlar la navegación y el flujo de validaciones según la interacción del usuario.
   */
  accionDelBoton!: AccionBoton;

    constructor(
    private tramiteStore: Tramite260206Store,
    private tramiteQuery: Tramite260206Query,
    public registroSolicitudService: RegistroSolicitudService,
    private toastrService: ToastrService
  ) { }

   ngOnInit(): void {
    this.tramiteQuery.selectTramiteState$.pipe().subscribe((data) => {
      this.solicitudState = data;
    });
  }


  /**
   * @method seleccionaTab
   * @description Cambia el índice actual del wizard manualmente.
   * @param {number} i - Índice del paso al que se desea cambiar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

   /**
     * @method getValorIndice
     * @description Controla la navegación del wizard según el botón presionado (anterior o continuar).
     * También actualiza el título correspondiente al paso actual.
     *
     * @param {AccionBoton} e - Objeto que contiene el valor y la acción del botón presionado.
     */
   // eslint-disable-next-line complexity
   getValorIndice(e: AccionBoton): void {
     this.accionDelBoton = e;
     if (e.accion === 'cont') {
        let isValid = true;
          if (this.indice === 1 && this.pasoUnoComponent) {
                isValid = this.pasoUnoComponent.validarPasoUno();
 
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
               } 
               else if(!this.pasoUnoComponent.contenedorDeDatosSolicitudComponent.validarContenedor()) {
                           this.confirmarSinPagoDeDerechos = 2;
               }
               else if (!this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
                     this.confirmarSinPagoDeDerechos = 3;
               }
               else if(this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() && this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validarContenedor() && this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
                 this.guardarDatosApi(e);
               }
           }  
 
 
                       if (!isValid || (this.pasoUnoComponent.pagoDeDerechosContenedoraComponent &&
       this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.isAnyFieldFilledButNotAll())) {
                         this.formErrorAlert = this.MENSAJE_DE_ERROR;
                         this.esFormaValido = true;  
                         this.datosPasos.indice = this.indice;
                         this.confirmarSinPagoDeDerechos = 2;
                         setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
                         return;
                       }
                       else if(isValid && this.pasoUnoComponent.validarTodosLosPasos() && this.requiresPaymentData){
                          this.esFormaValido = false;
                          this.guardarDatosApi(e);
                          return;
                       }
                       else if(isValid && this.requiresPaymentData){
                         this.esFormaValido = false;
                          this.guardarDatosApi(e);
                          return;
                       } else if(!this.pasoUnoComponent.validarTodosLosPasos()){
                          this.esFormaValido = false;
                          if(this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.continuarButtonClicked){
                             this.formErrorAlert = this.MENSAJE_DE_ERROR;
                             this.esFormaValido = true;
                          }
                          this.indice = 1;
                          this.datosPasos = {
                          ...this.datosPasos,
                          indice: 1,  
                       };
                     }
                     
             }
      
           if(!this.pasoUnoComponent.contenedorDeDatosSolicitudComponent.validarContenedor()) {
                           this.confirmarSinPagoDeDerechos = 2;
               }
               else if (!this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
                     this.confirmarSinPagoDeDerechos = 3;
               }
               else if(!this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() && !this.requiresPaymentData) {
                     this.confirmarSinPagoDeDerechos = 4;
               } 
      
                       
             
         }
         else{
               this.indice = e.valor;
               this.datosPasos.indice = this.indice;
               this.wizardComponent.atras();
             }
             
       }          
               
             
  /**
   * Cierra el modal y realiza acciones según el valor proporcionado.
   *
   * @param value - Indica si se debe proceder con el cierre y validación del formulario.
   *   - Si es `true`, oculta la alerta, requiere datos de pago y valida el primer paso del formulario.
   *     Si la validación es exitosa, guarda los datos mediante la API; de lo contrario, muestra un mensaje de error.
   *   - Si es `false`, solo oculta la alerta y establece la confirmación sin pago de derechos.
   */
   cerrarModal(value:boolean): void {
                     this.mostrarAlerta = false;
 
                     if(value){
                     this.esFormaValido = false;
                     this.requiresPaymentData = true;
                     if(this.pasoUnoComponent.validarPasoUno()){
                      this.guardarDatosApi(this.accionDelBoton);
                     }
                     else if(!this.pasoUnoComponent.contenedorDeDatosSolicitudComponent.validarContenedor()) {
                           this.confirmarSinPagoDeDerechos = 2;
               }
               else if (!this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
                     this.confirmarSinPagoDeDerechos = 3;
               }
 
                   }
                     else{
                       this.requiresPaymentData = false;
                       
                       if(this.pasoUnoComponent.validarTodosLosPasos()){
                         this.guardarDatosApi(this.accionDelBoton);
                       }
                       else if(!this.pasoUnoComponent.contenedorDeDatosSolicitudComponent.validarContenedor()) {
                           this.confirmarSinPagoDeDerechos = 2;
               }
               else if (!this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
                     this.confirmarSinPagoDeDerechos = 3;
               }
               else if(!this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor()) {
                     this.confirmarSinPagoDeDerechos = 4;
               }
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
        const PAYLOAD = GuardarAdapter_260206.toFormPayload(this.solicitudState);
        let shouldNavigate = false;
        this.registroSolicitudService.postGuardarDatos('260206', PAYLOAD).subscribe(response => {
          shouldNavigate = response.codigo === '00';
          if (!shouldNavigate) {
            const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
            this.formErrorAlert = SolicitudPageComponent.generarAlertaDeError(ERROR_MESSAGE);
            this.esFormaValido = true;
            this.indice = 1;
            this.datosPasos.indice = 1;
            this.wizardComponent.indiceActual = 1;
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            return;
          }
          if (shouldNavigate) {
            if (esValidObject(response) && esValidObject(response.datos)) {
              this.esFormaValido = false;
              const DATOS = response.datos as { id_solicitud?: number };
              const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
              this.idSolicitudState = ID_SOLICITUD;
              this.tramiteStore.setIdSolicitud(ID_SOLICITUD);
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
          }
        });
      }
  
  public static generarAlertaDeError(mensajes:string): string {
    const ALERTA = `
      <div class="d-flex justify-content-center text-center">
        <div class="col-md-12 p-3  border-danger  text-danger rounded">
          <div class="mb-2 text-secondary" >Corrija los siguientes errores:</div>

          <div class="d-flex justify-content-start mb-1">
            <span class="me-2">1.</span>
            <span class="flex-grow-1 text-center">${mensajes}</span>
          </div>  
        </div>
      </div>
      `;
      return ALERTA;
  }             

  /**
   * @method obtenerNombreDelTítulo
   * @description Devuelve el título a mostrar según el número de paso.
   *
   * @param {number} valor - Índice del paso actual.
   * @returns {string} - Título correspondiente.
   */
  obtenerNombreDelTítulo(valor: number): string {
  switch (valor) {
      case 1:
        return TITULO_MENSAJE;
      case 2:
        return this.pasos[1].titulo;
      case 3:
        return this.pasos[2].titulo;

      default:
        return TITULO_MENSAJE;
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

}
