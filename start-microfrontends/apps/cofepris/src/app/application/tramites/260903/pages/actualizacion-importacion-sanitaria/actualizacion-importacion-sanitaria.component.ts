import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { PERMISO_MAQUILA } from '../../constantes/actualizacion-importacion-sanitaria.enum';

import { AVISO, DatosPasos, ListaPasosWizard, Notificacion, RegistroSolicitudService, WizardComponent, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { MENSAJE_DE_VALIDACION, MENSAJE_DE_VALIDACION_PAGO_DERECHOS, TITULOMENSAJE } from '../../constantes/psicotropicos-poretorno.enum';
import { Tramite260903State, Tramite260903Store } from '../../estados/tramite260903.store';
import { Datos260903Component } from '../datos-260903/datos-260903.component';

import { GuardarAdapter_260903 } from '../../adapters/guardar-payload.adapter';
import { ToastrService } from 'ngx-toastr';
import { Tramite260903Query } from '../../estados/tramite260903.query';

import { DatosDomicilioLegalState, DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DomicilioState, DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import { Subject, takeUntil } from 'rxjs';
import { DatosDelSolicituteSeccionQuery } from '../../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { DatosDomicilioLegalQuery } from '../../../../shared/estados/queries/datos-domicilio-legal.query';
import { DomicilioQuery } from '../../../../shared/estados/queries/domicilio.query';
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

@Component({
  selector: 'app-actualizacion-importacion-sanitaria',
  templateUrl: './actualizacion-importacion-sanitaria.component.html',
})
export class ActualizacionImportacionSanitariaComponent implements OnInit {
  /**
 * Clase CSS para mostrar una alerta de error.
 */
  infoError = 'alert-danger text-center';
  /**
  * Estado de la solicitud actual.
  *
  * @type {Tramite260903State}
  * @memberof SolicitudPageComponent
  */
  idTipoTRamite: string = '260903';

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
   */
  idSolicitudState: number | null = 0;

  storeData!: Tramite260903State;
  /**
   * Referencia al componente del asistente (wizard) para controlar sus acciones.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
      * @property {Datos260903Component} datos260903Component
      * @description
      * Referencia al componente hijo `datos260903Component` mediante
      * `@ViewChild`. Permite acceder a sus métodos y propiedades
      * desde este componente padre.
    */
  @ViewChild(Datos260903Component) datos260903Component!: Datos260903Component;
  /**
     * Esta variable se utiliza para almacenar la lista de pasos.
     */
  pantallasPasos: ListaPasosWizard[] = PERMISO_MAQUILA;

  /**
   * Esta variable se utiliza para almacenar el índice del paso.
   */
  indice: number = 1;

  cargarArchivosEvento = new EventEmitter<void>();

  /**
     * Indica si la carga de archivos está en progreso.
     */
  cargaEnProgreso: boolean = true;

  activarBotonCargaArchivos: boolean = false;
  /**
      * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
      */
  public formErrorAlert!: string;
  /**
  * @property {string} MENSAJE_DE_ERROR
  * @description
  * Propiedad usada para almacenar el mensaje de error actual.
  * Se inicializa como cadena vacía y se actualiza en función
  * de las validaciones o errores capturados en el flujo.
  */
  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;
  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

  public requiresPaymentData: boolean = false;

  public confirmarSinPagoDeDerechos: number = 0;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

  /**
  * @property {boolean} isSaltar
  * @description
  * Indica si se debe saltar al paso de firma. Controla la navegación
  * directa al paso de firma en el wizard.
  * @default false - No salta por defecto
  */
  isSaltar: boolean = false;


  TEXTOS: string = AVISO.Aviso;
  /**
   *
   * Una cadena que representa la clase CSS para una alerta de información.
   * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
   */
  public infoAlert = 'alert-info';

  /**
  * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
  */
  esFormaValido: boolean = false;

  /**
   * Acción del botón presionado en el wizard.
   */
  accionDelBoton!: AccionBoton;

  /**
   * Folio temporal de la solicitud.
   */
  public folioTemporal: number = 0;

   /**
     * @property {DatosDelSolicituteSeccionState} datosDelSolicitud
     * @description Estado de la tienda para los datos de la solicitud.
     */
    datosDelSolicitud!: DatosDelSolicituteSeccionState


    
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
    private tramite260903Query: Tramite260903Query,
    public registroSolicitudService: RegistroSolicitudService,
    private toastrService: ToastrService,
    private tramite260903Store: Tramite260903Store,
    private GuardarAdapter_260903: GuardarAdapter_260903,
    private datosDelSolicituteSeccionQuery: DatosDelSolicituteSeccionQuery,
    private datosDelSolicituteSeccionStore: DatosDelSolicituteSeccionStateStore,
    private manifestoQuery: DatosDomicilioLegalQuery,
    private manifestoStore: DatosDomicilioLegalStore,
    private domicilioQuery: DomicilioQuery,
    private domicilioStore: DomicilioStore,) {}



 ngOnInit(): void {
    this.tramite260903Query.selectTramite260903$.pipe(
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

  cerrarModal(value: boolean): void {
    if (value) {
      this.mostrarAlerta = false;
      this.requiresPaymentData = true;
    } else {
      this.mostrarAlerta = false;
      this.confirmarSinPagoDeDerechos = 4;
    }
  }

  /**
   * @method getValorIndice
   * @description Controla la navegación del wizard según el botón presionado (anterior o continuar).
   * También actualiza el título correspondiente al paso actual.
   *
   * @param e - Objeto de tipo `AccionBoton` que contiene la acción a realizar y el valor asociado.
   */
  // eslint-disable-next-line complexity
  getValorIndice(e: AccionBoton): void {
    this.accionDelBoton = e;
    if (e.accion === 'cont') {
      if (this.indice === 1 && this.datos260903Component) {
        const IS_VALID = this.datos260903Component.validarFormularios();
        
        const DATOS_MODIFICACION = this.datos260903Component.datosdelmodificacion?.formularioSolicitudValidacion() ?? false;
        const MANIFESTOS = this.datos260903Component.manifiestosDeclaraciones?.validarClickDeBoton() ?? false;
        const REPRESENTANTE_LEGAL = this.datos260903Component.representeLegal?.validarClickDeBoton() ?? false;

        if (!this.requiresPaymentData) {
          if (!this.datos260903Component.pagoDeDerechosContenedoraComponent.validarContenedor()) {
            this.mostrarAlerta = true;
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
              alineacionBtonoCerrar: 'flex-row-reverse'

            }
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            return;
          } else if (!DATOS_MODIFICACION && !MANIFESTOS && !REPRESENTANTE_LEGAL) {
            this.confirmarSinPagoDeDerechos = 2;
          }
          else if (!this.datos260903Component.tercerosRelacionadosVistaComponent.validarContenedor()) {
            this.confirmarSinPagoDeDerechos = 3;
          }
          else if (this.datos260903Component.pagoDeDerechosContenedoraComponent.validarContenedor() && 
                   (DATOS_MODIFICACION && MANIFESTOS && REPRESENTANTE_LEGAL) && 
                   this.datos260903Component.tercerosRelacionadosVistaComponent.validarContenedor()) {
            this.guardarDatosApi(e);
            return;
          }
        }

        if (!IS_VALID || !DATOS_MODIFICACION || !MANIFESTOS || !REPRESENTANTE_LEGAL ||
            (this.datos260903Component.pagoDeDerechosContenedoraComponent &&
             this.datos260903Component.pagoDeDerechosContenedoraComponent.isAnyFieldFilledButNotAll())) {
          this.formErrorAlert = this.MENSAJE_DE_ERROR;
          this.esFormaValido = true;
          this.datosPasos.indice = this.indice;
          this.confirmarSinPagoDeDerechos = 2;
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          return;
        }
        else if (IS_VALID && this.requiresPaymentData) {
          this.esFormaValido = false;
          this.guardarDatosApi(e);
          return;
        }
        else if (!this.datos260903Component.validarFormularios()) {
          this.esFormaValido = false;
          if (this.datos260903Component.pagoDeDerechosContenedoraComponent.continuarButtonClicked) {
            this.formErrorAlert = this.MENSAJE_DE_ERROR;
            this.esFormaValido = true;
          }
          this.indice = 1;
          this.datosPasos = {
            ...this.datosPasos,
            indice: 1,
          };
          return;
        }

        // Additional validations
        if (!this.datos260903Component.tercerosRelacionadosVistaComponent.validarContenedor()) {
          this.confirmarSinPagoDeDerechos = 3;
          return;
        }
        else if (!this.datos260903Component.pagoDeDerechosContenedoraComponent.validarContenedor() && 
                 !this.requiresPaymentData) {
          this.confirmarSinPagoDeDerechos = 4;
          return;
        }
        
        // If all validations pass, proceed to save
        this.guardarDatosApi(e);
      }
    }
    else {
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.atras();
    }
  }

  /**
   * @method guardarDatosApi
   * @description Guarda los datos del trámite mediante API y maneja la navegación del wizard
   * @param {AccionBoton} e - Objeto que contiene la acción y valor del botón
   */
  guardarDatosApi(e: AccionBoton): void {
    const PAYLOAD = GuardarAdapter_260903.toFormPayload(this.storeData, this.datosDelSolicitud, this.manifestoState, this.domicilioState);
    let shouldNavigate = false;
    this.registroSolicitudService.postGuardarDatos('260903', PAYLOAD).subscribe(response => {
      shouldNavigate = response.codigo === '00';
      if (!shouldNavigate) {
        const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
        this.formErrorAlert = ActualizacionImportacionSanitariaComponent.generarAlertaDeError(ERROR_MESSAGE);
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
          this.folioTemporal = ID_SOLICITUD;
          this.tramite260903Store.setIdSolicitud(ID_SOLICITUD);
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
     * @method obtenerNombreDelTítulo
     * @description Devuelve el título correspondiente al paso actual.
     * @param {number} valor - Índice del paso.
     * @returns {string} Título del paso.
     */
  static obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return TITULOMENSAJE;
      case 2:
        return 'Cargar archivos';
      case 3:
        return 'Firmar';
      default:
        return TITULOMENSAJE;
    }
  }
  public static generarAlertaDeError(mensajes: string): string {
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

}
