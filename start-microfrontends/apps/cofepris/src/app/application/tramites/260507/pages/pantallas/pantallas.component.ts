import { AccionBoton, DatosPasos, ListaPasosWizard, Notificacion, PASOS, WizardComponent, WizardService, doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnInit, ViewChild, inject } from '@angular/core';
import { Observable, map, switchMap, take } from 'rxjs';
import { Solicitud260507State, Tramite260507Store } from '../../../../estados/tramites/260507/tramite260507.store';
import { AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/aviso-privacidad.enum';
import { DatosComponent } from '../datos/datos.component';
import { MENSAJE_DE_VALIDACION_PAGO_DERECHOS } from '../../../../shared/constantes/pago-de-derechos.enum';
import { Shared2605Service } from '../../../../shared/services/shared2605/shared2605.service';
import { TEXTO_DE_PELIGRO } from '../../constantes/importacion-plafest.enum';
import { ToastrService } from 'ngx-toastr';
import { Tramite260507Query } from '../../../../estados/queries/260507/tramite260507.query';


/**
 * Componente principal para la gestión de pantallas en el wizard de cupos.
 */
@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
  styles: ``
})
export class PantallasComponent implements OnInit {
  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  public idProcedimiento: number = 260507;
  /** Identificador numérico para guardar la solicitud.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  public guardarIdSolicitud: number = 0;
  /**
   * Lista de pasos del wizard.
   * @type {ListaPasosWizard[]}
   */
  public pantallasPasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual.
   * @type {number}
   * @default 1
   */
  public indice: number = 1;
  /**
   * Referencia al componente `PasoUnoComponent`.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: DatosComponent;
  /**
   * 
   * Una cadena que representa la clase CSS para una alerta de información.
   * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
   */
  public infoAlert = 'alert-info';
   /**
   * Indica si se debe mostrar un mensaje de peligro.
   */
  public isPeligro: boolean = false;

  /** Texto de advertencia que se muestra cuando hay condiciones peligrosas. */
  public textoPeligro: string = TEXTO_DE_PELIGRO;
  /**
   * Asigna el aviso de privacidad simplificado al atributo `TEXTOS`.
   */
  TEXTOS = AVISO.Aviso;

  /**
   * Referencia al componente Wizard para controlar la navegación entre pasos.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent)
  public wizardComponent!: WizardComponent;

  /**
   * Datos utilizados para el control del wizard.
   * @type {DatosPasos}
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

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
   * @property wizardService
   * @description
   * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
   * @type {WizardService}
   */
    wizardService = inject(WizardService);
    /**
    * Estado local que representa la solicitud actual.
    */
    public solicitudState!: Solicitud260507State;

    /**
     * Indica si se debe mostrar el componente secundario o sección específica en la vista.
     * Se utiliza para controlar la visibilidad dinámica de componentes en el flujo del wizard.
     */
    public shwComponent: boolean = false; 

    /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  public isContinuarTriggered: boolean = false;
  /** 
   * Objeto que agrupa las propiedades relacionadas con la validación del pago de derechos. 
   */
  public paymentInfoRequiredObj = {
    mostrarAlerta: false,
    isFormValid: false,
    isPaymentRequired: false,
    currentIndex: 0,
    accionSeleccionada: '',
    nextIndex: 0,
    seleccionarFilaNotificacion: {} as Notificacion
  }

  /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;

  /**
   * @param sharedSvc Servicio compartido para funcionalidades comunes.
   * @param toastrService Servicio para mostrar notificaciones tipo toast.
   * @param store Store para gestionar el estado del trámite 260507.
   * @param query Query para acceder al estado del trámite 260507.
   */
  constructor(
        private sharedSvc: Shared2605Service,
        private toastrService: ToastrService,
        private store: Tramite260507Store,
        private query: Tramite260507Query
  ) {}


  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de la solicitud para mantener el estado local actualizado.
   * {void} No retorna ningún valor.
   */
  ngOnInit(): void {
    this.query.selectSolicitud$.pipe().subscribe((data) => {
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
   this.paymentInfoRequiredObj.isFormValid = isValid;
  }

  /**
   * Actualiza el índice del paso y maneja la navegación hacia adelante o atrás.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor del paso y la acción a realizar.
   * @returns {void}
   */
  getValorIndice(e: AccionBoton): void {
      this.shwComponent = true;
     this.paymentInfoRequiredObj.nextIndex =
        e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
        e.valor;
 
    this.paymentInfoRequiredObj.accionSeleccionada = e.accion;
    this.paymentInfoRequiredObj.currentIndex = e.valor;
    if (this.indice === 1 && e.accion === 'cont') {
      this.store.setContinuarTriggered(true); 
      setTimeout(() => {
      const ES_VALIDO = this.validarFormulariosPasoActual();
      if (!ES_VALIDO) {
        this.isPeligro = true;
        return;
      }
      this.isPeligro = false;
      if (ES_VALIDO && !this.paymentInfoRequiredObj.mostrarAlerta && !this.paymentInfoRequiredObj.isPaymentRequired) {
        this.paymentInfoRequiredObj.mostrarAlerta = true;
        this.isPeligro = true; 
        this.paymentInfoRequiredObj.seleccionarFilaNotificacion = {
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
      if (this.paymentInfoRequiredObj.isPaymentRequired) {
        const ES_PAGO_DERECHOS_VALIDO = this.pasoUnoComponent.validarPagoDerechos();
        if (ES_PAGO_DERECHOS_VALIDO) {
          this.isPeligro = false;
          this.proceedNavigation();
        } else {
          this.isPeligro = true;
        }
      }
       }, 1000);
    } else {
      this.proceedNavigation();
    }
  }

  private proceedNavigation(): void {
      if (this.paymentInfoRequiredObj.accionSeleccionada === 'cont') {
        if (this.indice === 1) {
            this.shouldNavigate$()
          .subscribe((shouldNavigate) => {
            if (shouldNavigate) {
              this.indice = this.paymentInfoRequiredObj.nextIndex;
              this.datosPasos.indice = this.paymentInfoRequiredObj.nextIndex;
              this.wizardService.cambio_indice(this.paymentInfoRequiredObj.nextIndex);
              this.wizardComponent.siguiente();
            } else {
              this.indice = this.paymentInfoRequiredObj.currentIndex;
              this.datosPasos.indice = this.paymentInfoRequiredObj.currentIndex;
            }
          });
        } else {
          this.indice = this.paymentInfoRequiredObj.nextIndex;
          this.datosPasos.indice = this.paymentInfoRequiredObj.nextIndex;
          this.wizardService.cambio_indice(this.paymentInfoRequiredObj.nextIndex);
          this.wizardComponent.siguiente();
        }
      } else {
        this.indice = this.paymentInfoRequiredObj.nextIndex;
        this.datosPasos.indice = this.paymentInfoRequiredObj.nextIndex;
        this.wizardComponent.atras();
      }
  }

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
   * Valida los formularios del paso actual antes de permitir continuar.
   * @returns {boolean} - `true` si los formularios son válidos, `false` en caso contrario.
   */
  validarFormulariosPasoActual(): boolean {
    if (this.indice === 1) {
      return this.pasoUnoComponent?.validarFormularios() ?? true;
    }
    return true;
  }

  /**   * @method cerrarModal
   * @description
   * Maneja el cierre del modal de alerta y actualiza el estado según la respuesta del usuario.
   * @param {boolean} value - Indica si se confirmó la acción (true) o se canceló (false).
   */
  public cerrarModal(value: boolean): void {
    this.paymentInfoRequiredObj.mostrarAlerta = false;
    if (value) {
      this.isPeligro = false;
      this.paymentInfoRequiredObj.isPaymentRequired = false;
      this.proceedNavigation();
    } else {
      this.paymentInfoRequiredObj.isPaymentRequired = true;
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
}