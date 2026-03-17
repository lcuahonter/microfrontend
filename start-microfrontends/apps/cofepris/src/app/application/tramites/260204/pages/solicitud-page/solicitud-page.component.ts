import { AVISO, AccionBoton,AlertComponent, NotificacionesComponent, PasoCargaDocumentoComponent, RegistroSolicitudService, esValidObject,getValidDatos } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { MENSAJE_DE_VALIDACION,MENSAJE_DE_VALIDACION_PAGO_DERECHOS,PASOS, TITULO_MENSAJE } from '../../constantes/permiso-sanitario-importacion-medicamentos.enum';
import { Tramite260204State, Tramite260204Store } from '../../estados/stores/tramite260204Store.store';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosPasos } from '@ng-mf/data-access-user';
import { GuardarAdapter_260204 } from '../../adapters/guardar-payload.adapter';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { Notificacion } from '@ng-mf/data-access-user';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite260204Query } from '../../estados/queries/tramite260204Query.query';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@ng-mf/data-access-user';
/**
 * @component SolicitudPageComponent
 * @description Componente principal de la página de solicitud. Controla la navegación
 * entre pasos de un wizard, muestra el título correspondiente y permite avanzar o retroceder
 * según la interacción del usuario. Utiliza un componente wizard para encapsular la lógica de pasos.
 */
@Component({
  selector: 'app-solicitud-page',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    NotificacionesComponent,
    AlertComponent
  ],
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.css',
})
export class SolicitudPageComponent implements OnInit {
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
  tituloMensaje: string = TITULO_MENSAJE;

  /**
   * @property {ListaPasosWizard[]} pasos
   * Lista de pasos del wizard obtenidos desde una constante externa.
   */
  pasos: ListaPasosWizard[] = PASOS;

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
      @ViewChild(PasoUnoComponent)
      pasoUnoComponent!: PasoUnoComponent;

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
   * @type {Tramite260204State}
   * @memberof SolicitudPageComponent
   */
  idTipoTRamite: string = '260204';

  
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
    public solicitudState!: Tramite260204State;

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

     /**
   * @property {AccionBoton} accionDelBoton
   * @description
   * Almacena la acción del botón presionado en el wizard (continuar o anterior).
   * Permite controlar la navegación y el flujo de validaciones según la interacción del usuario.
   */
  accionDelBoton!: AccionBoton;



  constructor(
    private tramiteStore: Tramite260204Store,
    private tramiteQuery: Tramite260204Query
    ,private toastrService: ToastrService,
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
                              this. formErrorAlert = this.MENSAJE_DE_ERROR;
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
                     const PAYLOAD = GuardarAdapter_260204.toFormPayload(this.solicitudState);
                     let shouldNavigate = false;
                     this.registroSolicitudService.postGuardarDatos('260204', PAYLOAD).subscribe(response => {
                       shouldNavigate = response.codigo === '00';
                       if (!shouldNavigate) {
                         const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
                         this.formErrorAlert = SolicitudPageComponent.generarAlertaDeError(ERROR_MESSAGE);
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

       /**
 * Cierra el modal y realiza acciones según el valor proporcionado.
 *
 * @param value - Indica si se debe proceder con el cierre y validación del formulario.
 *   - Si es `true`, oculta la alerta, requiere datos de pago y valida el primer paso del formulario.
 *     Si la validación es exitosa, guarda los datos mediante la API; de lo contrario, muestra un mensaje de error.
 *   - Si es `false`, solo oculta la alerta y establece la confirmación sin pago de derechos.
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
   * @method obtenerNombreDelTítulo
   * @description Devuelve el título a mostrar según el número de paso.
   *
   * @param {number} valor - Índice del paso actual.
   * @returns {string} - Título correspondiente.
   */
  obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return TITULO_MENSAJE;
      case 2:
        return this.pasos[1].titulo;
      case 3:
        return this.pasos[2].titulo;

      default:
        return TITULO_MENSAJE;
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
}
