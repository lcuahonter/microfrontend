/* eslint-disable complexity */
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


import {
  AVISO,
  AccionBoton,
  AlertComponent,
  BtnContinuarComponent,
  DatosPasos,
  ListaPasosWizard,
  Notificacion,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  RegistroSolicitudService,
  WizardComponent,
  esValidObject,
  getValidDatos
} from '@ng-mf/data-access-user';

import { CommonModule } from '@angular/common';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';

import { MENSAJE_DE_PAGE, MENSAJE_DE_VALIDACION, MSG_REGISTRO_EXITOSO, PASOS, TITULOMENSAJE } from '../../constants/tratamientos-especiales.enum';

import { GuardarAdapter_260207 } from '../../adapters/guardar-payload.adapter';

import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Tramite260207Query } from '../../estados/tramite260207Query.query';
import { Tramite260207State } from '../../estados/tramite260207Store.store';
import { Tramite260207Store } from '../../estados/tramite260207Store.store';

/**
 * @component
 * @name ContenedorDePasosComponent
 * @description
 * Este componente es un contenedor para manejar los pasos de un wizard (asistente).
 * Permite la navegación entre diferentes pasos y actualiza el título del mensaje
 * según el paso seleccionado.
 *
 * @selector app-contenedor-de-pasos
 * @standalone true
 * @imports
 * - CommonModule
 * - WizardComponent
 * - PasoUnoComponent
 * - PasoDosComponent
 * - PasoTresComponent
 * - BtnContinuarComponent
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
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    NotificacionesComponent,
  ],
  templateUrl: './contenedor-de-pasos.component.html',
  styleUrl: './contenedor-de-paso.component.scss',
})
export class ContenedorDePasosComponent implements OnInit {
  /**
   * @property {string | null} tituloMensaje
   * @description Título del mensaje que se muestra en el wizard.
   * Inicializado con el valor de `TITULOMENSAJE`.
   */

  tituloMensaje: string | null = TITULOMENSAJE;

  /**
   * @property {ListaPasosWizard[]} pasos
   * @description Lista de pasos del wizard.
   * Inicializado con el valor de `PASOS`.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property {number} indice
   * @description Índice actual del paso seleccionado en el wizard.
   * Inicializado con el valor `1`.
   */
  indice: number = 1;

  /**
   * @property {WizardComponent} wizardComponent
   * @description Referencia al componente del wizard.
   * Utilizado para manejar la navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;


  /**
   * Estado del formulario de registro IMMEX.
   */
  storeData!: Tramite260207State;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

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
        * @property {string} MENSAJE_DE_ERROR
        * @description
        * Propiedad usada para almacenar el mensaje de error actual.
        * Se inicializa como cadena vacía y se actualiza en función
        * de las validaciones o errores capturados en el flujo.
        */
  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;


  /**
   * Indica si la carga de archivos está en progreso.
   */
  cargaEnProgreso: boolean = true;

  /**
    * @property {string} infoAlert
    * @description
    * Clase CSS para aplicar estilos a los mensajes de información.
    */
  public infoAlert = 'alert-info  text-center';

  /**
   * Clase CSS para mostrar una alerta de error.
   */
  infoError = 'alert-danger text-center';

  /**
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
  public formErrorAlert!: string;

  /**
   * Indica si se requieren datos de pago para el trámite actual.
   * @remarks
   * Esta propiedad controla la visualización y el manejo de información relacionada con pagos en el componente.
   */
  public requiresPaymentData: boolean = false;

  /**
    * @property {number} confirmarSinPagoDeDerechos
    * @description
    * Indica si se ha confirmado la continuación sin pago de derechos.
    */
  public confirmarSinPagoDeDerechos: number = 0;

  /**
    * Identificador numérico de la solicitud actual.
    * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
    */
  idSolicitudState: number | null = 0;

   /**
       * Folio temporal de la solicitud.
       * Se utiliza para mostrar el folio en la notificación de éxito.
       */
       public alertaNotificacion!: Notificacion;

       
      /**
 * Estado del tramite Folio
 */
 public folioTemporal: number = 0;

  /**
* Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
*/
  esFormaValido: boolean = false;


  /**
    * @property {string} TEXTOS
    * @description
    * Texto de aviso utilizado en el componente.
    */
  TEXTOS: string = AVISO.Aviso;

  /**
   * @property {DatosPasos} datosPasos
   * @description Objeto que contiene información sobre los pasos del wizard.
   * Incluye el número total de pasos, el índice actual y los textos de los botones.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

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
   * Constructor del componente ContenedorDePasosComponent.
   * 
   * @constructor
   * @description
   * Inicializa el componente inyectando las dependencias necesarias para el manejo del estado
   * del trámite 260207 (Tratamientos Especiales COFEPRIS). El constructor utiliza inyección
   * de dependencias de Angular para obtener acceso al servicio de consultas del estado.
   * 
   * @param {Tramite260207Query} tramiteQuery - Servicio de consulta para acceder al estado del trámite.
   * Este servicio proporciona observables reactivos para monitorear cambios en el estado del trámite
   * y mantener sincronizada la interfaz de usuario con los datos del store de Akita.
   * 
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por Angular
   * // No se requiere invocación manual
   * const component = new ContenedorDePasosComponent(tramiteQueryService);
   * ```
   * 
   * @see {@link Tramite260207Query} Para detalles sobre el servicio de consultas
   * @see {@link ngOnInit} Para la lógica de inicialización del componente
   * 
   * @since 1.0.0
   * @author Equipo COFEPRIS - VUCEM
   * @version 2.0.0
   */
  constructor(
    private tramiteQuery: Tramite260207Query,
    private tramite260207Store: Tramite260207Store,
    public registroSolicitudService: RegistroSolicitudService,
    private toastrService: ToastrService
  ) {
    // No se necesita lógica de inicialización adicional.
    // Toda la configuración del estado se maneja en ngOnInit
    // siguiendo las mejores prácticas de Angular para el ciclo de vida de componentes.
  }

  /**
   * Método de inicialización del ciclo de vida del componente Angular.
   * 
   * @method ngOnInit
   * @implements {OnInit}
   * @description
   * Establece la suscripción reactiva al estado del trámite 260207 para mantener
   * sincronizados los datos del componente con el store centralizado. Este método
   * se ejecuta automáticamente después de que Angular inicializa las propiedades
   * del componente y es el lugar adecuado para configurar suscripciones a observables.
   * 
   * La suscripción al `selectTramiteState$` permite que el componente reaccione
   * automáticamente a cualquier cambio en el estado del trámite, asegurando que
   * la interfaz de usuario siempre refleje el estado actual de los datos.
   * 
   * 
   * @returns {void} No retorna ningún valor, actualiza el estado interno del componente.
   * 
   * @example
   * ```typescript
   * // Ejemplo de cómo el estado se actualiza automáticamente
   * ngOnInit(): void {
   *   this.tramiteQuery.selectTramiteState$.pipe().subscribe((data) => {
   *     // data contiene el estado actual del trámite
   *     this.storeData = data;
   *     // El componente ahora tiene acceso a todos los datos del estado
   *   });
   * }
   * ```
   * 
   * @see {@link Tramite260207State} Para la estructura del estado del trámite
   * @see {@link Tramite260207Query.selectTramiteState$} Para el observable del estado
   * @see {@link OnInit} Para detalles sobre la interfaz del ciclo de vida de Angular
   * 
   * @throws {Error} Puede lanzar errores si hay problemas con la conexión al store
   * @since 1.0.0
   * @author Equipo COFEPRIS - VUCEM
   * @version 2.0.0
   */
  ngOnInit(): void {
    this.tramiteQuery.selectTramiteState$.pipe().subscribe((data) => {
      this.storeData = data;
    });
  }

  /**
   * @method seleccionaTab
   * @description Cambia el índice actual al valor proporcionado.
   * @param {number} i - Índice del paso seleccionado.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method getValorIndice
   * @description Actualiza el índice y el título del mensaje según la acción del botón.
   * Navega hacia adelante o hacia atrás en el wizard.
   * @param {AccionBoton} e - Objeto que contiene el valor del índice y la acción ('cont' o 'atras').
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
        const PAYLOAD = GuardarAdapter_260207.toFormPayload(this.storeData);
        let shouldNavigate = false;
        this.registroSolicitudService.postGuardarDatos('260207', PAYLOAD).subscribe(response => {
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
              this.tramite260207Store.setIdSolicitud(ID_SOLICITUD);
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
                  this.indice = 2;
                  this.datosPasos.indice = 2;
                  this.wizardComponent.siguienteGuardar();
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
    if (this.wizardComponent) {
      this.wizardComponent.siguiente();
      this.indice = this.wizardComponent.indiceActual + 1;
      this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
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

  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
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
    if (this.wizardComponent) {
      this.wizardComponent.atras();
      this.indice = this.wizardComponent.indiceActual + 1;
      this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
    }
  }
  /**
   * Método para navegar a la siguiente sección del wizard.
   * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  siguiente(): void {
    if (this.wizardComponent) {
      this.wizardComponent.siguiente();
      this.indice = this.wizardComponent.indiceActual + 1;
      this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
    }
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
