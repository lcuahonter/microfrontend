import { AVISO,DatosPasos, ERROR_FORMA_ALERT,Notificacion,PANTA_PASOS,RegistroSolicitudService,WizardService, doDeepCopy, esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy,OnInit, ViewChild, inject } from '@angular/core';
import { Observable,Subject,map, switchMap, take } from 'rxjs';
import { Tramite260704State, Tramite260704Store } from '../../estados copy/stores/tramite260704Store.store';
import { GuardarAdapter_260704 } from '../../adapters/guardar-payload.adapter';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { MENSAJE_DE_VALIDACION } from '../../constantes/consumo-personal.enum';
import { PASOS_REGISTRO } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { RegistrarSolicitudMcpService } from '../../../../shared/services/shared2607/registrar-solicitud-mcp.service';
import { Shared2607Service } from '../../../../shared/services/shared2607/shared2607.service';
import { TITULO_PASO_UNO } from '../../../260701/services/certificados-licencias.enum';
import { ToastrService } from 'ngx-toastr';
import { Tramite260704Query } from '../../estados/Tramite260704.query';
import { WizardComponent } from '@ng-mf/data-access-user';


/**
 * Interfaz que define la estructura de una acción de botón
 */
interface AccionBoton {
  /**
   * La acción que se realizará.
   */
  accion: string;

  /**
   * El valor asociado a la acción.
   */
  valor: number;
}
/**
 * Componente que representa la página de solicitud.
 */
@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
  
})
/**
 * Componente que representa la página de solicitud.
 */
export class SolicitudPageComponent implements OnDestroy, OnInit {
 /**
    * Identificador del procedimiento que se recibe como entrada desde el componente padre.
    * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
    * como catálogos o listas asociadas.
    */
    public idProcedimiento: number = 260704;
 
    /**
    * Esta variable se utiliza para almacenar los textos de aviso.
    */
   TEXTOS = AVISO;
    /**
 * Esta variable se utiliza para almacenar la lista de pasos.
 */
  pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;
 
    /**
      * Una cadena que representa la clase CSS para una alerta de información.
      * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
      */
   public infoAlert = 'alert-info';
  /**
   * Esta variable se utiliza para almacenar el índice del paso.
   */
  indice: number = 1;
 /**
  * Representa el título del paso actual en el proceso.
  * Este valor se inicializa con una constante que representa el título del primer paso.
  */
  public titulo: string = TITULO_PASO_UNO;
    
   /**
    * Notificador para destruir los observables y evitar posibles fugas de memoria.
    * @private
    * @type {Subject<void>}
    */
   destroyNotifier$: Subject<void> = new Subject();
  
  
  
    /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
    public isContinuarTriggered: boolean = false;
  
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
      * Indica si la carga de archivos está en progreso.
      */
    cargaEnProgreso: boolean = true;
  
    /**
     * Estado actual de la solicitud para el trámite 260702.
     * Contiene toda la información relevante sobre el proceso de la solicitud,
     * incluyendo datos ingresados por el usuario y el progreso en el flujo del trámite.
     */
    storeData!: Tramite260704State;
  
    /**
  * @property formErrorAlert
  * @description
  * Contiene el mensaje de alerta que se muestra cuando ocurre un error en el formulario.
  * 
  * Funcionalidad:
  * - Utiliza el mensaje definido en la constante `ERROR_FORMA_ALERT`.
  * - Este mensaje informa al usuario sobre los errores que deben corregirse en el formulario antes de continuar.
  * 
  * @type {string}
  * 
  * @example
  * <div *ngIf="!esFormaValido">
  *   {{ formErrorAlert }}
  * </div>
  */
    public formErrorAlert = ERROR_FORMA_ALERT;
  
    public seleccionarFilaNotificacion!: Notificacion;
    
    esFormaValido: boolean = false;

    /**
     * Título del asistente.
     */
    @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  
    /**
    * @property wizardService
    * @description
    * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
    * @type {WizardService}
    */
    wizardService = inject(WizardService);
  
    /**
       * Referencia al componente `PasoUnoComponent`.
       */
    @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;
  
    /**
     * Indica si la opción de peligro está activada.
     * Cuando es verdadero, representa que la condición de peligro está presente.
     */
    isPeligro: boolean = false;
  
    /** Identificador numérico para guardar la solicitud.
  * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
  */
    public guardarIdSolicitud: number = 0;
  isSaltar: boolean = false;
  public mostrarAlerta: boolean = false;
    public confirmarSinPagoDeDerechos: number = 0;
  public requiresPaymentData: boolean = false;

    /**
     * Crea una instancia del componente, inyectando el store y el query necesarios para la gestión de la solicitud 260703.
     * 
     * @param tramite260704Store - Store para manejar el estado de la solicitud 260703.
     * @param tramite260704Query - Query para consultar el estado de la solicitud 260703.
     */
    constructor(
      private tramite260704Store:Tramite260704Store,
      private tramite260704Query: Tramite260704Query,
      private sharedSvc: Shared2607Service, private toastrService: ToastrService,
      private registrarSolicitudMcpService: RegistrarSolicitudMcpService,
      private registroSolicitudService: RegistroSolicitudService) {
      //
    }
  
  
    /**
     * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
     * Suscribe al observable `selectSolicitud$` para obtener el estado actual de la solicitud
     * y actualiza las propiedades locales `solicitudState` y `isContinuarTriggered` según los datos recibidos.
     */
    
    ngOnInit(): void {
    this.tramite260704Query.selectSolicitud$.subscribe((data) => {
    this.storeData = data as unknown as Tramite260704State;
      // this.isContinuarTriggered = this.storeData['continuarTriggered'] ?? false;

    });
  }
  
    /**
     * Mensaje de alerta relacionado con el aviso de privacidad.
     */
    mensajeAlertaAvisoPrivacidad: string = AVISO.Aviso;
  
    /**
     * Lista de pasos en el asistente.
     */
    pasos: ListaPasosWizard[] = PASOS_REGISTRO;
  
 
  
  
    /**
      * Verifica si se debe navegar al siguiente paso.
      * Realiza una llamada para guardar los datos actuales y determina si la navegación es posible.
      * @return {Observable<boolean>} Un observable que emite true si se puede navegar, false en caso contrario.
      */
    private shouldNavigate$(): Observable<boolean> {
      return this.sharedSvc.getAllState().pipe(
        take(1),
        switchMap(data => this.guardar(data)),
        map((response) => {
          const API_DATOS = doDeepCopy(response)
          const OK = API_DATOS.codigo === '00';
          if (OK) {
            this.toastrService.success(API_DATOS.mensaje);
          } else {
            this.toastrService.error(API_DATOS.mensaje);
          }
          return OK;
        })
      );
    }
  
    /**
     * Guarda los datos proporcionados mediante una solicitud HTTP POST.
     * @param data - Los datos que se desean guardar.
     * @returns {Promise<unknown>} Una promesa que se resuelve con la respuesta de la solicitud POST.
     */
    public guardar(data: Record<string, unknown>): Promise<unknown> {
      const PAYLOAD = this.sharedSvc.buildPayload(data, this.idProcedimiento);
      return new Promise((resolve, reject) => {
        this.registrarSolicitudMcpService.guardarDatosPost(this.idProcedimiento.toString(), PAYLOAD).subscribe({
          next: (response) => {
            const RESPONSE = doDeepCopy(response);
            if (esValidObject(RESPONSE) && esValidObject(RESPONSE['datos'])) {
              const DATOS = RESPONSE['datos'] as { id_solicitud?: number };
              if (getValidDatos(DATOS.id_solicitud)) {
                this.guardarIdSolicitud = DATOS.id_solicitud ?? 0;
                this.tramite260704Store.setIdSolicitud(DATOS.id_solicitud ?? 0);
              } else {
                this.tramite260704Store.setIdSolicitud(0);
              }
            }
            resolve(response);
          },
          error: (error) => {
            reject(error);
          }
        });
      });
    }
  
  
  
  
    /**
     * Datos para los pasos en el asistente.
     */
    datosPasos: DatosPasos = {
      nroPasos: this.pasos.length,
      indice: this.indice,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    };
  
   
     /**
      * @method getValorIndice
      * @description Controla la navegación del wizard según el botón presionado (anterior o continuar).
      * También actualiza el título correspondiente al paso actual.
      *
      * @param {AccionBoton} e - Objeto que contiene el valor y la acción del botón presionado.
      */
     getValorIndice(e: AccionBoton): void {
       if (e.accion === 'cont') {
         let isValid = true;
           if (this.indice === 1 && this.pasoUnoComponent) {
           isValid = this.pasoUnoComponent.validarPasoUno();
         }
         if(!this.pasoUnoComponent.pagoDerechosComponent.validarContenedor() && !this.requiresPaymentData){
             this.mostrarAlerta=true;
             this.confirmarSinPagoDeDerechos = 2;
             this.seleccionarFilaNotificacion = {
               tipoNotificacion: 'alert',
               categoria: 'danger',
               modo: 'action',
               titulo: '',
                 mensaje: '¿Está seguro que su solicitud no requiere los datos del Pago de derechos?.',
               cerrar: true,
               tiempoDeEspera: 2000,
               txtBtnAceptar: 'SI',
               txtBtnCancelar: 'NO',
               alineacionBtonoCerrar:'flex-row-reverse'
             }
             setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
             return;
           }
         if (!isValid) {
           this.formErrorAlert = MENSAJE_DE_VALIDACION;
           this.esFormaValido = true;
           this.datosPasos.indice = this.indice;
           return;
         }
         this.esFormaValido = false;
         this.postGuardarDatos(e);
       }else{
         this.indice = e.valor;
         this.datosPasos.indice = this.indice;
         this.wizardComponent.atras();
       }
     }
     postGuardarDatos(e: AccionBoton): void {
           const PAYLOAD = GuardarAdapter_260704.toFormPayload(this.storeData);
             let shouldNavigate = false;
             this.registroSolicitudService.postGuardarDatos('260704', PAYLOAD).subscribe(response => {
               shouldNavigate = response.codigo === '00';
               if (!shouldNavigate) {
                 const ERROR_MESSAGE = response.error || 'Error desconocido en la solicitud';
                 this.formErrorAlert = SolicitudPageComponent.generarAlertaDeError(ERROR_MESSAGE);
                 this.esFormaValido = false;
                 this.indice = 1;
                 this.datosPasos.indice = 1;
                 this.wizardComponent.indiceActual = 1;
                 setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
                 return;
               }
               if(shouldNavigate) {
                 if(esValidObject(response) && esValidObject(response.datos)) {
                   const DATOS = response.datos as { id_solicitud?: number };
                   if(getValidDatos(DATOS.id_solicitud)) {
                     this.tramite260704Store.setIdSolicitud(DATOS.id_solicitud ?? 0);
                   } else {
                     this.tramite260704Store.setIdSolicitud(0);
                   }
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
   
     onBlancoObligatoria(enBlanco: boolean): void {
       this.isSaltar = enBlanco;
     }
   
     anterior(): void {
       this.wizardComponent.atras();
       this.indice = this.wizardComponent.indiceActual + 1;
       this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
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
   
      onClickCargaArchivos(): void {
       this.cargarArchivosEvento.emit();
     }
   
     onCargaEnProgreso(carga: boolean): void {
       this.cargaEnProgreso = carga;
     }
   
     manejaEventoCargaDocumentos(carga: boolean): void {
       this.activarBotonCargaArchivos = carga;
     }
   
     cargaRealizada(cargaRealizada: boolean): void {
       this.seccionCargarDocumentos = cargaRealizada ? false : true;
     }
   
     siguiente(): void {
       this.wizardComponent.siguiente();
       this.indice = this.wizardComponent.indiceActual + 1;
       this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
     }
   
     cerrarModal(value:boolean): void {
         if(value){
           this.mostrarAlerta = false;
           this.requiresPaymentData = true;
           const IS_VALID = this.pasoUnoComponent?.validarPasoUno() ?? true;
           if (IS_VALID) {
           const EVENT: AccionBoton = { accion: 'cont', valor: this.indice + 1 };
           this.postGuardarDatos(EVENT);
           this.esFormaValido = false; 
           } else {
             this.formErrorAlert = MENSAJE_DE_VALIDACION;
             this.esFormaValido = true;
             this.indice = 1;
             this.datosPasos.indice = 1;
             setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
           }
         } else {
           this.mostrarAlerta = false;
           this.confirmarSinPagoDeDerechos = 4;
           this.indice = 1;
           this.datosPasos.indice = 1;
         }
       }
   
  
  
    /**
      * Valida los formularios del paso actual antes de permitir continuar.
      * @returns {boolean} - `true` si los formularios son válidos, `false` en caso contrario.
      */
    validarFormulariosPasoActual(): boolean {
      if (this.indice === 1) {
        return this.pasoUnoComponent?.validarFormularios() ?? false;
      }
      return true;
    }
 
    /**
    * Método que se ejecuta al destruir el componente.
    */
   ngOnDestroy(): void {
     this.destroyNotifier$.next();
     this.destroyNotifier$.complete();
   }
}