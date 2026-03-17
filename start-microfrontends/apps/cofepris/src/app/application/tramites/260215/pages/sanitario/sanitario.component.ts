/* eslint-disable complexity */
import { AVISO, ListaPasosWizard,Notificacion, PASOS, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MENSAJE_DE_PAGE, MENSAJE_DE_VALIDACION, MSG_REGISTRO_EXITOSO, TITULOMENSAJE } from '../../constants/medicos-uso.enum';
import { Observable, catchError, map, switchMap, take, throwError } from 'rxjs';

import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';

import { NotificacionesComponent } from '@libs/shared/data-access-user/src/tramites/components/notificaciones/notificaciones.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { RegistroSolicitudService } from '@libs/shared/data-access-user/src/core/services/shared/registro-solicitud.service';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';

import { GuardarAdapter_260215 } from '../../adapters/ampliacion-servicios.adapter';
import { ServiciosPermisoSanitarioService } from '../../services/servicios-permiso-sanitario.service';
import { Tramite260215Query } from '../../estados/queries/tramite260215.query';

import { Solicitud260215State, Tramite260215Store } from '../../estados/tramites/tramite260215.store';
import { ToastrService } from 'ngx-toastr';


interface AccionBoton {
  accion: string;
  valor: number;
}

@Component({
  selector: 'app-sanitario',
  templateUrl: './sanitario.component.html',
})
export class SanitarioComponent implements OnInit {
  /**
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
  public formErrorAlert!: string;
  /**
  * ID del tipo de trámite.
  */
  idTipoTramite: string = '260215';

     /**
       * Folio temporal de la solicitud.
       * Se utiliza para mostrar el folio en la notificación de éxito.
       */
       public alertaNotificacion!: Notificacion;
  

  /**
   * Flag to enable/disable API calls for testing navigation flow
   * Set to true when API endpoint is working correctly
   */
  private enableAPICall: boolean = true;

  /**
    * Evento para cargar archivos.
    */
  cargarArchivosEvento: EventEmitter<void> = new EventEmitter<void>();
  /**
 * Control para activar botón de carga de archivos.
 */
  activarBotonCargaArchivos: boolean = false;

  /**
 * Control de sección de carga de documentos.
 */
  seccionCargarDocumentos: boolean = true;

  /**
       * Indica si la carga de documentos está en progreso.
       * @type {boolean}
       */
  cargaEnProgreso: boolean = true;

  /**
   * @property {ListaPasosWizard[]} pasos - Lista de pasos para el asistente (wizard) del trámite sanitario.
   * Utiliza la constante PASOS para inicializar la secuencia de pasos que el usuario debe seguir.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice actual utilizado para controlar el estado o la posición dentro del componente.
   * @type {number}
   * @default 1
   */
  indice: number = 1;

  /**
   * Referencia al componente `WizardComponent` dentro de la vista.
   * Permite acceder y manipular las funcionalidades del asistente de pasos (wizard)
   * desde el componente actual.
   *
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  /**
 * ID de la solicitud.
 */
  idSolicitudState: number | null = 0;
  

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

  /**
   * Clase CSS para mostrar una alerta de error en caso de validación fallida.
   * Matches 260218 behavior so the template can render a global error alert.
   */
  public infoError: string = 'alert-danger text-center';

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
 * Estado del tramite Folio
 */
 public folioTemporal: number = 0;

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
 * @property {boolean} isSaltar
 * @description
 * Indica si se debe saltar al paso de firma. Controla la navegación
 * directa al paso de firma en el wizard.
 * @default false - No salta por defecto
 */
  isSaltar: boolean = false;
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
   * Referencia al componente de notificaciones para depuración.
   * Nos permite inspeccionar si el modal fue abierto por el componente hijo.
   */
  @ViewChild(NotificacionesComponent)
  notificacionesChild?: NotificacionesComponent;

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
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   */
  esFormaValido: boolean = false;

  /**
   * Estado del formulario de registro IMMEX.
   */
  storeData!: Solicitud260215State;

   /**
     * @property {string | null} tituloMensaje
     * @description Título del mensaje que se muestra en el wizard.
     * Inicializado con el valor de `TITULOMENSAJE`.
     */
    tituloMensaje: string | null = TITULOMENSAJE;

  constructor(private query: Tramite260215Query,
    private tramite260215Store: Tramite260215Store,
    private registroSolicitudService: RegistroSolicitudService,
    private serviciosPermisoSanitarioService: ServiciosPermisoSanitarioService,
    private toastrService: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.query.selectTramiteState$.pipe().subscribe((data) => {
      this.storeData = data;
    });
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

   getValorIndice(e: AccionBoton): void {
     this.accionDelBoton = e;
     if (e.accion === 'cont') {
       let isValid = true;
       if (this.indice === 1 && this.pasoUnoComponent) {
         isValid = this.pasoUnoComponent.validarPasoUno();
         if (!this.requiresPaymentData) {
           if (!this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor()) {
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
           } else if (!this.pasoUnoComponent.contenedorDeDatosSolicitudComponent.validarContenedor()) {
             this.confirmarSinPagoDeDerechos = 2;
           } else if (!this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
             this.confirmarSinPagoDeDerechos = 3;
           } else if (
             this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() &&
             this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validarContenedor() &&
             this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()
           ) {
             this.guardarDatosApi(e);
           }
         }
         if (
           !isValid ||
           (this.pasoUnoComponent.pagoDeDerechosContenedoraComponent &&
             this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.isAnyFieldFilledButNotAll())
         ) {
           this.formErrorAlert = this.MENSAJE_DE_ERROR;
           this.esFormaValido = true;
           this.datosPasos.indice = this.indice;
           this.confirmarSinPagoDeDerechos = 2;
           setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
           return;
         } else if (isValid && this.pasoUnoComponent.validarTodosLosPasos() && this.requiresPaymentData) {
           this.esFormaValido = false;
           this.guardarDatosApi(e);
           return;
         } else if (isValid && this.requiresPaymentData) {
           this.esFormaValido = false;
           this.guardarDatosApi(e);
           return;
         } else if (!this.pasoUnoComponent.validarTodosLosPasos()) {
           this.esFormaValido = false;
           if (this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.continuarButtonClicked) {
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
       if (!this.pasoUnoComponent.contenedorDeDatosSolicitudComponent.validarContenedor()) {
         this.confirmarSinPagoDeDerechos = 2;
       } else if (!this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
         this.confirmarSinPagoDeDerechos = 3;
       } else if (
         !this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() &&
         !this.requiresPaymentData
       ) {
         this.confirmarSinPagoDeDerechos = 4;
       }
     } else {
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
     const PAYLOAD = GuardarAdapter_260215.toFormPayload(this.storeData);
     let shouldNavigate = false;
     this.registroSolicitudService.postGuardarDatos('260215', PAYLOAD).subscribe(response => {
       shouldNavigate = response.codigo === '00';
       if (!shouldNavigate) {
         const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
         this.formErrorAlert = SanitarioComponent.generarAlertaDeError(ERROR_MESSAGE);
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
           this.tramite260215Store.setIdSolicitud(ID_SOLICITUD);
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
   * Guarda los datos del formulario utilizando el servicio estándar compartido.
   * Convierte el estado actual a payload y envía los datos al servidor.
   * @returns {Observable<BaseResponse<unknown>>}
   */
  guardarDatosAPI(): Observable<BaseResponse<unknown>> {
    return this.query.selectTramiteState$.pipe(
      take(1), // Tomar solo el primer valor para evitar loops
      map(ESTADO_ACTUAL => GuardarAdapter_260215.toFormPayload(ESTADO_ACTUAL)),
      switchMap(FORM_PAYLOAD => {
        return this.registroSolicitudService.postGuardarDatos('260215', FORM_PAYLOAD);
      }),
      catchError(error => {
        console.error('Error al guardar:', error);
        return throwError(() => error);
      })
    );
  }

  /**
  * Maneja el evento de carga de documentos
  */
manejaEventoCargaDocumentos(carga: boolean): void {
  this.activarBotonCargaArchivos = carga;
}

  /**
* Maneja cuando la carga se ha realizado
*/
 cargaRealizada(cargaRealizada: boolean): void {
  this.seccionCargarDocumentos = cargaRealizada ? false : true;
}


  /**
 * Maneja el progreso de carga
 */
 onCargaEnProgreso(carga: boolean): void {
  this.cargaEnProgreso = carga;
}
  /**
  * Actualiza la sección de carga de documentos según el paso actual
  */
  private actualizarSeccionCargarDocumentos(): void {
    this.seccionCargarDocumentos = this.indice === 2;
  }

  /**
   * Maneja el clic en cargar archivos
   */
onClickCargaArchivos(): void {
  this.cargarArchivosEvento.emit();
}

  /**
    * Botón anterior para paso 2
    */
  anterior(): void {
    this.indice = 1;
    this.datosPasos.indice = this.indice;
    this.actualizarSeccionCargarDocumentos();
    if (this.wizardComponent) {
      this.wizardComponent.atras();
    }
  }


  /**
   * Guarda la solicitud de ampliación de servicios utilizando el adaptador para convertir el estado
   * y enviar los datos al servidor.
   * @returns {Observable<BaseResponse<{ id_solicitud: number }>>}
   */
  onGuardar(): Observable<BaseResponse<{ id_solicitud: number }>> {
    return this.query.selectTramiteState$.pipe(
      take(1),
      map(ESTADO_ACTUAL => GuardarAdapter_260215.toFormPayload(ESTADO_ACTUAL)),
      switchMap(FORM_PAYLOAD => {
        return (this.registroSolicitudService.postGuardarDatos(this.idTipoTramite, FORM_PAYLOAD) as Observable<BaseResponse<{ id_solicitud?: number }>>).pipe(
          map((response: BaseResponse<{ id_solicitud?: number }>) => {
            return {
              ...response,
              datos: {
                id_solicitud: response.datos?.id_solicitud ?? 0
              }
            } as BaseResponse<{ id_solicitud: number }>;
          })
        );
      }),
      catchError(error => {
        console.error('Error al guardar:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Paso 2: Cuando usuario hace click en 'Continuar' después de cargar archivos
   * Avanza a paso 3 (firma)
   */
  continuarDespuesDeCarga(): void {
    this.indice = 3;
    this.datosPasos.indice = 3;
    this.actualizarSeccionCargarDocumentos();
    if (this.wizardComponent) {
      this.wizardComponent.siguiente();
    }
  }

  /**
   * Método para avanzar al siguiente paso (paso 3) después de la carga de documentos.
   * Se asegura de que el índice y el estado de los pasos se actualicen correctamente,
   * y llama al método `siguiente` del componente `WizardComponent` si está disponible.
   */
siguiente(): void {
  this.wizardComponent.siguiente();
  this.indice = this.wizardComponent.indiceActual + 1;
  this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
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
           return PASOS[1].titulo;
         case 3:
           return PASOS[2].titulo;
         default:
           return TITULOMENSAJE;
       }
     }
}
