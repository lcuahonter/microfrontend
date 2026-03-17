import { AVISO,AccionBoton, ListaPasosWizard, Notificacion, PASOS, WizardService, doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnDestroy, OnInit,ViewChild,inject} from '@angular/core';
import { MENSAJE_DE_VALIDACION_PAGO_DERECHOS, TEXTO_DE_PELIGRO } from '../../constant/muestras-plaguicida.enum';
import { Observable,Subject,map,switchMap, take, takeUntil } from 'rxjs';
import { Solicitud260502State, Tramite260502Store } from '../../../../shared/estados/stores/260502/tramite260502.store';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Shared2605Service } from '../../../../shared/services/shared2605/shared2605.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite260502Query } from '../../../../shared/estados/queries/260502/tramite260502.query';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
/**
 * Componente principal para la gestión de plaguicidas.
 * Contiene la lógica y la estructura del asistente de plaguicidas.
 */
@Component({
  selector: 'app-plaguicidas',
  standalone: false,
  templateUrl: './plaguicidas.component.html',
})
export class PlaguicidasComponent implements OnInit,OnDestroy {
   /**
     * Indica si se debe mostrar el componente secundario o sección específica en la vista.
     * Se utiliza para controlar la visibilidad dinámica de componentes en el flujo del wizard.
     */
    public shwComponent: boolean = false; 
  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  public idProcedimiento: number = 260502;
  /** Identificador numérico para guardar la solicitud.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  public guardarIdSolicitud: number = 0;
  /**
   * Lista de pasos del asistente.
   * Se obtiene de una constante definida en otro archivo.
   */
  pasos: ListaPasosWizard[] = PASOS;
   /**
   * Indica si se debe mostrar un mensaje de peligro.
   */
  public isPeligro: boolean = false;
  /** Texto de advertencia que se muestra cuando hay condiciones peligrosas. */
  public textoPeligro: string = TEXTO_DE_PELIGRO;
  /**
   * Referencia al componente `PasoUnoComponent`.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;
   /**
   * 
   * Una cadena que representa la clase CSS para una alerta de información.
   * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
   */
   public infoAlert = 'alert-info';

   /**
    * Asigna el aviso de privacidad simplificado al atributo `TEXTOS`.
    */

  TEXTOS = AVISO.Aviso;

  /**
   * Indice actual del paso en el asistente.
   * Se inicializa en 1.
   */
  indice: number = 1;
  /** 
   * Indica si el formulario es válido.
   * Se utiliza para controlar la navegación entre pasos.
   */
 isFormValid: boolean = false;
  /**
  * @property wizardService
  * @description
  * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
  * @type {WizardService}
  */
   wizardService = inject(WizardService);

   /**
   * Estado local que representa la solicitud actual.
   */
   public solicitudState!: Solicitud260502State;
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
   * Título del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Título del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  public isContinuarTriggered: boolean = false;

  /**
     * Controla la visibilidad del modal de alerta.
     * @property {boolean} mostrarAlerta
     */
    public mostrarAlerta: boolean = false;
  
    /** Nueva notificación relacionada con el RFC. */
    public seleccionarFilaNotificacion!: Notificacion;
  
    /**
     * Almacena el siguiente índice a utilizar en operaciones internas del componente,
     * como la navegación o el manejo de pasos en formularios.
     */
    private nextIndex: number = 0;
  
    /**
     * Almacena el índice actual del paso en el asistente (wizard),
     * permitiendo controlar y restaurar la posición del usuario en la navegación.
     */
    private currentIndex: number = 0;
    
    /**
     * Almacena la acción seleccionada por el usuario en el asistente (wizard),
     * como avanzar ('cont') o retroceder ('ant'), para controlar la navegación entre pasos.
     */
    private accionSeleccionada: string = ''; 
  
    /**
     * Indica si es necesario validar el pago de derechos antes de continuar con el siguiente paso del asistente.
     * Se utiliza para controlar la lógica de validación y navegación en el flujo del wizard.
     */
    private isPaymentRequired: boolean = false;
  
    /** Subject para notificar la destrucción del componente. */
    private destroyNotifier$: Subject<void> = new Subject();

    /**
   * @description
   * Objeto que representa una notificación de confirmación para agregar servicios.
   * Se utiliza para mostrar modal de confirmación al usuario.
   */
    public notificacionContinuarServicios!: Notificacion;

  /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;


  /**  
   * Constructor del componente.
   * Inyecta los servicios necesarios para la funcionalidad del componente.
   * @param sharedSvc Servicio compartido para operaciones comunes.
   * @param toastrService Servicio para mostrar notificaciones al usuario.
   * @param store Almacén de estado para gestionar los datos del trámite.
   * @param query Consulta para acceder a los datos del trámite.
   */
  constructor(
    private sharedSvc: Shared2605Service,
    private toastrService: ToastrService,
    private store: Tramite260502Store,
    private query: Tramite260502Query
  ) {}

  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de la solicitud para mantener el estado local actualizado.
   * {void} No retorna ningún valor.
   */
  ngOnInit(): void {
    this.query.selectSolicitud$
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((data) => {
      this.solicitudState = data;
      this.isContinuarTriggered = this.solicitudState['continuarTriggered'] ?? false;
    });
  }

  /**
   * Actualiza el estado local de validez del formulario.
   * Este método recibe el valor emitido por el componente hijo.
   * Se utiliza para saber si el formulario es válido o no desde el componente principal.
   */
  onFormValidityChange(isValid: boolean):void {
    this.isFormValid = isValid;
  }

   /**
   * Maneja la acción del botón en el asistente.
   * Cambia el paso actual según la acción del botón.
   *
   * @param e - Objeto que contiene la acción y el valor del botón.
   */
  getValorIndice(e: AccionBoton): void {
    this.shwComponent = true;
    this.nextIndex =
        e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
        e.valor; 

    this.accionSeleccionada = e.accion;
    this.currentIndex = e.valor;
 
    if (this.indice === 1 && e.accion === 'cont') {
      this.store.setContinuarTriggered(true);
        setTimeout(() => {
      const ES_VALIDO = this.validarFormulariosPasoActual();

      if (!ES_VALIDO) {
        this.isPeligro = true;
        return;
      }

      if (ES_VALIDO && !this.mostrarAlerta && !this.isPaymentRequired) {
        this.mostrarAlerta = true;
        this.isPeligro = true; 
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
        return;
      }

      if (this.isPaymentRequired) {
        const ES_PAGO_DERECHOS_VALIDO = this.pasoUnoComponent.validarPagoDerechos();
        if (ES_PAGO_DERECHOS_VALIDO) {
          this.isPeligro = false;
          this.proceedNavigation();
        } else {
           this.isPeligro = false;
          this.proceedNavigation();
        }
      }
        }, 1000);
    } else {
      this.proceedNavigation();
    }
  }

  /**
   * Controla la navegación entre los pasos del asistente (wizard) según la acción seleccionada.
   *
   * Si la acción es 'cont' (continuar) y el usuario está en el primer paso, valida si se puede avanzar
   * llamando a shouldNavigate$(). Si la validación es exitosa, avanza al siguiente paso y actualiza el estado;
   * de lo contrario, permanece en el paso actual. Para otros pasos, simplemente avanza al siguiente paso.
   * Si la acción no es 'cont', retrocede al paso anterior.
   *
   * Este método actualiza los índices y notifica al wizard para reflejar el cambio de paso en la interfaz.
   */
  private proceedNavigation(): void {
    if (this.accionSeleccionada === 'cont') {
      if (this.indice === 1) { 
          this.shouldNavigate$()
        .subscribe((shouldNavigate) => {
          if (shouldNavigate) {
            this.indice = this.nextIndex;
            this.datosPasos.indice = this.nextIndex;
            this.wizardService.cambio_indice(this.nextIndex);
            this.wizardComponent.siguiente();
          } else {
            this.indice = this.currentIndex;
            this.datosPasos.indice = this.currentIndex;
          }
        });
      } else {
        this.indice = this.nextIndex;
        this.datosPasos.indice = this.nextIndex;
        this.wizardService.cambio_indice(this.nextIndex);
        this.wizardComponent.siguiente();
      }
    } else {
      this.indice = this.nextIndex;
      this.datosPasos.indice = this.nextIndex;
      this.wizardComponent.atras();
    }
  }

  /**   * @method cerrarModal
   * @description
   * Maneja el cierre del modal de alerta y actualiza el estado según la respuesta del usuario.
   * @param {boolean} value - Indica si se confirmó la acción (true) o se canceló (false).
   */
  public cerrarModal(value: boolean): void {
    this.mostrarAlerta = false;
    if (value) {
      this.isPeligro = false;
      this.isPaymentRequired = false;
      this.proceedNavigation();
    } else {
      this.isPaymentRequired = true;
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
   * Verifica si se debe navegar al siguiente paso.
   * Realiza una llamada para guardar los datos y determina si la navegación es exitosa.
   * @returns {Observable<boolean>} Observable que emite true si se debe navegar, false en caso contrario.
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
        this.sharedSvc.guardarDatosPost(PAYLOAD,this.idProcedimiento.toString()).subscribe({
          next: (response) => {
            const RESPONSE = doDeepCopy(response);
            if (esValidObject(RESPONSE) && esValidObject(RESPONSE['datos'])) {
              const DATOS = RESPONSE['datos'] as { id_solicitud?: number };
              if (getValidDatos(DATOS.id_solicitud)) {
                this.guardarIdSolicitud = DATOS.id_solicitud ?? 0;
                this.store.setIdSolicitud(DATOS.id_solicitud ?? 0);
              } else {
                this.store.setIdSolicitud(0);
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
   * Método que se ejecuta cuando el componente se destruye.
   * Cancela las suscripciones activas y libera recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
