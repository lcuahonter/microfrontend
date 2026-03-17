/**
 * Componente utilizado en el trámite 260214 para gestionar la navegación entre los pasos de un wizard.
 *
 * Este archivo contiene la definición del componente `ContenedorDePasosComponent`, que permite avanzar o retroceder
 * entre los pasos del wizard y actualiza el título del paso actual. También interactúa con los componentes de cada paso
 * para gestionar su funcionalidad específica.
 */

import {
  AVISO_CONTRNIDO,
  AccionBoton,
  AlertComponent,
  DatosPasos,
  ListaPasosWizard,
  Notificacion,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  RegistroSolicitudService,
  esValidObject,
  getValidDatos,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import {
  MENSAJE_DE_VALIDACION,
  MSG_REGISTRO_EXITOSO,
  PASOS,
  TITULOMENSAJE,
} from '../../constants/medicos-uso.enum';
import { Tramite260214State, Tramite260214Store } from '../../estados/tramite260214Store.store';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { GuardarAdapter_260214 } from '../../adapters/guardar-payload.adapter';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos-new/pago-de-derechos.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite260214Query } from '../../estados/tramite260214Query.query';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * @component
 * @name ContenedorDePasosComponent
 * @description
 * Componente contenedor que gestiona la navegación entre los pasos de un wizard.
 * Permite avanzar o retroceder entre los pasos y actualiza el título del paso actual.
 *
 * @selector app-contenedor-de-pasos
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./contenedor-de-pasos.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./contenedor-de-paso.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - WizardComponent: Componente para gestionar la navegación entre pasos.
 * - PasoUnoComponent: Componente para gestionar la funcionalidad del paso uno.
 * - PasoDosComponent: Componente para gestionar la funcionalidad del paso dos.
 * - PasoTresComponent: Componente para gestionar la funcionalidad del paso tres.
 * - BtnContinuarComponent: Componente para mostrar los botones de navegación.
 */
@Component({
  selector: 'app-contenedor-de-pasos',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    BtnContinuarComponent,
    NotificacionesComponent,
    AlertComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent
  ],
  templateUrl: './contenedor-de-pasos.component.html',
  styleUrl: './contenedor-de-paso.component.scss',
})
export class ContenedorDePasosComponent implements OnInit {
  /**
   * Referencia al componente hijo `DatosDeLaSolicitudComponent`.
   *
   * Se obtiene mediante `@ViewChild` para acceder a sus métodos y propiedades
   * desde el componente padre.
   */
  @ViewChild(DatosDeLaSolicitudComponent, { static: false })
  datosDeLaSolicitudComponent!: DatosDeLaSolicitudComponent;

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
   * Referencia al componente hijo `PagoDeDerechosComponent`.
   *
   * Se obtiene mediante `@ViewChild` para poder interactuar con él de forma
   * programática desde el componente padre.
   */
  @ViewChild(PagoDeDerechosComponent, { static: false })
  pagoDeDerechosComponent!: PagoDeDerechosComponent;

  /**
   * Contenido del aviso que se mostrará en la interfaz.
   *
   * Se inicializa con el valor de la propiedad `aviso` del objeto constante `AVISO_CONTRNIDO`.
   */
  avisoContrnido = AVISO_CONTRNIDO.aviso;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

  /**
   * @property {string | null} tituloMensaje
   * Título del paso actual en el wizard.
   */
  tituloMensaje: string | null = TITULOMENSAJE;

  /**
   * @property {ListaPasosWizard[]} pasos
   * Lista de pasos del wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property {number} indice
   * Índice del paso actual en el wizard.
   */
  indice: number = 1;
  /**
 * @property {string} MENSAJE_DE_ERROR
 * @description
 * Propiedad usada para almacenar el mensaje de error actual.
 * Se inicializa como cadena vacía y se actualiza en función
 * de las validaciones o errores capturados en el flujo.
 */
  MENSAJE_DE_ERROR: string = '';
  /**
    * @property {string} infoAlert
    * Clase CSS usada para mostrar alertas informativas.
    */
  public infoAlert = 'alert-danger text-center';
  /**
   * @property {WizardComponent} wizardComponent
   * Referencia al componente del wizard para controlar la navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {Tramite260202State} storeData
   * @description Estado de la tienda para el trámite 260214.
   */
  storeData!: Tramite260214State;

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
 * Indica si el botón para cargar archivos está habilitado.
 */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;

  /**
   * @property {DatosPasos} datosPasos
   * Configuración de los datos del wizard, como el número de pasos y los textos de los botones.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  /**
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
   public formErrorAlert!:string;

   esFormaValido: boolean = false;

   public requiresPaymentData: boolean = false;

  public confirmarSinPagoDeDerechos: number = 0;

  idSolicitudState: number | null = 0;

  accionDelBoton!: AccionBoton;

  isSaltar: boolean = false;

  public alertaNotificacion!: Notificacion;

  public folioTemporal: number = 0;

  infoError = 'alert-danger text-center';

  constructor( private registroSolicitudService: RegistroSolicitudService, private tramite260214Store: Tramite260214Store, private toastrService: ToastrService, private Tramite260214Query: Tramite260214Query) {
  }

  ngOnInit(): void {
    this.Tramite260214Query.selectTramiteState$.pipe().subscribe((data) => {
      this.storeData = data;
    });
  }

  /**
   * @method seleccionaTab
   * Cambia el índice del paso actual al valor proporcionado.
   *
   * @param {number} i - Índice del paso seleccionado.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method getValorIndice
   * Actualiza el índice del paso actual y controla la navegación en el wizard.
   *
   * @param {AccionBoton} e - Acción realizada en el botón (continuar o retroceder) y el índice del paso.
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
                  mensaje: MENSAJE_DE_VALIDACION,
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
             const PAYLOAD = GuardarAdapter_260214.toFormPayload(this.storeData);
             let shouldNavigate = false;
             this.registroSolicitudService.postGuardarDatos('260214', PAYLOAD).subscribe(response => {
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
                   this.tramite260214Store.setIdSolicitud(ID_SOLICITUD);
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

  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

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

  private validarTodosFormulariosPasoUno(): boolean {
    if (!this.pasoUnoComponent) {
      return true;
    }
    const ISFORM_VALID_TOUCHED = this.pasoUnoComponent.validarPasoUno();
    if (!ISFORM_VALID_TOUCHED) {
      return false;
    }
    return true;
  }

  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
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

  /**
   * @method obtenerNombreDelTítulo
   * Obtiene el título correspondiente al paso actual.
   *
   * @param {number} valor - Índice del paso actual.
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
}
