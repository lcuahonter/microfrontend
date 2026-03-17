import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MENSAJE_DE_VALIDACION, MENSAJE_DE_VALIDACION_PAGO_DERECHOS, PERMISO_MAQUILA } from '../../constantes/enmienda-permiso-sanitario.enum';

import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDomicilioLegalState, DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DatosPasos, ListaPasosWizard, Notificacion, RegistroSolicitudService, WizardComponent, esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { DomicilioState, DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import { Subject, takeUntil } from 'rxjs';
import { Tramite260914State, Tramite260914Store } from '../../estados/tramite260914Store.store';
import { Datos260914Component } from '../datos-260914/datos-260914.component';
import { DatosDelSolicituteSeccionQuery } from '../../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { DatosDomicilioLegalQuery } from '../../../../shared/estados/queries/datos-domicilio-legal.query';
import { DomicilioQuery } from '../../../../shared/estados/queries/domicilio.query';
import { GuardarAdapter_260914 } from '../../adapters/guardar-payload.adapter';
import { ToastrService } from 'ngx-toastr';
import { Tramite260914Query } from '../../estados/tramite260914Query.query';
/**
 * Representa una acción que se puede ejecutar mediante un botón.
 * 
 * @property accion - El nombre o tipo de la acción a realizar (por ejemplo, "sumar", "restar").
 * @property valor - El valor asociado a la acción, usado como entrada para ejecutar la acción.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * @descripción
 * Este componente se encarga de gestionar la funcionalidad del asistente (wizard) "Permiso Maquila".
 * Proporciona la lista de pasos del asistente y administra el índice del paso actual.
 */

/**
 * Componente para la gestión de la enmienda del permiso sanitario en el trámite 260914.
 * 
 * Este componente controla el flujo de pasos (wizard) para la enmienda de permisos sanitarios,
 * incluyendo la carga y validación de documentos, manejo de eventos, interacción con el estado
 * de la tienda (store) y comunicación con servicios para el guardado y recuperación de datos.
 * 
 * Funcionalidades principales:
 * - Control de pasos del wizard y navegación entre ellos.
 * - Validación de formularios y documentos requeridos.
 * - Manejo de eventos para carga de archivos y navegación de secciones.
 * - Integración con servicios y stores para la persistencia y recuperación de datos.
 * - Gestión de notificaciones y mensajes de error para el usuario.
 * 
 * @component
 * @selector app-enmienda-permiso-sanitario
 * @template ./enmienda-permiso-sanitario.component.html
 * 
 * @author
 * @version 1.0
 * @since 2024
 */
@Component({
  selector: 'app-enmienda-permiso-sanitario',
  templateUrl: './enmienda-permiso-sanitario.component.html',
})
export class EnmiendaPermisoSanitarioComponent implements OnInit, OnDestroy {
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
   * Referencia al componente del asistente (wizard) para controlar sus acciones.
   */
  @ViewChild('wizard') wizardComponent!: WizardComponent;

  /**
  * @property {PasoUnoComponent} pasoUnoComponent
  * @description
  * Referencia al componente hijo `PasoUnoComponent` mediante
  * `@ViewChild`. Permite acceder a sus métodos y propiedades
  * desde este componente padre.
  */
  @ViewChild(Datos260914Component) pasoUnoComponent!: Datos260914Component;

  /**
     * Esta variable se utiliza para almacenar la lista de pasos.
     */
  pantallasPasos: ListaPasosWizard[] = PERMISO_MAQUILA;

  /**
   * Esta variable se utiliza para almacenar el índice del paso.
   */
  indice = 1;

  /**
   * @property {boolean} requiresPaymentData
   * @description
   * Indica si se requieren datos de pago para continuar con el trámite.
   */
  public requiresPaymentData: boolean = false;

  /**
   * @propiedades
   * - `nroPasos`: Número total de pasos basado en la longitud de `pantallasPasos`.
   * - `indice`: Índice actual del paso.
   * - `txtBtnAnt`: Texto que se muestra en el botón para retroceder al paso anterior.
   * - `txtBtnSig`: Texto que se muestra en el botón para avanzar al siguiente paso.
   *
   * @descripción
   * Objeto que contiene la configuración y estado de los pasos en el flujo de la aplicación.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Indica si la carga de archivos está en progreso.
   */
  cargaEnProgreso: boolean = true;

  /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;

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
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

  /**
   * @property {number} confirmarSinPagoDeDerechos
   * @description
   * Indica si se ha confirmado la continuación sin pago de derechos.
   */
  public confirmarSinPagoDeDerechos: number = 0;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert!:string;

  /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   * }
   */
  esFormaValido: boolean = false;

  /**
   * @property {string} MENSAJE_DE_ERROR
   * @description
   * Propiedad usada para almacenar el mensaje de error actual.
   * Se inicializa como cadena vacía y se actualiza en función
   * de las validaciones o errores capturados en el flujo.
   */
  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;

  /**
   * @property {Tramite260914State} storeData
   * @description Estado de la tienda para el trámite 260914.
   */
  storeData!: Tramite260914State;

  /**
   * @property {DatosDelSolicituteSeccionState} datosDelSolicitud
   * @description Estado de la tienda para los datos de la solicitud.
   */
  datosDelSolicitud!: DatosDelSolicituteSeccionState

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
   * Subject utilizado para notificar la destrucción del componente.
   * Se utiliza con el operador `takeUntil` para cancelar automáticamente
   * las suscripciones activas cuando el componente es destruido, 
   * evitando así posibles fugas de memoria.
   * 
   * @type {Subject<void>}
   * @example
   * ```typescript
   * // Uso típico con takeUntil
   * this.someObservable$.pipe(
   *   takeUntil(this.destroyNotifier$)
   * ).subscribe();
   * ```
   */
  destroyNotifier$: Subject<void> = new Subject();

  constructor(
    private tramite260914Query: Tramite260914Query, 
    private tramite260914Store: Tramite260914Store, 
    private datosDelSolicituteSeccionQuery: DatosDelSolicituteSeccionQuery,
    private datosDelSolicituteSeccionStore: DatosDelSolicituteSeccionStateStore,
    private manifestoQuery: DatosDomicilioLegalQuery,
    private manifestoStore: DatosDomicilioLegalStore,
    private domicilioQuery: DomicilioQuery,
    private domicilioStore: DomicilioStore,
    private registroSolicitudService: RegistroSolicitudService, 
    private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.tramite260914Query.selectTramiteState$.pipe(
      takeUntil(this.destroyNotifier$))
    .subscribe((data) => {
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
    this.registroSolicitudService.parcheOpcionesPrellenadas(260914, 202933347).subscribe((res:any) => {
      if(res && res.datos){
        GuardarAdapter_260914.patchToStore(res.datos, this.tramite260914Store);
        GuardarAdapter_260914.patchToStoreDatosSolicitud(res.datos, this.datosDelSolicituteSeccionStore);
        GuardarAdapter_260914.patchToStoreManifestos(res.datos, this.manifestoStore);
        GuardarAdapter_260914.patchToStoreDomicilio(res.datos, this.domicilioStore);
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
  
      const PAYLOAD = GuardarAdapter_260914.toFormPayload(this.storeData, this.datosDelSolicitud, this.manifestoState, this.domicilioState );
      let shouldNavigate = false;
      this.registroSolicitudService.postGuardarDatos('260914', PAYLOAD).subscribe(response => {
        shouldNavigate = response.codigo === '00';
        if (!shouldNavigate) {
          const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
          this.formErrorAlert = EnmiendaPermisoSanitarioComponent.generarAlertaDeError(ERROR_MESSAGE);
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
            this.idSolicitudState = ID_SOLICITUD;
            this.tramite260914Store.setIdSolicitud(ID_SOLICITUD);
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

  cerrarModal(value:boolean): void {
    if(value){
    this.mostrarAlerta = false;
    this.requiresPaymentData = true;
    if(!this.pasoUnoComponent?.validarContenedor() && this.requiresPaymentData) {
          this.confirmarSinPagoDeDerechos = 2;
        }else {
          this.confirmarSinPagoDeDerechos = 3;
        }
    } else {
      this.mostrarAlerta = false;
      this.confirmarSinPagoDeDerechos = 4;
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
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
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
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
