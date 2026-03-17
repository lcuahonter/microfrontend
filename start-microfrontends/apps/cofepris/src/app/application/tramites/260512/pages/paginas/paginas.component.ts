/* eslint-disable complexity */
import { AVISO, DatosPasos, ListaPasosWizard, Notificacion, PASOS, RegistroSolicitudService, WizardComponent, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ERROR_FORMA_ALERT, MENSAJE_DE_PAGE, MENSAJE_DE_VALIDACION, MSG_REGISTRO_EXITOSO,TITULOMENSAJE, TITULO_MENSAJE } from '../../constantes/constante260512.enum';
import { Tramite260512State, Tramite260512Store } from '../../estados/stores/tramite260512Store.store';
import { AccionBoton } from '@ng-mf/data-access-user';
import { AvisocalidadQuery } from '../../../../shared/estados/queries/aviso-calidad.query';
import { DatosComponent } from '../datos/datos.component';
import { DatosDomicilioLegalQuery } from '../../../../shared/estados/queries/datos-domicilio-legal.query';
import { GuardarAdapter_260512 } from '../../adapters/guardar-payload.adapter';
import { PagoDerechosQuery } from '../../../../shared/estados/queries/pago-derechos.query';
import { ToastrService } from 'ngx-toastr';
import { Tramite260512Query } from '../../estados/queries/tramite260512Query.query';


/**
 * @component PaginasComponent
 * @description
 * Componente principal para gestionar el flujo de pasos en el wizard del trámite 260514.
 * Permite la navegación entre diferentes pantallas/pasos utilizando el componente Wizard.
 * Controla el índice del paso actual y los datos necesarios para la navegación.
 * 
 */
@Component({
  selector: 'app-paginas',
  templateUrl: './paginas.component.html',
})
export class PaginasComponent implements OnInit {
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
* Controla la visibilidad del modal de alerta.
* @property {boolean} mostrarAlerta
*/
  public mostrarAlerta: boolean = false;
  /**
* @property {string} infoAlert
* @description
* Clase CSS para aplicar estilos a los mensajes de información.
*/
  public infoAlert = 'alert-info  text-center';


  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;
  /**
  * Indica si se requieren datos de pago para el trámite actual.
  * @remarks
  * Esta propiedad controla la visualización y el manejo de información relacionada con pagos en el componente.
  */
  public requiresPaymentData: boolean = false;
  /**
* @property {boolean} isSaltar
* @description
* Indica si se debe saltar al paso de firma. Controla la navegación
* directa al paso de firma en el wizard.
* @default false - No salta por defecto
*/
  isSaltar: boolean = false;

   public payloadAdapter!: GuardarAdapter_260512;

  /**
  * Indica si la confirmación sin pago de derechos está activa.
  * Valor 0 significa que no está confirmada, otros valores pueden indicar diferentes estados.
  */
  public confirmarSinPagoDeDerechos: number = 0;

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
 /**
* @ignore
* Este método es ignorado por Compodoc.
*/
  cargaEnProgreso: boolean = true;
  /**
* Indica si la sección de carga de documentos está activa.
* Se inicializa en true para mostrar la sección de carga de documentos al inicio.
*/
  seccionCargarDocumentos: boolean = true;
   /**
 * ID del estado de la solicitud.
 * @type {number | null}
 */
  idSolicitudState: number | null = 0;

    /**
* Controla la visibilidad del modal de alerta.
* @property {boolean} mostrarAlerta
*/
  esMostrarAlerta: boolean = false;

  /**
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
* Evento que se emite para cargar archivos.
* Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
*/
  cargarArchivosEvento = new EventEmitter<void>();

  /**
  * Estado de la solicitud actual.
  *
  * @type {Tramite260203State}
  * @memberof SolicitudPageComponent
  */
  idTipoTRamite: string = '260512';

  /**
   * URL de la página actual.
   */
  public solicitudState!: Tramite260512State;

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
   * Lista de pasos del asistente.
   * Se obtiene de una constante definida en otro archivo.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
    * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
    */
  public formErrorAlert!: string;

  esFormaValido: boolean = false;

  /**
   * Indice actual del paso en el asistente.
   * Se inicializa en 1.
   */
  indice: number = 1;

  /**
* @property {string} MENSAJE_DE_ERROR
* @description
* Propiedad usada para almacenar el mensaje de error actual.
* Se inicializa como cadena vacía y se actualiza en función
* de las validaciones o errores capturados en el flujo.
*/
  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;
  /**
   * Título del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  @ViewChild(DatosComponent) datosComponent!: DatosComponent;
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
   * Título del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  constructor(
    private tramite260512Query: Tramite260512Query, 
    private guardarAdapter260512: GuardarAdapter_260512, 
    private registroSolicitudService: RegistroSolicitudService, 
    private tramite260512Store: Tramite260512Store, 
    private toastrService: ToastrService,
    private avisoCalidadQuery: AvisocalidadQuery,
    private datosDomicilioLegalQuery: DatosDomicilioLegalQuery,
    private pagoDrenchosQuery: PagoDerechosQuery,
  ) {
    //
  }
  ngOnInit(): void {
     this.tramite260512Query.selectTramiteState$.pipe().subscribe((data) => {
         this.solicitudState = data;
       });
       // Initialize payloadAdapter with required dependencies
       this.payloadAdapter = new GuardarAdapter_260512(
         this.avisoCalidadQuery,
         this.datosDomicilioLegalQuery,
         this.pagoDrenchosQuery
       );
  }
  /**
   * Maneja la acción del botón en el asistente.
   * Cambia el paso actual según la acción del botón.
   *
   * @param e - Objeto que contiene la acción y el valor del botón.
   */
 getValorIndice(e: AccionBoton): void {
      this.accionDelBoton = e;
     if (e.accion === 'cont') {
       let isValid = true;
       if (this.indice === 1 && this.datosComponent) {
         isValid = this.datosComponent.validOnButtonClick();
 
         if (!this.requiresPaymentData) {
           if (!this.datosComponent.pagoDerechosRef.validarContenedor()) {
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
           else if (!this.datosComponent.datosSolicitudRef?.validarClickDeBoton()) {
             this.confirmarSinPagoDeDerechos = 2;
           } 
           else if (!this.datosComponent.tercerosRelacionadosFabricanteRef?.validarContenedor()) {
             this.confirmarSinPagoDeDerechos = 3;
           } 
           else if (
             this.datosComponent.pagoDerechosRef.validarContenedor() &&
             this.datosComponent.datosSolicitudRef?.validarClickDeBoton() &&
             this.datosComponent.tercerosRelacionadosFabricanteRef?.validarContenedor()
           ) {
             this.guardarDatosApi(e);
           }
         }
            if (!isValid || (this.datosComponent.pagoDerechosRef &&
       this.datosComponent.pagoDerechosRef.isAnyFieldFilledButNotAll())) {
                         this.formErrorAlert = this.MENSAJE_DE_ERROR;
                         this.esFormaValido = true;  
                         this.datosPasos.indice = this.indice;
                         this.confirmarSinPagoDeDerechos = 2;
                         setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
                         return;
                       }
                       else if(isValid && this.datosComponent.validarTodosLosPasos() && this.requiresPaymentData){
                          this.esFormaValido = false;
                          this.guardarDatosApi(e);
                          return;
                       }
                       else if(isValid && this.requiresPaymentData){
                         this.esFormaValido = false;
                          this.guardarDatosApi(e);
                          return;
                       } else if(!this.datosComponent.validarTodosLosPasos()){
                          this.esFormaValido = false;
                          if(this.datosComponent.pagoDerechosRef.continuarButtonClicked){
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
      
           if(!this.datosComponent.datosSolicitudRef.validarClickDeBoton
             ()) {
                           this.confirmarSinPagoDeDerechos = 2;
               }
               else if (!this.datosComponent.tercerosRelacionadosFabricanteRef.validarContenedor()) {
                     this.confirmarSinPagoDeDerechos = 3;
               }
               else if(!this.datosComponent.pagoDerechosRef.validarContenedor() && !this.requiresPaymentData) {
                     this.confirmarSinPagoDeDerechos = 4;
               } 
      
                       
             
         }
         else{
               this.indice = e.valor;
               this.datosPasos.indice = this.indice;
               this.wizardComponent.atras();
             }
             
       }
    /* @method guardarDatosApi
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
    const PAYLOAD = this.payloadAdapter.toFormPayload();
    this.registroSolicitudService.postGuardarDatos('260512', PAYLOAD).subscribe(response => {
      const SHOULD_NAVIGATE = response.codigo === '00';
      if (!SHOULD_NAVIGATE) {
        const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
        this.formErrorAlert = PaginasComponent.generarAlertaDeError(ERROR_MESSAGE);
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
          this.tramite260512Store.setIdSolicitud(ID_SOLICITUD);
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
  
  /*
* Cierra el modal y realiza acciones según el valor proporcionado.
*
* @param value - Indica si se debe proceder con el pago de derechos. Si es `true`, se oculta la alerta y se requiere información de pago. Si es `false`, se oculta la alerta y se establece la confirmación sin pago de derechos.
*/
  cerrarModal(value:boolean): void {
                    this.mostrarAlerta = false;

                    if(value){
                    this.esFormaValido = false;
                    this.requiresPaymentData = true;
                    if(this.datosComponent.validOnButtonClick()){
                     this.guardarDatosApi(this.accionDelBoton);
                    }
                    else if(!this.datosComponent.datosSolicitudRef.validarClickDeBoton()) {
                          this.confirmarSinPagoDeDerechos = 2;
              }
              else if (!this.datosComponent.tercerosRelacionadosFabricanteRef.validarContenedor()) {
                    this.confirmarSinPagoDeDerechos = 3;
              }

                  }
                    else{
                      this.requiresPaymentData = false;
                      
                      if(this.datosComponent.validarTodosLosPasos()){
                        this.guardarDatosApi(this.accionDelBoton);
                      }
                      else if(!this.datosComponent.datosSolicitudRef.validarClickDeBoton()) {
                          this.confirmarSinPagoDeDerechos = 2;
              }
              else if (!this.datosComponent.tercerosRelacionadosFabricanteRef.validarContenedor()) {
                    this.confirmarSinPagoDeDerechos = 3;
              }
              else if(!this.datosComponent.pagoDerechosRef.validarContenedor()) {
                    this.confirmarSinPagoDeDerechos = 4;
              }
                    }
                    
                 
  // cerrarModal(value: boolean): void {
  //   this.mostrarAlerta = false;
  //   if (value) {
  //     this.requiresPaymentData = true;
  //     // After user confirms payment, re-validate all and only proceed if all are valid
  //     let isValid = true;
  //     if (this.datosComponent) {
  //       isValid = this.datosComponent.validOnButtonClick();
  //       if (!this.datosComponent.datosSolicitudRef?.validarClickDeBoton()) {
  //         this.confirmarSinPagoDeDerechos = 2;
  //         return;
  //       } else if (!this.datosComponent.tercerosRelacionadosFabricanteRef?.validarContenedor()) {
  //         this.confirmarSinPagoDeDerechos = 3;
  //         return;
  //       } else if (
  //         this.datosComponent.pagoDerechosRef.validarContenedor() &&
  //         this.datosComponent.datosSolicitudRef?.validarClickDeBoton() &&
  //         this.datosComponent.tercerosRelacionadosFabricanteRef?.validarContenedor()
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


  /**
   * 
     * Método para navegar a la sección anterior del wizard.
     * Actualiza el índice y el estado de los pasos.
     * {void} No retorna ningún valor.
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
   * Maneja el estado de progreso de la carga de documentos.
   * Actualiza la variable `cargaEnProgreso` según el estado recibido.
   * @param carga - Indica si la carga está en progreso (`true`) o no (`false`).
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }
  /**
 * Método para navegar a la siguiente sección del wizard.
 * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
 * {void} No retorna ningún valor.
 */
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
  * Emite un evento para cargar archivos.
  * {void} No retorna ningún valor.
  */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
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
   * @method blancoObligatoria
   * @description Método para manejar el evento de documentos obligatorios en blanco.
   * Actualiza la bandera `isSaltar` basada en el estado recibido.
   * @param {boolean} enBlanco - Indica si hay documentos obligatorios en blanco.
   * @return {void}
   */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
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
