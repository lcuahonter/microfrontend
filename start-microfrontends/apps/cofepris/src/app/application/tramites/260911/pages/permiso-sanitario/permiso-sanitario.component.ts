
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDomicilioLegalState, DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DatosPasos, ListaPasosWizard, Notificacion, PASOS, RegistroSolicitudService, WizardComponent, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { DomicilioState, DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import { MENSAJE_DE_VALIDACION, MENSAJE_DE_VALIDACION_PAGO_DERECHOS } from '../../constantes/constantes.enum';
import { Tramite260911State,Tramite260911Store } from '../../estados/tramite260911.store';
import { AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/aviso-privacidad.enum';
import { GuardarAdapter_260911 } from '../../adapters/guardar-payload.adapter';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite260911Query } from '../../estados/tramite260911.query';
import { takeUntil } from 'rxjs/operators';

import { DatosDelSolicituteSeccionQuery } from '../../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { DatosDomicilioLegalQuery } from '../../../../shared/estados/queries/datos-domicilio-legal.query';
import { DomicilioQuery } from '../../../../shared/estados/queries/domicilio.query';
import { Subject } from 'rxjs';

// import { Notificacion, RegistroSolicitudService, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { FormGroup } from '@angular/forms';

import { DatosDeLaSolicitudComponent } from '../../component/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DomicilioDelEstablecimientoComponent } from '../../component/domicilio-del-establecimiento/domicilio-del-establecimiento.component';
import { PagoDeDerechosComponent } from '../../component/pago-de-derechos/pago-de-derechos.component';
import { TercerosRelacionadosVistaComponent } from '../../component/terceros-relacionados/terceros-relacionados-vista.component';
import { TramitesAsociadoComponent } from '../../component/tramites-asociado/tramites-asociado.component';


/**
 * Interfaz que representa una acción de botón en el asistente.
 * @property accion Tipo de acción realizada (por ejemplo, 'cont' para continuar).
 * @property valor Valor asociado a la acción, generalmente el índice del paso.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * Componente principal para la gestión del Permiso Sanitario.
 * Controla el flujo del asistente de pasos, validaciones y la interacción con los subcomponentes.
 */
@Component({
  selector: 'app-permiso-sanitario',
  templateUrl: './permiso-sanitario.component.html',
  styleUrls: ['./permiso-sanitario.component.scss']
})
export class PermisoSanitarioComponent implements OnInit, OnDestroy {
/**
 * Propiedad que almacena el estado del store relacionado con el trámite 260911,
 * permitiendo mantener y acceder a la información de manera reactiva.
 */
storeData!: Tramite260911State;

/**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
cargarArchivosEvento = new EventEmitter<void>();

/**
  * Evento para regresar a la sección de carga de documentos.
  * @type {EventEmitter<void>}
  */
regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

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
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

   /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

  public formErrorAlert!: string;

  /**
   * @property {string} MENSAJE_DE_ERROR
   * @description
   * Propiedad usada para almacenar el mensaje de error actual.
   * Se inicializa como cadena vacía y se actualiza en función
   * de las validaciones o errores capturados en el flujo.
   */
  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;

  esFormaValido: boolean = false;

  /**
   * @property {DatosDelSolicituteSeccionState} datosDelSolicitud
   * @description Estado de la tienda para los datos de la solicitud.
   */
  datosDelSolicitud!: DatosDelSolicituteSeccionState;

  /**  * @property {DatosDomicilioLegalState} manifestoState
   * @description Estado de la tienda para los datos del domicilio legal.
   */
  manifestoState!: DatosDomicilioLegalState;

  /**  * @property {DomicilioState} domicilioState
   * @description Estado de la tienda para los datos del domicilio.
   * */
  domicilioState!: DomicilioState;

     /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
   */
  idSolicitudState: number | null = 0;

/**
 * Subject utilizado para notificar la destrucción del componente,
 * permitiendo cancelar suscripciones y liberar recursos.
 */
  destroyNotifier$: Subject<void> = new Subject();

  
  /** Lista de pantallas de pasos del wizard */
  pantallasPasos: ListaPasosWizard[] = PASOS;

  /** Referencia al componente wizard para controlar la navegación */
  @ViewChild('wizard') wizardComponent!: WizardComponent;
  
 /** Referencia al componente del primer paso del formulario */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  /** Índice actual del paso en el wizard (iniciando en 1) */
  indice: number = 1;
  
  /** Índice de la subpestaña actual dentro del paso */
  subTabIndex: number = 1;
  
  /** Bandera para controlar la visibilidad del botón anterior */
  ocultarBtnAnterior: boolean = false;
  
  /** Bandera para mostrar u ocultar el modal de confirmación de pago */
  showPaymentModal: boolean = false;
  
  /** Almacena el último evento de continuar para procesarlo después del modal */
  public lastContinueEvent: AccionBoton | null = null;
  
  /** Mensaje de error o información para mostrar al usuario */
  message: string | undefined;

  /** Configuración de datos para el componente de pasos del wizard */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /** Bandera que indica si ya se intentó validar los campos de pago */
  hasTriedPagoValidation: boolean = false; 

  /** Constante para el aviso de privacidad */
  AVISO_DE_PRIVACIDAD = AVISO.Aviso;

  /**
   * Constructor del componente.
   * @param cdr - Servicio de detección de cambios de Angular
   * @param tramite260911Store - Store de estado específico para el trámite 260911
   */
  constructor(
    public tramite260911Store: Tramite260911Store,
    public registroSolicitudService: RegistroSolicitudService,
    private toastrService: ToastrService,
    private Tramite260911Query: Tramite260911Query,
    private datosDelSolicituteSeccionQuery: DatosDelSolicituteSeccionQuery,
    private datosDelSolicituteSeccionStore: DatosDelSolicituteSeccionStateStore,
    private manifestoQuery: DatosDomicilioLegalQuery,
    private manifestoStore: DatosDomicilioLegalStore,
    private domicilioQuery: DomicilioQuery,
    private domicilioStore: DomicilioStore,
) {}


  ngOnInit(): void {
    this.Tramite260911Query.selectTramite260911$.pipe().subscribe((data) => {
      this.storeData = data;
    });

    this.datosDelSolicituteSeccionQuery.selectSolicitud$.pipe(
      takeUntil(this.destroyNotifier$))
    .subscribe((data) => {
      this.datosDelSolicitud = data;
    });
    
    this.manifestoQuery.selectSolicitud$.pipe(
      takeUntil(this.destroyNotifier$))
    .subscribe((state) => {
      this.manifestoState = state;
    });
    this.domicilioQuery.selectSolicitud$.pipe(
      takeUntil(this.destroyNotifier$))
    .subscribe((state) => {
        this.domicilioState = state;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.registroSolicitudService.parcheOpcionesPrellenadas(260911, 202902906).subscribe((res:any) => {
      if(res && res.datos){
        GuardarAdapter_260911.patchToStore(res.datos, this.tramite260911Store);
        GuardarAdapter_260911.patchToStoreDatosSolicitud(res.datos, this.datosDelSolicituteSeccionStore);
        GuardarAdapter_260911.patchToStoreManifestos(res.datos, this.manifestoStore);
        GuardarAdapter_260911.patchToStoreDomicilio(res.datos, this.domicilioStore);
      }
    });
  }

  /**
   * Maneja la navegación entre pasos y subpestañas basado en la acción del botón.
   * @param e - Objeto que contiene la acción y valor para la navegación
   */
    getValorIndice(e: AccionBoton): void {
      if (e.accion === 'cont') {
        let isValid = true;
    
        if (this.indice === 1 && this.pasoUnoComponent) {
          isValid = this.pasoUnoComponent.validarPasoUno();
        }
    
        if(!this.pasoUnoComponent.validarContenedor() && this.requiresPaymentData) {
          this.confirmarSinPagoDeDerechos = 2;
        }else {
          this.confirmarSinPagoDeDerechos = 3;
        }
    
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
          } else if(this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() && !this.pasoUnoComponent?.validarContenedor()) {
            this.confirmarSinPagoDeDerechos = 2;
          } else if(this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() && this.pasoUnoComponent?.validarContenedor() && !this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
            this.confirmarSinPagoDeDerechos = 3;
          }
        }
    
        if (!isValid) {
          this.formErrorAlert = this.MENSAJE_DE_ERROR;
          this.esFormaValido = true;
          this.datosPasos.indice = this.indice;
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          return;
        }
    
        const PAYLOAD = GuardarAdapter_260911.toFormPayload(this.storeData, this.datosDelSolicitud, this.manifestoState, this.domicilioState );
        let shouldNavigate = false;
        this.registroSolicitudService.postGuardarDatos('260911', PAYLOAD).subscribe(response => {
          shouldNavigate = response.codigo === '00';
          if (!shouldNavigate) {
            const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
            this.formErrorAlert = PermisoSanitarioComponent.generarAlertaDeError(ERROR_MESSAGE);
            this.esFormaValido = true;
            this.indice = 1;
            this.datosPasos.indice = 1;
            this.wizardComponent.indiceActual = 1;
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            return;
          }
          if(shouldNavigate) {
            if(esValidObject(response) && esValidObject(response.datos)) {
              this.esFormaValido = false;
              const DATOS = response.datos as { id_solicitud?: number };
              const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
              this.tramite260911Store.setIdSolicitud(ID_SOLICITUD);
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
      }else{
        this.indice = e.valor;
        this.datosPasos.indice = this.indice;
        this.wizardComponent.atras();
      }
    }

/**
 * Genera el contenido HTML de una alerta de error mostrando los mensajes recibidos,
 * con un formato visual centrado para su despliegue en la interfaz.
 */
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
   * Maneja el evento cuando se limpian los campos de pago.
   * Resetea la bandera de validación de pago.
   */
  // public onPagoFieldsCleared(): void {
  //   this.hasTriedPagoValidation = false;
  // }

  /**
   * Maneja el cambio de pestaña en el componente del paso uno.
   * @param tabIndex - Índice de la nueva pestaña seleccionada
   */
//  public onPasoUnoTabChanged(tabIndex: number): void {
//   this.subTabIndex = tabIndex;
//   this.updateAnteriorButtonVisibility();
//   this.datosPasos.txtBtnSig = 'Continuar';
//   this.showPaymentModal = false;
//   this.lastContinueEvent = null;
//   const PAGO_DE_DERECHOS_COMPONENT = this.pasoUnoComponent?.getPagoDeDerechosComponent();
//   if (PAGO_DE_DERECHOS_COMPONENT) {
//     PAGO_DE_DERECHOS_COMPONENT.mostrarErroresDeCampoPago = false;
//   }
// }

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

/**
 * Actualiza el estado de carga del componente según el valor recibido,
 * permitiendo controlar indicadores de proceso en ejecución.
 */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  cerrarModal(value:boolean): void {
    if(value){
    this.mostrarAlerta = false;
    this.requiresPaymentData = true;
    } else {
      this.mostrarAlerta = false;
      this.confirmarSinPagoDeDerechos = 4;
    }
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
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}