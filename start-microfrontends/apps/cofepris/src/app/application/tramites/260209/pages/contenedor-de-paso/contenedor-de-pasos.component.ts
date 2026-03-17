/* eslint-disable complexity */
import {
  AVISO,
  AccionBoton,
  AlertComponent,
  BtnContinuarComponent,
  DatosPasos,
  ListaPasosWizard,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  esValidObject,
  getValidDatos, 
} from '@ng-mf/data-access-user';
import { Component, ViewChild } from '@angular/core';
import { EventEmitter, OnInit } from '@angular/core';

import { MENSAJE_DE_PAGE, MSG_REGISTRO_EXITOSO, PASOS,TITULOMENSAJE, TITULO_MENSAJE} from '../../constants/destinados-donacio.enum';
import { Subject, takeUntil } from 'rxjs';
import { Tramite260209State, Tramite260209Store } from '../../estados/tramite260209Store.store';
import { CommonModule } from '@angular/common';
import { GuardarAdapter_260209 } from '../../adapters/guardar-payload.adapter';
import { ImportacionDestinadosDonacioService } from '../../services/importacion-destinados-donacio.service';
import { MENSAJE_DE_VALIDACION } from '../../constants/destinados-donacio.enum';
import { RegistroSolicitudService } from '@ng-mf/data-access-user';

import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

import { WizardComponent } from '@ng-mf/data-access-user';

import { Notificacion } from '@ng-mf/data-access-user'; import { ToastrService } from 'ngx-toastr';


import { Tramite260209Query } from '../../estados/tramite260209Query.query';




@Component({
  selector: 'app-contenedor-de-pasos',
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
    ],
  templateUrl: './contenedor-de-pasos.component.html',
  styleUrls: ['./contenedor-de-paso.component.scss'],
})
export class ContenedorDePasosComponent implements OnInit {
  /**
   * Título del mensaje que se muestra en el componente.
   * Puede ser nulo si no está definido.
   * @type {string | null}
   */
  tituloMensaje: string | null = TITULO_MENSAJE;

  /**
   * Lista de pasos para el componente wizard.
   * @type {ListaPasosWizard[]}
   */
  pasos: ListaPasosWizard[] = PASOS;
   /**
     * @property {string} TEXTOS
     * @description
     * Texto de aviso utilizado en el componente.
     */
    TEXTOS: string = AVISO.Aviso;

  /**
  * Índice del paso actual en el wizard.
  * @type {number}
  */
  indice: number = 1;

  /**
  * Referencia al componente Wizard hijo.
  * @type {WizardComponent}
  */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

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
   * Datos de configuración para los pasos del wizard.
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
 * Clase CSS para mostrar una alerta de error.
 */
  infoError = 'alert-danger text-center';

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
 * @property {string} infoAlert
 * @description
 * Clase CSS para aplicar estilos a los mensajes de información.
 */
  public infoAlert = 'alert-info  text-center';



  /**
   * Indica si se requieren datos de pago para el trámite actual.
   * @remarks
   * Esta propiedad controla la visualización y el manejo de información relacionada con pagos en el componente.
   */
  public requiresPaymentData: boolean = false;


  /**
   * Indica si la confirmación sin pago de derechos está activa.
   * Valor 0 significa que no está confirmada, otros valores pueden indicar diferentes estados.
   */
  public confirmarSinPagoDeDerechos: number = 0;

  /**
  * ID del estado de la solicitud.
  * @type {number | null}
  */
  idSolicitudState: number | null = 0;
  /**
* Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
* }
*/


  /**
   * Identificador del tipo de trámite.
   * @type {string}
   */
  idTipoTramite: string = '260209';

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
  public solicitudState!: Tramite260209State;

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


/**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

  /**
     * Evento para cargar archivos.
     * @type {EventEmitter<void>}
     */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
 * Indica si la sección de carga de documentos está activa.
 * @type {boolean}
 */
  seccionCargarDocumentos: boolean = true;
 /**
 * Indica si el botón de carga de archivos está habilitado.
 * @type {boolean}
 */
  activarBotonCargaArchivos: boolean = false;

    /**
   * Indica si la carga de documentos está en progreso.
   * @type {boolean}
   */
  cargaEnProgreso: boolean = true;
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


  /**
   * Evento para regresar a la sección de carga de documentos.
   * @type {EventEmitter<void>}
   */
  regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

  constructor(
    private tramiteStore: Tramite260209Store,
        private tramiteQuery: Tramite260209Query,
        private toastrService: ToastrService,
        public registroSolicitudService: RegistroSolicitudService
  ) { }

    ngOnInit(): void {
    this.tramiteQuery.selectTramiteState$.pipe().subscribe((data) => {
      this.solicitudState = data;
    });
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
   * Selecciona una pestaña específica del wizard.
   * @method
   * @param {number} i - Índice de la pestaña a seleccionar
   */
  seleccionaTab(i: number): void {
    this.indice = i;
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
               isValid = this.pasoUnoComponent.validarPasoUno();

               if(!this.requiresPaymentData) {
               if(!this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor()){
                 this.mostrarAlerta=true;
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
  * @param value - Indica si se debe proceder con el pago de derechos. Si es `true`, se oculta la alerta y se requiere información de pago. Si es `false`, se oculta la alerta y se establece la confirmación sin pago de derechos.
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
             const PAYLOAD = GuardarAdapter_260209.toFormPayload(this.solicitudState);
             let shouldNavigate = false;
             this.registroSolicitudService.postGuardarDatos('260209', PAYLOAD).subscribe(response => {
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
                   if (this.wizardComponent) {
                     if (e.accion === 'cont') {
                       this.wizardComponent.siguiente();
                       // Ensure sync after navigation
                       this.indice = this.wizardComponent.indiceActual + 1;
                       this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
                     } else {
                       this.wizardComponent.atras();
                       this.indice = this.wizardComponent.indiceActual + 1;
                       this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
                     }
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
   * Método estático que obtiene el nombre del título según el valor del paso.
   * @param {number} valor - Valor numérico del paso actual
   * @returns {string} - Título correspondiente al paso
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
   * @method blancoObligatoria
   * @description Método para manejar el evento de documentos obligatorios en blanco.
   * Actualiza la bandera `isSaltar` basada en el estado recibido.
   * @param {boolean} enBlanco - Indica si hay documentos obligatorios en blanco.
   * @return {void}
   */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }
}
