import {
  AccionBoton,
  DatosPasos,
  ListaPasosWizard,
  Notificacion,
  RegistroSolicitudService,
  esValidObject,
  getValidDatos,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MENSAJE_DE_PAGE, MENSAJE_DE_VALIDACION, MSG_REGISTRO_EXITOSO, PASOS, TITULOMENSAJE } from '../../constants/medicos-sin-registrar.enum';
import { Tramite260217State, Tramite260217Store } from '../../estados/tramite260217Store.store';
import { GuardarAdapter_260217 } from '../../adapters/guardar-payload.adapter';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite260217Query } from '../../estados/tramite260217Query.query';
import { WizardComponent } from '@ng-mf/data-access-user';

@Component({
  selector: 'app-contenedor-de-pasos',
  templateUrl: './contenedor-de-pasos.component.html',
  styleUrl: './contenedor-de-paso.component.scss',
})
export class ContenedorDePasosComponent implements OnInit {
  /**
   * Título del mensaje que se muestra en el componente.
   * Puede ser nulo si no está definido.
   * @type {string | null}
   */
  tituloMensaje: string | null = TITULOMENSAJE;

  /**
   * Lista de pasos para el componente wizard.
   * @type {ListaPasosWizard[]}
   */
  pasos: ListaPasosWizard[] = PASOS;

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
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Indica si la carga de archivos está en progreso.
   */
  cargaEnProgreso: boolean = true;

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
   * @property {Tramite260202State} storeData
   * @description Estado de la tienda para el trámite 260214.
   */
  storeData!: Tramite260217State;

  /**
 * Indica si el botón para cargar archivos está habilitado.
 */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;

  @ViewChild('pasoUno') pasoUnoComponent!: PasoUnoComponent;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

  esFormaValido: boolean = false;

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

    /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert!: string;

   public alertaNotificacion!: Notificacion;

  public folioTemporal: number = 0;

  /**
   * @property {string} MENSAJE_DE_ERROR
   * @description
   * Propiedad usada para almacenar el mensaje de error actual.
   * Se inicializa como cadena vacía y se actualiza en función
   * de las validaciones o errores capturados en el flujo.
   */
  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;

  public requiresPaymentData: boolean = false;

  public confirmarSinPagoDeDerechos: number = 0;

  idSolicitudState: number | null = 0;

  accionDelBoton!: AccionBoton;

  infoError = 'alert-danger text-center';

  isSaltar: boolean = false;  

  constructor(
    private Tramite260217Query: Tramite260217Query,
    private tramiteStore: Tramite260217Store,
    private toastrService: ToastrService,
    public registroSolicitudService: RegistroSolicitudService) {}
  /**
   * Selecciona una pestaña específica del wizard.
   * @method
   * @param {number} i - Índice de la pestaña a seleccionar
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  ngOnInit(): void {
    this.Tramite260217Query.selectTramiteState$.pipe().subscribe((data) => {
      this.storeData = data;
    });
  }

  /**
   * Obtiene y procesa el valor del índice desde un evento de botón.
   * @method
   * @param {AccionBoton} e - Objeto con la acción y valor del botón
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

  guardarDatosApi(e: AccionBoton): void {
         const PAYLOAD = GuardarAdapter_260217.toFormPayload(this.storeData);
         let shouldNavigate = false;
         this.registroSolicitudService.postGuardarDatos('260216', PAYLOAD).subscribe(response => {
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

   saltar(): void {
    this.indice = 3;
    this.datosPasos.indice = 3;
    this.wizardComponent.siguiente();
  }

  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
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

  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

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
        return 'Cargar archivos';
      case 3:
        return 'Firmar';
      default:
        return TITULOMENSAJE;
    }
  }
}
