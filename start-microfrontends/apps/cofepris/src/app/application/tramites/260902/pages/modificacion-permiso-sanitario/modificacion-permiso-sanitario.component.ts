import { AVISO, DatosPasos, ListaPasosWizard, Notificacion, RegistroSolicitudService, WizardComponent, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDomicilioLegalState, DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DomicilioState, DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import { ERROR_FORMA_ALERT, MENSAJE_DE_VALIDACION, MENSAJE_DE_VALIDACION_PAGO_DERECHOS, MODIFICACION_PERMISO_DATA, MODIFICACION_PERMISO_ENUM } from '../../constantes/modificacion-permiso.enum';
import { Tramite260902State, Tramite260902Store } from '../../estados/tramite260902Store.store';
import { DatosDelSolicituteSeccionQuery } from '../../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { DatosDomicilioLegalQuery } from '../../../../shared/estados/queries/datos-domicilio-legal.query';
import { DomicilioQuery } from '../../../../shared/estados/queries/domicilio.query';
import { GuardarAdapter_260902 } from '../../adapters/guardar-payload.adapter';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite260902Query } from '../../estados/tramite260902Query.query';

interface AccionBoton {
  accion: string;
  valor: number;
}
@Component({
  selector: 'app-modificacion-permiso-sanitario',
  templateUrl: './modificacion-permiso-sanitario.component.html',
})

export class ModificacionPermisoSanitarioComponent implements OnInit{
     /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;
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
   * @property {string} tituloMensaje
   * Título principal mostrado en la parte superior según el paso actual.
   */
  tituloMensaje: string = MODIFICACION_PERMISO_DATA;

  /**
   * @property {ListaPasosWizard[]} pasos
   * Lista de pasos del wizard obtenidos desde una constante externa.
   */
  pasos: ListaPasosWizard[] = MODIFICACION_PERMISO_ENUM;

  /**
   * @property {number} indice
   * Índice actual del paso seleccionado (empieza en 1).
   */
  indice: number = 1;

  /**
   * @property {WizardComponent} wizardComponent
   * Referencia al componente Wizard para controlar navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;


  /**
      * @property {PasoUnoComponent} pasoUnoComponent
      * @description
      * Referencia al componente hijo `PasoUnoComponent` mediante
      * `@ViewChild`. Permite acceder a sus métodos y propiedades
      * desde este componente padre.
      */
      @ViewChild('pasoUno') pasoUnoComponent!: PasoUnoComponent ;

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
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
   */
  idSolicitudState: number | null = 0;

   /**
   * Estado de la solicitud actual.
   *
   * @type {Tramite260902State}
   * @memberof SolicitudPageComponent
   */
  idTipoTRamite: string = '260902';

  
     /**
   * @property {string} MENSAJE_DE_ERROR
   * @description
   * Propiedad usada para almacenar el mensaje de error actual.
   * Se inicializa como cadena vacía y se actualiza en función
   * de las validaciones o errores capturados en el flujo.
   */
     MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;
  

  /**
   * URL de la página actual.
   */
    public solicitudState!: Tramite260902State;
    public datosState!: DatosDelSolicituteSeccionState;
    public representanteLegalState!: DomicilioState;
    public manifestosState!: DatosDomicilioLegalState;

     /**
 * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
 * }
 */
esFormaValido: boolean = false;

  /** Nueva notificación relacionada con el RFC. */
    public seleccionarFilaNotificacion!: Notificacion;


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
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

    /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;

  /**
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * @ignore
   * Este método es ignorado por Compodoc.
   */
  cargaEnProgreso: boolean = true;

   /**
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
   public formErrorAlert!:string;

   accionDelBoton!: AccionBoton;

   public folioTemporal: number = 0;


  constructor(
    private tramiteStore: Tramite260902Store,
    private tramiteQuery: Tramite260902Query,
    private toastrService: ToastrService,
    public registroSolicitudService: RegistroSolicitudService,
    private datosDelSolicitudStore: DatosDelSolicituteSeccionStateStore,
    private datosDelSolicitudQuery: DatosDelSolicituteSeccionQuery,
    private representanteLegalQuery: DomicilioQuery,
    private manifestoQuery: DatosDomicilioLegalQuery,
    private manifestoStore: DatosDomicilioLegalStore,
     private domicilioStore: DomicilioStore,
  ) { }

  ngOnInit(): void {
    this.tramiteQuery.selectTramiteState$.pipe().subscribe((data) => {
      this.solicitudState = data;
    });

    this.datosDelSolicitudQuery.selectSolicitud$.pipe().subscribe((data) => {
      this.datosState = data;
    });

    this.representanteLegalQuery.selectSolicitud$.pipe().subscribe((data) => {
      this.representanteLegalState = data;
    });

    this.manifestoQuery.selectSolicitud$.pipe().subscribe((data) => {
      this.manifestosState = data;
    });

    //  this.registroSolicitudService.parcheOpcionesPrellenadas(260902, 203009265).subscribe((res:any) => {
    //   if(res && res.datos){
    //     GuardarAdapter_260902.patchToStore(res.datos, this.tramiteStore);
    //     GuardarAdapter_260902.patchToStoreDatosSolicitud(res.datos, this.datosDelSolicitudStore);
    //     GuardarAdapter_260902.patchToStoreManifestos(res.datos, this.manifestoStore);
    //     GuardarAdapter_260902.patchToStoreDomicilio(res.datos, this.domicilioStore);
    //   }
    // });
  }

  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
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
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado del botón de carga de archivos.
   *  carga - Indica si la carga de documentos está activa o no.
   * {void} No retorna ningún valor.
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
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
                   if(!this.pasoUnoComponent.pagoDeDerechos.validarContenedor()){
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
                  else if(!this.pasoUnoComponent.datosdelmodificacion?.formularioSolicitudValidacion() && !this.pasoUnoComponent.manifiestosDeclaraciones?.validarClickDeBoton() && !this.pasoUnoComponent.representeLegal?.validarClickDeBoton() ) {
                              this.confirmarSinPagoDeDerechos = 2;
                  }
                  else if (!this.pasoUnoComponent.tercerosRelacionados.validarContenedor()) {
                        this.confirmarSinPagoDeDerechos = 3;
                  }
                  else if(this.pasoUnoComponent.pagoDeDerechos.validarContenedor() && (this.pasoUnoComponent.datosdelmodificacion?.formularioSolicitudValidacion() && this.pasoUnoComponent.manifiestosDeclaraciones?.validarClickDeBoton() && this.pasoUnoComponent.representeLegal?.validarClickDeBoton()) && this.pasoUnoComponent.tercerosRelacionados.validarContenedor()) {
                    this.guardarDatosApi(e);
                  }
              }  
    
    
                          if (!isValid || (this.pasoUnoComponent.pagoDeDerechos &&
                            this.pasoUnoComponent.pagoDeDerechos.isAnyFieldFilledButNotAll())) {
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
                             if(this.pasoUnoComponent.pagoDeDerechos.continuarButtonClicked){
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
         
              if(!this.pasoUnoComponent.datosdelmodificacion?.formularioSolicitudValidacion() && !this.pasoUnoComponent.manifiestosDeclaraciones?.validarClickDeBoton() && !this.pasoUnoComponent.representeLegal?.validarClickDeBoton() ) {
                              this.confirmarSinPagoDeDerechos = 2;
                  }
                  else if (!this.pasoUnoComponent.tercerosRelacionados.validarContenedor()) {
                        this.confirmarSinPagoDeDerechos = 3;
                  }
                  else if(!this.pasoUnoComponent.pagoDeDerechos.validarContenedor() && !this.requiresPaymentData) {
                        this.confirmarSinPagoDeDerechos = 4;
                  } 
         
                          
                
            }
            else{
                  this.indice = e.valor;
                  this.datosPasos.indice = this.indice;
                  this.wizardComponent.atras();
                }
                
          } 
          
  guardarDatosApi(e: AccionBoton): void {
           const PAYLOAD = GuardarAdapter_260902.toFormPayload(this.solicitudState,this.datosState,this.manifestosState, this.representanteLegalState);
           let shouldNavigate = false;
           this.registroSolicitudService.postGuardarDatos('260902', PAYLOAD).subscribe(response => {
             shouldNavigate = response.codigo === '00';
             if (!shouldNavigate) {
               const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
               this.formErrorAlert = ModificacionPermisoSanitarioComponent.generarAlertaDeError(ERROR_MESSAGE);
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
  
  cerrarModal(value:boolean): void {
                    this.mostrarAlerta = false;

                    if(value){
                    this.esFormaValido = false;
                    this.requiresPaymentData = true;
                    if(this.pasoUnoComponent.validarPasoUno()){
                     this.guardarDatosApi(this.accionDelBoton);
                    }
                    else if(!this.pasoUnoComponent.datosdelmodificacion?.formularioSolicitudValidacion() && !this.pasoUnoComponent.manifiestosDeclaraciones?.validarClickDeBoton() && !this.pasoUnoComponent.representeLegal?.validarClickDeBoton() ) {
                          this.confirmarSinPagoDeDerechos = 2;
              }
              else if (!this.pasoUnoComponent.tercerosRelacionados.validarContenedor()) {
                    this.confirmarSinPagoDeDerechos = 3;
              }

                  }
                    else{
                      this.requiresPaymentData = false;
                      
                      if(this.pasoUnoComponent.validarTodosLosPasos()){
                        this.guardarDatosApi(this.accionDelBoton);
                      }
                      else if(!this.pasoUnoComponent.datosdelmodificacion?.formularioSolicitudValidacion() && !this.pasoUnoComponent.manifiestosDeclaraciones?.validarClickDeBoton() && !this.pasoUnoComponent.representeLegal?.validarClickDeBoton() ) {
                          this.confirmarSinPagoDeDerechos = 2;
              }
              else if (!this.pasoUnoComponent.tercerosRelacionados.validarContenedor()) {
                    this.confirmarSinPagoDeDerechos = 3;
              }
              else if(!this.pasoUnoComponent.pagoDeDerechos.validarContenedor()) {
                    this.confirmarSinPagoDeDerechos = 4;
              }
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
