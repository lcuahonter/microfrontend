import { AVISO, ListaPasosWizard, Notificacion, PASOS, WizardService,doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild,inject } from '@angular/core';
import { MENSAJE_DE_VALIDACION, MSG_REGISTRO_EXITOSO, TEXTO_DE_PELIGRO } from '../../constantes/permiso-pruebas-nutrientes.enum';
import { Observable, Subject, map,switchMap, take, takeUntil } from 'rxjs';
import { Solicitud260510State, Tramite260510Store } from '../../../../shared/estados/stores/260510/tramite260510.store';
import { DatosDomicilioLegalService } from '../../../../shared/services/datos-domicilio-legal.service';
import { DatosDomicilioLegalState } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { MENSAJE_DE_VALIDACION_PAGO_DERECHOS } from '../../../../shared/constantes/pago-de-derechos.enum';
import { PagoBancoService } from '../../../../shared/services/pago-banco.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Shared2605Service } from '../../../../shared/services/shared2605/shared2605.service';
import { SolicitudPagoBancoState } from '../../../../shared/estados/stores/pago-banco.store';
import { TercerosFabricanteService } from '../../../../shared/services/terceros-fabricante.service';
import { TercerosFabricanteState } from '../../../../shared/estados/stores/terceros-fabricante.store';
import { ToastrService } from 'ngx-toastr';
import { Tramite260510Query } from '../../../../shared/estados/queries/260510/tramite260510.query';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';

interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * Componente principal para la gestión de plaguicidas.
 * Contiene la lógica y la estructura del asistente de plaguicidas.
 */
@Component({
  selector: 'app-plaguicidas',
  templateUrl: './plaguicidas.component.html',
})
export class PlaguicidasComponent implements OnInit,OnDestroy{
  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  public isContinuarTriggered: boolean = false;
  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  public idProcedimiento: number = 260510;
   /**
   * Referencia al componente `PasoUnoComponent`.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;
  /** Identificador numérico para guardar la solicitud.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  public guardarIdSolicitud: number = 0;
  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();
  /**
   * @property wizardService
   * @description
   * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
   * @type {WizardService}
   */
    wizardService = inject(WizardService);
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
   * Lista de pasos del asistente.
   * Se obtiene de una constante definida en otro archivo.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Indice actual del paso en el asistente.
   * Se inicializa en 1.
   */
  indice: number = 1;

  /**
   * Título del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud260510State;

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

    /** Nueva notificación relacionada con el RFC. */
      public seleccionarFilaNotificacion!: Notificacion;

         /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;

  /**
   * Título del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
 /**
   * Indica si se debe mostrar un mensaje de peligro.
   */
  public isPeligro: boolean = false;

  /** Texto de advertencia que se muestra cuando hay condiciones peligrosas. */
  public textoPeligro: string = TEXTO_DE_PELIGRO;
  /** 
   * Objeto que contiene información sobre la necesidad de pago y la validez del formulario. 
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

formErrorAlert:string = MENSAJE_DE_VALIDACION;

 /**
     * Clase CSS para mostrar una alerta de error.
     */
    infoError = 'alert-danger text-center';


 /**
       * Folio temporal de la solicitud.
       * Se utiliza para mostrar el folio en la notificación de éxito.
       */
       public alertaNotificacion!: Notificacion;

/**   * Crea una instancia del componente PlaguicidasComponent.
   * @param datosDomicilioLegalService Servicio para gestionar los datos del domicilio legal.
   * @param pagoBancoService Servicio para gestionar los datos de pago en banco.
   * @param tercerosFabricanteService Servicio para gestionar los datos de terceros fabricantes.
   * @param _store Almacén para gestionar el estado del trámite 260510.
   * @param toastrService Servicio para mostrar notificaciones tipo toast.
   */
constructor(
  private datosDomicilioLegalService: DatosDomicilioLegalService,
  private pagoBancoService:PagoBancoService,
  private tercerosFabricanteService:TercerosFabricanteService,
  private _store: Tramite260510Store,
  private toastrService: ToastrService,
  private _sharedSvc: Shared2605Service,
  private _query: Tramite260510Query
) {
  
}


/**   * Inicializa el componente y suscribirse a los cambios en el estado de la solicitud.
   */
  ngOnInit(): void {
    this._query.selectSolicitud$.pipe().subscribe((data) => {
      this.solicitudState = data;
       this.isContinuarTriggered = this.solicitudState['continuarTriggered'] ?? false;
    });
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
   * Actualiza el estado local de validez del formulario.
   * Este método recibe el valor emitido por el componente hijo.
   * Se utiliza para saber si el formulario es válido o no desde el componente principal.
   */
  onFormValidityChange(isValid: boolean):void {
   this.paymentInfoRequiredObj.isFormValid = isValid;
  }

/**
   * Notificador para destruir observables al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Maneja la acción del botón en el asistente.
   * Cambia el paso actual según la acción del botón.
   *
   * @param e - Objeto que contiene la acción y el valor del botón.
   */
getValorIndice(e: AccionBoton): void {
    this.paymentInfoRequiredObj.nextIndex =
        e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
        e.valor;
 
    this.paymentInfoRequiredObj.accionSeleccionada = e.accion;
    this.paymentInfoRequiredObj.currentIndex = e.valor;
    if (this.indice === 1 && e.accion === 'cont') {
       this._store.setContinuarTriggered(true);
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
    } else {
      this.proceedNavigation();
      }
  }

/**   
 * Procede con la navegación al siguiente o anterior paso según la acción seleccionada.
  */
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
   * Verifica si se debe navegar al siguiente paso del asistente.
   * Guarda los datos actuales y muestra notificaciones según el resultado.
   * @return {Observable<boolean>} Observable que emite true si se debe navegar, false en caso contrario.
   */
  private shouldNavigate$(): Observable<boolean> {
      return this._sharedSvc.getAllState().pipe(
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
     * Método que obtiene el estado de los datos del domicilio legal desde el servicio
     * `datosDomicilioLegalService` y los asigna a la propiedad `datosDomicilioLegal`.
     * 
     * @returns {void} Este método no retorna ningún valor.
     */
    
  
    getDatosDomicilioLegalState(): DatosDomicilioLegalState {
      let PAYLOAD={} as DatosDomicilioLegalState;
       this.datosDomicilioLegalService.getDatosDomicilioLegalState()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state) => {
           PAYLOAD = state;
          
        });
        return PAYLOAD;
    }
  
    /**
 * Recupera el estado de la "Solicitud Pago Banco" desde el servicio y lo procesa.
 * 
 * Este método se suscribe al observable `getSolicitudPagoBancoState` del `pagoBancoService`,
 * filtra las propiedades del objeto de estado que tengan valores de cadena vacía, null o undefined,
 * y registra la carga resultante en la consola.
 * 
 * La suscripción se cancela automáticamente cuando el observable `destroyNotifier$` emite un valor,
 * lo que garantiza una limpieza adecuada de los recursos.
 * 
 * @returns {void} Este método no retorna ningún valor.
 */
    getSolicitudPagoBancoState():SolicitudPagoBancoState{
      let PAYLOAD={} as SolicitudPagoBancoState;
      this.pagoBancoService.getSolicitudPagoBancoState()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((state) => {
           PAYLOAD = state;
        });
        return PAYLOAD;
    }
    /**
 * Recupera el estado de "Terceros Fabricante" desde el servicio y lo procesa.
 * 
 * Este método se suscribe al observable `getTercerosFabricanteState` del `tercerosFabricanteService`,
 * asigna el estado recibido al objeto `PAYLOAD` y retorna dicho objeto.
 * 
 * La suscripción se cancela automáticamente cuando el observable `destroyNotifier$` emite un valor,
 * lo que garantiza una limpieza adecuada de los recursos.
 * 
 * @returns {TercerosFabricanteState} El estado de "Terceros Fabricante".
 */
    getTercerosFabricanteState():TercerosFabricanteState{
      let PAYLOAD={} as TercerosFabricanteState;
      this.tercerosFabricanteService.getTercerosFabricanteState()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((state) => {
           PAYLOAD = state;
        }); 
        return PAYLOAD;
    }

    /**
     * Guarda los datos proporcionados enviándolos al servidor mediante el servicio `shared2605Service`.
     * @param data - Los datos que se desean guardar y enviar al servidor.
     * @returns {Promise<unknown>} Promesa que se resuelve con la respuesta del servidor.
     */
  public guardar(data: Record<string, unknown>): Promise<unknown> {
     const PAYLOAD = this._sharedSvc.buildPayload(data, this.idProcedimiento);
      return new Promise((resolve, reject) => {
        this._sharedSvc.guardarDatosPost(PAYLOAD,this.idProcedimiento.toString()).subscribe({
          next: (response) => {
            const RESPONSE = doDeepCopy(response);
            if (esValidObject(RESPONSE) && esValidObject(RESPONSE['datos'])) {
              const DATOS = RESPONSE['datos'] as { id_solicitud?: number };
              if (getValidDatos(DATOS.id_solicitud)) {
                this.guardarIdSolicitud = DATOS.id_solicitud ?? 0;
                this._store.setIdSolicitud(DATOS.id_solicitud ?? 0);
                if(this.indice > 0 && this.indice < 5){
                    this.alertaNotificacion = {
                            tipoNotificacion: 'banner',
                            categoria: 'success',
                            modo: 'action',
                            titulo: '',
                            mensaje: MSG_REGISTRO_EXITOSO(String(this.guardarIdSolicitud)),
                            cerrar: true,
                            txtBtnAceptar: '',
                            txtBtnCancelar: '',
                          };
                }
              } else {
                this._store.setIdSolicitud(0);
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
   * @method cerrarModal
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
 * Lógica de limpieza para cancelar la suscripción a los observables cuando el componente es destruido.
 */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }
}
