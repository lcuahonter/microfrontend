/* eslint-disable complexity */
import { AVISO, AccionBoton, AlertComponent, BtnContinuarComponent, DatosPasos, ListaPasosWizard, Notificacion, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, RegistroSolicitudService, WizardComponent, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDomicilioLegalState, DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DomicilioState, DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import { MENSAJE_DE_VALIDACION, MENSAJE_DE_VALIDACION_PAGO_DERECHOS, MSG_REGISTRO_EXITOSO, TITULOMENSAJE } from '../../constantes/psicotropicos-poretorno.enum';
import { Subject, takeUntil } from 'rxjs';
import { Tramite260918State, Tramite260918Store } from '../../estados/tramite260918.store';
import { CommonModule } from '@angular/common';
import { DatosDelSolicitudModificacionComponent } from '../../../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { DatosDelSolicituteSeccionQuery } from '../../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { DatosDomicilioLegalQuery } from '../../../../shared/estados/queries/datos-domicilio-legal.query';
import { DomicilioQuery } from '../../../../shared/estados/queries/domicilio.query';
import { GuardarAdapter_260918 } from '../../adapters/guardar-payload.adapter';
import { PERMISO_MAQUILA } from '../../constantes/enmienda-permiso-sanitario.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite260918Query } from '../../estados/tramite260918.query';



/**
 * Componente para la modificación del permiso de laboratorio.
 */
@Component({
  selector: 'app-modificacion-permiso-lab',
  standalone: true,
      imports: [
        CommonModule,
        WizardComponent,
        PasoUnoComponent,
        BtnContinuarComponent,
        AlertComponent,
        PasoFirmaComponent,
        PasoCargaDocumentoComponent,
        NotificacionesComponent,
        DatosDelSolicitudModificacionComponent
      ],
  templateUrl: './modificacion-permiso-lab.component.html',
})
export class ModificacionPermisoLabComponent implements OnInit {
    /**
     * Título del mensaje que se muestra en el componente.
     * Puede ser nulo si no está definido.
     * @type {string | null}
     */
    tituloMensaje: string | null = TITULOMENSAJE;
  /**
   * Referencia al componente del asistente (wizard) para controlar sus acciones.
   */
  @ViewChild('WizardComponent') wizardComponent!: WizardComponent;

  /**
       * @property {Datos260918Component} datos260918Component
       * @description
       * Referencia al componente hijo `datos260918Component` mediante
       * `@ViewChild`. Permite acceder a sus métodos y propiedades
       * desde este componente padre.
     */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;
  
  /**
     * Esta variable se utiliza para almacenar la lista de pasos.
     */
  pantallasPasos: ListaPasosWizard[] = PERMISO_MAQUILA;

  /**
   * @property {number} indice
   * @description Índice actual del paso seleccionado en el wizard.
   * Inicializado con el valor `1`.
   */
  indice: number = 1;

  public confirmarSinPagoDeDerechos: number = 0;

  /**
 * Controla la visibilidad del modal de alerta.
 * @property {boolean} mostrarAlerta
 */
  public mostrarAlerta: boolean = false;

  /**
   * Indica si se requie 
   * @remarks
   * Esta propiedad controla la visualización y el manejo de los datos de pago en el componente.
   * Si es `true`, se solicitarán los datos de pago al usuario.
   */
  public requiresPaymentData: boolean = false;


  /**
   * @property {Tramite260918State} storeData
   * @description
   * Almacena el estado actual del trámite 260918 para la modificación de permiso de laboratorio.
   * Esta propiedad se utiliza para gestionar y acceder a los datos relevantes del proceso en el componente.
   */
  storeData!: Tramite260918State;

  /**
* Clase CSS para mostrar una alerta de error.
*/
  infoError = 'alert-danger text-center';
  
  /**
  * Estado de la solicitud actual.
  *
  * @type {Tramite260918State}
  * @memberof SolicitudPageComponent
  */
  idTipoTRamite: string = '260918';


  /**
  * Identificador numérico de la solicitud actual.
  * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
  */
  idSolicitudState: number | null = 0;

  solicitudState!: Tramite260918State;
  

  /**
   * Evento que se emite para indicar que se deben cargar los archivos.
   * Útil para notificar a otros componentes o servicios cuando se requiere iniciar el proceso de carga de archivos.
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
     * Indica si la carga de archivos está en progreso.
     */
  cargaEnProgreso: boolean = true;

  /**
   * Indica si el botón para cargar archivos debe estar activado.
   * Cuando es `true`, el usuario puede interactuar con el botón de carga de archivos.
   * @type {boolean}
   */
  activarBotonCargaArchivos: boolean = false;

  /**
 * @property {boolean} isSaltar
 * @description
 * Indica si se debe saltar al paso de firma. Controla la navegación
 * directa al paso de firma en el wizard.
 * @default false - No salta por defecto
 */
  isSaltar: boolean = false;

  /**
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
  public formErrorAlert!: string;
  /**
   * @property {string} MENSAJE_DE_ERROR
   * @description
   * Propiedad usada para almacenar el mensaje de error actual.
   * Se inicializa como cadena vacía y se actualiza en función
   * de las validaciones o errores capturados en el flujo.
   */
  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

   /**
  * Controla la visibilidad del modal de alerta.
  * @property {boolean} mostrarAlerta
  */
  esMostrarAlerta: boolean = false;
  /**
  * Indica si la sección de carga de documentos está activa.
  * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
  */
  seccionCargarDocumentos: boolean = true;

 /**
 * @property {string} infoAlert
 * @description
 * Clase CSS para aplicar estilos a los mensajes de información.
 */
  public infoAlert = 'alert-info  text-center';


  /**
   * @property {string} TEXTOS - Contiene el texto de aviso utilizado en el componente,
   * obtenido de la constante `AVISO.Aviso`. Este texto se muestra para informar al usuario
   * sobre aspectos relevantes relacionados con la modificación de permisos de laboratorio.
   */
  TEXTOS: string = AVISO.Aviso;


  /**
   * Notificador utilizado para destruir suscripciones observables cuando el componente se destruye.
   * Emite un valor void para indicar la finalización de los observables asociados.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
 * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
 */
  esFormaValido: boolean = false;

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
      * @property {DatosDelSolicituteSeccionState} datosDelSolicitud
      * @description Estado de la tienda para los datos de la solicitud.
      */
  datosDelSolicitud!: DatosDelSolicituteSeccionState


  /**  * @property {DatosDomicilioLegalState} manifestoState
   * @description Estado de la tienda para los datos del domicilio legal.
   */
  manifestoState!: DatosDomicilioLegalState;

  /**  * @property {DomicilioState} domicilioState
    * @description Estado de la tienda para los datos del domicilio.
    * */
  domicilioState!: DomicilioState;
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
   * @propiedades
   * - `nroPasos`: Número total de pasos basado en la longitud de `pantallasPasos`.
   * - `indice`: Índice actual del paso.
   * - `txtBtnAnt`: Texto que se muestra en el botón para retroceder al paso anterior.
   * - `txtBtnSig`: Texto que se muestra en el botón para avanzar al siguiente paso.
   *
   * @descripción
   * Objeto que contiene la configuración y estado de los pasos en el flujo de la aplicación.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  constructor(
    private tramite260918Query: Tramite260918Query,
    public registroSolicitudService: RegistroSolicitudService,
    private toastrService: ToastrService,
    private tramite260918Store: Tramite260918Store,
    private GuardarAdapter_260918: GuardarAdapter_260918,
    private datosDelSolicituteSeccionQuery: DatosDelSolicituteSeccionQuery,
    private datosDelSolicituteSeccionStore: DatosDelSolicituteSeccionStateStore,
    private manifestoQuery: DatosDomicilioLegalQuery,
    private manifestoStore: DatosDomicilioLegalStore,
    private domicilioQuery: DomicilioQuery,
    private domicilioStore: DomicilioStore,) { }

  /**
   * @inheritdoc
   * 
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe a varios observables para obtener y almacenar datos relevantes en el estado del componente:
   *   - `tramite260918Query.selectTramite260918$`: Obtiene y almacena los datos del trámite.
   *   - `datosDelSolicituteSeccionQuery.selectSolicitud$`: Obtiene y almacena los datos del solicitante.
   *   - `manifestoQuery.selectSolicitud$`: Obtiene y almacena el estado del manifiesto.
   *   - `domicilioQuery.selectSolicitud$`: Obtiene y almacena el estado del domicilio.
   * - Realiza una petición para obtener opciones prellenadas y actualiza los stores correspondientes usando los métodos del adaptador `GuardarAdapter_260918`.
   * - Utiliza `takeUntil(this.destroyNotifier$)` para evitar fugas de memoria al destruir el componente.
   */
  // ngOnInit(): void {
  //   this.tramite260918Query.selectTramite260918$.pipe(
  //     takeUntil(this.destroyNotifier$))
  //     .subscribe((data) => {
  //       this.storeData = data;
  //     });
  //   // Always sync datosPasos.indice with indice on init
  //   this.datosPasos.indice = this.indice;

  //   this.datosDelSolicituteSeccionQuery.selectSolicitud$.pipe(
  //     takeUntil(this.destroyNotifier$))
  //     .subscribe((data) => {
  //       this.datosDelSolicitud = data;
  //     });

  //   this.manifestoQuery.selectSolicitud$.pipe(
  //     takeUntil(this.destroyNotifier$))
  //     .subscribe((state) => {
  //       this.manifestoState = state;
  //     });
  //   this.domicilioQuery.selectSolicitud$.pipe(
  //     takeUntil(this.destroyNotifier$))
  //     .subscribe((state) => {
  //       this.domicilioState = state;
  //     });

  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   this.registroSolicitudService.parcheOpcionesPrellenadas(260918, 202950827).subscribe((res: any) => {
  //     if (res && res.datos) {
  //       GuardarAdapter_260918.patchToStore(res.datos, this.tramite260918Store);
  //       GuardarAdapter_260918.patchToStoreDatosSolicitud(res.datos, this.datosDelSolicituteSeccionStore);
  //       GuardarAdapter_260918.patchToStoreManifestos(res.datos, this.manifestoStore);
  //       GuardarAdapter_260918.patchToStoreDomicilio(res.datos, this.domicilioStore);
  //     }
  //   });

  // }

  ngOnInit(): void {
  this.tramite260918Query.selectTramite260918$.pipe().subscribe((data) => {
      this.solicitudState = data;
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
      
        }

  /**
   * @descripción
   * Método para actualizar el índice del paso actual basado en la acción y el valor proporcionados.
   *
   * @param e - Objeto de tipo `AccionBoton` que contiene la acción a realizar y el valor asociado.
   * 
   * @detalles
   * - Si el valor está entre 1 y 4 (exclusivo), actualiza el índice.
   * - Si la acción es 'cont', avanza al siguiente paso.
   * - Si la acción no es 'cont', retrocede al paso anterior.
   */
  getValorIndice(e: AccionBoton): void {
     this.accionDelBoton = e;
     if (e.accion === 'cont') {
        let isValid = true;
          if (this.indice === 1 && this.pasoUnoComponent) {
                isValid = this.requiresPaymentData ? this.pasoUnoComponent.validarPasoUno() : this.pasoUnoComponent.validarTodosLosPasos();
              }
              this.datosDelSolicitud= this.pasoUnoComponent.datosSolicitudComponent.getStoreState();
              this.manifestoState= this.pasoUnoComponent.manifiestosComponent.getStoreState();
              this.domicilioState= this.pasoUnoComponent.representanteLegalComponent.getStoreState();
              this.tramite260918Query.selectTramite260918$.pipe().subscribe((data) => {
                this.solicitudState= data;
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
  // getValorIndice(e: AccionBoton): void {
  //     this.accionDelBoton = e;
  //     if (e.accion === 'cont') {
  //        let isValid = true;
  //          if (this.indice === 1 && this.pasoUnoComponent) {
  //                isValid = this.pasoUnoComponent.validarPasoUno();
  
  //                if(!this.requiresPaymentData) {
  //                if(!this.pasoUnoComponent.pagoDeDerechos.validarContenedor()){
  //                  this.mostrarAlerta=true;
  //                  this.seleccionarFilaNotificacion = {
  //                    tipoNotificacion: 'alert',
  //                    categoria: 'danger',
  //                    modo: 'action',
  //                    titulo: '',
  //                    mensaje: MENSAJE_DE_VALIDACION_PAGO_DERECHOS,
  //                    cerrar: true,
  //                    tiempoDeEspera: 2000,
  //                    txtBtnAceptar: 'SI',
  //                    txtBtnCancelar: 'NO',
  //                    alineacionBtonoCerrar:'flex-row-reverse'
  //                  }
  //                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  //               } 
  //               else if(!this.pasoUnoComponent.datosdelmodificacion.formularioSolicitudValidacion()) {
  //                           this.confirmarSinPagoDeDerechos = 2;
  //               }
  //               else if (!this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
  //                     this.confirmarSinPagoDeDerechos = 3;
  //               }
  //               else if(this.pasoUnoComponent.pagoDeDerechos.validarContenedor() && this.pasoUnoComponent.datosdelmodificacion?.formularioSolicitudValidacion() && this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
  //                 this.guardarDatosApi(e);
  //               }
  //           }  
  
  
  //                       if (!isValid || (this.pasoUnoComponent.pagoDeDerechos &&
  //       this.pasoUnoComponent.pagoDeDerechos.isAnyFieldFilledButNotAll())) {
  //                         this.formErrorAlert = this.MENSAJE_DE_ERROR;
  //                         this.esFormaValido = true;  
  //                         this.datosPasos.indice = this.indice;
  //                         this.confirmarSinPagoDeDerechos = 2;
  //                         setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  //                         return;
  //                       }
  //                       else if(isValid && this.pasoUnoComponent.validarPasoUno() && this.requiresPaymentData){
  //                          this.esFormaValido = false;
  //                          this.guardarDatosApi(e);
  //                          return;
  //                       }
  //                       else if(isValid && this.requiresPaymentData){
  //                         this.esFormaValido = false;
  //                          this.guardarDatosApi(e);
  //                          return;
  //                       } else if(!this.pasoUnoComponent.validarTodosLosPasos()){
  //                          this.esFormaValido = false;
  //                          if(this.pasoUnoComponent.pagoDeDerechos.continuarButtonClicked){
  //                           this.formErrorAlert = this.MENSAJE_DE_ERROR;
  //                           this.esFormaValido = true;
  //                          }
  //                          this.indice = 1;
  //                          this.datosPasos = {
  //                          ...this.datosPasos,
  //                          indice: 1,  
  //                       };
  //                     }
                      
  //             }
       
  //           if(!this.pasoUnoComponent.datosdelmodificacion.formularioSolicitudValidacion()) {
  //                           this.confirmarSinPagoDeDerechos = 2;
  //               }
  //               else if (!this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
  //                     this.confirmarSinPagoDeDerechos = 3;
  //               }
  //               else if(!this.pasoUnoComponent.pagoDeDerechos.validarContenedor() && !this.requiresPaymentData) {
  //                     this.confirmarSinPagoDeDerechos = 4;
  //               } 
       
                        
              
  //         }
  //         else{
  //               this.indice = e.valor;
  //               this.datosPasos.indice = this.indice;
  //               this.wizardComponent.atras();
  //             }
              
  //       }

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
            const PAYLOAD = GuardarAdapter_260918.toFormPayload(this.solicitudState,this.datosDelSolicitud,this.manifestoState,this.domicilioState,this.solicitudState);
          
            
             this.registroSolicitudService.postGuardarDatos('260918', PAYLOAD).subscribe({
              next: (response) => {
                const SHOULDNAVIGATE = response.codigo === '00';
          
                if (!SHOULDNAVIGATE) {
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
                  this.tramite260918Store.setIdSolicitud(ID_SOLICITUD);
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
//  guardarDatosApi(e: AccionBoton): void {
      //         const PAYLOAD = GuardarAdapter_260918.toFormPayload(this.storeData, this.datosDelSolicitud, this.manifestoState, this.domicilioState);
      //        let shouldNavigate = false;
      //        this.registroSolicitudService.postGuardarDatos('260209', PAYLOAD).subscribe(response => {
      //          shouldNavigate = response.codigo === '00';
      //          if (!shouldNavigate) {
      //            const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
      //            this.formErrorAlert = ModificacionPermisoLabComponent.generarAlertaDeError(ERROR_MESSAGE);
      //            this.esFormaValido = true;
      //            this.indice = 1;
      //            this.datosPasos.indice = 1;
      //            this.wizardComponent.indiceActual = 1;
      //            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
      //            return;
      //          }
      //          if (shouldNavigate) {
      //            if (esValidObject(response) && esValidObject(response.datos)) {
      //              this.esFormaValido = false;
      //              const DATOS = response.datos as { id_solicitud?: number };
      //              const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
      //              this.idSolicitudState = ID_SOLICITUD;
      //              this.folioTemporal = ID_SOLICITUD;
      //              this.tramite260918Store.setIdSolicitud(ID_SOLICITUD);
      //            }
      //            // Calcular el nuevo índice basado en la acción
      //            let indiceActualizado = e.valor;
      //            if (e.accion === 'cont') {
      //              indiceActualizado = e.valor;
      //            }
      //            this.toastrService.success(response.mensaje);
      //            if (indiceActualizado > 0 && indiceActualizado < 5) {
      //              this.alertaNotificacion = {
      //                             tipoNotificacion: 'banner',
      //                             categoria: 'success',
      //                             modo: 'action',
      //                             titulo: '',
      //                             mensaje: MSG_REGISTRO_EXITOSO(String(this.folioTemporal)),
      //                             cerrar: true,
      //                             txtBtnAceptar: '',
      //                             txtBtnCancelar: '',
      //                           };
      //              this.indice = indiceActualizado;
      //              this.datosPasos.indice = indiceActualizado;
      //              if (this.wizardComponent) {
      //                if (e.accion === 'cont') {
      //                  this.wizardComponent.siguiente();
      //                  // Ensure sync after navigation
      //                  this.indice = this.wizardComponent.indiceActual + 1;
      //                  this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
      //                } else {
      //                  this.wizardComponent.atras();
      //                  this.indice = this.wizardComponent.indiceActual + 1;
      //                  this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
      //                }
      //              }
      //            }
      //          } else {
      //            this.toastrService.error(response.mensaje);
      //          }
      //        });
      //      }

       /**
   * Handles API errors by setting the error message, updating the form state, and scrolling to the top.
   * @param errorMessage The error message to display.
   */
 private handleApiError(errorMessage: string): void {
  this.formErrorAlert = ModificacionPermisoLabComponent.generarAlertaDeError(errorMessage);
  this.esFormaValido = true; // Mark the form as invalid
  this.indice = 1;
  this.datosPasos.indice = 1;
  this.wizardComponent.indiceActual = 1;
  
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
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
   * Cierra el modal y realiza acciones según el valor proporcionado.
   *
   * @param value - Indica si se debe proceder con el flujo de pago de derechos (`true`) o sin pago de derechos (`false`).
   *
   * - Si `value` es `true`, oculta la alerta y establece que se requieren datos de pago.
   * - Si `value` es `false`, oculta la alerta y actualiza el estado para confirmar que no se requiere pago de derechos.
   */
  //  cerrarModal(value:boolean): void {
  //                   this.mostrarAlerta = false;

  //                   if(value){
  //                   this.esFormaValido = false;
  //                   this.requiresPaymentData = true;
  //                   if(this.pasoUnoComponent.validarPasoUno()){
  //                    this.guardarDatosApi(this.accionDelBoton);
  //                   }
  //                   else if(!this.pasoUnoComponent.datosSolicitudComponent.formularioSolicitudValidacion()) {
  //                         this.confirmarSinPagoDeDerechos = 2;
  //             }
  //             else if (!this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
  //                   this.confirmarSinPagoDeDerechos = 3;
  //             }

  //                 }
  //                   else{
  //                     this.requiresPaymentData = false;
                      
  //                     if(this.pasoUnoComponent.validarTodosLosPasos()){
  //                       this.guardarDatosApi(this.accionDelBoton);
  //                     }
  //                     else if(!this.pasoUnoComponent.datosSolicitudComponent.formularioSolicitudValidacion()) {
  //                         this.confirmarSinPagoDeDerechos = 2;
  //             }
  //             else if (!this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
  //                   this.confirmarSinPagoDeDerechos = 3;
  //             }
  //             else if(!this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor()) {
  //                   this.confirmarSinPagoDeDerechos = 4;
  //             }
  //                   }
                    
  //                }

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
 * Método para manejar el evento de carga de documentos.
 * Actualiza el estado de la sección de carga de documentos.
 *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
 * {void} No retorna ningún valor.
 */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }
  /** 
 * Maneja el estado de progreso de la carga de documentos.
 * Actualiza la variable `cargaEnProgreso` según el estado recibido.
 * @param carga - Indica si la carga está en progreso (`true`) o no (`false`).
 */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
 * Emite un evento para cargar archivos.
 * {void} No retorna ningún valor.
 */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
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

  /**
    * Método para navegar a la siguiente sección del wizard.
    * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
    * {void} No retorna ningún valor.
    */
  siguiente(): void {
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
   * @method obtenerNombreDelTítulo
   * @description Devuelve el título correspondiente al paso actual.
   * @param {number} valor - Índice del paso.
   * @returns {string} Título del paso.
   */
  static obtenerNombreDelTítulo(valor: number): string {
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
  public static generarAlertaDeError(mensajes: string): string {
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
}
