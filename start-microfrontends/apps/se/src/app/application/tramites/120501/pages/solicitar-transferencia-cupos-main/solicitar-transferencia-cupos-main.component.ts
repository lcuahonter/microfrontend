import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosPasos, JSONResponse, ListaPasosWizard, Notificacion, PASOS, WizardComponent, doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { MSG_ERROR_REGISTRO, MSG_REGISTRO_EXITOSO } from '../../constantes/cupos-constantes.enum';
import { Solicitud120501State, Tramite120501Store } from '../../estados/tramites/tramite120501.store';
import { Subject, take, takeUntil } from 'rxjs';
import { LicitacionesDisponiblesService } from '../../services/licitaciones-disponibles.service';
import { PasoSolicitanteComponent } from '../paso-solicitante/paso-solicitante.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite120501Query } from '../../estados/queries/tramite120501.query';
/**
 *  AccionBoton
 *  Interfaz que describe la estructura de un objeto de acción de botón.
 */
interface AccionBoton {
  /** Acción a realizar */
  accion: string;
  /** Valor asociado a la acción */
  valor: number;
}

/**
 * 
 *  app-solicitar-transferencia-cupos-main
 * ./solicitar-transferencia-cupos-main.component.html
 *  Componente para manejar la solicitud de transferencia de cupos.
 */
@Component({
  selector: 'app-solicitar-transferencia-cupos-main',
  templateUrl: './solicitar-transferencia-cupos-main.component.html',
})
export class SolicitarTransferenciaCuposMainComponent implements OnInit, OnDestroy {
  /**
    * Notificador para destruir los observables y evitar posibles fugas de memoria.
    * @private
    * @type {Subject<void>}
    */
  destroyNotifier$: Subject<void> = new Subject();
  /**
   * {ListaPasosWizard[]} pasosSolicitar
   *  Arreglo que contiene los pasos del wizard.
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS;
  /**
   * {string} LOGIN
   *  Login del usuario actual.
   */
  LOGIN: string = "";
  /**
   * {number} indice
   *  Índice actual del wizard.
   */
  indice: number = 1;
  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  esFormaValido: boolean = false;

  /**
   * Identificador numérico del mecanismo seleccionado.
   * 
   * @remarks
   * Este valor se utiliza para determinar el mecanismo actual en uso dentro del componente.
   * 
   * @defaultValue 0
   */
  idMecanismo: number = 0;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = MSG_ERROR_REGISTRO;

  /**
     * Identificador numérico de la solicitud actual.
     * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
     */
  solicitudState!: Solicitud120501State;

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
   * Indica si la carga de documentos está en progreso.
   * Se inicializa en true para indicar que la carga está en progreso al inicio.
   */
  cargaEnProgreso: boolean = true;

  /**
   * {string} texto
   *  Texto informativo sobre la solicitud.
   */
  texto: string = 'La solicitud ha quedado registrada con el número temporal 202758644. Este no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.';

  /**
   * {WizardComponent} wizardComponent
   *  Referencia al componente 'WizardComponent'.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * {PasoSolicitanteComponent} pasoUnoComponent
   *  Referencia al componente 'PasoSolicitanteComponent'.
   */
  @ViewChild(PasoSolicitanteComponent, { static: false }) pasoUnoComponent!: PasoSolicitanteComponent;

  /**
      * Folio temporal de la solicitud.
      * Se utiliza para mostrar el folio en la notificación de éxito.
      */
  public alertaNotificacion!: Notificacion;

  /**
   * {number} folioTemporal
   *  Folio temporal de la solicitud.
   */
  folioTemporal: number = 0;
  /**
   * {DatosPasos} datosPasos
   *  Objeto que contiene los datos de los pasos del wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Constructor para la clase SolicitarTransferenciaCuposMainComponent.
   * @param tramiteQuery 
   * 
   */
  constructor(private tramiteQuery: Tramite120501Query, private tramite120501Store: Tramite120501Store, private toastrService: ToastrService, public licitacionesDisponiblesService: LicitacionesDisponiblesService) {
    this.tramiteQuery.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
        this.idMecanismo = this.solicitudState['idMecanismo'] as number;
      });
  }

  /**
   * Hook de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe a los cambios en la solicitud del trámite y actualiza el estado local.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });
  }

  /**
     * Método para actualizar el índice del paso actual en el asistente.
     * También navega al siguiente o al paso anterior según la acción especificada.
     *
     * Objeto de tipo `AccionBoton` que contiene:
     *  - `valor`: El nuevo índice del paso.
     *  - `accion`: La acción a realizar ('cont' para continuar o 'ant' para retroceder).
     */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      const ISVALID = this.pasoUnoComponent?.LicitacionesVigentesComponent?.validarFormulario();
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
      this.obtenerDatosDelStore(e);
    } else if (e.valor > 0 && e.valor <= this.pasosSolicitar.length) {
      this.pasoNavegarPor(e);
    }
  }

  /**
      * Obtiene los datos del store y los guarda utilizando el servicio.
      */
  obtenerDatosDelStore(e: AccionBoton): void {
    this.licitacionesDisponiblesService.getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data, e);
      });
  }

  /**
 * Obtiene el valor del índice de la acción del botón.
 * @param e Acción del botón.
 */
  pasoNavegarPor(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
     * Guarda los datos proporcionados en el parámetro `item` construyendo un objeto payload y enviándolo al servicio backend.
     * El payload incluye información del solicitante, certificado, destinatario y detalles del certificado.
     *
     * @param item - Objeto que contiene todos los datos necesarios para el payload, incluyendo información del certificado, destinatario y detalles adicionales.
     *
     * @remarks
     * Este método muestra el payload construido en la consola y está diseñado para enviarlo al backend mediante `certificadoService.guardarDatosPost`.
     * La llamada al servicio actualmente está comentada.
     */
  guardar(item: Solicitud120501State, e: AccionBoton): Promise<JSONResponse> {
    const PAYLOAD = this.licitacionesDisponiblesService.getGuardarPayload(item);
    return new Promise((resolve, reject) => {
      let shouldNavigate = false;
      this.licitacionesDisponiblesService.guardarDatosPost(PAYLOAD).subscribe(
        (response) => {
          shouldNavigate = response.codigo === '00';
          if (shouldNavigate) {
            const API_RESPONSE = doDeepCopy(response);
            if (
              esValidObject(API_RESPONSE) &&
              esValidObject(API_RESPONSE.datos)
            ) {
              if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
                this.folioTemporal = API_RESPONSE.datos.idSolicitud || API_RESPONSE.datos.id_solicitud;
                this.tramite120501Store.actualizarEstado({ idSolicitud: API_RESPONSE.datos.id_solicitud });
              } else {
                this.tramite120501Store.actualizarEstado({ idSolicitud: 0 });
              }
              if (e.valor > 0 && e.valor < 5) {
                this.indice = e.valor;

                if (e.valor > 0 && e.valor < 5) {
                  this.indice = e.valor;
                  if (e.accion === 'cont') {
                    this.wizardComponent.siguiente();
                    if (e.valor > 0 && e.valor < 5) {
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

                    }
                  } else {
                    this.wizardComponent.atras();
                  }
                }
              }
            }
            this.toastrService.success(response.mensaje);
            resolve(response);
          } else {
            this.toastrService.error(response.mensaje);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * Navega al paso anterior en el asistente.
   * {void} No retorna ningún valor.
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
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

  /**
   *  Método para manejar el evento de carga en progreso.
   * @param carga Indica si la carga está en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * Método para navegar al siguiente paso en el asistente.
   * {void} No retorna ningún valor.
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }


  /**
  * Hook de ciclo de vida de Angular que se ejecuta al destruir el componente.
  *
  * Su objetivo es limpiar los recursos utilizados durante la vida del componente,
  * principalmente las suscripciones a observables.
  * Para lograrlo, emite un valor (`next()`) y completa (`complete()`)
  * el `Subject` `destroyNotifier$`, el cual se usa junto con `takeUntil`
  * en las suscripciones RxJS.
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}