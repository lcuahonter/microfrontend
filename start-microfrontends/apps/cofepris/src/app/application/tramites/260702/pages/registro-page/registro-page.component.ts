import { AVISO, DatosPasos, ERROR_FORMA_ALERT,WizardService, doDeepCopy, esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy,OnInit, ViewChild, inject } from '@angular/core';
import { Observable,Subject,map, switchMap, take } from 'rxjs';
import { Solicitud260702State, Solicitud260702Store } from '../../../../shared/estados/stores/shared2607/tramites260702.store';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS_REGISTRO } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { RegistrarSolicitudMcpService } from '../../../../shared/services/shared2607/registrar-solicitud-mcp.service';
import { Shared2607Service } from '../../../../shared/services/shared2607/shared2607.service';
import { Solicitud260702Query } from '../../../../shared/estados/queries/shared2607/tramites260702.query';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';



/**
 * Interfaz que representa una acción de botón en el wizard.
 */
interface AccionBoton {
  /** Acción a realizar (e.g., 'cont' para continuar, 'atras' para retroceder). */
  accion: string;

  /** Valor asociado al índice del paso. */
  valor: number;
}

/**
 * Componente que representa la página de registro del trámite.
 * Gestiona la navegación entre los pasos del wizard y el estado de la sección.
 */
@Component({
  templateUrl: './registro-page.component.html',
  styles: ``,
 
})
export class RegistroPageComponent implements OnDestroy, OnInit {
  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
   public idProcedimiento: number = 260702;

   
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
   solicitudState!: Solicitud260702State;
 
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
 
   /**
    * Crea una instancia del componente, inyectando el store y el query necesarios para la gestión de la solicitud 260703.
    * 
    * @param solicitud260703Store - Store para manejar el estado de la solicitud 260703.
    * @param solicitud260703Query - Query para consultar el estado de la solicitud 260703.
    */
   constructor(public solicitud260703Store: Solicitud260702Store,
     private solicitud260703Query: Solicitud260702Query,
     private sharedSvc: Shared2607Service, private toastrService: ToastrService,
     private registrarSolicitudMcpService: RegistrarSolicitudMcpService) {
     //
   }
 
 
   /**
    * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
    * Suscribe al observable `selectSolicitud$` para obtener el estado actual de la solicitud
    * y actualiza las propiedades locales `solicitudState` y `isContinuarTriggered` según los datos recibidos.
    */
   ngOnInit(): void {
     this.solicitud260703Query.selectSolicitud$.pipe().subscribe((data) => {
       this.solicitudState = data;
       this.isContinuarTriggered = this.solicitudState['continuarTriggered'] ?? false;
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
    * Variable utilizada para almacenar la lista de pasos.
    */
   pantallasPasos: ListaPasosWizard[] = PASOS_REGISTRO;
 
   /**
    * Variable utilizada para almacenar el índice del paso actual.
    */
   indice: number = 1;
 
 
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
               this.solicitud260703Store.setIdSolicitud(DATOS.id_solicitud ?? 0);
             } else {
               this.solicitud260703Store.setIdSolicitud(0);
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
 
 
   /** Actualiza el estado de carga en progreso. */
   onCargaEnProgreso(carga: boolean): void {
     this.cargaEnProgreso = carga;
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
     * Maneja la acción del botón en el asistente.
     * Cambia el paso actual según la acción del botón.
     *
     * @param e - Objeto que contiene la acción y el valor del botón.
     */
   getValorIndice(e: AccionBoton): void {
     const NEXT_INDEX =
         e.accion === 'cont' ? e.valor + 1 :
         e.accion === 'ant' ? e.valor - 1 :
         e.valor;
 
     if (this.indice === 1 && e.accion === 'cont') {
       this.solicitud260703Store.setContinuarTriggered(true);
       const ES_VALIDO = this.validarFormulariosPasoActual();
       if (!ES_VALIDO) {
         this.isPeligro = true; 
         return;
       }
       this.isPeligro = false;
     }
     if (e.valor > 0 && e.valor < this.pasos.length) {
       if (e.accion === 'cont') {
         if (this.indice === 1) { 
             this.shouldNavigate$()
           .subscribe((shouldNavigate) => {
             if (shouldNavigate) {
               this.indice = NEXT_INDEX;
               this.datosPasos.indice = NEXT_INDEX;
               this.wizardService.cambio_indice(NEXT_INDEX);
               this.wizardComponent.siguiente();
             } else {
               this.indice = e.valor;
               this.datosPasos.indice = e.valor;
             }
           });
         } else {
           this.indice = NEXT_INDEX;
           this.datosPasos.indice = NEXT_INDEX;
           this.wizardService.cambio_indice(NEXT_INDEX);
           this.wizardComponent.siguiente();
         }
       } else {
         this.indice = NEXT_INDEX;
         this.datosPasos.indice = NEXT_INDEX;
         this.wizardComponent.atras();
       }
     }
   }
 
 
   /**
     * Valida los formularios del paso actual antes de permitir continuar.
     * @returns {boolean} - `true` si los formularios son válidos, `false` en caso contrario.
     */
   validarFormulariosPasoActual(): boolean {
     if (this.indice === 1) {
       return this.pasoUnoComponent?.validarFormularios() ?? true;
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
