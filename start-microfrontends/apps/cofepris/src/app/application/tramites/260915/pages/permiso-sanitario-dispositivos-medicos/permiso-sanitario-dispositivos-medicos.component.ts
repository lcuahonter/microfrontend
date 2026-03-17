import { AVISO } from '@libs/shared/data-access-user/src';
import { Component } from '@angular/core';
import { DatosPasos } from '@libs/shared/data-access-user/src';
import { esValidObject,getValidDatos,ListaPasosWizard ,Notificacion,RegistroSolicitudService} from '@libs/shared/data-access-user/src';
import { PASOS } from '@libs/shared/data-access-user/src';
import { ViewChild,EventEmitter } from '@angular/core';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { Subject, takeUntil } from 'rxjs';
import { DatosDelSolicituteSeccionQuery } from '../../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { DatosDomicilioLegalQuery } from '../../../../shared/estados/queries/datos-domicilio-legal.query';
import { DomicilioQuery } from '../../../../shared/estados/queries/domicilio.query';
import { DomicilioState, DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import {MENSAJE_DE_VALIDACION,MENSAJE_DE_VALIDACION_PAGO_DERECHOS,MSG_REGISTRO_EXITOSO } from '../../constants/constantes.enum';
import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import {Solicitud260915State,Solicitud260915Store} from '../../estados/tramites260915.store';
import {Solicitud260915Query} from '../../estados/tramites260915.query';
import { DatosDomicilioLegalState, DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { ToastrService } from 'ngx-toastr';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { GuardarAdapter_260915 } from '../../adapters/guardar-payload.adapter';
/**
 * Interfaz para definir las acciones de los botones en el flujo del wizard.
 * @property accion - Define la acción a realizar, como avanzar ('cont') o retroceder.
 * @property valor - El índice o paso relacionado con la acción.
 */
interface AccionBoton {
  /**
   * Define la acción a realizar, como avanzar ('cont') o retroceder.
   */
  accion: string;
  /**
   * El índice o paso relacionado con la acción.
   */
  valor: number;
}

/**
 * Componente principal para el trámite de Permiso Sanitario de Dispositivos Médicos.
 * Gestiona la navegación entre los pasos del wizard, la visualización de avisos y la integración
 * con el componente hijo WizardComponent.
 *
 * @selector app-permiso-sanitario-dispositivos-medicos
 * @templateUrl ./permiso-sanitario-dispositivos-medicos.component.html
 * @styleUrl ./permiso-sanitario-dispositivos-medicos.component.scss
 */
@Component({
  selector: 'app-permiso-sanitario-dispositivos-medicos',
  templateUrl: './permiso-sanitario-dispositivos-medicos.component.html',
  styleUrls: ['./permiso-sanitario-dispositivos-medicos.component.scss'],
})
export class PermisoSanitarioDispositivosMedicosComponent {
  /**
   * Lista de pasos del wizard.
   * Utiliza la configuración predefinida en el objeto `PASOS`.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice actual del paso activo en el wizard.
   * Valor predeterminado: 1.
   */
  public indice = 1;

  /**
   * Configuración de los datos necesarios para los pasos del wizard.
   * Incluye el número de pasos, el índice actual y los textos de los botones "Anterior" y "Continuar".
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Referencia al componente hijo `WizardComponent`.
   * Se utiliza para controlar la navegación entre los pasos del wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  
    /**
    * @property {PasoUnoComponent} pasoUnoComponent
    * @description
    * Referencia al componente hijo `PasoUnoComponent` mediante
    * `@ViewChild`. Permite acceder a sus métodos y propiedades
    * desde este componente padre.
    */
    @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;
  

  /**
   * Una cadena que representa la clase CSS para una alerta de información.
   * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
   */
  public infoAlert = 'alert-info';
  
  /**
   * Asigna el aviso de privacidad simplificado al atributo `TEXTOS`.
   */
  TEXTOS = AVISO;
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
   * @property {boolean} requiresPaymentData
   * @description
   * Indica si se requieren datos de pago para continuar con el trámite.
   */
  public requiresPaymentData: boolean = false;

   /**
     * Indica si la carga de archivos está en progreso.
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
   * Indica si el botón para cargar archivos está habilitado.
   */
    activarBotonCargaArchivos: boolean = false;
  
    /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
    seccionCargarDocumentos: boolean = true;
  
    /**
     * Controla la visibilidad del modal de alerta.
     * @property {boolean} mostrarAlerta
     */
    public mostrarAlerta: boolean = false;
  
    /** Nueva notificación relacionada con el RFC. */
    public seleccionarFilaNotificacion!: Notificacion;
  
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
 * Estado del tramite Folio
 */
 public folioTemporal: number = 0;

 /**
 * Folio temporal de la solicitud.
 * Se utiliza para mostrar el folio en la notificación de éxito.
 */
 public alertaNotificacion!: Notificacion;

    /**
     * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
     * }
     */
    esFormaValido: boolean = false;
  
    /**
     * @property {string} MENSAJE_DE_ERROR
     * @description
     * Propiedad usada para almacenar el mensaje de error actual.
     * Se inicializa como cadena vacía y se actualiza en función
     * de las validaciones o errores capturados en el flujo.
     */
    MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;
  
    /**
     * @property {Tramite260905State} storeData
     * @description Estado de la tienda para el trámite 260905.
     */
    storeData!: Solicitud260915State;
  
    /**
     * @property {DatosDelSolicituteSeccionState} datosDelSolicitud
     * @description Estado de la tienda para los datos de la solicitud.
     */
    datosDelSolicitud!: DatosDelSolicituteSeccionState
  
    /**
     * Identificador numérico de la solicitud actual.
     * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
     */
    idSolicitudState: number | null = 0;
  
    /**  * @property {DatosDomicilioLegalState} manifestoState
     * @description Estado de la tienda para los datos del domicilio legal.
     */
    manifestoState!: DatosDomicilioLegalState;
    
    /**  * @property {DomicilioState} domicilioState
     * @description Estado de la tienda para los datos del domicilio.
     * */
    domicilioState!: DomicilioState;
  
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
  

  
    DatosDelSolicitudDatos!: DatosDelSolicituteSeccionState;

    manifestoDatos!: DatosDomicilioLegalState;
  
    representanteLegalDatos!: DomicilioState;

      terceros_derechosDatos!: Solicitud260915State;
    

    
          /**
       * @property {AccionBoton} accionDelBoton
       * @description
       * Almacena la acción del botón presionado en el wizard (continuar o anterior).
       * Permite controlar la navegación y el flujo de validaciones según la interacción del usuario.
       */
      accionDelBoton!: AccionBoton;


     

  /**
   * Constructor del componente.
   * Inicializa los servicios necesarios para la funcionalidad del componente.
   */
  constructor( private datosDelSolicituteSeccionQuery: DatosDelSolicituteSeccionQuery,
      private datosDelSolicituteSeccionStore: DatosDelSolicituteSeccionStateStore,
      private manifestoQuery: DatosDomicilioLegalQuery,
      private manifestoStore: DatosDomicilioLegalStore,
      private domicilioQuery: DomicilioQuery,
      private domicilioStore: DomicilioStore,
      private registroSolicitudService: RegistroSolicitudService, 
      private toastrService: ToastrService,
    private tramite260915Query: Solicitud260915Query,
        private tramite260915Store:Solicitud260915Store, ) {
    // Constructor vacío, no requiere inicialización adicional.
  }

   ngOnInit(): void {
      this.tramite260915Query.selectSolicitud260915$.pipe(
        takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.storeData = data;
      });
  
      this.datosDelSolicituteSeccionQuery.selectSolicitud$.pipe(
        takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.datosDelSolicitud = data;
      });
      
      this.manifestoQuery.selectSolicitud$.pipe(
        takeUntil(this.destroyNotifier$))
      .subscribe((state) => {
        this.manifestoState = state;
      });
      this.domicilioQuery.selectSolicitud$.pipe(
        takeUntil(this.destroyNotifier$))
      .subscribe((state) => {
          this.domicilioState = state;
      });
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.registroSolicitudService.parcheOpcionesPrellenadas(260915, 202950005).subscribe((res:any) => {
        if(res && res.datos){
         GuardarAdapter_260915.patchToStore(res.datos, this.tramite260915Store);
          GuardarAdapter_260915.patchToStoreDatosSolicitud(res.datos, this.datosDelSolicituteSeccionStore);
         GuardarAdapter_260915.patchToStoreManifestos(res.datos, this.manifestoStore);
          GuardarAdapter_260915.patchToStoreDomicilio(res.datos, this.domicilioStore);
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
                this.DatosDelSolicitudDatos= this.pasoUnoComponent.datosSolicitudComponent.getStoreState();
                this.manifestoDatos= this.pasoUnoComponent.manifiestosComponent.getStoreState();
                this.representanteLegalDatos= this.pasoUnoComponent.representanteLegalComponent.getStoreState();
                this.tramite260915Query.selectSolicitud260915$.pipe().subscribe((data) => {
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
                           } else if(this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() && this.pasoUnoComponent?.validarContenedor() && !this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
                             this.confirmarSinPagoDeDerechos = 3;
                           } else if(this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() && this.pasoUnoComponent?.validarContenedor() && this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
                              this.guardarDatosApi(e);
                            }
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
    const PAYLOAD = GuardarAdapter_260915.toFormPayload(
      this.DatosDelSolicitudDatos,
      this.manifestoDatos,
      this.representanteLegalDatos,
      this.terceros_derechosDatos
    );
  
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
          this.tramite260915Store.setIdSolicitud(ID_SOLICITUD);
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
   * Handles API errors by setting the error message, updating the form state, and scrolling to the top.
   * @param errorMessage The error message to display.
   */
  private handleApiError(errorMessage: string): void {
    this.formErrorAlert = PermisoSanitarioDispositivosMedicosComponent.generarAlertaDeError(errorMessage);
    this.esFormaValido = true; // Mark the form as invalid
    this.indice = 1;
    this.datosPasos.indice = 1;
    this.wizardComponent.indiceActual = 1;
    
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
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
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
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

  /**
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}