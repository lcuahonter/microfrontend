import {
  AVISO,
  AccionBoton,
  DatosPasos,
  ListaPasosWizard,
  Notificacion,
  RegistroSolicitudService,
  esValidObject,
  getValidDatos,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';

import { MENSAJE_DE_VALIDACION, MENSAJE_DE_VALIDACION_PAGO_DERECHOS, PASOS, TITULOMENSAJE } from '../../constants/psicotropicos-poretorno.enum';
import { Tramite260201State, Tramite260201Store } from '../../estados/tramite260201Store.store';
import { GuardarAdapter_260201 } from '../../adapters/guardar-payload.adapter';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite260201Query } from '../../estados/tramite260201Query.query';

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
  templateUrl: './contenedor-de-pasos.component.html',
  styleUrl: './contenedor-de-paso.component.scss',
})
export class ContenedorDePasosComponent implements OnInit {
  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

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

  TEXTOS: string = AVISO.Aviso;

  /**
   * @property {Tramite260201State} storeData
   * @description Estado de la tienda para el trámite 260201.
   */
  storeData!: Tramite260201State;

  /**
   *
   * Una cadena que representa la clase CSS para una alerta de información.
   * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
   */
  public infoAlert = 'alert-info';

  /**
   * Clase CSS para mostrar una alerta de error.
   */
  infoError = 'alert-danger text-center';

  /**
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
   public formErrorAlert!:string;

  /**
   * @property {WizardComponent} wizardComponent
   * @description Referencia al componente del wizard.
   * Utilizado para manejar la navegación entre pasos.
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
 * @property {string} MENSAJE_DE_ERROR
 * @description
 * Propiedad usada para almacenar el mensaje de error actual.
 * Se inicializa como cadena vacía y se actualiza en función
 * de las validaciones o errores capturados en el flujo.
 */
   MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;

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

  public requiresPaymentData: boolean = false;

  public confirmarSinPagoDeDerechos: number = 0;

   /**
   * @property {AccionBoton} accionDelBoton
   * @description
   * Almacena la acción del botón presionado en el wizard (continuar o anterior).
   * Permite controlar la navegación y el flujo de validaciones según la interacción del usuario.
   */
  accionDelBoton!: AccionBoton;

  public folioTemporal: number = 0;

  idSolicitudState: number | null = 0;

  constructor(private tramite260201Query: Tramite260201Query, private tramite260201Store: Tramite260201Store, public registroSolicitudService: RegistroSolicitudService, private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.tramite260201Query.selectTramiteState$.pipe().subscribe((data) => {
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

  guardarDatosApi(e: AccionBoton): void {
         const PAYLOAD = GuardarAdapter_260201.toFormPayload(this.storeData);
         let shouldNavigate = false;
         this.registroSolicitudService.postGuardarDatos('260201', PAYLOAD).subscribe(response => {
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
               this.tramite260201Store.setIdSolicitud(ID_SOLICITUD);
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

}
