import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDomicilioLegalState, DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DatosPasos, ListaPasosWizard, Notificacion, RegistroSolicitudService, WizardComponent, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { DomicilioState, DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import { MENSAJE_DE_VALIDACION, MENSAJE_DE_VALIDACION_PAGO_DERECHOS } from '../../enums/certificados.enum';
import { Subject, takeUntil } from 'rxjs';
import { Tramite260912Store, Tramites260912State } from '../../estados/tramite-260912.store';
import { DatosDelSolicituteSeccionQuery } from '../../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { PERMISO_MAQUILA } from '../../modelos/modificación-del-permiso-sanitario-de-importación-de-insumo.model';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Tramite260912Query } from '../../estados/tramite-260912.query';

import { DatosDomicilioLegalQuery } from '../../../../shared/estados/queries/datos-domicilio-legal.query';
import { DomicilioQuery } from '../../../../shared/estados/queries/domicilio.query';
import {GuardarAdapter_260912} from '../../adapters/guardar-payload.adapter';
import { ToastrService } from 'ngx-toastr';

/**
 * Interfaz que define la estructura de un botón de acción
 * @interface AccionBoton
 */
interface AccionBoton {
  /** Tipo de acción a realizar (ej: 'cont' para continuar, 'atras' para retroceder) */
  accion: string;
  /** Valor numérico que representa el índice del paso */
  valor: number;
}

/**
 * Componente principal para la gestión del trámite de Permiso Sanitario.
 * Maneja la navegación entre pasos mediante un wizard y controla el flujo
 * de información del usuario a través de múltiples pantallas.
 * 
 * @export
 * @class PermisoSanitarioComponent
 */
@Component({
  selector: 'app-permiso-sanitario',
  templateUrl: './permiso-sanitario.component.html',
})
export class PermisoSanitarioComponent implements OnInit, OnDestroy {
 /**
 * Propiedad que almacena el estado del store relacionado con el trámite 260912,
 * permitiendo mantener y acceder a la información de manera reactiva.
 */
storeData!: Tramites260912State;
  
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

  /** Lista de pantallas de pasos del wizard */
  pantallasPasos: ListaPasosWizard[] = PERMISO_MAQUILA;

  /** Referencia al componente wizard para controlar la navegación */
  @ViewChild('wizard') wizardComponent!: WizardComponent;
  
  /** Referencia al componente del primer paso del formulario */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  /** Índice actual del paso en el wizard (iniciando en 1) */
  indice: number = 1;

  /**
   * @property {boolean} requiresPaymentData
   * @description
   * Indica si se requieren datos de pago para continuar con el trámite.
   */
  public requiresPaymentData: boolean = false;

  /** Configuración de datos para el componente de pasos del wizard */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /** Bandera que indica si ya se intentó validar los campos de pago */
  hasTriedPagoValidation: boolean = false;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert!: string;

  /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   * 
   */
  esFormaValido: boolean = false;

   /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;

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

  /**
   * @property {string} MENSAJE_DE_ERROR
   * @description
   * Propiedad usada para almacenar el mensaje de error actual.
   * Se inicializa como cadena vacía y se actualiza en función
   * de las validaciones o errores capturados en el flujo.
   */
  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;

  /**
   * @property {DatosDelSolicituteSeccionState} datosDelSolicitud
   * @description Estado de la tienda para los datos de la solicitud.
   */
  datosDelSolicitud!: DatosDelSolicituteSeccionState;

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
   */
  idSolicitudState: number | null = 0;

  /**  * @property {DatosDomicilioLegalState} manifestoState
   * @description Estado de la tienda para los datos del domicilio legal.
   */
  manifestoState!: DatosDomicilioLegalState;

  /**  * @property {DomicilioState} domicilioState
   * @description Estado de la tienda para los datos del domicilio.
   * */
  domicilioState!: DomicilioState;

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
 * Indica si el botón para cargar archivos está habilitado.
 */
  activarBotonCargaArchivos: boolean = false;

/**
 * Subject utilizado para notificar la destrucción del componente,
 * permitiendo cancelar suscripciones y liberar recursos.
 */
  destroyNotifier$: Subject<void> = new Subject();

/**
 * Inicializa el componente inyectando los stores, queries y servicios necesarios
 * para la gestión del trámite, datos del solicitante, domicilio y notificaciones.
 */
  constructor(
    public Tramite260912Store: Tramite260912Store,
    public Tramite260912Query: Tramite260912Query,
    private toastrService: ToastrService,
    public registroSolicitudService: RegistroSolicitudService,
    private datosDelSolicituteSeccionStore: DatosDelSolicituteSeccionStateStore,
    private datosDelSolicituteSeccionQuery: DatosDelSolicituteSeccionQuery,
    private manifestoQuery: DatosDomicilioLegalQuery,
    private manifestoStore: DatosDomicilioLegalStore,
    private domicilioQuery: DomicilioQuery,
    private domicilioStore: DomicilioStore,
  ) {}

    ngOnInit(): void {
      this.Tramite260912Query.selectTramite260912$.pipe().subscribe((data) => {
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
      this.registroSolicitudService.parcheOpcionesPrellenadas(260912, 202960307).subscribe((res:any) => {
        if(res && res.datos){
          GuardarAdapter_260912.patchToStore(res.datos, this.Tramite260912Store);
          GuardarAdapter_260912.patchToStoreDatosSolicitud(res.datos, this.datosDelSolicituteSeccionStore);
          GuardarAdapter_260912.patchToStoreManifestos(res.datos, this.manifestoStore);
          GuardarAdapter_260912.patchToStoreDomicilio(res.datos, this.domicilioStore);
        }
      });
    }

  /**
   * @descripción
   * Método para actualizar el índice del paso actual basado en la acción y el valor proporcionados.
   *
   * @param e - Objeto de tipo `AccionBoton` que contiene la acción a realizar y el valor asociado.
   * 
   * @detalles
   * - Si el valor está entre 1 y 4 (exclusivo), actualiza el índice.
   * - Si la acción es 'cont', avanza al siguiente paso.
   * - Si la acción no es 'cont', retrocede al paso anterior.
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
    
        const PAYLOAD = GuardarAdapter_260912.toFormPayload(this.storeData, this.datosDelSolicitud, this.manifestoState, this.domicilioState );
        let shouldNavigate = false;
        this.registroSolicitudService.postGuardarDatos('260912', PAYLOAD).subscribe(response => {
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
              this.Tramite260912Store.setIdSolicitud(ID_SOLICITUD);
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
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

/**
 * Actualiza el estado de carga del componente según el valor recibido,
 * permitiendo controlar indicadores de proceso en ejecución.
 */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
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
 * Maneja el cierre del modal actualizando banderas internas según la acción del usuario,
 * definiendo si se requieren datos de pago o se confirma la operación sin pago de derechos.
 */
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
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}