/* eslint-disable complexity */
import { AVISO, ERROR_FORMA_ALERT, ListaPasosWizard, PASOS, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter,OnInit, ViewChild } from '@angular/core';
import { MENSAJE_DE_PAGE, MENSAJE_DE_VALIDACION, MSG_REGISTRO_EXITOSO, TITULOMENSAJE, TITULO_MENSAJE } from '../../constantes/datos-solicitud.enum';
import { Tramite260513State, Tramite260513Store } from '../../estado/tramite260513Store.store';
import { AvisocalidadQuery } from '../../../../shared/estados/queries/aviso-calidad.query';
import { DatosDomicilioLegalQuery } from '../../../../shared/estados/queries/datos-domicilio-legal.query';
import { DatosDomicilioLegalService } from '../../../../shared/services/datos-domicilio-legal.service';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { GuardarAdapter_260513 } from '../../adapters/guardar-mapping.adapter';
import { Notificacion } from '@ng-mf/data-access-user';
import { PagoDerechosQuery } from '../../../../shared/estados/queries/pago-derechos.query';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { RegistroSolicitudService } from '@libs/shared/data-access-user/src/core/services/shared/registro-solicitud.service';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';

import { Tramite260513Query } from '../../estado/tramite260513Query.query';

import { PagoBancoService } from '../../../../shared/services/pago-banco.service';



/**
 * Represents the action and value associated with a button.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * Componente principal para la gestión de plaguicidas.
 * Contiene la lógica y la estructura del asistente de plaguicidas.
 */
@Component({
  selector: 'app-plaguicidas',
  templateUrl: './plaguicidas.component.html',
})
export class PlaguicidasComponent implements OnInit {
  /**
   * Controla si se puede saltar el paso de carga de documentos.
   */
  isSaltar: boolean = false;
  /**
 * @property {string} MENSAJE_DE_ERROR
 * @description
 * Propiedad usada para almacenar el mensaje de error actual.
 * Se inicializa como cadena vacía y se actualiza en función
 * de las validaciones o errores capturados en el flujo.
 */
  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;

  /**
 * @property {AccionBoton} accionDelBoton
 * @description
 * Almacena la acción del botón presionado en el wizard (continuar o anterior).
 * Permite controlar la navegación y el flujo de validaciones según la interacción del usuario.
 */
  accionDelBoton!: AccionBoton;
  /**
 * Evento para regresar a la sección de carga de documentos.
 * @type {EventEmitter<void>}
 */
  regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();
  /**
 * Indica si la confirmación sin pago de derechos está activa.
 * Valor 0 significa que no está confirmada, otros valores pueden indicar diferentes estados.
 */
  public confirmarSinPagoDeDerechos: number = 0;
  /**
 * Indica si se requieren datos de pago para el trámite actual.
 * @remarks
 * Esta propiedad controla la visualización y el manejo de información relacionada con pagos en el componente.
 */
  public requiresPaymentData: boolean = false;
  public payloadAdapter!: GuardarAdapter_260513;

  /**
   * Título del mensaje que se muestra en el componente.
   * Puede ser nulo si no está definido.
   * @type {string | null}
   */
  tituloMensaje: string | null = TITULO_MENSAJE;
  /**
        * Folio temporal de la solicitud.
        * Se utiliza para mostrar el folio en la notificación de éxito.
        */
  public alertaNotificacion!: Notificacion;
  /**
* @property {string} infoAlert
* @description
* Clase CSS para aplicar estilos a los mensajes de información.
*/
  public infoAlert = 'alert-info  text-center';

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
    * Identificador del tipo de trámite.
    * @type {string}
    */
  idTipoTramite: string = '260513';

  /**
 * ID del estado de la solicitud.
 * @type {number | null}
 */
  idSolicitudState: number | null = 0;
  /**
     * URL de la página actual.
     */
  public solicitudState!: Tramite260513State;

  /**
       * Evento para cargar archivos.
       * @type {EventEmitter<void>}
       */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
* Indica si el botón de carga de archivos está habilitado.
* @type {boolean}
*/
  activarBotonCargaArchivos: boolean = false;

  /**
 * Indica si la sección de carga de documentos está activa.
 * @type {boolean}
 */
  seccionCargarDocumentos: boolean = true;

  /**
   * Indica si la carga de documentos está en progreso.
   * @type {boolean}
   */
  cargaEnProgreso: boolean = true;

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

  /**
* Controla la visibilidad del modal de alerta.
* @property {boolean} mostrarAlerta
*/
  esMostrarAlerta: boolean = false;

  /**
* Controla la visibilidad del modal de alerta.
* @property {boolean} mostrarAlerta
*/
  public mostrarAlerta: boolean = false;

  /**
    * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
    */
  public formErrorAlert!: string;

  esFormaValido: boolean = false;
  /**
   * Lista de pasos del asistente.
   * Se obtiene de una constante definida en otro archivo.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Indice actual del paso en el asistente.
   * Se inicializa en 1.
   */
  indice: number = 1;

  constructor(
    private toastrService: ToastrService,
    private registroSolicitudService: RegistroSolicitudService,
    private avisoCalidadQuery: AvisocalidadQuery,
    private datosDomicilioLegalQuery: DatosDomicilioLegalQuery,
    private pagoDrenchosQuery: PagoDerechosQuery,
    private tramiteStore: Tramite260513Store,
    private tramiteQuery: Tramite260513Query,
    private datosDomicilioLegalService: DatosDomicilioLegalService,
    private pagoBancoService: PagoBancoService,
    private guardarAdapter: GuardarAdapter_260513
  ) {
   // 
  }

    ngOnInit(): void {
    this.tramiteQuery.selectTramiteState$.pipe().subscribe((data) => {
      this.solicitudState = data;
    });
    // Initialize payloadAdapter with required dependencies
    this.payloadAdapter = new GuardarAdapter_260513(
      this.avisoCalidadQuery,
      this.datosDomicilioLegalQuery,
      this.pagoDrenchosQuery
    );
  }
  /**
   * Título del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  /**
   * Título del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
* Estado del tramite Folio
*/
  public folioTemporal: number = 0;

  /**
  * Valor del aviso de privacidad.
  * @type {string}
  */
  AVISO_PRIVACIDAD_ADJUNTAR = AVISO.Aviso;
  /**
   * Maneja la acción del botón en el asistente.
   * Cambia el paso actual según la acción del botón.
   *
   * @param e - Objeto que contiene la acción y el valor del botón.
   */

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
   * Obtiene y procesa el valor del índice desde un evento de botón.
   * @method
   * @param {AccionBoton} e - Objeto con la acción y valor del botón
   */
  getValorIndice(e: AccionBoton): void {
     this.accionDelBoton = e;
    if (e.accion === 'cont') {
      let isValid = true;
      if (this.indice === 1 && this.pasoUnoComponent) {
        isValid = this.pasoUnoComponent.validOnButtonClick();

        if (!this.requiresPaymentData) {
          if (!this.pasoUnoComponent.pagoDerechosRef.validarContenedor()) {
            this.mostrarAlerta = true;
            this.seleccionarFilaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: '',
              mensaje: MENSAJE_DE_PAGE,
              cerrar: true,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'SI',
              txtBtnCancelar: 'NO',
              alineacionBtonoCerrar: 'flex-row-reverse'
            };
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          } 
          else if (!this.pasoUnoComponent.datosSolicitudRef?.validarClickDeBoton()) {
            this.confirmarSinPagoDeDerechos = 2;
          } 
          else if (!this.pasoUnoComponent.tercerosRelacionadosFabricanteRef?.validarContenedor()) {
            this.confirmarSinPagoDeDerechos = 3;
          } 
          else if (
            this.pasoUnoComponent.pagoDerechosRef.validarContenedor() &&
            this.pasoUnoComponent.datosSolicitudRef?.validarClickDeBoton() &&
            this.pasoUnoComponent.tercerosRelacionadosFabricanteRef?.validarContenedor()
          ) {
            this.guardarDatosApi(e);
          }
        }
           if (!isValid || (this.pasoUnoComponent.pagoDerechosRef &&
      this.pasoUnoComponent.pagoDerechosRef.isAnyFieldFilledButNotAll())) {
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
                         if(this.pasoUnoComponent.pagoDerechosRef.continuarButtonClicked){
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
     
          if(!this.pasoUnoComponent.datosSolicitudRef.validarClickDeBoton
            ()) {
                          this.confirmarSinPagoDeDerechos = 2;
              }
              else if (!this.pasoUnoComponent.tercerosRelacionadosFabricanteRef.validarContenedor()) {
                    this.confirmarSinPagoDeDerechos = 3;
              }
              else if(!this.pasoUnoComponent.pagoDerechosRef.validarContenedor() && !this.requiresPaymentData) {
                    this.confirmarSinPagoDeDerechos = 4;
              } 
     
                      
            
        }
        else{
              this.indice = e.valor;
              this.datosPasos.indice = this.indice;
              this.wizardComponent.atras();
            }
            
      }

  // guardarDatosApi(e: AccionBoton): void {
  //   const PAYLOAD = this.payloadAdapter.toFormPayload();
  //   let shouldNavigate = false;
  //   this.registroSolicitudService.postGuardarDatos(this.idTipoTramite, PAYLOAD).subscribe(response => {
  //     shouldNavigate = response.codigo === '00';
  //     if (!shouldNavigate) {
  //       const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
  //       this.formErrorAlert = PlaguicidasComponent.generarAlertaDeError(ERROR_MESSAGE);
  //       this.esFormaValido = true;
  //       this.indice = 1;
  //       this.datosPasos.indice = 1;
  //       this.wizardComponent.indiceActual = 1;
  //       this.seccionCargarDocumentos = false;
  //       setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  //       return;
  //     }
  //     if (shouldNavigate) {
  //       if (esValidObject(response) && esValidObject(response.datos)) {
  //         this.esFormaValido = false;
  //         const DATOS = response.datos as { id_solicitud?: number };
  //         const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
  //         this.idSolicitudState = ID_SOLICITUD;
  //       }
  //       let indiceActualizado = e.valor;
  //       if (e.accion === 'cont') {
  //         indiceActualizado = e.valor;
  //       }
  //       this.toastrService.success(response.mensaje);
  //       if (indiceActualizado > 0 && indiceActualizado < 5) {
  //         this.indice = indiceActualizado;
  //         this.datosPasos.indice = indiceActualizado;
  //         this.seccionCargarDocumentos = (this.indice === 2);
  //         if (e.accion === 'cont') {
  //           this.wizardComponent.siguiente();
  //         } else {
  //           this.wizardComponent.atras();
  //         }
  //       }
  //     } else {
  //       this.toastrService.error(response.mensaje);
  //     }
  //   });
  // }
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
             // Optionally update state from services if needed
    // this.datosDomicilioLegalService.updateFromForm();
    // this.pagoBancoService.updateFromForm();
    const PAYLOAD = this.guardarAdapter.toFormPayload();
    this.registroSolicitudService.postGuardarDatos('260513', PAYLOAD).subscribe(response => {
      const SHOULD_NAVIGATE = response.codigo === '00';
      if (!SHOULD_NAVIGATE) {
        const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
        this.formErrorAlert = PlaguicidasComponent.generarAlertaDeError(ERROR_MESSAGE);
        this.esFormaValido = true;
        this.indice = 1;
        this.datosPasos.indice = 1;
        this.datosPasos.txtBtnAnt = '';
        this.wizardComponent.indiceActual = 1;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }
      if (SHOULD_NAVIGATE) {
        if (esValidObject(response) && esValidObject(response.datos)) {
          this.esFormaValido = false;
          const DATOS = response.datos as { id_solicitud?: number };
          const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
          this.idSolicitudState = ID_SOLICITUD;
          this.folioTemporal = ID_SOLICITUD;
          this.tramiteStore.setIdSolicitud(ID_SOLICITUD);
        }
        // Calcular el nuevo índice basado en la acción
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
          if (this.wizardComponent) {
            if (e.accion === 'cont') {
              this.wizardComponent.siguiente();
            } else {
              this.wizardComponent.atras();
            }
            // Always sync indices after navigation
            this.indice = this.wizardComponent.indiceActual + 1;
            this.datosPasos.indice = this.indice;
            // Show 'Anterior' button only if not on Paso 1
            this.datosPasos.txtBtnAnt = this.indice > 1 ? 'Anterior' : '';
          }
        }
      } else {
        this.toastrService.error(response.mensaje);
      }
    });
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
    this.datosPasos.indice = this.indice;
    this.datosPasos.txtBtnAnt = this.indice > 1 ? 'Anterior' : '';
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

  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

  siguiente(): void {
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.indice;
    this.datosPasos.txtBtnAnt = this.indice > 1 ? 'Anterior' : '';
  }


  /**
 * @method obtenerNombreDelTítulo
 * @description
 * Devuelve el título a mostrar según el número de paso.
 *
 * @param {number} valor - Índice del paso actual.
 * @returns {string} - Título correspondiente.
 *
 * @example
 * ```typescript
 * const titulo = ContenedorDePasosComponent.obtenerNombreDelTítulo(2);
 * console.log(titulo); // 'Anexar requisitos'
 * ```
 */
  static obtenerNombreDelTítulo(valor: number): string {
      switch (valor) {
        case 1:
          return TITULOMENSAJE;
        case 2:
          return PASOS[1].titulo;
        case 3:
          return PASOS[2].titulo;
        default:
          return TITULOMENSAJE;
      }
    }
  /**
  * Selecciona una pestaña específica del wizard.
  * @method
  * @param {number} i - Índice de la pestaña a seleccionar
  */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
/**
  * Cierra el modal y realiza acciones según el valor proporcionado.
  *
  * @param value - Indica si se debe proceder con el pago de derechos. Si es `true`, se oculta la alerta y se requiere información de pago. Si es `false`, se oculta la alerta y se establece la confirmación sin pago de derechos.
  */
  cerrarModal(value:boolean): void {
                    this.mostrarAlerta = false;

                    if(value){
                    this.esFormaValido = false;
                    this.requiresPaymentData = true;
                    if(this.pasoUnoComponent.validOnButtonClick()){
                     this.guardarDatosApi(this.accionDelBoton);
                    }
                    else if(!this.pasoUnoComponent.datosSolicitudRef.validarClickDeBoton()) {
                          this.confirmarSinPagoDeDerechos = 2;
              }
              else if (!this.pasoUnoComponent.tercerosRelacionadosFabricanteRef.validarContenedor()) {
                    this.confirmarSinPagoDeDerechos = 3;
              }

                  }
                    else{
                      this.requiresPaymentData = false;
                      
                      if(this.pasoUnoComponent.validarTodosLosPasos()){
                        this.guardarDatosApi(this.accionDelBoton);
                      }
                      else if(!this.pasoUnoComponent.datosSolicitudRef.validarClickDeBoton()) {
                          this.confirmarSinPagoDeDerechos = 2;
              }
              else if (!this.pasoUnoComponent.tercerosRelacionadosFabricanteRef.validarContenedor()) {
                    this.confirmarSinPagoDeDerechos = 3;
              }
              else if(!this.pasoUnoComponent.pagoDerechosRef.validarContenedor()) {
                    this.confirmarSinPagoDeDerechos = 4;
              }
                    }
                    
                 
  // cerrarModal(value: boolean): void {
  //   this.mostrarAlerta = false;
  //   if (value) {
  //     this.requiresPaymentData = true;
  //     // After user confirms payment, re-validate all and only proceed if all are valid
  //     let isValid = true;
  //     if (this.pasoUnoComponent) {
  //       isValid = this.pasoUnoComponent.validOnButtonClick();
  //       if (!this.pasoUnoComponent.datosSolicitudRef?.validarClickDeBoton()) {
  //         this.confirmarSinPagoDeDerechos = 2;
  //         return;
  //       } else if (!this.pasoUnoComponent.tercerosRelacionadosFabricanteRef?.validarContenedor()) {
  //         this.confirmarSinPagoDeDerechos = 3;
  //         return;
  //       } else if (
  //         this.pasoUnoComponent.pagoDerechosRef.validarContenedor() &&
  //         this.pasoUnoComponent.datosSolicitudRef?.validarClickDeBoton() &&
  //         this.pasoUnoComponent.tercerosRelacionadosFabricanteRef?.validarContenedor()
  //       ) {
  //         const E: AccionBoton = { accion: 'cont', valor: this.indice + 1 };
  //         this.guardarDatosApi(E);
  //         return;
  //       }
  //     }
  //     if (!isValid) {
  //       this.formErrorAlert = this.MENSAJE_DE_ERROR;
  //       this.esFormaValido = true;
  //       this.datosPasos.indice = this.indice;
  //       setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  //       return;
  //     }
  //   } else {
  //     this.confirmarSinPagoDeDerechos = 4;
  //     // Optionally reset or show error, do not navigate
  //   }
  // }
  }
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


}