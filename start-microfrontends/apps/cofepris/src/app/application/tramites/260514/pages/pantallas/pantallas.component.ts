import { AVISO, AccionBoton } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnInit, ViewChild, inject } from '@angular/core';
import { DatosPasos,ERROR_FORMA_ALERT, ListaPasosWizard, Notificacion, PASOS, WizardComponent, WizardService, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { MENSAJE_DE_VALIDACION, MENSAJE_DE_VALIDACION_PAGO_DERECHOS, MSG_REGISTRO_EXITOSO } from '../../constantes/datos.enum';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import { Solicitud260514State, Tramite260514Store } from '../../../../estados/tramites/260514/tramite260514.store';
import { DatosComponent} from '../datos/datos.component';
import { DatosDomicilioService } from '../../services/permiso-importacion.service';
import { PANTA_PASOS } from '@ng-mf/data-access-user';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { Shared260514Service } from '../../services/260514-payload.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite260514Query } from '../../../../estados/queries/260514/tramite260514.query';

/**
 * @component PantallasComponent
 * @description
 * Componente principal para gestionar el flujo de pasos en el wizard del trámite 260514.
 * Permite la navegación entre diferentes pantallas/pasos utilizando el componente Wizard.
 * Controla el índice del paso actual y los datos necesarios para la navegación.
 * 
 * @selector app-pantallas
 * @templateUrl ./pantallas.component.html
 * @styleUrl ./pantallas.component.scss
 */
@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
  styleUrl: './pantallas.component.scss',
})
export class PantallasComponent implements OnInit {

   /**
     * Referencia al componente `DatosComponent`.
     */
  @ViewChild('datosRef') pasoUnoComponent!:DatosComponent ;
  // @ViewChild(DatosComponent) pasoUnoComponent!:DatosComponent ;

    /**
   * @property pantallasPasos
   * @type {ListaPasosWizard[]}
   * @description
   * Lista de pasos del wizard, obtenida desde una constante.
   */
  public pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;
 
    /**
   * @property indice
   * @type {number}
   * @default 1
   * @description
   * Índice del paso actual en el wizard.
   */
  public indice: number = 1;

   isSaltar: boolean = false;
   
    MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;
    public confirmarSinPagoDeDerechos: number = 0;
    public requiresPaymentData: boolean = false;
   
    /**
     * Lista de pasos del asistente.
     * Se obtiene de una constante definida en otro archivo.
     */
    pasos: ListaPasosWizard[] = PASOS;
  

  public esFormaValido: boolean = false;

  public formErrorAlert = ERROR_FORMA_ALERT;

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
* Controla la visibilidad del modal de alerta.
* @property {boolean} mostrarAlerta
*/
  public mostrarAlerta: boolean = false;

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
   */
  idSolicitudState: number | null = 0;


  /**
   * @property wizardComponent
   * @type {WizardComponent}
   * @description
   * Referencia al componente Wizard para controlar la navegación entre pasos.
   */
  @ViewChild(WizardComponent) public wizardComponent!: WizardComponent;

  @ViewChild(PagoDeDerechosContenedoraComponent) pagoDerechosRef!: PagoDeDerechosContenedoraComponent;
  
 
   /**
     * @property wizardService
     * @description
     * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
     * @type {WizardService}
     */
      wizardService = inject(WizardService);
  

  /**
   * @property datosPasos
   * @type {DatosPasos}
   * @description
   * Datos utilizados para el control del wizard, como el número de pasos, el índice actual y los textos de los botones.
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

    public solicitudState!: Solicitud260514State;
  
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

  /** Nueva notificación relacionada con el RFC. */
    public seleccionarFilaNotificacion!: Notificacion;

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  public isContinuarTriggered: boolean = false;

/**
   * Indica si se debe mostrar un mensaje de peligro.
   */
  public isPeligro: boolean = false;
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
     * @property {string} infoAlert
     * @description
     * Clase CSS para aplicar estilos a los mensajes de información.
     */
    public infoAlert = 'alert-info  text-center';
  
     /**
       * Folio temporal de la solicitud.
       * Se utiliza para mostrar el folio en la notificación de éxito.
       */
       public alertaNotificacion!: Notificacion;
    

  /**
     * Constructor que inyecta los servicios necesarios para el componente.
     * - toastrService: Servicio para mostrar notificaciones al usuario.
     * - service: Servicio específico para operaciones del permiso de vegetales y nutrientes.
     * - store: Manejador del estado del trámite 260514.
     * - Shared260514Service: Servicio compartido para lógica común del trámite 2605.
     * - query: Fuente de datos reactiva para observar el estado de la solicitud.
     */
    constructor(
      private toastrService: ToastrService,
      private service: DatosDomicilioService,
      private store: Tramite260514Store,
      private shared260514Service: Shared260514Service,
      private query: Tramite260514Query
    ) {}
  
      /** Se ejecuta al inicializar el componente y suscribe al estado de la solicitud. */
  ngOnInit(): void {
    this.query.selectSolicitud$
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((data) => {
      this.solicitudState = data;
      this.isContinuarTriggered = this.solicitudState['continuarTriggered'] ?? false;
    });
  }


  /**
   * @method getValorIndice
   * @description
   * Actualiza el índice del paso y maneja la navegación hacia adelante o atrás en el wizard.
   * Si la acción es 'cont', avanza al siguiente paso; en caso contrario, retrocede.
   * Solo actualiza si el valor está dentro del rango de pasos válidos.
   * 
   * @param {AccionBoton} e - Objeto que contiene el valor del paso y la acción a realizar.
   * @returns {void}
   */
  
    getValorIndice(e: AccionBoton): void {
     this.nextIndex =
        e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
        e.valor;

    this.accionSeleccionada = e.accion;
    this.currentIndex = e.valor;
 
      if (this.indice === 1 && e.accion === 'cont') {
          this.store.setContinuarTriggered(true);

      const ES_VALIDO = this.validarFormulariosPasoActual();

      if (!ES_VALIDO) {
        this.isPeligro = true; 
        this.confirmarSinPagoDeDerechos = 2;
        return
      } else if(ES_VALIDO && this.pasoUnoComponent.validarFormulariosBanco() && !this.isPaymentRequired){
          this.isPeligro = false;
          this.proceedNavigation();
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
        const ES_PAGO_DERECHOS_VALIDO = this.pasoUnoComponent.validarFormulariosBanco();
        if (ES_PAGO_DERECHOS_VALIDO) {
          this.isPeligro = false;
          this.proceedNavigation();
        } else {
          this.isPeligro = true;
        }
      }
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
  
    /**
   * Maneja la lógica para actualizar el índice del paso del wizard según el evento del botón de acción proporcionado.
   *
   * Este método obtiene el estado actual desde `nuevoProgramaIndustrialService`, lo guarda,
   * y muestra un mensaje de éxito o error dependiendo del código de respuesta. Si la respuesta es exitosa
   * y el valor del evento está dentro del rango válido (1 a 4), actualiza el índice del wizard y navega
   * hacia adelante o atrás según el tipo de acción.
   *
   * @param e - El evento del botón de acción que contiene el valor y el tipo de acción.
   */
    private shouldNavigate$(): Observable<boolean> {
      return this.shared260514Service.getAllState().pipe(
        take(1),
        switchMap(data => this.guardar(data)),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((response: any) => {
          const OK = response.codigo === '00';
          if (OK) {
            const DATOS = response.datos as { id_solicitud?: number };
            const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
            this.folioTemporal = ID_SOLICITUD;
            this.toastrService.success(response.mensaje);
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
          } else {
            this.toastrService.error(response.mensaje);
          }
          return OK;
        })
      );
    }
      /**
       * Guarda los datos proporcionados enviándolos al servidor mediante el servicio `nuevoProgramaIndustrialService`.
       *
       * @param data - Los datos que se desean guardar y enviar al servidor.
       * @returns void
       */
      guardar(data: Record<string, unknown>): Promise<unknown> {
        const PAYLOAD = this.shared260514Service.buildPayload(data, 260514);
        return new Promise((resolve, reject) => {
          this.service.guardarDatosPost(PAYLOAD).subscribe({
            next: (response) => {
              if (esValidObject(response) && esValidObject(response['datos'])) {
                const DATOS = response['datos'] as { id_solicitud?: number };
                if (getValidDatos(DATOS.id_solicitud)) {
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
     * Valida los formularios del paso actual antes de permitir continuar.
     * @returns {boolean} - `true` si los formularios son válidos, `false` en caso contrario.
     */
    validarFormulariosPasoActual(): boolean {
      if (this.indice === 1) {
        return this.pasoUnoComponent?.validOnButtonClick() ?? true;
      }
      return true;
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
      this.confirmarSinPagoDeDerechos = 4;
    }
  }

   static generarAlertaDeError(mensajes: string): string {
    const ALERTA = `
      <div class="row">
        <div class="col-md-12 justify-content-center text-center">
          <div class="row">
            <div class="col-md-12">
              <p>Corrija los siguientes errores:</p>
              <ol>
                <li>${mensajes}</li>
              </ol>
            </div>
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
