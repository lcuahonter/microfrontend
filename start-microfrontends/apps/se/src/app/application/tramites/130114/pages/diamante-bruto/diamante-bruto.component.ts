import { AVISO, DatosPasos, JSONResponse, ListaPasosWizard, Notificacion, WizardComponent, doDeepCopy, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { CALCULATE_ALERT_ERROR, FORM_ERROR_ALERT, MSG_REGISTRO_EXITOSO, PASOS_EXPORTACION } from '../../constants/constants/diamante-bruto.enum';
import { Component, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { Tramite130114State, Tramite130114Store } from '../../../../estados/tramites/tramite130114.store';
import { AccionBoton } from '../../enums/diamante.enum';
import { DiamanteBrutoService } from '../../services/diamante-bruto.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite130114Query } from '../../../../estados/queries/tramite130114.query';

/**
 * Componente que representa el flujo de pasos para el trámite de exportación de diamantes brutos.
 * Este componente utiliza un asistente (wizard) para guiar al usuario a través de los pasos necesarios.
 */
@Component({
  selector: 'app-diamante-bruto',
  templateUrl: './diamante-bruto.component.html',
})
export class DiamanteBrutoComponent implements OnDestroy {
  /**
  * @property {object} TEXTOS - Contiene constantes relacionadas con aviso y firma.
  * Se utiliza para manejar textos estáticos en la aplicación.
  */
  public TEXTOS = {
    AVISO,
  };

  /**
   * Lista de pasos que se deben completar en el asistente.
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
   * Índice del paso actual en el asistente.
   */
  indice: number = 1;

  /**
   * Índice de la pestaña activa en la interfaz.
   */
  tabIndex: number = 1;

  /**
   * Referencia al componente del asistente (wizard) para controlar la navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
  * @description
  * Sujeto para manejar la destrucción del componente y evitar fugas de memoria.
  */
  private destroyed$ = new Subject<void>();

  /**
   * Datos relacionados con los pasos del asistente, como el número total de pasos
   * y los textos de los botones de navegación.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @description
   * Folio temporal asignado de manera provisional mientras se genera
   * o se obtiene el folio definitivo del trámite o solicitud.
   *
   * Este valor inicia en 0 y se actualiza conforme avanza el proceso,
   * permitiendo identificar temporalmente la operación en curso.
   *
   * @type {number}
   */
  folioTemporal: number = 0;

  /**
   * Referencia al componente `PasoUnoComponent`.
   * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
   */
  @ViewChild(PasoUnoComponent, { static: false }) pasoUnoComponent!: PasoUnoComponent;

  /**
* Indica si el botón para cargar archivos está habilitado.
*/
  activarBotonCargaArchivos: boolean = false;

  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  esFormaValido: boolean = false;

  /**
   * @property {Tramite130114State} solicitudState
   * @description
   * Estado actual de la solicitud del trámite 130114.
   */
  solicitudState!: Tramite130114State;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = FORM_ERROR_ALERT;

  /**
   * Referencia a la función generadora de mensajes de error relacionados
   * con el proceso de cálculo.
   */
  public CALCULATE_ALERT_ERROR = CALCULATE_ALERT_ERROR;

  /**
     * Folio temporal de la solicitud.
     * Se utiliza para mostrar el folio en la notificación de éxito.
     */
  public alertaNotificacion!: Notificacion;

  /**
      * Constante que almacena el valor de la nota de privacidad.
      * 
      * @constant AVISO_PRIVACIDAD_ADJUNTAR - Almacena el valor definido en `NOTA.AVISO_PRIVACIDAD_ADJUNTAR`.
      * Se utiliza para adjuntar o gestionar el aviso de privacidad dentro del sistema.
      */
  AVISO_PRIVACIDAD_ADJUNTAR = AVISO.Aviso;

  /**
    * Evento que se emite para cargar archivos.
    * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
    */
  cargarArchivosEvento = new EventEmitter<void>();

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
   * @description
   * Constructor del componente.  
   * 
   * Inicializa los servicios y stores necesarios para la gestión del trámite
   * 130114. Además, se suscribe al observable `selectSolicitud$` del query
   * para mantener actualizado el estado de la solicitud durante el ciclo
   * de vida del componente.
   *
   * @param {DiamanteBrutoService} diamanteBrutoService  
   * Servicio encargado de las operaciones relacionadas con diamante bruto.
   *
   * @param {Tramite130114Store} tramite130114Store  
   * Store utilizado para manejar el estado global del trámite 130114.
   *
   * @param {Tramite130114Query} tramite130114Query  
   * Query que permite consultar y suscribirse a cambios en el estado del trámite.
   *
   * @param {ToastrService} toastrService  
   * Servicio de notificaciones para mostrar mensajes al usuario.
   */
  constructor(private diamanteBrutoService: DiamanteBrutoService, private tramite130114Store: Tramite130114Store, private tramite130114Query: Tramite130114Query, private toastrService: ToastrService) {
    this.tramite130114Query.selectSolicitud$.pipe(takeUntil(this.destroyed$)).subscribe((solicitudState) => {
      this.solicitudState = solicitudState;
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
      const ISVALID = this.pasoUnoComponent?.solicitudComponent?.validarFormulario();
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
    this.diamanteBrutoService.getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data, e);
      });
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
  guardar(item: Tramite130114State, e: AccionBoton): Promise<JSONResponse> {
    const PAYLOAD = this.diamanteBrutoService.guardarPayloadDatos(item) as Record<string, unknown>;

    return new Promise((resolve, reject) => {
      let shouldNavigate = false;
      this.diamanteBrutoService.guardarDatosPost(PAYLOAD).subscribe(
        (response) => {
          this.esFormaValido = false;
          if (response.codigo === '3') {
            this.esFormaValido = true;
            this.formErrorAlert = this.CALCULATE_ALERT_ERROR((response as unknown as { error: string })['error'] || '');
          }
          shouldNavigate = response.codigo === '00';
          if (shouldNavigate) {
            const API_RESPONSE = doDeepCopy(response);
            if (
              esValidObject(API_RESPONSE) &&
              esValidObject(API_RESPONSE.datos)
            ) {
              if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
                this.folioTemporal = API_RESPONSE.datos.idSolicitud || API_RESPONSE.datos.id_solicitud;
                this.tramite130114Store.actualizarEstado({ idSolicitud: API_RESPONSE.datos.id_solicitud });
              } else {
                this.tramite130114Store.actualizarEstado({ idSolicitud: 0 });
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
  * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
  * Limpia los recursos y restablece el estado del store asociado al trámite 130114.
  */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.tramite130114Store.resetStore();
  }
}

